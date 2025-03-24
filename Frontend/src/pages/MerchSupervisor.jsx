import React from 'react';
import VisitorPurchasesReport from '../components/VisitorPurchasesReport';
import LowStockMerchandise from '../components/LowStockMerchandise';

const MerchSupervisor = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Merchandise Supervisor Dashboard</h1>
      
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">Visitor Purchases Report</h2>
        <VisitorPurchasesReport />
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">Low Stock Merchandise</h2>
        <LowStockMerchandise />
      </section>
    </div>
  );
};

export default MerchSupervisor;