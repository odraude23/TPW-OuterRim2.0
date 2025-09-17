import { User } from './user';

export interface Message {
    id: number;
    sender: User; 
    receiver: User; 
    text: string;
    createdAt: string;
}