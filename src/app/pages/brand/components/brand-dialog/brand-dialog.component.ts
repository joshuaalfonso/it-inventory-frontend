import { Component, effect, inject } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { BrandDialogStore } from '../../brand.component';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { BrandStore } from '../../store/brand.store';
import { finalize, take } from 'rxjs';
import { MessageService } from 'primeng/api';
import { BrandPost } from '../../brand.model';


@Component({
  selector: 'app-brand-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, ReactiveFormsModule, InputTextModule],
  templateUrl: './brand-dialog.component.html',
  styleUrl: './brand-dialog.component.css',
  providers: []
})

export class BrandDialogComponent {

  dialogStore = inject(BrandDialogStore);
  brandStore = inject(BrandStore);
  messageService = inject(MessageService)

  brandForm = this.fb.group({
    brand_id: [0, [Validators.required]],
    brand_name: ['', [Validators.required, Validators.minLength(2)]]
  });

  submitted: boolean = false;
  isWorking: boolean = false;

  constructor(
    private fb: FormBuilder
  ) {
    effect(() => {
      const selectedItem = this.dialogStore.selectedItem();
      if (selectedItem) {
        this.brandForm.setValue({
          brand_id: selectedItem.brand_id,
          brand_name: selectedItem.brand_name
        })
      } else {
        this.brandForm.reset({
          brand_id: 0
        })
      }
    })
  }

  onSubmit() {
    this.submitted = true;
    if (!this.brandForm.valid) return

    const formValue = this.brandForm.value;
    const selectedItem = this.dialogStore.selectedItem();

    if (selectedItem && (
      formValue.brand_id === selectedItem.brand_id &&
      formValue.brand_name === selectedItem.brand_name 
    )) {
      this.messageService.add({
        severity: 'warn', 
        summary: 'Warning', 
        detail: 'No changes made.' 
      })
      return
    }

    const data = {
      brand_id: formValue.brand_id || 0,
      brand_name: formValue.brand_name || ''
    }

    if (formValue.brand_id) {
      this.updateBrand(data);
    } else {
      this.createBrand(data);
    }

  }

  createBrand(newItem: BrandPost) {
    this.isWorking = true;

    this.brandStore.createBrand(newItem)
    .pipe(
      take(1),
      finalize(() => this.isWorking = false)
    ).subscribe({

      next: (response) => {
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Success', 
          detail: response.message || 'Successfully created!' 
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

  updateBrand(newItem: BrandPost) {
    this.isWorking = true;

    this.brandStore.updateBrand(newItem)
    .pipe(
      take(1),
      finalize(() => this.isWorking = false)
    ).subscribe({

      next: (response: any) => {
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Success', 
          detail: response.message || 'Successfully updated!' 
        });
        this.onClose();

      },

      error: (error: any) => {

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
    this.brandForm.reset({
      brand_id: 0
    })
  }

}
