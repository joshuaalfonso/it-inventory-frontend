import { Component, Input, Signal } from '@angular/core';
import { ItemList } from '../../item.model';
import { IMAGE_BASE_URL } from '../../../../shared/constant/image';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-item-cards',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './item-cards.component.html',
  styleUrl: './item-cards.component.css'
})
export class ItemCardsComponent {

  @Input() item!: Signal<ItemList[]>;

  imageBaseUrl = IMAGE_BASE_URL;

}
