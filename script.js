/* ===========================
   Neo-List — script.js (v5)
   =========================== */
document.addEventListener('DOMContentLoaded', () => {

    // ── DOM refs ──────────────────────────────────────────────────────────────
    const taskInput = document.getElementById('taskInput');
    const taskNote = document.getElementById('taskNote');
    const statusInput = document.getElementById('statusInput');
    const priorityInput = document.getElementById('priorityInput');
    const tagInput = document.getElementById('tagInput');
    const dueDateInput = document.getElementById('dueDateInput');
    const recurringInput = document.getElementById('recurringInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const boardContainer = document.getElementById('boardContainer');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const circlePct = document.getElementById('circlePct');
    const statsDetail = document.getElementById('statsDetail');
    const clockEl = document.getElementById('clock');
    const clearBtn = document.getElementById('clearTasks');
    const markAllBtn = document.getElementById('markAllDone');
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('searchInput');
    const clearSearch = document.getElementById('clearSearch');
    const sortSelect = document.getElementById('sortSelect');
    const listViewBtn = document.getElementById('listViewBtn');
    const boardViewBtn = document.getElementById('boardViewBtn');
    const exportBtn = document.getElementById('exportBtn');
    const importBtn = document.getElementById('importBtn');
    const importFile = document.getElementById('importFile');
    const shortcutsBtn = document.getElementById('shortcutsBtn');
    const shortcutsModal = document.getElementById('shortcutsModal');
    const closeModal = document.getElementById('closeModal');
    const emptyState = document.getElementById('emptyState');
    const colorDots = document.querySelectorAll('.color-dot');

    // Pomodoro refs
    const pomoTimer = document.getElementById('pomoTimer');
    const pomoStart = document.getElementById('pomoStart');
    const pomoReset = document.getElementById('pomoReset');
    const pomoModes = document.querySelectorAll('.pomo-mode');

    // Stat chips
    const statTodo = document.getElementById('statTodo');
    const statActive = document.getElementById('statActive');
    const statDone = document.getElementById('statDone');

    // ── State ─────────────────────────────────────────────────────────────────
    let tasks = JSON.parse(localStorage.getItem('neoTasks')) || [];
    let currentFilter = 'all';
    let searchQuery = '';
    let currentView = localStorage.getItem('neoView') || 'list';
    let selectedColor = '#ff4444';

    // Pomodoro state
    let pomoInterval;
    let pomoTimeLeft = 25 * 60;
    let pomoIsRunning = false;

    // ── SVG Strings ───────────────────────────────────────────────────────────
    const SVG = {
        sun: `<path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z"/>`,
        moon: `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>`,

        // Status icons
        todo: `<circle cx="12" cy="12" r="5" fill="none" stroke="#888" stroke-width="2.5"/>`,
        active: `<polygon points="5 3 19 12 5 21 5 3" fill="#ffbb33"/>`,
        completed: `<polyline points="20 6 9 17 4 12" stroke="#00C851" stroke-width="3" stroke-linecap="round" fill="none"/>`,

        // Misc
        pin: `<path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"/><path d="m7.5 4.27 9 5.15"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/>`,
        expand: `<polyline points="6 9 12 15 18 9"/>`,
        trash: `<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>`,
        check: `<polyline points="20 6 9 17 4 12"/>`,
        note: `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>`,
        hourglass: `<path d="M5 2h14"/><path d="M5 22h14"/><path d="M19 2l-7 7-7-7"/><path d="M5 22l7-7 7 7"/>`,
        repeat: `<polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>`,
        copy: `<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>`,
        play: `<polygon points="5 3 19 12 5 21 5 3" fill="currentColor"/>`,
        pause: `<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>`
    };

    // ── Init ──────────────────────────────────────────────────────────────────
    updateClock();
    setInterval(updateClock, 1000);
    applyTheme(localStorage.getItem('neoTheme') === 'dark');
    applyView(currentView);
    renderTasks();

    // ── Color Picker ──────────────────────────────────────────────────────────
    colorDots.forEach(dot => {
        dot.addEventListener('click', () => {
            colorDots.forEach(d => d.classList.remove('selected'));
            dot.classList.add('selected');
            selectedColor = dot.dataset.color;
        });
    });

    // ── Theme ─────────────────────────────────────────────────────────────────
    themeToggle.addEventListener('click', () => {
        const dark = !document.body.classList.contains('dark-mode');
        applyTheme(dark);
        localStorage.setItem('neoTheme', dark ? 'dark' : 'light');
    });

    function applyTheme(dark) {
        document.body.classList.toggle('dark-mode', dark);
        themeIcon.innerHTML = dark ? SVG.sun : SVG.moon;
    }

    // ── Add Task ──────────────────────────────────────────────────────────────
    function addTask() {
        const text = taskInput.value.trim();
        if (!text) { showToast('Écris une tâche d\'abord !'); return; }

        const task = {
            id: Date.now(),
            text,
            note: taskNote.value.trim(),
            status: statusInput.value,
            priority: priorityInput.value,
            tag: tagInput.value.trim() || 'Général',
            dueDate: dueDateInput.value || null,
            recurring: recurringInput.value || null,
            color: selectedColor,
            pinned: false,
            subtasks: [],
            expanded: false,
            createdAt: new Date().toISOString(),
        };

        tasks.push(task);
        saveAndRender();
        taskInput.value = '';
        taskNote.value = '';
        tagInput.value = '';
        dueDateInput.value = '';
        recurringInput.value = '';
        showToast('Tâche ajoutée !');
    }

    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); addTask(); }
    });

    // ── Search ────────────────────────────────────────────────────────────────
    searchInput.addEventListener('input', e => {
        searchQuery = e.target.value.toLowerCase();
        clearSearch.style.display = searchQuery ? 'flex' : 'none';
        renderTasks();
    });

    clearSearch.addEventListener('click', () => {
        searchInput.value = '';
        searchQuery = '';
        clearSearch.style.display = 'none';
        renderTasks();
    });

    // ── Filters ───────────────────────────────────────────────────────────────
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTasks();
        });
    });

    // ── Sort ──────────────────────────────────────────────────────────────────
    sortSelect.addEventListener('change', renderTasks);

    // ── Bulk Actions ──────────────────────────────────────────────────────────
    markAllBtn.addEventListener('click', () => {
        tasks = tasks.map(t => ({ ...t, status: 'completed' }));
        saveAndRender();
        showToast('Toutes les tâches terminées !');
    });

    let clearTimeout_;
    clearBtn.addEventListener('click', () => {
        if (clearBtn.textContent.includes('SÛR')) {
            tasks = [];
            searchQuery = '';
            searchInput.value = '';
            clearSearch.style.display = 'none';
            saveAndRender();
            clearBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">${SVG.trash}</svg> EFFACER TOUT`;
            clearTimeout(clearTimeout_);
            showToast('Liste vidée.');
        } else {
            clearBtn.textContent = 'SÛR ?';
            clearTimeout_ = setTimeout(() => {
                clearBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">${SVG.trash}</svg> EFFACER TOUT`;
            }, 3000);
        }
    });

    // ── View Toggle ───────────────────────────────────────────────────────────
    listViewBtn.addEventListener('click', () => { applyView('list'); renderTasks(); });
    boardViewBtn.addEventListener('click', () => { applyView('board'); renderTasks(); });

    function applyView(view) {
        currentView = view;
        localStorage.setItem('neoView', view);
        const isList = view === 'list';
        listViewBtn.classList.toggle('active', isList);
        boardViewBtn.classList.toggle('active', !isList);
        taskList.style.display = isList ? 'flex' : 'none';
        boardContainer.classList.toggle('active', !isList);
    }

    // ── Pomodoro Logic ───────────────────────────────────────────────────────
    function updatePomoDisplay() {
        const mins = Math.floor(pomoTimeLeft / 60);
        const secs = pomoTimeLeft % 60;
        pomoTimer.textContent = `${pad(mins)}:${pad(secs)}`;
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
                    clearInterval(pomoInterval);
                    pomoIsRunning = false;
                    showToast('Focus terminé !');
                    new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFRm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YV9vT19vT19vT19vT19vT19vT19vT19vT19vT19vT18='); // Dummy chime
                }
            }, 1000);
            pomoStart.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">${SVG.pause}</svg>`;
        }
        pomoIsRunning = !pomoIsRunning;
    });

    pomoReset.addEventListener('click', () => {
        clearInterval(pomoInterval);
        pomoIsRunning = false;
        const activeMode = document.querySelector('.pomo-mode.active');
        pomoTimeLeft = parseInt(activeMode.dataset.time) * 60;
        updatePomoDisplay();
        pomoStart.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">${SVG.play}</svg>`;
    });

    pomoModes.forEach(mode => {
        mode.addEventListener('click', () => {
            pomoModes.forEach(m => m.classList.remove('active'));
            mode.classList.add('active');
            clearInterval(pomoInterval);
            pomoIsRunning = false;
            pomoTimeLeft = parseInt(mode.dataset.time) * 60;
            updatePomoDisplay();
            pomoStart.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">${SVG.play}</svg>`;
        });
    });

    // ── Drag and Drop Logic ──────────────────────────────────────────────────
    let draggedTaskId = null;

    function initDragAndDrop(el, taskId) {
        el.draggable = true;
        el.addEventListener('dragstart', (e) => {
            draggedTaskId = taskId;
            el.classList.add('dragging');
            e.dataTransfer.setData('task-id', taskId);
        });
        el.addEventListener('dragend', () => el.classList.remove('dragging'));
    }

    function initColumnDrop() {
        document.querySelectorAll('.board-column').forEach(col => {
            col.addEventListener('dragover', (e) => {
                e.preventDefault();
                col.classList.add('drag-over');
            });
            col.addEventListener('dragleave', () => col.classList.remove('drag-over'));
            col.addEventListener('drop', (e) => {
                e.preventDefault();
                col.classList.remove('drag-over');
                const id = parseInt(e.dataTransfer.getData('task-id'));
                const newStatus = col.dataset.status;
                const task = tasks.find(t => t.id === id);
                if (task && task.status !== newStatus) {
                    task.status = newStatus;
                    task.completed = newStatus === 'completed';
                    if (task.completed) launchConfetti();
                    saveAndRender();
                }
            });
        });
    }

    // ── Confetti Logic ───────────────────────────────────────────────────────
    function launchConfetti() {
        showToast('Bravo ! 🎉');
        // Simple SVG particle effect can be complex, let's just use CSS for a pop effect
        document.body.classList.add('confetti-active');
        setTimeout(() => document.body.classList.remove('confetti-active'), 1000);
    }

    // ── Shortcuts Modal ───────────────────────────────────────────────────────
    shortcutsBtn.addEventListener('click', () => shortcutsModal.style.display = 'flex');
    closeModal.addEventListener('click', () => shortcutsModal.style.display = 'none');
    shortcutsModal.addEventListener('click', e => { if (e.target === shortcutsModal) shortcutsModal.style.display = 'none'; });

    // ── Keyboard Shortcuts ────────────────────────────────────────────────────
    document.addEventListener('keydown', e => {
        if (e.target.matches('input, textarea, select, [contenteditable]')) return;
        const key = e.key.toLowerCase();
        if (key === 'n') { taskInput.focus(); e.preventDefault(); }
        if (key === '/') { searchInput.focus(); e.preventDefault(); }
        if (key === 't') { themeToggle.click(); }
        if (key === 'v') { currentView === 'list' ? boardViewBtn.click() : listViewBtn.click(); }
        if (key === 'p') { pomoStart.click(); }
        if (key === 'escape') { shortcutsModal.style.display = 'none'; }
        if (key === '1') { clickFilter('all'); }
        if (key === '2') { clickFilter('todo'); }
        if (key === '3') { clickFilter('active'); }
        if (key === '4') { clickFilter('completed'); }
    });

    function clickFilter(f) {
        const btn = document.querySelector(`.filter-btn[data-filter="${f}"]`);
        if (btn) btn.click();
    }

    // ── Render ────────────────────────────────────────────────────────────────
    function renderTasks() {
        taskList.innerHTML = '';
        boardContainer.innerHTML = '';

        const filtered = getFiltered();
        emptyState.style.display = filtered.length === 0 ? 'flex' : 'none';

        if (currentView === 'list') {
            filtered.forEach(t => taskList.appendChild(createTaskEl(t)));
        } else {
            buildBoard(filtered);
            initColumnDrop();
        }
        updateUI();
    }

    function getFiltered() {
        const raw = tasks.filter(t => {
            const matchFilter = currentFilter === 'all' ||
                (currentFilter === 'todo' && t.status === 'todo') ||
                (currentFilter === 'active' && t.status === 'active') ||
                (currentFilter === 'completed' && t.status === 'completed');
            const matchSearch = !searchQuery ||
                t.text.toLowerCase().includes(searchQuery) ||
                (t.tag && t.tag.toLowerCase().includes(searchQuery)) ||
                (t.note && t.note.toLowerCase().includes(searchQuery));
            return matchFilter && matchSearch;
        });

        const sort = sortSelect.value;
        const pScore = { high: 3, medium: 2, low: 1 };
        raw.sort((a, b) => {
            if (a.pinned !== b.pinned) return b.pinned ? 1 : -1;
            if (sort === 'priority') return pScore[b.priority || 'medium'] - pScore[a.priority || 'medium'];
            if (sort === 'alpha') return a.text.localeCompare(b.text);
            if (sort === 'date') return (a.dueDate || '9999') < (b.dueDate || '9999') ? -1 : 1;
            if (sort === 'created') return new Date(b.createdAt) - new Date(a.createdAt);
            return 0;
        });
        return raw;
    }

    function buildBoard(tasks) {
        const columns = [
            { status: 'todo', label: 'À faire', icon: SVG.todo, color: '#888' },
            { status: 'active', label: 'En cours', icon: SVG.active, color: '#ffbb33' },
            { status: 'completed', label: 'Terminées', icon: SVG.completed, color: '#00C851' },
        ];

        columns.forEach(col => {
            const colTasks = tasks.filter(t => t.status === col.status);
            const div = document.createElement('div');
            div.className = 'board-column';
            div.dataset.status = col.status;
            div.innerHTML = `
                <div class="column-title">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${col.color}" stroke-width="2.5">${col.icon}</svg>
                    <span style="color:${col.color}">${col.label}</span>
                    <span class="column-count">${colTasks.length}</span>
                </div>`;
            colTasks.forEach(t => div.appendChild(createTaskEl(t, true)));
            boardContainer.appendChild(div);
        });
    }

    function createTaskEl(task, compact = false) {
        task.status = task.status || (task.completed ? 'completed' : 'todo');
        task.subtasks = task.subtasks || [];

        const li = document.createElement('li');
        li.className = `task-item${task.status === 'completed' ? ' completed' : ''}${task.pinned ? ' pinned' : ''}`;
        li.dataset.id = task.id;
        li.dataset.status = task.status;

        initDragAndDrop(li, task.id);

        const pBadge = `<span class="priority-badge priority-${task.priority || 'medium'}">${(task.priority || 'medium').toUpperCase()}</span>`;
        const tagBadge = `<span class="tag-badge">#${task.tag || 'Général'}</span>`;

        let dateHtml = '';
        if (task.dueDate) {
            const due = new Date(task.dueDate + 'T00:00:00');
            const today = new Date(); today.setHours(0, 0, 0, 0);
            const overdue = due < today && task.status !== 'completed';
            dateHtml = `<span class="due-date-badge ${overdue ? 'overdue' : ''}"><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">${SVG.hourglass}</svg>${due.toLocaleDateString('fr-FR')}</span>`;
        }

        const colorDot = task.color ? `<span class="color-label" style="background:${task.color}"></span>` : '';
        const subCount = task.subtasks.length ? `<span class="subtask-count">${task.subtasks.filter(s => s.done).length}/${task.subtasks.length}</span>` : '';
        const recurBadge = task.recurring ? `<span class="recurring-badge"><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">${SVG.repeat}</svg></span>` : '';
        const statusIcon = task.status === 'completed' ? SVG.completed : task.status === 'active' ? SVG.active : SVG.todo;
        const noteHtml = task.note ? `<span class="task-note">${escHtml(task.note)}</span>` : '';

        const subsHtml = task.subtasks.map((s, idx) => `
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
              <div class="task-meta">${colorDot}${pBadge}${tagBadge}${subCount}${dateHtml}${recurBadge}</div>
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
              <button class="mini-add-btn">+</button>
            </div>
          </div>`;

        li.querySelector('.status-cycle').addEventListener('click', e => {
            e.stopPropagation();
            const order = ['todo', 'active', 'completed'];
            task.status = order[(order.indexOf(task.status) + 1) % 3];
            task.completed = task.status === 'completed';
            if (task.completed) launchConfetti();
            saveAndRender();
        });

        li.querySelector('.duplicate-btn').addEventListener('click', e => {
            e.stopPropagation();
            const clone = { ...task, id: Date.now(), text: task.text + ' (Copie)', expanded: false };
            tasks.push(clone);
            saveAndRender();
            showToast('Tâche dupliquée !');
        });

        li.querySelector('.pin-btn').addEventListener('click', e => {
            e.stopPropagation();
            task.pinned = !task.pinned;
            saveAndRender();
        });

        li.querySelector('.expand-btn').addEventListener('click', e => {
            e.stopPropagation();
            task.expanded = !task.expanded;
            saveTasks();
            renderTasks();
        });

        li.querySelector('.delete-btn').addEventListener('click', e => {
            e.stopPropagation();
            tasks = tasks.filter(t => t.id !== task.id);
            saveAndRender();
        });

        const textSpan = li.querySelector('.task-text');
        textSpan.addEventListener('blur', () => {
            const val = textSpan.innerText.trim();
            if (val && val !== task.text) { task.text = val; saveTasks(); }
        });

        // Subtask events (simplified)
        li.querySelectorAll('.subtask-item').forEach(item => {
            const idx = +item.dataset.idx;
            item.querySelector('.subtask-checkbox').addEventListener('click', () => {
                task.subtasks[idx].done = !task.subtasks[idx].done;
                if (task.subtasks[idx].done) launchConfetti();
                saveAndRender();
            });
            item.querySelector('.mini-del-sub').addEventListener('click', () => {
                task.subtasks.splice(idx, 1);
                saveAndRender();
            });
        });

        const subInput = li.querySelector('.subtask-input-mini');
        li.querySelector('.mini-add-btn').addEventListener('click', () => {
            if (subInput.value.trim()) {
                task.subtasks.push({ text: subInput.value.trim(), done: false });
                saveAndRender();
            }
        });

        return li;
    }

    function saveAndRender() { saveTasks(); renderTasks(); }
    function saveTasks() { localStorage.setItem('neoTasks', JSON.stringify(tasks)); }

    function updateUI() {
        const total = tasks.length;
        const done = tasks.filter(t => t.status === 'completed').length;
        const active = tasks.filter(t => t.status === 'active').length;
        const todo = tasks.filter(t => t.status === 'todo').length;
        const pct = total === 0 ? 0 : Math.round((done / total) * 100);
        progressBar.style.strokeDashoffset = 440 - (pct / 100) * 440;
        circlePct.textContent = `${pct}%`;
        progressText.textContent = `${done}/${total} éléments`;
        statsDetail.textContent = `${active} en cours • ${done} terminées`;
        statTodo.textContent = todo;
        statActive.textContent = active;
        statDone.textContent = done;
    }

    function updateClock() {
        const now = new Date();
        const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
        const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
        clockEl.querySelector('.clock-time').textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
        clockEl.querySelector('.clock-ampm').textContent = now.getHours() >= 12 ? 'PM' : 'AM';
        document.getElementById('clockDate').textContent = `${days[now.getDay()]} ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
    }

    function pad(n) { return String(n).padStart(2, '0'); }

    let toastTimeout;
    function showToast(msg) {
        const el = document.getElementById('toast');
        el.textContent = msg;
        el.classList.add('show');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => el.classList.remove('show'), 2500);
    }

    // Export/Import
    exportBtn.addEventListener('click', () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tasks, null, 2));
        const a = document.createElement('a');
        a.href = dataStr; a.download = 'neo_tasks.json'; a.click();
    });

    importBtn.addEventListener('click', () => importFile.click());
    importFile.addEventListener('change', e => {
        const reader = new FileReader();
        reader.onload = ev => {
            try { tasks = JSON.parse(ev.target.result); saveAndRender(); showToast('Importé !'); }
            catch { showToast('Erreur JSON'); }
        };
        reader.readAsText(e.target.files[0]);
    });

    function escHtml(str) {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
});
