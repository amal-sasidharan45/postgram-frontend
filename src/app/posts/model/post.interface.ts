export interface PostLike {
  id: string;
  creator: string;
  isLiked: boolean;
}
export function emptyLikes(): PostLike {
  return {
    id: '',
    creator: '',
    isLiked: false

  }
}
export interface Posts {
  id: string;
  caption: string;
  imagePath: string;
  creator: string;
  userName: string;
  profilePicture: string;
  TimeDayWeek: string;
  likes: PostLike[]; 
}

  
  export function emptyPosts(): Posts {
    return {
      id: '',
      caption: '',
      imagePath: '',
      creator: '',
      userName: '',
      profilePicture: '',
      TimeDayWeek:'',
      likes:[{
        id: '',
        creator: '',
        isLiked: false
      }]
     
    };
  }
 