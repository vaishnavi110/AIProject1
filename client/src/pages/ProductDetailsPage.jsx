import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Container from '../components/layout/Container';
import Button from '../components/common/Button';
import { ArrowLeft, ShoppingBag } from 'lucide-react';

const ProductDetailsPage = () => {
  const { id } = useParams();

  return (
    <div className="py-8">
      <Container>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to catalog
        </Link>

        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-xs text-center max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Product Details</h1>
          <p className="text-sm text-slate-500 mb-6">
            Displaying product view for item ID: <code className="bg-slate-100 px-2 py-0.5 rounded text-indigo-600 font-mono text-xs">{id}</code>. Complete storefront details will be rendered in Phase 8.
          </p>
          <Link to="/products">
            <Button variant="primary">Browse All Products</Button>
          </Link>
        </div>
      </Container>
    </div>
  );
};

export default ProductDetailsPage;
