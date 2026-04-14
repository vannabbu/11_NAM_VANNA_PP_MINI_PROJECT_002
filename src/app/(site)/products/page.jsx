
import React from 'react';
import ShopCardComponent from '../../../components/shop/ShopCardComponent';
import { fetchProducts } from '@/service/products.service.js';
import { fetchCategories } from '../../../service/categories.service';

export default async function Page() {

  const [products, categories] = await Promise.all([
    fetchProducts(),
    fetchCategories()
  ]);

  return (
    <main className="min-h-screen bg-white">
      <ShopCardComponent initialProducts={products} realCategories={categories} />
    </main>
  );
}