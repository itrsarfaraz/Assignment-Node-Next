import { useEffect, useState } from 'react';
import { Order } from '@/types';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/auth';
import toast from 'react-hot-toast';

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders/my-orders');
      setOrders(data);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold text-gray-900">Please login to view your orders</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">My Orders</h2>
        <div className="text-sm text-gray-500">
          Total Orders: {orders.length}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th scope="col" className="px-8 py-5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/3">
                  Product Details
                </th>
                <th scope="col" className="px-8 py-5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/4">
                  Order Date
                </th>
                <th scope="col" className="px-8 py-5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/6">
                  Quantity
                </th>
                <th scope="col" className="px-8 py-5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/4">
                  Total Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {orders.map((order) => (
                <tr 
                  key={`${order.id}-${order.order_date}`} 
                  className="transition-colors hover:bg-gray-50"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center">
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-900">
                          {order.product.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          <span className="inline-flex items-center px-3 py-1 rounded bg-gray-100 text-gray-800">
                            ${order.product.price} per unit
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-sm text-gray-900">
                      {order.order_date}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {order.quantity} units
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-sm font-medium text-gray-900">
                      <span className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-green-100 text-green-800">
                        ${order.total_price}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {orders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No orders found</p>
            <p className="text-gray-400 text-sm mt-1">Start shopping to see your orders here</p>
          </div>
        )}
      </div>
    </div>
  );
}
