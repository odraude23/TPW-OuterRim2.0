import { Injectable } from '@angular/core';
import { Comment } from './model/comment';
import { User } from './model/user';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private base_url: string = 'http://localhost:8002/';

  constructor() { }

  async getComments(id: number): Promise<Comment[]> {
    const url: string = this.base_url + 'api/user/comments/' + id;
    const data: Response = await fetch(url);

    const comments: Comment[] = await data.json() ?? [];
    return comments;
  }

  async addComment(text: string, rating: number, user: number, seller: number): Promise<Comment> {
    const url: string = this.base_url + 'api/addComment';
    const data: Response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        {
          text: text,
          rating: rating,
          user: user,
          seller: seller
        }
      )
    });

    return await data.json();
  }

  async getAllComments(): Promise<Comment[]> {
    const url: string = this.base_url + 'api/comments';
    const data: Response = await fetch(url);

    const comments: Comment[] = await data.json() ?? [];
    return comments;
  }

  async deleteComment(id: number): Promise<any> {
    const url: string = this.base_url + 'api/deleteComment/' + id;
    const token: string = localStorage.getItem("token") ?? "";
    
    const data: Response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + token
      },
    });

    return await data.text();
  }
}
