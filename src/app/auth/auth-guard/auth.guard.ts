import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../service/auth.service";

@Injectable()
export class authGuard implements CanActivate {
    constructor(private Authservice:AuthService,private route:Router){}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const IsAuth=this.Authservice.getAuth()
      if(!IsAuth){
        this.route.navigate(['/login'])

      }
      return IsAuth
    }
    
}