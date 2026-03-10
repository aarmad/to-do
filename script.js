/* ===========================
   Neo-List — script.js (v9)
   =========================== */
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
    const timelineContainer = document.getElementById('timelineContainer');

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
    const timelineViewBtn = document.getElementById('timelineViewBtn');

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

    // ── State ────────────────────────────────────────────────────────────────
    let tasks         = JSON.parse(localStorage.getItem('neoTasks')) || [];
    let currentFilter = 'all';
    let searchQuery   = '';
    let currentView   = localStorage.getItem('neoView') || 'list';
    let selectedColor = '#ff4444';
    let editingTaskId = null;   // tracks which task is being edited
    let editSelectedColor = '#ff4444';

    let pomoWorkTime    = parseInt(localStorage.getItem('pomoWork'))  || 25;
    let pomoBreakTime   = parseInt(localStorage.getItem('pomoBreak')) || 5;
    let pomoInterval;
    let pomoTimeLeft    = pomoWorkTime * 60;
    let pomoIsRunning   = false;
    let pomoCurrentMode = 'work';
    let dailyTarget     = parseInt(localStorage.getItem('neoDailyTarget')) || 5;

    // Notification tracking — don't re-fire for same task in same minute
    const notifiedTasks = new Set();

    // ── SVG ─────────────────────────────────────────────────────────────────
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
    };

    // ── Init ─────────────────────────────────────────────────────────────────
    updateClock();
    setInterval(updateClock, 1000);
    // Refresh planning view every minute (moves the now-cursor)
    setInterval(() => { if (currentView === 'timeline') renderTasks(); }, 60000);

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

    // ── Edit Modal ───────────────────────────────────────────────────────────
    function openEditModal(taskId) {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;
        editingTaskId   = taskId;
        editSelectedColor = task.color || '';

        editText.value      = task.text;
        editNote.value      = task.note || '';
        editStatus.value    = task.status;
        editTag.value       = task.tag || '';
        editDueDate.value   = task.dueDate || '';
        editStartTime.value = task.startTime || '';
        editDuration.value  = task.duration || '';

        // Update color picker
        editColorPicker.querySelectorAll('.color-dot').forEach(dot => {
            dot.classList.toggle('selected', dot.dataset.color === editSelectedColor);
        });

        editModal.style.display = 'flex';
        editText.focus();
    }

    function closeEdit() {
        editModal.style.display = 'none';
        editingTaskId = null;
    }

    function saveEdit() {
        const task = tasks.find(t => t.id === editingTaskId);
        if (!task) return;

        const newText = editText.value.trim();
        if (!newText) { showToast('Le titre ne peut pas être vide.'); return; }

        task.text      = newText;
        task.note      = editNote.value.trim();
        task.status    = editStatus.value;
        task.tag       = editTag.value.trim() || 'Général';
        task.dueDate   = editDueDate.value   || null;
        task.startTime = editStartTime.value || null;
        task.duration  = editDuration.value  || null;
        task.color     = editSelectedColor;

        closeEdit();
        saveAndRender();
        showToast('Tâche mise à jour !');
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

            const msg = `⏰ Tâche en retard : "${task.text}"`;
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('Neo-List', { body: msg, icon: '' });
            }
            showToast(msg);
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
            if (editModal.style.display === 'flex')      closeEdit();
            if (shortcutsModal.style.display === 'flex') shortcutsModal.style.display = 'none';
            return;
        }
        if (isTyping) return;

        switch (e.key.toLowerCase()) {
            case 'n': e.preventDefault(); taskInput.focus(); break;
            case '/': e.preventDefault(); searchInput.focus(); break;
            case 't': e.preventDefault(); toggleTheme(); break;
            case 'v':
                e.preventDefault();
                applyView(currentView === 'list' ? 'board' : currentView === 'board' ? 'timeline' : 'list');
                renderTasks(); break;
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
            tasks = []; saveAndRender();
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
    listViewBtn.addEventListener('click',     () => { applyView('list');     renderTasks(); });
    boardViewBtn.addEventListener('click',    () => { applyView('board');    renderTasks(); });
    timelineViewBtn.addEventListener('click', () => { applyView('timeline'); renderTasks(); });

    function applyView(view) {
        currentView = view;
        localStorage.setItem('neoView', view);
        listViewBtn.classList.toggle('active',     view === 'list');
        boardViewBtn.classList.toggle('active',    view === 'board');
        timelineViewBtn.classList.toggle('active', view === 'timeline');
        taskList.style.display = view === 'list' ? 'flex' : 'none';
        boardContainer.classList.toggle('active',    view === 'board');
        timelineContainer.classList.toggle('active', view === 'timeline');
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
        document.querySelectorAll('.board-column, .timeline-column').forEach(col => {
            col.addEventListener('dragover',  e => { e.preventDefault(); col.classList.add('drag-over'); });
            col.addEventListener('dragleave', () => col.classList.remove('drag-over'));
            col.addEventListener('drop', e => {
                e.preventDefault(); col.classList.remove('drag-over');
                const id   = parseInt(e.dataTransfer.getData('task-id'));
                const task = tasks.find(t => t.id === id);
                if (!task) return;
                if (col.classList.contains('board-column')) {
                    const newStatus = col.dataset.status;
                    if (task.status !== newStatus) {
                        task.status = newStatus;
                        if (newStatus === 'completed') launchConfetti();
                        saveAndRender();
                    }
                } else {
                    task.startTime = col.dataset.hour === 'none' ? null : col.dataset.hour + ':00';
                    saveAndRender();
                }
            });
        });
    }

    function launchConfetti() { showToast('Bravo ! 🎉'); }

    // ── Render ───────────────────────────────────────────────────────────────
    function renderTasks() {
        taskList.innerHTML = '';
        boardContainer.innerHTML = '';
        timelineContainer.innerHTML = '';

        const filtered = getFiltered();
        emptyState.style.display = (filtered.length === 0 && currentView !== 'timeline') ? 'flex' : 'none';

        if (currentView === 'list') {
            filtered.forEach(t => taskList.appendChild(createTaskEl(t)));
        } else if (currentView === 'board') {
            buildBoard(filtered); initColumnDrop();
        } else {
            buildTimeline(filtered); initColumnDrop();
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

    function buildTimeline(tasks) {
        const now        = new Date();
        const currentHH  = pad(now.getHours());
        const currentMin = now.getMinutes();

        const HOURS = ['none', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22'];

        HOURS.forEach(hour => {
            const hourTasks = tasks.filter(t =>
                hour === 'none' ? !t.startTime : (t.startTime && t.startTime.startsWith(hour))
            );
            const isWorkHour = parseInt(hour) >= 8 && parseInt(hour) <= 19;
            if (hourTasks.length === 0 && !isWorkHour && hour !== 'none') return;

            const isNow = hour === currentHH;
            const div = document.createElement('div');
            div.className = 'timeline-column' + (isNow ? ' timeline-column--now' : '');
            div.dataset.hour = hour;

            const label = hour === 'none' ? 'Non planifié' : `${hour}:00`;
            div.innerHTML = `
                <div class="timeline-hour">
                    <span>${label}</span>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">${hour === 'none' ? SVG.calendar : SVG.clock}</svg>
                </div>`;

            // ── NOW INDICATOR ─────────────────────────────────────────────
            if (isNow) {
                const indicator = document.createElement('div');
                indicator.className = 'now-indicator';
                indicator.innerHTML = `<div class="now-dot"></div> Maintenant — ${pad(currentHH)}:${pad(currentMin)}`;
                div.appendChild(indicator);
            }

            hourTasks.forEach(t => div.appendChild(createTaskEl(t, true)));
            timelineContainer.appendChild(div);
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

        const subsHtml = (task.subtasks || []).map((s, idx) => `
            <div class="subtask-item ${s.done ? 'done' : ''}" data-idx="${idx}">
                <div class="subtask-checkbox">${s.done ? `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">${SVG.check}</svg>` : ''}</div>
                <span contenteditable="true">${escHtml(s.text)}</span>
                <button class="mini-del-sub">×</button>
            </div>`).join('');

        li.innerHTML = `
            <div class="task-item-top">
                <button class="status-cycle">
                    <svg class="status-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">${statusIcon}</svg>
                </button>
                <div class="task-content">
                    <span class="task-text" contenteditable="true">${escHtml(task.text)}</span>
                    ${noteHtml}
                    <div class="task-meta">${colorDot}${tagBadge}${timeHtml}${subCount}${dateHtml}${recurBadge}</div>
                </div>
                <div class="task-actions">
                    <button class="task-icon-btn duplicate-btn" title="Dupliquer"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">${SVG.copy}</svg></button>
                    <button class="task-icon-btn pin-btn ${task.pinned ? 'active-pin' : ''}" title="Épingler"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">${SVG.pin}</svg></button>
                    <button class="task-icon-btn expand-btn"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">${SVG.expand}</svg></button>
                    <button class="task-icon-btn delete-btn">×</button>
                </div>
            </div>
            <div class="subtask-section" style="display:${task.expanded ? 'block' : 'none'}">
                <div class="subtask-list">${subsHtml}</div>
                <div class="subtask-add-row">
                    <input class="subtask-input-mini" type="text" placeholder="Ajouter une sous-tâche...">
                    <button class="mini-add-btn" title="Ajouter">+</button>
                    <button class="mini-cancel-sub" title="Annuler">×</button>
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
        li.querySelector('.duplicate-btn').onclick = e => {
            e.stopPropagation();
            tasks.push({ ...task, id: Date.now(), text: task.text + ' (Copie)', expanded: false });
            saveAndRender(); showToast('Tâche dupliquée !');
        };
        li.querySelector('.pin-btn').onclick = e => { e.stopPropagation(); task.pinned = !task.pinned; saveAndRender(); };
        li.querySelector('.expand-btn').onclick = e => { e.stopPropagation(); task.expanded = !task.expanded; saveTasks(); renderTasks(); };
        li.querySelector('.delete-btn').onclick = e => { e.stopPropagation(); tasks = tasks.filter(t => t.id !== task.id); saveAndRender(); };

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
                targetText.textContent = 'Objectif atteint ! 🔥'; targetText.style.color = '#00C851';
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

    function showToast(msg) {
        const el = document.getElementById('toast');
        if (!el) return;
        el.textContent = msg;
        el.classList.add('show');
        clearTimeout(showToast._t);
        showToast._t = setTimeout(() => el.classList.remove('show'), 2800);
    }

    function escHtml(str) {
        return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
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
