import { Component, OnInit, HostListener, inject, signal, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChatbotConfigService } from '../../../core/services/chatbot-config.service';
import { ChatProvider, ChatbotConfig, ChatbotProjectOption } from '../../../core/models/chatbot-config.model';
import { ChatService } from '../../../core/services/chat.service';
import { OpenRouterUsageComponent } from './openrouter-usage/openrouter-usage.component';
import { ChatbotAuditComponent } from './chatbot-audit/chatbot-audit.component';

interface PreviewMessage {
  role: 'user' | 'assistant';
  content: string;
}

@Component({
  selector: 'app-dashboard-chatbot-config',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, OpenRouterUsageComponent, ChatbotAuditComponent],
  templateUrl: './dashboard-chatbot-config.component.html',
  styleUrl: './dashboard-chatbot-config.component.css'
})
export class DashboardChatbotConfigComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly chatbotConfigService = inject(ChatbotConfigService);
  private readonly chatService = inject(ChatService);
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  loading = signal(true);
  saving = signal(false);
  loadError = signal<string | null>(null);
  saveError = signal<string | null>(null);
  saveSuccess = signal<string | null>(null);
  testing = signal(false);
  testError = signal<string | null>(null);
  testInput = signal('');
  previewMessages = signal<PreviewMessage[]>([]);
  projectOptions = signal<ChatbotProjectOption[]>([]);
  selectedFocusProjectIds = signal<number[]>([]);
  projectOptionsError = signal<string | null>(null);
  openRouterUsageModalOpen = signal(false);
  helpModalOpen = signal(false);
  systemPromptModalOpen = signal(false);
  stackInput = signal('');
  editingStackIndex = signal<number | null>(null);
  editingStackValue = signal('');
  profileStacks = signal<string[]>([]);
  providerOpen = signal(false);
  activeTab = signal<'config' | 'audit'>('config');

  providerOptions: { value: ChatProvider; label: string }[] = [
    { value: 'OPENROUTER', label: 'OpenRouter' },
    { value: 'OPENAI', label: 'OpenAI' },
    { value: 'ANTHROPIC', label: 'Anthropic' },
  ];

  form = this.fb.nonNullable.group({
    activeProvider: this.fb.nonNullable.control<ChatProvider>('OPENROUTER', { validators: [Validators.required] }),
    enabled: this.fb.nonNullable.control(true),
    openRouterModel: this.fb.nonNullable.control('openai/gpt-4o-mini', [Validators.required, Validators.maxLength(120)]),
    openAiModel: this.fb.nonNullable.control('gpt-4o-mini', [Validators.required, Validators.maxLength(120)]),
    anthropicModel: this.fb.nonNullable.control('claude-3-5-sonnet-latest', [Validators.required, Validators.maxLength(120)]),
    temperature: this.fb.nonNullable.control(0.3, [Validators.required, Validators.min(0), Validators.max(2)]),
    maxTokens: this.fb.nonNullable.control(500, [Validators.required, Validators.min(64), Validators.max(4096)]),
    allowedTopicsCsv: this.fb.nonNullable.control('', [Validators.required, Validators.maxLength(1000)]),
    outOfScopeMessage: this.fb.nonNullable.control('', [Validators.required, Validators.maxLength(1000)]),
    systemPrompt: this.fb.nonNullable.control('', [Validators.required, Validators.maxLength(10000)]),
    currentFocusProjectIdsCsv: this.fb.nonNullable.control('', [Validators.maxLength(1000)]),
    profileStacksCsv: this.fb.nonNullable.control('', [Validators.maxLength(1500)]),
  });

  ngOnInit(): void {
    this.loadConfig();
    this.loadProjectOptions();
  }

  setTab(tab: 'config' | 'audit'): void {
    this.activeTab.set(tab);
  }

  getSelectedProviderLabel(): string {
    const selected = this.form.controls.activeProvider.value;
    return this.providerOptions.find((p) => p.value === selected)?.label ?? selected;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as Node;
    const host = this.elementRef.nativeElement;
    const selectEl = host.querySelector('.provider-select');

    if (selectEl && !selectEl.contains(target)) {
      this.providerOpen.set(false);
    }
  }

  loadConfig(): void {
    this.loading.set(true);
    this.loadError.set(null);

    this.chatbotConfigService.getConfig().subscribe({
      next: (config) => {
        this.form.patchValue(config);
        this.syncSelectedProjectsFromCsv(config.currentFocusProjectIdsCsv);
        this.syncProfileStacksFromCsv(config.profileStacksCsv);
        this.form.markAsPristine();
        this.loading.set(false);
      },
      error: () => {
        this.loadError.set('No se pudo cargar la configuracion del chatbot.');
        this.loading.set(false);
      }
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.saveError.set(null);
    this.saveSuccess.set(null);

    this.form.controls.currentFocusProjectIdsCsv.setValue(this.selectedFocusProjectIds().join(','));
    this.form.controls.profileStacksCsv.setValue(this.profileStacks().join(','));

    const payload = this.form.getRawValue() as ChatbotConfig;
    this.chatbotConfigService.updateConfig(payload).subscribe({
      next: (updated) => {
        this.form.patchValue(updated);
        this.syncSelectedProjectsFromCsv(updated.currentFocusProjectIdsCsv);
        this.syncProfileStacksFromCsv(updated.profileStacksCsv);
        this.form.markAsPristine();
        this.saving.set(false);
        this.saveSuccess.set('Configuracion guardada correctamente.');
      },
      error: () => {
        this.saving.set(false);
        this.saveError.set('No se pudo guardar la configuracion. Revisa datos y conexion.');
      }
    });
  }

  loadProjectOptions(): void {
    this.projectOptionsError.set(null);
    this.chatbotConfigService.getPublicProjectOptions().subscribe({
      next: (items) => this.projectOptions.set(items ?? []),
      error: () => this.projectOptionsError.set('No se pudo cargar la lista de proyectos publicos.'),
    });
  }

  isProjectSelected(projectId: number): boolean {
    return this.selectedFocusProjectIds().includes(projectId);
  }

  toggleFocusProject(projectId: number, checked: boolean): void {
    const current = this.selectedFocusProjectIds();
    if (checked) {
      if (!current.includes(projectId)) {
        this.selectedFocusProjectIds.set([...current, projectId]);
      }
    } else {
      this.selectedFocusProjectIds.set(current.filter((id) => id !== projectId));
    }
    this.form.markAsDirty();
  }

  setTestInput(value: string): void {
    this.testInput.set(value);
  }

  runPreviewChat(): void {
    const message = this.testInput().trim();
    if (!message || this.testing()) return;

    this.testing.set(true);
    this.testError.set(null);
    this.previewMessages.update((prev) => [...prev, { role: 'user', content: message }]);
    this.testInput.set('');

    this.chatService.sendMessage({ message }).subscribe({
      next: (response) => {
        this.previewMessages.update((prev) => [...prev, { role: 'assistant', content: response.answer }]);
        this.testing.set(false);
      },
      error: () => {
        this.testing.set(false);
        this.testError.set('No se pudo probar el chat. Revisa la configuracion y API key del proveedor.');
      }
    });
  }

  openOpenRouterUsageModal(): void {
    this.openRouterUsageModalOpen.set(true);
  }

  closeOpenRouterUsageModal(): void {
    this.openRouterUsageModalOpen.set(false);
  }

  openHelpModal(): void {
    this.helpModalOpen.set(true);
  }

  closeHelpModal(): void {
    this.helpModalOpen.set(false);
  }

  openSystemPromptModal(): void {
    this.systemPromptModalOpen.set(true);
  }

  closeSystemPromptModal(): void {
    this.systemPromptModalOpen.set(false);
  }

  toggleProviderOpen(): void {
    this.providerOpen.set(!this.providerOpen());
  }

  selectProvider(provider: ChatProvider): void {
    this.form.controls.activeProvider.setValue(provider);
    this.providerOpen.set(false);
    this.form.markAsDirty();
  }

  setStackInput(value: string): void {
    this.stackInput.set(value);
  }

  addProfileStack(event?: Event): void {
    event?.preventDefault();
    const value = this.stackInput().trim();
    if (!value) return;
    const exists = this.profileStacks().some((s) => s.toLowerCase() === value.toLowerCase());
    if (exists) return;
    this.profileStacks.update((items) => [...items, value]);
    this.stackInput.set('');
    this.form.markAsDirty();
  }

  removeProfileStack(value: string): void {
    this.profileStacks.update((items) => items.filter((stack) => stack !== value));
    this.form.markAsDirty();
  }

  startEditStack(index: number): void {
    const value = this.profileStacks()[index];
    if (!value) return;
    this.editingStackIndex.set(index);
    this.editingStackValue.set(value);
  }

  cancelEditStack(): void {
    this.editingStackIndex.set(null);
    this.editingStackValue.set('');
  }

  setEditingStackValue(value: string): void {
    this.editingStackValue.set(value);
  }

  saveEditStack(index: number): void {
    const value = this.editingStackValue().trim();
    if (!value) return;

    const exists = this.profileStacks().some((item, idx) => idx !== index && item.toLowerCase() === value.toLowerCase());
    if (exists) return;

    this.profileStacks.update((items) => items.map((item, idx) => idx === index ? value : item));
    this.cancelEditStack();
    this.form.markAsDirty();
  }

  private syncSelectedProjectsFromCsv(csv: string | null | undefined): void {
    if (!csv || !csv.trim()) {
      this.selectedFocusProjectIds.set([]);
      return;
    }
    const ids = csv.split(',')
      .map((part) => Number(part.trim()))
      .filter((value) => Number.isInteger(value) && value > 0);
    this.selectedFocusProjectIds.set(ids);
  }

  private syncProfileStacksFromCsv(csv: string | null | undefined): void {
    if (!csv || !csv.trim()) {
      this.profileStacks.set([]);
      return;
    }
    const stacks = csv
      .split(',')
      .map((part) => part.trim())
      .filter((part) => part.length > 0);
    this.profileStacks.set(stacks);
    this.cancelEditStack();
    this.stackInput.set('');
  }
}
