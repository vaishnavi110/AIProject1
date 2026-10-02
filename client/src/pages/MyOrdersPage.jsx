import React from 'react';
import Container from '../components/layout/Container';
import EmptyState from '../components/common/EmptyState';
import { PackageCheck } from 'lucide-react';

const MyOrdersPage = () => {
  return (
    <div className="py-8">
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Orders</h1>
          <p className="text-sm text-slate-500 mt-1">
            Track and view previous purchases placed through your account
          </p>
        </div>

        <EmptyState
          icon={PackageCheck}
          title="No Orders Placed Yet"
          message="When you purchase items with Cash on Delivery, your orders will appear here."
          actionLabel="Explore Products"
          actionLink="/products"
        />
      </Container>
    </div>
  );
};

export default MyOrdersPage;
