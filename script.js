/* ===========================
   Neo-List — script.js (v9)
   =========================== */
// ── Icônes SVG (partagées par l'app et l'intégration Electron) ─────────────
// Aucune emoji dans l'interface : toute icône passe par SVG / icon().
const SVG = {
    sun:       `<path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z"/>`,
    moon:      `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>`,
    todo:      `<circle cx="12" cy="12" r="5" fill="none" stroke="#888" stroke-width="2.5"/>`,
    active:    `<polygon points="5 3 19 12 5 21 5 3" fill="#ffbb33"/>`,
    completed: `<polyline points="20 6 9 17 4 12" stroke="#00C851" stroke-width="3" stroke-linecap="round" fill="none"/>`,
    pin:       `<path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"/><path d="m7.5 4.27 9 5.15"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/>`,
    expand:    `<polyline points="6 9 12 15 18 9"/>`,
    trash:     `<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>`,
    check:     `<polyline points="20 6 9 17 4 12"/>`,
    hourglass: `<path d="M5 2h14"/><path d="M5 22h14"/><path d="M19 2l-7 7-7-7"/><path d="M5 22l7-7 7 7"/>`,
    repeat:    `<polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>`,
    copy:      `<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>`,
    play:      `<polygon points="5 3 19 12 5 21 5 3" fill="currentColor"/>`,
    pause:     `<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>`,
    calendar:  `<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>`,
    clock:     `<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>`,
    edit:      `<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>`,
    speaker:   `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>`,
    x:         `<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>`,
    plus:      `<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>`,
    minus:     `<line x1="5" y1="12" x2="19" y2="12"/>`,
    maximize:  `<rect x="5" y="5" width="14" height="14" rx="1"/>`,
    restore:   `<rect x="4" y="8" width="12" height="12" rx="1"/><path d="M8 8V4h12v12h-4"/>`,
    chevronL:  `<polyline points="15 18 9 12 15 6"/>`,
    chevronR:  `<polyline points="9 18 15 12 9 6"/>`,
    star:      `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor"/>`,
    mic:       `<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0"/><line x1="12" y1="17" x2="12" y2="22"/>`,
    timer:     `<line x1="10" y1="2" x2="14" y2="2"/><line x1="12" y1="14" x2="15" y2="11"/><circle cx="12" cy="14" r="8"/>`,
    flame:     `<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>`,
    award:     `<circle cx="12" cy="8" r="6"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>`,
    search:    `<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>`,
    download:  `<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>`,
    checkCircle: `<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>`,
    alert:     `<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>`,
};

function icon(name, size = 14, cls = '') {
    return `<svg class="i${cls ? ' ' + cls : ''}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${SVG[name]}</svg>`;
}

function escHtml(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

document.addEventListener('DOMContentLoaded', () => {

    // ── DOM refs ─────────────────────────────────────────────────────────────
    const taskInput      = document.getElementById('taskInput');
    const taskNote       = document.getElementById('taskNote');
    const statusInput    = document.getElementById('statusInput');
    const tagInput       = document.getElementById('tagInput');
    const dueDateInput   = document.getElementById('dueDateInput');
    const startTimeInput = document.getElementById('startTimeInput');
    const durationInput  = document.getElementById('durationInput');
    const recurringInput = document.getElementById('recurringInput');
    const addTaskBtn     = document.getElementById('addTaskBtn');
    const taskList       = document.getElementById('taskList');
    const boardContainer = document.getElementById('boardContainer');
    const calendarContainer = document.getElementById('calendarContainer');
    const taskListCard   = document.getElementById('taskListCard');

    const progressBar    = document.getElementById('progressBar');
    const progressText   = document.getElementById('progressText');
    const circlePct      = document.getElementById('circlePct');
    const statsDetail    = document.getElementById('statsDetail');
    const clockEl        = document.getElementById('clock');
    const clearBtn       = document.getElementById('clearTasks');
    const markAllBtn     = document.getElementById('markAllDone');
    const themeToggle    = document.getElementById('themeToggle');
    const themeIcon      = document.getElementById('themeIcon');
    const filterBtns     = document.querySelectorAll('.filter-btn');
    const searchInput    = document.getElementById('searchInput');
    const clearSearch    = document.getElementById('clearSearch');
    const sortSelect     = document.getElementById('sortSelect');

    const listViewBtn     = document.getElementById('listViewBtn');
    const boardViewBtn    = document.getElementById('boardViewBtn');
    const calendarViewBtn = document.getElementById('calendarViewBtn');

    const exportBtn      = document.getElementById('exportBtn');
    const importBtn      = document.getElementById('importBtn');
    const importFile     = document.getElementById('importFile');
    const shortcutsBtn   = document.getElementById('shortcutsBtn');
    const shortcutsModal = document.getElementById('shortcutsModal');
    const closeModal     = document.getElementById('closeModal');
    const emptyState     = document.getElementById('emptyState');
    const colorDots      = document.querySelectorAll('.color-dot');

    // Edit Modal
    const editModal      = document.getElementById('editModal');
    const editModalTitle = document.getElementById('editModalTitle');
    const closeEditModal = document.getElementById('closeEditModal');
    const cancelEditBtn  = document.getElementById('cancelEditBtn');
    const saveEditBtn    = document.getElementById('saveEditBtn');
    const editText       = document.getElementById('editText');
    const editNote       = document.getElementById('editNote');
    const editStatus     = document.getElementById('editStatus');
    const editTag        = document.getElementById('editTag');
    const editDueDate    = document.getElementById('editDueDate');
    const editStartTime  = document.getElementById('editStartTime');
    const editDuration   = document.getElementById('editDuration');
    const editRecurring  = document.getElementById('editRecurring');
    const editColorPicker = document.getElementById('editColorPicker');

    // Pomodoro
    const pomoTimer       = document.getElementById('pomoTimer');
    const pomoStart       = document.getElementById('pomoStart');
    const pomoReset       = document.getElementById('pomoReset');
    const pomoModes       = document.querySelectorAll('.pomo-mode');
    const pomoSettingsBtn = document.getElementById('pomoSettingsBtn');
    const pomoSettings    = document.getElementById('pomoSettings');
    const pomoWorkInput   = document.getElementById('pomoWorkInput');
    const pomoBreakInput  = document.getElementById('pomoBreakInput');

    const dailyTargetInput = document.getElementById('dailyTargetInput');
    const targetFill       = document.getElementById('targetFill');
    const targetText       = document.getElementById('targetText');
    const scratchpad       = document.getElementById('scratchpad');
    const statTodo   = document.getElementById('statTodo');
    const statActive = document.getElementById('statActive');
    const statDone   = document.getElementById('statDone');

    // Voice capture
    const voiceCapture    = document.getElementById('voiceCapture');
    const voiceBtn        = document.getElementById('voiceBtn');
    const voiceMeterBars  = document.querySelectorAll('#voiceMeter span');
    const voiceTimer      = document.getElementById('voiceTimer');
    const voiceStatus     = document.getElementById('voiceStatus');
    const voiceResult     = document.getElementById('voiceResult');
    const voiceResultText = document.getElementById('voiceResultText');
    const voiceUndoBtn    = document.getElementById('voiceUndoBtn');
    const voiceEditBtn    = document.getElementById('voiceEditBtn');
    const editVoice       = document.getElementById('editVoice');
    const editVoiceBtn    = document.getElementById('editVoiceBtn');
    const editVoiceStatus = document.getElementById('editVoiceStatus');
    const manualToggle    = document.getElementById('manualToggle');
    const manualForm      = document.getElementById('manualForm');

    const api = window.electronAPI;

    // ── State ────────────────────────────────────────────────────────────────
    let tasks         = JSON.parse(localStorage.getItem('neoTasks')) || [];
    let currentFilter = 'all';
    let searchQuery   = '';
    // L'agenda devient la vue principale (une fois, puis le choix de l'utilisateur est respecté)
    if (!localStorage.getItem('neoCalendarIntro')) {
        localStorage.setItem('neoView', 'calendar');
        localStorage.setItem('neoCalendarIntro', '1');
    }
    let currentView   = localStorage.getItem('neoView') || 'calendar';
    if (currentView === 'timeline') currentView = 'calendar';

    // Agenda
    const CAL_HOUR_PX     = 48;   // hauteur d'une heure dans la grille
    const CAL_SNAP_MIN    = 15;   // pas du glisser-déposer et du redimensionnement
    const CAL_DEFAULT_DUR = 30;   // durée affichée quand la tâche n'en a pas
    const CAL_DAY_SHORT   = ['DIM', 'LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM'];
    const CAL_MONTHS      = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    let calMode      = localStorage.getItem('neoCalMode') || 'week';   // week | day
    let calAnchor    = new Date(); calAnchor.setHours(0, 0, 0, 0);
    let calScrollTop = null;    // position de défilement conservée entre deux rendus
    let calDrag      = null;    // { id, offsetMin, duration } pendant un glisser
    let calResizing  = false;
    let selectedColor = '#ff4444';
    let editingTaskId = null;   // tracks which task is being edited
    let editingIsNew  = false;  // fenêtre d'édition ouverte en mode création
    let editSelectedColor = '#ff4444';
    let audioPlayer   = null;   // lecture d'un mémo vocal
    let playingTaskId = null;

    let pomoWorkTime    = parseInt(localStorage.getItem('pomoWork'))  || 25;
    let pomoBreakTime   = parseInt(localStorage.getItem('pomoBreak')) || 5;
    let pomoInterval;
    let pomoTimeLeft    = pomoWorkTime * 60;
    let pomoIsRunning   = false;
    let pomoCurrentMode = 'work';
    let dailyTarget     = parseInt(localStorage.getItem('neoDailyTarget')) || 5;

    // Notification tracking — don't re-fire for same task in same minute
    const notifiedTasks = new Set();


    // ── Init ─────────────────────────────────────────────────────────────────
    updateClock();
    setInterval(updateClock, 1000);
    // Rafraîchit l'agenda chaque minute (ligne « maintenant »), sauf pendant une interaction
    setInterval(() => { if (currentView === 'calendar' && !calDrag && !calResizing) renderTasks(); }, 60000);

    applyTheme(localStorage.getItem('neoTheme') === 'dark');
    applyView(currentView);

    pomoWorkInput.value  = pomoWorkTime;
    pomoBreakInput.value = pomoBreakTime;
    pomoTimeLeft = pomoWorkTime * 60;
    updatePomoDisplay();

    dailyTargetInput.value = dailyTarget;
    scratchpad.value = localStorage.getItem('neoScratchpad') || '';

    // Request notification permission once
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }

    // Check overdue tasks every 60 seconds
    setInterval(checkOverdueTasks, 60000);
    checkOverdueTasks(); // initial check

    renderTasks();

    // ── Color picker (create form) ────────────────────────────────────────────
    colorDots.forEach(dot => {
        dot.addEventListener('click', () => {
            colorDots.forEach(d => d.classList.remove('selected'));
            dot.classList.add('selected');
            selectedColor = dot.dataset.color;
        });
    });

    // ── Color picker (edit modal) ─────────────────────────────────────────────
    editColorPicker.querySelectorAll('.color-dot').forEach(dot => {
        dot.addEventListener('click', () => {
            editColorPicker.querySelectorAll('.color-dot').forEach(d => d.classList.remove('selected'));
            dot.classList.add('selected');
            editSelectedColor = dot.dataset.color;
        });
    });

    // ── Theme ────────────────────────────────────────────────────────────────
    themeToggle.addEventListener('click', toggleTheme);
    function toggleTheme() {
        const dark = !document.body.classList.contains('dark-mode');
        applyTheme(dark);
        localStorage.setItem('neoTheme', dark ? 'dark' : 'light');
    }
    function applyTheme(dark) {
        document.body.classList.toggle('dark-mode', dark);
        themeIcon.innerHTML = dark ? SVG.sun : SVG.moon;
    }

    // ── Add Task ─────────────────────────────────────────────────────────────
    function addTask() {
        const text = taskInput.value.trim();
        if (!text) { showToast('Écris une tâche d\'abord !'); return; }

        tasks.push({
            id:        Date.now(),
            text,
            note:      taskNote?.value.trim()     || '',
            status:    statusInput.value,
            tag:       tagInput.value.trim()       || 'Général',
            dueDate:   dueDateInput.value          || null,
            startTime: startTimeInput?.value       || null,
            duration:  durationInput?.value        || null,
            recurring: recurringInput?.value       || null,
            color:     selectedColor,
            pinned:    false,
            subtasks:  [],
            expanded:  false,
            createdAt: new Date().toISOString(),
        });

        saveAndRender();
        taskInput.value = '';
        if (taskNote)       taskNote.value = '';
        if (tagInput)       tagInput.value = '';
        if (dueDateInput)   dueDateInput.value = '';
        if (startTimeInput) startTimeInput.value = '';
        if (durationInput)  durationInput.value = '';
        if (recurringInput) recurringInput.value = '';
        taskInput.focus();
        showToast('Tâche ajoutée !');
    }

    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); addTask(); }
    });

    // ── Saisie manuelle (repliée, la voix est le mode principal) ─────────────
    function setManualOpen(open) {
        manualForm.style.display = open ? 'flex' : 'none';
        manualToggle.setAttribute('aria-expanded', open);
        localStorage.setItem('neoManualOpen', open ? '1' : '');
    }
    setManualOpen(localStorage.getItem('neoManualOpen') === '1');
    manualToggle.addEventListener('click', () => setManualOpen(manualForm.style.display === 'none'));

    // ── Capture vocale ───────────────────────────────────────────────────────
    // Electron : enregistrement MediaRecorder + transcription Whisper locale (main process).
    // Navigateur : repli sur la Web Speech API si disponible.
    const SpeechRec   = window.SpeechRecognition || window.webkitSpeechRecognition;
    const voiceEngine = api?.transcribe ? 'whisper' : SpeechRec ? 'browser' : null;
    const MAX_REC_MS  = 60000;
    const HALLUCINATIONS = /sous-titr|amara\.org|merci d'avoir regard|abonnez-vous|^\W*$/i;

    let voiceState    = 'idle';    // idle | recording | busy | error
    let recStream     = null;
    let recorder      = null;
    let recChunks     = [];
    let recognition   = null;
    let recTranscript = '';
    let recAudioCtx   = null;
    let recRaf        = null;
    let recTick       = null;
    let recStartedAt  = 0;
    let sttProgress   = null;
    let lastVoiceTask = null;
    let voiceTarget   = 'create';  // create = nouvelle tâche | edit = fenêtre d'édition

    const voiceStatusEl = () => voiceTarget === 'edit' ? editVoiceStatus : voiceStatus;
    const voiceIdleMsg  = () => voiceTarget === 'edit' ? 'Dicte une modification' : 'Appuie et dicte ta tâche';

    function setVoiceState(state, msg) {
        voiceState = state;
        (voiceTarget === 'edit' ? editVoice : voiceCapture).dataset.state = state;
        voiceStatusEl().textContent = msg;
    }

    if (!voiceEngine) setVoiceState('error', 'Dictée indisponible ici');

    api?.onSpeechProgress?.(p => {
        sttProgress = p;
        if (voiceState !== 'busy') return;
        if (p.status === 'download') voiceStatusEl().textContent = `Téléchargement du modèle… ${p.percent}%`;
        else if (p.status === 'loading') voiceStatusEl().textContent = 'Chargement du modèle…';
    });

    async function startVoice(target = 'create') {
        if (voiceState === 'recording' || voiceState === 'busy') return;
        voiceTarget = target;
        if (!voiceEngine) { setVoiceState('error', 'Dictée indisponible ici'); return; }
        if (target === 'create') voiceResult.style.display = 'none';

        try {
            recStream = await navigator.mediaDevices.getUserMedia({
                audio: { echoCancellation: true, noiseSuppression: true, channelCount: 1 },
            });
        } catch (_) {
            setVoiceState('error', 'Micro inaccessible — vérifie les autorisations');
            return;
        }

        if (voiceEngine === 'whisper') {
            api.prepareSpeech().catch(() => {}); // charge le modèle pendant qu'on parle
            recChunks = [];
            recorder  = new MediaRecorder(recStream, { mimeType: 'audio/webm;codecs=opus' });
            recorder.ondataavailable = e => { if (e.data.size) recChunks.push(e.data); };
            recorder.start();
        } else {
            recTranscript = '';
            recognition = new SpeechRec();
            recognition.lang = 'fr-FR';
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.onresult = e => {
                recTranscript = Array.from(e.results).map(r => r[0].transcript).join(' ');
                voiceStatusEl().textContent = recTranscript;
            };
            recognition.start();
        }

        startMeter(recStream);
        recStartedAt = Date.now();
        voiceTimer.textContent = '00:00';
        recTick = setInterval(() => {
            const ms = Date.now() - recStartedAt;
            if (voiceTarget === 'create') voiceTimer.textContent = `${pad(Math.floor(ms / 60000))}:${pad(Math.floor(ms / 1000) % 60)}`;
            if (ms >= MAX_REC_MS) stopVoice();
        }, 250);
        setVoiceState('recording', 'J\'écoute…');
    }

    function startMeter(stream) {
        recAudioCtx = new AudioContext();
        const analyser = recAudioCtx.createAnalyser();
        analyser.fftSize = 64;
        recAudioCtx.createMediaStreamSource(stream).connect(analyser);
        const data = new Uint8Array(analyser.frequencyBinCount);
        const draw = () => {
            analyser.getByteFrequencyData(data);
            if (voiceTarget === 'create') voiceMeterBars.forEach((bar, i) => {
                const v = data[2 + i * 2] / 255;
                bar.style.height = `${4 + Math.round(v * 18)}px`;
            });
            recRaf = requestAnimationFrame(draw);
        };
        draw();
    }

    function releaseMic() {
        clearInterval(recTick);
        voiceTimer.textContent = '00:00';
        cancelAnimationFrame(recRaf);
        voiceMeterBars.forEach(bar => bar.style.height = '');
        recAudioCtx?.close(); recAudioCtx = null;
        recStream?.getTracks().forEach(t => t.stop()); recStream = null;
    }

    // cancel = true → abandon (appui trop court, Échap)
    async function stopVoice(cancel = false) {
        if (voiceState !== 'recording') return;
        const elapsed = Date.now() - recStartedAt;
        if (elapsed < 400) cancel = true;

        if (voiceEngine === 'browser') {
            recognition.onend = () => {
                releaseMic();
                if (cancel) { setVoiceState('idle', voiceIdleMsg()); return; }
                const text = recTranscript.trim();
                if (!text) { setVoiceState('error', 'Je n\'ai rien entendu, réessaie'); return; }
                handleTranscript(text, null);
            };
            recognition.stop();
            setVoiceState('busy', 'Transcription…');
            return;
        }

        const stopped = new Promise(r => { recorder.onstop = r; });
        recorder.stop();
        await stopped;
        releaseMic();
        if (cancel) { setVoiceState('idle', voiceIdleMsg()); return; }

        setVoiceState('busy', sttProgress?.status === 'download'
            ? `Téléchargement du modèle… ${sttProgress.percent}%`
            : 'Transcription…');

        const audioBytes = await new Blob(recChunks, { type: 'audio/webm' }).arrayBuffer();
        let samples;
        try {
            samples = await decodeTo16k(audioBytes);
        } catch (_) {
            setVoiceState('error', 'Enregistrement illisible, réessaie');
            return;
        }

        let peak = 0;
        for (let i = 0; i < samples.length; i++) peak = Math.max(peak, Math.abs(samples[i]));
        if (peak < 0.02) { setVoiceState('error', 'Je n\'ai rien entendu, réessaie'); return; }

        let text = '';
        try {
            text = await api.transcribe(samples);
        } catch (err) {
            console.error('[voice] transcription :', err);
            if (voiceTarget === 'edit') { setVoiceState('error', 'Transcription impossible, réessaie'); return; }
            // On garde quand même le mémo audio pour ne rien perdre
            const now = new Date();
            createVoiceTask(`Mémo vocal du ${now.toLocaleDateString('fr-FR')} à ${pad(now.getHours())}:${pad(now.getMinutes())}`,
                audioBytes, { raw: true });
            setVoiceState('error', 'Transcription impossible (connexion ?) — mémo audio gardé');
            return;
        }
        if (HALLUCINATIONS.test(text)) { setVoiceState('error', 'Je n\'ai rien compris, réessaie'); return; }
        handleTranscript(text, audioBytes);
    }

    function handleTranscript(text, audioBytes) {
        if (voiceTarget === 'edit') applyVoiceEdit(text);
        else createVoiceTask(text, audioBytes);
    }

    async function decodeTo16k(arrayBuffer) {
        // Un AudioContext à 16 kHz rééchantillonne au décodage (format attendu par Whisper)
        const ctx = new AudioContext({ sampleRate: 16000 });
        try {
            const buf = await ctx.decodeAudioData(arrayBuffer.slice(0));
            return buf.getChannelData(0);
        } finally {
            ctx.close();
        }
    }

    async function createVoiceTask(transcript, audioBytes, { raw = false } = {}) {
        const parsed = raw ? { text: transcript } : parseVoiceTask(transcript);
        const id = Date.now();
        let audioId = null;
        if (audioBytes && api?.saveAudio) {
            try { await api.saveAudio(id, audioBytes); audioId = String(id); }
            catch (err) { console.error('[voice] sauvegarde audio :', err); }
        }

        const task = {
            id,
            text:       parsed.text || transcript,
            note:       !raw && parsed.condensed ? transcript.trim() : '',   // phrase dictée complète
            status:     'todo',
            tag:        parsed.tag       || 'Général',
            dueDate:    parsed.dueDate   || null,
            startTime:  parsed.startTime || null,
            duration:   parsed.duration  || null,
            recurring:  parsed.recurring || null,
            color:      selectedColor,
            pinned:     !!parsed.pinned,
            subtasks:   [],
            expanded:   false,
            createdAt:  new Date().toISOString(),
            audioId,
            transcript: raw ? null : transcript,
        };
        tasks.push(task);
        lastVoiceTask = task;
        saveAndRender();

        if (!raw) setVoiceState('idle', 'Tâche ajoutée — dicte la suivante');
        voiceResultText.textContent = task.text;
        voiceResult.style.display = 'flex';
    }

    voiceUndoBtn.addEventListener('click', () => {
        if (!lastVoiceTask) return;
        removeTask(lastVoiceTask);
        lastVoiceTask = null;
        voiceResult.style.display = 'none';
        setVoiceState('idle', 'Annulée — appuie pour recommencer');
    });

    voiceEditBtn.addEventListener('click', () => {
        if (lastVoiceTask) openEditModal(lastVoiceTask.id);
    });

    voiceBtn.addEventListener('click', () => {
        if (voiceState === 'recording') stopVoice();
        else startVoice('create');
    });

    editVoiceBtn.addEventListener('click', () => {
        if (voiceState === 'recording') stopVoice();
        else startVoice('edit');
    });

    // Espace : maintenir = push-to-talk, appui bref = bascule. M : bascule.
    let pttDownAt = 0;
    document.addEventListener('keydown', e => {
        if (e.code !== 'Space' || e.repeat || !canUseVoiceShortcut()) return;
        e.preventDefault();
        document.activeElement?.blur();
        if (voiceState === 'recording') { stopVoice(); return; }
        pttDownAt = Date.now();
        startVoice();
    });
    document.addEventListener('keyup', e => {
        if (e.code !== 'Space' || !pttDownAt) return;
        e.preventDefault();
        const held = Date.now() - pttDownAt;
        pttDownAt = 0;
        if (held > 500) stopVoice();
    });

    function canUseVoiceShortcut() {
        const a = document.activeElement;
        const typing = a && (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA' || a.tagName === 'SELECT' || a.isContentEditable);
        const modalOpen = editModal.style.display === 'flex' || shortcutsModal.style.display === 'flex';
        return !typing && !modalOpen;
    }

    // ── Analyse du texte dicté (français) → champs de la tâche ───────────────
    const NUM_WORDS = {
        un: 1, une: 1, deux: 2, trois: 3, quatre: 4, cinq: 5, six: 6, sept: 7, huit: 8, neuf: 9,
        dix: 10, onze: 11, douze: 12, quinze: 15, vingt: 20, trente: 30, quarante: 40,
        'quarante-cinq': 45, cinquante: 50, soixante: 60, premier: 1, '1er': 1,
    };
    const NUM = `(\\d{1,3}|${Object.keys(NUM_WORDS).sort((a, b) => b.length - a.length).join('|')})`;
    const toNum = w => /^\d+$/.test(w) ? parseInt(w) : NUM_WORDS[w.toLowerCase()];

    const WORD_BOUNDARY = '(?:(?<![\\wÀ-ÿ])(?=[\\wÀ-ÿ])|(?<=[\\wÀ-ÿ])(?![\\wÀ-ÿ]))';
    const uniRe = re => new RegExp(re.source.replace(/\\b/g, WORD_BOUNDARY), re.flags);

    const WEEKDAYS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    const MONTHS   = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

    const IMPERATIVE = {
        prenez: 'prendre', venez: 'venir', mettez: 'mettre', faites: 'faire', dites: 'dire', lisez: 'lire',
        écrivez: 'écrire', allez: 'aller', voyez: 'voir', revoyez: 'revoir', sortez: 'sortir', partez: 'partir',
        faîtes: 'faire', buvez: 'boire', courez: 'courir', ouvrez: 'ouvrir', suivez: 'suivre',
    };

    // Espaces, ponctuation et mots de liaison orphelins en début / fin
    function tidyTitle(s) {
        s = s.replace(/\s+([,;:])/g, '$1').replace(/([,;:])(?:\s*[,;:])+/g, '$1').replace(/\s{2,}/g, ' ').trim();
        for (let prev = ''; prev !== s;) {
            prev = s;
            s = s.replace(/^(?:[,;:]|et|à|a|le|la|pour|de)\s+/i, '')
                 .replace(/(?:\s+(?:et|à|a|le|la|pour|de|du|vers|dès|avant|après|en|au))+$/i, '')
                 .replace(/[\s,;:.]+$/, '')
                 .trim();
        }
        return s;
    }

    // Verbes conjugués à la 1re personne (« que je prenne », « j'appelle ») → infinitif
    const CONJUGATED = {
        prenne: 'prendre', prends: 'prendre', fasse: 'faire', fais: 'faire', aille: 'aller', vais: 'aller',
        mette: 'mettre', mets: 'mettre', dise: 'dire', dis: 'dire', lise: 'lire', lis: 'lire',
        écrive: 'écrire', écris: 'écrire', sorte: 'sortir', sors: 'sortir', parte: 'partir', pars: 'partir',
        voie: 'voir', vois: 'voir', revoie: 'revoir', rende: 'rendre', rends: 'rendre',
        réponde: 'répondre', réponds: 'répondre', attende: 'attendre', attends: 'attendre',
        vende: 'vendre', vends: 'vendre', descende: 'descendre', finisse: 'finir', finis: 'finir',
        choisisse: 'choisir', remplisse: 'remplir', reçoive: 'recevoir', reçois: 'recevoir',
        boive: 'boire', bois: 'boire', puisse: 'pouvoir', doive: 'devoir', sache: 'savoir',
        appelle: 'appeler', rappelle: 'rappeler', jette: 'jeter', achète: 'acheter', lève: 'lever',
        emmène: 'emmener', amène: 'amener', ramène: 'ramener', envoie: 'envoyer', renvoie: 'renvoyer',
        paie: 'payer', nettoie: 'nettoyer', essaie: 'essayer', aie: 'avoir', sois: 'être',
        passe: 'passer', range: 'ranger', mange: 'manger', change: 'changer',
    };

    function toInfinitive(word) {
        const lw = word.toLowerCase();
        if (CONJUGATED[lw]) return CONJUGATED[lw];
        if (/(?:er|ir|re|oir)$/.test(lw)) return lw;           // déjà à l'infinitif
        if (lw.length > 3 && /e$/.test(lw)) return lw + 'r';   // « range » → « ranger », « réserve » → « réserver »
        return lw;
    }

    // Formules d'intention en tête de phrase ; « conj » = le verbe qui suit est conjugué
    const INTENT_PREFIXES = [
        { re: /^(?:euh+|heu+|bah|ben|bon|alors|donc|ok|du coup|en fait)[\s,]+/i },
        { re: /^(?:il\s+)?(?:faut|faudrait|faudra)\s+(?:absolument\s+|vraiment\s+|surtout\s+)?que\s+(?:je\s+|j')/i, conj: true },
        { re: /^(?:il\s+)?(?:faut|faudrait|faudra)\s+(?:absolument\s+|vraiment\s+|surtout\s+)?(?:qu'on\s+|que\s+l'on\s+)/i, conj: true },
        { re: /^(?:il\s+)?(?:faut|faudrait|faudra)\s+(?:absolument\s+|vraiment\s+|surtout\s+)?/i },
        { re: /^(?:il\s+me\s+faut|j'ai\s+besoin\s+d[e']\s*|je\s+(?:dois|devrais|vais|voudrais|veux|compte)\s+(?:absolument\s+|vraiment\s+)?)/i },
        { re: /^(?:rappelle[- ]moi|rappelle[- ]toi|souviens[- ]toi|n'oublie\s+pas|oublie\s+pas|ne\s+pas\s+oublier|penser|pense)(?![a-zà-ÿ])\s*(?:de\s+|d'|à\s+)?/i },
        { re: /^(?:je\s+|j')/i, conj: true },
    ];
    // Ce qui suit est une justification ou un détail : coupé du titre
    const ASIDE = /(?:[,;]\s*|\s+)(?:parce\s+qu|car\s|puisqu|vu\s+qu|pour\s+que\s|histoire\s+de\s|comme\s+ça\s|sinon\s|si\s+possible)|[,;]\s*(?:il\s+)?(?:faut|faudra|faudrait|peut-être|genre|enfin|sinon|et\s+puis|mais|je\s|j'|on\s|ça\s|c'est\s)|\s+en\s+[a-zà-ÿ]+ant\b/i;
    const TITLE_MAX_WORDS = 8;

    function condenseTitle(s) {
        let conj = false;
        s = s.replace(/\b(?:euh+|heu+)\b[\s,]*/gi, '').replace(/\s+(?:absolument|vraiment)\b/gi, '');
        for (let prev = ''; prev !== s;) {
            prev = s;
            for (const p of INTENT_PREFIXES) {
                if (p.re.test(s)) { s = s.replace(p.re, ''); if (p.conj) conj = true; break; }
            }
        }

        const aside = s.search(ASIDE);
        if (aside > 0) s = s.slice(0, aside);
        s = tidyTitle(s);

        // Trop long : on coupe à la première articulation après le 3e mot, sinon net
        let words = s.split(/\s+/);
        if (words.length > TITLE_MAX_WORDS) {
            // Virgule d'abord (elle sépare souvent le détail), puis les connecteurs
            const head = words.slice(0, 3).join(' ').length;
            for (const sep of [/,\s/, /\s(?:pour|afin|et|si|qui|que|avec)\s/i]) {
                const cut = s.slice(head).search(sep);
                if (cut >= 0) { s = s.slice(0, head + cut); break; }
            }
            words = tidyTitle(s).split(/\s+/);
            s = tidyTitle(words.slice(0, TITLE_MAX_WORDS).join(' '));
        }

        if (conj) s = s.replace(/^[A-Za-zÀ-ÿ]+(?![-'’A-Za-zÀ-ÿ])/, toInfinitive);
        return s;
    }

    function parseVoiceTask(raw) {
        const out = {};
        let s = ` ${raw.trim().replace(/[.!?…]+$/, '')} `;
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const addDays = n => { const d = new Date(today); d.setDate(d.getDate() + n); return d; };
        const nextWeekday = idx => addDays(((idx - today.getDay() + 7) % 7) || 7);
        // Applique une regex, passe le match à fn, retire le passage reconnu du texte.
        // \b de JS ignore les accents (« à ») : on le remplace par une frontière Unicode.
        const take = (re, fn) => {
            const m = s.match(uniRe(re));
            if (!m || fn(m) === false) return;
            s = s.replace(m[0], ' ');
        };

        // Récurrence
        take(/\b(?:tous les jours|chaque jour|quotidiennement)\b/i, () => { out.recurring = 'daily'; });
        take(new RegExp(`\\b(?:tous les|chaque)\\s+(${WEEKDAYS.join('|')})s?\\b`, 'i'), m => {
            out.recurring = 'weekly';
            out.dueDate = isoDate(nextWeekday(WEEKDAYS.indexOf(m[1].toLowerCase())));
        });
        take(/\b(?:toutes les semaines|chaque semaine)\b/i, () => { out.recurring = 'weekly'; });
        take(/\b(?:tous les mois|chaque mois)\b/i, () => { out.recurring = 'monthly'; });

        // Durée (avant l'heure : « pendant 1h » n'est pas un horaire)
        const DUR = '(?:pendant|durant|pour une durée d[e\']|durée d[e\'])\\s*';
        take(new RegExp(`\\b${DUR}(?:une\\s+)?demi-heure\\b`, 'i'), () => { out.duration = '30'; });
        take(new RegExp(`\\b${DUR}${NUM}\\s*(?:h|heures?)(?![A-Za-zÀ-ÿ])(?:\\s*(et demie?|\\d{1,2})\\s*(?:min(?:utes?)?)?)?`, 'i'), m => {
            const h = toNum(m[1]);
            const extra = !m[2] ? 0 : /demi/i.test(m[2]) ? 30 : parseInt(m[2]);
            out.duration = String(h * 60 + extra);
        });
        take(new RegExp(`\\b${DUR}${NUM}\\s*(?:min(?:utes?)?|mn)\\b`, 'i'), m => { out.duration = String(toNum(m[1])); });

        // Heure
        take(/\b(?:(?:à|a|vers|pour)\s+)?(?<!après-)(midi|minuit)(\s+et demie?)?\b/i, m => {
            out.startTime = `${m[1].toLowerCase() === 'midi' ? '12' : '00'}:${m[2] ? '30' : '00'}`;
        });
        take(new RegExp(`\\b(?:(?:à|a|vers|pour|dès)\\s+)?${NUM}\\s*(?:heures?|h|:)(?:\\s*(\\d{2}))?(?:\\s+(et demie?|et quart|moins le quart))?(?:\\s+(du matin|de l'après-midi|de l’après-midi|du soir))?\\b`, 'i'), m => {
            let h = toNum(m[1]);
            let min = m[2] ? parseInt(m[2]) : 0;
            if (/demi/i.test(m[3] || '')) min = 30;
            else if (/et quart/i.test(m[3] || '')) min = 15;
            else if (/moins/i.test(m[3] || '')) { h -= 1; min = 45; }
            if (m[4] && !/matin/i.test(m[4]) && h < 12) h += 12;
            if (h == null || h > 23 || min > 59) return false;
            out.startTime = `${pad(h)}:${pad(min)}`;
        });

        // Date
        const PART_OF_DAY = '(?:\\s+(?:soir|matin|après-midi|aprem))?';
        take(new RegExp(`\\baprès[- ]demain${PART_OF_DAY}\\b`, 'i'), () => { out.dueDate = isoDate(addDays(2)); });
        take(new RegExp(`\\bdemain${PART_OF_DAY}\\b`, 'i'), () => { out.dueDate = isoDate(addDays(1)); });
        take(/\b(?:aujourd'hui|aujourd’hui|ce soir|ce matin|cet après-midi)\b/i, () => { out.dueDate = isoDate(today); });
        take(/\b(?:ce\s+)?week-?end\b/i, () => { out.dueDate = isoDate(nextWeekday(6)); });
        take(/\b(?:la\s+)?semaine prochaine\b/i, () => { out.dueDate = isoDate(nextWeekday(1)); });
        take(new RegExp(`\\bdans\\s+${NUM}\\s+(jours?|semaines?)\\b`, 'i'), m => {
            out.dueDate = isoDate(addDays(toNum(m[1]) * (/semaine/i.test(m[2]) ? 7 : 1)));
        });
        take(new RegExp(`\\b(?:le\\s+)?${NUM}\\s+(${MONTHS.join('|')})(?:\\s+(\\d{4}))?\\b`, 'i'), m => {
            const day = toNum(m[1]);
            if (!day || day > 31) return false;
            const d = new Date(m[3] ? parseInt(m[3]) : today.getFullYear(), MONTHS.indexOf(m[2].toLowerCase()), day);
            if (!m[3] && d < today) d.setFullYear(d.getFullYear() + 1);
            out.dueDate = isoDate(d);
        });
        take(new RegExp(`\\b(?:ce\\s+|le\\s+)?(${WEEKDAYS.join('|')})(?:\\s+prochain)?${PART_OF_DAY}\\b`, 'i'), m => {
            if (out.dueDate) return false;
            out.dueDate = isoDate(nextWeekday(WEEKDAYS.indexOf(m[1].toLowerCase())));
        });

        // Tag & priorité
        take(/\b(?:tag|étiquette|catégorie)\s*:?\s*([\wÀ-ÿ-]+)/i, m => {
            out.tag = m[1].charAt(0).toUpperCase() + m[1].slice(1).toLowerCase();
        });
        take(/(?:,?\s*c'est\s+|,\s*)?\b(?:urgente?|importante?)\b/i, () => { out.pinned = true; });

        // Phrase parlée → titre court (la phrase complète ira dans la note)
        s = tidyTitle(s);
        const condensed = condenseTitle(s);
        out.condensed = condensed.toLowerCase() !== s.toLowerCase();
        s = condensed;

        // Whisper conjugue souvent à l'impératif (« Appelez ») : on revient à l'infinitif
        s = s.replace(/^[A-Za-zÀ-ÿ]+(?![-'’A-Za-zÀ-ÿ])/, w => {
            const lw = w.toLowerCase();
            let inf = IMPERATIVE[lw];
            if (!inf && lw.length > 4 && lw.endsWith('issez')) inf = lw.slice(0, -5) + 'ir';
            else if (!inf && lw.length > 4 && lw.endsWith('ndez')) inf = lw.slice(0, -2) + 're';
            else if (!inf && lw.length > 4 && lw.endsWith('ez')) inf = lw.slice(0, -2) + 'er';
            return inf || w;
        });

        out.text = s.charAt(0).toUpperCase() + s.slice(1);
        return out;
    }

    function isoDate(d) {
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    }

    // ── Modification dictée → champs de la fenêtre d'édition ────────────────
    // Seuls les éléments mentionnés changent ; l'utilisateur valide avec « Sauvegarder ».
    const EDIT_STATUS = [
        [/\b(?:terminée?s?|finie?s?|c'est fait)\b/i, 'completed'],
        [/\ben cours\b/i,                            'active'],
        [/\bà faire\b/i,                             'todo'],
    ];
    const EDIT_FILLERS = /^[\s,;:]*(?:(?:plutôt|finalement|en fait|non|ok|alors|(?:chang|modifi|déplac|décal|repouss|avanc|marqu|pass)(?:er|ez|e|é|ée)|mets|mettre|mettez|la tâche|ça|cela|le|la|les|à|au|pour|en|comme|et)(?:[\s,;:]+|$))+/i;

    function applyVoiceEdit(raw) {
        let s = raw.trim().replace(/[.!?…]+$/, '');
        const changed = [];
        const set = (input, value, label) => {
            if (input.value === value) return;
            input.value = value;
            flashField(input);
            changed.push(label);
        };

        // Renommage explicite : « renommer en … », « nouveau titre … » (tout ce qui suit)
        let explicitTitle = null;
        s = s.replace(uniRe(/\b(?:renomme[rz]?(?:\s+la tâche)?\s+(?:en|par)|change[rz]?\s+le\s+titre\s+(?:en|par)|nouveau\s+titre\s*:?)\s+(.+)$/i), (_, t) => {
            explicitTitle = t.trim();
            return ' ';
        });

        // Note : « note : … » / « ajoute une note … » (tout ce qui suit)
        s = s.replace(uniRe(/\b(?:ajoute[rz]?\s+(?:une\s+)?)?note\s*:?\s*(.+)$/i), (_, note) => {
            set(editNote, editNote.value ? `${editNote.value}\n${note.trim()}` : note.trim(), 'note');
            return ' ';
        });

        // Statut
        for (const [re, status] of EDIT_STATUS) {
            const u = uniRe(re);
            if (u.test(s)) { set(editStatus, status, 'statut'); s = s.replace(u, ' '); break; }
        }

        // Effacements explicites
        s = s.replace(uniRe(/\b(?:sans|pas de|enlève[rz]?\s+la|supprime[rz]?\s+la)\s+date\b/i), () => { set(editDueDate, '', 'date'); return ' '; });
        s = s.replace(uniRe(/\b(?:sans|pas d'|enlève[rz]?\s+l'|supprime[rz]?\s+l')\s*heure\b/i), () => {
            set(editStartTime, '', 'heure'); set(editDuration, '', 'durée'); return ' ';
        });
        s = s.replace(uniRe(/\b(?:plus|pas)\s+récurrente?\b|\bune seule fois\b/i), () => { set(editRecurring, '', 'récurrence'); return ' '; });

        const parsed = parseVoiceTask(s);
        if (parsed.dueDate)   set(editDueDate,   parsed.dueDate,   'date');
        if (parsed.startTime) set(editStartTime, parsed.startTime, 'heure');
        if (parsed.duration)  set(editDuration,  parsed.duration,  'durée');
        if (parsed.recurring) set(editRecurring, parsed.recurring, 'récurrence');
        if (parsed.tag)       set(editTag,       parsed.tag,       'tag');

        // Le reste devient le titre, sauf s'il ne contient que des mots de liaison
        const rest  = (parsed.text || '').replace(EDIT_FILLERS, '').trim();
        const title = explicitTitle || (rest.length > 2 ? parsed.text : null);
        if (title) set(editText, title.charAt(0).toUpperCase() + title.slice(1), 'titre');

        if (changed.length) setVoiceState('idle', `Modifié : ${changed.join(', ')} — Sauvegarde pour valider`);
        else setVoiceState('error', `Rien à changer dans « ${raw.trim()} »`);
    }

    function flashField(input) {
        input.classList.remove('field-flash');
        void input.offsetWidth; // relance l'animation
        input.classList.add('field-flash');
    }

    // ── Mémo audio des tâches ────────────────────────────────────────────────
    function stopTaskAudio() {
        if (!audioPlayer) return;
        audioPlayer.pause();
        URL.revokeObjectURL(audioPlayer.src);
        audioPlayer = null; playingTaskId = null;
        document.querySelectorAll('.audio-badge.playing').forEach(b => b.classList.remove('playing'));
    }

    async function toggleTaskAudio(task, btn) {
        const wasPlaying = playingTaskId === task.id;
        stopTaskAudio();
        if (wasPlaying) return;

        const data = await api?.loadAudio(task.audioId);
        if (!data) { showToast('Mémo audio introuvable.'); return; }
        audioPlayer = new Audio(URL.createObjectURL(new Blob([data], { type: 'audio/webm' })));
        playingTaskId = task.id;
        btn.classList.add('playing');
        audioPlayer.onended = stopTaskAudio;
        audioPlayer.play().catch(stopTaskAudio);
    }

    function removeTask(task) {
        tasks = tasks.filter(t => t.id !== task.id);
        deleteAudioIfUnused(task.audioId);
        saveAndRender();
    }

    function deleteAudioIfUnused(audioId) {
        if (!audioId || !api?.deleteAudio) return;
        if (playingTaskId && !tasks.some(t => t.id === playingTaskId)) stopTaskAudio();
        if (tasks.some(t => t.audioId === audioId)) return; // partagé avec une copie
        api.deleteAudio(audioId).catch(() => {});
    }

    // ── Edit Modal ───────────────────────────────────────────────────────────
    // taskId = null → création (ex. clic sur un créneau de l'agenda), avec champs pré-remplis
    function openEditModal(taskId, preset = {}) {
        const isNew = taskId == null;
        const task = isNew
            ? { text: '', note: '', status: 'todo', tag: '', color: selectedColor, ...preset }
            : tasks.find(t => t.id === taskId);
        if (!task) return;
        editingTaskId   = taskId;
        editingIsNew    = isNew;
        editSelectedColor = task.color || '';
        editModalTitle.innerHTML = isNew
            ? `${icon('plus', 18)} Nouvelle tâche`
            : `${icon('edit', 18)} Modifier la tâche`;

        editText.value      = task.text;
        editNote.value      = task.note || '';
        editStatus.value    = task.status;
        editTag.value       = task.tag || '';
        editDueDate.value   = task.dueDate || '';
        editStartTime.value = task.startTime || '';
        editDuration.value  = task.duration || '';
        editRecurring.value = task.recurring || '';

        if (voiceState !== 'recording' && voiceState !== 'busy') {
            editVoice.dataset.state = 'idle';
            editVoiceStatus.textContent = isNew ? 'Dicte ta tâche' : 'Dicte une modification';
        }

        // Update color picker
        editColorPicker.querySelectorAll('.color-dot').forEach(dot => {
            dot.classList.toggle('selected', dot.dataset.color === editSelectedColor);
        });

        editModal.style.display = 'flex';
        // Création : le micro a le focus (Espace / Entrée pour dicter), sinon le titre
        (isNew ? editVoiceBtn : editText).focus();
    }

    function closeEdit() {
        if (voiceTarget === 'edit' && voiceState === 'recording') stopVoice(true);
        editModal.style.display = 'none';
        editingTaskId = null;
        editingIsNew  = false;
    }

    function saveEdit() {
        let task = editingIsNew ? null : tasks.find(t => t.id === editingTaskId);
        if (!editingIsNew && !task) return;

        const newText = editText.value.trim();
        if (!newText) { showToast('Le titre ne peut pas être vide.'); return; }

        const wasNew = editingIsNew;
        if (wasNew) {
            task = { id: Date.now(), pinned: false, subtasks: [], expanded: false, createdAt: new Date().toISOString() };
            tasks.push(task);
        }

        task.text      = newText;
        task.note      = editNote.value.trim();
        task.status    = editStatus.value;
        task.tag       = editTag.value.trim() || 'Général';
        task.dueDate   = editDueDate.value   || null;
        task.startTime = editStartTime.value || null;
        task.duration  = editDuration.value  || null;
        task.recurring = editRecurring.value || null;
        task.color     = editSelectedColor;

        closeEdit();
        saveAndRender();
        showToast(wasNew ? 'Tâche ajoutée !' : 'Tâche mise à jour !');
    }

    saveEditBtn.addEventListener('click', saveEdit);
    closeEditModal.addEventListener('click', closeEdit);
    cancelEditBtn.addEventListener('click', closeEdit);
    editModal.addEventListener('click', e => { if (e.target === editModal) closeEdit(); });
    editText.addEventListener('keydown', e => { if (e.key === 'Enter') saveEdit(); });

    // ── Overdue Notifications ─────────────────────────────────────────────────
    function checkOverdueTasks() {
        const now   = new Date();
        const hhmm  = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

        tasks.forEach(task => {
            if (!task.startTime || task.status === 'completed') return;
            if (task.startTime > hhmm) return; // not started yet

            const key = `${task.id}-${task.startTime}`;
            if (notifiedTasks.has(key)) return;
            notifiedTasks.add(key);

            // Check if it's actually overdue (past start time, not done)
            const isOverdue = task.startTime < hhmm;
            if (!isOverdue) return;

            const msg = `Tâche en retard : « ${task.text} »`;
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('Neo-List', { body: msg, icon: 'assets/icon.png' });
            }
            showToast(msg, 'clock');
        });
    }

    // ── Search ───────────────────────────────────────────────────────────────
    searchInput.addEventListener('input', e => {
        searchQuery = e.target.value.toLowerCase();
        clearSearch.style.display = searchQuery ? 'flex' : 'none';
        renderTasks();
    });
    clearSearch.addEventListener('click', () => {
        searchInput.value = ''; searchQuery = '';
        clearSearch.style.display = 'none';
        renderTasks();
    });

    // ── Keyboard Shortcuts ───────────────────────────────────────────────────
    document.addEventListener('keydown', e => {
        const active   = document.activeElement;
        const isTyping = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.contentEditable === 'true');

        if (e.key === 'Escape') {
            if (voiceState === 'recording')              stopVoice(true);
            if (editModal.style.display === 'flex')      closeEdit();
            if (shortcutsModal.style.display === 'flex') shortcutsModal.style.display = 'none';
            return;
        }
        if (isTyping) return;

        switch (e.key.toLowerCase()) {
            case 'n': e.preventDefault(); setManualOpen(true); taskInput.focus(); break;
            case 'm':
                e.preventDefault();
                if (voiceState === 'recording') stopVoice();
                else startVoice(editModal.style.display === 'flex' ? 'edit' : 'create');
                break;
            case '/': e.preventDefault(); searchInput.focus(); break;
            case 't': e.preventDefault(); toggleTheme(); break;
            case 'v':
                e.preventDefault();
                applyView(currentView === 'calendar' ? 'list' : currentView === 'list' ? 'board' : 'calendar');
                renderTasks(); break;
            case 'arrowleft':  if (currentView === 'calendar') { e.preventDefault(); calShift(-1); } break;
            case 'arrowright': if (currentView === 'calendar') { e.preventDefault(); calShift(1); }  break;
            case '?': case 'k':
                e.preventDefault();
                shortcutsModal.style.display = shortcutsModal.style.display === 'flex' ? 'none' : 'flex';
                break;
            case '1': setFilter('all');       break;
            case '2': setFilter('todo');      break;
            case '3': setFilter('active');    break;
            case '4': setFilter('completed'); break;
        }
    });

    function setFilter(f) {
        filterBtns.forEach(b => b.classList.remove('active'));
        document.querySelector(`[data-filter="${f}"]`)?.classList.add('active');
        currentFilter = f; renderTasks();
    }

    // ── Filters ──────────────────────────────────────────────────────────────
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTasks();
        });
    });
    sortSelect.addEventListener('change', renderTasks);

    // ── Bulk actions ─────────────────────────────────────────────────────────
    markAllBtn.addEventListener('click', () => {
        tasks = tasks.map(t => ({ ...t, status: 'completed' }));
        saveAndRender(); showToast('Toutes les tâches terminées !');
    });

    let clearTimeout_;
    clearBtn.addEventListener('click', () => {
        if (clearBtn.textContent.includes('SÛR')) {
            const audioIds = [...new Set(tasks.map(t => t.audioId).filter(Boolean))];
            tasks = []; saveAndRender();
            audioIds.forEach(deleteAudioIfUnused);
            clearBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">${SVG.trash}</svg> EFFACER TOUT`;
            clearTimeout(clearTimeout_); showToast('Liste vidée.');
        } else {
            clearBtn.textContent = 'SÛR ?';
            clearTimeout_ = setTimeout(() => {
                clearBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">${SVG.trash}</svg> EFFACER TOUT`;
            }, 3000);
        }
    });

    // ── View ─────────────────────────────────────────────────────────────────
    calendarViewBtn.addEventListener('click', () => { applyView('calendar'); renderTasks(); });
    listViewBtn.addEventListener('click',     () => { applyView('list');     renderTasks(); });
    boardViewBtn.addEventListener('click',    () => { applyView('board');    renderTasks(); });

    function applyView(view) {
        currentView = view;
        localStorage.setItem('neoView', view);
        calendarViewBtn.classList.toggle('active', view === 'calendar');
        listViewBtn.classList.toggle('active',     view === 'list');
        boardViewBtn.classList.toggle('active',    view === 'board');
        taskList.style.display = view === 'list' ? 'flex' : 'none';
        boardContainer.classList.toggle('active',    view === 'board');
        calendarContainer.classList.toggle('active', view === 'calendar');
        taskListCard.classList.toggle('is-calendar', view === 'calendar');
        document.body.classList.toggle('view-calendar', view === 'calendar');
    }

    // ── Pomodoro ─────────────────────────────────────────────────────────────
    function updatePomoDisplay() {
        pomoTimer.textContent = `${pad(Math.floor(pomoTimeLeft / 60))}:${pad(pomoTimeLeft % 60)}`;
    }

    pomoStart.addEventListener('click', () => {
        if (pomoIsRunning) {
            clearInterval(pomoInterval);
            pomoStart.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">${SVG.play}</svg>`;
        } else {
            pomoInterval = setInterval(() => {
                pomoTimeLeft--;
                updatePomoDisplay();
                if (pomoTimeLeft <= 0) {
                    clearInterval(pomoInterval); pomoIsRunning = false;
                    pomoStart.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">${SVG.play}</svg>`;
                    const msg = pomoCurrentMode === 'work' ? 'Temps écoulé ! Pause ?' : 'Pause finie ! Au boulot !';
                    showToast(msg);
                    if ('Notification' in window && Notification.permission === 'granted') {
                        new Notification('Pomodoro', { body: msg });
                    }
                    try {
                        const ctx = new (window.AudioContext || window.webkitAudioContext)();
                        const osc = ctx.createOscillator();
                        osc.type = 'sine'; osc.frequency.setValueAtTime(523, ctx.currentTime);
                        osc.connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + 0.4);
                    } catch(_) {}
                }
            }, 1000);
            pomoStart.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">${SVG.pause}</svg>`;
        }
        pomoIsRunning = !pomoIsRunning;
    });

    pomoReset.addEventListener('click', () => {
        clearInterval(pomoInterval); pomoIsRunning = false;
        const activeMode = document.querySelector('.pomo-mode.active');
        pomoTimeLeft = (activeMode?.textContent.toLowerCase().includes('travail') ? pomoWorkTime : pomoBreakTime) * 60;
        updatePomoDisplay();
        pomoStart.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">${SVG.play}</svg>`;
    });

    pomoModes.forEach(mode => {
        mode.addEventListener('click', () => {
            pomoModes.forEach(m => m.classList.remove('active'));
            mode.classList.add('active');
            clearInterval(pomoInterval); pomoIsRunning = false;
            pomoCurrentMode = mode.textContent.toLowerCase().includes('travail') ? 'work' : 'break';
            pomoTimeLeft = (pomoCurrentMode === 'work' ? pomoWorkTime : pomoBreakTime) * 60;
            updatePomoDisplay();
            pomoStart.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">${SVG.play}</svg>`;
        });
    });

    pomoSettingsBtn.addEventListener('click', () => {
        pomoSettings.style.display = pomoSettings.style.display === 'none' ? 'block' : 'none';
    });
    pomoWorkInput.addEventListener('change', () => {
        pomoWorkTime = parseInt(pomoWorkInput.value) || 25;
        localStorage.setItem('pomoWork', pomoWorkTime);
        if (pomoCurrentMode === 'work' && !pomoIsRunning) { pomoTimeLeft = pomoWorkTime * 60; updatePomoDisplay(); }
    });
    pomoBreakInput.addEventListener('change', () => {
        pomoBreakTime = parseInt(pomoBreakInput.value) || 5;
        localStorage.setItem('pomoBreak', pomoBreakTime);
        if (pomoCurrentMode === 'break' && !pomoIsRunning) { pomoTimeLeft = pomoBreakTime * 60; updatePomoDisplay(); }
    });

    // ── Daily Target ─────────────────────────────────────────────────────────
    dailyTargetInput.addEventListener('change', () => {
        dailyTarget = parseInt(dailyTargetInput.value) || 5;
        localStorage.setItem('neoDailyTarget', dailyTarget);
        updateUI();
    });

    // ── Scratchpad ───────────────────────────────────────────────────────────
    scratchpad.addEventListener('input', () => localStorage.setItem('neoScratchpad', scratchpad.value));

    // ── Drag & Drop ──────────────────────────────────────────────────────────
    function initDragAndDrop(el, taskId) {
        el.draggable = true;
        el.addEventListener('dragstart', e => { el.classList.add('dragging'); e.dataTransfer.setData('task-id', taskId); });
        el.addEventListener('dragend',   () => el.classList.remove('dragging'));
    }

    function initColumnDrop() {
        document.querySelectorAll('.board-column').forEach(col => {
            col.addEventListener('dragover',  e => { e.preventDefault(); col.classList.add('drag-over'); });
            col.addEventListener('dragleave', () => col.classList.remove('drag-over'));
            col.addEventListener('drop', e => {
                e.preventDefault(); col.classList.remove('drag-over');
                const id   = parseInt(e.dataTransfer.getData('task-id'));
                const task = tasks.find(t => t.id === id);
                if (!task) return;
                const newStatus = col.dataset.status;
                if (task.status !== newStatus) {
                    task.status = newStatus;
                    if (newStatus === 'completed') launchConfetti();
                    saveAndRender();
                }
            });
        });
    }

    function launchConfetti() { showToast('Bravo !', 'award'); }

    // ── Render ───────────────────────────────────────────────────────────────
    function renderTasks() {
        taskList.innerHTML = '';
        boardContainer.innerHTML = '';
        calendarContainer.innerHTML = '';

        const filtered = getFiltered();
        emptyState.style.display = (filtered.length === 0 && currentView !== 'calendar') ? 'flex' : 'none';

        if (currentView === 'list') {
            filtered.forEach(t => taskList.appendChild(createTaskEl(t)));
        } else if (currentView === 'board') {
            buildBoard(filtered); initColumnDrop();
        } else {
            buildCalendar(filtered);
        }
        updateUI();
    }

    function getFiltered() {
        const raw = tasks.filter(t => {
            const matchFilter = currentFilter === 'all' || t.status === currentFilter;
            const matchSearch = !searchQuery ||
                t.text.toLowerCase().includes(searchQuery) ||
                (t.tag  && t.tag.toLowerCase().includes(searchQuery)) ||
                (t.note && t.note.toLowerCase().includes(searchQuery));
            return matchFilter && matchSearch;
        });

        const sort = sortSelect.value;
        raw.sort((a, b) => {
            if (a.pinned !== b.pinned) return b.pinned ? 1 : -1;
            if (sort === 'alpha') return a.text.localeCompare(b.text);
            if (sort === 'date')  return (a.dueDate || '9999') < (b.dueDate || '9999') ? -1 : 1;
            return b.id - a.id;
        });
        return raw;
    }

    function buildBoard(tasks) {
        [
            { status: 'todo',      label: 'À faire',   icon: SVG.todo,      color: '#888' },
            { status: 'active',    label: 'En cours',  icon: SVG.active,    color: '#ffbb33' },
            { status: 'completed', label: 'Terminées', icon: SVG.completed, color: '#00C851' },
        ].forEach(col => {
            const colTasks = tasks.filter(t => t.status === col.status);
            const div = document.createElement('div');
            div.className = 'board-column'; div.dataset.status = col.status;
            div.innerHTML = `<div class="column-title"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${col.color}" stroke-width="2.5">${col.icon}</svg><span style="color:${col.color}">${col.label}</span><span class="column-count">${colTasks.length}</span></div>`;
            colTasks.forEach(t => div.appendChild(createTaskEl(t, true)));
            boardContainer.appendChild(div);
        });
    }

    // ── Agenda (vue semaine / jour façon Calendar) ───────────────────────────
    function calDays() {
        if (calMode === 'day') return [new Date(calAnchor)];
        const monday = new Date(calAnchor);
        monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(monday); d.setDate(monday.getDate() + i); return d;
        });
    }

    function calShift(dir) {
        calAnchor.setDate(calAnchor.getDate() + dir * (calMode === 'day' ? 1 : 7));
        renderTasks();
    }

    function calTitle(days) {
        const first = days[0], last = days[days.length - 1];
        if (calMode === 'day') {
            const label = first.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
            return label.charAt(0).toUpperCase() + label.slice(1);
        }
        const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
        if (first.getMonth() === last.getMonth()) return `${cap(CAL_MONTHS[first.getMonth()])} ${first.getFullYear()}`;
        const short = d => cap(d.toLocaleDateString('fr-FR', { month: 'short' }));   // « Oct. », « Nov. »
        const m1 = short(first), m2 = short(last);
        return first.getFullYear() === last.getFullYear()
            ? `${m1} – ${m2} ${last.getFullYear()}`
            : `${m1} ${first.getFullYear()} – ${m2} ${last.getFullYear()}`;
    }

    // Jour de référence d'une tâche : sa date, sinon (si elle a une heure ou une récurrence) son jour de création
    function taskBaseDate(t) {
        if (t.dueDate) return t.dueDate;
        if (t.startTime || t.recurring) return isoDate(new Date(t.createdAt || t.id));
        return null;
    }

    function occursOn(t, iso) {
        const base = taskBaseDate(t);
        if (!base) return false;
        if (!t.recurring) return base === iso;
        if (iso < base) return false;
        const d = new Date(iso + 'T00:00:00'), b = new Date(base + 'T00:00:00');
        if (t.recurring === 'daily')   return true;
        if (t.recurring === 'weekly')  return d.getDay() === b.getDay();
        if (t.recurring === 'monthly') return d.getDate() === b.getDate();
        return base === iso;
    }

    // Déclarations de fonctions (hissées) : l'agenda est rendu dès l'initialisation
    function hhmmToMin(s) { const [h, m] = s.split(':').map(Number); return h * 60 + (m || 0); }
    function minToHHMM(m) { return `${pad(Math.floor(m / 60) % 24)}:${pad(m % 60)}`; }
    function calSnap(m, step = CAL_SNAP_MIN) { return Math.round(m / step) * step; }
    function yToMin(y) { return y / CAL_HOUR_PX * 60; }

    function applyTaskColor(el, color) {
        if (!color) return; // couleur par défaut : var(--text) / var(--bg)
        const n = parseInt(color.slice(1), 16);
        const lum = 0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255);
        el.style.setProperty('--ev-bg', color);
        el.style.setProperty('--ev-fg', lum > 160 ? '#111' : '#fff');
    }

    function buildCalendar(list) {
        const days     = calDays();
        const isoDays  = days.map(isoDate);
        const todayIso = isoDate(new Date());
        const unplanned = list.filter(t => !taskBaseDate(t));
        const tzMin = -new Date().getTimezoneOffset();
        const tz = `GMT${tzMin >= 0 ? '+' : '-'}${pad(Math.floor(Math.abs(tzMin) / 60))}`;

        calendarContainer.innerHTML = `
            <div class="cal-toolbar">
                <button class="cal-today-btn" title="Revenir à aujourd'hui">Aujourd'hui</button>
                <div class="cal-nav">
                    <button class="cal-nav-btn" data-dir="-1" title="Précédent (flèche gauche)">${icon('chevronL', 18)}</button>
                    <button class="cal-nav-btn" data-dir="1" title="Suivant (flèche droite)">${icon('chevronR', 18)}</button>
                </div>
                <h2 class="cal-title">${calTitle(days)}</h2>
                <div class="cal-mode">
                    <button class="cal-mode-btn${calMode === 'day' ? ' active' : ''}" data-mode="day">Jour</button>
                    <button class="cal-mode-btn${calMode === 'week' ? ' active' : ''}" data-mode="week">Semaine</button>
                </div>
            </div>
            <div class="cal-tray">
                <span class="cal-tray-label">À planifier · ${unplanned.length}</span>
                <div class="cal-tray-items">${unplanned.length ? '' : '<span class="cal-tray-empty">Glisse une tâche ici pour la retirer de l\'agenda</span>'}</div>
            </div>
            <div class="cal-scroll" style="--days:${days.length}; --hour-px:${CAL_HOUR_PX}px">
                <div class="cal-sticky">
                    <div class="cal-row cal-head">
                        <div class="cal-gutter">${tz}</div>
                        ${days.map((d, i) => `
                            <div class="cal-day-head${isoDays[i] === todayIso ? ' is-today' : ''}" data-date="${isoDays[i]}" title="Voir la journée">
                                <span class="cal-dow">${CAL_DAY_SHORT[d.getDay()]}</span>
                                <span class="cal-dnum">${d.getDate()}</span>
                            </div>`).join('')}
                    </div>
                    <div class="cal-row cal-allday">
                        <div class="cal-gutter">Journée</div>
                        ${isoDays.map(iso => `<div class="cal-allday-cell" data-date="${iso}"></div>`).join('')}
                    </div>
                </div>
                <div class="cal-row cal-body" style="height:${24 * CAL_HOUR_PX}px">
                    <div class="cal-gutter cal-times">
                        ${Array.from({ length: 23 }, (_, i) => `<span class="cal-time" style="top:${(i + 1) * CAL_HOUR_PX}px">${pad(i + 1)}:00</span>`).join('')}
                    </div>
                    ${isoDays.map(iso => `<div class="cal-col${iso === todayIso ? ' is-today' : ''}" data-date="${iso}"></div>`).join('')}
                </div>
            </div>`;

        const tray = calendarContainer.querySelector('.cal-tray-items');
        unplanned.forEach(t => tray.appendChild(calChip(t)));

        isoDays.forEach(iso => {
            const dayTasks = list.filter(t => occursOn(t, iso));
            const cell = calendarContainer.querySelector(`.cal-allday-cell[data-date="${iso}"]`);
            dayTasks.filter(t => !t.startTime).forEach(t => cell.appendChild(calChip(t)));

            const col = calendarContainer.querySelector(`.cal-col[data-date="${iso}"]`);
            const events = dayTasks.filter(t => t.startTime).map(t => {
                const start = hhmmToMin(t.startTime);
                const dur   = parseInt(t.duration) || CAL_DEFAULT_DUR;
                return { t, start, end: Math.min(start + dur, 24 * 60) };
            });
            layoutOverlaps(events);
            events.forEach(ev => col.appendChild(calEventEl(ev)));

            if (iso === todayIso) {
                const now = new Date();
                const line = document.createElement('div');
                line.className = 'cal-now';
                line.style.top = `${(now.getHours() * 60 + now.getMinutes()) / 60 * CAL_HOUR_PX}px`;
                col.appendChild(line);
            }
        });

        bindCalendar();

        const scroller = calendarContainer.querySelector('.cal-scroll');
        if (calScrollTop == null) {
            // Première ouverture : on cadre la journée de travail, ou l'heure actuelle
            const h = new Date().getHours();
            calScrollTop = Math.max(0, (h >= 9 ? h - 2 : 7) * CAL_HOUR_PX);
        }
        scroller.scrollTop = calScrollTop;
        scroller.addEventListener('scroll', () => { calScrollTop = scroller.scrollTop; });
    }

    // Tâches qui se chevauchent : côte à côte, comme dans Calendar
    function layoutOverlaps(events) {
        events.sort((a, b) => a.start - b.start || b.end - a.end);
        let cluster = [], clusterEnd = -1;
        const flush = () => {
            const cols = Math.max(...cluster.map(e => e.col)) + 1;
            cluster.forEach(e => { e.cols = cols; });
            cluster = []; clusterEnd = -1;
        };
        events.forEach(ev => {
            // Hauteur visuelle minimale pour que les tâches très courtes ne se recouvrent pas
            const visEnd = Math.max(ev.end, ev.start + 20);
            if (cluster.length && ev.start >= clusterEnd) flush();
            const used = new Set(cluster.filter(e => e.visEnd > ev.start).map(e => e.col));
            let c = 0; while (used.has(c)) c++;
            Object.assign(ev, { col: c, visEnd });
            cluster.push(ev);
            clusterEnd = Math.max(clusterEnd, visEnd);
        });
        if (cluster.length) flush();
    }

    function calEventEl(ev) {
        const { t } = ev;
        const el = document.createElement('div');
        const dur = ev.end - ev.start;
        el.className = `cal-event${t.status === 'completed' ? ' is-done' : ''}${dur <= 30 ? ' is-short' : ''}`;
        el.dataset.id = t.id;
        el.style.top    = `${ev.start / 60 * CAL_HOUR_PX}px`;
        el.style.height = `${Math.max(dur, 15) / 60 * CAL_HOUR_PX - 2}px`;
        el.style.left   = `calc(${ev.col / ev.cols * 100}% + 1px)`;
        el.style.width  = `calc(${100 / ev.cols}% - 4px)`;
        applyTaskColor(el, t.color);

        const range = `${t.startTime} – ${minToHHMM(ev.end)}`;
        const icons = `${t.recurring ? icon('repeat', 10) : ''}${t.audioId ? icon('mic', 10) : ''}`;
        el.title = `${t.text}\n${range}${t.tag ? ` · #${t.tag}` : ''}${t.note ? `\n${t.note}` : ''}`;
        el.innerHTML = `
            <span class="cal-ev-title">${t.pinned ? icon('star', 10) : ''}${escHtml(t.text)}</span>
            <span class="cal-ev-time">${range}${icons}</span>
            <span class="cal-ev-resize" title="Changer la durée"></span>`;

        el.addEventListener('click', e => {
            e.stopPropagation();
            if (!calResizing) openEditModal(t.id);
        });
        makeCalDraggable(el, t, e => e.clientY - el.getBoundingClientRect().top);
        initResize(el, ev);
        return el;
    }

    function calChip(t) {
        const el = document.createElement('div');
        el.className = `cal-chip${t.status === 'completed' ? ' is-done' : ''}`;
        el.title = t.text;
        el.innerHTML = `<span>${t.pinned ? icon('star', 10) : ''}${escHtml(t.text)}</span>`;
        applyTaskColor(el, t.color);
        el.addEventListener('click', e => { e.stopPropagation(); openEditModal(t.id); });
        makeCalDraggable(el, t, () => 0);
        return el;
    }

    function makeCalDraggable(el, t, grabOffsetPx) {
        initDragAndDrop(el, t.id);
        el.addEventListener('dragstart', e => {
            calDrag = {
                id: t.id,
                offsetMin: yToMin(grabOffsetPx(e)),
                duration: parseInt(t.duration) || CAL_DEFAULT_DUR,
            };
        });
        el.addEventListener('dragend', () => {
            calDrag = null;
            calendarContainer.querySelectorAll('.cal-drop-ghost').forEach(g => g.remove());
        });
    }

    // Poignée basse : étirer pour changer la durée
    function initResize(el, ev) {
        const handle = el.querySelector('.cal-ev-resize');
        handle.addEventListener('mousedown', e => {
            e.preventDefault(); e.stopPropagation();
            el.draggable = false;
            calResizing = true;
            const startY = e.clientY;
            const startDur = ev.end - ev.start;
            let dur = startDur;
            const timeEl = el.querySelector('.cal-ev-time');
            const move = m => {
                dur = Math.max(CAL_SNAP_MIN, calSnap(startDur + yToMin(m.clientY - startY)));
                dur = Math.min(dur, 24 * 60 - ev.start);
                el.style.height = `${dur / 60 * CAL_HOUR_PX - 2}px`;
                timeEl.textContent = `${ev.t.startTime} – ${minToHHMM(ev.start + dur)}`;
            };
            const up = () => {
                document.removeEventListener('mousemove', move);
                document.removeEventListener('mouseup', up);
                if (dur !== startDur) { ev.t.duration = String(dur); saveTasks(); }
                // Laisse passer le clic qui suit le relâchement avant de réautoriser l'ouverture
                setTimeout(() => { calResizing = false; renderTasks(); }, 0);
            };
            document.addEventListener('mousemove', move);
            document.addEventListener('mouseup', up);
        });
    }

    function bindCalendar() {
        calendarContainer.querySelector('.cal-today-btn').onclick = () => {
            calAnchor = new Date(); calAnchor.setHours(0, 0, 0, 0);
            calScrollTop = null;
            renderTasks();
        };
        calendarContainer.querySelectorAll('.cal-nav-btn').forEach(b => {
            b.onclick = () => calShift(parseInt(b.dataset.dir));
        });
        calendarContainer.querySelectorAll('.cal-mode-btn').forEach(b => {
            b.onclick = () => {
                calMode = b.dataset.mode;
                localStorage.setItem('neoCalMode', calMode);
                renderTasks();
            };
        });
        // Clic sur un jour : vue Jour (et retour en Semaine depuis la vue Jour)
        calendarContainer.querySelectorAll('.cal-day-head').forEach(h => {
            h.onclick = () => {
                calAnchor = new Date(h.dataset.date + 'T00:00:00');
                calMode = calMode === 'day' ? 'week' : 'day';
                localStorage.setItem('neoCalMode', calMode);
                renderTasks();
            };
        });

        // Clic sur un créneau vide : nouvelle tâche à cette heure
        calendarContainer.querySelectorAll('.cal-col').forEach(col => {
            col.addEventListener('click', e => {
                if (e.target !== col) return;
                const min = Math.floor(yToMin(e.clientY - col.getBoundingClientRect().top) / 30) * 30;
                openEditModal(null, { dueDate: col.dataset.date, startTime: minToHHMM(min), duration: String(CAL_DEFAULT_DUR) });
            });
        });
        calendarContainer.querySelectorAll('.cal-allday-cell').forEach(cell => {
            cell.addEventListener('click', e => {
                if (e.target === cell) openEditModal(null, { dueDate: cell.dataset.date });
            });
        });

        // Glisser-déposer : grille horaire, ligne « Journée », bac « À planifier »
        const drop = (zone, apply, onOver) => {
            zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); onOver?.(e); });
            zone.addEventListener('dragleave', e => {
                if (zone.contains(e.relatedTarget)) return;
                zone.classList.remove('drag-over');
                zone.querySelector('.cal-drop-ghost')?.remove();
            });
            zone.addEventListener('drop', e => {
                e.preventDefault();
                zone.classList.remove('drag-over');
                const task = tasks.find(t => t.id === parseInt(e.dataTransfer.getData('task-id')));
                if (!task) return;
                apply(task, e);
                calDrag = null;
                saveAndRender();
            });
        };

        const dropMinute = (col, e) => {
            const raw = yToMin(e.clientY - col.getBoundingClientRect().top) - (calDrag?.offsetMin || 0);
            const max = 24 * 60 - CAL_SNAP_MIN;
            return Math.min(max, Math.max(0, calSnap(raw)));
        };

        calendarContainer.querySelectorAll('.cal-col').forEach(col => {
            drop(col, (task, e) => {
                task.dueDate   = col.dataset.date;
                task.startTime = minToHHMM(dropMinute(col, e));
            }, e => {
                // Aperçu de l'emplacement
                let ghost = col.querySelector('.cal-drop-ghost');
                if (!ghost) {
                    calendarContainer.querySelectorAll('.cal-drop-ghost').forEach(g => g.remove());
                    ghost = document.createElement('div');
                    ghost.className = 'cal-drop-ghost';
                    col.appendChild(ghost);
                }
                const min = dropMinute(col, e);
                const dur = calDrag?.duration || CAL_DEFAULT_DUR;
                ghost.style.top    = `${min / 60 * CAL_HOUR_PX}px`;
                ghost.style.height = `${Math.max(dur, 15) / 60 * CAL_HOUR_PX - 2}px`;
                ghost.textContent  = minToHHMM(min);
            });
        });
        calendarContainer.querySelectorAll('.cal-allday-cell').forEach(cell => {
            drop(cell, task => { task.dueDate = cell.dataset.date; task.startTime = null; });
        });
        drop(calendarContainer.querySelector('.cal-tray'), task => {
            task.dueDate = null; task.startTime = null; task.recurring = null;
        });
    }

    // ── Create Task Element ──────────────────────────────────────────────────
    function createTaskEl(task, compact = false) {
        const now   = new Date();
        const hhmm  = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
        const isOverdue = task.startTime && task.startTime < hhmm && task.status !== 'completed';

        const li = document.createElement('li');
        li.className = `task-item${task.status === 'completed' ? ' completed' : ''}${task.pinned ? ' pinned' : ''}${isOverdue && compact ? ' overdue-task' : ''}`;
        li.dataset.id = task.id; li.dataset.status = task.status;
        initDragAndDrop(li, task.id);

        // ── DOUBLE CLICK → edit modal ──────────────────────────────────────
        li.addEventListener('dblclick', e => {
            // Don't open modal if clicking action buttons or subtask area
            if (e.target.closest('.task-actions') || e.target.closest('.subtask-section')) return;
            e.stopPropagation();
            openEditModal(task.id);
        });

        const tagBadge = `<span class="tag-badge">#${task.tag}</span>`;

        let dateHtml = '';
        if (task.dueDate) {
            const due   = new Date(task.dueDate + 'T00:00:00');
            const today = new Date(); today.setHours(0, 0, 0, 0);
            const od    = due < today && task.status !== 'completed';
            dateHtml = `<span class="due-date-badge ${od ? 'overdue' : ''}"><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">${SVG.hourglass}</svg>${due.toLocaleDateString('fr-FR')}</span>`;
        }

        let timeHtml = '';
        if (task.startTime) {
            const dur = task.duration ? `<span class="duration-badge">${task.duration}m</span>` : '';
            timeHtml = `<span class="time-badge${isOverdue ? ' time-badge--overdue' : ''}"><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">${SVG.clock}</svg>${task.startTime}${dur}</span>`;
        }

        const colorDot   = task.color ? `<span class="color-label" style="background:${task.color}"></span>` : '';
        const subCount   = task.subtasks?.length ? `<span class="subtask-count">${task.subtasks.filter(s => s.done).length}/${task.subtasks.length}</span>` : '';
        const recurBadge = task.recurring ? `<span class="recurring-badge"><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">${SVG.repeat}</svg></span>` : '';
        const statusIcon = task.status === 'completed' ? SVG.completed : task.status === 'active' ? SVG.active : SVG.todo;
        const noteHtml   = task.note ? `<span class="task-note">${escHtml(task.note)}</span>` : '';
        const audioHtml  = task.audioId && api?.loadAudio
            ? `<button class="audio-badge${playingTaskId === task.id ? ' playing' : ''}" title="${escHtml(task.transcript ? `Écouter — « ${task.transcript} »` : 'Écouter le mémo vocal')}"><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">${SVG.speaker}</svg>MÉMO</button>`
            : '';

        const subsHtml = (task.subtasks || []).map((s, idx) => `
            <div class="subtask-item ${s.done ? 'done' : ''}" data-idx="${idx}">
                <div class="subtask-checkbox">${s.done ? `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">${SVG.check}</svg>` : ''}</div>
                <span contenteditable="true">${escHtml(s.text)}</span>
                <button class="mini-del-sub" title="Supprimer">${icon('x', 10)}</button>
            </div>`).join('');

        li.innerHTML = `
            <div class="task-item-top">
                <button class="status-cycle">
                    <svg class="status-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">${statusIcon}</svg>
                </button>
                <div class="task-content">
                    <span class="task-text" contenteditable="true">${escHtml(task.text)}</span>
                    ${noteHtml}
                    <div class="task-meta">${colorDot}${tagBadge}${audioHtml}${timeHtml}${subCount}${dateHtml}${recurBadge}</div>
                </div>
                <div class="task-actions">
                    <button class="task-icon-btn edit-btn" title="Modifier"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">${SVG.edit}</svg></button>
                    <button class="task-icon-btn duplicate-btn" title="Dupliquer"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">${SVG.copy}</svg></button>
                    <button class="task-icon-btn pin-btn ${task.pinned ? 'active-pin' : ''}" title="Épingler"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">${SVG.pin}</svg></button>
                    <button class="task-icon-btn expand-btn"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">${SVG.expand}</svg></button>
                    <button class="task-icon-btn delete-btn" title="Supprimer">${icon('x', 14)}</button>
                </div>
            </div>
            <div class="subtask-section" style="display:${task.expanded ? 'block' : 'none'}">
                <div class="subtask-list">${subsHtml}</div>
                <div class="subtask-add-row">
                    <input class="subtask-input-mini" type="text" placeholder="Ajouter une sous-tâche...">
                    <button class="mini-add-btn" title="Ajouter">+</button>
                    <button class="mini-cancel-sub" title="Annuler">${icon('x', 12)}</button>
                </div>
            </div>`;

        // Handlers
        li.querySelector('.status-cycle').onclick = e => {
            e.stopPropagation();
            const order = ['todo', 'active', 'completed'];
            task.status = order[(order.indexOf(task.status) + 1) % 3];
            if (task.status === 'completed') launchConfetti();
            saveAndRender();
        };
        li.querySelector('.edit-btn').onclick = e => { e.stopPropagation(); openEditModal(task.id); };
        li.querySelector('.duplicate-btn').onclick = e => {
            e.stopPropagation();
            tasks.push({ ...task, id: Date.now(), text: task.text + ' (Copie)', expanded: false });
            saveAndRender(); showToast('Tâche dupliquée !');
        };
        li.querySelector('.pin-btn').onclick = e => { e.stopPropagation(); task.pinned = !task.pinned; saveAndRender(); };
        li.querySelector('.expand-btn').onclick = e => { e.stopPropagation(); task.expanded = !task.expanded; saveTasks(); renderTasks(); };
        li.querySelector('.delete-btn').onclick = e => { e.stopPropagation(); removeTask(task); };
        const audioBtn = li.querySelector('.audio-badge');
        if (audioBtn) audioBtn.onclick = e => { e.stopPropagation(); toggleTaskAudio(task, audioBtn); };

        const textSpan = li.querySelector('.task-text');
        textSpan.onblur = () => { const v = textSpan.innerText.trim(); if (v && v !== task.text) { task.text = v; saveTasks(); } };
        // Prevent contenteditable from triggering dblclick on single-click
        textSpan.onclick = e => e.stopPropagation();

        // Subtasks
        li.querySelectorAll('.subtask-item').forEach(item => {
            const idx = +item.dataset.idx;
            item.querySelector('.subtask-checkbox').onclick = () => {
                task.subtasks[idx].done = !task.subtasks[idx].done;
                if (task.subtasks[idx].done) launchConfetti();
                saveAndRender();
            };
            item.querySelector('.mini-del-sub').onclick = () => { task.subtasks.splice(idx, 1); saveAndRender(); };
        });

        const subInput = li.querySelector('.subtask-input-mini');
        const doAddSub = () => { const v = subInput.value.trim(); if (v) { task.subtasks.push({ text: v, done: false }); saveAndRender(); } };
        li.querySelector('.mini-add-btn').onclick = doAddSub;
        subInput.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); doAddSub(); } });
        li.querySelector('.mini-cancel-sub').onclick = () => { subInput.value = ''; task.expanded = false; saveTasks(); renderTasks(); };

        return li;
    }

    // ── Helpers ───────────────────────────────────────────────────────────────
    function saveAndRender() { saveTasks(); renderTasks(); }
    function saveTasks()     { localStorage.setItem('neoTasks', JSON.stringify(tasks)); }

    function updateUI() {
        const total  = tasks.length;
        const done   = tasks.filter(t => t.status === 'completed').length;
        const active = tasks.filter(t => t.status === 'active').length;
        const todo   = tasks.filter(t => t.status === 'todo').length;
        const pct    = total === 0 ? 0 : Math.round((done / total) * 100);

        if (progressBar) progressBar.style.strokeDashoffset = 440 - (pct / 100) * 440;
        if (circlePct)   circlePct.textContent = `${pct}%`;
        if (progressText) progressText.textContent = `${done}/${total} éléments`;
        if (statsDetail)  statsDetail.textContent  = `${active} en cours • ${done} terminées`;
        if (statTodo)   statTodo.textContent   = todo;
        if (statActive) statActive.textContent = active;
        if (statDone)   statDone.textContent   = done;

        if (targetFill) targetFill.style.width = `${Math.min((done / dailyTarget) * 100, 100)}%`;
        if (targetText) {
            if (done >= dailyTarget && total > 0) {
                targetText.innerHTML = `Objectif atteint ! ${icon('flame', 12)}`; targetText.style.color = '#00C851';
            } else {
                targetText.textContent = `${done}/${dailyTarget} terminées`; targetText.style.color = '';
            }
        }
    }

    function updateClock() {
        const now    = new Date();
        const days   = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
        const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
        clockEl.querySelector('.clock-time')?.setAttribute('textContent', `${pad(now.getHours())}:${pad(now.getMinutes())}`);
        const ct = clockEl.querySelector('.clock-time'); if (ct) ct.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
        const ca = clockEl.querySelector('.clock-ampm'); if (ca) ca.textContent = now.getHours() >= 12 ? 'PM' : 'AM';
        const cd = document.getElementById('clockDate'); if (cd) cd.textContent = `${days[now.getDay()]} ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
    }

    function pad(n) { return String(n).padStart(2, '0'); }

    function showToast(msg, iconName = null) {
        const el = document.getElementById('toast');
        if (!el) return;
        el.innerHTML = `${iconName ? icon(iconName, 16) : ''}<span>${escHtml(msg)}</span>`;
        el.classList.add('show');
        clearTimeout(showToast._t);
        showToast._t = setTimeout(() => el.classList.remove('show'), 2800);
    }

    // ── Modal shortcuts ──────────────────────────────────────────────────────
    shortcutsBtn.onclick = () => shortcutsModal.style.display = 'flex';
    closeModal.onclick   = () => shortcutsModal.style.display = 'none';
    window.onclick = e => {
        if (e.target === shortcutsModal) shortcutsModal.style.display = 'none';
    };

    // ── Export / Import ──────────────────────────────────────────────────────
    exportBtn.onclick   = () => {
        const a = document.createElement('a');
        a.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tasks, null, 2));
        a.download = 'neo_tasks.json'; a.click();
    };
    importBtn.onclick   = () => importFile.click();
    importFile.onchange = e => {
        const r = new FileReader();
        r.onload = ev => {
            try { tasks = JSON.parse(ev.target.result); saveAndRender(); showToast('Importé !'); }
            catch(_) { showToast('Fichier invalide.'); }
        };
        r.readAsText(e.target.files[0]);
    };
});

// ══════════════════════════════════════════════════════════════════════════════
// ELECTRON INTEGRATION — s'active uniquement si l'API est disponible
// (ignoré dans un navigateur web normal)
// ══════════════════════════════════════════════════════════════════════════════
(function initElectron() {
    const api = window.electronAPI;
    if (!api) return; // Pas dans Electron — ne rien faire

    // ── Activer le mode Electron (title bar + padding) ──────────────────────
    document.body.classList.add('electron-mode');

    // ── Afficher la title bar ───────────────────────────────────────────────
    const titleBar = document.getElementById('electronTitleBar');
    if (titleBar) titleBar.style.display = 'flex';

    // ── Boutons de contrôle de fenêtre ──────────────────────────────────────
    document.getElementById('etbMin')  ?.addEventListener('click', () => api.minimize());
    document.getElementById('etbClose')?.addEventListener('click', () => api.close());

    const etbMax   = document.getElementById('etbMax');
    const updateMaxIcon = (isMax) => { if (etbMax) etbMax.innerHTML = icon(isMax ? 'restore' : 'maximize', 13); };

    etbMax?.addEventListener('click', async () => {
        await api.maximize();
        updateMaxIcon(await api.isMaximized());
    });

    // Sync icône quand la fenêtre est maximisée/restaurée via double-clic barre
    api.onWindowMaximized(updateMaxIcon);
    api.isMaximized().then(updateMaxIcon);

    // ── Overrider les notifications web → notifications natives Electron ─────
    // La fonction showNotification de script.js utilisera ceci automatiquement
    // via checkOverdueTasks() qui appelle showToast + Notification
    // On surcharge directement l'API Notification si disponible dans Electron
    const originalCheckOverdue = window._checkOverdue;
    // Patch global pour notifications overdue
    window._sendNativeNotification = (title, body) => {
        api.showNotification(title, body);
    };

    // ── Version dans le titre ───────────────────────────────────────────────
    api.getVersion().then(v => {
        const el = document.querySelector('.etb-name');
        if (el) el.textContent = `Neo-List v${v}`;
    });

    // ── Auto-updater UI ─────────────────────────────────────────────────────
    const banner          = document.getElementById('updateBanner');
    const updateMsg       = document.getElementById('updateMsg');
    const installBtn      = document.getElementById('updateInstallBtn');
    const progressWrap    = document.getElementById('updateProgress');
    const updateFill      = document.getElementById('updateFill');

    function showBanner(iconName, msg, showInstall = false, showProgress = false) {
        if (!banner) return;
        banner.style.display = 'flex';
        document.body.classList.add('has-update-banner');
        if (updateMsg)    updateMsg.innerHTML = `${icon(iconName, 14)} ${escHtml(msg)}`;
        if (installBtn)   installBtn.style.display = showInstall   ? 'inline-block' : 'none';
        if (progressWrap) progressWrap.style.display = showProgress ? 'block'       : 'none';
    }

    function hideBanner() {
        if (banner) banner.style.display = 'none';
        document.body.classList.remove('has-update-banner');
    }

    api.onUpdateChecking(() => {
        showBanner('search', 'Vérification des mises à jour...');
        setTimeout(hideBanner, 3000);
    });

    api.onUpdateAvailable(info => {
        showBanner('download', `Mise à jour v${info.version} en téléchargement...`, false, true);
    });

    api.onUpdateNotAvailable(() => {
        showBanner('checkCircle', 'Application à jour !');
        setTimeout(hideBanner, 3000);
    });

    api.onUpdateProgress(progress => {
        const pct = Math.round(progress.percent);
        if (updateFill)   updateFill.style.width = pct + '%';
        if (updateMsg)    updateMsg.innerHTML = `${icon('download', 14)} Téléchargement... ${pct}%`;
    });

    api.onUpdateDownloaded(info => {
        showBanner('checkCircle', `v${info.version} prête ! Redémarrez pour l'installer.`, true, false);
    });

    api.onUpdateError(msg => {
        showBanner('alert', `Erreur de mise à jour : ${msg}`);
        setTimeout(hideBanner, 5000);
    });

    installBtn?.addEventListener('click', () => api.installUpdate());
})();

