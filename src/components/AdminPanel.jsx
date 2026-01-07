import React, { useState, useEffect } from 'react';
import '../styles/AdminPanel.css';

function AdminPanel() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/orders/all');
      const data = await res.json();
      setOrders(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:8080/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) fetchOrders();
    } catch (err) {
      console.error('Error updating order:', err);
    }
  };

  return (
    <div className="admin-section">
      <h2>👨‍💼 Admin Panel - Orders Dashboard</h2>
      <p className="admin-subtitle">Manage customer orders and track shipments</p>

      {loading ? (
        <div className="loading">Loading orders...</div>
      ) : (
        <>
          <div className="admin-stats">
            <div className="stat-card"><h4>Total Orders</h4><p className="stat-number">{orders.length}</p></div>
            <div className="stat-card"><h4>Pending Orders</h4><p className="stat-number">{orders.filter(o => o.status === 'pending').length}</p></div>
            <div className="stat-card"><h4>Total Revenue</h4><p className="stat-number">${orders.reduce((sum, o) => sum + o.totalAmount, 0).toFixed(2)}</p></div>
          </div>

          <div className="orders-table-wrapper">
            {orders.length === 0 ? (
              <div className="no-orders"><p>No orders yet. Waiting for customers to checkout...</p></div>
            ) : (
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer Name</th>
                    <th>Email</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order._id} className={`order-row status-${order.status}`}>
                      <td className="order-id"><strong>{order._id.slice(-6).toUpperCase()}</strong></td>
                      <td>{order.customerName}</td>
                      <td>{order.customerEmail}</td>
                      <td className="items-count">{order.items.length} items</td>
                      <td className="total">${order.totalAmount.toFixed(2)}</td>
                      <td><span className={`status-badge status-${order.status}`}>{order.status.toUpperCase()}</span></td>
                      <td className="order-date">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td><button className="view-btn" onClick={() => setSelectedOrder(order)}>👁️ View</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {selectedOrder && (
            <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>📦 Order Details</h3>
                <div className="order-details">
                  <div className="detail-row"><span className="label">Order ID:</span><span className="value">{selectedOrder._id}</span></div>
                  <div className="detail-row"><span className="label">Customer Name:</span><span className="value">{selectedOrder.customerName}</span></div>
                  <div className="detail-row"><span className="label">Email:</span><span className="value">{selectedOrder.customerEmail}</span></div>
                  <div className="detail-row"><span className="label">Order Date:</span><span className="value">{new Date(selectedOrder.createdAt).toLocaleString()}</span></div>

                  <h4>Items Ordered:</h4>
                  <table className="items-detail-table">
                    <thead><tr><th>Product</th><th>Price</th><th>Qty</th><th>Total</th></tr></thead>
                    <tbody>
                      {selectedOrder.items.map((item, idx) => (
                        <tr key={idx}><td>{item.productName}</td><td>${item.price}</td><td>{item.quantity}</td><td>${(item.price * item.quantity).toFixed(2)}</td></tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="detail-row"><span className="label">Total Amount:</span><span className="value total">${selectedOrder.totalAmount.toFixed(2)}</span></div>

                  <div className="status-update">
                    <label>Update Status:</label>
                    <select value={selectedOrder.status} onChange={(e) => updateOrderStatus(selectedOrder._id, e.target.value)}>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </div>
                </div>
                <button className="close-btn" onClick={() => setSelectedOrder(null)}>✖ Close</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AdminPanel;
