'use strict';

// ==========================================================
// KONSTANTA & ENDPOINT API PUBLIK (tanpa API key)
// ==========================================================
const STORAGE_KEY = 'dashboardMahasiswa_tasks_v1';
const TODOS_API = 'https://jsonplaceholder.typicode.com/todos?_limit=5';
const QUOTE_API = 'https://dummyjson.com/quotes/random';
const WEATHER_API =
  'https://api.open-meteo.com/v1/forecast?latitude=-5.36&longitude=105.31&current_weather=true&timezone=Asia%2FJakarta';

// ==========================================================
// CLASS: TaskItem
// Memodelkan struktur data setiap item tugas kuliah.
// ==========================================================
class TaskItem {
  constructor({ id, title, dueDate = '', priority = 'sedang', completed = false }) {
    this.id = id ?? `task-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    this.title = title;
    this.dueDate = dueDate;
    this.priority = priority;
    this.completed = completed;
  }

  // Getter: menandai tugas yang sudah lewat tenggat tapi belum selesai
  get isOverdue() {
    if (!this.dueDate || this.completed) return false;
    const today = new Date().toISOString().split('T')[0];
    return this.dueDate < today;
  }
}

// ==========================================================
// CLASS: DashboardApp
// Mengelola state aplikasi, localStorage, DOM, dan fetch() API.
// ==========================================================
class DashboardApp {
  constructor() {
    this.tasks = [];
    this.activeFilter = 'all';
    this.editingTaskId = null;

    // Referensi DOM
    this.taskForm = document.getElementById('task-form');
    this.taskTitleInput = document.getElementById('task-title');
    this.taskDueInput = document.getElementById('task-due');
    this.taskPriorityInput = document.getElementById('task-priority');
    this.taskListEl = document.getElementById('task-list');
    this.emptyMessageEl = document.getElementById('empty-task-message');
    this.filterButtons = document.querySelectorAll('.filter-btn');
    this.statTotalEl = document.getElementById('stat-total');
    this.statDoneEl = document.getElementById('stat-done');
    this.statPendingEl = document.getElementById('stat-pending');
    this.quoteTextEl = document.getElementById('quote-text');
    this.quoteAuthorEl = document.getElementById('quote-author');
    this.btnRefreshQuote = document.getElementById('btn-refresh-quote');
    this.weatherBoxEl = document.getElementById('weather-box');
    this.clockEl = document.getElementById('clock');

    this.init();
  }

  // ---------- Inisialisasi ----------
  async init() {
    await this.loadTasks();
    this.renderTasks();
    this.bindEvents();
    this.startClock();
    await this.loadQuote();
    await this.loadWeather();
  }

  // ==========================================================
  // LOCAL STORAGE & DATA AWAL (Async/Await)
  // ==========================================================
  async loadTasks() {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
      const parsedTasks = JSON.parse(stored);
      this.tasks = parsedTasks.map((item) => new TaskItem(item));
      return;
    }

    // Jika belum ada data tersimpan, ambil data awal dari JSONPlaceholder
    try {
      const initialTasks = await this.fetchInitialTasks();
      this.tasks = initialTasks;
      this.saveTasks();
    } catch (error) {
      console.error('Gagal memuat tugas awal dari API:', error);
      this.tasks = [];
    }
  }

  fetchInitialTasks = async () => {
    const response = await fetch(TODOS_API);
    if (!response.ok) throw new Error('Gagal mengambil data tugas awal');

    const data = await response.json();

    return data.map(
      ({ id, title, completed }) =>
        new TaskItem({ id: `seed-${id}`, title, completed, priority: 'sedang', dueDate: '' })
    );
  };

  saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tasks));
  }

  // ==========================================================
  // CRUD TUGAS (immutable state dengan spread operator)
  // ==========================================================
  addTask = ({ title, dueDate, priority }) => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    const newTask = new TaskItem({
      id: `task-${Date.now()}`,
      title: trimmedTitle,
      dueDate,
      priority,
    });

    this.tasks = [newTask, ...this.tasks];
    this.saveTasks();
    this.renderTasks();
  };

  updateTask = (id, { title, dueDate, priority }) => {
    this.tasks = this.tasks.map((task) =>
      task.id === id ? new TaskItem({ ...task, title, dueDate, priority }) : task
    );
    this.saveTasks();
    this.renderTasks();
  };

  toggleComplete = (id) => {
    this.tasks = this.tasks.map((task) =>
      task.id === id ? new TaskItem({ ...task, completed: !task.completed }) : task
    );
    this.saveTasks();
    this.renderTasks();
  };

  deleteTask = (id) => {
    const confirmed = confirm('Hapus tugas ini?');
    if (!confirmed) return;

    this.tasks = this.tasks.filter((task) => task.id !== id);
    this.saveTasks();
    this.renderTasks();
  };

  // ==========================================================
  // FILTER & RENDER (template literals)
  // ==========================================================
  getFilteredTasks = () => {
    switch (this.activeFilter) {
      case 'pending':
        return this.tasks.filter((task) => !task.completed);
      case 'completed':
        return this.tasks.filter((task) => task.completed);
      default:
        return this.tasks;
    }
  };

  renderTasks() {
    const filteredTasks = this.getFilteredTasks();

    this.emptyMessageEl.hidden = filteredTasks.length !== 0;
    this.taskListEl.innerHTML = filteredTasks.map((task) => this.renderTaskItem(task)).join('');

    this.attachTaskEvents();
    this.updateStats();
  }

  renderTaskItem = ({ id, title, dueDate, priority, completed, isOverdue }) => {
    if (this.editingTaskId === id) {
      return `
        <li class="task-card editing" data-id="${id}">
          <form class="edit-form" data-id="${id}">
            <input type="text" name="title" value="${this.escapeHtml(title)}" required />
            <input type="date" name="dueDate" value="${dueDate}" />
            <select name="priority">
              <option value="tinggi" ${priority === 'tinggi' ? 'selected' : ''}>Tinggi</option>
              <option value="sedang" ${priority === 'sedang' ? 'selected' : ''}>Sedang</option>
              <option value="rendah" ${priority === 'rendah' ? 'selected' : ''}>Rendah</option>
            </select>
            <div class="edit-actions">
              <button type="submit" class="btn btn-primary btn-sm">Simpan</button>
              <button type="button" class="btn btn-secondary btn-sm btn-cancel-edit" data-id="${id}">Batal</button>
            </div>
          </form>
        </li>
      `;
    }

    return `
      <li class="task-card priority-${priority} ${completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}" data-id="${id}">
        <label class="task-checkbox">
          <input type="checkbox" class="chk-complete" data-id="${id}" ${completed ? 'checked' : ''} />
        </label>
        <div class="task-info">
          <p class="task-title">${this.escapeHtml(title)}</p>
          <div class="task-meta">
            <span class="badge badge-${priority}">${priority}</span>
            ${dueDate ? `<span class="due-date ${isOverdue ? 'text-danger' : ''}">📅 ${dueDate}</span>` : ''}
            ${isOverdue ? '<span class="overdue-label">Terlambat!</span>' : ''}
          </div>
        </div>
        <div class="task-actions">
          <button class="btn-icon btn-edit" data-id="${id}" title="Edit">✏️</button>
          <button class="btn-icon btn-delete" data-id="${id}" title="Hapus">🗑️</button>
        </div>
      </li>
    `;
  };

  escapeHtml = (text = '') =>
    text.replace(
      /[&<>"']/g,
      (char) =>
        ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;',
        }[char])
    );

  updateStats() {
    const total = this.tasks.length;
    const done = this.tasks.filter((task) => task.completed).length;
    const pending = total - done;

    this.statTotalEl.textContent = total;
    this.statDoneEl.textContent = done;
    this.statPendingEl.textContent = pending;
  }

  // ==========================================================
  // EVENT LISTENERS
  // ==========================================================
  attachTaskEvents() {
    this.taskListEl.querySelectorAll('.chk-complete').forEach((checkbox) => {
      checkbox.addEventListener('change', ({ target }) => this.toggleComplete(target.dataset.id));
    });

    this.taskListEl.querySelectorAll('.btn-delete').forEach((button) => {
      button.addEventListener('click', ({ target }) => this.deleteTask(target.dataset.id));
    });

    this.taskListEl.querySelectorAll('.btn-edit').forEach((button) => {
      button.addEventListener('click', ({ target }) => {
        this.editingTaskId = target.dataset.id;
        this.renderTasks();
      });
    });

    this.taskListEl.querySelectorAll('.btn-cancel-edit').forEach((button) => {
      button.addEventListener('click', () => {
        this.editingTaskId = null;
        this.renderTasks();
      });
    });

    this.taskListEl.querySelectorAll('.edit-form').forEach((form) => {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const { id } = form.dataset;
        const formData = new FormData(form);

        this.editingTaskId = null;
        this.updateTask(id, {
          title: formData.get('title'),
          dueDate: formData.get('dueDate'),
          priority: formData.get('priority'),
        });
      });
    });
  }

  bindEvents() {
    this.taskForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const { value: title } = this.taskTitleInput;
      const { value: dueDate } = this.taskDueInput;
      const { value: priority } = this.taskPriorityInput;

      this.addTask({ title, dueDate, priority });
      this.taskForm.reset();
    });

    this.filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        this.filterButtons.forEach((btn) => btn.classList.remove('active'));
        button.classList.add('active');
        this.activeFilter = button.dataset.filter;
        this.renderTasks();
      });
    });

    this.btnRefreshQuote.addEventListener('click', () => this.loadQuote());
  }

  // ==========================================================
  // FETCH API: Kutipan Motivasi Harian (DummyJSON)
  // ==========================================================
  async loadQuote() {
    this.quoteTextEl.textContent = 'Memuat kutipan...';
    this.quoteAuthorEl.textContent = '';

    try {
      const response = await fetch(QUOTE_API);
      if (!response.ok) throw new Error('Gagal mengambil kutipan');

      const { quote, author } = await response.json();
      this.quoteTextEl.textContent = `"${quote}"`;
      this.quoteAuthorEl.textContent = `— ${author}`;
    } catch (error) {
      this.quoteTextEl.textContent = 'Gagal memuat kutipan hari ini. Coba lagi nanti.';
      console.error(error);
    }
  }

  // ==========================================================
  // FETCH API: Cuaca Real-time ITERA (Open-Meteo)
  // ==========================================================
  async loadWeather() {
    this.weatherBoxEl.innerHTML = '<p>Memuat cuaca...</p>';

    try {
      const response = await fetch(WEATHER_API);
      if (!response.ok) throw new Error('Gagal mengambil data cuaca');

      const { current_weather } = await response.json();
      const { temperature, windspeed, weathercode, is_day } = current_weather;
      const { icon, description } = this.getWeatherInfo(weathercode, is_day === 1);

      this.weatherBoxEl.innerHTML = `
        <div class="weather-main">
          <span class="weather-icon">${icon}</span>
          <div>
            <p class="weather-temp">${temperature}°C</p>
            <p class="weather-desc">${description}</p>
          </div>
        </div>
        <p class="weather-sub">💨 Angin: ${windspeed} km/jam</p>
        <p class="weather-location">📍 ITERA, Lampung Selatan</p>
      `;
    } catch (error) {
      this.weatherBoxEl.innerHTML = '<p>Gagal memuat data cuaca.</p>';
      console.error(error);
    }
  }

  // Memetakan kode cuaca WMO (Open-Meteo) menjadi ikon & deskripsi
  getWeatherInfo = (code, isDay = true) => {
    let icon = '';
    let description = '';

    switch (true) {
      case code === 0:
        icon = isDay ? '☀️' : '🌙';
        description = 'Cerah';
        break;
      case code === 1 || code === 2:
        icon = isDay ? '🌤️' : '☁️';
        description = 'Cerah Berawan';
        break;
      case code === 3:
        icon = '☁️';
        description = 'Mendung';
        break;
      case [45, 48].includes(code):
        icon = '🌫️';
        description = 'Berkabut';
        break;
      case [51, 53, 55].includes(code):
        icon = '🌦️';
        description = 'Gerimis';
        break;
      case [61, 63, 65, 80].includes(code):
        icon = '🌧️';
        description = 'Hujan';
        break;
      case code === 95:
        icon = '⛈️';
        description = 'Badai Petir';
        break;
      default:
        icon = '🌡️';
        description = 'Tidak diketahui';
    }

    return { icon, description };
  };

  // ==========================================================
  // JAM & TANGGAL REAL-TIME
  // ==========================================================
  startClock() {
    const updateClock = () => {
      const now = new Date();
      const formatted = now.toLocaleString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      this.clockEl.textContent = formatted;
    };

    updateClock();
    setInterval(updateClock, 1000);
  }
}

// ==========================================================
// ENTRY POINT
// ==========================================================
document.addEventListener('DOMContentLoaded', () => {
  new DashboardApp();
});
