export interface PostLike {
  id: string;
  creator: string;
  isLiked: boolean;
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
 