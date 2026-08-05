function Sidebar() {
  return (
    <nav style={{ background: '#34495e', color: 'white', width: '200px', padding: '20px' }}>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li style={{ marginBottom: '10px' }}>Dashboard</li>
        <li style={{ marginBottom: '10px' }}>Expenses</li>
        <li style={{ marginBottom: '10px' }}>Budgets</li>
        <li style={{ marginBottom: '10px' }}>Analytics</li>
      </ul>
    </nav>
  );
}

export default Sidebar;
