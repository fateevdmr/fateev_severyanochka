export interface Product {
    id: number;
    name: string;
    price: number;
    img: string;
    category: string;
    description?: string;
    quantity?: number;
    discountPrice?: number;
}