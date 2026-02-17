import { Component, inject, HostListener, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ContactService } from '../../core/services/contact.service';
import { AnalyticsEventsService } from '../../core/services/analytics/analytics-events.service';
import { NgxEditorComponent, NgxEditorMenuComponent, Editor, TOOLBAR_FULL } from 'ngx-editor';
import { pastePreserveNewlinesPlugin } from '../../core/plugins/paste-preserve-newlines.plugin';
import { FeedbackModalComponent } from '../../core/components/feedback-modal/feedback-modal.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgxEditorComponent, NgxEditorMenuComponent, FeedbackModalComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent implements OnDestroy {
  private fb = inject(FormBuilder);
  private contactService = inject(ContactService);
  private analyticsEvents = inject(AnalyticsEventsService);
  private router = inject(Router);

  contactForm: FormGroup;
  isSubmitting = false;
  submitError = '';

  // Modal de feedback
  showModal = false;
  modalType: 'success' | 'error' = 'success';
  modalTitle = '';
  modalMessage = '';

  public contactEmail = 'encabojuan@gmail.com';
  public copied = false;

  editor: Editor = new Editor({ plugins: [pastePreserveNewlinesPlugin()] });
  editorToolbar = TOOLBAR_FULL;

  constructor() {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: [''],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  copyEmail() {
    this.analyticsEvents.trackClickContactEmail('contact_copy');
    const text = this.contactEmail;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => this.showCopied());
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      try { document.execCommand('copy'); } finally { document.body.removeChild(textarea); this.showCopied(); }
    }
  }

  private showCopied() {
    this.copied = true;
    setTimeout(() => (this.copied = false), 2000);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  private formSubmitted = false;

  @HostListener('window:beforeunload')
  onBeforeUnload(): void {
    this.trackAbandonmentIfNeeded();
  }

  ngOnDestroy(): void {
    this.trackAbandonmentIfNeeded();
    this.editor.destroy();
  }

  onSocialClick(network: 'github' | 'linkedin' | 'instagram'): void {
    if (network === 'linkedin') {
      this.analyticsEvents.trackClickContactLinkedIn('contact_social');
    } else {
      this.analyticsEvents.trackClickSocial(network, 'contact_social');
    }
  }

  private trackAbandonmentIfNeeded(): void {
    if (this.formSubmitted || this.isSubmitting) return;
    if (!this.contactForm.dirty) return;
    const touched = Object.keys(this.contactForm.controls)
      .filter(k => (this.contactForm.get(k)?.dirty || this.contactForm.get(k)?.touched) ?? false);
    if (touched.length > 0) {
      this.analyticsEvents.trackContactFormAbandoned(touched);
    }
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.isSubmitting = true;
      this.submitError = '';
      this.contactService.submit({
        name: this.contactForm.value.name,
        email: this.contactForm.value.email,
        subject: this.contactForm.value.subject || undefined,
        message: this.contactForm.value.message,
      }).subscribe({
        next: () => {
          this.formSubmitted = true;
          this.contactForm.reset();
          this.isSubmitting = false;

          // Mostrar modal de éxito
          this.modalType = 'success';
          this.modalTitle = '¡Mensaje Enviado!';
          this.modalMessage = 'Tu mensaje ha sido enviado correctamente. Te responderé lo antes posible.';
          this.showModal = true;
        },
        error: (err) => {
          this.isSubmitting = false;
          this.submitError = err.error?.message || 'Error al enviar. Intenta de nuevo.';

          // Mostrar modal de error
          this.modalType = 'error';
          this.modalTitle = 'Error al Enviar';
          this.modalMessage = this.submitError;
          this.showModal = true;
        },
      });
    } else {
      Object.keys(this.contactForm.controls).forEach((key) => {
        this.contactForm.get(key)?.markAsTouched();
      });
    }
  }

  closeModal() {
    this.showModal = false;
  }
}
