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

    let tasks = JSON.parse(localStorage.getItem('neoTasks')) || [];
    let currentFilter = 'all';
    let searchQuery = '';

    // Initialization
    updateClock();
    renderTasks();
    setInterval(updateClock, 1000);

    // Theme Logic
    const sunIcon = `<path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z"></path>`;
    const moonIcon = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;

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

    clearBtn.addEventListener('click', () => {
        if (window.confirm('Voulez-vous vraiment tout supprimer ?')) {
            tasks = [];
            searchQuery = '';
            searchInput.value = '';
            saveAndRender();
        }
    });

    // Task Interactions
    taskList.addEventListener('click', (e) => {
        const item = e.target.closest('.task-item');
        if (!item) return;
        const id = parseInt(item.dataset.id);

        if (e.target.closest('.delete-btn')) {
            tasks = tasks.filter(t => t.id !== id);
            saveAndRender();
            return;
        }

        toggleTask(id);
    });

    function toggleTask(id) {
        tasks = tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        saveAndRender();
    }

    function saveAndRender() {
        localStorage.setItem('neoTasks', JSON.stringify(tasks));
        renderTasks();
    }

    function renderTasks() {
        taskList.innerHTML = '';

        let filteredTasks = tasks.filter(t => {
            const matchesFilter = currentFilter === 'all' ||
                (currentFilter === 'active' && !t.completed) ||
                (currentFilter === 'completed' && t.completed);
            const matchesSearch = t.text.toLowerCase().includes(searchQuery) ||
                (t.tag && t.tag.toLowerCase().includes(searchQuery));
            return matchesFilter && matchesSearch;
        });

        // Priority Sorting
        const pScores = { high: 3, medium: 2, low: 1 };
        filteredTasks.sort((a, b) => pScores[b.priority || 'medium'] - pScores[a.priority || 'medium']);

        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            li.dataset.id = task.id;

            const p = task.priority || 'medium';
            const tag = task.tag || 'Général';

            // SVG Icons
            const hourglassSVG = `<svg class="meta-icon" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 2h14"></path><path d="M5 22h14"></path><path d="M19 2l-7 7-7-7"></path><path d="M5 22l7-7 7 7"></path></svg>`;
            const checkmarkSVG = task.completed ? `<svg class="checkmark-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>` : '';

            const dateStr = task.dueDate ? `<span class="due-date-badge">${hourglassSVG} ${new Date(task.dueDate).toLocaleDateString('fr-FR')}</span>` : '';

            li.innerHTML = `
                <div class="custom-checkbox">${checkmarkSVG}</div>
                <div class="task-content">
                    <span class="task-text" contenteditable="true">${task.text}</span>
                    <div class="task-meta">
                        <span class="priority-badge priority-${p}">${p.toUpperCase()}</span>
                        <span class="tag-badge">#${tag}</span>
                        ${dateStr}
                    </div>
                </div>
                <button class="delete-btn">×</button>
            `;

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

            taskList.appendChild(li);
        });

        updateUI();
    }

    function saveTasks() { localStorage.setItem('neoTasks', JSON.stringify(tasks)); }

    function updateUI() {
        const total = tasks.length;
        const completedCount = tasks.filter(t => t.completed).length;
        const activeCount = total - completedCount;

        const circumference = 440; // Dasharray matching CSS
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
