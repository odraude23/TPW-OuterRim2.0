import { Component, inject, Input } from '@angular/core';
import { CommonModule, Location } from "@angular/common";
import { User } from '../model/user';
import { Comment } from '../model/comment';
import { ActivatedRoute, RouterLink } from "@angular/router";
import { ProfileHeaderComponent } from '../profile-header/profile-header.component';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import { CommentService } from '../comment.service';
import { UserService } from '../user.service';
import { CurrentUserService } from '../current-user.service';

@Component({
  selector: 'app-seller-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, ProfileHeaderComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './seller-profile.component.html',
  styleUrl: './seller-profile.component.css'
})
export class SellerProfileComponent {
  @Input() user!: User;
  comments: Comment[] = [];
  comment_form!: FormGroup;
  commentError: boolean = false;
  ratingError: boolean = false;
  currentUser: User = {} as User;
  
  commentService: CommentService = inject(CommentService);
  userService: UserService = inject(UserService);
  currentUserService: CurrentUserService = inject(CurrentUserService);

  constructor(private route: ActivatedRoute, private location: Location, private formBuilder: FormBuilder) {
    let username: string = this.route.snapshot.paramMap.get('username') ?? '';
    if (typeof username === 'string') {
      this.userService.getUserByUsername(username).then((user: User) => {
        if (user.id) {
          this.user = user;
          this.commentService.getComments(this.user.id).then((comments: Comment[]) => {
            this.comments = comments;
          });
        }
      })
      .catch((error: any) => {
        console.log(error);
      });
      this.currentUserService.getCurrentUser().then((user: User) => {
        this.currentUser = user;
      });
      this.comment_form = this.formBuilder.group({
        comment: ['', [Validators.required]],
        rating_input: ['0', [Validators.required]]
      });
    }
  }

  commentSubmit(): void {
    if (this.comment_form.valid) {
      this.commentError = false;
      this.ratingError = false;
      let selectedRating: number = parseInt(this.comment_form.value.rating_input, 10);
      let text: string = this.comment_form.value.comment;
      this.comment_form.reset();

      this.commentService.addComment(text, selectedRating, this.currentUser.id, this.user.id).then((comment: Comment) => {
        this.comments.unshift(comment);
      })
      .catch((error: any) => {
        console.log(error);
      });
    }
    else {
      this.commentError = this.comment_form.value.comment === '' || this.comment_form.value.comment === null;
      this.ratingError = this.comment_form.value.rating_input === '0' || this.comment_form.value.rating_input === null;
    }
  }

  goBack(): void {
    this.location.back();
  }
}
