import { getItem } from '../utils/mmkv';

export interface Product {
  id: number;
  title: string;
  thumbnail: string;
}

export type Category = {
  id: number;
  name: {
    slug: string;
    name: string;
    url: string;
  };
};


export const fetchAllProducts = async (): Promise<Product[]> => {
  const res = await fetch('https://dummyjson.com/products');
  const data = await res.json();
  return data.products;
};

export const fetchAllCategories = async (): Promise<Category[]> => {
  const res = await fetch('https://dummyjson.com/products/categories');
  const data = await res.json();
  return data.map((name: string, index: number) => ({ id: index + 1, name }));
};

export const fetchProductsByCategory = async (category: string): Promise<Product[]> => {
  const res = await fetch(`https://dummyjson.com/products/category/${category}`);
  const data = await res.json();
  return data.products;
}

export const deleteProduct = async (id: number) => {
  const accessToken = getItem('accessToken');
  const res = await fetch(`https://dummyjson.com/products/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await res.json();
  return data; 
};
