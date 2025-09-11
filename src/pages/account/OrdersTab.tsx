import React from 'react';
import { LOCAL_STORAGE_KEYS, getFromLocalStorage, setToLocalStorage } from '../../utils/localStorage';
import { Order } from '../../types';
import { X, RotateCcw } from 'lucide-react';

const OrdersTab: React.FC = () => {
  const [orders, setOrders] = React.useState<Order[]>(() => getFromLocalStorage<Order[]>(LOCAL_STORAGE_KEYS.ORDERS, []));

  const cancelOrder = (id: string) => {
    setOrders(prev => {
      const next = prev.map(o => o.id === id && o.status !== 'delivered' && o.status !== 'cancelled' ? { ...o, status: 'cancelled' } : o);
      setToLocalStorage(LOCAL_STORAGE_KEYS.ORDERS, next);
      return next;
    });
  };

  if (orders.length === 0) {
    return <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-gray-600">No orders yet.</div>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Order {order.id}</div>
                <div className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleString()} • ₹{order.total}</div>
                <div className="text-sm mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>{order.status}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => cancelOrder(order.id)}
                  disabled={order.status === 'delivered' || order.status === 'cancelled'}
                  className={`px-3 py-2 rounded-lg text-sm border ${order.status === 'delivered' || order.status === 'cancelled' ? 'text-gray-400 border-gray-200' : 'text-red-600 border-red-200 hover:bg-red-50'}`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersTab;


