import { Component, effect, inject } from '@angular/core';
import { CategoryDialogStore } from '../../category.component';
import { CategoryStore } from '../../store/category.store';
import { MessageService } from 'primeng/api';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize, take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-category-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, ReactiveFormsModule, InputTextModule],
  templateUrl: './category-dialog.component.html',
  styleUrl: './category-dialog.component.css'
})
export class CategoryDialogComponent {

  dialogStore = inject(CategoryDialogStore);
  categoryStore = inject(CategoryStore);
  messageService = inject(MessageService)

  categoryForm = this.fb.group({
    category_id: [0, [Validators.required]],
    category_name: ['', [Validators.required, Validators.minLength(2)]]
  });

  submitted: boolean = false;
  isWorking: boolean = false;

  constructor(
    private fb: FormBuilder
  ) {
    effect(() => {
      const selectedItem = this.dialogStore.selectedItem();
      if (selectedItem) {
        this.categoryForm.setValue({
          category_id: selectedItem.category_id,
          category_name: selectedItem.category_name
        })
      } else {
        this.categoryForm.reset({
          category_id: 0
        })
      }
    })
  }

  onSubmit() {
    this.submitted = true;
    if (!this.categoryForm.valid) return

    const formValue = this.categoryForm.value;
    const selectedItem = this.dialogStore.selectedItem();

    if (selectedItem && (
      formValue.category_id === selectedItem.category_id &&
      formValue.category_name === selectedItem.category_name 
    )) {
      this.messageService.add({
        severity: 'warn', 
        summary: 'Warning', 
        detail: 'No changes made.' 
      })
      return
    }

    const data = {
      category_id: formValue.category_id || 0,
      category_name: formValue.category_name || ''
    }

    this.isWorking = true;

    let obs = data.category_id ? this.categoryStore.updateCategory(data) : this.categoryStore.createCategory(data);
    
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
    this.categoryForm.reset({
      category_id: 0
    })
  }

}
