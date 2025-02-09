import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-login',

  standalone:false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private Userservice:AuthService) { }
  image:string='assets/logo-ink.png'
islogin:boolean=true;


OnLogin(form:NgForm){
  console.log(form.value);
  if(form.invalid){
    return
  }
  console.log(form.value);
  this.Userservice.login(form.value.username,form.value.password)
  
}
}
