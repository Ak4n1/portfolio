import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../organisms/sidebar/sidebar.component';
import { DashboardHeaderComponent } from '../../organisms/dashboard-header/dashboard-header.component';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, SidebarComponent, DashboardHeaderComponent],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardLayoutComponent {}
