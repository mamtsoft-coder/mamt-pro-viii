import React, { useEffect, useState } from 'react';

function App() {
  const [assets, setAssets] = useState<any[]>([]);

  useEffect(() => {
    (window as any).api.db.assets.getAll().then(setAssets);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans">
      {/* HEADER: Company Icon + Banner */}
      <header className="bg-gradient-to-r from-blue-800 to-blue-900 text-white p-3 flex items-center shadow-md">
        <div className="bg-white text-blue-800 w-10 h-10 rounded-full flex items-center justify-center font-bold mr-3">
          M
        </div>
        <h1 className="text-xl font-bold">MAMT_pro VIII — Mining Asset Management Tool</h1>
      </header>

      {/* MAIN ERP LAYOUT */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Asset Navigator / Tabs */}
        <div className="w-64 bg-white border-r flex flex-col">
          <nav className="p-2 space-y-1">
            {['Tracking', 'Gantt', 'Inventory', 'Budgeting', 'Warranty', 'Reports'].map(tab => (
              <button
                key={tab}
                className="w-full text-left px-3 py-2 rounded hover:bg-blue-50 text-gray-700"
              >
                {tab}
              </button>
            ))}
          </nav>
          <div className="overflow-y-auto border-t mt-2">
            <h3 className="px-3 py-2 font-semibold text-gray-600">Assets</h3>
            {assets.map(a => (
              <div key={a.id} className="px-3 py-1.5 text-sm border-b hover:bg-gray-50 cursor-pointer">
                {a.assetNo} <br />
                <span className="text-gray-500 text-xs">{a.model}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Center: Gantt / Main View */}
        <div className="flex-1 bg-gray-100 relative">
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Planning & Scheduling (Gantt)</h2>
            <div className="bg-white p-6 rounded-lg shadow min-h-[600px] flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  📊
                </div>
                <p className="text-gray-600">Virtualized Gantt chart with work orders, downtime, and status lanes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Inspector */}
        <div className="w-80 bg-white border-l p-4 overflow-y-auto">
          <h2 className="font-bold text-lg mb-3">Inspector</h2>
          <div className="space-y-4 text-sm">
            <div>
              <label className="block text-gray-600">Asset No</label>
              <div className="font-mono bg-gray-100 p-2 rounded">EXC-001</div>
            </div>
            <div>
              <label className="block text-gray-600">Next Service Due</label>
              <div className="text-red-600 font-semibold">2025-12-15</div>
            </div>
            <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mt-4">
              Open Full Editor
            </button>
          </div>
        </div>
      </div>

      {/* CLIENT BANNER (Bottom Left) */}
      <div className="absolute bottom-3 left-3 bg-white px-4 py-1.5 rounded-lg shadow-md border flex items-center">
        <span className="text-sm font-medium">Client:</span>
        <span className="ml-2 text-blue-700 font-semibold">MiningCo Operations</span>
      </div>
    </div>
  );
}

export default App;
