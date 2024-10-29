import { Product } from "./product";

export class CartItem {
    id: string;
    name: string;
    description: string;
    unitPrice: number;
    quantity: number;
    imageUrl: string;

    
    constructor(product: Product) {
        this.id = product.id;
        this.name = product.name;
        this.description = product.description;
        this.unitPrice = product.unitPrice;
        this.imageUrl = product.imageUrl;
        this.quantity = 1;
    }
}
