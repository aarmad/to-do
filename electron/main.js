/**
 * Neo-List — Electron Main Process
 * Gère : fenêtre principale, barre de titre custom, mises à jour auto (GitHub Releases)
 */

const {
    app,
    BrowserWindow,
    ipcMain,
    shell,
    Notification,
    nativeTheme,
    Menu,
} = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');

// ── Dev mode detection ────────────────────────────────────────────────────────
const isDev = process.argv.includes('--dev') || !app.isPackaged;

// ── Auto-updater config ───────────────────────────────────────────────────────
autoUpdater.autoDownload    = true;   // Télécharge dès qu'une update est dispo
autoUpdater.autoInstallOnAppQuit = true; // Installe à la fermeture

// En dev, forcer la vérification quand même (utile pour tester)
if (isDev) {
    autoUpdater.forceDevUpdateConfig = true;
}

// ── Main window reference ─────────────────────────────────────────────────────
let mainWindow = null;

function createWindow() {
    mainWindow = new BrowserWindow({
        width:     1340,
        height:    860,
        minWidth:  900,
        minHeight: 600,
        frame:     false,          // On utilise notre propre title bar
        transparent: false,
        backgroundColor: '#f5f5f0',   // Couleur bg du site (évite le flash blanc)
        titleBarStyle: 'hidden',
        webPreferences: {
            preload:          path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration:  false,
            sandbox:          true,
        },
        icon: path.join(__dirname, '../assets/icon.png'),
        show: false,               // Ne montre pas jusqu'à ready-to-show
    });

    // Charge l'app web
    mainWindow.loadFile(path.join(__dirname, '../index.html'));

    // Afficher la fenêtre proprement (sans flash blanc)
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        // Vérifier les updates après 3s (évite de bloquer le démarrage)
        if (!isDev) {
            setTimeout(() => autoUpdater.checkForUpdatesAndNotify(), 3000);
        }
    });

    // Ouvrir les liens <a target="_blank"> dans le navigateur système
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });

    // Dev tools en mode développement
    if (isDev) {
        mainWindow.webContents.openDevTools({ mode: 'detach' });
    }

    mainWindow.on('closed', () => { mainWindow = null; });
    mainWindow.on('maximize',   () => mainWindow?.webContents.send('window:maximized', true));
    mainWindow.on('unmaximize', () => mainWindow?.webContents.send('window:maximized', false));
}

// ── App lifecycle ─────────────────────────────────────────────────────────────
app.whenReady().then(() => {
    // Désactiver le menu natif (on a le nôtre)
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
ipcMain.handle('window:minimize',  () => mainWindow?.minimize());
ipcMain.handle('window:maximize',  () => {
    mainWindow?.isMaximized() ? mainWindow?.unmaximize() : mainWindow?.maximize();
});
ipcMain.handle('window:close',     () => mainWindow?.close());
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

// ── IPC : mise à jour manuelle ────────────────────────────────────────────────
ipcMain.handle('update:check',   () => autoUpdater.checkForUpdates());
ipcMain.handle('update:install', () => autoUpdater.quitAndInstall(false, true));

// ── Auto-updater events → renderer ───────────────────────────────────────────
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
    // Notification native à la fin du téléchargement
    if (Notification.isSupported()) {
        new Notification({
            title: 'Neo-List — Mise à jour prête',
            body:  `Version ${info.version} téléchargée. Elle sera installée à la prochaine fermeture.`,
        }).show();
    }
});

autoUpdater.on('error', (err) =>
    mainWindow?.webContents.send('update:error', err.message));
