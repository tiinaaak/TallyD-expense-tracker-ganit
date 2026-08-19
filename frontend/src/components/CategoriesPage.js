import { useState, useEffect } from 'react';
import { Plus, Trash2, Tag } from 'lucide-react';
import { toast } from 'react-toastify';
import { getCategories, createCategory, deleteCategory } from '../api/categories';
import ConfirmModal from './ConfirmModal';

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null); // holds the category being confirmed for deletion

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data);
    } catch (err) {
      setError('Could not load categories.');
      toast.error('Could not load categories.');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Category name is required.');
      return;
    }

    setLoading(true);
    try {
      await createCategory(name.trim());
      setName('');
      fetchCategories();
      toast.success('Category added!');
    } catch (err) {
      const msg = err.response?.data?.name?.[0] || 'Could not add category.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteCategory(pendingDelete.id);
      fetchCategories();
      toast.success('Category deleted.');
    } catch (err) {
      const msg = err.response?.data?.detail || 'Could not delete category.';
      setError(msg);
      toast.error(msg);
    } finally {
      setPendingDelete(null);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2 className="page-title">Categories</h2>
          <p className="page-subtitle">Manage the categories you use to organize your expenses.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="expense-form-card">
        <div className="expense-form-row">
          <div className="form-field form-field-wide">
            <label>New category name</label>
            <input
              type="text"
              placeholder="e.g. Groceries"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="tally-input"
            />
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn-primary expense-submit-btn">
          <Plus size={16} /> {loading ? 'Adding...' : 'Add Category'}
        </button>
      </form>

      {error && <p className="error-text">{error}</p>}

      {categories.length === 0 ? (
        <div className="empty-state">
          <Tag size={32} color="#8B5CF6" />
          <p>No categories yet. Add your first one above.</p>
        </div>
      ) : (
        <div className="category-list">
          {categories.map((cat) => (
            <div key={cat.id} className="category-row-card">
              <span className="category-row-name">{cat.name}</span>
              <button onClick={() => setPendingDelete(cat)} className="icon-delete-btn">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={!!pendingDelete}
        title="Delete category?"
        message={
          pendingDelete
            ? `Are you sure you want to delete "${pendingDelete.name}"? This can't be undone.`
            : ''
        }
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}

export default CategoriesPage;