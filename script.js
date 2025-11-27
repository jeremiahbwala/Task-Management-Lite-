// Task Manager Application JavaScript

// Get DOM elements
const form = document.querySelector('form');
const taskInput = document.getElementById('add-task');
const taskDescription = document.getElementById('message');
const taskList = document.querySelector('.ul ul');
const filterAll = document.getElementById('filter-all');
const filterCompleted = document.getElementById('filter-completed');
const filterPending = document.getElementById('filter-pending');
const darkModeToggle = document.querySelector('.dark-mode-toggle');
const darkModeText = document.querySelector('.dark-mode-toggle h2');

// Task array to store all tasks
let tasks = [];
let currentFilter = 'all';

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  loadTasks();
  loadTheme();
  displayTasks();
  setActiveFilter('all');
});

// Add task event
form.addEventListener('submit', (e) => {
  e.preventDefault();
  addTask();
});

// Filter events
filterAll.addEventListener('click', () => {
  currentFilter = 'all';
  setActiveFilter('all');
  displayTasks();
});

filterCompleted.addEventListener('click', () => {
  currentFilter = 'completed';
  setActiveFilter('completed');
  displayTasks();
});

filterPending.addEventListener('click', () => {
  currentFilter = 'pending';
  setActiveFilter('pending');
  displayTasks();
});

// Dark mode toggle event
darkModeToggle.addEventListener('click', () => {
  toggleTheme();
});

// Add new task
function addTask() {
  const taskTitle = taskInput.value.trim();
  const taskDesc = taskDescription.value.trim();

  if (taskTitle === '') {
    alert('Please enter a task title!');
    return;
  }

  const task = {
    id: Date.now(),
    title: taskTitle,
    description: taskDesc,
    completed: false,
    createdAt: new Date().toISOString()
  };

  tasks.push(task);
  saveTasks();
  displayTasks();

  // Clear form
  taskInput.value = '';
  taskDescription.value = '';
  taskInput.focus();
}

// Display tasks based on current filter
function displayTasks() {
  taskList.innerHTML = '';

  let filteredTasks = tasks;

  if (currentFilter === 'completed') {
    filteredTasks = tasks.filter(task => task.completed);
  } else if (currentFilter === 'pending') {
    filteredTasks = tasks.filter(task => !task.completed);
  }

  if (filteredTasks.length === 0) {
    taskList.innerHTML = '<li style="text-align: center; cursor: default; border: none; background: transparent; color: var(--text-muted);">No tasks to display</li>';
    return;
  }

  filteredTasks.forEach(task => {
    const li = document.createElement('li');
    li.setAttribute('data-id', task.id);
    
    if (task.completed) {
      li.classList.add('completed');
    }

    // Create task content
    const taskContent = document.createElement('div');
    taskContent.style.cssText = 'display: flex; flex-direction: column; gap: 0.5rem;';
    
    const taskTitle = document.createElement('strong');
    taskTitle.textContent = task.title;
    taskTitle.style.cssText = 'font-size: 1.05rem; color: var(--text-primary);';
    
    taskContent.appendChild(taskTitle);

    if (task.description) {
      const taskDesc = document.createElement('p');
      taskDesc.textContent = task.description;
      taskDesc.style.cssText = 'font-size: 0.9rem; color: var(--text-secondary); margin: 0; line-height: 1.5;';
      taskContent.appendChild(taskDesc);
    }

    li.appendChild(taskContent);

    // Single click to mark complete
    li.addEventListener('click', () => {
      toggleComplete(task.id);
    });

    // Double click to delete
    li.addEventListener('dblclick', () => {
      deleteTask(task.id);
    });

    taskList.appendChild(li);
  });
}

// Toggle task completion
function toggleComplete(id) {
  const task = tasks.find(task => task.id === id);
  if (task) {
    task.completed = !task.completed;
    saveTasks();
    displayTasks();
  }
}

// Delete task
function deleteTask(id) {
  if (confirm('Are you sure you want to delete this task?')) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    displayTasks();
  }
}

// Set active filter button
function setActiveFilter(filter) {
  filterAll.classList.remove('active');
  filterCompleted.classList.remove('active');
  filterPending.classList.remove('active');

  if (filter === 'all') {
    filterAll.classList.add('active');
  } else if (filter === 'completed') {
    filterCompleted.classList.add('active');
  } else if (filter === 'pending') {
    filterPending.classList.add('active');
  }
}

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
  const storedTasks = localStorage.getItem('tasks');
  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
  }
}

// Toggle theme (dark/light mode)
function toggleTheme() {
  const body = document.body;
  const isLightMode = body.classList.contains('light-mode');

  if (isLightMode) {
    body.classList.remove('light-mode');
    darkModeText.textContent = 'Lite Mode';
    localStorage.setItem('theme', 'dark');
  } else {
    body.classList.add('light-mode');
    darkModeText.textContent = 'Dark Mode';
    localStorage.setItem('theme', 'light');
  }
}

// Load theme from localStorage
function loadTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    darkModeText.textContent = 'Dark Mode';
  } else {
    darkModeText.textContent = 'Lite Mode';
  }
}

// Optional: Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Ctrl/Cmd + Enter to submit form
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    if (taskInput === document.activeElement || taskDescription === document.activeElement) {
      form.dispatchEvent(new Event('submit'));
    }
  }
});