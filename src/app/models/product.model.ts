export interface ProductModelServer {
    id: number;
    title: string;
    category: string;
    description: string;
    image: string;
    price: number;
    quanity: number;
    images: string;
    shortDesc:string;
  };

  //Du lieu phan hoi cho may chu
  export interface ServerResponse  {
    count: number;
    products: ProductModelServer[];
  };
  