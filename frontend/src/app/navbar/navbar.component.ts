import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from "@angular/common";
import { User } from '../model/user';
import { CurrentUserService } from '../current-user.service';
import { LogoutService } from '../logout.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
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

  currentUserService: CurrentUserService = inject(CurrentUserService);
  logoutService: LogoutService = inject(LogoutService);

  constructor(private router: Router) {
    this.currentUserService.getCurrentUser().then((user: User) => {
      if (user.id) {
        this.user = user;
      }
    })
    .catch((error: any) => {
      console.log(error);
    });
  }

  logout(): void {
    this.logoutService.logout().then((success: boolean) => {
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
}
