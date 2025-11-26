import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  db: {
    assets: {
      getAll: () => ipcRenderer.invoke('db:assets:getAll'),
    },
    workOrders: {
      getByAsset: (assetId: number) => ipcRenderer.invoke('db:workOrders:getByAsset', assetId),
    }
  },
  attachments: {
    ensureDir: (options: { type: 'wo' | 'asset', id: number }) =>
      ipcRenderer.invoke('attachments:ensureDir', options)
  }
});
