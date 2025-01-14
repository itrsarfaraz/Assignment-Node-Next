import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth';
import api from '@/lib/axios';
import { Product } from '@/types';
import toast from 'react-hot-toast';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      setProducts(data.map((product: Product) => ({ ...product, stock: product.stock })));
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleOrder = async (productId: number) => {
    try {
      if (!user) {
        toast.error('Please login to place an order');
        return;
      }

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
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col">
          <h1 className="display-4 mb-3">Welcome to E-Commerce Store</h1>
          {user ? (
            <p className="lead">Hello, {user.username}! Check out our latest products.</p>
          ) : (
            <p className="lead">Please login to start shopping with us.</p>
          )}
        </div>
      </div>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {products.map((product) => (
          <div key={product.id} className="col">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">{product.description}</p>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="fs-4 fw-bold text-primary">${product.price}</span>
                  <span
                    className={`badge ${
                      product.stock > 0 ? 'bg-success' : 'bg-danger'
                    }`}
                  >
                    {product.stock > 0
                      ? `${product.stock} in stock`
                      : 'Out of stock'}
                  </span>
                </div>
                <button
                  onClick={() => handleOrder(product.id)}
                  className="btn btn-primary w-100"
                  disabled={!user || product.stock === 0}
                >
                  {!user
                    ? 'Login to Order'
                    : product.stock === 0
                    ? 'Out of Stock'
                    : 'Order Now'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-5">
          <h3>No products available</h3>
          <p>Check back later for new products</p>
        </div>
      )}
    </div>
  );
}
