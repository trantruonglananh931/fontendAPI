export type Product = {
  id: string;
  productName: string;
  quantitySellSucesss?: number;
  description: string;
  image: string;
  quantityStock: number;
  price: number;
  categoryId?: string;
  categoryName?: string;
  imageUrls: string[];
  listStringImage?: string[];
  sizeDetails: {
    sizeId : number;
    sizeName: string;  
    quantity: number;
  }[];
  // sizes: {
  //   sizeId : number;
  //   quantity: number;
  // }[];
  messageDetails?: {
    userName : string;
    time : Date;
    image: string;  
    message: string;
  }[];
  
};

export type NewProduct = {
  productName: string;
  quantitySellSucesss: number;
  description: string;
  image: File | null;
  quantityStock: number;
  price: number;
  categoryId: string;
  imageUrls: string[];
  sizeDetails: {
      sizeId: number;
      quantity: number;
  }[];
};
