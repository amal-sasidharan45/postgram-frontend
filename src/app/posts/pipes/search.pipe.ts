import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
  standalone:false
})
export class SearchPipe implements PipeTransform {

transform(posts: any[], searchTerm:string,userName:string):any[] {
  const result:any=[]

  if(!posts || searchTerm==='' || userName===''){
    return posts;
  }
  posts.forEach((post:any)=>{
    if(post[userName].trim().toLowerCase().includes(searchTerm.toLocaleLowerCase())){
      result.push(post);
    }

  })
  return result;
}

}
