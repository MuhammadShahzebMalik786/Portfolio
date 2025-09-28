// Load saved data when popup opens
document.addEventListener('DOMContentLoaded', function() {
    loadNotes();
    loadTasks();
    
    // Notes functionality
    const notesTextarea = document.getElementById('notes');
    notesTextarea.addEventListener('input', saveNotes);
    
    // Task functionality
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTask');
    
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });
});

// Notes functions
function saveNotes() {
    const notes = document.getElementById('notes').value;
    chrome.storage.local.set({ 'productivity_notes': notes });
}

function loadNotes() {
    chrome.storage.local.get(['productivity_notes'], function(result) {
        if (result.productivity_notes) {
            document.getElementById('notes').value = result.productivity_notes;
        }
    });
}

// Task functions
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();
    
    if (taskText) {
        chrome.storage.local.get(['productivity_tasks'], function(result) {
            let tasks = result.productivity_tasks || [];
            tasks.push({
                id: Date.now(),
                text: taskText,
                completed: false
            });
            
            chrome.storage.local.set({ 'productivity_tasks': tasks }, function() {
                taskInput.value = '';
                loadTasks();
            });
        });
    }
}

function deleteTask(taskId) {
    chrome.storage.local.get(['productivity_tasks'], function(result) {
        let tasks = result.productivity_tasks || [];
        tasks = tasks.filter(task => task.id !== taskId);
        
        chrome.storage.local.set({ 'productivity_tasks': tasks }, function() {
            loadTasks();
        });
    });
}

function loadTasks() {
    chrome.storage.local.get(['productivity_tasks'], function(result) {
        const tasks = result.productivity_tasks || [];
        const taskList = document.getElementById('taskList');
        
        taskList.innerHTML = '';
        
        tasks.forEach(task => {
            const taskItem = document.createElement('div');
            taskItem.className = 'task-item';
            taskItem.innerHTML = `
                <span>${task.text}</span>
                <button class="delete-btn" onclick="deleteTask(${task.id})">×</button>
            `;
            taskList.appendChild(taskItem);
        });
    });
}

// Make deleteTask available globally
window.deleteTask = deleteTask;
