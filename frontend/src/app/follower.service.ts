import { Injectable } from '@angular/core';
import { Follower } from './model/follower';

@Injectable({
  providedIn: 'root'
})
export class FollowerService {
  private base_url: string = 'http://localhost:8002/';

  constructor() { }

  async getFollowers(id: number): Promise<Follower[]> {
    const url: string = this.base_url + 'api/' + id + '/followers';
    const data: Response = await fetch(url);

    const followers: Follower[] = await data.json() ?? [];
    return followers;
  }

  async getFollowing(id: number): Promise<Follower[]> {
    const url: string = this.base_url + 'api/' + id + '/following';
    const data: Response = await fetch(url);

    const following: Follower[] = await data.json() ?? [];
    return following;
  }

  async follow(user: number, follower: number): Promise<Follower> {
    const url: string = this.base_url + 'api/' + user + '/followUser';
    const data: Response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        {
          follower: follower
        }
      )
    });

    return await data.json() ?? {};
  }

  async unfollow(user: number, follower: number): Promise<Follower> {
    const url: string = this.base_url + 'api/' + user + '/unfollowUser';
    const data: Response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        {
          follower: follower
        }
      )
    });

    return await data.json() ?? {};
  }
}
