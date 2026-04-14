"use client";

import React, { useState } from 'react';
import { Star, Search } from 'lucide-react';
import { useCart } from '../../app/cart-context'; 

export default function ShopCardComponent({ initialProducts = [], realCategories = [] }) {
  const { addToCart } = useCart();
  
  const [priceRange, setPriceRange] = useState(300);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  
  const filteredProducts = initialProducts.filter((product) => {
    const matchesPrice = product.price <= priceRange;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategoryId 
      ? product.categoryId === selectedCategoryId 
      : true;
    
    return matchesPrice && matchesSearch && matchesCategory;
  });

  const resetFilters = () => {
    setPriceRange(300);
    setSearchQuery("");
    setSelectedCategoryId(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-12 text-slate-900 font-sans">
      
      <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Luxury beauty products</h1>
          <p className="text-gray-500">Use the filters to narrow by price and brand.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by product name..."
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-100 outline-none transition-all"
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="border border-gray-100 rounded-2xl p-6 shadow-sm sticky top-6 bg-white">
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-bold text-sm uppercase tracking-wider">Filters</h2>
              <button 
                onClick={resetFilters}
                className="text-xs font-medium px-3 py-1 bg-gray-50 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
              >
                Reset filters
              </button>
            </div>

            <div className="mb-8">
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Price Range</label>
              <p className="text-sm font-semibold mb-4">
                $0 — ${priceRange} <span className="text-gray-400 font-normal">(no limit)</span>
              </p>
              <input 
                type="range" min="0" max="300" value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-slate-900" 
              />
            </div>

            <div className="mb-8">
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-3">Quick Select</label>
              <div className="grid grid-cols-2 gap-2">
                {[50, 100, 150].map((val) => (
                  <button 
                    key={val}
                    onClick={() => setPriceRange(val)}
                    className={`text-[11px] font-semibold py-2 px-1 border rounded-lg transition-all ${priceRange === val ? 'border-slate-900 bg-slate-50' : 'border-gray-100 hover:border-slate-900'}`}
                  >
                    Under ${val}
                  </button>
                ))}
                <button 
                  onClick={() => setPriceRange(300)}
                  className={`text-[11px] font-semibold py-2 px-1 rounded-lg transition-all ${priceRange === 300 ? 'bg-slate-900 text-white' : 'border border-gray-100'}`}
                >
                  All prices
                </button>
              </div>
            </div>

            {/* REAL CATEGORIES SECTION */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-3">Categories</label>
              <div className="space-y-3">
                {realCategories.map((cat) => (
                  <div 
                    key={cat.categoryId} 
                    className="flex items-center justify-between group cursor-pointer"
                    onClick={() => setSelectedCategoryId(selectedCategoryId === cat.categoryId ? null : cat.categoryId)}
                  >
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={selectedCategoryId === cat.categoryId}
                        onChange={() => {}} // Controlled by div click
                        className="w-4 h-4 rounded border-gray-300 accent-slate-900 cursor-pointer" 
                      />
                      <span className={`text-sm transition-colors ${selectedCategoryId === cat.categoryId ? 'font-bold text-slate-900' : 'font-medium text-slate-600 group-hover:text-slate-900'}`}>
                        {cat.name}
                      </span>
                    </div>
                    {/* Optional: You can add a counter here if your API provides it */}
                  </div>
                ))}
                {realCategories.length === 0 && (
                  <p className="text-xs text-gray-400 italic">No categories found</p>
                )}
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1">
          <p className="text-sm text-gray-500 mb-6">
            Showing <span className="font-bold text-slate-900">{filteredProducts.length} products</span> (of {initialProducts.length})
          </p>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.productId} className="border border-gray-100 rounded-[2.5rem] p-6 flex flex-col h-full hover:shadow-xl transition-all bg-white group">
                  <div className="aspect-square mb-6 flex items-center justify-center p-4 bg-gray-50 rounded-3xl overflow-hidden">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="max-h-full object-contain group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2 h-10">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center gap-1 mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={14} 
                          className={i < product.star ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} 
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-6">
                    <span className="text-2xl font-black">${product.price}</span>
                    <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded-md uppercase tracking-tighter">
                      {/* Finds the category name based on the productId's categoryId */}
                      {realCategories.find(c => c.categoryId === product.categoryId)?.name || "Skincare"}
                    </span>
                  </div>
                  
                  <button 
                    onClick={() => addToCart(product)}
                    className="w-full bg-[#1e293b] text-white py-4 rounded-2xl font-bold hover:bg-slate-700 transition-colors shadow-lg shadow-slate-100"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-100 rounded-[2.5rem] py-20 px-10 text-center bg-white shadow-sm">
              <h2 className="text-xl font-bold mb-2">No products match these filters</h2>
              <p className="text-gray-400 text-sm mb-8">Try raising the price limit or clearing category filters.</p>
              <button 
                onClick={resetFilters}
                className="bg-[#1e293b] text-white px-8 py-3 rounded-full font-bold hover:bg-slate-700 transition-all"
              >
                Reset all filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}