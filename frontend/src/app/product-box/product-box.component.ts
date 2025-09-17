import { Component, Input } from '@angular/core';
import { Product } from '../model/product';
import { ProductService } from '../product.service';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../product-card/product-card.component';


@Component({
  selector: 'app-product-box',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './product-box.component.html',
  styleUrl: './product-box.component.css'
})
export class ProductBoxComponent{
  @Input() products: Product[] = [];

  constructor(private productService: ProductService) {}

}
