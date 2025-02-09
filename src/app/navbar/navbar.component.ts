import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/service/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit,OnDestroy {
  isAuthenticated:boolean=false;
  private authListenerSub:Subscription|any
  constructor(private router: Router,private Authservice:AuthService) {}
  isMenuActive: boolean = false;

  toggleMenu() {
    this.isMenuActive = !this.isMenuActive;
  }
home(){
  this.router.navigate(['/']);
}
  ngOnInit(): void {
    this.isAuthenticated=this.Authservice.getAuth()
this.authListenerSub=this.Authservice.getAuthListener().subscribe((value)=>{
  this.isAuthenticated=value

})
  }
  ngOnDestroy(): void {
    this.authListenerSub.unsubscribe()
  }
  
Onlogout(){
  this.Authservice.logout()
}
  login() {
    this.router.navigate(['/login']);
  }


  signup() {
    this.router.navigate(['/sign-up']);
  }
}
