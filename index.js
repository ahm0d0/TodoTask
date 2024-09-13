// The first Steps in my Project
// 1- get button add Task
// 2- button onclink create object {id ,value }
// 3- get the value from input
// 4- create element li ,span ,button
// 5- ul append li

// Get references to DOM elements
let addTask = document.querySelector("#add-task");
let TaskText = document.querySelector("#new-task");
let TaskParentList = document.querySelector("#task-list");
let successfulyMassage = document.querySelector("#add-message");
let EditMassage = document.querySelector("#edit-message");
let DaletMassage = document.querySelector("#delete-message");
let EmptyMassage = document.querySelector("#empty-message");

// message Function
function message(params) {
  if (params == successfulyMassage) {
    successfulyMassage.style.opacity = "1";
    successfulyMassage.style.background = "green";
    successfulyMassage.style.borderRadius = "50px";
    successfulyMassage.style.zIndex = "2";
    successfulyMassage.style.color = "white";
    setInterval(() => {
      successfulyMassage.style.opacity = "0";
    }, 4000);
  }
  if (params == EditMassage) {
    EditMassage.style.opacity = "1";
    EditMassage.style.background = "blue";
    EditMassage.style.borderRadius = "50px";
    EditMassage.style.zIndex = "3";
    EditMassage.style.color = "white";
    setInterval(() => {
      EditMassage.style.opacity = "0";
    }, 4000);
  }
  if (params == DaletMassage) {
    DaletMassage.style.opacity = "1";
    DaletMassage.style.background = "red";
    DaletMassage.style.borderRadius = "50px";
    DaletMassage.style.zIndex = "4";
    DaletMassage.style.color = "white";
    setInterval(() => {
      DaletMassage.style.opacity = "0";
    }, 5000);
  }
  if (params == EmptyMassage) {
    EmptyMassage.style.opacity = "1";
    EmptyMassage.style.background = "black";
    EmptyMassage.style.borderRadius = "50px";
    EmptyMassage.style.color = "white";
    setInterval(() => {
      EmptyMassage.style.opacity = "0";
    }, 5000);
  }
}
// Initialize tasks from localStorage when the page loads
document.addEventListener("DOMContentLoaded", () => {
  addTasksFromStorageToPage();
  markTasks();
  getEditBtn();
  GetDeletButton();
});
// Function to add a new task
function AddNewTask() {
  let TaskValue = {
    id: Date.now(),
    value: TaskText.value.trim(),
    mark: false,
  };

  if (TaskValue.value === "") {
    message(EmptyMassage);
  } else {
    CreateElementTask(TaskValue.id, TaskValue.value, TaskValue.mark);
    addTasksToLocalStorage(TaskValue.id, TaskValue.value, TaskValue.mark);
    TaskText.value = ""; // Clear the input field
  }
}

// Function to create and add a task element to the page
function CreateElementTask(id, value, mark) {
  let element = `
    <li id="${id}" data-mark="${mark}" class="task-item">
      <input data-id="${id}" readonly class="task-text" value="${value}">
      <div class="task-actions">
        <button class="edit-btn" id="${id}">Edit</button>
        <button class="delete-btn" id="${id}">Delete</button>
      </div>
    </li>`;
  addElementToPage(element);
}

// Function to add a task element to the page
function addElementToPage(element) {
  TaskParentList.innerHTML += element;
  // Use timeout for animation
  setTimeout(() => {
    document.querySelectorAll("li").forEach((task) => {
      task.classList.add("animate");
    });
  }, 0);
  markTasks();
  // Ensure event listeners are updated after adding elements
  getEditBtn();
  GetDeletButton();
  message(successfulyMassage);
}

// Delet Steps
// 1- get all delete buttons
// 2- forEach all buttons to get the id for every one
// 3- filter to remove the li with the same id == button id
// Function to get all delete buttons and add event listeners
function GetDeletButton() {
  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", () => {
      DeletTask(button.id);
    });
  });
}

// Function to delete a task
function DeletTask(id) {
  let taskToRemove = document.getElementById(id);
  if (taskToRemove) {
    taskToRemove.classList.remove("animate");
    message(DaletMassage);
    setTimeout(() => {
      taskToRemove.remove();
      removeTaskFromLocalStorage(id); // Remove from localStorage as well
    }, 700); // Match the duration of the CSS transition
  }
}

// Function to remove a task from localStorage
function removeTaskFromLocalStorage(id) {
  let tasks = JSON.parse(window.localStorage.getItem("tasks")) || [];
  tasks = tasks.filter((task) => task.id != id);
  window.localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Function to add a task to localStorage
function addTasksToLocalStorage(id, value, mark) {
  let tasks = JSON.parse(window.localStorage.getItem("tasks")) || [];
  tasks.push({ id, value, mark });
  window.localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Function to add tasks from localStorage to the page
function addTasksFromStorageToPage() {
  let tasks = JSON.parse(window.localStorage.getItem("tasks")) || [];
  tasks.forEach((task) => {
    CreateElementTask(task.id, task.value, task.mark);
  });
  getEditBtn();
  markTasks();
}

// Edite Task button
// Steps
// 1 get the btn and the input
// 2 on click edit btn i will change the btn to be save btn
// 3 on click edit btn remove readonly attribute
// 4 on click save btn save the new value

// Function to handle edit button
function getEditBtn() {
  document.querySelectorAll(".edit-btn").forEach((button) => {
    button.addEventListener("click", () => {
      let isEditing = button.classList.contains("save-btn");
      // Get all task inputs
      const allTaskInputs = document.querySelectorAll(".task-text");

      // Find the input with the matching data-id
      const taskInput = Array.from(allTaskInputs).filter(
        (input) => input.dataset.id === button.id
      )[0];

      if (isEditing) {
        button.classList.remove("save-btn");
        message(EditMassage);
        button.innerHTML = "Edit";
        taskInput.setAttribute("readonly", true);
        taskInput.classList.remove("editable");
        // Save changes to localStorage
        updateTaskInLocalStorage(button.id, taskInput.value);
      } else {
        button.classList.add("save-btn");
        button.innerHTML = "Save";
        taskInput.removeAttribute("readonly");
        taskInput.classList.add("editable");
      }
    });
  });
}

// Function to update task in localStorage
function updateTaskInLocalStorage(id, newValue) {
  let tasks = JSON.parse(window.localStorage.getItem("tasks")) || [];
  tasks = tasks.map((task) =>
    task.id === parseInt(id) ? { ...task, value: newValue } : task
  );
  window.localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Function to mark tasks as completed
function markTasks() {
  document.querySelectorAll("li").forEach((task) => {
    task.addEventListener("click", () => {
      let mark = task.dataset.mark === "true";
      mark = !mark;
      task.dataset.mark = mark;
      if (mark) {
        task.style.background = "#d4edda";
        task.style.color = "white";
      } else {
        task.style.background = "#f2f2f2";
        task.style.color = "black";
      }
    });
  });
}

// Add event listener to the add task button
addTask.addEventListener("click", AddNewTask);
