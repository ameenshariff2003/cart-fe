import React, { useState } from 'react';
import '../styles/Cart.css';

function Cart({ cartItems, onRemove, onUpdateQuantity }) {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);

  // Calculate total price
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + (item.price * item.quantity),
    0
  );

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (!customerName || !customerEmail) {
      alert('Please fill in all fields');
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    try {
      const orderData = {
        customerName,
        customerEmail,
        items: cartItems.map(item => ({
          productId: item.id,
          productName: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        totalAmount
      };

      const response = await fetch('http://localhost:8080/api/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();

      if (response.ok) {
        setOrderId(data.orderId);
        setOrderPlaced(true);

        // Clear cart by calling onRemove for each item
        cartItems.forEach(item => onRemove(item.id));

        setCustomerName('');
        setCustomerEmail('');

        setTimeout(() => {
          setOrderPlaced(false);
          setOrderId(null);
        }, 3000);
      } else {
        alert('Error placing order: ' + (data.message || 'Unknown'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to place order');
    }
  };

  return (
    <div className="cart-section">
      <h2>🛒 Shopping Cart</h2>

      {orderPlaced && (
        <div className="success-message">
          ✅ Order placed successfully! Order ID: {orderId}
        </div>
      )}

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <p>Start shopping by going to the Shop page!</p>
        </div>
      ) : (
        <div className="cart-container">
          <div className="cart-items">
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map(item => (
                  <tr key={item.id} className="cart-item">
                    <td className="item-name">{item.name}</td>
                    <td>${item.price}</td>
                    <td>
                      <input type="number" min="1" value={item.quantity} onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value))} className="quantity-input" />
                    </td>
                    <td className="item-total">${(item.price * item.quantity).toFixed(2)}</td>
                    <td>
                      <button className="remove-btn" onClick={() => onRemove(item.id)}>❌ Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="cart-summary">
              <h3>Subtotal: ${totalAmount.toFixed(2)}</h3>
              <p className="tax-info">Tax & shipping will be calculated at checkout</p>
            </div>
          </div>

          <div className="checkout-form">
            <h3>📋 Checkout</h3>
            <form onSubmit={handleCheckout}>
              <div className="form-group">
                <label>Full Name *</label>
                <input type="text" placeholder="Enter your full name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
              </div>

              <div className="form-group">
                <label>Email Address *</label>
                <input type="email" placeholder="Enter your email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} required />
              </div>

              <div className="order-summary">
                <p>Total Items: <strong>{cartItems.length}</strong></p>
                <p>Total Price: <strong>${totalAmount.toFixed(2)}</strong></p>
              </div>

              <button type="submit" className="checkout-btn">✅ Place Order</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
