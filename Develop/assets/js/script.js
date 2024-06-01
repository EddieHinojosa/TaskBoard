// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;



// Todo: create a function to generate a unique task id
function generateTaskId() {
    let id = nextId;
    // Increment nextId and save to localStorage
    if (!nextId || isNaN(nextId)) {
        nextId = 1;
    }
    nextId++;
    localStorage.setItem("nextId", JSON.stringify(nextId));
    return id;
};




// Todo: create a function to create a task card
function createTaskCard(task) {
    let now = new Date();
    let deadlineDate = new Date(task.deadline);
    let cardColorClass = "";

    // deadline parameters
    if (deadlineDate < now) {
        cardColorClass = "bg-danger"; // Overdue: red
    } else if (deadlineDate - now <= 48 * 60 * 60 * 1000) { // 2 days in milliseconds
        cardColorClass = "bg-warning"; // Nearing deadline: yellow
    }
// task card html 
    let taskCardHTML = `
    <div class="card task-card mb-3 ${cardColorClass}" id="task-${task.id}">
        <div class="card-body">
            <h5 class="card-title">${task.title}</h5>
            <p class="card-text">${task.description}</p>
            <p class="card-text">Deadline: ${task.deadline}</p>
            <button class="btn btn-danger delete-task" data-task-id="${task.id}">Delete</button>
        </div>
    </div>
    `;
    return taskCardHTML;
}    



// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    //clear existing task cards
    $(".lane .task-card").remove();
    //iterate through each task and create a task card
    if (taskList.length > 0) {
        taskList.forEach(task => {
            let taskCard = createTaskCard(task);
            $(`#${task.status}-cards`).append(taskCard);
        });
    }
    // Save task list to localStorage
    localStorage.setItem("tasks", JSON.stringify(taskList));

    // Draggable task cards
    $(".task-card").draggable({
        containment: ".container", 
        revert: true,
        stack: ".task-card",
        scroll: true,
    });
    console.log("Rendered task list:", taskList);
    
}


// Todo: create a function to handle adding a new task
function handleAddTask(event) {
    event.preventDefault();
    let title = $("#taskTitle").val();
    let deadline = $("#taskDeadline").val();
    let description = $("#taskDescription").val();
    let taskId = generateTaskId();
    let newTask = {
        id: taskId,
        title: title,
        description: description,
        status: "to-do",
        deadline: deadline,
    };    
    taskList.push(newTask);
    renderTaskList();
    $("#taskTitle").val("");
    $("#taskDeadline").val("");
    $("#taskDescription").val("");
    $("#formModal").modal("hide");
}
// Todo: create a function to handle deleting a task


function handleDeleteTask(event) {
    event.preventDefault();
    // Get task ID from data attribute of the delete button
    let taskId = $(event.target).data("task-id");
    console.log("Deleting Task ID:", taskId);
    
    // Find index of task in taskList array
    let taskIndex = taskList.findIndex(task => task.id === taskId);
    console.log("Task Index:", taskIndex);
    
    // If task is found, remove it from taskList array
    if (taskIndex !== -1) {
        taskList.splice(taskIndex, 1);
        console.log("Task List After Deletion:", taskList);
        
        // Re-render task list
        renderTaskList();
        
        // Update tasks in local storage
        localStorage.setItem("tasks", JSON.stringify(taskList));
        
        console.log("Task deleted:", taskId);
    } else {
        console.log("Task not found:", taskId);
    }
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    // Get the id of the dropped task
    let taskId = ui.draggable.attr("id").split("-")[1];
    
    // Get the status of the lane where the task was dropped
    let newStatus = $(this).attr("id").replace("-cards", "");
    
    // Find the task in the taskList array
    let taskIndex = taskList.findIndex(task => task.id === parseInt(taskId));
    
    // If the task is found, update its status
    if (taskIndex !== -1) {
        taskList[taskIndex].status = newStatus;
        
        // Re-render the task list to reflect the updated status
        renderTaskList();
        
        console.log(`Task ${taskId} moved to ${newStatus}`);
    } else {
        console.log(`Task ${taskId} not found`);
    }
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function() {
    renderTaskList();
    $("#taskForm").on("submit", handleAddTask);    
    $(document).on("click", ".delete-task", handleDeleteTask);
// make task cards draggable    
    $(".task-card").draggable({
        containment: ".container", 
        revert: true,
        stack: ".task-card",
        scroll: true,
    });
// make lanes droppable    
    $(".lane").droppable({
        accept: ".task-card",
        drop: handleDrop
    });
    
});