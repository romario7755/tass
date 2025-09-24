export interface CheckoutItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description?: string;
  image?: string;
}

export interface Car {
  id: string;
  title: string;
  price: number;
  brand: string;
  model: string;
  year?: number;
  mileage?: number;
  fuel: string;
  transmission: string;
  description: string;
  imageUrl?: string;
  imageUrl2?: string;
  imageUrl3?: string;
  commission?: number;
  netPrice?: number;
}

export interface CheckoutResponse {
  sessionId: string;
  url?: string;
}

export interface ErrorResponse {
  error: string;
}