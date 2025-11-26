import { app, BrowserWindow, ipcMain, dialog, shell } from 'electron';
import path from 'path';
import fs from 'fs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1600,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, '../dist/electron/preload.js'),
      contextIsolation: true,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// === IPC HANDLERS ===
ipcMain.handle('db:assets:getAll', async () => {
  return prisma.asset.findMany({ include: { children: true } });
});

ipcMain.handle('db:workOrders:getByAsset', async (_, assetId: number) => {
  return prisma.workOrder.findMany({ where: { assetId } });
});

ipcMain.handle('attachments:ensureDir', async (_, { type, id }: { type: 'wo' | 'asset', id: number }) => {
  const dir = path.join(app.getPath('userData'), 'attachments', `${type}_${id}`);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
});
