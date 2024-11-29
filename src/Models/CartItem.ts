export type CartItem = {
  productId: string;   
  productName: string;
  price: number;
  quantity: number;
  image?: string;
  sizeDetails: {
    sizeId : number; 
    sizeName: string; 
    quantity: number }[]; 
  selectedSize: string; 
};

export type CartItem_ = {
  productId: string;  
  productName?: string;
  price: number;
  quantity: number;
  image?: string;
  sizeId?: number;
  sizeDetails?: {
    sizeId : number; 
    sizeName: string; 
    quantity: number }[]; 
  selectedSize?: string; 
};
