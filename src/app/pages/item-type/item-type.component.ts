import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ItemTypeTableComponent } from './components/item-type-table/item-type-table.component';
import { ItemTypeDialogComponent } from './components/item-type-dialog/item-type-dialog.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { ItemTypeStore } from './store/item-type.store';
import { DialogStore } from '../../shared/store/dialog/dialog.store';
import { ItemTypeList } from './item-type.model';
import { ZXingScannerModule } from '@zxing/ngx-scanner';


export const ItemTypeDialogStore = DialogStore<ItemTypeList>();

@Component({
  selector: 'app-item-type',
  standalone: true,
  imports: [CommonModule, ItemTypeTableComponent, ItemTypeDialogComponent, LoadingSpinnerComponent, ZXingScannerModule],
  templateUrl: './item-type.component.html',
  styleUrl: './item-type.component.css',
  providers: [ItemTypeDialogStore]
})
export class ItemTypeComponent implements OnInit {

  itemTypeStore = inject(ItemTypeStore);

  currentDevice: MediaDeviceInfo | undefined;

  ngOnInit(): void {
    this.itemTypeStore.loadItemType();
  }

  handleScan(event: any) {
    console.log(event)
  }

  onScanError(error: any) {
    console.error('ZXing error full:', error);

    if (error.name === 'NotReadableError') {
      alert('Camera is unavailable. Check HTTPS, permissions, or active camera usage.');
    }
  }


  // onCamerasFound(devices: MediaDeviceInfo[]) {
  //   console.log(devices);

  //   const droidCam = devices.find(d =>
  //     d.label.toLowerCase().includes('droidcam')
  //   );

  //   this.currentDevice = droidCam || devices[0];
  // }


}
