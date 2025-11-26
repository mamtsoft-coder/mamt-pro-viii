import React, { useState, useRef, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

// Mock data (replace with real API calls later)
const MOCK_ASSETS = [
  { id: 1, name: 'EXC-001', model: 'Cat 330' },
  { id: 2, name: 'TRK-005', model: '777F Haul Truck' },
  { id: 3, name: 'DRL-002', model: 'MD1200 Drill' },
];

const MOCK_WORK_ORDERS = [
  { id: 1, assetId: 1, title: 'Hydraulic Service', start: new Date('2025-11-26'), end: new Date('2025-11-27'), status: 'Planned' },
  { id: 2, assetId: 1, title: 'Track Replacement', start: new Date('2025-12-10'), end: new Date('2025-12-12'), status: 'Planned' },
  { id: 3, assetId: 2, title: 'Engine Overhaul', start: new Date('2025-12-01'), end: new Date('2025-12-05'), status: 'Planned' },
];

const MOCK_DOWNTIME = [
  { assetId: 1, start: new Date('2025-11-28'), end: new Date('2025-11-29'), type: 'Breakdown' },
  { assetId: 2, start: new Date('2025-12-15'), end: new Date('2025-12-16'), type: 'Planned' },
];

// Helper: Get pixel position from date
const dateToPixel = (date: Date, startDate: Date, pxPerDay: number): number => {
  const diffTime = date.getTime() - startDate.getTime();
  const diffDays = diffTime / (1000 * 3600 * 24);
  return diffDays * pxPerDay;
};

// Helper: Format date for display
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Status lane colors (SAP/Maximo style)
const getStatusColor = (date: Date, assetId: number): string => {
  // Simulate: green = available, red = breakdown, yellow = planned maintenance
  const wo = MOCK_WORK_ORDERS.find(wo => wo.assetId === assetId && date >= wo.start && date <= wo.end);
  if (wo) return '#eab308'; // yellow - planned
  
  const dt = MOCK_DOWNTIME.find(dt => dt.assetId === assetId && date >= dt.start && date <= dt.end);
  if (dt) return dt.type === 'Breakdown' ? '#ef4444' : '#f97316'; // red or orange

  return '#10b981'; // green - available
};

// Downtime color mapping
const getDowntimeColor = (type: string): string => {
  switch (type) {
    case 'Breakdown': return 'rgba(239, 68, 68, 0.5)';
    case 'Planned': return 'rgba(249, 115, 22, 0.5)';
    case 'Standby': return 'rgba(147, 197, 253, 0.5)';
    default: return 'rgba(156, 163, 175, 0.4)';
  }
};

// Single Gantt Row (for one asset)
const GanttRow: React.FC<{ 
  asset: typeof MOCK_ASSETS[0]; 
  startDate: Date; 
  endDate: Date; 
  pxPerDay: number;
  onSelectWorkOrder: (woId: number) => void;
}> = ({ asset, startDate, endDate, pxPerDay, onSelectWorkOrder }) => {
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
  const rowHeight = 80;

  // Generate status pixels (1 per day)
  const statusPixels = Array.from({ length: days }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    return getStatusColor(date, asset.id);
  });

  // Get WOs for this asset
  const workOrders = MOCK_WORK_ORDERS.filter(wo => wo.assetId === asset.id);
  const downtimeEvents = MOCK_DOWNTIME.filter(dt => dt.assetId === asset.id);

  return (
    <div className="border-b border-gray-200" style={{ height: rowHeight }}>
      {/* Status Lane (Thin top bar) */}
      <div className="h-2 w-full flex">
        {statusPixels.map((color, i) => (
          <div key={i} className="h-full" style={{ width: `${pxPerDay}px`, backgroundColor: color }} />
        ))}
      </div>

      {/* Main Row Content */}
      <div className="relative h-16 mt-1 px-2 flex items-center">
        {/* Asset label */}
        <div className="absolute left-2 font-medium text-gray-800">
          {asset.name} <span className="text-gray-500 text-sm">({asset.model})</span>
        </div>

        {/* Downtime Overlays */}
        {downtimeEvents.map((dt, idx) => {
          const left = dateToPixel(dt.start, startDate, pxPerDay);
          const width = dateToPixel(dt.end, startDate, pxPerDay) - left;
          return (
            <div
              key={`dt-${idx}`}
              className="absolute top-0 h-full rounded-sm cursor-pointer"
              style={{
                left: `${left}px`,
                width: `${width}px`,
                backgroundColor: getDowntimeColor(dt.type),
                border: '1px solid ' + getDowntimeColor(dt.type).replace('0.5', '0.8'),
              }}
              title={`${dt.type}: ${formatDate(dt.start)} – ${formatDate(dt.end)}`}
            />
          );
        })}

        {/* Work Order Bars */}
        {workOrders.map(wo => {
          const left = dateToPixel(wo.start, startDate, pxPerDay);
          const width = dateToPixel(wo.end, startDate, pxPerDay) - left;
          return (
            <div
              key={wo.id}
              className="absolute top-6 h-6 bg-blue-600 rounded text-white text-xs px-1.5 py-0.5 cursor-move hover:bg-blue-700"
              style={{ left: `${left}px`, width: `${width}px` }}
              onClick={() => onSelectWorkOrder(wo.id)}
              title={`${wo.title} (${formatDate(wo.start)} – ${formatDate(wo.end)})`}
            >
              {wo.title}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Timeline Header
const TimelineHeader: React.FC<{ startDate: Date; pxPerDay: number }> = ({ startDate, pxPerDay }) => {
  const days = 42; // 6 weeks
  return (
    <div className="flex border-b border-gray-300 bg-gray-50 sticky top-0 z-10">
      <div className="w-48 border-r border-gray-200 p-2 font-bold">Assets</div>
      <div className="flex-1">
        <div className="flex h-10">
          {Array.from({ length: days }).map((_, i) => {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);
            const isToday = date.toDateString() === new Date().toDateString();
            return (
              <div
                key={i}
                className={`text-xs text-center flex flex-col justify-center border-l ${isToday ? 'bg-blue-100' : ''}`}
                style={{ width: `${pxPerDay}px` }}
              >
                <span>{date.getDate()}</span>
                <span className="text-gray-500">{date.toLocaleDateString('en-US', { month: 'short' })}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Main Gantt View
const GanttView: React.FC = () => {
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<number | null>(null);
  const startDate = new Date('2025-11-24'); // Start from last Monday
  const pxPerDay = 30; // Pixels per day (adjustable)

  const handleSelectWorkOrder = (woId: number) => {
    setSelectedWorkOrder(woId);
    // In real app: open Inspector panel with WO details
    console.log('Open WO:', woId);
  };

  const rowRenderer = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const asset = MOCK_ASSETS[index];
    return (
      <div style={style}>
        <GanttRow
          asset={asset}
          startDate={startDate}
          endDate={new Date('2026-01-10')}
          pxPerDay={pxPerDay}
          onSelectWorkOrder={handleSelectWorkOrder}
        />
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-3 border-b bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-800">Maintenance Gantt — Planning & Scheduling</h2>
        <p className="text-sm text-gray-600 mt-1">
          Drag work orders to reschedule • Click to inspect • Downtime overlays shown in color
        </p>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Gantt Area */}
        <div className="flex-1 overflow-auto">
          <TimelineHeader startDate={startDate} pxPerDay={pxPerDay} />
          <AutoSizer>
            {({ height, width }) => (
              <List
                height={height - 40}
                itemCount={MOCK_ASSETS.length}
                itemSize={80}
                width={width}
                style={{ overflowX: 'hidden' }}
              >
                {rowRenderer}
              </List>
            )}
          </AutoSizer>
        </div>

        {/* Inspector Panel (Right) */}
        <div className="w-80 border-l bg-gray-50 p-4 overflow-y-auto">
          <h3 className="font-bold text-lg mb-3">Inspector</h3>
          {selectedWorkOrder ? (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Work Order</label>
                <div className="mt-1 p-2 bg-white rounded border">#WO-{selectedWorkOrder}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <div className="mt-1 p-2 bg-blue-100 text-blue-800 rounded font-medium">Planned</div>
              </div>
              <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                Open Full Editor
              </button>
            </div>
          ) : (
            <p className="text-gray-500">Click a work order or downtime block to inspect.</p>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="p-2 bg-gray-100 text-xs flex flex-wrap gap-4">
        <span className="flex items-center">
          <span className="w-3 h-3 bg-green-500 rounded-sm mr-1"></span> Available
        </span>
        <span className="flex items-center">
          <span className="w-3 h-3 bg-yellow-500 rounded-sm mr-1"></span> Planned Maintenance
        </span>
        <span className="flex items-center">
          <span className="w-3 h-3 bg-red-500 rounded-sm mr-1"></span> Breakdown
        </span>
        <span className="flex items-center">
          <span className="w-3 h-3 bg-orange-500 rounded-sm mr-1"></span> Planned Shutdown
        </span>
      </div>
    </div>
  );
};

export default GanttView;
