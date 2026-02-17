import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeroCanvasComponent } from '../hero-canvas/hero-canvas.component';
import { AnalyticsEventsService } from '../../core/services/analytics/analytics-events.service';

@Component({
  selector: 'app-hero-home',
  standalone: true,
  imports: [CommonModule, RouterLink, HeroCanvasComponent],
  templateUrl: './hero-home.component.html',
  styleUrl: './hero-home.component.css'
})
export class HeroHomeComponent {
  private readonly analyticsEvents = inject(AnalyticsEventsService);

  onCtaProjects(): void {
    this.analyticsEvents.trackClickCtaProjects('hero_home');
  }

  onCtaContact(): void {
    this.analyticsEvents.trackClickCtaContact('hero_home');
  }
}
