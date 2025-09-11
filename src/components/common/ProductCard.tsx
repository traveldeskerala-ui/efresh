import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { Product, ProductVariant } from '../../types';
import { useCart } from '../../hooks/useCart';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  showQuickAdd?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, showQuickAdd = true }) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0]);
  const [quantity, setQuantity] = useState(0);
  const { addToCart, items } = useCart();

  // Find if this product variant is already in cart
  const existingCartItem = items.find(
    item => item.productId === product.id && item.variant.weight === selectedVariant.weight
  );
  const currentQuantity = existingCartItem?.quantity || quantity;

  const handleAddToCart = () => {
    if (currentQuantity === 0) {
      addToCart(product, selectedVariant, 1);
      setQuantity(1);
      toast.success('Added to cart!');
    } else {
      addToCart(product, selectedVariant, 1);
      toast.success('Updated cart!');
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 0) return;
    setQuantity(newQuantity);
    
    if (newQuantity === 0 && existingCartItem) {
      // This will be handled by the cart context
      return;
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
    >
      {/* Product Image */}
      <div className="relative aspect-square bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {!product.isAvailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-medium">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>

        {/* Variant Selector */}
        <div className="flex flex-wrap gap-1 mb-3">
          {product.variants.map(variant => (
            <button
              key={variant.weight}
              onClick={() => setSelectedVariant(variant)}
              className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                selectedVariant.weight === variant.weight
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
              }`}
            >
              {variant.weight}
            </button>
          ))}
        </div>

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg text-gray-900">₹{selectedVariant.price}</span>
              {selectedVariant.originalPrice && (
                <span className="text-sm text-gray-500 line-through">₹{selectedVariant.originalPrice}</span>
              )}
            </div>
          </div>

          {showQuickAdd && product.isAvailable && (
            <div className="flex items-center space-x-2">
              {currentQuantity > 0 ? (
                <div className="flex items-center bg-green-500 rounded-full">
                  <button
                    onClick={() => handleQuantityChange(currentQuantity - 1)}
                    className="p-2 text-white hover:bg-green-600 rounded-full transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-3 py-1 text-white font-medium min-w-[2rem] text-center">
                    {currentQuantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(currentQuantity + 1)}
                    className="p-2 text-white hover:bg-green-600 rounded-full transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleAddToCart}
                  className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full transition-colors"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span className="text-sm font-medium">Add</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;