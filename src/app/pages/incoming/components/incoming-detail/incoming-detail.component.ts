import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IncomingList } from '../../incoming.model';
import { IncomingService } from '../../incoming.service';
import { finalize, take } from 'rxjs';
import { Message } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { DividerModule } from 'primeng/divider';
import { IMAGE_BASE_URL } from '../../../../shared/constant/image';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-incoming-detail',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, MessagesModule, DividerModule, TableModule, ButtonModule],
  templateUrl: './incoming-detail.component.html',
  styleUrl: './incoming-detail.component.css'
})
export class IncomingDetailComponent implements OnInit {

  imageBaseUrl = IMAGE_BASE_URL;

  route = inject(ActivatedRoute);
  incomingService = inject(IncomingService);
  location = inject(Location);

  incoming: IncomingList | undefined;
  isLoading: boolean = false;
  errorMessage: Message[] | undefined;

  ngOnInit(): void {
    const incomingID = this.route.snapshot.paramMap.get('incoming_id');
    const incomingIDNumber = Number(incomingID || 0);
    

    if (incomingIDNumber) {
      this.isLoading = true;
      this.incomingService.getIncomingByIDApi(incomingIDNumber)
      .pipe(
        take(1),
        finalize(() => this.isLoading = false)
      ).subscribe({
        next: (response) => {
          console.log(response)
          this.incoming = response;
        },
        error: ({error}) => {
          console.log(error);
          this.errorMessage = [
            { severity: 'error', summary: error.message || 'Failed to load data. Please try again later.' },
        ];
        }
      })
    }

  }

  goBack() {
    this.location.back();
  }


}
