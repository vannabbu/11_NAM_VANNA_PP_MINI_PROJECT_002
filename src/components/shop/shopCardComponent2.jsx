"use client";

import React, { useState } from 'react';
import { Star, MoreHorizontal, Plus, CirclePlus } from 'lucide-react';
import { deleteProduct } from '../../service/products.service';
import CreateProductModal from '../CreateProductModal';
import { useRouter } from 'next/navigation'; // For refreshing the data

export default function ShopCardComponent2({ initialProducts = [], realCategories = [] }) {
  const [sortOption, setSortOption] = useState("Name (A-Z)");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const router = useRouter();


  const sortedProducts = [...initialProducts].sort((a, b) => {
    if (sortOption === "Name (A-Z)") return a.name.localeCompare(b.name);
    if (sortOption === "Price (Low to High)") return a.price - b.price;
    if (sortOption === "Rating (High to Low)") return (b.star || 0) - (a.star || 0);
    return 0;
  });

  const handleRefresh = () => {
    router.refresh(); // Tells Next.js to re-fetch the server data
  };

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-12 font-sans text-[#1a1a1a] bg-[#f8f8f8] min-h-screen">
      
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Manage Products</h1>
          <p className="text-[#6c6c6c]">Create, update, and delete products in this dashboard.</p>
        </div>
        
        <div className="relative w-full sm:w-auto flex items-center gap-3">
          <label className="text-sm text-[#8c8c8c]">Sort</label>
          <select 
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="w-full sm:w-60 pl-6 pr-10 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-[#befa00] outline-none transition-all text-sm cursor-pointer"
          >
            <option>Name (A-Z)</option>
            <option>Price (Low to High)</option>
            <option>Rating (High to Low)</option>
          </select>
        </div>
      </header>

      <main className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-10 shadow-sm">
        
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
          <h2 className="text-xl font-bold">Products</h2>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#befa00] text-[#1a1a1a] px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-[#aee000] transition-colors shadow-lg shadow-lime-100"
          >
            <Plus size={18} />
            Create product
          </button>
        </div>

        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <div 
                key={product.productId} 
                className="border border-gray-100 rounded-2xl p-6 flex flex-col h-full bg-white hover:border-[#befa00] hover:shadow-xl transition-all group relative"
              >
                <div className="aspect-square mb-6 flex items-center justify-center p-4 bg-gray-50 rounded-2xl relative">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="max-h-full object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  <div className="absolute top-4 right-4 z-20">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenu(activeMenu === product.productId ? null : product.productId);
                      }}
                      className="p-2 bg-white/90 rounded-full border border-gray-100 text-[#8c8c8c] hover:text-[#1a1a1a] transition-colors"
                    >
                      <MoreHorizontal size={18} />
                    </button>

                    {activeMenu === product.productId && (
                      <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-100 rounded-xl shadow-xl z-30 overflow-hidden">
                        <button className="w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-gray-50 border-b border-gray-50">
                          Edit product
                        </button>
                        <button 
                          onClick={async (e) => { 
                            e.stopPropagation();
                            if (confirm("Delete this product?")) {
                              const result = await deleteProduct(product.productId);
                              if (result) handleRefresh();
                            }
                          }}
                          className="w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-red-50 text-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1 space-y-3 mb-6">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className={i < (product.star || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
                    ))}
                  </div>
                  <h3 className="font-bold text-base group-hover:text-[#befa00] transition-colors line-clamp-1">{product.name}</h3>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-5 mt-auto">
                  <span className="text-xl font-black">${product.price}</span>
                  <button className="text-[#befa00] hover:text-[#aee000] hover:scale-110 transition-transform">
                     <CirclePlus size={28} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-100 rounded-2xl py-20 px-10 text-center bg-gray-50">
            <h2 className="text-lg font-bold mb-2">No products to display</h2>
            <p className="text-gray-400 text-sm mb-8">Try creating a product to get started.</p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#befa00] text-[#1a1a1a] px-8 py-3 rounded-full font-bold hover:bg-[#aee000] transition-all"
            >
              Create product
            </button>
          </div>
        )}
      </main>

      <CreateProductModal 
         isOpen={isModalOpen} 
         onClose={() => setIsModalOpen(false)} 
         categories={realCategories} 
         refreshData={() => window.location.reload()} 
       />
    </div>
  );
}