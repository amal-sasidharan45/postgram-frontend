import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "../service/auth.service";



@Injectable()
export class AuthInterceptor implements HttpInterceptor{
constructor(private AuthService:AuthService){}
intercept(req: HttpRequest<any>, next: HttpHandler){
    const token=this.AuthService.getToken();
    console.log(token);
    const Authreq=req.clone({
        headers:req.headers.set('Authorization',`Bearer ${token}`)
    })
    return next.handle(Authreq);
    
    
}
}