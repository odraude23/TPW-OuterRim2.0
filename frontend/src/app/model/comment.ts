import { User } from './user';

export interface Comment {
    id: number;
    text: string | null;
    rating: number;
    user: User; 
    seller: User; 
}