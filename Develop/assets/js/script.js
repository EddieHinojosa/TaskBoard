// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;



// Function to generate a unique task id
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




// Function to create a task card
function createTaskCard(task) {
    let cardColorClass = "";
    let deadline = new Date(task.deadline);
    let today = new Date();
    let twoDaysFromNow = new Date();
    twoDaysFromNow.setDate(today.getDate() + 2);
    //if past deadline, card is red
    if (deadline < today) {
        cardColorClass = "bg-danger";
    } 
    //if deadline is within 2 days, card is yellow
    else if (deadline < twoDaysFromNow) {
        cardColorClass = "bg-warning";
    } 
    //if deadline is in the future, card is white/not assigned a color
    else {
        cardColorClass = "";
    }






// task card is added to the task list with HTML formatting 
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



// Function to render the task list and make cards draggable
function renderTaskList() {
    $(".lane .task-card").remove();
    if (taskList.length > 0) {
        taskList.forEach(task => {
            let taskCard = createTaskCard(task);
            $(`#${task.status}-cards`).append(taskCard);
        });
    }
    // Save task to localStorage
    localStorage.setItem("tasks", JSON.stringify(taskList));


    // Draggable task cards
    $(".task-card").draggable({
        //this will keep the task-cards within the container rather than being shown outside of the container
        zIndex: 100,
    });
}


// Function to handle adding a new task
function handleAddTask(event) {
    event.preventDefault();
    let taskId = generateTaskId();
    let newTask = {
        id: taskId,
        title: $("#taskTitle").val(),
        description: $("#taskDescription").val(),
        status: "to-do",
        deadline: $("#taskDeadline").val(),
    }; 
    //if any of the fields are empty, an alert will pop up   
    if (!newTask.title || !newTask.description || !newTask.deadline) {
        alert("Missing information, please fill out all required fields.");
        return;
    }

    taskList.push(newTask);
    renderTaskList();
    $("#taskTitle, #taskDeadline, #taskDescription").val("");
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