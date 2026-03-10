/**
 * Neo-List — Electron Main Process (v2)
 * Gère : fenêtre principale, barre de titre custom, mises à jour auto (GitHub Releases)
 */

const {
    app,
    BrowserWindow,
    ipcMain,
    shell,
    Notification,
    Menu,
} = require('electron');
const path = require('path');

// ── Dev mode ──────────────────────────────────────────────────────────────────
const isDev = process.argv.includes('--dev') || !app.isPackaged;

// ── electron-updater en chargement OPTIONNEL ──────────────────────────────────
// Si absent du bundle (build mal configuré), l'app fonctionne quand même.
let autoUpdater = null;
try {
    autoUpdater = require('electron-updater').autoUpdater;
    autoUpdater.autoDownload         = true;
    autoUpdater.autoInstallOnAppQuit = true;
    console.log('[updater] electron-updater chargé.');
} catch (e) {
    console.warn('[updater] electron-updater non disponible :', e.message);
}

// ── Main window reference ─────────────────────────────────────────────────────
let mainWindow = null;

function createWindow() {
    mainWindow = new BrowserWindow({
        width:     1340,
        height:    860,
        minWidth:  900,
        minHeight: 600,
        frame:     false,
        transparent: false,
        backgroundColor: '#f5f5f0',
        titleBarStyle: 'hidden',
        webPreferences: {
            preload:          path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration:  false,
            sandbox:          true,
        },
        icon: path.join(__dirname, '../assets/icon.png'),
        show: false,
    });

    mainWindow.loadFile(path.join(__dirname, '../index.html'));

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        // Vérifier les updates 3s après le démarrage (production seulement)
        if (!isDev && autoUpdater) {
            setTimeout(() => autoUpdater.checkForUpdatesAndNotify(), 3000);
        }
    });

    // Ouvrir les liens externes dans le navigateur système
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });

    // DevTools uniquement en mode dev
    if (isDev) {
        mainWindow.webContents.openDevTools({ mode: 'detach' });
    }

    mainWindow.on('closed',    () => { mainWindow = null; });
    mainWindow.on('maximize',   () => mainWindow?.webContents.send('window:maximized', true));
    mainWindow.on('unmaximize', () => mainWindow?.webContents.send('window:maximized', false));
}

// ── App lifecycle ─────────────────────────────────────────────────────────────
app.whenReady().then(() => {
    Menu.setApplicationMenu(null);
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// ── IPC : contrôles fenêtre ───────────────────────────────────────────────────
ipcMain.handle('window:minimize',     () => mainWindow?.minimize());
ipcMain.handle('window:maximize',     () => {
    mainWindow?.isMaximized() ? mainWindow?.unmaximize() : mainWindow?.maximize();
});
ipcMain.handle('window:close',        () => mainWindow?.close());
ipcMain.handle('window:is-maximized', () => mainWindow?.isMaximized() ?? false);

// ── IPC : infos app ───────────────────────────────────────────────────────────
ipcMain.handle('app:version', () => app.getVersion());
ipcMain.handle('app:is-dev',  () => isDev);

// ── IPC : notifications natives ───────────────────────────────────────────────
ipcMain.handle('notification:show', (_, { title, body, silent }) => {
    if (Notification.isSupported()) {
        new Notification({
            title,
            body,
            silent: silent ?? false,
            icon: path.join(__dirname, '../assets/icon.png'),
        }).show();
        return true;
    }
    return false;
});

// ── IPC : mises à jour (gardées si autoUpdater disponible) ───────────────────
ipcMain.handle('update:check',   () => autoUpdater?.checkForUpdates()   ?? null);
ipcMain.handle('update:install', () => autoUpdater?.quitAndInstall(false, true) ?? null);

// ── Auto-updater events → renderer ───────────────────────────────────────────
// Tout est conditionné à autoUpdater !== null
if (autoUpdater) {
    autoUpdater.on('checking-for-update', () =>
        mainWindow?.webContents.send('update:checking'));

    autoUpdater.on('update-available', (info) =>
        mainWindow?.webContents.send('update:available', info));

    autoUpdater.on('update-not-available', (info) =>
        mainWindow?.webContents.send('update:not-available', info));

    autoUpdater.on('download-progress', (progress) =>
        mainWindow?.webContents.send('update:progress', progress));

    autoUpdater.on('update-downloaded', (info) => {
        mainWindow?.webContents.send('update:downloaded', info);
        if (Notification.isSupported()) {
            new Notification({
                title: 'Neo-List — Mise à jour prête',
                body:  `Version ${info.version} téléchargée. Elle sera installée à la fermeture.`,
            }).show();
        }
    });

    autoUpdater.on('error', (err) =>
        mainWindow?.webContents.send('update:error', err.message));
}
