import { Component, effect, inject, OnInit } from '@angular/core';
import { ItemDialogStore } from '../../item.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { BrandStore } from '../../../brand/store/brand.store';
import { DropdownModule } from 'primeng/dropdown';
import { CategoryStore } from '../../../category/store/category.store';
import { ItemTypeStore } from '../../../item-type/store/item-type.store';
import { UnitOfMeasureStore } from '../../../unit-of-measure/store/unit-of-measure.store';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ItemStore } from '../../store/item.store';
import { finalize, take } from 'rxjs';
import { MessageService } from 'primeng/api';
import { compressImage } from '../../../../shared/util/image-compress';
import { ImageModule } from 'primeng/image';
import { IMAGE_BASE_URL } from '../../../../shared/constant/image';

@Component({
  selector: 'app-item-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DialogModule, ButtonModule, InputTextModule, DropdownModule, InputTextareaModule, ImageModule],
  templateUrl: './item-dialog.component.html',
  styleUrl: './item-dialog.component.css'
})
export class ItemDialogComponent implements OnInit {

  itemStore = inject(ItemStore);
  dialogStore = inject(ItemDialogStore);
  brandStore = inject(BrandStore);
  categoryStore = inject(CategoryStore);
  itemTypeStore = inject(ItemTypeStore);
  unitOfMeasureStore = inject(UnitOfMeasureStore);
  messageService = inject(MessageService);

  itemForm = this.fb.group({
    item_id: [0, [Validators.required]],
    image: [null as File | null],
    item_name: ['', [Validators.required, Validators.minLength(2)]],
    brand_id: [0, [Validators.required, Validators.min(1)]],
    category_id: [0, [Validators.required, Validators.min(1)]],
    item_type_id: [0, [Validators.required, Validators.min(1)]],
    uom_id: [0, [Validators.required, Validators.min(1)]],
  });

  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;

  submitted: boolean = false;
  isWorking: boolean = false;

  imageBaseUrl = IMAGE_BASE_URL;

  constructor(
    private fb :FormBuilder
  ) {
    effect(() => {
      const selectedItem = this.dialogStore.selectedItem();

      if (selectedItem) {
        this.itemForm.setValue({
          item_id: selectedItem.item_id,
          image: null,
          item_name: selectedItem.item_name,
          brand_id: selectedItem.brand_id,
          category_id: selectedItem.category_id,
          item_type_id: selectedItem.item_type_id,
          uom_id: selectedItem.uom_id,
        })
      } else {
        this.selectedFile = null;
        this.previewUrl = null;
        this.itemForm.reset({
          item_id: 0
        })
      }

    }, {allowSignalWrites: true})
  }

  ngOnInit(): void {
    
  }

  onClose() {
    this.dialogStore.closeDialog();
    this.submitted = false;
    this.itemForm.reset({
      item_id: 0
    })
    this.previewUrl = null;
    this.selectedFile = null;
    this.itemForm.get('image')?.updateValueAndValidity();
  }

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const compressedBlob = await compressImage(file, 0.6);
     // Convert Blob → File
    const compressedFile = new File(
      [compressedBlob],
      file.name,
      { type: 'image/jpeg' }
    );

    this.selectedFile = compressedFile;

    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result;
    };
    reader.readAsDataURL(compressedFile);

    this.itemForm.patchValue({ image: compressedFile });
    this.itemForm.get('image')?.updateValueAndValidity();
  }

  onSubmit() {
    this.submitted = true;

    if (!this.itemForm.valid) return;
    const {
      item_id, 
      image, 
      item_name, 
      brand_id, 
      category_id, 
      item_type_id, 
      uom_id
    } = this.itemForm.value;
    const selectedItem = this.dialogStore.selectedItem();

    if (selectedItem && !this.selectedFile && (
      selectedItem.item_id === item_id &&
      selectedItem.item_name === item_name &&
      selectedItem.brand_id === brand_id &&
      selectedItem.category_id === category_id &&
      selectedItem.item_type_id === item_type_id 
    )) {
      this.messageService.add({
        severity: 'warn', 
        summary: 'Warning', 
        detail: 'No changes made.' 
      })
      return
    }

    const formData = new FormData();

    formData.append('item_id', String(item_id));
    if (image instanceof File) {
      formData.append('image', image);
    }
    formData.append('item_name', String(item_name));
    formData.append('brand_id', String(brand_id));
    formData.append('category_id', String(category_id));
    formData.append('item_type_id', String(item_type_id));
    formData.append('uom_id', String(uom_id));

    let obs = this.itemForm.value.item_id ? this.itemStore.updateItem(formData) : this.itemStore.createItem(formData);

    this.isWorking = true;

    obs
    .pipe(
      take(1),
      finalize(() => this.isWorking = false)
    ).subscribe({

      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: response.message || 'No message.'
        })
        this.onClose();
      },

      error: ({error}) => {
        console.log(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Something went wrong.'
        })
      }

    })

  }

}
