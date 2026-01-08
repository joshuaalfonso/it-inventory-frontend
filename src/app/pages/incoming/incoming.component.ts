import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-incoming',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  templateUrl: './incoming.component.html',
  styleUrl: './incoming.component.css'
})
export class IncomingComponent {

}
