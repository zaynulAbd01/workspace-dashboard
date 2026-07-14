// Data stores for task items and budget balance.
let taskList = [];
let balance = 45000;

// DOM element references.
const taskInput = document.getElementById('task-input');
const prioritySelect = document.getElementById('priority');
const addTaskBtn = document.getElementById('add-task-btn');
const taskListDiv = document.getElementById('task-list');
const clearLowBtn = document.getElementById('clear-low-btn');
const balanceDisplay = document.getElementById('balance');
const expenseInput = document.getElementById('expense-input');
const deductBtn = document.getElementById('deduct-btn');
const budgetContainer = document.getElementById('budget-container');

// Add a new task when the Add Task button is clicked.
addTaskBtn.addEventListener('click', () => {
  const title = taskInput.value.trim();
  const priority = prioritySelect.value;

  if (!title) {
    alert('Please enter a task before adding.');
    taskInput.focus();
    return;
  }

  const task = {
    id: Date.now(),
    title,
    priority,
  };

  taskList.push(task);
  taskInput.value = '';
  renderTasks();
});

// Render tasks inside the task list container.
function renderTasks() {
  taskListDiv.innerHTML = '';

  if (taskList.length === 0) {
    taskListDiv.innerHTML = '<p class="empty-state">No tasks yet. Add one to get started.</p>';
    return;
  }

  taskList.forEach((task) => {
    const taskItem = document.createElement('div');
    taskItem.className = `task-item ${getPriorityClass(task.priority)}`;

    const taskInfo = document.createElement('div');
    taskInfo.className = 'task-info';
    taskInfo.innerHTML = `
      <span class="task-title">${escapeHtml(task.title)} <span class="task-priority">[${task.priority}]</span></span>
    `;

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-btn';
    deleteButton.type = 'button';
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => deleteTask(task.id));

    taskItem.appendChild(taskInfo);
    taskItem.appendChild(deleteButton);
    taskListDiv.appendChild(taskItem);
  });
}

// Remove a task by its ID.
function deleteTask(id) {
  taskList = taskList.filter((task) => task.id !== id);
  renderTasks();
}

// Clear all tasks with Low priority.
clearLowBtn.addEventListener('click', () => {
  taskList = taskList.filter((task) => task.priority !== 'Low');
  renderTasks();
});

// Update the balance display and budget styling.
function renderBalance() {
  balanceDisplay.textContent = `₦${balance.toLocaleString()}`;

  if (balance < 0) {
    balanceDisplay.classList.add('negative-balance');
    budgetContainer.style.border = '2px solid #d12f3f';
  } else {
    balanceDisplay.classList.remove('negative-balance');
    budgetContainer.style.border = '1px solid rgba(0, 0, 0, 0.06)';
  }
}

// Deduct expense amount from the balance.
deductBtn.addEventListener('click', () => {
  const expense = Number(expenseInput.value);

  if (!expense || expense <= 0) {
    alert('Please enter a valid expense amount greater than zero.');
    expenseInput.focus();
    return;
  }

  balance -= expense;
  expenseInput.value = '';
  renderBalance();
});

// Escape user text to prevent HTML injection.
function escapeHtml(text) {
  const textNode = document.createTextNode(text);
  const div = document.createElement('div');
  div.appendChild(textNode);
  return div.innerHTML;
}

// Return CSS class for a priority label.
function getPriorityClass(priority) {
  if (priority === 'High') return 'priority-high';
  if (priority === 'Medium') return 'priority-medium';
  return 'priority-low';
}

// Initial render on page load.
renderTasks();
renderBalance();
