import { User } from './user';
import { Product } from './product';

export interface Order {
    id: number;
    user: User;
    products: Product[];
    date: string; 
}