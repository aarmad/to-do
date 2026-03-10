/**
 * Neo-List — Electron Preload Script
 * Pont sécurisé entre le processus main et le renderer (contextIsolation=true).
 * Expose uniquement les APIs nécessaires via contextBridge.
 */

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {

    // ── Infos app ─────────────────────────────────────────────────────────────
    getVersion: () => ipcRenderer.invoke('app:version'),
    isDev:      () => ipcRenderer.invoke('app:is-dev'),

    // ── Contrôles fenêtre (title bar custom) ──────────────────────────────────
    minimize:     () => ipcRenderer.invoke('window:minimize'),
    maximize:     () => ipcRenderer.invoke('window:maximize'),
    close:        () => ipcRenderer.invoke('window:close'),
    isMaximized:  () => ipcRenderer.invoke('window:is-maximized'),

    // Écouter les changements d'état maximize/unmaximize
    onWindowMaximized: (cb) => {
        const handler = (_, state) => cb(state);
        ipcRenderer.on('window:maximized', handler);
        return () => ipcRenderer.removeListener('window:maximized', handler);
    },

    // ── Notifications natives ──────────────────────────────────────────────────
    showNotification: (title, body, silent = false) =>
        ipcRenderer.invoke('notification:show', { title, body, silent }),

    // ── Mises à jour ──────────────────────────────────────────────────────────
    checkForUpdates: () => ipcRenderer.invoke('update:check'),
    installUpdate:   () => ipcRenderer.invoke('update:install'),

    // Écouter les événements de mise à jour
    onUpdateChecking:     (cb) => ipcRenderer.on('update:checking',      (_) => cb()),
    onUpdateAvailable:    (cb) => ipcRenderer.on('update:available',     (_, info) => cb(info)),
    onUpdateNotAvailable: (cb) => ipcRenderer.on('update:not-available', (_, info) => cb(info)),
    onUpdateProgress:     (cb) => ipcRenderer.on('update:progress',      (_, prog) => cb(prog)),
    onUpdateDownloaded:   (cb) => ipcRenderer.on('update:downloaded',    (_, info) => cb(info)),
    onUpdateError:        (cb) => ipcRenderer.on('update:error',         (_, msg)  => cb(msg)),
});
