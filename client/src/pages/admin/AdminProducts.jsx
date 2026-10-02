import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { formatCurrency } from '../../utils/formatters';
import {
  Package,
  Plus,
  Pencil,
  Trash2,
  DollarSign,
  Layers,
  Image as ImageIcon,
  Boxes,
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
    stock: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Delete dialog state
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prods, cats] = await Promise.all([
        adminService.getProducts(),
        adminService.getCategories(),
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (err) {
      console.error('Failed to load admin products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      image: '',
      category: categories[0]?._id || '',
      stock: '10',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name || '',
      description: prod.description || '',
      price: prod.price?.toString() || '',
      image: prod.image || '',
      category: prod.category?._id || prod.category || categories[0]?._id || '',
      stock: prod.stock?.toString() || '0',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Product name is required';
    } else if (formData.name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters';
    }

    if (!formData.description.trim()) {
      errs.description = 'Description is required';
    }

    const priceNum = parseFloat(formData.price);
    if (!formData.price || isNaN(priceNum) || priceNum <= 0) {
      errs.price = 'Price must be a positive number';
    }

    if (!formData.image.trim()) {
      errs.image = 'Image URL is required';
    }

    if (!formData.category) {
      errs.category = 'Please select a category';
    }

    const stockNum = parseInt(formData.stock, 10);
    if (formData.stock === '' || isNaN(stockNum) || stockNum < 0) {
      errs.stock = 'Stock must be 0 or greater';
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    try {
      const selectedCategoryObj = categories.find((c) => c._id === formData.category);
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        image: formData.image.trim(),
        category: formData.category,
        categoryObj: selectedCategoryObj || { _id: formData.category, name: 'General' },
        stock: parseInt(formData.stock, 10),
      };

      if (editingProduct) {
        await adminService.updateProduct(editingProduct._id, payload);
        toast.success(`Product "${formData.name}" updated successfully`);
      } else {
        await adminService.createProduct(payload);
        toast.success(`Product "${formData.name}" created successfully`);
      }

      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Operation failed';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    setDeleting(true);
    try {
      await adminService.deleteProduct(productToDelete._id);
      toast.success(`Product "${productToDelete.name}" deleted successfully`);
      setProductToDelete(null);
      fetchData();
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Failed to delete product';
      toast.error(msg);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-1 rounded-md">
            Inventory & Catalog
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1.5">
            Product Management
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Create, update stock, modify prices, and manage catalog items
          </p>
        </div>

        <Button
          variant="primary"
          onClick={openCreateModal}
          icon={Plus}
          className="self-start sm:self-auto"
        >
          Add New Product
        </Button>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader size="lg" message="Loading catalog items..." />
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No Products Found"
          message="Your catalog is currently empty. Add your first item to begin selling."
          actionLabel="Create Product"
          onAction={openCreateModal}
        />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="text-xs uppercase bg-slate-50 text-slate-400 font-bold border-b border-slate-100">
                <tr>
                  <th scope="col" className="px-6 py-4">
                    Product
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Stock Inventory
                  </th>
                  <th scope="col" className="px-6 py-4 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((prod) => {
                  const isOut = prod.stock <= 0;
                  return (
                    <tr key={prod._id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Product Thumbnail & Name */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden shrink-0 border border-slate-200/50">
                            {prod.image ? (
                              <img
                                src={prod.image}
                                alt={prod.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Package className="w-6 h-6 text-slate-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 line-clamp-1">{prod.name}</p>
                            <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                              {prod.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                          {prod.category?.name || 'General'}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4 font-bold text-slate-900">
                        {formatCurrency(prod.price)}
                      </td>

                      {/* Stock */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                            isOut
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isOut ? 'bg-rose-500' : 'bg-emerald-500'
                            }`}
                          />
                          {isOut ? 'Out of Stock' : `${prod.stock} Units`}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditModal(prod)}
                            className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors focus:outline-none"
                            title="Edit Product"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setProductToDelete(prod)}
                            className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors focus:outline-none"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        maxWidth="lg"
      >
        <form onSubmit={handleSaveProduct} className="space-y-4">
          <Input
            label="Product Name"
            id="prod-name"
            placeholder="e.g. Wireless Noise-Cancelling Headphones"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={formErrors.name}
            required
          />

          <div>
            <label htmlFor="prod-desc" className="block text-sm font-medium text-slate-700 mb-1.5">
              Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="prod-desc"
              rows={3}
              placeholder="Detailed specifications, features, and warranty..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`block w-full rounded-lg text-sm p-3 border transition-colors focus:outline-none focus:ring-2 ${
                formErrors.description
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500'
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500'
              }`}
            />
            {formErrors.description && (
              <p className="mt-1 text-xs text-rose-600 font-medium">{formErrors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Price (INR)"
              id="prod-price"
              type="number"
              step="0.01"
              placeholder="e.g. 4999"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              error={formErrors.price}
              icon={DollarSign}
              required
            />

            <Input
              label="Stock Inventory"
              id="prod-stock"
              type="number"
              min="0"
              placeholder="e.g. 15"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              error={formErrors.stock}
              icon={Boxes}
              required
            />
          </div>

          <Input
            label="Image URL"
            id="prod-image"
            type="url"
            placeholder="https://images.unsplash.com/..."
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            error={formErrors.image}
            icon={ImageIcon}
            required
          />

          <div>
            <label htmlFor="prod-cat" className="block text-sm font-medium text-slate-700 mb-1.5">
              Category <span className="text-rose-500">*</span>
            </label>
            <select
              id="prod-cat"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="block w-full rounded-lg text-sm py-2.5 px-3 border border-slate-300 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={saving}>
              {editingProduct ? 'Save Product' : 'Add Product'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(productToDelete)}
        onCancel={() => setProductToDelete(null)}
        onConfirm={handleDeleteProduct}
        loading={deleting}
        title="Delete Product"
        message={`Are you sure you want to delete "${productToDelete?.name}"? It will no longer appear on the public storefront.`}
        confirmText="Delete Product"
        variant="danger"
      />
    </div>
  );
};

export default AdminProducts;
