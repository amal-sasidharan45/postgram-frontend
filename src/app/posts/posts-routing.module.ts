import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostListComponent } from './post-list/post-list.component';
import { PostCreateComponent } from './post-create/post-create.component';
import { authGuard } from '../auth/auth-guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    component:PostListComponent
},
{
  path: 'create',
  component:PostCreateComponent,canActivate:[authGuard]
}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers:[authGuard]
})
export class PostsRoutingModule { }
