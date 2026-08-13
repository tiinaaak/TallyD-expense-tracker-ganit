import { useState, useEffect } from 'react';
import { getCategories, createCategory, deleteCategory } from '../api/categories';

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data);
    } catch (err) {
      setError('Could not load categories.');
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
    } catch (err) {
      const msg = err.response?.data?.name?.[0] || 'Could not add category.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      fetchCategories();
    } catch (err) {
      setError('Could not delete category.');
    }
  };

  return (
    <div>
      <h2 style={{ color: '#1A1A2E' }}>Categories</h2>
      <p style={{ color: '#8B8FA3', marginTop: '-8px' }}>
        Manage the categories you use to organize your expenses.
      </p>

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '24px',
          padding: '20px',
          backgroundColor: '#F7F7FB',
          borderRadius: '12px',
        }}
      >
        <input
          type="text"
          placeholder="New category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />
        <button type="submit" disabled={loading} style={buttonStyle}>
          {loading ? 'Adding...' : 'Add Category'}
        </button>
      </form>

      {error && <p style={{ color: '#E74C3C' }}>{error}</p>}

      {categories.length === 0 ? (
        <p style={{ color: '#8B8FA3' }}>No categories yet. Add your first one above.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {categories.map((cat) => (
            <div key={cat.id} style={rowStyle}>
              <span style={{ fontWeight: 600, color: '#1A1A2E' }}>{cat.name}</span>
              <button onClick={() => handleDelete(cat.id)} style={deleteButtonStyle}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  padding: '10px 12px',
  border: '1px solid #DCDCE8',
  borderRadius: '8px',
  fontSize: '14px',
  flex: 1,
};

const buttonStyle = {
  padding: '10px 20px',
  backgroundColor: '#FF6B35',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  fontWeight: '600',
  cursor: 'pointer',
};

const rowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px 16px',
  backgroundColor: '#fff',
  border: '1px solid #E4E4EF',
  borderRadius: '8px',
};

const deleteButtonStyle = {
  padding: '6px 12px',
  backgroundColor: 'transparent',
  color: '#E74C3C',
  border: '1px solid #E74C3C',
  borderRadius: '6px',
  fontSize: '13px',
  cursor: 'pointer',
};

export default CategoriesPage;