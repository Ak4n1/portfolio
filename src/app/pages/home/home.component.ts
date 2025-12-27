import { Component, OnInit, OnDestroy, AfterViewInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
// 🚀 OPTIMIZACIÓN: Eliminamos FontAwesome para ahorrar 100MB+
import * as AOS from 'aos';
import { HeroCanvasComponent } from '../../shared/hero-canvas/hero-canvas.component';
import { ThemeService } from '../../core/services/theme.service';

interface User {
  name: string;
  email: string;
  location: string;
}
@Component({
  selector: 'app-home',
  standalone: true,
    imports: [
    CommonModule,
    HeroCanvasComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  private themeService = inject(ThemeService);
  private cdr = inject(ChangeDetectorRef);
  private themeSubscription?: any;

  constructor(private router: Router) {}

  // Getter para obtener el color de iconos según el tema actual
  get iconColor(): string {
    const theme = this.themeService.getCurrentTheme();
    return theme === 'dark' ? 'white' : 'black';
  }

  // Método para obtener el ícono correcto según el tema
  getIconSrc(tech: any): string {
    const theme = this.themeService.getCurrentTheme();
    
    // Manejo especial para Java que tiene iconos personalizados para cada tema
    if (tech.name === 'Java') {
      return theme === 'dark' 
        ? '/assets/images/logos_stacks/javaicon.png'        // Blanco para tema oscuro
        : '/assets/images/logos_stacks/javaicondark.png';   // Negro para tema claro
    }
    
    // Para otros iconos personalizados, usar el customIcon si existe
    if (tech.customIcon) {
      return tech.customIcon;
    }
    
    // Para iconos de Simple Icons, usar el color dinámico
    // Sin cache-buster para mejor performance
    return `https://cdn.simpleicons.org/${tech.slug}/${this.iconColor}`;
  }

  private user: User = {
    name: 'Juan Encabo',
    email: 'encabojuan@gmail.com',
    location: 'Buenos Aires, Argentina'
  }

  // Email mostrado en el bloque "código" del hero y copy action
  public heroEmail: string = this.user.email;
  // 🚀 Icono reemplazado por SVG simple
  public copiedHero = false;

  // Stacks tecnológicos usando Simple Icons CDN oficial
  techStacks = {
    languages: [
      { name: 'Java', slug: 'openjdk', color: '#ED8B00' },
      { name: 'JavaScript', slug: 'javascript', color: '#F7DF1E' },
      { name: 'TypeScript', slug: 'typescript', color: '#3178C6' },
      { name: 'HTML5', slug: 'html5', color: '#E34F26' },
      { name: 'CSS', slug: 'css', color: '#1572B6' },
      { name: 'PHP', slug: 'php', color: '#777BB4' }
    ],
    frameworks: [
      { name: 'Angular', slug: 'angular', color: '#DD0031' },
      { name: 'Spring Boot', slug: 'springboot', color: '#6DB33F' },
      { name: 'Spring', slug: 'spring', color: '#6DB33F' }
    ],
    databases: [
      { name: 'MySQL', slug: 'mysql', color: '#4479A1' },
      { name: 'MariaDB', slug: 'mariadb', color: '#003545' },
      { name: 'PostgreSQL', slug: 'postgresql', color: '#4169E1' },
      { name: 'Firebase', slug: 'firebase', color: '#DD2C00' }
    ],
    tools: [
      { name: 'Git', slug: 'git', color: '#F05032' },
      { name: 'Postman', slug: 'postman', color: '#FF6C37' },
      { name: 'Figma', slug: 'figma', color: '#F24E1E' },
      { name: 'Jira', slug: 'jira', color: '#0052CC' },
      { name: 'Trello', slug: 'trello', color: '#0079BF' },
      { name: 'Bootstrap', slug: 'bootstrap', color: '#7952B3' },
      { name: 'Cloudflare', slug: 'cloudflare', color: '#F38020' }
    ],
    methodologies: [
      { name: 'Scrum', slug: 'scrumalliance', color: '#009FDA' },
      { name: 'UML', slug: 'uml', color: '#FABD14' }
    ]
  };

  copyHeroEmail() {
    const text = this.heroEmail;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => this.showHeroCopied());
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      try { document.execCommand('copy'); } finally { document.body.removeChild(textarea); this.showHeroCopied(); }
    }
  }

  private showHeroCopied() {
    this.copiedHero = true;
    setTimeout(() => (this.copiedHero = false), 2000);
  }

  onCanvasButtonClick(action: string) {
    if (action === 'projects') {
      this.router.navigate(['/projects']);
    } else if (action === 'contact') {
      this.router.navigate(['/contact']);
    }
  }



  ngOnInit() {
    // Suscribirse a cambios de tema para actualizar los iconos
    this.themeSubscription = this.themeService.currentTheme$.subscribe(() => {
      // Solo una detección de cambios, sin delays adicionales
      this.cdr.detectChanges();
    });
  }

  ngAfterViewInit() {
    // Inicializar AOS (Animate On Scroll)
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 100
    });
  }

  ngOnDestroy() {
    // Limpiar AOS al destruir el componente
    AOS.refresh();
    // Limpiar suscripción al tema
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }


}
