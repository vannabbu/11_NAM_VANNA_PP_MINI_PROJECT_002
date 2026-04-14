'use client'

import React, { useEffect, useState } from 'react'
import { FileText, Loader2, CalendarDays, User, Target } from 'lucide-react'


const USE_MOCK = true; 

async function getOrdersHistory() {
  
  if (USE_MOCK) {
    console.log(" Using Mock Data");
    await new Promise(resolve => setTimeout(resolve, 800)); 
    return {
      message: "Success (Mock)",
      payload: [
        {
          orderId: "530183af-734b-49ec-99d9-98884aececae",
          appUserId: "fbe8600c-a9b9-4ce7-868c-232e83714371",
          totalAmount: 240.00,
          orderDate: "2026-04-14T15:18:27.867Z",
          orderDetailsResponse: [
            {
              productId: "7722-uuid-v4-electronics",
              productName: "Mechanical Keyboard RGB",
              orderQty: 2,
              orderTotal: 200.00
            },
            {
              productId: "1122-uuid-v4-acc",
              productName: "USB-C Braided Cable",
              orderQty: 2,
              orderTotal: 40.00
            }
          ]
        }
      ]
    };
  }


  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("Please log in to view history.");


  const res = await fetch("https://homework-api.noevchanmakara.site/api/v1/orders", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },

  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch from server");
  }

  return await res.json();
}
export default function OrderHistoryPage() {
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await getOrdersHistory();
       
        setOrders(data.payload || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  
  const formatDate = (dateString) => {
    if (!dateString) return 'Date missing';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4 text-gray-500 font-sans">
        <Loader2 className="animate-spin text-lime-600" size={32} />
        <span className="text-sm font-medium">Loading your orders...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8 font-sans">
        <div className="bg-white p-8 rounded-3xl border border-red-100 shadow-sm text-center">
          <Target className="text-red-400 mx-auto mb-4" size={48} />
          <h2 className="text-red-600 font-bold text-lg">Failed to retrieve order history</h2>
          <p className="text-gray-500 text-sm mt-1 max-w-sm">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 text-sm font-bold text-red-600 hover:underline"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8 font-sans">
        <div className="bg-white p-12 rounded-3xl border border-gray-100 shadow-sm text-center flex flex-col items-center">
          <FileText className="text-gray-200 mb-5" size={64} strokeWidth={1} />
          <h2 className="text-gray-800 font-black text-2xl tracking-tighter">No orders found (yet!)</h2>
          <p className="text-gray-400 text-sm mt-1 max-w-sm">It looks like you haven’t placed any orders in the HRD SHOP yet.</p>
        </div>
      </div>
    );
  }

  
  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-slate-900">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-black tracking-tighter text-gray-950">Purchase History</h1>
          <p className="text-gray-500 text-sm mt-1">Review details of all previous orders.</p>
        </header>

        <div className="space-y-8">
          {orders.map((order) => {
            const lineItemCount = order.orderDetailsResponse?.length || 0;
            const subtotal = order.totalAmount?.toFixed(2);

            return (
              <article key={order.orderId} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 group hover:border-lime-200 transition-colors">
                <div className="flex justify-between items-start gap-4 mb-8">
                  <div>
                    <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Order ID</h2>
                    <p className="text-sm font-black text-slate-950 break-all select-all">{order.orderId}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Order Total</h3>
                    <p className="text-3xl font-black text-slate-950">${subtotal}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 border-t border-b border-gray-50 py-6">
                  <div className="flex gap-3">
                    <User className="text-lime-500 size-5 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-gray-800">User ID</h4>
                      <p className="text-sm text-gray-500 tracking-tight break-all">{order.appUserId}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <CalendarDays className="text-lime-500 size-5 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-gray-800">Order date</h4>
                      <p className="text-sm text-gray-500">{formatDate(order.orderDate)}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <span className="font-bold text-slate-700">{lineItemCount} product{lineItemCount !== 1 ? 's' : ''} in this purchase</span>
                </div>

                <div className="bg-gray-50/50 rounded-2xl border border-gray-100 overflow-hidden">
                  {order.orderDetailsResponse?.map((detail, index) => {
                    const isLast = index === order.orderDetailsResponse.length - 1;
                    const pricePerEach = detail.orderQty > 0 ? (detail.orderTotal / detail.orderQty).toFixed(2) : "0.00";

                    return (
                      <div key={index} className={`flex flex-col md:flex-row md:items-center justify-between p-5 ${!isLast ? 'border-b border-gray-100' : ''} hover:bg-gray-50 transition-colors gap-4`}>
                        <div className="flex items-center gap-5">
                          <div className="space-y-0.5">
                            <p className="font-bold text-slate-900 group-hover:text-lime-700 transition-colors">{detail.productName || "Untitled Product"}</p>
                            <p className="text-xs text-gray-400 font-mono select-all">UUID: {detail.productId}</p>
                          </div>
                        </div>

                        <div className="text-right flex items-center justify-between md:justify-end gap-10">
                          <div className="w-16">
                            <h5 className="text-xs text-gray-400 uppercase tracking-wide">Qty</h5>
                            <p className="font-bold text-base text-slate-900">{detail.orderQty}</p>
                          </div>
                          
                          <div className="text-right">
                            <h5 className="text-xs text-gray-400 uppercase tracking-wide">Line Total</h5>
                            <p className="font-black text-lg text-lime-900">${detail.orderTotal?.toFixed(2)}</p>
                            <p className="text-xs text-gray-400 mt-0.5">${pricePerEach} each</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  )
}