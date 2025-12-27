import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGamepad, faPlug, faDesktop, faServer } from '@fortawesome/free-solid-svg-icons';

interface Project {
  id: number;
  title: string;
  description: string;
  icon: string;
  tags: string[];
  category: string;
  github?: string;
  demo?: string;
  images?: string[];
}

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.css',
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('0.6s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class ProjectDetailComponent implements OnInit, OnDestroy {
  project: Project | null = null;
  currentImageIndex = 0;
  carouselInterval: any;

  // Modal properties
  isModalOpen = false;
  selectedImage = '';

  // FontAwesome icons
  faGamepad = faGamepad;
  faPlug = faPlug;
  faDesktop = faDesktop;
  faServer = faServer;

  // Método para obtener el icono según el proyecto
  getProjectIcon(projectId: number) {
    switch (projectId) {
      case 1: return faGamepad; // L2 Terra Web
      case 2: return faPlug; // Terra API
      case 3: return faDesktop; // Game Launcher
      case 4: return faServer; // L2Jmobius Server
      default: return faGamepad;
    }
  }

  projects: Project[] = [
    {
      id: 1,
      title: 'L2 Terra Web',
      description: 'Plataforma web completa desarrollada en Angular 19.2.0 + Spring Boot para servidor privado de Lineage 2 basado en L2Jmobius Classic. Las funcionalidades principales se detallan a continuación.',
      icon: '',
      tags: ['Angular 19.2.0', 'TypeScript', 'Spring Boot', 'JWT', 'MercadoPago', 'Firebase', 'Discord SDK', 'Kick.com API', 'N8N', 'MySQL'],
      category: 'Frontend',
      github: 'https://github.com/Jeep12/web-terra',
      demo: 'https://l2terra.online',
      images: ['assets/images/terra-web/bg1.jpg', 'assets/images/terra-web/bg2.jpg', 'assets/images/terra-web/bg3.jpg', 'assets/images/terra-web/bg4.jpg', 'assets/images/terra-web/bg5.jpg', 'assets/images/terra-web/bg6.jpg', 'assets/images/terra-web/bg7.jpg', 'assets/images/terra-web/bg8.jpg']
    },
    {
      id: 2,
      title: 'Terra API',
      description: 'API REST completa para L2Terra con gestión de cuentas maestras, verificación por email, market offline, estadísticas de personajes y sistema de seguridad con JWT y rate limiting.',
      icon: '🔌',
      tags: ['Spring Boot 3.4.4', 'Java 17', 'JWT', 'MariaDB', 'PayPal SDK', 'MercadoPago SDK', 'Firebase', 'WebSocket', 'Rate Limiting'],
      category: 'Backend',
      github: 'https://github.com/juanencabo/terra-api',
      images: ['assets/images/terra-api/bgweb3.png', 'assets/images/terra-api/bgweb2.png', 'assets/images/terra-api/bgweb1.png']
    },
    {
      id: 3,
      title: 'Game Launcher',
      description: 'Launcher desktop para Lineage 2 Terra desarrollado con Electron. Permite descargar y actualizar el juego, consultar rankings PvP en tiempo real, acceder a patch notes y validar la instalación del cliente. Incluye sistema de reparación de archivos, ventana sin marco con System Tray, y estadísticas del servidor. Planeado migrar a JavaFX en el futuro.',
      icon: '🎮',
      tags: ['Electron', 'JavaScript', 'Desktop', 'Game'],
      category: 'Desktop',
      github: 'https://github.com/juanencabo/game-launcher',
      demo: 'https://github.com/juanencabo/game-launcher/releases',
      images: ['assets/images/terra-launcher/launcherlogin.png', 'assets/images/terra-launcher/launcherpanel.png', 'assets/images/terra-launcher/launcherpanel2.png']
    },
    {
      id: 4,
      title: 'L2Jmobius Server',
      description: 'Terra es un proyecto personal de desarrollo de un servidor online multijugador, construido sobre <a href="https://l2jmobius.org/" target="_blank">L2JMobius</a>, un core open-source de servidor escrito en Java que implementa la lógica base de un MMORPG. L2JMobius provee una implementación funcional inicial, pensada para ser modificada y extendida, no un producto final. A partir de esta base, desarrollo un servidor propio, incorporando modificaciones al core original y funcionalidades personalizadas, desplegado en un entorno Linux real (Ubuntu 22.04).',
      icon: '🖥️',
      tags: ['Java', 'L2Jmobius', 'VPS', 'Linux', 'Infrastructure'],
      category: 'Backend',
      github: 'https://github.com/juanencabo/l2jmobius-server',
      images: ['assets/images/l2jmobius-server/bgweb3.png', 'assets/images/l2jmobius-server/bgweb2.png', 'assets/images/l2jmobius-server/bgweb1.png']
    }

  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const projectId = +params['id'];
      this.project = this.projects.find(p => p.id === projectId) || null;

      if (!this.project) {
        this.router.navigate(['/projects']);
        return;
      }

      this.initializeCarousel();
    });
  }

  ngOnDestroy() {
    this.stopCarousel();
  }

  initializeCarousel() {
    if (this.project && this.project.images && this.project.images.length > 1) {
      this.carouselInterval = setInterval(() => {
        this.nextImage();
      }, 4000);
    }
  }

  stopCarousel() {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
  }

  pauseCarousel() {
    this.stopCarousel();
  }

  resumeCarousel() {
    if (this.project && this.project.images && this.project.images.length > 1) {
      this.initializeCarousel();
    }
  }

  nextImage() {
    if (this.project && this.project.images) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.project.images.length;
    }
  }

  prevImage() {
    if (this.project && this.project.images) {
      this.currentImageIndex = this.currentImageIndex === 0
        ? this.project.images.length - 1
        : this.currentImageIndex - 1;
    }
  }

  goToImage(index: number) {
    this.currentImageIndex = index;
  }

  getCurrentImage(): string {
    if (this.project && this.project.images) {
      return this.project.images[this.currentImageIndex];
    }
    return '';
  }

  goBack() {
    this.router.navigate(['/projects']);
  }

  goToProject(projectId: number) {
    this.router.navigate(['/project', projectId]);
  }

  getRelatedProjects(): Project[] {
    if (!this.project) return [];
    return this.projects.filter(p => p.id !== this.project!.id).slice(0, 3);
  }

  // Modal methods
  openModal() {
    if (this.project && this.project.images) {
      this.selectedImage = this.getCurrentImage();
      this.isModalOpen = true;
      document.body.style.overflow = 'hidden';
      this.pauseCarousel();
    }
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedImage = '';
    document.body.style.overflow = 'auto';
    this.resumeCarousel();
  }

  onModalClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  nextImageModal() {
    if (this.project && this.project.images) {
      this.nextImage();
      this.selectedImage = this.getCurrentImage();
    }
  }

  prevImageModal() {
    if (this.project && this.project.images) {
      this.prevImage();
      this.selectedImage = this.getCurrentImage();
    }
  }
}
