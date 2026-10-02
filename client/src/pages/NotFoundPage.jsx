import React from 'react';
import { Link } from 'react-router-dom';
import Container from '../components/layout/Container';
import Button from '../components/common/Button';
import { Compass, Home } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="py-20 text-center">
      <Container>
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Compass className="w-10 h-10 animate-spin-slow" />
          </div>
          <span className="text-sm font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            404 Error
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-4 mb-2">
            Page Not Found
          </h1>
          <p className="text-sm text-slate-500 mb-8">
            The page you are looking for doesn't exist or has been moved to another URL.
          </p>
          <Link to="/">
            <Button variant="primary" size="lg" icon={Home}>
              Return to Homepage
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
};

export default NotFoundPage;
