import { Product } from './product';
import { User } from './user';

export interface Favorite {
    id: number;
    user: User; 
    product: Product; 
}