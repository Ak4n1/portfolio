import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Editor, NgxEditorComponent, NgxEditorMenuComponent, TOOLBAR_FULL } from 'ngx-editor';
import { NewsService } from '../../../core/services/news.service';
import { NewsBroadcast } from '../../../core/models/project.model';
import { pastePreserveNewlinesPlugin } from '../../../core/plugins/paste-preserve-newlines.plugin';
import { ConfirmModalComponent } from '../../../core/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-dashboard-news',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxEditorComponent, NgxEditorMenuComponent, ConfirmModalComponent],
  templateUrl: './dashboard-news.component.html',
  styleUrl: './dashboard-news.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardNewsComponent implements OnInit, OnDestroy {
  private newsService = inject(NewsService);

  newsItems = signal<NewsBroadcast[]>([]);
  loading = signal(true);
  loadError = signal<string | null>(null);

  totalElements = signal(0);
  totalPages = signal(0);
  currentPage = signal(0);
  readonly pageSize = 8;

  saving = signal(false);
  saveError = signal<string | null>(null);
  saveSuccess = signal<string | null>(null);
  deleteError = signal<string | null>(null);
  deleteSuccess = signal<string | null>(null);
  deletingNewsId = signal<number | null>(null);
  deleteModalVisible = signal(false);
  pendingDeleteNews = signal<NewsBroadcast | null>(null);
  editingNewsId = signal<number | null>(null);

  title = signal('');
  content = signal('');
  searchText = signal('');
  fromDate = signal('');
  toDate = signal('');

  readonly editor = new Editor({ plugins: [pastePreserveNewlinesPlugin()] });
  readonly toolbar = TOOLBAR_FULL;

  ngOnInit(): void {
    this.loadNews(0);
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  loadNews(page: number = this.currentPage()): void {
    this.loading.set(true);
    this.loadError.set(null);

    const safePage = Math.max(page, 0);
    const search = this.searchText().trim() || undefined;
    const from = this.fromDate() || undefined;
    const to = this.toDate() || undefined;

    this.newsService.getAdminPage({
      page: safePage,
      size: this.pageSize,
      search,
      from,
      to,
    }).subscribe({
      next: (res) => {
        this.newsItems.set(res.news ?? []);
        this.totalElements.set(res.totalElements ?? 0);
        this.totalPages.set(res.totalPages ?? 0);
        this.currentPage.set(res.page ?? safePage);
        this.loading.set(false);
      },
      error: () => {
        this.newsItems.set([]);
        this.totalElements.set(0);
        this.totalPages.set(0);
        this.currentPage.set(0);
        this.loadError.set('No se pudieron cargar las noticias.');
        this.loading.set(false);
      },
    });
  }

  applyFilters(): void {
    this.loadNews(0);
  }

  publishNews(): void {
    this.saveError.set(null);
    this.saveSuccess.set(null);
    this.deleteError.set(null);
    this.deleteSuccess.set(null);

    const title = this.title().trim();
    const content = this.content().trim();

    if (!title) {
      this.saveError.set('El titulo es obligatorio.');
      return;
    }

    if (this.isEditorContentEmpty(content)) {
      this.saveError.set('El contenido es obligatorio.');
      return;
    }

    this.saving.set(true);
    const editingId = this.editingNewsId();

    if (editingId) {
      this.newsService.update(editingId, { title, content }).subscribe({
        next: () => {
          this.clearForm();
          this.saveSuccess.set('Noticia editada correctamente.');
          this.saving.set(false);
          this.loadNews(this.currentPage());
        },
        error: (err) => {
          this.saveError.set(err?.error?.message ?? 'No se pudo editar la noticia.');
          this.saving.set(false);
        },
      });
      return;
    }

    this.newsService.post({ title, content }).subscribe({
      next: () => {
        this.clearForm();
        this.saveSuccess.set('Noticia publicada correctamente.');
        this.saving.set(false);
        this.loadNews(0);
      },
      error: (err) => {
        this.saveError.set(err?.error?.message ?? 'No se pudo publicar la noticia.');
        this.saving.set(false);
      },
    });
  }

  clearForm(): void {
    this.title.set('');
    this.content.set('');
    this.editingNewsId.set(null);
    this.saveError.set(null);
    this.saveSuccess.set(null);
  }

  clearFilters(): void {
    this.searchText.set('');
    this.fromDate.set('');
    this.toDate.set('');
    this.applyFilters();
  }

  hasActiveFilters(): boolean {
    return !!this.searchText().trim() || !!this.fromDate() || !!this.toDate();
  }

  deleteNews(news: NewsBroadcast): void {
    if (!news?.id || this.deletingNewsId() !== null || this.saving()) {
      return;
    }

    this.pendingDeleteNews.set(news);
    this.deleteModalVisible.set(true);
  }

  onDeleteModalCancelled(): void {
    this.deleteModalVisible.set(false);
    this.pendingDeleteNews.set(null);
  }

  onDeleteModalConfirmed(): void {
    const news = this.pendingDeleteNews();
    this.onDeleteModalCancelled();
    if (!news?.id || this.deletingNewsId() !== null || this.saving()) {
      return;
    }

    this.deleteError.set(null);
    this.deleteSuccess.set(null);
    this.saveError.set(null);
    this.saveSuccess.set(null);
    this.deletingNewsId.set(news.id);

    this.newsService.delete(news.id).subscribe({
      next: () => {
        if (this.editingNewsId() === news.id) {
          this.clearForm();
        }

        const shouldGoPrev = this.newsItems().length === 1 && this.currentPage() > 0;
        const targetPage = shouldGoPrev ? this.currentPage() - 1 : this.currentPage();

        this.deleteSuccess.set('Noticia eliminada correctamente.');
        this.deletingNewsId.set(null);
        this.loadNews(targetPage);
      },
      error: (err) => {
        this.deleteError.set(err?.error?.message ?? 'No se pudo eliminar la noticia.');
        this.deletingNewsId.set(null);
      },
    });
  }

  goToPage(page: number): void {
    const total = this.totalPages();
    if (total <= 0) {
      return;
    }
    if (page < 0 || page >= total) {
      return;
    }
    this.loadNews(page);
  }

  isDeleting(newsId: number): boolean {
    return this.deletingNewsId() === newsId;
  }

  getDeleteModalMessage(): string {
    const title = this.pendingDeleteNews()?.title?.trim();
    if (title) {
      return `Eliminar la noticia "${title}"? Esta accion no se puede deshacer.`;
    }
    return 'Eliminar esta noticia? Esta accion no se puede deshacer.';
  }

  startEdit(news: NewsBroadcast): void {
    if (!news?.id || this.saving() || this.deletingNewsId() !== null) {
      return;
    }

    this.editingNewsId.set(news.id);
    this.title.set(news.title ?? '');
    this.content.set(news.content ?? '');
    this.saveError.set(null);
    this.saveSuccess.set(null);
    this.deleteError.set(null);
    this.deleteSuccess.set(null);
  }

  isEditing(newsId: number): boolean {
    return this.editingNewsId() === newsId;
  }

  private isEditorContentEmpty(content: string): boolean {
    const normalized = content
      .replace(/<p><br><\/p>/gi, '')
      .replace(/&nbsp;/gi, '')
      .replace(/<[^>]*>/g, '')
      .trim();
    return normalized.length === 0;
  }
}
