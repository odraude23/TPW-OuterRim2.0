import { Component, inject } from '@angular/core';
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { User } from '../model/user';
import { Comment } from '../model/comment';
import { Follower } from '../model/follower';
import { CurrentUserService } from '../current-user.service';
import { CommentService } from '../comment.service';
import { FollowerService } from '../follower.service';
import { ProfileHeaderComponent } from '../profile-header/profile-header.component';
import { CartService } from '../cart.service';
import { Order } from '../model/order';

@Component({
  selector: 'app-account-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, ProfileHeaderComponent],
  templateUrl: './account-profile.component.html',
  styleUrl: './account-profile.component.css'
})
export class AccountProfileComponent {
  user: User = {
    id: 0,
    username: "",
    name: "",
    email: "",
    admin: false,
    get_image: "",
    description: "",
    sold: 0,
  };
  comments: Comment[] = [];
  followers: Follower[] = [];
  orders: Order[] = []; 

  currentUserService: CurrentUserService = inject(CurrentUserService);
  commentService: CommentService = inject(CommentService);
  followerService: FollowerService = inject(FollowerService);
  cartService: CartService = inject(CartService);

  constructor() {
    this.currentUserService.getCurrentUser().then((user: User) => {
      if (user.id) {
        this.user = user;
        this.commentService.getComments(this.user.id).then((comments: Comment[]) => {
          this.comments = comments;
        });
        this.followerService.getFollowers(this.user.id).then((followers: Follower[]) => {
          this.followers = followers;
        });
        this.cartService.get_order(this.user.id).then((order: Order[]) => {
          this.orders = order;
        });
      }
    })
    .catch((error: any) => {
      console.log(error);
    });
  }
}
