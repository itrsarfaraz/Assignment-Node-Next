import { useEffect, useState } from 'react';
import { Product } from '@/types';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/auth';
import toast from 'react-hot-toast';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      // Add a `stock` property to manage local stock count
      setProducts(data.map((product: Product) => ({ ...product, stock: product.stock })));
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleOrder = async (productId: number) => {
    try {
      const productIndex = products.findIndex((product) => product.id === productId);

      if (productIndex === -1 || products[productIndex].stock <= 0) {
        toast.error('Product out of stock');
        return;
      }

      // Call API to place the order
      await api.post('/orders', {
        productId,
        quantity: 1,
      });

      // Update stock locally
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId
            ? { ...product, stock: product.stock - 1 }
            : product
        )
      );

      toast.success('Order placed successfully!');
    } catch (error) {
      toast.error('Failed to place order');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
            <p className="mt-2 text-gray-600">{product.description}</p>
            <div className="mt-4 flex justify-between items-center">
              <span className="text-primary font-bold">${product.price}</span>
              <span
                className={`${
                  product.stock > 0 ? 'text-gray-600' : 'text-red-600'
                }`}
              >
                Stock: {product.stock}
              </span>
            </div>
            {user && (
              <button
                onClick={() => handleOrder(product.id)}
                disabled={product.stock === 0}
                className="mt-4 w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {product.stock === 0 ? 'Out of Stock' : 'Order Now'}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
