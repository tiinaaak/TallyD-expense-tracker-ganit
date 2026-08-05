import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <main style={{ padding: '20px', flex: 1 }}>
          <p>Main content goes here.</p>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default App;
