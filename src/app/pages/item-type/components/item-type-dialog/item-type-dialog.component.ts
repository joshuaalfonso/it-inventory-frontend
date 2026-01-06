import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ItemTypeDialogStore } from '../../item-type.component';
import { ItemTypeStore } from '../../store/item-type.store';
import { MessageService } from 'primeng/api';
import { finalize, take } from 'rxjs';

@Component({
  selector: 'app-item-type-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, ReactiveFormsModule, InputTextModule],
  templateUrl: './item-type-dialog.component.html',
  styleUrl: './item-type-dialog.component.css'
})
export class ItemTypeDialogComponent {


  dialogStore = inject(ItemTypeDialogStore);
  itemTypeStore = inject(ItemTypeStore);
  messageService = inject(MessageService)

  itemTypeForm = this.fb.group({
    item_type_id: [0, [Validators.required]],
    item_type_name: ['', [Validators.required, Validators.minLength(2)]]
  });
  
  submitted: boolean = false;
  isWorking: boolean = false;
  
  constructor(
    private fb: FormBuilder
  ) {
    effect(() => {
      const selectedItem = this.dialogStore.selectedItem();
      if (selectedItem) {
        this.itemTypeForm.setValue({
          item_type_id: selectedItem.item_type_id,
          item_type_name: selectedItem.item_type_name
        })
      } else {
        this.itemTypeForm.reset({
          item_type_id: 0
        })
      }
    })
  }
  
  onSubmit() {
    this.submitted = true;
    if (!this.itemTypeForm.valid) return

    const formValue = this.itemTypeForm.value;
    const selectedItem = this.dialogStore.selectedItem();

    if (selectedItem && (
      formValue.item_type_id === selectedItem.item_type_id &&
      formValue.item_type_name === selectedItem.item_type_name 
    )) {
      this.messageService.add({
        severity: 'warn', 
        summary: 'Warning', 
        detail: 'No changes made.' 
      })
      return
    }

    const data = {
      item_type_id: formValue.item_type_id || 0,
      item_type_name: formValue.item_type_name || ''
    }

    this.isWorking = true;

    let obs = data.item_type_id !== 0 ? this.itemTypeStore.updateItemType(data) : this.itemTypeStore.updateItemType(data);
    
    obs
    .pipe(
      take(1),
      finalize(() => this.isWorking = false)
    ).subscribe({

      next: (response) => {
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Success', 
          detail: response.message || 'No message response' 
        });
        this.onClose();
      },

      error: (error) => {
        console.error(error);
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: error.error?.message || 'Something went wrong.',
          life: 5000
        });
      }
      
    })


  }

  onClose() {
    this.dialogStore.closeDialog()
    this.submitted = false;
    this.itemTypeForm.reset({
      item_type_id: 0
    })
  }

}
