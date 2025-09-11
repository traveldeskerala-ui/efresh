import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { LOCAL_STORAGE_KEYS, getFromLocalStorage } from '../utils/localStorage';

const CartPage: React.FC = () => {
  const { items, updateQuantity, removeFromCart, getTotalAmount, getTotalItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());

  const savedPin = getFromLocalStorage(LOCAL_STORAGE_KEYS.USER_PIN, null);
  const subtotal = getTotalAmount();
  const deliveryFee = subtotal >= 500 ? 0 : 40;
  const total = subtotal + deliveryFee;

  const handleRemoveItem = async (productId: string, variantWeight: string) => {
    const itemKey = `${productId}-${variantWeight}`;
    setRemovingItems(prev => new Set(prev).add(itemKey));
    
    setTimeout(() => {
      const item = items.find(item => item.productId === productId && item.variant.weight === variantWeight);
      if (item) {
        removeFromCart(productId, item.variant);
      }
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemKey);
        return newSet;
      });
    }, 300);
  };

  const canCheckout = savedPin && items.length > 0 && subtotal >= 99;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some fresh produce to get started</p>
          <Link
            to="/shop"
            className="inline-flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            <span>Start Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Your Cart</h1>

        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900">
                  {getTotalItems()} item{getTotalItems() !== 1 ? 's' : ''} in your cart
                </h2>
              </div>

              <div className="divide-y divide-gray-100">
                <AnimatePresence mode="popLayout">
                  {items.map((item) => {
                    const itemKey = `${item.productId}-${item.variant.weight}`;
                    const isRemoving = removingItems.has(itemKey);

                    return (
                      <motion.div
                        key={itemKey}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: isRemoving ? 0 : 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="p-6"
                      >
                        <div className="flex items-center space-x-4">
                          {/* Product Image */}
                          <div className="flex-shrink-0">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-16 h-16 object-cover rounded-xl bg-gray-50"
                            />
                          </div>

                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 mb-1">{item.product.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">{item.variant.weight}</p>
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold text-green-600">₹{item.variant.price}</span>
                              {item.variant.originalPrice && (
                                <span className="text-sm text-gray-500 line-through">₹{item.variant.originalPrice}</span>
                              )}
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center bg-gray-100 rounded-full">
                              <button
                                onClick={() => updateQuantity(item.productId, item.variant, item.quantity - 1)}
                                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-full transition-colors"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.productId, item.variant, item.quantity + 1)}
                                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-full transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>

                            <button
                              onClick={() => handleRemoveItem(item.productId, item.variant.weight)}
                              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="mt-8 lg:mt-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium">
                    {deliveryFee === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                </div>
              </div>

              {/* Minimum Order Notice */}
              {subtotal < 99 && (
                <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-sm text-orange-700">
                    Minimum order amount is ₹99. Add ₹{99 - subtotal} more to proceed.
                  </p>
                </div>
              )}

              {/* Delivery Info */}
              {deliveryFee > 0 && subtotal >= 99 && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700">
                    Add ₹{500 - subtotal} more for free delivery!
                  </p>
                </div>
              )}

              {/* PIN Required Notice */}
              {!savedPin && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">
                    Please select your delivery area to proceed.
                  </p>
                </div>
              )}

              <button
                onClick={() => navigate('/checkout')}
                disabled={!canCheckout}
                className={`w-full py-3 rounded-xl font-medium transition-colors ${
                  canCheckout
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {!savedPin ? 'Select Area First' : 'Proceed to Checkout'}
              </button>

              <div className="mt-4 text-center">
                <Link
                  to="/shop"
                  className="text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom padding for mobile nav */}
      <div className="h-20 lg:h-0" />
    </div>
  );
};

export default CartPage;