export interface CategoryModelServer {
    title: string,
    products: [],
    id:string
  };

  //Du lieu phan hoi cho may chu
  export interface ServerResponse  {
    count: number;
    products: CategoryModelServer[];
  };