
export interface Comment{
    id:string;
    comment:string,
    username:string;
    postId:string,
    creator:string,
    creatorImg:string,
    duration:string
}
  export function emptyComment(): Comment {
    return {
        id: '',
        comment: "",
        username: "",
        postId: "",
        creator: "",
        creatorImg: "",
        duration:''


    }
}