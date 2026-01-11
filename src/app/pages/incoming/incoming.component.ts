import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { IncomingTableComponent } from './components/incoming-table/incoming-table.component';
import { IncomingStore } from './store/incoming.store';

@Component({
  selector: 'app-incoming',
  standalone: true,
  imports: [CommonModule, IncomingTableComponent, LoadingSpinnerComponent],
  templateUrl: './incoming.component.html',
  styleUrl: './incoming.component.css'
})
export class IncomingComponent implements OnInit {


  incomingStore = inject(IncomingStore);


  ngOnInit(): void {
    this.incomingStore.loadIncoming();
  }

  get incoming() {
    return this.incomingStore.incoming();
  }


}
