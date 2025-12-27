import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// 🚀 OPTIMIZACIÓN: Eliminamos FontAwesome para ahorrar 100MB+

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  contactForm: FormGroup;
  isSubmitting = false;

  // Email de contacto mostrado y botón de copiar
  public contactEmail = 'encabojuan@gmail.com';
  // 🚀 Iconos reemplazados por emojis simples
  public copied = false;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: [''],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  copyEmail() {
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

  onSubmit() {
    if (this.contactForm.valid) {
      this.isSubmitting = true;
      setTimeout(() => {
        console.log('Formulario enviado:', this.contactForm.value);
        this.contactForm.reset();
        this.isSubmitting = false;
        alert('¡Mensaje enviado con éxito! Te responderé pronto.');
      }, 2000);
    } else {
      Object.keys(this.contactForm.controls).forEach(key => {
        const control = this.contactForm.get(key);
        control?.markAsTouched();
      });
    }
  }
}
