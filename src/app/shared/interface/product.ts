export interface Product {
    id?: number;
    imageUrl: string;
    name: string;
    count: number;
    sizes: {
        width: string;
        height: string;
    };
    weight: string;
    comments: [
        {
            id?: number;
            productId: number;
            description: string;
            date: string;
        }
    ]

}
