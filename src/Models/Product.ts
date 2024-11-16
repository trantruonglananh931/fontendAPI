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
  sizeDetails?: {
      sizeId: number;
      quantity: number;
  }[];
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
  sizeDetails: {
      sizeId: number;
      quantity: number;
  }[];
};
