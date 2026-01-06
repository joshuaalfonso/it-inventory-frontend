import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  isCollapse: { [key: string]: boolean } = {};

  toggleCollapse(menuKey: string): void {
    this.isCollapse[menuKey] = !this.isCollapse[menuKey];
  }

  isCollapsed(menuKey: string): boolean {
    return !!this.isCollapse[menuKey];
  }

}
