import { Component, OnInit, OnDestroy, HostListener, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgxEditorComponent, NgxEditorMenuComponent, Editor, TOOLBAR_FULL } from 'ngx-editor';
import { FeedbackModalComponent } from '../../../core/components/feedback-modal/feedback-modal.component';
import { pastePreserveNewlinesPlugin } from '../../../core/plugins/paste-preserve-newlines.plugin';
import { ProjectService } from '../../../core/services/project.service';
import { Project, ProjectRequest } from '../../../core/models/project.model';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_SIZE_MB = 5;

@Component({
  selector: 'app-dashboard-project-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxEditorComponent, NgxEditorMenuComponent, FeedbackModalComponent],
  templateUrl: './dashboard-project-detail.component.html',
  styleUrl: './dashboard-project-detail.component.css'
})
export class DashboardProjectDetailComponent implements OnInit, OnDestroy {
  private projectService = inject(ProjectService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  private routeSub: { unsubscribe: () => void } | null = null;

  id: number | null = null;
  loading = true;
  saving = false;
  uploading = false;
  error = '';
  showSuccessModal = false;
  showErrorModal = false;
  modalMessage = '';
  isNewProjectAfterSave = false;
  tagInput = '';
  stackInput = '';
  categoryOpen = false;

  editor: Editor = new Editor({ plugins: [pastePreserveNewlinesPlugin()] });
  editorToolbar = TOOLBAR_FULL;

  form: ProjectRequest = {
    title: '',
    shortDescription: '',
    description: '',
    category: 'Frontend',
    tags: [],
    stacks: [],
    github: '',
    demo: '',
    displayOrder: 0,
    visible: true
  };

  images: string[] = [];
  imageItems: { id: number; url: string }[] = [];
  uploadError = '';
  showAllImages = false;

  categories = ['Frontend', 'Backend', 'Desktop', 'Fullstack', 'Mobile', 'DevOps', 'Other'];

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      if (idParam && idParam !== 'new') {
        this.id = +idParam;
        this.loadProject();
      } else {
        this.id = null;
        this.resetForm();
        this.loading = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
    this.editor.destroy();
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.categoryOpen = false;
  }

  private resetForm(): void {
    this.form = {
      title: '',
      shortDescription: '',
      description: '',
      category: 'Frontend',
      tags: [],
      stacks: [],
      github: '',
      demo: '',
      displayOrder: 0,
      visible: true
    };
    this.tagInput = '';
    this.stackInput = '';
    this.images = [];
    this.imageItems = [];
    this.uploadError = '';
    this.error = '';
    this.showAllImages = false;
  }

  loadProject(): void {
    if (!this.id) return;
    this.loading = true;
    this.projectService.getById(this.id).subscribe({
      next: (p) => {
        this.form = {
          title: p.title,
          shortDescription: p.shortDescription || '',
          description: (p.description || '') + (p.features ? (p.features.trim() ? '<hr>' + p.features : '') : ''),
          category: p.category,
          tags: p.tags || [],
          stacks: p.stacks || [],
          github: p.github || '',
          demo: p.demo || '',
          displayOrder: p.displayOrder ?? 0,
          visible: p.visible
        };
        this.images = p.images || [];
        this.imageItems = p.imageItems || [];
        this.showAllImages = false;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Error al cargar el proyecto';
        this.loading = false;
      }
    });
  }

  addTag(event: Event): void {
    event.preventDefault();
    const v = (this.tagInput || '').trim();
    if (!v) return;
    this.form.tags = this.form.tags || [];
    if (this.form.tags.includes(v)) return;
    this.form.tags = [...this.form.tags, v];
    this.tagInput = '';
  }

  removeTag(tag: string): void {
    this.form.tags = (this.form.tags || []).filter((t) => t !== tag);
  }

  addStack(event: Event): void {
    event.preventDefault();
    const v = (this.stackInput || '').trim();
    if (!v) return;
    this.form.stacks = this.form.stacks || [];
    if (this.form.stacks.includes(v)) return;
    this.form.stacks = [...this.form.stacks, v];
    this.stackInput = '';
  }

  removeStack(stack: string): void {
    this.form.stacks = (this.form.stacks || []).filter((s) => s !== stack);
  }

  save(): void {
    this.error = '';
    this.saving = true;
    const payload = { ...this.form, features: '' };
    const obs = this.id
      ? this.projectService.update(this.id, payload)
      : this.projectService.create(payload);

    obs.subscribe({
      next: (p) => {
        this.saving = false;
        this.modalMessage = this.id ? 'Proyecto actualizado correctamente.' : 'Proyecto creado correctamente.';
        this.isNewProjectAfterSave = !this.id;
        this.showSuccessModal = true;
        if (!this.id) {
          this.id = p.id;
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.saving = false;
        this.modalMessage = err?.error?.message || 'Error al guardar el proyecto.';
        this.showErrorModal = true;
        this.cdr.detectChanges();
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    input.value = '';
    if (!file || !this.id) return;

    this.uploadError = '';
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      this.uploadError = 'Solo se permiten imágenes JPG, PNG y WEBP.';
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      this.uploadError = `La imagen debe tener menos de ${MAX_SIZE_MB} MB.`;
      return;
    }

    this.uploading = true;
    this.projectService.uploadImage(this.id, file).subscribe({
      next: (res) => {
        this.images = [...this.images, res.url];
        this.imageItems = [...this.imageItems, { id: res.imageId, url: res.url }];
        this.showAllImages = this.imageItems.length <= 2 ? false : this.showAllImages;
        this.uploading = false;
      },
      error: (err) => {
        this.uploadError = err?.error?.message || 'Error al subir.';
        this.uploading = false;
      }
    });
  }

  removeImage(item: { id: number; url: string }): void {
    if (!this.id) return;
    this.projectService.deleteImage(this.id, item.id).subscribe({
      next: () => {
        this.images = this.images.filter((u) => u !== item.url);
        this.imageItems = this.imageItems.filter((i) => i.id !== item.id);
        if (this.imageItems.length <= 2) {
          this.showAllImages = false;
        }
      },
      error: (err) => (this.uploadError = err?.error?.message || 'Error al eliminar la imagen')
    });
  }

  setAsPrimary(item: { id: number; url: string }): void {
    if (!this.id) return;
    this.uploadError = '';
    this.projectService.setPrimaryImage(this.id, item.id).subscribe({
      next: (project) => {
        this.images = project.images || [];
        this.imageItems = project.imageItems || [];
      },
      error: (err) => {
        this.uploadError = err?.error?.message || 'Error al marcar imagen principal';
      },
    });
  }

  isPrimary(item: { id: number; url: string }): boolean {
    if (!this.imageItems.length) return false;
    const primary = this.imageItems[0];
    if (primary.id != null && item.id != null) {
      return primary.id === item.id;
    }
    return (primary.url || '').trim() === (item.url || '').trim();
  }

  getVisibleImageItems(): { id: number; url: string }[] {
    return this.showAllImages ? this.imageItems : this.imageItems.slice(0, 2);
  }

  toggleShowImages(): void {
    this.showAllImages = !this.showAllImages;
  }

  getImageUrl(url: string): string {
    return this.projectService.getImageUrl(url);
  }

  goBack(): void {
    this.router.navigate(['/dashboard/projects']);
  }

  resetEditor(): void {
    this.form.description = '';
  }

  /** Inserta el texto <br> (literal) en la posición del cursor, usando la misma técnica que el botón hr. */
  insertLineBreak(event?: MouseEvent): void {
    event?.preventDefault();
    const view = this.editor?.view;
    if (!view) return;
    const { state, dispatch } = view;
    const tr = state.tr.insertText('<br>', state.selection.from);
    dispatch(tr.scrollIntoView());
  }

  closeSuccessModal(): void {
    this.showSuccessModal = false;
    if (this.isNewProjectAfterSave && this.id) {
      this.router.navigate(['/dashboard/projects', this.id]);
    }
  }

  closeErrorModal(): void {
    this.showErrorModal = false;
  }

  getCategoryIcon(category: string): string {
    const c = (category || '').toLowerCase();
    if (c.includes('frontend')) return 'fas fa-code';
    if (c.includes('backend')) return 'fas fa-server';
    if (c.includes('desktop')) return 'fas fa-desktop';
    if (c.includes('fullstack')) return 'fas fa-layer-group';
    if (c.includes('mobile')) return 'fas fa-mobile-alt';
    if (c.includes('devops')) return 'fas fa-cogs';
    return 'fas fa-folder';
  }
}
