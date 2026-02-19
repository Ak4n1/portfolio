import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { ChatResponse, ChatService } from '../../../core/services/chat.service';
import { environment } from '../../../../environments/environment';

type ChatRole = 'user' | 'assistant';
type ChatStatus = 'final' | 'thinking' | 'error' | 'cancelled';
type ChatIntent = 'project' | 'stack' | 'experience' | 'contact' | 'general';

interface ChatUiMessage {
  id: string;
  role: ChatRole;
  content: string;
  status: ChatStatus;
}

interface ProjectCardToken {
  title: string;
  image: string;
  link: string;
}

export interface ChatPersistedMessage {
  role: ChatRole;
  content: string;
}

interface ActiveRequest {
  token: number;
  assistantMessageId: string;
  timerId: ReturnType<typeof setTimeout> | null;
  canceled: boolean;
  subscription: Subscription | null;
  rejectPending: ((reason?: unknown) => void) | null;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent implements AfterViewInit, OnChanges {
  private readonly chatService = inject(ChatService);
  private readonly sanitizer = inject(DomSanitizer);

  @Input() seedMessages: ChatPersistedMessage[] | null = null;
  @Input() conversationKey: string | null = null;
  @Output() conversationChange = new EventEmitter<ChatPersistedMessage[]>();

  @ViewChild('messagesViewport') private messagesViewport?: ElementRef<HTMLElement>;

  readonly messages = signal<ChatUiMessage[]>([this.buildWelcomeMessage()]);
  readonly draft = signal('');
  readonly sendError = signal<string | null>(null);
  readonly imagePreviewVisible = signal(false);
  readonly imagePreviewUrl = signal('');
  readonly imagePreviewAlt = signal('Imagen de proyecto');

  readonly isBusy = computed(() => this.activeRequest() !== null);

  private readonly activeRequest = signal<ActiveRequest | null>(null);
  private requestCounter = 0;
  private lastConversationSignature = '';
  private readonly renderedMessageCache = new Map<string, SafeHtml>();

  constructor() {
    effect(() => {
      const messages = this.messages();
      this.emitConversation(messages);
      queueMicrotask(() => this.scrollToBottom());
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['seedMessages']) return;
    this.cancelInFlightRequest();

    const seed = this.seedMessages;
    if (!seed || seed.length === 0) {
      this.messages.set([this.buildWelcomeMessage()]);
      return;
    }

    this.messages.set(seed.map((msg) => ({
      id: this.makeId(),
      role: msg.role,
      content: msg.content,
      status: 'final' as const,
    })));
  }

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  setDraft(value: string): void {
    this.draft.set(value);
  }

  async send(): Promise<void> {
    const message = this.draft().trim();
    if (!message) return;

    this.cancelInFlightRequest();
    this.sendError.set(null);

    this.pushMessage({
      id: this.makeId(),
      role: 'user',
      content: message,
      status: 'final',
    });

    this.draft.set('');

    const intent = this.detectIntent(message);
    const states = this.dynamicStatesFor(message, intent);
    const assistantMessageId = this.makeId();
    this.pushMessage({
      id: assistantMessageId,
      role: 'assistant',
      content: states[0],
      status: 'thinking',
    });

    const request: ActiveRequest = {
      token: ++this.requestCounter,
      assistantMessageId,
      timerId: null,
      canceled: false,
      subscription: null,
      rejectPending: null,
    };
    this.activeRequest.set(request);
    this.startDynamicStateLoop(request, states, 1);

    try {
      const response = await this.fetchAssistantResponse(message, request);
      if (!this.isRequestActive(request.token)) return;
      this.finalizeAssistantMessage(request.assistantMessageId, response);
    } catch {
      if (!this.isRequestActive(request.token)) return;
      this.markAssistantError(
        request.assistantMessageId,
        'No pude completar la respuesta en este momento. Intenta nuevamente.'
      );
      this.sendError.set('Fallo la comunicacion con el backend del chatbot.');
    } finally {
      this.clearActiveRequestIfMatches(request.token);
    }
  }

  onInputKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Enter' || event.shiftKey) return;
    event.preventDefault();
    void this.send();
  }

  onMessagesClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    if (!target) return;
    if (target.tagName.toLowerCase() !== 'img') return;
    if (!target.classList.contains('chat-inline-image') && !target.classList.contains('chat-project-thumb')) {
      return;
    }
    const src = target.getAttribute('src')?.trim() ?? '';
    if (!src) return;
    this.imagePreviewUrl.set(src);
    this.imagePreviewAlt.set(target.getAttribute('alt')?.trim() || 'Imagen de proyecto');
    this.imagePreviewVisible.set(true);
  }

  closeImagePreview(): void {
    this.imagePreviewVisible.set(false);
    this.imagePreviewUrl.set('');
  }

  private fetchAssistantResponse(message: string, request: ActiveRequest): Promise<ChatResponse> {
    return new Promise<ChatResponse>((resolve, reject) => {
      request.rejectPending = reject;
      request.subscription = this.chatService.sendMessage({
        message,
        conversationKey: this.conversationKey ?? undefined,
      }).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
      });
    });
  }

  private detectIntent(rawMessage: string): ChatIntent {
    const message = this.normalize(rawMessage);
    const has = (terms: string[]) => terms.some((term) => message.includes(term));

    if (
      has([
        'proyecto',
        'proyectos',
        'portfolio',
        'portafolio',
        'l2terra',
        'demo',
        'github',
      ])
    ) return 'project';

    if (
      has([
        'stack',
        'tecnologia',
        'tecnologias',
        'framework',
        'backend',
        'frontend',
        'java',
        'spring',
        'angular',
        'typescript',
      ])
    ) return 'stack';

    if (
      has([
        'experiencia',
        'trayectoria',
        'trabajaste',
        'historial',
        'perfil',
        'seniority',
        'actualmente',
      ])
    ) return 'experience';

    if (
      has([
        'contacto',
        'email',
        'linkedin',
        'contratar',
        'contratacion',
        'disponibilidad',
        'cv',
      ])
    ) return 'contact';

    return 'general';
  }

  private dynamicStatesFor(rawMessage: string, intent: ChatIntent): string[] {
    const message = this.normalize(rawMessage);
    const has = (terms: string[]) => terms.some((term) => message.includes(term));

    if (intent === 'project') {
      if (has(['imagen', 'imagenes', 'captura', 'screenshot', 'foto'])) {
        return [
          'Buscando imagen principal del proyecto',
          'Verificando que la imagen sea publica',
          'Preparando vista previa del proyecto',
        ];
      }
      if (has(['actualmente', 'destacado', 'destacados', 'trabajando', 'enfoque'])) {
        return [
          'Revisando proyectos destacados',
          'Validando contexto actual del portafolio',
          'Armando respuesta priorizada por relevancia',
        ];
      }
      return [
        'Revisando proyectos publicados',
        'Extrayendo stack y funcionalidades clave',
        'Preparando resumen tecnico del proyecto',
      ];
    }

    if (intent === 'stack') {
      return [
        'Revisando stack declarado en el portafolio',
        'Contrastando tecnologias con proyectos publicos',
        'Organizando respuesta por categorias tecnicas',
      ];
    }

    if (intent === 'experience') {
      if (has(['actualmente', 'hoy', 'ahora'])) {
        return [
          'Revisando foco actual de trabajo',
          'Contrastando proyectos recientes publicados',
          'Preparando respuesta con contexto temporal',
        ];
      }
      return [
        'Analizando perfil y trayectoria tecnica',
        'Contrastando informacion con proyectos publicados',
        'Preparando respuesta orientada a reclutadores',
      ];
    }

    if (intent === 'contact') {
      if (has(['cv', 'curriculum', 'resume'])) {
        return [
          'Buscando informacion de CV y contacto',
          'Validando enlaces publicos disponibles',
          'Preparando respuesta para oportunidades laborales',
        ];
      }
      return [
        'Verificando disponibilidad laboral',
        'Buscando informacion de contacto',
        'Preparando respuesta de seguimiento',
      ];
    }

    return [
      'Analizando consulta',
      'Procesando informacion disponible',
      'Generando respuesta',
    ];
  }

  private startDynamicStateLoop(request: ActiveRequest, states: string[], nextIndex: number): void {
    if (!this.isRequestActive(request.token)) return;

    const delay = this.randomDelayMs(1400, 2200);
    request.timerId = setTimeout(() => {
      if (!this.isRequestActive(request.token)) return;
      const index = Math.min(nextIndex, states.length - 1);
      this.replaceMessageContent(request.assistantMessageId, states[index], 'thinking');
      if (index < states.length - 1) {
        this.startDynamicStateLoop(request, states, index + 1);
      }
    }, delay);
  }

  private cancelInFlightRequest(): void {
    const current = this.activeRequest();
    if (!current) return;
    current.canceled = true;
    if (current.timerId) clearTimeout(current.timerId);
    current.subscription?.unsubscribe();
    current.rejectPending?.(new Error('request-canceled'));
    this.replaceMessageContent(
      current.assistantMessageId,
      'Consulta interrumpida por una nueva pregunta.',
      'cancelled'
    );
    this.activeRequest.set(null);
  }

  private finalizeAssistantMessage(messageId: string, response: ChatResponse): void {
    this.messages.update((items) =>
      items.map((item) =>
        item.id === messageId
          ? { ...item, content: response.answer, status: 'final' }
          : item
      )
    );
  }

  private markAssistantError(messageId: string, text: string): void {
    this.replaceMessageContent(messageId, text, 'error');
  }

  private replaceMessageContent(messageId: string, content: string, status: ChatStatus): void {
    this.messages.update((items) =>
      items.map((item) =>
        item.id === messageId
          ? { ...item, content, status }
          : item
      )
    );
  }

  private pushMessage(message: ChatUiMessage): void {
    this.messages.update((items) => [...items, message]);
  }

  private isRequestActive(token: number): boolean {
    return this.activeRequest()?.token === token;
  }

  private clearActiveRequestIfMatches(token: number): void {
    const current = this.activeRequest();
    if (!current || current.token !== token) return;
    if (current.timerId) clearTimeout(current.timerId);
    current.subscription?.unsubscribe();
    this.activeRequest.set(null);
  }

  private normalize(value: string): string {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private randomDelayMs(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private makeId(): string {
    return `msg_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
  }

  private buildWelcomeMessage(): ChatUiMessage {
    return {
      id: this.makeId(),
      role: 'assistant',
      content:
        'Hola. Soy el asistente del portafolio de Juan Encabo. Podes preguntarme por proyectos, stack, experiencia o contacto.',
      status: 'final',
    };
  }

  private emitConversation(messages: ChatUiMessage[]): void {
    const persisted = messages
      .filter((msg) => msg.status === 'final')
      .map((msg) => ({ role: msg.role, content: msg.content }));
    const signature = JSON.stringify(persisted);
    if (signature === this.lastConversationSignature) return;
    this.lastConversationSignature = signature;
    this.conversationChange.emit(persisted);
  }

  private scrollToBottom(): void {
    const el = this.messagesViewport?.nativeElement;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }

  formatMessage(content: string): SafeHtml {
    const extracted = this.extractProjectCards(content);
    const escaped = this.escapeHtml(extracted.text);
    const markdownImages = escaped.replace(
      /!\[([^\]]*)\]\(((?:https?:\/\/|\/)[^\s)]+)\)/g,
      (_match, alt: string, url: string) => {
        const rawUrl = this.cleanDetectedUrl(url);
        if (!this.isSafeUrl(rawUrl, true)) {
          return '';
        }
        const src = this.resolveAssetUrl(rawUrl);
        return `<img src="${src}" alt="${alt || 'Imagen de proyecto'}" loading="lazy" class="chat-inline-image" />`;
      }
    );
    const markdownLinks = markdownImages.replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      (_match, text: string, url: string) => {
        const safe = this.cleanDetectedUrl(url);
        if (!this.isSafeUrl(safe, false)) {
          return text;
        }
        return `<a href="${safe}" target="_blank" rel="noopener noreferrer">${text}</a>`;
      }
    );
    const rawLinks = markdownLinks.replace(
      /(^|[\s(>])(https?:\/\/[^\s<"]+)/g,
      '$1<a href="$2" target="_blank" rel="noopener noreferrer">$2</a>'
    );
    const bold = rawLinks.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    const italic = bold.replace(/(^|[^*])\*(?!\s)(.+?)(?<!\s)\*/g, '$1<em>$2</em>');
    const inlineCode = italic.replace(/`([^`]+)`/g, '<code>$1</code>');
    const withHeadings = inlineCode
      .replace(/^###\s+(.+)$/gm, '<h3>$1</h3>')
      .replace(/^##\s+(.+)$/gm, '<h2>$1</h2>')
      .replace(/^#\s+(.+)$/gm, '<h1>$1</h1>');
    let html = withHeadings.replace(/\n/g, '<br>');
    html += this.buildProjectCardsHtml(extracted.cards);
    const cached = this.renderedMessageCache.get(html);
    if (cached) {
      return cached;
    }
    const safeHtml = this.sanitizer.bypassSecurityTrustHtml(html);
    this.renderedMessageCache.set(html, safeHtml);
    return safeHtml;
  }

  private escapeHtml(value: string): string {
    return (value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  private resolveAssetUrl(url: string): string {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    const base = environment.apiBaseUrl.endsWith('/')
      ? environment.apiBaseUrl.slice(0, -1)
      : environment.apiBaseUrl;
    const path = url.startsWith('/') ? url : `/${url}`;
    return `${base}${path}`;
  }

  private cleanDetectedUrl(url: string): string {
    let cleaned = (url ?? '').trim();
    cleaned = cleaned.replace(/[),.;:!?]+$/g, '');
    if (cleaned.endsWith(']')) {
      cleaned = cleaned.slice(0, -1);
    }
    return cleaned;
  }

  private isSafeUrl(url: string, allowRelative: boolean): boolean {
    if (!url) return false;
    if (allowRelative && url.startsWith('/')) return true;
    return /^https?:\/\//i.test(url);
  }

  private extractProjectCards(content: string): { text: string; cards: ProjectCardToken[] } {
    const regex = /\[PROJECT_CARD\s+title="([^"]+)"\s+image="([^"]+)"\s+link="([^"]+)"\]/g;
    const cards: ProjectCardToken[] = [];
    let text = content ?? '';
    let match: RegExpExecArray | null;

    while ((match = regex.exec(content ?? '')) !== null) {
      cards.push({
        title: match[1]?.trim() ?? '',
        image: this.cleanDetectedUrl(match[2] ?? ''),
        link: (match[3] ?? '').trim(),
      });
      text = text.replace(match[0], '');
    }

    return { text: text.trim(), cards };
  }

  private buildProjectCardsHtml(cards: ProjectCardToken[]): string {
    if (!cards.length) return '';

    const blocks = cards
      .filter((card) => card.title && this.isSafeUrl(card.image, true) && this.isSafeUrl(card.link, true))
      .map((card) => {
        const title = this.escapeHtml(card.title);
        const imageSrc = this.resolveAssetUrl(card.image);
        const linkHref = card.link.startsWith('/') ? card.link : this.cleanDetectedUrl(card.link);
        return `
          <div class="chat-project-card">
            <img src="${imageSrc}" alt="${title}" loading="lazy" class="chat-project-thumb" />
            <div class="chat-project-body">
              <strong class="chat-project-title">${title}</strong>
              <a href="${linkHref}" target="_blank" rel="noopener noreferrer" class="chat-project-link">Ver proyecto</a>
            </div>
          </div>
        `;
      })
      .join('');

    return blocks ? `<div class="chat-project-cards">${blocks}</div>` : '';
  }
}
