"use client";

import React, { useState } from 'react';
import { Star, Search, RotateCcw } from 'lucide-react';
import { useCart } from '../../app/cart-context'; 

export default function ShopCardComponent({ initialProducts = [], realCategories = [] }) {
  const { addToCart } = useCart();
  
  const [priceRange, setPriceRange] = useState(300);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedSize, setSelectedSize] = useState('s');
  const [quantity, setQuantity] = useState(1);

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

  // --- VIEW 1: DETAIL VIEW ---
  if (selectedProduct) {
    return (
      <div className="max-w-7xl mx-auto p-6 md:p-12 font-sans bg-white min-h-screen text-slate-900">
        {/* Breadcrumbs */}
        <nav className="text-sm text-gray-400 mb-8 flex items-center gap-2">
          <span className="cursor-pointer hover:underline" onClick={() => setSelectedProduct(null)}>Home</span> / 
          <span className="cursor-pointer hover:underline" onClick={() => setSelectedProduct(null)}>Products</span> / 
          <span className="bg-gray-100 px-2 py-0.5 rounded text-slate-700 font-medium">
            {selectedProduct.name}
          </span>
        </nav>

        <div className="flex flex-col md:flex-row gap-16">
          <div className="flex-1 bg-[#f8fafc] border border-gray-100 rounded-3xl p-12 flex items-center justify-center min-h-[500px]">
            <img 
              src={selectedProduct.imageUrl} 
              alt={selectedProduct.name} 
              className="max-h-[500px] object-contain drop-shadow-xl"
            />
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-4xl font-bold tracking-tight">{selectedProduct.name}</h1>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={20} 
                    fill={i < 4 ? "currentColor" : "none"} 
                    className={i < 4 ? "text-yellow-400" : "text-gray-200"} 
                  />
                ))}
              </div>
            </div>

            <div className="flex items-baseline gap-3 mb-8">
              <span className="text-3xl font-bold text-[#1e3a8a]">${selectedProduct.price}.00</span>
              <span className="text-gray-400 line-through text-lg">$114.00</span>
            </div>

            <div className="mb-8">
              <p className="text-sm font-bold mb-3 text-slate-800">Choose a color</p>
              <div className="flex gap-2 mb-2">
                <button className="px-5 py-1.5 bg-[#4ade80] text-white rounded-full text-sm font-medium shadow-sm">green</button>
                <button className="px-5 py-1.5 bg-white border border-gray-200 text-gray-400 rounded-full text-sm font-medium hover:border-gray-300">gray</button>
              </div>
              <p className="text-xs text-gray-400 mt-1">Selected: <span className="text-gray-600">green</span></p>
            </div>

            <div className="mb-10">
              <p className="text-sm font-bold mb-3 text-slate-800">Choose a size</p>
              <div className="flex gap-3">
                {['s', 'm', 'l', 'xxl'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-1.5 rounded-full border text-xs font-bold transition-all flex items-center gap-2
                      ${selectedSize === size 
                        ? 'border-blue-600 bg-white text-blue-600 ring-1 ring-blue-600' 
                        : 'border-gray-200 text-gray-400 bg-white hover:border-gray-300'}`}
                  >
                    <span className={`w-2 h-2 rounded-full ${selectedSize === size ? 'bg-blue-600' : 'bg-gray-200'}`}></span>
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-gray-500 leading-relaxed mb-10 text-[15px]">
              {selectedProduct.description || "A deep cleansing foam with BHA and Tea tree unclogs pores and exfoliates dead skin cells."}
            </p>

            <div className="flex gap-4 mb-6">
              <div className="flex items-center border border-gray-200 rounded-full px-4 py-2 bg-gray-50">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-2 text-xl text-gray-400">-</button>
                <span className="w-10 text-center font-bold">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-2 text-xl text-gray-400">+</button>
              </div>
              <button 
                onClick={() => addToCart(selectedProduct)}
                className="flex-1 bg-[#1e293b] text-white rounded-full font-bold py-3 hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
              >
                <div className="w-5 h-5 bg-gradient-to-tr from-pink-500 to-yellow-500 rounded-sm"></div>
                Add to cart
              </button>
            </div>

            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 flex items-start gap-4">
               <RotateCcw size={20} className="text-slate-800" />
               <div>
                 <p className="font-bold text-slate-800">Free 30-day returns</p>
                 <p className="text-xs text-gray-400 mt-0.5">See return policy details in cart.</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW 2: GRID VIEW (DEFAULT) ---
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
                $0 — ${priceRange}
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

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-3">Categories</label>
              <div className="space-y-3">
                {realCategories.map((cat) => (
                  <div 
                    key={cat.categoryId} 
                    className="flex items-center gap-2 group cursor-pointer"
                    onClick={() => setSelectedCategoryId(selectedCategoryId === cat.categoryId ? null : cat.categoryId)}
                  >
                    <input 
                      type="checkbox" 
                      checked={selectedCategoryId === cat.categoryId}
                      onChange={() => {}}
                      className="w-4 h-4 rounded border-gray-300 accent-slate-900 cursor-pointer" 
                    />
                    <span className={`text-sm ${selectedCategoryId === cat.categoryId ? 'font-bold' : 'text-slate-600'}`}>
                      {cat.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1">
          <p className="text-sm text-gray-500 mb-6">
            Showing <span className="font-bold text-slate-900">{filteredProducts.length} products</span>
          </p>

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
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className={i < product.star ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <span className="text-2xl font-black">${product.price}</span>
                </div>
                
                <button 
                  onClick={() => setSelectedProduct(product)}
                  className="w-full bg-[#1e293b] text-white py-4 rounded-2xl font-bold hover:bg-slate-700 transition-colors"
                >
                  View detail
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}