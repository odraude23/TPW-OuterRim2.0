import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { User } from '../model/user';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import { CurrentUserService } from '../current-user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-settings',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './account-settings.component.html',
  styleUrl: './account-settings.component.css'
})
export class AccountSettingsComponent {
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
  at: string = "@";
  passwordMismatch: boolean = false;
  selectedFile!: File;
  image_base64: string = "";

  currentUserService: CurrentUserService = inject(CurrentUserService);

  updatePicForm!: FormGroup;
  updateProfileForm!: FormGroup;
  updatePasswordForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private location: Location, private router: Router) {
    this.currentUserService.getCurrentUser().then((user: User) => {
      if (user.id) {
        this.user = user;
        this.updateProfileForm.patchValue({
          username: this.user.username,
          name: this.user.name,
          email: this.user.email,
          description: this.user.description
        });
      }
    })
    .catch((error: any) => {
      console.log(error);
    });
    this.updatePicForm = this.formBuilder.group({
      image: ['', [Validators.required]]
    });

    this.updateProfileForm = this.formBuilder.group({
      username: [this.user.username, [Validators.required]],
      name: [this.user.name, [Validators.required]],
      email: [this.user.email, [Validators.required, Validators.email]],
      description: [this.user.description]
    });

    this.updatePasswordForm = this.formBuilder.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  goBack(): void {
    this.location.back();
  }

  deleteAccount(): void {
    this.currentUserService.deleteUser(this.user).then((success: boolean) => {
      if (success) {
        this.router.navigate(['/']).then(() => {
          window.location.reload();
        });
      }
    })
    .catch((error: any) => {
      console.log(error);
    });
  }

  passwordSubmit(): void {
    this.passwordMismatch = false;

    if (this.updatePasswordForm.valid) {
      const newPassword: string = this.updatePasswordForm.value.newPassword;
      const confirmPassword: string = this.updatePasswordForm.value.confirmPassword;

      if (newPassword !== confirmPassword) {
        this.passwordMismatch = true;
        return;
      }

      this.currentUserService.updateUser(this.user, newPassword).then((success: boolean) => {
        if (success) {
          this.router.navigate(['/profile'])
        }
      })
      .catch((error: any) => {
        console.log(error);
      });
    }
    else {
      this.updatePasswordForm.markAllAsTouched();
    }
  }

  profileSubmit(): void {
    if (this.updateProfileForm.valid) {
      const username: string = this.updateProfileForm.value.username;
      const name: string = this.updateProfileForm.value.name;
      const email: string = this.updateProfileForm.value.email;
      const description: string = this.updateProfileForm.value.description;
      this.user.username = username;
      this.user.name = name;
      this.user.email = email;
      this.user.description = description;

      this.currentUserService.updateProfile(this.user).then((success: boolean) => {
        if (success) {
          this.router.navigate(['/profile'])
        }
      })
      .catch((error: any) => {
        console.log(error);
      });
    }
    else {
      this.updateProfileForm.markAllAsTouched();
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.image_base64 = reader.result as string;
      console.log(this.image_base64);
    };
    reader.readAsDataURL(this.selectedFile);
  }

  pictureSubmit(): void {
    if (this.updatePicForm.valid) {
      this.currentUserService.updatePic(this.user, this.image_base64).then((success: boolean) => {
        if (success) {
          this.router.navigate(['/profile'])
        }
      })
      .catch((error: any) => {
        console.log(error);
      });
    }
    else {
      this.updatePicForm.markAllAsTouched();
    }
  }
}
