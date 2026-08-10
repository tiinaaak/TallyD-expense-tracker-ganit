function Sidebar({ onLogout }) {
  return (
    <nav
      style={{
        background: '#34495e',
        color: 'white',
        width: '200px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        <li style={{ marginBottom: '10px' }}>Dashboard</li>
        <li style={{ marginBottom: '10px' }}>Expenses</li>
        <li style={{ marginBottom: '10px' }}>Budgets</li>
        <li style={{ marginBottom: '10px' }}>Analytics</li>
      </ul>

      <button
        onClick={() => {
          console.log('Logout clicked');
          onLogout();
        }}
        style={{
          padding: '10px',
          backgroundColor: '#16233F',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '600',
        }}
      >
        Log Out
      </button>
    </nav>
  );
}

export default Sidebar;