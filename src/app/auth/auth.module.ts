import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';


@NgModule({
  declarations: [LoginComponent,SignUpComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
      FormsModule,
        ReactiveFormsModule,
        MatInputModule
  ]
})
export class AuthModule { }
