document.addEventListener('DOMContentLoaded', () => {
    // === DOM ELEMENTS ===
    const taskForm = document.getElementById('task-form');
    const taskNameInput = document.getElementById('task-name');
    const taskSubjectInput = document.getElementById('task-subject');
    const taskDeadlineInput = document.getElementById('task-deadline');
    const taskIdInput = document.getElementById('task-id');
    const taskList = document.getElementById('task-list');
    const formTitle = document.getElementById('form-title');
    const submitButton = document.getElementById('submit-button');
    const cancelEditButton = document.getElementById('cancel-edit-button');
    const searchInput = document.getElementById('search-input');
    const statusFilter = document.getElementById('status-filter');
    const incompleteTasksCount = document.getElementById('incomplete-tasks-count');
    const darkModeToggle = document.getElementById('dark-mode-toggle');

    // === APPLICATION STATE ===
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // === DARK MODE LOGIC ===
    const enableDarkMode = () => {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
    };

    const disableDarkMode = () => {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
    };

    darkModeToggle.addEventListener('click', () => {
        if (document.body.classList.contains('dark-mode')) {
            disableDarkMode();
        } else {
            enableDarkMode();
        }
    });

    // Check for saved theme preference
    if (localStorage.getItem('theme') === 'dark') {
        enableDarkMode();
    }

    // === CORE FUNCTIONS ===
    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const renderTasks = () => {
        taskList.innerHTML = '';
        const searchValue = searchInput.value.toLowerCase();
        const filterValue = statusFilter.value;

        const filteredTasks = tasks.filter(task => {
            const matchesSearch = task.name.toLowerCase().includes(searchValue) || task.subject.toLowerCase().includes(searchValue);
            const matchesStatus = (filterValue === 'all') ||
                                  (filterValue === 'completed' && task.isCompleted) ||
                                  (filterValue === 'incomplete' && !task.isCompleted);
            return matchesSearch && matchesStatus;
        }).sort((a, b) => new Date(a.deadline) - new Date(b.deadline)); // Sort by deadline

        if (filteredTasks.length === 0) {
            taskList.innerHTML = '<p style="text-align:center;">Tidak ada tugas yang ditemukan.</p>';
        } else {
            filteredTasks.forEach(task => {
                const taskCard = document.createElement('div');
                taskCard.className = `task-card glass-card fade-in ${task.isCompleted ? 'completed' : ''}`;
                taskCard.setAttribute('data-id', task.id);

                taskCard.innerHTML = `
                    <div class="task-details">
                        <h3>${task.name}</h3>
                        <p><strong>Kuliah:</strong> ${task.subject}</p>
                        <p><strong>Deadline:</strong> ${new Date(task.deadline).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <div class="task-actions">
                        <button class="icon-btn toggle-btn" title="${task.isCompleted ? 'Tandai Belum Selesai' : 'Tandai Selesai'}">
                            <i class="fa-solid ${task.isCompleted ? 'fa-xmark' : 'fa-check'}"></i>
                        </button>
                        <button class="icon-btn edit-btn" title="Edit Tugas">
                            <i class="fa-solid fa-pencil"></i>
                        </button>
                        <button class="icon-btn delete-btn" title="Hapus Tugas">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                `;
                taskList.appendChild(taskCard);
            });
        }
        updateIncompleteCount();
    };

    const updateIncompleteCount = () => {
        const count = tasks.filter(task => !task.isCompleted).length;
        incompleteTasksCount.textContent = `Tugas belum selesai: ${count}`;
    };

    const resetForm = () => {
        taskForm.reset();
        taskIdInput.value = '';
        formTitle.textContent = 'Tambah Tugas Baru';
        submitButton.innerHTML = '<i class="fa-solid fa-plus"></i> Tambah Tugas';
        cancelEditButton.classList.add('hidden');
    };

    const validateForm = (name, subject, deadline) => {
        if (!name.trim() || !subject.trim()) {
            alert('Nama tugas dan mata kuliah tidak boleh kosong.');
            return false;
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (new Date(deadline) < today) {
            alert('Tanggal deadline tidak boleh sebelum hari ini.');
            return false;
        }
        return true;
    };

    // === EVENT HANDLERS ===
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = taskIdInput.value;
        const name = taskNameInput.value;
        const subject = taskSubjectInput.value;
        const deadline = taskDeadlineInput.value;

        if (!validateForm(name, subject, deadline)) return;

        if (id) { // Edit mode
            const task = tasks.find(t => t.id === id);
            if (task) {
                task.name = name;
                task.subject = subject;
                task.deadline = deadline;
            }
        } else { // Add mode
            const newTask = {
                id: Date.now().toString(),
                name, subject, deadline, isCompleted: false
            };
            tasks.push(newTask);
        }

        saveTasks();
        renderTasks();
        resetForm();
    });

    cancelEditButton.addEventListener('click', resetForm);

    taskList.addEventListener('click', (e) => {
        const targetButton = e.target.closest('.icon-btn');
        if (!targetButton) return;
        
        const card = targetButton.closest('.task-card');
        const id = card.getAttribute('data-id');

        if (targetButton.classList.contains('delete-btn')) {
            if (confirm('Anda yakin ingin menghapus tugas ini?')) {
                tasks = tasks.filter(task => task.id !== id);
                saveTasks();
                renderTasks();
            }
        } else if (targetButton.classList.contains('edit-btn')) {
            const task = tasks.find(t => t.id === id);
            taskIdInput.value = task.id;
            taskNameInput.value = task.name;
            taskSubjectInput.value = task.subject;
            taskDeadlineInput.value = task.deadline;
            formTitle.textContent = 'Edit Tugas';
            submitButton.innerHTML = '<i class="fa-solid fa-save"></i> Simpan Perubahan';
            cancelEditButton.classList.remove('hidden');
            document.getElementById('form-section').scrollIntoView({ behavior: 'smooth' });
        } else if (targetButton.classList.contains('toggle-btn')) {
            const task = tasks.find(t => t.id === id);
            task.isCompleted = !task.isCompleted;
            saveTasks();
            renderTasks();
        }
    });

    searchInput.addEventListener('input', renderTasks);
    statusFilter.addEventListener('change', renderTasks);

    // === INITIALIZATION ===
    renderTasks();
});