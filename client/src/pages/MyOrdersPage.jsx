import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Container from '../components/layout/Container';
import Badge from '../components/common/Badge';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';
import orderService from '../services/orderService';
import { formatCurrency, formatDate } from '../utils/formatters';
import {
  PackageCheck,
  ShoppingBag,
  Calendar,
  MapPin,
  ArrowRight,
  Truck,
} from 'lucide-react';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await orderService.getMyOrders();
        setOrders(data);
      } catch (err) {
        console.error('Failed to load order history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader size="lg" message="Loading your purchase history..." />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="py-16">
        <Container>
          <EmptyState
            icon={PackageCheck}
            title="No Orders Placed Yet"
            message="When you purchase items via Cash on Delivery, your orders and fulfillment statuses will appear here."
            actionLabel="Start Shopping"
            actionLink="/products"
          />
        </Container>
      </div>
    );
  }

  return (
    <div className="py-8 space-y-8">
      <Container>
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Orders</h1>
            <p className="text-sm text-slate-500 mt-1">
              You have placed {orders.length} {orders.length === 1 ? 'order' : 'orders'} with us
            </p>
          </div>

          <Link to="/products">
            <Button variant="secondary" size="sm">
              <span>Continue Shopping</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((order) => {
            const formattedTotal = formatCurrency(order.totalAmount);
            const orderDate = formatDate(order.createdAt);
            const address = order.shippingAddress || {};

            return (
              <div
                key={order._id}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs hover:border-slate-300 transition-colors space-y-6"
              >
                {/* Order Top Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                      #{order._id.substring(0, 10)}
                    </span>
                    <Badge status={order.status} dot size="md">
                      {order.status}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {orderDate}
                    </span>
                    <span className="font-bold text-slate-900 text-sm">{formattedTotal}</span>
                  </div>
                </div>

                {/* Items in Order */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Ordered Items
                  </h4>
                  <div className="divide-y divide-slate-100">
                    {order.products?.map((item, idx) => {
                      const itemProduct = item.product || {};
                      const itemImg = itemProduct.image || item.image;
                      const itemName = itemProduct.name || item.name || 'Catalog Item';

                      return (
                        <div
                          key={idx}
                          className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0"
                        >
                          <div className="flex items-center gap-3.5">
                            <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden shrink-0 border border-slate-200/50">
                              {itemImg ? (
                                <img
                                  src={itemImg}
                                  alt={itemName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <ShoppingBag className="w-6 h-6 text-slate-400" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-800 line-clamp-1">
                                {itemName}
                              </p>
                              <p className="text-xs text-slate-400 mt-0.5">
                                Qty: {item.quantity} × {formatCurrency(item.price)}
                              </p>
                            </div>
                          </div>

                          <span className="text-sm font-bold text-slate-900 shrink-0">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Delivery & Payment Footer */}
                <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600 bg-slate-50/60 p-4 rounded-2xl">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-800 block">
                        Delivery Address ({address.name})
                      </span>
                      <p className="text-slate-500 mt-0.5">
                        {address.address}, {address.city} - {address.pincode}
                        {address.phone && ` (Ph: ${address.phone})`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 sm:justify-end">
                    <Truck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-800 block">Payment Method</span>
                      <p className="text-emerald-700 font-medium mt-0.5">
                        Cash on Delivery (Pay upon delivery)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </div>
  );
};

export default MyOrdersPage;
