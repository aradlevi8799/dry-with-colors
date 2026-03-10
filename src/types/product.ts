export interface ProductImage {
  url: string;
  path: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: ProductImage[];
  displayOrder: number;
  createdAt: Date;
  viewCount?: number;
  outOfStock?: boolean;
  isNew?: boolean;
}
