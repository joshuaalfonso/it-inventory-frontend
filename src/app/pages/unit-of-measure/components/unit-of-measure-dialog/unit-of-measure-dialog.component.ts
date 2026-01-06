import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { UnitOfMeasureDialogStore } from '../../unit-of-measure.component';
import { UnitOfMeasureStore } from '../../store/unit-of-measure.store';
import { MessageService } from 'primeng/api';
import { finalize, take } from 'rxjs';

@Component({
  selector: 'app-unit-of-measure-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, ReactiveFormsModule, InputTextModule],
  templateUrl: './unit-of-measure-dialog.component.html',
  styleUrl: './unit-of-measure-dialog.component.css'
})
export class UnitOfMeasureDialogComponent {

  dialogStore = inject(UnitOfMeasureDialogStore);
  unitOfMeasureStore = inject(UnitOfMeasureStore);
  messageService = inject(MessageService)
  
  uomForm = this.fb.group({
    uom_id: [0, [Validators.required]],
    uom_name: ['', [Validators.required, Validators.minLength(2)]]
  });

  submitted: boolean = false;
  isWorking: boolean = false;
  
  constructor(
    private fb: FormBuilder
  ) {
    effect(() => {
      const selectedItem = this.dialogStore.selectedItem();
      if (selectedItem) {
        this.uomForm.setValue({
          uom_id: selectedItem.uom_id,
          uom_name: selectedItem.uom_name
        })
      } else {
        this.uomForm.reset({
          uom_id: 0
        })
      }
    })
  }
  
  onSubmit() {
    this.submitted = true;
    if (!this.uomForm.valid) return

    const formValue = this.uomForm.value;
    const selectedItem = this.dialogStore.selectedItem();

    if (selectedItem && (
      formValue.uom_id === selectedItem.uom_id &&
      formValue.uom_name === selectedItem.uom_name 
    )) {
      this.messageService.add({
        severity: 'warn', 
        summary: 'Warning', 
        detail: 'No changes made.' 
      })
      return
    }

    const data = {
      uom_id: formValue.uom_id || 0,
      uom_name: formValue.uom_name || ''
    }

    this.isWorking = true;

    let obs = data.uom_id ? this.unitOfMeasureStore.updateUnitOfMeasure(data) : this.unitOfMeasureStore.createUnitOfMeasure(data);
    
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
    this.uomForm.reset({
      uom_id: 0
    })
  }

}
