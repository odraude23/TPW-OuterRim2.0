import { Component, inject } from '@angular/core';
import { User } from '../model/user';
import { Product } from '../model/product';
import { RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { ProductService } from '../product.service';
import { UserService } from '../user.service';
import { CurrentUserService } from '../current-user.service';
import { FormsModule } from "@angular/forms";
import { Comment } from '../model/comment';
import { CommentService } from '../comment.service';
import { Order } from '../model/order';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  users: User[] = [];
  products: Product[] = [];
  comments: Comment[] = [];
  orders: Order[] = [];
  userSearchText: string = "";
  productSearchText: string = "";
  commentSearchText: string = "";
  orderSearchText: string = "";
  filteredUsers: User[] = [];
  filteredProducts: Product[] = [];
  filteredComments: Comment[] = [];
  filteredOrders: Order[] = [];

  userService: UserService = inject(UserService);
  productService: ProductService = inject(ProductService);
  currentUserService: CurrentUserService = inject(CurrentUserService);
  commentService: CommentService = inject(CommentService);
  cartService: CartService = inject(CartService);

  constructor() {
    this.userService.getUsers().then((users: User[]) => {
      this.users = users;
      this.filteredUsers = this.users;
    });
    this.productService.getProducts().then((products: Product[]) => {
      this.products = products;
      this.filteredProducts = this.products;
    });
    this.commentService.getAllComments().then((comments: Comment[]) => {
      this.comments = comments;
      this.filteredComments = this.comments;
    });
    this.cartService.get_all_orders().then((orders: Order[]) => {
      this.orders = orders;
      this.filteredOrders = this.orders;
    });
  }

  deleteUser(user: User): void {
    this.currentUserService.deleteUser(user).then(() => {
      location.reload();
    });
  }

  deleteProduct(product: Product): void {
    this.productService.deleteProduct(product.id).then(() => {
      location.reload();
    });
  }

  deleteComment(comment: number): void {
    this.commentService.deleteComment(comment).then(() => {
      location.reload();
    });
  }

  searchUser(): void {
    this.filteredUsers = this.users.filter(user => user.username.toLowerCase().includes(this.userSearchText.toLowerCase()));
  }

  resetUserSearch(): void {
    this.userSearchText = "";
    this.filteredUsers = this.users;
  }

  searchProduct(): void {
    this.filteredProducts = this.products.filter(product => product.name.toLowerCase().includes(this.productSearchText.toLowerCase()));
  }

  searchOrder(): void {
    this.filteredOrders = this.orders.filter(order => order.user.username.toLowerCase().includes(this.orderSearchText.toLowerCase()));
  }

  resetProductSearch(): void {
    this.productSearchText = "";
    this.filteredProducts = this.products;
  }

  searchComment(): void {
    this.filteredComments = this.comments.filter(comment => comment.user.username.toLowerCase().includes(this.commentSearchText.toLowerCase()));
  }

  resetCommentSearch(): void {
    this.commentSearchText = "";
    this.filteredComments = this.comments;
  }

  resetOrderSearch(): void {
    this.orderSearchText = "";
    this.filteredOrders = this.orders;
  }
}
