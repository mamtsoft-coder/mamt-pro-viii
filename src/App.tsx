import React, { useState } from 'react';
import GanttView from './components/GanttView';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Gantt');

  const renderTab = () => {
    switch (activeTab) {
      case 'Gantt':
        return <GanttView />;
      default:
        return (
          <div className="p-6 text-gray-500">
            <h2 className="text-xl font-semibold mb-2">Welcome to MAMT_pro VIII</h2>
            <p>Select a tab to begin.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans">
      {/* HEADER */}
      <header className="bg-gradient-to-r from-blue-800 to-blue-900 text-white p-3 flex items-center shadow-md">
        <div className="bg-white text-blue-800 w-10 h-10 rounded-full flex items-center justify-center font-bold mr-3">
          M
        </div>
        <h1 className="text-xl font-bold">MAMT_pro VIII — Mining Asset Management Tool</h1>
      </header>

      {/* TABS */}
      <div className="bg-white border-b flex px-4">
        {['Tracking', 'Gantt', 'Inventory', 'Budgeting', 'Rotables', 'Warranty', 'Reports'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium ${
              activeTab === tab
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-hidden">
        {renderTab()}
      </div>

      {/* CLIENT BANNER */}
      <div className="absolute bottom-3 left-3 bg-white px-4 py-1.5 rounded-lg shadow-md border flex items-center">
        <span className="text-sm font-medium">Client:</span>
        <span className="ml-2 text-blue-700 font-semibold">MiningCo Operations</span>
      </div>
    </div>
  );
};

export default App;
