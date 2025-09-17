import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { LoginService } from '../login.service';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  login_form!: FormGroup;
  loginService: LoginService = inject(LoginService);
  invalid: boolean = false;

  constructor(private formBuilder: FormBuilder, private location: Location, private router: Router) { }

  ngOnInit(): void {
    this.login_form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login(): void {
    if (this.login_form.valid) {
      const username: string = this.login_form.value.username;
      const password: string = this.login_form.value.password;

      this.loginService.login(username, password).then((success: boolean) => {
        if (success) {
          this.router.navigate(['/']).then(() => {
            window.location.reload();
          });
        }
        else {
          this.invalid = true;
        }
      })
      .catch((error: any) => {
        console.log(error);
        this.invalid = true;
      });
    }
    else {
      this.login_form.markAllAsTouched();
    }
  }
}
