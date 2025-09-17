import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../product.service';
import { Product } from '../model/product';
import { CurrentUserService } from '../current-user.service';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ReactiveFormsModule],
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent {
  productForm: FormGroup;
  updatePicForm: FormGroup;
  product: Product | null = null;
  categories: Array<[string, string]> = []; // Replace with real categories
  route: ActivatedRoute = inject(ActivatedRoute);
  productService: ProductService = inject(ProductService);
  currentUserService: CurrentUserService = inject(CurrentUserService);
  router: Router = inject(Router);
  selectedFile!: File;
  image_base64: string = "";

  constructor(private fb: FormBuilder, private location: Location) {
    // Initialize the form with empty values (will be populated later)
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      brand: [''],
      category: ['', Validators.required],
      color: [''],
    });

    // Initialize the form for updating pictures
    this.updatePicForm = this.fb.group({
      image: [null, Validators.required]
    });

    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProductDetails(productId);
    }
  }

  private async loadProductDetails(id: string): Promise<void> {
    try {
      this.product = await this.productService.getProductDetails(id);
      if (this.product) {
        this.productForm.patchValue({
          name: this.product.name,
          description: this.product.description,
          price: this.product.price,
          brand: this.product.brand,
          category: this.product.category,
          color: this.product.color
        });
      }
    } catch (error) {
      console.error('Error loading product details:', error);
    }
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.image_base64 = reader.result as string;
      console.log(this.image_base64);
    };
    reader.readAsDataURL(this.selectedFile);
    this.updatePicForm.patchValue({ image: this.selectedFile });
  }

  async pictureSubmit(): Promise<void> {
    if (this.updatePicForm.valid) {
      if (!this.product) {
        return;}
      try {
        const success = await this.productService.updatePic(this.product?.id.toString(), this.image_base64);
        if (success) {
          console.log('Picture updated successfully');
        }
      } catch (error) {
        console.error('Error updating picture:', error);
      }
    } else {
      this.updatePicForm.markAllAsTouched();
    }
  }

  async onSubmit(): Promise<void> {
    if (this.productForm.valid && this.product) {
      try {
        // Submit product updates
        const formData = new FormData();
        formData.append('name', this.productForm.get('name')?.value);
        formData.append('description', this.productForm.get('description')?.value);
        formData.append('price', this.productForm.get('price')?.value);
        formData.append('brand', this.productForm.get('brand')?.value);
        formData.append('category', this.productForm.get('category')?.value);
        formData.append('color', this.productForm.get('color')?.value);

        if (this.updatePicForm.valid) {
          await this.pictureSubmit();
        }

        await this.productService.updateProduct(this.product.id.toString(), formData);
        this.router.navigate(['/product-detail', this.product?.id]);
      } catch (error) {
        console.error('Error updating product:', error);
      }
    }
  }

  goBack(): void {
    this.location.back();
  }
}
