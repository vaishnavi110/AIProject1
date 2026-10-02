import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={
            <div className="text-center py-16 space-y-4">
              <h1 className="text-3xl font-bold text-slate-900">Checkout</h1>
              <p className="text-slate-600">Checkout flow integration coming next.</p>
            </div>
          } />
          <Route path="/login" element={
            <div className="text-center py-16 space-y-4">
              <h1 className="text-3xl font-bold text-slate-900">Login</h1>
              <p className="text-slate-600">Authentication modal/page coming soon.</p>
            </div>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
