import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

export type FeedbackModalType = 'success' | 'error';

@Component({
  selector: 'app-feedback-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feedback-modal.component.html',
  styleUrl: './feedback-modal.component.css'
})
export class FeedbackModalComponent {
  private router = inject(Router);

  @Input() visible = false;
  @Input() type: FeedbackModalType = 'success';
  @Input() title = '';
  @Input() message = '';
  @Input() buttonText = 'Aceptar';
  @Input() secondaryButtonText = '';
  @Input() secondaryButtonRoute: string | string[] | null = null;

  @Output() closed = new EventEmitter<void>();

  get showSecondaryButton(): boolean {
    return !!(this.secondaryButtonText && this.secondaryButtonRoute);
  }

  onOverlayClick(): void {
    this.closed.emit();
  }

  onAccept(): void {
    this.closed.emit();
  }

  onSecondaryClick(): void {
    if (this.secondaryButtonRoute) {
      const route = Array.isArray(this.secondaryButtonRoute) ? this.secondaryButtonRoute : [this.secondaryButtonRoute];
      this.router.navigate(route);
      this.closed.emit();
    }
  }

  onContentClick(event: Event): void {
    event.stopPropagation();
  }
}
