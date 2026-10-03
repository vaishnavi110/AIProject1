import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import {
  FolderTree,
  Plus,
  Pencil,
  Trash2,
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Delete dialog state
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await adminService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setFormData({ name: cat.name || '', description: cat.description || '' });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Category name is required';
    } else if (formData.name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters';
    } else if (formData.name.trim().length > 60) {
      errs.name = 'Name must not exceed 60 characters';
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    try {
      if (editingCategory) {
        await adminService.updateCategory(editingCategory._id, {
          name: formData.name.trim(),
          description: formData.description.trim(),
        });
        toast.success(`Category "${formData.name}" updated successfully`);
      } else {
        await adminService.createCategory({
          name: formData.name.trim(),
          description: formData.description.trim(),
        });
        toast.success(`Category "${formData.name}" created successfully`);
      }

      setIsModalOpen(false);
      fetchCategories();
    } catch (error) {
      const msg =
        error.response?.data?.message || error.message || 'Operation failed';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;

    setDeleting(true);
    try {
      await adminService.deleteCategory(categoryToDelete._id);
      toast.success(`Category "${categoryToDelete.name}" deleted successfully`);
      setCategoryToDelete(null);
      fetchCategories();
    } catch (error) {
      const msg =
        error.response?.data?.message || error.message || 'Failed to delete category';
      toast.error(msg);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-1 rounded-md">
            Catalog Structure
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1.5">
            Category Management
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Organize products with custom category tags and descriptions
          </p>
        </div>

        <Button
          variant="primary"
          onClick={openCreateModal}
          icon={Plus}
          className="self-start sm:self-auto"
        >
          Add New Category
        </Button>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader size="lg" message="Loading categories..." />
        </div>
      ) : categories.length === 0 ? (
        <EmptyState
          icon={FolderTree}
          title="No Categories Configured"
          message="Create your first product category to group catalog items."
          actionLabel="Create Category"
          onAction={openCreateModal}
        />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="text-xs uppercase bg-slate-50 text-slate-400 font-bold border-b border-slate-100">
                <tr>
                  <th scope="col" className="px-6 py-4">
                    Category Name
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-4 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                        <FolderTree className="w-4 h-4" />
                      </div>
                      <span>{cat.name}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 max-w-md">
                      {cat.description || (
                        <span className="text-slate-300 italic">No description</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditModal(cat)}
                          className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors focus:outline-none"
                          title="Edit Category"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setCategoryToDelete(cat)}
                          className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors focus:outline-none"
                          title="Delete Category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Category Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Create New Category'}
      >
        <form onSubmit={handleSaveCategory} className="space-y-4">
          <Input
            label="Category Name"
            id="cat-name"
            placeholder="e.g. Electronics, Footwear, Accessories"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={formErrors.name}
            required
            autoComplete="off"
          />

          <div>
            <label
              htmlFor="cat-desc"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Description (Optional)
            </label>
            <textarea
              id="cat-desc"
              rows={3}
              placeholder="Brief summary of items within this category..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="block w-full rounded-lg text-sm p-3 border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
            <Button
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={saving}>
              {editingCategory ? 'Save Changes' : 'Create Category'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(categoryToDelete)}
        onCancel={() => setCategoryToDelete(null)}
        onConfirm={handleDeleteCategory}
        loading={deleting}
        title="Delete Category"
        message={`Are you sure you want to delete "${categoryToDelete?.name}"? Items linked to this category may need re-categorization.`}
        confirmText="Delete Category"
        variant="danger"
      />
    </div>
  );
};

export default AdminCategories;
