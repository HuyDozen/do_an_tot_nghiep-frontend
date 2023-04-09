import {ProductModelServer} from "./product.model";


export interface CartModelServer {
  
  total: number;
  data: [{
    product: ProductModelServer,
    numInCart: number
  }];
}
//Dung cho vc luu tru cuc bo
export interface CartModelPublic {
  total: Number;
  prodData: [{
    id: number,
    incart: number
  }]
}
