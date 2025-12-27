import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

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
  selector: 'app-projects',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css',
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('0.6s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class ProjectsComponent implements OnInit, OnDestroy {
  // Modal properties
  isModalOpen = false;
  selectedImage = '';
  selectedProject: Project | null = null;

  // Carousel properties
  carouselStates: { [key: number]: { currentIndex: number; interval: any } } = {};

  projects: Project[] = [
    {
      id: 1,
      title: 'L2 Terra Web',
      description: 'Plataforma web completa desarrollada en Angular para servidor privado de Lineage 2 basado en L2Jmobius Classic. Incluye autenticación, pagos, marketplace offline y sistema de streaming.',
      icon: '🎮',
      tags: ['Angular', 'Spring Boot', 'JWT', 'MercadoPago', 'Firebase', 'N8N'],
      category: 'Frontend',
      github: 'https://github.com/juanencabo/l2terra-web',
      demo: 'https://l2terra.online',
      images: ['assets/images/terra-web/bg1.jpg', 'assets/images/terra-web/bg2.jpg', 'assets/images/terra-web/bg3.jpg', 'assets/images/terra-web/bg4.jpg', 'assets/images/terra-web/bg5.jpg', 'assets/images/terra-web/bg6.jpg', 'assets/images/terra-web/bg7.jpg', 'assets/images/terra-web/bg8.jpg']
    },
    {
      id: 2,
      title: 'Terra API',
      description: 'API REST monolítica desarrollada en Spring Boot 3.4.4 para servidor privado de Lineage 2 basado en L2Jmobius Classic. Incluye autenticación JWT, gestión de personajes, pagos con PayPal y MercadoPago, marketplace offline y sistema de notificaciones.',
      icon: '🔌',
      tags: ['Spring Boot', 'Java', 'JWT', 'MariaDB', 'PayPal', 'MercadoPago', 'Firebase', 'WebSocket'],
      category: 'Backend',
      github: 'https://github.com/juanencabo/terra-api',
      images: ['assets/images/terra-api/bgweb3.png', 'assets/images/terra-api/bgweb2.png', 'assets/images/terra-api/bgweb1.png']
    },
    {
      id: 3,
      title: 'Game Launcher',
      description: 'Aplicación desktop desarrollada con Electron para L2Terra. Incluye descarga y actualización del juego, rankings PvP, patch notes y sistema de autenticación.',
      icon: '🎮',
      tags: ['Electron', 'JavaScript', 'Desktop', 'Game'],
      category: 'Desktop',
      github: 'https://github.com/juanencabo/game-launcher',
      demo: 'https://github.com/juanencabo/game-launcher/releases',
      images: ['assets/images/terra-launcher/launcherlogin.png', 'assets/images/terra-launcher/launcherpanel.png','assets/images/terra-launcher/launcherpanel2.png']
    },
    {
      id: 4,
      title: 'L2Jmobius Server',
      description: 'Servidor L2Jmobius Classic 3.0 completo con core personalizado, datapack optimizado y sistema de infraestructura en VPS con N8N para automatización.',
      icon: '🖥️',
      tags: ['Java', 'L2Jmobius', 'VPS', 'Linux', 'Infrastructure'],
      category: 'Backend',
      github: 'https://github.com/juanencabo/l2jmobius-server',
      images: ['assets/images/l2jmobius-server/bgweb3.png', 'assets/images/l2jmobius-server/bgweb2.png', 'assets/images/l2jmobius-server/bgweb1.png']
    }
  ];

  categories: string[] = ['Todos', 'Frontend', 'Backend', 'Desktop'];
  selectedCategory: string = 'Todos';
  filteredProjects: Project[] = [];

  ngOnInit() {
    this.filterProjects('Todos');
    this.initializeCarousels();
  }

  ngOnDestroy() {
    this.stopAllCarousels();
  }

  // Filter methods
  filterProjects(category: string) {
    this.selectedCategory = category;
    if (category === 'Todos') {
      this.filteredProjects = this.projects;
    } else {
      this.filteredProjects = this.projects.filter(project => project.category === category);
    }
  }

  // Carousel methods
  initializeCarousels() {
    this.projects.forEach(project => {
      if (project.images && project.images.length > 1) {
        this.carouselStates[project.id] = {
          currentIndex: 0,
          interval: setInterval(() => {
            this.nextImage(project.id);
          }, 4000)
        };
      }
    });
  }

  stopAllCarousels() {
    Object.values(this.carouselStates).forEach(state => {
      if (state.interval) {
        clearInterval(state.interval);
      }
    });
  }

  pauseCarousel(projectId: number) {
    const state = this.carouselStates[projectId];
    if (state && state.interval) {
      clearInterval(state.interval);
      state.interval = null;
    }
  }

  resumeCarousel(projectId: number) {
    const project = this.projects.find(p => p.id === projectId);
    const state = this.carouselStates[projectId];
    if (project && project.images && project.images.length > 1 && state && !state.interval) {
      state.interval = setInterval(() => {
        this.nextImage(projectId);
      }, 4000);
    }
  }

  nextImage(projectId: number) {
    const state = this.carouselStates[projectId];
    const project = this.projects.find(p => p.id === projectId);
    if (state && project && project.images) {
      state.currentIndex = (state.currentIndex + 1) % project.images.length;
    }
  }

  prevImage(projectId: number) {
    const state = this.carouselStates[projectId];
    const project = this.projects.find(p => p.id === projectId);
    if (state && project && project.images) {
      state.currentIndex = state.currentIndex === 0 
        ? project.images.length - 1 
        : state.currentIndex - 1;
    }
  }

  goToImage(projectId: number, index: number) {
    const state = this.carouselStates[projectId];
    if (state) {
      state.currentIndex = index;
    }
  }

  getCurrentImage(projectId: number): string {
    const state = this.carouselStates[projectId];
    const project = this.projects.find(p => p.id === projectId);
    if (state && project && project.images) {
      return project.images[state.currentIndex];
    }
    return '';
  }

  getCurrentIndex(projectId: number): number {
    const state = this.carouselStates[projectId];
    return state ? state.currentIndex : 0;
  }

  // Modal methods
  openModal(project: Project) {
    const currentImage = this.getCurrentImage(project.id);
    if (currentImage) {
      this.selectedImage = currentImage;
      this.selectedProject = project;
      this.isModalOpen = true;
      document.body.style.overflow = 'hidden';
      this.pauseCarousel(project.id);
    }
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedImage = '';
    this.selectedProject = null;
    document.body.style.overflow = 'auto';
    
    // Resume all carousels
    this.projects.forEach(project => {
      if (project.images && project.images.length > 1) {
        this.resumeCarousel(project.id);
      }
    });
  }

  onModalClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }
}
