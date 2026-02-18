import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { DashboardLayoutComponent } from './dashboard-layout.component';

@Component({
  selector: 'app-dashboard-layout-wrapper',
  standalone: true,
  imports: [CommonModule, DashboardLayoutComponent, RouterOutlet],
  template: `
    <app-dashboard-layout>
      <router-outlet></router-outlet>
    </app-dashboard-layout>
  `,
  styles: [`
    :host {
      display: block;
      position: relative;
      min-height: 100dvh;
      z-index: 1;
    }
  `]
})
export class DashboardLayoutWrapperComponent {}
