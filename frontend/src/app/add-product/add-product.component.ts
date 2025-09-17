import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../product.service';
import { CurrentUserService } from '../current-user.service';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../model/user'; // Assuming you have a User model

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ReactiveFormsModule],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent {
  productForm: FormGroup;
  currentUser: User | null = null;
  selectedFile!: File;
  image_base64: string = "";

  productService: ProductService = inject(ProductService);
  currentUserService: CurrentUserService = inject(CurrentUserService);
  router: Router = inject(Router);

  constructor(private fb: FormBuilder, private location: Location) {
    // Initialize the form
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      brand: [''],
      category: ['', Validators.required],
      color: [''],
      image: [null]
    });

    // Fetch the current user
    this.currentUserService.getCurrentUser().then(user => {
      this.currentUser = user;
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.image_base64 = reader.result as string;
    };
    reader.readAsDataURL(this.selectedFile);
  }

  onSubmit(): void {
    if (this.productForm.valid && this.currentUser) {
      const formData = new FormData();
      formData.append('name', this.productForm.get('name')?.value);
      formData.append('description', this.productForm.get('description')?.value);
      formData.append('price', this.productForm.get('price')?.value);
      formData.append('brand', this.productForm.get('brand')?.value);
      formData.append('category', this.productForm.get('category')?.value);
      formData.append('color', this.productForm.get('color')?.value);
      formData.append('image', this.image_base64);
      formData.append('user', JSON.stringify(this.currentUser));

      this.productService.addProduct(formData).then((success: boolean) => {
        // Navigate back if the request is successful
        if (success) {
          console.log('Product added successfully');
          this.location.back();
        }
      }).catch(error => {
        console.error('Error adding product:', error);
      });

    }
  }
}
