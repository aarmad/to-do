document.addEventListener('DOMContentLoaded', () => {
    // Selectors
    const taskInput = document.getElementById('taskInput');
    const priorityInput = document.getElementById('priorityInput');
    const tagInput = document.getElementById('tagInput');
    const dueDateInput = document.getElementById('dueDateInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const statsDetail = document.getElementById('statsDetail');
    const clockElement = document.getElementById('clock');
    const clearBtn = document.getElementById('clearTasks');
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('searchInput');
    const markAllDoneBtn = document.getElementById('markAllDone');
    const exportBtn = document.getElementById('exportBtn');
    const importBtn = document.getElementById('importBtn');
    const importFileInput = document.getElementById('importFile');

    // View Selectors
    const listViewBtn = document.getElementById('listViewBtn');
    const boardViewBtn = document.getElementById('boardViewBtn');
    const boardContainer = document.querySelector('.board-container') || createBoardContainer();

    let tasks = JSON.parse(localStorage.getItem('neoTasks')) || [];
    let currentFilter = 'all';
    let searchQuery = '';
    let currentView = localStorage.getItem('neoView') || 'list';

    // Initialization
    updateClock();
    renderTasks();
    setInterval(updateClock, 1000);
    setInitialView();

    function createBoardContainer() {
        const board = document.createElement('div');
        board.className = 'board-container';
        board.innerHTML = `
            <div class="board-column" data-status="active">
                <div class="column-title"><span>🚀 En cours</span> <span class="column-count">0</span></div>
                <div class="column-tasks"></div>
            </div>
            <div class="board-column" data-status="completed">
                <div class="column-title"><span>✅ Terminées</span> <span class="column-count">0</span></div>
                <div class="column-tasks"></div>
            </div>
            <div class="board-column" data-status="backlog">
                <div class="column-title"><span>📦 Archives</span> <span class="column-count">0</span></div>
                <div class="column-tasks"></div>
            </div>
        `;
        taskList.parentNode.insertBefore(board, taskList.nextSibling);
        return board;
    }

    function setInitialView() {
        if (currentView === 'board') {
            listViewBtn.classList.remove('active');
            boardViewBtn.classList.add('active');
            taskList.style.display = 'none';
            boardContainer.style.display = 'grid';
        }
    }

    // Theme Logic
    const sunIcon = `<path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z"></path>`;
    const moonIcon = `<path d="M12.79 21L21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;

    const setTheme = (isDark) => {
        if (isDark) {
            document.body.classList.add('dark-mode');
            themeIcon.innerHTML = sunIcon;
        } else {
            document.body.classList.remove('dark-mode');
            themeIcon.innerHTML = moonIcon;
        }
    };

    themeToggle.addEventListener('click', () => {
        const isNowDark = !document.body.classList.contains('dark-mode');
        setTheme(isNowDark);
        localStorage.setItem('neoTheme', isNowDark ? 'dark' : 'light');
    });

    if (localStorage.getItem('neoTheme') === 'dark') setTheme(true);

    // View Switching
    listViewBtn.addEventListener('click', () => {
        currentView = 'list';
        localStorage.setItem('neoView', 'list');
        listViewBtn.classList.add('active');
        boardViewBtn.classList.remove('active');
        taskList.style.display = 'flex';
        boardContainer.style.display = 'none';
        renderTasks();
    });

    boardViewBtn.addEventListener('click', () => {
        currentView = 'board';
        localStorage.setItem('neoView', 'board');
        boardViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
        taskList.style.display = 'none';
        boardContainer.style.display = 'grid';
        renderTasks();
    });

    // Add Task
    const addTask = () => {
        const text = taskInput.value.trim();
        if (text === '') return;

        const newTask = {
            id: Date.now(),
            text: text,
            priority: priorityInput.value,
            tag: tagInput.value.trim() || 'Général',
            dueDate: dueDateInput.value || null,
            completed: false,
            pinned: false,
            subtasks: [],
            expanded: false,
            createdAt: new Date().toISOString()
        };

        tasks.push(newTask);
        saveAndRender();

        taskInput.value = '';
        tagInput.value = '';
        dueDateInput.value = '';
    };

    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addTask(); });

    // Search & Filters
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        renderTasks();
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTasks();
        });
    });

    // Bulk Actions
    markAllDoneBtn.addEventListener('click', () => {
        tasks = tasks.map(t => ({ ...t, completed: true }));
        saveAndRender();
    });

    let clearConfirmTimeout;
    clearBtn.addEventListener('click', () => {
        if (clearBtn.innerText === 'SÛR ?') {
            tasks = [];
            searchQuery = '';
            searchInput.value = '';
            saveAndRender();
            clearBtn.innerText = 'EFFACER TOUT';
            clearTimeout(clearConfirmTimeout);
        } else {
            clearBtn.innerText = 'SÛR ?';
            clearConfirmTimeout = setTimeout(() => {
                clearBtn.innerText = 'EFFACER TOUT';
            }, 3000);
        }
    });

    function saveAndRender() {
        localStorage.setItem('neoTasks', JSON.stringify(tasks));
        renderTasks();
    }

    function renderTasks() {
        if (currentView === 'list') {
            renderListView();
        } else {
            renderBoardView();
        }
        updateUI();
    }

    function renderListView() {
        taskList.innerHTML = '';
        const filteredTasks = getFilteredTasks();

        // Sorting: Pinned first, then Priority
        const pScores = { high: 3, medium: 2, low: 1 };
        filteredTasks.sort((a, b) => {
            if (a.pinned !== b.pinned) return b.pinned ? 1 : -1;
            return pScores[b.priority || 'medium'] - pScores[a.priority || 'medium'];
        });

        filteredTasks.forEach(task => {
            const li = createTaskElement(task);
            taskList.appendChild(li);
        });
    }

    function renderBoardView() {
        const columns = boardContainer.querySelectorAll('.column-tasks');
        columns.forEach(c => c.innerHTML = '');

        const filteredTasks = getFilteredTasks();

        const activeTasks = filteredTasks.filter(t => !t.completed);
        const completedTasks = filteredTasks.filter(t => t.completed);

        activeTasks.forEach(task => {
            const el = createTaskElement(task, true);
            boardContainer.querySelector('[data-status="active"] .column-tasks').appendChild(el);
        });

        completedTasks.forEach(task => {
            const el = createTaskElement(task, true);
            boardContainer.querySelector('[data-status="completed"] .column-tasks').appendChild(el);
        });

        // Update counts
        boardContainer.querySelector('[data-status="active"] .column-count').innerText = activeTasks.length;
        boardContainer.querySelector('[data-status="completed"] .column-count').innerText = completedTasks.length;
    }

    function getFilteredTasks() {
        return tasks.filter(t => {
            const matchesFilter = currentFilter === 'all' ||
                (currentFilter === 'active' && !t.completed) ||
                (currentFilter === 'completed' && t.completed);
            const matchesSearch = t.text.toLowerCase().includes(searchQuery) ||
                (t.tag && t.tag.toLowerCase().includes(searchQuery));
            return matchesFilter && matchesSearch;
        });
    }

    function createTaskElement(task, isSmall = false) {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''} ${task.pinned ? 'pinned' : ''}`;
        li.dataset.id = task.id;

        const p = task.priority || 'medium';
        const tag = task.tag || 'Général';

        const hourglassSVG = `<svg class="meta-icon" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 2h14"></path><path d="M5 22h14"></path><path d="M19 2l-7 7-7-7"></path><path d="M5 22l7-7 7 7"></path></svg>`;
        const checkmarkSVG = task.completed ? `<svg class="checkmark-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>` : '';
        const pinSVG = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"></path><path d="m7.5 4.27 9 5.15"></path><polyline points="3.29 7 12 12 20.71 7"></polyline><line x1="12" y1="22" x2="12" y2="12"></line></svg>`;

        const dateStr = task.dueDate ? `<span class="due-date-badge">${hourglassSVG} ${new Date(task.dueDate).toLocaleDateString('fr-FR')}</span>` : '';

        const subtasksCount = task.subtasks ? task.subtasks.length : 0;
        const subtasksDone = task.subtasks ? task.subtasks.filter(s => s.completed).length : 0;
        const subProgress = subtasksCount > 0 ? `<span class="tag-badge" style="background:#222">${subtasksDone}/${subtasksCount}</span>` : '';

        li.innerHTML = `
            <div class="task-item-top">
                <div class="custom-checkbox">${checkmarkSVG}</div>
                <div class="task-content">
                    <span class="task-text" contenteditable="true">${task.text}</span>
                    <div class="task-meta">
                        <span class="priority-badge priority-${p}">${p.toUpperCase()}</span>
                        <span class="tag-badge">#${tag}</span>
                        ${subProgress}
                        ${dateStr}
                    </div>
                </div>
                <div class="task-actions">
                    <button class="pin-btn" title="Épingler">${pinSVG}</button>
                    <button class="expand-btn action-icon-btn" title="Afficher sous-tâches">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </button>
                    <button class="delete-btn">×</button>
                </div>
            </div>
            <div class="subtask-section" style="display: ${task.expanded ? 'block' : 'none'}">
                <div class="subtask-list">
                    ${(task.subtasks || []).map((s, idx) => `
                        <div class="subtask-item ${s.completed ? 'completed' : ''}" data-idx="${idx}">
                            <div class="subtask-checkbox">${s.completed ? '✓' : ''}</div>
                            <span contenteditable="true">${s.text}</span>
                            <button class="mini-del-sub" style="background:none; border:none; color:#555; cursor:pointer">×</button>
                        </div>
                    `).join('')}
                </div>
                <div class="subtask-add-row">
                    <input type="text" class="subtask-input-mini" placeholder="Ajouter une sous-tâche...">
                    <button class="mini-add-btn" style="background:none; border:none; color:white; cursor:pointer">+</button>
                </div>
            </div>
        `;

        // Event Listeners for the task element
        li.querySelector('.custom-checkbox').addEventListener('click', (e) => {
            e.stopPropagation();
            toggleTask(task.id);
        });

        li.querySelector('.pin-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            task.pinned = !task.pinned;
            saveAndRender();
        });

        li.querySelector('.expand-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            task.expanded = !task.expanded;
            renderTasks();
            saveTasks();
        });

        li.querySelector('.delete-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            tasks = tasks.filter(t => t.id !== task.id);
            saveAndRender();
        });

        // Inline Editing
        const textSpan = li.querySelector('.task-text');
        textSpan.addEventListener('blur', () => {
            const newText = textSpan.innerText.trim();
            if (newText && newText !== task.text) {
                task.text = newText;
                saveTasks();
            }
        });
        textSpan.addEventListener('click', e => e.stopPropagation());

        // Subtask Logic
        const subInput = li.querySelector('.subtask-input-mini');
        const addSub = () => {
            const val = subInput.value.trim();
            if (val) {
                if (!task.subtasks) task.subtasks = [];
                task.subtasks.push({ text: val, completed: false });
                subInput.value = '';
                saveAndRender();
            }
        };
        li.querySelector('.mini-add-btn').addEventListener('click', addSub);
        subInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addSub(); });

        li.querySelectorAll('.subtask-item').forEach(item => {
            const idx = item.dataset.idx;
            item.querySelector('.subtask-checkbox').addEventListener('click', () => {
                task.subtasks[idx].completed = !task.subtasks[idx].completed;
                saveAndRender();
            });
            item.querySelector('.mini-del-sub').addEventListener('click', () => {
                task.subtasks.splice(idx, 1);
                saveAndRender();
            });
        });

        return li;
    }

    function toggleTask(id) {
        tasks = tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        saveAndRender();
    }

    function saveTasks() { localStorage.setItem('neoTasks', JSON.stringify(tasks)); }

    function updateUI() {
        const total = tasks.length;
        const completedCount = tasks.filter(t => t.completed).length;
        const activeCount = total - completedCount;

        const circumference = 440;
        const offset = total === 0 ? circumference : circumference - (completedCount / total) * circumference;
        progressBar.style.strokeDashoffset = offset;

        progressText.innerText = `${completedCount}/${total} éléments`;
        statsDetail.innerText = `${activeCount} en cours • ${completedCount} terminés`;
    }

    function updateClock() {
        const now = new Date();
        const clockDiv = clockElement.querySelector('.clock-time');
        const ampmDiv = clockElement.querySelector('.clock-ampm');
        clockDiv.innerText = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        ampmDiv.innerText = now.getHours() >= 12 ? 'PM' : 'AM';
    }

    // Data Export/Import
    exportBtn.addEventListener('click', () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tasks));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "neo_tasks_backup.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    });

    importBtn.addEventListener('click', () => importFileInput.click());
    importFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const importedTasks = JSON.parse(event.target.result);
                if (Array.isArray(importedTasks)) {
                    tasks = importedTasks;
                    saveAndRender();
                    alert('Importation réussie !');
                }
            } catch (err) { alert('Fichier JSON invalide.'); }
        };
        reader.readAsText(file);
    });
});
