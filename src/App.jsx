import React, { useState, useEffect } from 'react';
import './App.css';
import ProductsList from './components/ProductsList.jsx';
import Cart from './components/Cart.jsx';
import AdminPanel from './components/AdminPanel.jsx';

function App() {
  const [currentPage, setCurrentPage] = useState('shop'); // 'shop', 'cart', 'admin'
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);

  // Fetch products when app loads
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  // Add to cart
  const addToCart = (product) => {
    const existing = cart.find((i) => i.id === product.id);
    if (existing) {
      setCart(cart.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(i => i.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) return removeFromCart(productId);
    setCart(cart.map(i => i.id === productId ? { ...i, quantity } : i));
  };

  return (
    <div className="App">
      <header className="navbar">
        <h1>🛍️ E-Commerce Store</h1>
        <nav>
          <button className={currentPage === 'shop' ? 'active' : ''} onClick={() => setCurrentPage('shop')}>Shop</button>
          <button className={currentPage === 'cart' ? 'active' : ''} onClick={() => setCurrentPage('cart')}>Cart ({cart.length})</button>
          <button className={currentPage === 'admin' ? 'active' : ''} onClick={() => setCurrentPage('admin')}>Admin Panel</button>
        </nav>
      </header>

      <main className="container">
        {currentPage === 'shop' && <ProductsList products={products} onAddToCart={addToCart} />}
        {currentPage === 'cart' && <Cart cartItems={cart} onRemove={removeFromCart} onUpdateQuantity={updateQuantity} />}
        {currentPage === 'admin' && <AdminPanel />}
      </main>

      <footer className="footer">
        <p>&copy; 2025 E-Commerce Store. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
