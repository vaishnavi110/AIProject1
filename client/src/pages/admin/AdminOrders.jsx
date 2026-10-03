import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  ShoppingBag,
  Eye,
  MapPin,
  Phone,
} from 'lucide-react';
import toast from 'react-hot-toast';

const ORDER_STATUSES = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [inspectingOrder, setInspectingOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await adminService.updateOrderStatus(orderId, newStatus);
      toast.success(`Order #${orderId.substring(0, 8)} status updated to "${newStatus}"`);
      // Update locally
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
      if (inspectingOrder && inspectingOrder._id === orderId) {
        setInspectingOrder((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Status update failed';
      toast.error(msg);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders =
    statusFilter === 'All'
      ? orders
      : orders.filter((o) => o.status?.toLowerCase() === statusFilter.toLowerCase());

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-1 rounded-md">
            Fulfillment
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1.5">
            Order Management
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Review incoming orders, verify COD details, and update dispatch statuses
          </p>
        </div>
      </div>

      {/* Status Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          type="button"
          onClick={() => setStatusFilter('All')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
            statusFilter === 'All'
              ? 'bg-purple-600 text-white shadow-sm font-semibold'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Orders ({orders.length})
        </button>

        {ORDER_STATUSES.map((st) => {
          const count = orders.filter((o) => o.status?.toLowerCase() === st.toLowerCase()).length;
          return (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                statusFilter === st
                  ? 'bg-purple-600 text-white shadow-sm font-semibold'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {st} ({count})
            </button>
          );
        })}
      </div>

      {/* Orders Data Table */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader size="lg" message="Loading customer orders..." />
        </div>
      ) : filteredOrders.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No Orders Found"
          message={
            statusFilter === 'All'
              ? 'No customer orders have been placed yet.'
              : `No orders currently match status "${statusFilter}".`
          }
        />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="text-xs uppercase bg-slate-50 text-slate-400 font-bold border-b border-slate-100">
                <tr>
                  <th scope="col" className="px-6 py-4">
                    Order ID
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Customer & City
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Items
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Total
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-4 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((ord) => {
                  const isUpdating = updatingId === ord._id;
                  const address = ord.shippingAddress || {};
                  const totalItems = ord.products?.reduce((s, p) => s + (p.quantity || 1), 0) || 1;

                  return (
                    <tr key={ord._id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md block w-fit">
                          #{ord._id.substring(0, 8)}
                        </span>
                        <span className="text-[11px] text-slate-400 block mt-1">
                          {formatDate(ord.createdAt)}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-900">{address.name || 'Customer'}</p>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" />
                          <span>{address.city || 'Standard Delivery'}</span>
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-slate-800">
                          {totalItems} {totalItems === 1 ? 'item' : 'items'}
                        </span>
                      </td>

                      <td className="px-6 py-4 font-bold text-slate-900">
                        {formatCurrency(ord.totalAmount)}
                      </td>

                      {/* Inline Status Dropdown */}
                      <td className="px-6 py-4">
                        <select
                          value={ord.status}
                          disabled={isUpdating}
                          onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                          className="text-xs font-bold rounded-xl border border-slate-200 bg-white py-1.5 px-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none cursor-pointer disabled:opacity-50"
                        >
                          {ORDER_STATUSES.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => setInspectingOrder(ord)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 transition-colors focus:outline-none"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detailed Order Inspection Modal */}
      <Modal
        isOpen={Boolean(inspectingOrder)}
        onClose={() => setInspectingOrder(null)}
        title={`Order Details #${inspectingOrder?._id?.substring(0, 8)}`}
        maxWidth="lg"
      >
        {inspectingOrder && (
          <div className="space-y-6">
            {/* Status and Timestamp Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase">Status:</span>
                <Badge status={inspectingOrder.status} dot size="md">
                  {inspectingOrder.status}
                </Badge>
              </div>
              <span className="text-xs text-slate-400">
                {formatDate(inspectingOrder.createdAt)}
              </span>
            </div>

            {/* Customer Shipping Address */}
            <div className="bg-slate-50 rounded-2xl p-4 space-y-1 text-xs text-slate-600 border border-slate-200/60">
              <span className="text-xs font-bold text-slate-800 block mb-1">
                Recipient Details
              </span>
              <p className="font-semibold text-slate-900 text-sm">
                {inspectingOrder.shippingAddress?.name}
              </p>
              <p>{inspectingOrder.shippingAddress?.address}</p>
              <p>
                {inspectingOrder.shippingAddress?.city} -{' '}
                {inspectingOrder.shippingAddress?.pincode}
              </p>
              {inspectingOrder.shippingAddress?.phone && (
                <p className="flex items-center gap-1.5 pt-1 text-slate-500 font-medium">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{inspectingOrder.shippingAddress.phone}</span>
                </p>
              )}
            </div>

            {/* Line Items List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Purchased Items
              </h4>
              <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto pr-1">
                {inspectingOrder.products?.map((item, idx) => {
                  const itemProduct = item.product || {};
                  const itemImg = itemProduct.image || item.image;
                  const itemName = itemProduct.name || item.name || 'Catalog Item';

                  return (
                    <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                          {itemImg ? (
                            <img src={itemImg} alt={itemName} className="w-full h-full object-cover" />
                          ) : (
                            <ShoppingBag className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 line-clamp-1">{itemName}</p>
                          <p className="text-slate-400">
                            {item.quantity} × {formatCurrency(item.price)}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-slate-900">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Total */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-sm">
              <span className="font-bold text-slate-800">Total Billed:</span>
              <span className="text-indigo-600 font-extrabold text-lg">
                {formatCurrency(inspectingOrder.totalAmount)}
              </span>
            </div>

            <div className="pt-2 flex justify-end">
              <Button variant="secondary" onClick={() => setInspectingOrder(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminOrders;
