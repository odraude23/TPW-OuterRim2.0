export interface User {
    id: number;
    username: string;
    name: string;
    email: string;
    admin: boolean;
    get_image: string;
    description: string | null;
    sold: number;
}