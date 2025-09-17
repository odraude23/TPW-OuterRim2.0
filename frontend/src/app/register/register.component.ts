import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, Location } from "@angular/common";
import { RouterLink, Router } from "@angular/router";
import { RegisterService } from "../register.service";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  register_form!: FormGroup;
  registerService: RegisterService = inject(RegisterService);
  invalid: boolean = false;
  username_exists: boolean = false;
  password_mismatch: boolean = false;

  constructor(private formBuilder: FormBuilder, private location: Location, private router: Router) { }

  ngOnInit(): void {
    this.register_form = this.formBuilder.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirm_password: ['', Validators.required]
    });
  }

  register(): void {
    if (this.register_form.valid) {
      const name: string = this.register_form.value.name;
      const username: string = this.register_form.value.username;
      const email: string = this.register_form.value.email;
      const password: string = this.register_form.value.password;
      const confirm_password: string = this.register_form.value.confirm_password;

      this.username_exists = false;
      this.password_mismatch = false;
      this.invalid = false;

      if (password !== confirm_password) {
        this.password_mismatch = true;
        return;
      }

      this.registerService.checkUsername(username).then((exists: boolean) => {
        if (exists) {
          this.username_exists = true;
          return;
        }
        this.registerService.register(name, username, email, password).then((success: boolean) => {
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
      })
      .catch((error: any) => {
        console.log(error);
        this.invalid = true;
      });
    }
    else {
      this.register_form.markAllAsTouched();
    }    
  }
}
