// Select input box and list container
let inputBox = document.getElementById("input-box");
let listContainer = document.getElementById("list-container");
let tasks = [];

// Add task
function addTask() {
    if (inputBox.value === '') {
        alert("Input a value!");
    } else {
        // Create a new list item (li)
        let li = document.createElement("li");
        li.innerHTML = inputBox.value;

        // Create delete button
        let deleteBtn = document.createElement("span");
        deleteBtn.innerHTML = "\u00D7";
        deleteBtn.classList.add("delete-btn");
        li.appendChild(deleteBtn);

        // Create edit button
        let editBtn = document.createElement("button");
        editBtn.innerHTML = "Edit";
        editBtn.classList.add("edit-btn");
        li.appendChild(editBtn);

        // Append the list item to the list container
        listContainer.appendChild(li);

        // Save task to localStorage
        tasks.push(inputBox.value);
        saveData();

        // Clear the input box
        inputBox.value = "";
    }
}

// Handle delete, edit, and checking of tasks
listContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("delete-btn")) {
        // Delete task
        e.target.parentElement.remove();
        updateTasks();
        saveData();
    } else if (e.target.classList.contains("edit-btn")) {
        // Edit task
        editTask(e.target.parentElement);
    } else if (e.target.tagName === "LI") {
        // Toggle checked class
        e.target.classList.toggle("checked");

        // Reorder tasks: checked items go to the bottom
        reorderTasks();

        saveData();
    }
}, false);

// Edit task
function editTask(taskElement) {
    let currentTask = taskElement;
    let input = document.createElement("input");
    input.type = "text";
    input.value = currentTask.innerText.replace("Edit", "").replace("\u00D7", "").trim();

    currentTask.innerHTML = '';  // Clear the task content
    currentTask.appendChild(input);

    // Save edited task on blur or Enter key press
    input.addEventListener("blur", function () {
        saveEditedTask(currentTask, input.value);
    });
    input.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            saveEditedTask(currentTask, input.value);
        }
    });
}

// Save edited task
function saveEditedTask(taskElement, newValue) {
    if (newValue.trim() === '') {
        alert("Task cannot be empty");
    } else {
        taskElement.innerHTML = newValue;

        // Create delete button
        let deleteBtn = document.createElement("span");
        deleteBtn.innerHTML = "\u00D7";
        deleteBtn.classList.add("delete-btn");
        taskElement.appendChild(deleteBtn);

        // Create edit button
        let editBtn = document.createElement("button");
        editBtn.innerHTML = "Edit";
        editBtn.classList.add("edit-btn");
        taskElement.appendChild(editBtn);

        // Update tasks array and save to localStorage
        updateTasks();
        saveData();
    }
}

// Reorder tasks so that checked items go to the bottom
function reorderTasks() {
    let uncheckedTasks = [];
    let checkedTasks = [];

    // Loop through all list items and separate checked/unchecked tasks
    Array.from(listContainer.children).forEach(task => {
        if (task.classList.contains("checked")) {
            checkedTasks.push(task);  // Collect checked items
        } else {
            uncheckedTasks.push(task);  // Collect unchecked items
        }
    });

    // Clear the list container
    listContainer.innerHTML = '';

    // Append unchecked tasks first
    uncheckedTasks.forEach(task => listContainer.appendChild(task));

    // Then append checked tasks
    checkedTasks.forEach(task => listContainer.appendChild(task));
}

// Update the tasks array based on the current list items
function updateTasks() {
    tasks = [];
    let taskElements = listContainer.children;
    for (let i = 0; i < taskElements.length; i++) {
        tasks.push(taskElements[i].innerText.replace("Edit", "").replace("\u00D7", "").trim());
    }
}

// Save tasks to localStorage
function saveData() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks from localStorage on page load
function loadData() {
    let storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        tasks.forEach(taskText => {
            let li = document.createElement("li");
            li.innerHTML = taskText;

            // Create delete button
            let deleteBtn = document.createElement("span");
            deleteBtn.innerHTML = "\u00D7";
            deleteBtn.classList.add("delete-btn");
            li.appendChild(deleteBtn);

            // Create edit button
            let editBtn = document.createElement("button");
            editBtn.innerHTML = "Edit";
            editBtn.classList.add("edit-btn");
            li.appendChild(editBtn);

            // Append list item to list container
            listContainer.appendChild(li);
        });
    }
}

// Call loadData on page load
window.onload = loadData;