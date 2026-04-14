'use client'

import React, { useState } from 'react'
import { useCart } from '../../cart-context'
import { Plus, Minus, Loader2, ShoppingBag } from 'lucide-react'

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart, getTotalPrice, getTotalItems } = useCart()
  const [loading, setLoading] = useState(false)

  const subtotal = getTotalPrice()
  const itemCount = getTotalItems()

  
  const handleCheckout = async () => {
    if (cart.length === 0) return
    setLoading(true)

    const payload = {
      orderDetailRequests: cart.map((item) => ({
        productId: item.productId, // The 36-char UUID
        orderQty: item.quantity
      }))
    }

    try {
      const response = await fetch('https://homework-api.noevchanmakara.site/api/v1/orders', {
        method: 'POST',
       headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        alert("Order placed successfully!")
        clearCart()
      } else {
        const errorData = await response.json()
        alert(`Error: ${errorData.message || "Failed to checkout"}`)
      }
    } catch (error) {
      console.error("Checkout failed:", error)
      alert("Server connection failed.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen p-8 font-sans text-slate-900">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Your cart</h1>
          <p className="text-gray-500 text-sm">
            Cart is stored in memory for this visit — refreshing the page clears it.
          </p>
        </header>

        <div className="mb-4 flex items-center justify-between">
          <span className="font-semibold text-sm">
            {itemCount} product{itemCount !== 1 ? 's' : ''} in cart
          </span>
          {cart.length > 0 && (
            <button 
              onClick={clearCart}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

       
        <div className="space-y-4 mb-6">
          {cart.map((item) => (
            <div
              key={item.productId}
              className="bg-white border border-gray-200 rounded-2xl p-6 flex items-center justify-between shadow-sm group hover:border-slate-300 transition-all"
            >
              <div className="flex items-center gap-6">
                
                <div className="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden border border-gray-100">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="object-contain w-full h-full p-2 group-hover:scale-110 transition-transform"
                    />
                  ) : (
                    <div className="text-gray-300 text-xl font-light">◇</div>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-lg leading-tight">{item.productName}</h3>
                  <p className="text-gray-400 text-sm mt-1 font-medium">${item.price?.toFixed(2)} each</p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-3">
                
                <div className="flex items-center bg-gray-50 rounded-full px-3 py-1 border border-gray-200">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="p-1 hover:text-slate-900 text-gray-400 transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="mx-4 font-bold min-w-[1.2rem] text-center text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="p-1 hover:text-slate-900 text-gray-400 transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <div className="text-right">
                  <p className="font-black text-lg text-slate-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="text-red-400 text-xs font-bold hover:text-red-600 uppercase tracking-tighter mt-1"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          {cart.length === 0 && (
            <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-16 text-center flex flex-col items-center">
              <ShoppingBag className="text-gray-200 mb-4" size={48} />
              <h2 className="text-gray-400 font-medium">Your cart is feeling a bit light.</h2>
              <p className="text-gray-300 text-sm mt-1">Start adding some luxury items to see them here.</p>
            </div>
          )}
        </div>

        
        {cart.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
            <div className="space-y-2 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Items Total</span>
                <span className="font-semibold text-gray-700">{itemCount}</span>
              </div>
              <div className="flex justify-between items-center border-t border-gray-50 pt-4">
                <span className="text-xl font-bold text-slate-900">Subtotal</span>
                <span className="text-2xl font-black text-slate-900">${subtotal.toFixed(2)}</span>
              </div>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                Free shipping for group members
              </p>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading || cart.length === 0}
              className="w-full bg-[#1e293b] text-white py-5 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-100 flex items-center justify-center gap-3 disabled:bg-slate-300 active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Processing...</span>
                </>
              ) : (
                "Complete Purchase"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}