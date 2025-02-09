import { Injectable } from '@angular/core';
import { PostLike, Posts } from '../model/post.interface';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth/service/auth.service';
import { Router } from '@angular/router';
import { environment } from '../../../environment/environment';
import { map, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  BACKEND_URL=environment.apiUrl +'posts/'

private posts:Posts[]=[]
private PostUpdated=new Subject<{posts:Posts[]}>()
  constructor(private http:HttpClient,private router:Router,private userService:AuthService) { }


  
  addposts(title:string,content:string,image:File,like:any){
    const token=this.userService.getToken()
    console.log(token);
    

    const postData=new FormData();
    postData.append('title',title);
    postData.append('caption',content);
    postData.append('image',image,title)
    postData.append('likes', JSON.stringify(like));



    
    return this.http.post<{message:string,post:Posts}>(this.BACKEND_URL,postData)
}
  

  getPostUpdatedListener(){
    return this.PostUpdated.asObservable();
  }
  getPostsForprofile(){
    return this.http.get<{message:string,posts:any}>(environment.apiUrl + 'Posts'  +'/profile-image')
  }
  getAllPosts(){
    return this.http.get<{message:string,posts:any}>(environment.apiUrl + 'Posts').pipe(
      map((postData)=>{
        return {posts:postData.posts.map((posts:any)=>{
          console.log(posts);
          
          return{
            id:posts._id,
            caption:posts.caption,
            imagePath:posts.imagePath,
            creator:posts.creator,
            userName:posts.userName,
            profilePicture:posts.profilePicture,
            TimeDayWeek:posts.TimeDayWeek,
            likes:posts.likes

          }

        })}
      })
    ).subscribe((NewPosts:any)=>{
      console.log(NewPosts);
      
      this.posts=NewPosts.posts
      this.PostUpdated.next({posts:[...this.posts]})
    })
  }

  updatePost(
    id: string,
    caption: string,
    image: any,
    creator: string,
    userName: string,
    profilePicture: string,
    TimeDayWeek: string,
    likes: PostLike[]
  ) {
    let postData: Posts | FormData;
  
    const imageName = 'Posts';
  
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('caption', caption);
      postData.append('image', image, imageName);
      postData.append('creator', creator);
      postData.append('userName', userName);
      postData.append('profilePicture', profilePicture);
      postData.append('TimeDayWeek', TimeDayWeek);
      postData.append('likes', JSON.stringify(likes));
        } else {
      postData = {
        id,
        caption,
        imagePath: image,
        creator,
        userName,
        profilePicture,
        TimeDayWeek,
        likes,
      };
    }
  
    return this.http.put<{ message: string; post: Posts }>(
      `${this.BACKEND_URL}${id}`,
      postData
    );
  }
  

   deletePost(postId:string){
    return this.http.delete(`${this.BACKEND_URL}${postId}`);
   }
deleteComment(commentId:string){
  console.log(commentId);
  
  return this.http.delete(`${this.BACKEND_URL}comment/${commentId}`);

}
   saveComment(postId:any,comment:any){
    const commentData = new FormData();
    commentData.append('id', postId);
    commentData.append('comment', comment);
    return this.http.post(`${this.BACKEND_URL}${postId}`, commentData);
   }


   getAllcomments(postId:string){
    return this.http.get(`${this.BACKEND_URL}${postId}`);
   }


   updateLike(id: string, likes: boolean, creator: string) {
    const postData = new FormData();
    postData.append('id', id);
    postData.append('likes', String(likes)); // Send as string, 'true' or 'false'
    postData.append('creator', creator);
  
    return this.http.put(`${this.BACKEND_URL}UpdateLike/${id}`, postData);
  }
  

}