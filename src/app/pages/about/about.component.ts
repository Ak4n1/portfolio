import { Component, OnInit, OnDestroy, AfterViewInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as AOS from 'aos';
import { ThemeService } from '../../core/services/theme.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faRobot, faDesktop, faLaptopCode } from '@fortawesome/free-solid-svg-icons';

interface Subject {
  name: string;
  concepts: string[];
  credits?: number;
}

interface Semester {
  number: 1 | 2;
  name: string;
  subjects: Subject[];
}

interface AcademicYear {
  year: number;
  displayYear: string;
  semesters: Semester[];
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements OnInit, OnDestroy, AfterViewInit {
  private themeService = inject(ThemeService);
  private cdr = inject(ChangeDetectorRef);
  private themeSubscription?: any;

  // FontAwesome icons
  faRobot = faRobot;
  faDesktop = faDesktop;
  faLaptopCode = faLaptopCode;


  // Getter para obtener el color de iconos según el tema actual
  get iconColor(): string {
    const theme = this.themeService.getCurrentTheme();
    return theme === 'dark' ? 'white' : 'black';
  }

  // Método para obtener el ícono correcto según el tema
  getIconSrc(tech: any): string {
    const theme = this.themeService.getCurrentTheme();
    
    // Para iconos de Simple Icons, usar el color dinámico (igual que en Home)
    // Sin cache-buster para mejor performance
    return `https://cdn.simpleicons.org/${tech.slug}/${this.iconColor}`;
  }

  // Método para obtener el logo de la universidad según el tema
  getUniversityLogo(): string {
    const theme = this.themeService.getCurrentTheme();
    return theme === 'dark' 
      ? 'assets/images/logos_universidad/blanco_transparente_300.png'  // Blanco para tema oscuro
      : 'assets/images/logos_universidad/negro_transparente_250.png';  // Negro para tema claro
  }

  academicTimeline: AcademicYear[] = [
    {
      year: 1,
      displayYear: 'Primer Año ',
      semesters: [
        {
          number: 1,
          name: '1er Cuatrimestre',
          subjects: [
            {
              name: 'Programación I',
              concepts: [
                'Algoritmos y lógica de programación',
                'Tipos de datos y operadores en Java',
                'Estructuras de control y funciones',
                'Arreglos y colecciones básicas',
                'Metodologías de resolución de problemas',
                'Entornos de desarrollo y debugging'
              ]
            },
            {
              name: 'Web I',
              concepts: [
                'HTML5 y CSS3 básicos',
                'Layouts, tablas y formularios',
                'JavaScript: DOM y eventos',
                'Herencia, cascada y selectores CSS',
                'Diseño responsive y media queries',
                'Semántica web',
                'Formularios con JavaScript',
                'JSON y manipulación de datos'
              ]
            },

          ]
        },
        {
          number: 2,
          name: '2do Cuatrimestre',
          subjects: [
            {
              name: 'Web II',
              concepts: [
                'Arquitectura web y comunicación cliente-servidor',
                'JavaScript avanzado y DOM',
                'Programación Server Side con PHP',
                'APIs REST y consumo de servicios',
                'Autenticación JWT y seguridad web',
                'Aplicaciones web dinámicas',
                'Protocolo HTTP/HTTPS y sus métodos',
                'Autenticación y autorización',
                'WebSockets y comunicación en tiempo real',
              ]
            },
            {
              name: 'Tecnología de la Información en las Organizaciones',
              concepts: [
                'Sistemas de información organizacionales',
                'Flujos de datos y procesos',
                'Control de versiones con Git',
                'Software libre vs. licenciado',
                'CRM y ERP básico',
                'Licencias de software (GPL, MIT, Apache)'
              ]
            },

            {
              name: 'Taller Matematico Computacional',
              concepts: [
                'Lógica: fundamentos y aplicaciones',
                'Conjuntos y operaciones básicas',
                'Funciones: definición y propiedades',
                'Conteo: principios y técnicas',
                'Probabilidades: conceptos básicos',
                'Estadística: análisis y visualización de datos'
              ],
            }
          ]
        }
      ]
    },
    {
      year: 2,
      displayYear: 'Segundo Año',
      semesters: [
        {
          number: 1,
          name: '3er Cuatrimestre',
          subjects: [
            {
              name: 'Programación II',
              concepts: [
                'Repaso de Programación I aplicado a POO',
                'Objetos, clases e instancias',
                'Mensajes, métodos y variables de instancia',
                'Creación y destrucción de objetos',
                'Herencia, especialización y generalización',
                'Redefinición de métodos y uso de this/super',
                'Asociación, agregación y composición',
                'Clases abstractas e interfaces',
                'Polimorfismo y binding dinámico',
                'Manejo de excepciones en POO',
                'Patrones de diseño estructurales: composite, decorator',
                'Patrones de diseño comportamentales: strategy, state, observer, iterator, command',
              ]
            },
            {
              name: 'Configuracion y desarrollo de aplicaciones en red',
              concepts: [
                'Definición y funcionamiento de Internet',
                'Protocolos de comunicación y su importancia',
                'Topologías de red: bus, estrella, anillo, malla y mixta',
                'Tipos de servicios de Internet y proveedores (ISP)',
                'Medios de transmisión: cable UTP, coaxial y fibra óptica',
                'Modelos de referencia OSI/ISO y TCP/IP',
                'Direcciones MAC e IP: concepto y uso',
                'Protocolos IP, TCP, ARP y DHCP',
                'Enrutamiento: estático, VLSM y NAT',
                'Dispositivos de red: hub, switch y router',
                'Firewalls y filtrado de paquetes',
                'Seguridad en redes: principios y principales riesgos',
                'Criptografía: simétrica, asimétrica y cifrados clásicos',
                'VPN: concepto, protocolos y diferencias con proxy',
                'Aplicaciones y protocolos: HTTP, DNS, SSH, SFTP'
              ]
            },
            {
              name: 'Ingles I',
              concepts: [
                'Lectura y comprensión de textos técnicos en informática',
                'Identificación de cognados y falsos cognados',
                'Vocabulario técnico básico en programación y redes',
                'Estrategias de skimming y scanning para textos académicos',
                'Uso de diccionarios técnicos y herramientas de traducción',
                'Interpretación de instrucciones y especificaciones técnicas',
                'Comprensión de documentación de software y hardware',
                'Ingles tecnico '
              ]
            },

          ]
        },
        {
          number: 2,
          name: '4to Cuatrimestre',
          subjects: [
            {
              name: 'Ingles II',
              concepts: ['Continuacion de Ingles I ']
            },
            {
              name: 'Base de Datos',
              concepts: [
                'Visión general: naturaleza, propósito y características de los sistemas de bases de datos',
                'Evolución de los sistemas de bases de datos y su interacción con sistemas operativos',
                'Modelado de datos con el Modelo de Entidades y Relaciones Extendido (MERExt)',
                'Interpretación y creación de modelos de datos con restricciones implícitas',
                'Transformación de un MERExt a modelo relacional',
                'Creación de esquemas de bases de datos con DDL en SQL',
                'Uso de herramientas de modelado y gestión: Vertabelo y PostgreSQL',
                'Consultas SQL parte 1: sentencias SELECT simples y funciones de agrupamiento',
                'Consultas SQL parte 2: joins, subconsultas anidadas y correlacionadas',
                'Restricciones de integridad: concepto, tipos y aplicación en SQL2',
                'Implementación procedural de restricciones con PL/pgSQL (triggers, funciones, procedimientos)',
                'Procesamiento y optimización de consultas en PostgreSQL',
                'Vistas: creación y uso para simplificación y seguridad',
                'Seguridad y control de acceso en bases de datos',
                'Nociones de bases de datos NoSQL y sus diferencias con el modelo relacional'
              ]
            },
            {
              name: 'Introduccion a las metodologias de desarrollo de software',
              concepts: [
                'Metodologías tradicionales y ágiles de desarrollo',
                'Planeamiento con Poker Planning',
                'Story Mapping: visualización y organización de funcionalidades',
                'Gestión con Jira y documentación colaborativa con Confluence',
                'Scrum: roles, eventos y artefactos',
                'Guía Scrum oficial (en español e inglés)',
                'Elaboración y gestión de User Stories',
                'Diagramas UML: casos de uso, clases, secuencia, transición de estados, componentes y deployment',
                'Kanban y gestión visual de tareas',
                'Introducción a metodologías ágiles (MA)',
              ]
            },

          ]
        }
      ]
    },
    {
      year: 3,
      displayYear: 'Tercer Año',
      semesters: [
        {
          number: 1,
          name: '5to Cuatrimestre',
          subjects: [
            {
              name: 'Programacion III',
              concepts: [
                'Estructuras de datos avanzadas: listas, árboles binarios, árboles binarios de búsqueda (ABB), grafos',
                'Tablas de acceso rápido y dispersión (hashing)',
                'Recursión y su aplicación en algoritmos',
                'Análisis de complejidad computacional: notación Big O, O(n²), y optimizaciones',
                'Algoritmos de búsqueda: búsqueda exhaustiva, backtracking',
                'Algoritmos de ordenamiento eficientes: Quick Sort y Merge Sort entre otros',
                'Algoritmos voraces (Greedy) y su aplicación',
                'Algoritmos de grafos: Dijkstra para caminos mínimos',
                'Conceptos básicos de concurrencia: uso de threads, sincronización y acceso restringido',
              ]
            },
            {
              name: 'Interfaces de Usuario e Interacccion',
              concepts: [
                'Manipulación de imágenes y color en entornos gráficos (Canvas, JS)',
                'Conceptos y prácticas de POO aplicados a eventos y formas en JavaScript',
                'Filtros gráficos y efectos visuales aplicados a imágenes',
                'Manejo de eventos en interfaces gráficas',
                'Transformaciones visuales y animaciones con CSS y JavaScript',
                'Efectos avanzados: Parallax Scrolling y gameloops para animaciones continuas',
                'Detección y manejo de colisiones en animaciones y juegos',
                'Principios de UX (Experiencia de Usuario), UI (Interfaz de Usuario) e IxD (Interacción Diseño)',
                'Leyes y patrones de UX para mejorar la usabilidad',
                'Metodologías y frameworks para diseño atómico (Atomic Design)',
              ]
            },


          ]
        },
        {
          number: 2,
          name: '6to Cuatrimestre',
          subjects: [
            {
              name: 'Arquitecturas Web',
              concepts: [
                'Conceptos básicos de sistemas distribuidos y su importancia en proyectos complejos',
                'Requerimientos no funcionales: escalabilidad, robustez, seguridad y mantenibilidad',
                'Modelos de arquitecturas: Cliente-Servidor, Peer-to-Peer (P2P), Cloud Computing',
                'Modelos y protocolos de comunicación: Sockets TCP/IP, Arquitectura Orientada a Servicios (SOA), Web Services',
                'Modelos de implementación: frameworks, componentes, microservicios y Software como Servicio (SaaS)',
                'Seguridad en sistemas distribuidos: autenticación de identidad, métodos de encriptación, SSL/TLS, HTTPS',
                'Firma digital y mecanismos para asegurar integridad y autenticidad de datos',
                'Introducción a arquitecturas web modernas y patrones de diseño para escalabilidad',
                'Plataformas y herramientas para el despliegue y gestión de sistemas distribuidos'
              ]
            },
            {
              name: 'Tecnicas de Documentacion y Validacion de Software',
              concepts: [
                'Introducción a la documentación de software: importancia y tipos',
                'Visión y definición de requerimientos (VD en Requerimientos)',
                'Introducción al testing: conceptos, objetivos y tipos de pruebas',
                'Test de unidad con frameworks: JUnit y TestNG',
                'Desarrollo y validación (DV) en implementación de software',
                'Documentación de APIs REST: buenas prácticas y herramientas',
                'Automatización de pruebas (Automation)',
                'Mutation testing: técnica avanzada para evaluar la calidad de las pruebas',
                'Información general del curso y metodologías de estudio'
              ]
            },
        
          ]
        }
      ]
    },

  ];

  expandedSemesters: Set<string> = new Set();

  toggleSemester(yearIndex: number, semesterIndex: number): void {
    const key = `${yearIndex}-${semesterIndex}`;
    if (this.expandedSemesters.has(key)) {
      this.expandedSemesters.delete(key);
    } else {
      this.expandedSemesters.add(key);
    }
  }

  isSemesterExpanded(yearIndex: number, semesterIndex: number): boolean {
    return this.expandedSemesters.has(`${yearIndex}-${semesterIndex}`);
  }

  ngOnInit() {
    // Suscribirse a cambios de tema para actualizar los iconos
    this.themeSubscription = this.themeService.currentTheme$.subscribe(() => {
      // Solo una detección de cambios, sin delays adicionales
      this.cdr.detectChanges();
    });
  }

  ngAfterViewInit() {
    // Inicializar AOS (Animate On Scroll) con configuración optimizada para mejor performance
    setTimeout(() => {
      AOS.init({
        duration: 500,        // Reducido aún más para mejor performance
        easing: 'ease-out',
        once: true,
        offset: 50,
        disable: false,
        startEvent: 'DOMContentLoaded',
        initClassName: 'aos-init',
        animatedClassName: 'aos-animate',
        useClassNames: false,
        disableMutationObserver: true,  // Deshabilitar para mejor performance
        debounceDelay: 50,
        throttleDelay: 99,
        // Configuraciones adicionales para reducir requestAnimationFrame
        mirror: false,
        anchorPlacement: 'top-bottom'
      });
    }, 100); // Aumentado ligeramente para asegurar que el DOM esté completamente listo
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
