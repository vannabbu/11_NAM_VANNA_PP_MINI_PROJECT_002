import React from 'react';
import ShopCardComponent2 from '../../../components/shop/shopCardComponent2';
import { fetchProducts } from '@/service/products.service.js';
import { fetchCategories } from '../../../service/categories.service';

export default async function Page() {
  const [products, categories] = await Promise.all([
    fetchProducts() || [],   
    fetchCategories() || []
  ]);


  return (
    <main className="min-h-screen bg-white">
      
      <ShopCardComponent2
        initialProducts={products} 
        realCategories={categories} 
      />
    </main>
  );
}