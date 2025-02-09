import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostsRoutingModule } from './posts-routing.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PostListComponent } from './post-list/post-list.component';
import { PostCreateComponent } from './post-create/post-create.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import {MatSidenavModule} from '@angular/material/sidenav';
import { ClickOutsideDirective } from './post-create/clickoutside.component';
import { SearchPipe } from './pipes/search.pipe';
@NgModule({
  declarations: [PostListComponent,PostCreateComponent,ClickOutsideDirective,SearchPipe],
  imports: [
    CommonModule,
    PostsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    MatInputModule,
    MatSidenavModule
    
 

  ]
})
export class PostsModule { }
