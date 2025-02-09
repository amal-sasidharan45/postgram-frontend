export interface Profile{
    name:string,
    username:string,
    description:string,
    creator:string
    imagePath:string;
}

export function emptyProfile():Profile{
    return {
        name: "",
        username: "",
        description: "",
        creator: "",
        imagePath:''

        }
}