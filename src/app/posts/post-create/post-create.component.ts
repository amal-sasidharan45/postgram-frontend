import { Component, HostListener, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { AuthService } from '../../auth/service/auth.service';
import { emptyProfile, Profile } from '../model/profile.interface';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { mimetype } from '../post-list/mime-type.validator';
import { catchError, throwError } from 'rxjs';
import { PostService } from '../service/post.service';
import {
  emptyLikes,
  emptyPosts,
  PostLike,
  Posts,
} from '../model/post.interface';

@Component({
  selector: 'app-post-create',
  standalone: false,
  templateUrl: './post-create.component.html',
  styleUrl: './post-create.component.css',
})
export class PostCreateComponent implements OnInit {
  ProfilePosts: Posts[] = [];
  form!: FormGroup;
  Form!: FormGroup;
  modalRef?: BsModalRef;
  ImagePreviewEdit: string = '';
  private postId: string = '';
  show: boolean = true;
  modalConfig: ModalOptions = {
    class: 'modal-lg',
    backdrop: 'static',
    keyboard: false, 
  };
  path: string = 'assets/user.png';
  ImagePreview: string = '';
  selectedImage: string | null = null;
  isModalOpen = false;
  PostLikes: PostLike[] = [emptyLikes()];
  Profile: Profile = emptyProfile();
  isOpen = false;

  isDropdownOpen: boolean[] = [];
  isError: boolean = false;


  constructor(
    private modalService: BsModalService,
    private userService: AuthService,
    private postService: PostService
  ) {}
  ngOnInit(): void {
    this.show = true;
    this.form = new FormGroup({
      username: new FormControl('', {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      name: new FormControl('', {
        validators: [Validators.required, Validators.minLength(1)],
      }),
      description: new FormControl('', {}),
      image: new FormControl('', {
        validators: [Validators.required],
        asyncValidators: [mimetype],
      }),
    });
    this.getData()
  }
  getData() {
    this.userService
      .getUserProfile()
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      )
      .subscribe({
        next: (data: any) => {
          this.Profile = data;
          this.show = false;
        },
        error: (error) => {
          console.log(error);
          this.show = false;
        },
      });
    this.postService
      .getPostsForprofile()
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      )
      .subscribe({
        next: (data: any) => {
          this.ProfilePosts = data.posts;
          console.log(this.ProfilePosts);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  toggleDropdown(index: number) {
    this.isDropdownOpen[index] = !this.isDropdownOpen[index];
  }

  closeDropdown(index: number) {
    this.isDropdownOpen[index] = false;
  }
  OpentemplateEdit(template: any, post: any) {
    this.Form = new FormGroup({
      caption: new FormControl('', {
        validators: [Validators.required, Validators.minLength(1)],
      }),
      image: new FormControl('', {
        validators: [Validators.required],
        // asyncValidators:[mimetype]
      }),
      TimeDayWeek: new FormControl(''),
      creator: new FormControl(''),
      profilePicture: new FormControl(''),
      userName: new FormControl(''),
      imagePath: new FormControl(''),
    });
    console.log(post);
    this.PostLikes = post.likes;
    this.postId = post._id;
    this.ImagePreviewEdit = post.imagePath;
    this.Form?.setValue({
      caption: post.caption,
      image: post.imagePath,
      TimeDayWeek: post.TimeDayWeek,
      creator: '',
      imagePath: post.imagePath,
      profilePicture: post.profilePicture,
      userName: post.userName,
    });

    this.modalRef = this.modalService.show(template, this.modalConfig);
  }

  OpenTemplate(template: any) {
    this.modalRef = this.modalService.show(template, this.modalConfig);
    this.ImagePreview = this.Profile?.imagePath || this.path;
    this.form?.setValue({
      username: this.Profile?.username,
      name: this.Profile?.name,
      description: this.Profile?.description,
      image: this.Profile?.imagePath,
    });
  }

  onSaveProfile() {
    console.log(this.form.value.image);
    if (this.form.invalid) {
      // Mark all form controls as touched
      Object.keys(this.form.controls).forEach((controlName) => {
        this.form.controls[controlName].markAsTouched();
      });
      return;
    }
    console.log(this.form.value);
    this.userService
      .UpdateUserProfile(
        this.form.value.name,
        this.form.value.username,
        this.form.value.description,
        this.form.value.image
      )
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      )
      .subscribe({
        next: (data: any) => {
          console.log('Profile updated successfully', data);

          this.closeModal();
        },
        error: (err) => {
          console.error('Error:', err);
        },
      });
  }

  toggleModal(post: any) {
    if (post) {
      this.postId = post._id;
    }

    this.isModalOpen = !this.isModalOpen;
  }

  confirmAction() {
    this.postService
      .deletePost(this.postId)
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      )
      .subscribe({
        next: (data: any) => {
          console.log('Post deleted successfully', data);
          this.closeModal();
          this.isModalOpen = !this.isModalOpen;
        },
        error: (error: any) => {
          console.error('Error:', error);
        },
      });
  }

  onUpdate() {
    console.log(this.Form.value);
    if (this.Form.invalid) {
      if (this.Form.value.image == '' || this.Form.value.image == null) {
        this.isError = true;
      }

      Object.keys(this.Form.controls).forEach((controlName) => {
        console.log(controlName);

        this.Form.controls[controlName].markAsTouched();
      });
      return;
    }
    const Values = this.Form.value;
    console.log(this.PostLikes);

    this.postService
      .updatePost(
        this.postId,
        Values.caption,
        Values.image,
        Values.creator,
        Values.userName,
        Values.profilePicture,
        Values.TimeDayWeek,
        this.PostLikes
      )
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      )
      .subscribe({
        next: (data: any) => {
          console.log('Post updated successfully', data);
          this.closeModal();
          this.PostLikes=[]
        },
        error: (err) => {
          console.error('Error:', err);
        },
      });
  }
  closeModal() {
    this.modalRef?.hide();
    this.userService.getUserProfile().subscribe((data: any) => {
      this.Profile = data;

      console.log(this.Profile);
      this.postService
        .getPostsForprofile()
        .pipe(
          catchError((error) => {
            return throwError(error);
          })
        )
        .subscribe({
          next: (data: any) => {
            console.log(data);

            this.ProfilePosts = data.posts;
            console.log(this.ProfilePosts);
          },
          error: (error) => {
            this.ProfilePosts = [];
            console.error('Error:', error);
          },
        });
    });
  }
  openImagePreview(imageUrl: string) {
    console.log(imageUrl);

    this.selectedImage = imageUrl;
  }

  closePreview() {
    this.selectedImage = null;
  }
  OnPickedImgEdit(event: any) {
    const file = event.target.files[0];
    console.log(file);
    this.Form.patchValue({ image: file });
    this.Form.get('image')?.updateValueAndValidity();
    console.log(this.form);
    const reader = new FileReader();
    reader.onload = () => {
      this.ImagePreviewEdit = reader.result as string;
      // this.isError=false
    };
    reader.readAsDataURL(file);
    console.log(this.form.value);
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
      // this.isError=false
    };
    reader.readAsDataURL(file);
    console.log(this.form.value);
  }
}
