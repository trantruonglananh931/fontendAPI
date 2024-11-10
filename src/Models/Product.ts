// src/types/ProductType.ts
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
     imageUrls?: string[];
     listStringImage?: string[];
   };
   
export type NewProduct = {
    productName: string;
    quantitySellSucesss: number;
    description: string;
    image: string;   
    quantityStock: number;
    price: number;
    categoryId: string;
    imageUrls: string[]; 
  };