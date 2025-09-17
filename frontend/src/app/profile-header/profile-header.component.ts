import { Component, inject, Input } from '@angular/core';
import { User } from '../model/user';
import { Comment } from '../model/comment';
import { Location, CommonModule } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { FollowerService } from '../follower.service';
import { CurrentUserService } from '../current-user.service';
import { Follower } from '../model/follower';
import { ProductService } from '../product.service';
import { Product } from '../model/product';
import { ProductBoxComponent } from '../product-box/product-box.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile-header',
  standalone: true,
  imports: [CommonModule, ProductBoxComponent, RouterLink],
  templateUrl: './profile-header.component.html',
  styleUrl: './profile-header.component.css'
})
export class ProfileHeaderComponent {
  @Input() user!: User;
  @Input() comments!: Comment[];
  @Input() seller!: boolean;
  isFollowing!: boolean;
  at: string = "@";
  currentUser: User = {} as User;
  products: Product[] = [];
  followers: number = 0;
  following: number = 0;
  owner: boolean = false;

  followerService: FollowerService = inject(FollowerService);
  currentUserService: CurrentUserService = inject(CurrentUserService);
  productService: ProductService = inject(ProductService);

  constructor(private router: ActivatedRoute, private location: Location) {
    let username: string = this.router.snapshot.paramMap.get('username') ?? '';
    if (typeof username === 'string') {
      this.currentUserService.getCurrentUser().then((user: User) => {
        this.currentUser = user;
        if (this.currentUser.id == this.user.id) {
          this.owner = true;
        }
        this.followerService.getFollowing(this.currentUser.id).then((following: Follower[]) => {
          console.log(following);
          if (following.find(f => f.user.id == this.user.id)) {
            this.isFollowing = true;
          }
          else {
            this.isFollowing = false;
          }
        });
        this.followerService.getFollowers(this.user.id).then((followers: Follower[]) => {
          this.followers = followers.length;
        });
        this.followerService.getFollowing(this.user.id).then((following: Follower[]) => {
          this.following = following.length;
        });
        this.productService.getMyProducts(this.user.id).then((products: Product[]) => {
          this.products = products;
          console.log(this.products);
        });
      });
    }
  }

  follow(): void {
    this.followerService.follow(this.user.id, this.currentUser.id).then((follower: Follower) => {
    });
  }

  unfollow(): void {
    this.followerService.unfollow(this.user.id, this.currentUser.id).then((follower: Follower) => {
    });
  }

  changeFollow(): void {
    if (this.isFollowing) {
      this.unfollow();
      this.isFollowing = false;
      this.followers--;
    }
    else {
      this.follow();
      this.isFollowing = true;
      this.followers++;
    }
  }
}
