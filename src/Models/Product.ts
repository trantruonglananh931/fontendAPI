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
  listStringImage: string[];
  sizeDetails: {
    sizeId : number;
    sizeName: string;  
    quantity: number;
  }[];
  messageDetails?: {
    userName : string;
    time : Date;
    image?: string;  
    message: string;
  }[];
  
};

export type NewProduct = {
  productName: string;
  quantitySellSucesss: number;
  description: string;
  Image: File | null;
  quantityStock: number;
  price: number;
  categoryId: string;
  imageUrls: string[];
  sizeDetails: {
      sizeId: number;
      quantity: number;
  }[];
};
