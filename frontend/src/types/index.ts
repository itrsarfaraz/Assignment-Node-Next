export interface User {
  id: number;
  username: string;
  email: string;
  role: any;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: number;
  product: Product;
  quantity: number;
  total_price: any;
  order_date: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
