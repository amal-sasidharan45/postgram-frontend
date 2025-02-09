import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-sign-up',

  standalone:false,
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
constructor( private authService:AuthService){}

  onsubmit(form:NgForm){
    console.log(form.value);
    if(form.invalid){
      return;
    }
    console.log(form);
    this.authService.CreateUser(form.value.username,form.value.password)
    
  }

}
