// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

const taskForm = $("#task-form");
const taskDueDate = $("#task-due-date");
const taskTitle = $("#task-title");
const taskDescription = $("#task-description");



// Todo: create a function to generate a unique task id
function generateTaskId() {
    const id = nextId;
    nextId++;
    localStorage.setItem("nextId", JSON.stringify(nextId));
    return id;
}

//  function to create a task card
function createTaskCard(task) {
    const card = $("<div>").addClass("card").attr("id", task.id);
    const cardBody = $("<div>").addClass("card-body");
    const cardTitle = $("<h5>").addClass("card-title").text(task.title);
    const cardText = $("<p>").addClass("card-text").text(task.description);
    const cardDueDate = $("<p>").addClass("card-text").text(task.dueDate);
    const deleteButton = $("<button>").addClass("btn btn-danger").text("delete");
    deleteButton.click(handleDeleteTask);
    // Add the card elements to the card body
    cardBody.append(cardTitle, cardText, cardDueDate, deleteButton);
    card.append(cardBody);
    return card;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() { 
    taskList.forEach(task => {
        const card = createTaskCard(task);
        card.draggable({
            revert: "invalid",
            helper: "clone",
            cursor: "move"
        });
        $(`#${task.status}`).append(card);
    });

}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();
    const task = {
        id: generateTaskId(),
        title: taskTitle.val(),
        description: taskDescription.val(),
        dueDate: taskDueDate.val(),
        status: "to-do"
    };
    taskList.push(task);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
    taskForm.trigger("reset");
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(){
    const taskId = $(this).closest(".card").attr("id");
    taskList = taskList.filter(task => task.id !== parseInt(taskId));
    localStorage.setItem("tasks", JSON.stringify(taskList));
    $(this).closest(".card").remove();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const taskId = ui.draggable.attr("id");
    const newStatus = $(this).attr("id");
    const task = taskList.find(task => task.id === parseInt(taskId));
    task.status = newStatus;
    localStorage.setItem("tasks", JSON.stringify(taskList));
    ui.draggable.detach().appendTo($(this));
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(() => {
    if (!taskList) {
        taskList = [];
        localStorage.setItem("tasks", JSON.stringify(taskList));
    }
    if (!nextId) {
        nextId = 1;
        localStorage.setItem("nextId", JSON.stringify(nextId));
    }
    renderTaskList();
    taskForm.submit(handleAddTask);
    $(".status").droppable({
        drop: handleDrop
    });
    taskDueDate.datepicker();
});

