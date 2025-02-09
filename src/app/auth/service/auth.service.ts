import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthUser } from '../model/user.interface';
import { environment } from '../../../environment/environment';
import { Observable, Subject } from 'rxjs';
import { Profile } from '../../posts/model/profile.interface';
import { MatSnackBar } from '@angular/material/snack-bar'; // Import MatSnackBar
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token:string='';
  isAuthenticated:boolean=false;
  userId:string=''
private tokenTimer:ReturnType<typeof setTimeout>|any
private AuthStatusListener=new Subject<boolean>();
  constructor(private http:HttpClient,private Router:Router, private snackBar: MatSnackBar){}

    CreateUser(email:string,password:string){
      const AuthUser:AuthUser={
        email:email,
        password:password
      }
      this.http.post(environment.apiUrl + 'Users' + '/signup',AuthUser).subscribe(()=>{
        console.log('User created')
        setTimeout(()=>
  this.Router.navigate(['/login']),
        1000)
      },(error)=>{
        this.AuthStatusListener.next(false)

      })
    }

    login(email:string,password:string){
      const AuthUser:AuthUser={
        email:email,
        password:password
      }
      return this.http.post<{token:string,expiresIn:any,userId:string}>(environment.apiUrl +'Users' + '/login',AuthUser).subscribe((result:any)=>{
        console.log(result);
        this.token=result.token;
        if(this.token){
        const expiresIn=result.expiresIn;
        this.setAuthTimer(expiresIn)

        this.isAuthenticated=true;
        this.userId=result.userId;
        this.AuthStatusListener.next(true);
        const now=new Date();
        const expiration=new Date (now.getTime()+ expiresIn*1000)
        this.SaveAuthData(this.token,expiration,this.userId)
        
        setTimeout(()=>
          this.Router.navigate(['/']),

        1000)

        
        }

        

      },(error)=>{
        this.AuthStatusListener.next(false)
      })
    }

    getUserProfile():Observable<Profile>{
      return this.http.get<Profile>(environment.apiUrl + 'Users' + '/profile')
    }
    UpdateUserProfile(name: string, username: string, description: string, image: any) {
      let userProfile: Profile | FormData;
    
      if (typeof image === 'object') {
        // If the image is a file (object type)
        userProfile = new FormData();
        userProfile.append('name', name);
        userProfile.append('username', username);
        userProfile.append('description', description);
        userProfile.append('image', image);
      } else {
        // If the image is a string (imagePath)
        userProfile = { name: name, username: username, description: description, imagePath: image, creator: '' };
      }
    console.log(userProfile);
    
      return this.http.put(environment.apiUrl + 'Users/updateProfile', userProfile)
    }
    

 getAuth(){
  console.log('is authenticated');
  
  return this.isAuthenticated
}
getuserId(){
  console.log(this.userId);
  
  return this.userId
}
getAuthListener(){
  return this.AuthStatusListener.asObservable()
}
    private SaveAuthData(token:string,expirationDate:any,userId:string){
      localStorage.setItem('token',token);
      localStorage.setItem('expiration',expirationDate);
      localStorage.setItem('userId',userId)
    }

    private clearAuthData(){
      localStorage.removeItem('token');
      localStorage.removeItem('expiration');
      localStorage.removeItem('userId');
    }
    getToken(){
      return this.token
    }
    private getAuthData(){
      const token=localStorage.getItem('token');
      const expirationDate=localStorage.getItem('expiration');
      const UserId=localStorage.getItem('userId')

      if(!token || !expirationDate){
        return;
      }

      return{
        token:token,
        expirationDate: new Date(expirationDate),
        userId:UserId
      }
    }


autoAuthUser(){
  const authInfo=this.getAuthData();
  const now=new Date();
  if(!authInfo)return;

  const expiresIn=authInfo.expirationDate.getTime()- now.getTime()
  if(expiresIn>0){
    this.token=authInfo.token
    this.userId=authInfo.userId!
    this.isAuthenticated=true;

    this.setAuthTimer(expiresIn/1000)
    this.AuthStatusListener.next(true)


}
}
private setAuthTimer(duration:number){
  setTimeout(()=>{this.logout()},duration *1000)

}
    logout(){
      this.isAuthenticated=false,
      this.AuthStatusListener.next(false),
      this.userId=''
      this.token=''
      this.clearAuthData()
      clearTimeout(this.tokenTimer)

      this.Router.navigate(['/'])


    }

}
