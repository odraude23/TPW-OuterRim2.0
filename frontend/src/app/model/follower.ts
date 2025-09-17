import { User } from './user';

export interface Follower {
    id: number;
    user: User; 
    follower: User;
}