import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AnalyticsEventsService } from '../services/analytics/analytics-events.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  private readonly analyticsEvents = inject(AnalyticsEventsService);

  onEmailClick(): void {
    this.analyticsEvents.trackClickContactEmail('footer');
  }

  onGitHubClick(): void {
    this.analyticsEvents.trackClickSocial('github', 'footer');
  }

  onLinkedInClick(): void {
    this.analyticsEvents.trackClickContactLinkedIn('footer');
  }
}
