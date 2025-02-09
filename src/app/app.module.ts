import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AuthRoutingModule } from './auth/auth-routing.module';
import { AppRoutingModule } from './app.routes';
import { NavbarComponent } from './navbar/navbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PostsModule } from './posts/posts.module';
import {  HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient } from '@angular/common/http';
import { AuthInterceptor } from './auth/interceptor/auth-interceptor';
import { ErrorInterceptor } from './error-interceptors';
import { NotificationsComponent } from './notifications/notifications.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
 
  NotificationsComponent
 
  ],
  imports: [
    BrowserModule, // Add this to the imports array
    AppRoutingModule,
    AuthRoutingModule,
    PostsModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [
    provideHttpClient(),{
    provide:HTTP_INTERCEPTORS,useClass:AuthInterceptor,multi:true
    
  },
  {
    provide:HTTP_INTERCEPTORS,useClass:ErrorInterceptor,multi:true
    
  },
  
],
  bootstrap: [AppComponent]
})
export class AppModule { }
