import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { mimetype } from './mime-type.validator';
import { catchError, Subscription, throwError } from 'rxjs';
import { AuthService } from '../../auth/service/auth.service';
import { PostService } from '../service/post.service';
import { Posts } from '../model/post.interface';
import { DomSanitizer } from '@angular/platform-browser';
import { Comment, emptyComment } from '../model/comment.interface';
import { emptyProfile, Profile } from '../model/profile.interface';

@Component({
  selector: 'app-post-list',
  standalone: false,
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css',
})
export class PostListComponent implements OnInit, OnDestroy {
  
  isHeartRed = false;
  isDropdownVisible = false;
  comments: Comment[] = [];
  posts: Posts[] = [];
  userName: string = '';
  showFiller: boolean = false;
  Modalref?: BsModalRef;
  form!: FormGroup;
  CommentForm!: FormGroup;
  ImagePreview: string = '';
  isAuthenticated: boolean = false;
  private authListenerSub: Subscription | any;
  private postSub: Subscription | any;
  userId: string = '';
  isError: boolean = false;
  isLiked: boolean = false;
  CommentId: string = '';
  dropdownCommentId: string = '';
  modalConfig: ModalOptions = {
    class: 'modal-lg',
    backdrop: 'static', // Correct usage: "static" is a valid value here
    keyboard: false, // Ensure it matches the expected type
  };
  Profile: Profile = emptyProfile();
  show: boolean = false;
  CommentLoader: boolean = true;
  NotFound: boolean = false;
  isModalOpen: boolean = false;
  alertModal: boolean = false;
  isDropdownOpen: boolean[] = [];
  likedPosts: boolean[] = [];
  openTab: number | null = null;
  isSearchInputVisible: boolean = false;
  searchTerm: string = '';
  constructor(
    private Router: Router,
    private ModalService: BsModalService,
    private Authservice: AuthService,
    private postService: PostService,
  ) {}

  ngOnDestroy(): void {
    this.authListenerSub?.unsubscribe();
    this.postSub?.unsubscribe();
  }

  ngOnInit(): void {
    history.pushState(null, '', window.location.href);

    // Listen for the popstate event
    window.onpopstate = (event) => {
      // Prevent navigation by pushing the state again
      history.pushState(null, '', window.location.href);
     // alert('Back button is disabled');
    };
  

    this.show = true;
    this.CommentForm = new FormGroup({
      comment: new FormControl('', {
        validators: [Validators.required, Validators.minLength(1)],
      }),
    });

    this.isAuthenticated = this.Authservice.getAuth();
    console.log(this.isAuthenticated);
    this.userId = this.Authservice.getuserId();
    this.authListenerSub = this.Authservice.getAuthListener().subscribe(
      (value) => {
        this.isAuthenticated = value;
        this.userId = this.Authservice.getuserId();
        console.log(this.userId);
      }
    );

    this.postService.getAllPosts();

    this.getAllData();
    // this.startHealthCheck();
  }















  toggleSearchInput(event: MouseEvent) {
    if (!this.isAuthenticated) {
      this.alertModal = true;
    } else {
      event.stopPropagation(); 
      this.isSearchInputVisible = true;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const isSearchIcon = target.closest('.fa-magnifying-glass');
    const isSearchInput = target.closest('.search-input');
    const comment = target.closest('.comment');
    if (!comment) {
      this.openTab = null;
    }

    if (!isSearchIcon && !isSearchInput) {
      this.isSearchInputVisible = false;
    }
  }

  setActiveTab(tab: number) {
    this.openTab = tab;
  }

  getPostsSearch() {
    console.log('fn calls');

    this.postService.getAllPosts();

    this.postSub = this.postService
      .getPostUpdatedListener()
      .subscribe((PostData: { posts: Posts[] }) => {
        // this.posts=PostData.posts

        if (this.userName) {
          const UserNameWords = this.userName.toLowerCase().split('');
          console.log(UserNameWords);

          this.posts = PostData.posts.filter((name: any) =>
            UserNameWords.some((word) =>
              name.userName.toLowerCase().includes(word)
            )
          );
          console.log(this.posts);
          this.likedPosts = this.posts.map((post) =>
            post.likes.some(
              (like) => like.creator === this.userId && like.isLiked
            )
          );
          console.log(this.likedPosts);
          if (this.posts.length == 0) {
            this.NotFound = true;
          } else {
            this.NotFound = false;
          }
        }
      });
  }

  Login() {
    this.Router.navigate(['/login']);
  }
  Signup() {
    this.Router.navigate(['/sign-up']);
  }
  Close() {
    this.Modalref?.hide();
    this.ImagePreview = '';
  }

  closeAlert() {
    this.alertModal = false;
  }
  openTemplate(template: any) {
    if (!this.isAuthenticated) {
      this.alertModal = true;
      return;
    }
    this.form = new FormGroup({
      caption: new FormControl('', {
        validators: [Validators.required, Validators.minLength(1)],
      }),
      image: new FormControl('', {
        validators: [Validators.required],
        // asyncValidators:[mimetype]
      }),
    });
    this.Modalref = this.ModalService.show(template, this.modalConfig);
  }
  Create() {
    if (!this.isAuthenticated) {
      this.alertModal = true;
      return;
    }
    this.Router.navigate(['/create']);
  }
  // OnPickedImg(event:any){
  //   const file=(event.target.files[0])
  //   console.log(file);

  closeDropdown() {
    this.dropdownCommentId = '';
  }

  toggleLike(index: number, post: Posts) {
    if (!this.isAuthenticated) {
      this.alertModal = true;
      return;
    }

    console.log(post);

    const userId = this.userId; // Assuming you have this property set

    // Check if the user has already liked the post
    const likeIndex = post.likes.findIndex((like) => like.creator === userId);

    if (likeIndex !== -1) {
      // User already liked the post, so update the like
      post.likes[likeIndex].isLiked = !post.likes[likeIndex].isLiked;

      // Update the likedPosts array accordingly
      this.likedPosts[index] = post.likes[likeIndex].isLiked;
      console.log(
        post.likes[likeIndex].isLiked ? 'Increment like' : 'Decrement like'
      );

      // Call the API to update the like status
      this.postService
        .updateLike(post.id, post.likes[likeIndex].isLiked, userId)
        .pipe(
          catchError((error) => {
            return throwError(error);
          })
        )
        .subscribe({
          next: (data: any) => {
            console.log('Post updated successfully', data);
          },
          error: (err) => {
            console.error('Error:', err);
          },
        });
    } else {
      // User hasn't liked the post, so add a new like
      post.likes.push({ id: post.id, creator: userId, isLiked: true });
      this.likedPosts[index] = true;
      console.log('Increment like');

      this.postService
        .updateLike(post.id, true, userId)
        .pipe(
          catchError((error) => {
            return throwError(error);
          })
        )
        .subscribe({
          next: (data: any) => {
            console.log('Post updated successfully', data);
          },
          error: (err) => {
            console.error('Error:', err);
          },
        });
    }

    // Update the displayed like count (example logic)
    this.posts[index] = { ...post }; // Trigger change detection if needed
    console.log(this.posts);
  }

  toggleComments(index: number, post: any) {
    this.CommentLoader = true;
    if (!this.isAuthenticated) {
      this.alertModal = true;
      return;
    }
    if (this.openTab !== index && post) {
      this.comments = [emptyComment()]; // Clear comments before fetching

      this.postService.getAllcomments(post.id).subscribe((data: any) => {
        console.log(data);

        // Map the fetched comments to the required structure
        this.comments = data.comments.map((comment: any) => ({
          id: comment._id,
          creatorImg: comment.creatorImg || '',
          creator: comment.creator,
          username: comment.username || 'Anonymous',
          duration: comment.duration,
          comment: comment.comment || '',
        }));
        this.CommentLoader = false;
        console.log('Fetched Comments:', this.comments);
      });
    }

    // Toggle the openTab state
    this.openTab = this.openTab === index ? null : index;
  }

 
  startHealthCheck() {
    setInterval(() => {
      this.healthCheck();
    }, 10000);
  }

  healthCheck() {
    this.postService.getHealth().subscribe((data: any) => {
      //console.log('Health check data:', data);
    });
  }

  getAllData() {
    this.postSub = this.postService
      .getPostUpdatedListener()
      .subscribe((PostData: { posts: Posts[] }) => {
        this.posts = PostData.posts;
        this.show = false;
        console.log(this.posts);
        this.likedPosts = this.posts.map((post) =>
          post.likes.some(
            (like) => like.creator === this.userId && like.isLiked
          )
        );
        console.log(this.likedPosts);
      });

    if (this.isAuthenticated) {
      this.Authservice.getUserProfile()
        .pipe(
          catchError((error) => {
            return throwError(error);
          })
        )
        .subscribe({
          next: (data: any) => {
            this.Profile = data;
          },
          error: (error) => {
            console.log(error);
          },
        });
    }
  }

  countLikes(likes: any[]): number {
    // Filter the likes array to count only the ones where isLiked is true
    return likes.filter((like) => like.isLiked).length;
  }

  onSavePost() {
    console.log('hi');

    if (this.form.invalid) {
      if (this.form.value.image == '' || this.form.value.image == null) {
        this.isError = true;
      }

      // Mark all form controls as touched
      Object.keys(this.form.controls).forEach((controlName) => {
        this.form.controls[controlName].markAsTouched();
      });
      return;
    }
    console.log(this.form.value.image);
    this.postService
      .addposts('Posts', this.form.value.caption, this.form.value.image, [])
      .subscribe((data: any) => {
        console.log(data.post._doc);
        this.posts.push({
          caption: data.post._doc.caption,
          creator: data.post._doc.creator,
          imagePath: data.post._doc.imagePath,
          id: data.post._doc._id,
          userName: data.post._doc.userName,
          profilePicture: data.post._doc.profilePicture,
          TimeDayWeek: data.post._doc.TimeDayWeek,
          likes: data.post._doc.likes,
        });
        console.log(this.posts);
      });
    this.form.reset();
    this.ImagePreview = '';
    this.isError = false;
    this.Modalref?.hide();
  }
  onsaveComment(posId: string) {
    if (this.CommentForm.invalid) {
      return;
    }
    console.log(this.CommentForm.value);
    this.postService
      .saveComment(posId, this.CommentForm.value.comment)
      .pipe(
        catchError((err) => {
          return throwError(err);
        })
      )
      .subscribe({
        next: (data: any) => {
          console.log(data.comment);
          // const {comment,postId,creator,creatorImg,username,duration,id:_id}=data.comment
          this.comments.push({
            comment: data.comment.comment,
            postId: data.comment.postId,
            creator: data.comment.creator,
            creatorImg: data.comment.creatorImg,
            username: data.comment.username,
            duration: data.comment.duration,
            id: data.comment._id,
          });
          console.log(this.comments);

          this.CommentForm.reset();
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  toggleHeartColor() {
    console.log(this.isHeartRed);

    this.isHeartRed = !this.isHeartRed;
  }
  getDuration(time: any) {
    const date1 = new Date(time);
    const date2 = new Date(); // Current date and time

    // Difference in milliseconds
    let diffInMs = +date2 - +date1;

    // Ensure the difference is non-negative
    if (diffInMs < 0) {
      diffInMs = 0;
    }

    // Convert milliseconds to various units
    const seconds = diffInMs / 1000;
    const minutes = seconds / 60;
    const hours = minutes / 60;
    const days = hours / 24;
    const weeks = days / 7;
    const years = days / 365.25;

    let duration;

    if (seconds < 60) {
      duration = `${Math.floor(seconds)} sec ago`;
    } else if (minutes < 60) {
      duration = `${Math.floor(minutes)} min ago`;
    } else if (hours < 24) {
      duration = `${Math.floor(hours)} hr ago`;
    } else if (days < 7) {
      duration = `${Math.floor(days)} ${days < 2 ? 'day' : 'days'} ago`;
    } else if (weeks < 52) {
      duration = `${Math.floor(weeks)} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    } else {
      duration = `on ${date1.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}`;
    }

    return duration;
  }

  OnPickedImg(event: any) {
    const file = event.target.files[0];
    console.log(file);
    this.form.patchValue({ image: file });
    this.form.get('image')?.updateValueAndValidity();
    console.log(this.form);
    const reader = new FileReader();
    reader.onload = () => {
      this.ImagePreview = reader.result as string;
      this.isError = false;
    };
    reader.readAsDataURL(file);
    console.log(this.form.value);
  }

  toggleDropdown(id: string): void {
    this.dropdownCommentId = this.dropdownCommentId === id ? '' : id;
  }

  toggleModal(id: string) {
    this.CommentId = id;
    console.log(this.dropdownCommentId);
    this.isModalOpen = !this.isModalOpen;
  }
  confirmAction() {
    console.log(this.CommentId);

    this.postService
      .deleteComment(this.CommentId)
      .pipe(
        catchError((err) => {
          return throwError(err);
        })
      )
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.isModalOpen = !this.isModalOpen;
          this.comments = this.comments.filter(
            (comment) => comment.id !== this.CommentId
          );
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }
}
