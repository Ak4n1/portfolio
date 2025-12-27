import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Skill {
  name: string;
  icon: string;
  level: number;
}

interface LearningTech {
  name: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.css'
})
export class SkillsComponent {
  frontendSkills: Skill[] = [
    { name: 'Angular', icon: '⚛️', level: 85 },
    { name: 'TypeScript', icon: '📘', level: 80 },
    { name: 'HTML5', icon: '🌐', level: 90 },
    { name: 'CSS3/SCSS', icon: '🎨', level: 85 },
    { name: 'JavaScript', icon: '☕', level: 80 },
    { name: 'Responsive Design', icon: '📱', level: 85 }
  ];

  backendSkills: Skill[] = [
    { name: 'Spring Boot', icon: '🍃', level: 75 },
    { name: 'Java', icon: '☕', level: 80 },
    { name: 'REST APIs', icon: '🔌', level: 80 },
    { name: 'JWT', icon: '🔐', level: 70 },
    { name: 'Microservices', icon: '🏗️', level: 65 }
  ];

  databaseSkills: Skill[] = [
    { name: 'MySQL', icon: '🐬', level: 80 },
    { name: 'PostgreSQL', icon: '🐘', level: 70 },
    { name: 'MongoDB', icon: '🍃', level: 60 },
    { name: 'Firebase', icon: '🔥', level: 75 }
  ];

  toolsSkills: Skill[] = [
    { name: 'Git', icon: '📚', level: 85 },
    { name: 'GitHub', icon: '🐙', level: 90 },
    { name: 'Postman', icon: '📮', level: 80 },
    { name: 'VS Code', icon: '💻', level: 90 },
    { name: 'Docker', icon: '🐳', level: 60 },
    { name: 'Figma', icon: '🎨', level: 70 }
  ];

  learningTechs: LearningTech[] = [
    {
      name: 'React',
      icon: '⚛️',
      description: 'Explorando el ecosistema React y sus librerías'
    },
    {
      name: 'Node.js',
      icon: '🟢',
      description: 'Desarrollo backend con JavaScript y Express'
    },
    {
      name: 'AWS',
      icon: '☁️',
      description: 'Servicios en la nube y despliegue de aplicaciones'
    },
    {
      name: 'GraphQL',
      icon: '📊',
      description: 'APIs más eficientes y flexibles'
    }
  ];
}
