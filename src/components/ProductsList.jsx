import React from 'react';
import '../styles/ProductsList.css';

function ProductsList({ products, onAddToCart }) {
  return (
    <div className="products-section">
      <h2>📦 Available Products</h2>
      <p className="subtitle">Choose items to add to your cart</p>

      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              <img src={product.image || 'https://via.placeholder.com/400'} alt={product.name} />
            </div>

            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="category">{product.category}</p>
              <p className="description">{product.description}</p>
              
              <div className="product-footer">
                <span className="price">${product.price}</span>
                <button 
                  className="add-to-cart-btn"
                  onClick={() => onAddToCart(product)}
                >
                  🛒 Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="empty-state">
          <p>No products available. Please check back later.</p>
        </div>
      )}
    </div>
  );
}

export default ProductsList;
