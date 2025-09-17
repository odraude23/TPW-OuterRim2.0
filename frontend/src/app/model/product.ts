import { User } from './user';

export interface Product {
    id: number;
    name: string;
    description: string | null;
    price: number;
    image: string | null;
    user: User;
    seen: number;
    brand: string | null;
    category: "WEAPON" | "LEGO" | "FIGURES" | "POSTER" | "COLLECTIBLE" | "OTHER";
    color: string | null;
    sold: boolean;
}