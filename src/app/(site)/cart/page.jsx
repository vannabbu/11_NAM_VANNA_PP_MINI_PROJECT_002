'use client'

import React from 'react'
import { useCart } from '../../cart-context'
import { Plus, Minus } from 'lucide-react'

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart, getTotalPrice, getTotalItems } = useCart()

  const subtotal = getTotalPrice()
  const itemCount = getTotalItems()

  return (
    <div className="bg-gray-50 p-8 font-sans text-slate-900">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Your cart</h1>
        <p className="text-gray-500 text-sm mb-8">
          Cart is stored in memory for this visit — refreshing the page clears it.
        </p>

        <div className="mb-4">
          <span className="font-semibold text-sm">{itemCount} product{itemCount !== 1 ? 's' : ''} in cart</span>
        </div>

        {/* Product List */}
        <div className="space-y-4 mb-6">
          {cart.map((item) => (
            <div
              key={item.productId}
              className="bg-white border border-gray-200 rounded-2xl p-6 flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center gap-6">
                {/* Product Image */}
                <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="object-contain mix-blend-multiply w-full h-full"
                    />
                  ) : (
                    <div className="text-gray-400">◇</div>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-lg">{item.productName}</h3>
                  <p className="text-gray-500 text-sm mt-1">${item.price?.toFixed(2)} each</p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-3">
                {/* Quantity Controls */}
                <div className="flex items-center bg-gray-50 rounded-full px-3 py-1 border border-gray-100">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="p-1 hover:text-blue-600 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="mx-4 font-bold min-w-[1.5rem] text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="p-1 hover:text-blue-600 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <div className="text-right">
                  <p className="font-bold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="text-red-500 text-sm font-medium hover:underline mt-1"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          {cart.length === 0 && (
            <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-12 text-center text-gray-400">
              Your cart is empty.
            </div>
          )}
        </div>

        {/* Footer Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-1">
            <span className="text-lg font-semibold text-gray-700">Subtotal</span>
            <span className="text-xl font-bold">${subtotal.toFixed(2)}</span>
          </div>
          <p className="text-xs text-gray-400 mb-6">Tax and shipping calculated at checkout (demo).</p>

          <div className="space-y-3">
            <button className="w-full bg-[#1e293b] text-white py-4 rounded-full font-bold hover:bg-slate-700 transition-colors">
              Checkout
            </button>
            <button
              onClick={clearCart}
              className="w-full bg-gray-100 text-gray-600 py-4 rounded-full font-bold hover:bg-gray-200 transition-colors"
            >
              Clear cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
