import React from 'react';
import Sidebar from './Sidebar';
import DashboardContent from './DashboardContent';

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-black">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <DashboardContent />
      </div>
    </div>
  );
};

export default Dashboard;