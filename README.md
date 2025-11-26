# MAMT_pro VIII — Mining Asset Management Tool

A local-first, open-source ERP for mining asset lifecycle management.

## ✅ Features
- Asset tracking (parent/child hierarchy)
- Virtualized Gantt scheduling
- Rotables & component lifecycle
- Budgeting & forecasting
- Warranty management
- Drag-and-drop attachments
- Role-based access (Admin, Planner, Mechanic, Viewer)

## 🛠️ Tech Stack
- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Electron + SQLite + Prisma ORM
- **Scheduling**: Custom virtualized Gantt (react-window)
- **Exports**: PDF, Excel, CSV

## ▶️ Run Locally
```bash
npm install
npx prisma db push
npm run dev
