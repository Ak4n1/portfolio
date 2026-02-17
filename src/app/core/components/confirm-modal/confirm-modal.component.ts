import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ConfirmModalType = 'danger' | 'warning' | 'primary';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.css',
})
export class ConfirmModalComponent {
  @Input() visible = false;
  @Input() type: ConfirmModalType = 'primary';
  @Input() title = 'Confirmar';
  @Input() message = '';
  @Input() confirmText = 'Confirmar';
  @Input() cancelText = 'Cancelar';

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  onOverlayClick(): void {
    this.cancelled.emit();
  }

  onConfirm(): void {
    this.confirmed.emit();
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  onContentClick(event: Event): void {
    event.stopPropagation();
  }
}
