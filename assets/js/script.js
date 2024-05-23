// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId"));
const todoCardsEl = $("#todo-cards");


// Todo: create a function to generate a unique task id
function generateTaskId() {
  if (nextId == null) {
    nextId = 1;
  } else {
    nextId++;
  }
  // localStorage.setItem("nextId", JSON.stringify(nextId));
  return nextId;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
  const taskCard = $("<div>")
    .addClass("card task-card draggable my-3")
    .attr("data-task-id", task.id);
  const cardHeader = $("<div>").addClass("card-header h4").text(task.title);
  const cardBody = $("<div>").addClass("card-body");
  const cardDescription = $("<p>").addClass("card-text").text(task.description);
  const cardDueDate = $("<p>").addClass("card-text").text(task.dueDate);
  const cardDeleteBtn = $("<button>")
    .addClass("btn btn-danger delete")
    .text("Delete")
    .attr("data-task-id", task.id);
  cardDeleteBtn.on("click", handleDeleteTask);

  if (task.dueDate && task.status !== "done") {
    const now = dayjs();
    const taskDueDate = dayjs(task.dueDate, "DD/MM/YYYY");

    // ? If the task is due today, make the card yellow. If it is overdue, make it red.
    if (now.isSame(taskDueDate, "day")) {
      taskCard.addClass("bg-warning text-white");
    } else if (now.isAfter(taskDueDate)) {
      taskCard.addClass("bg-danger text-white");
      cardDeleteBtn.addClass("border-light");
    }
  }

  // ? Gather all the elements created above and append them to the correct elements.
  cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
  taskCard.append(cardHeader, cardBody);

  taskCard.appendTo(todoCardsEl);

  return taskCard;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
 
    // ? Empty existing project cards out of the lanes
    const todoList = $('#todo-cards');
    todoList.empty();
  
    const inProgressList = $('#in-progress-cards');
    inProgressList.empty();
  
    const doneList = $('#done-cards');
    doneList.empty();

  // HOW would we differentiate one task from another(?)  --> which tasks belong in which column(?)
  for (let i = 0; i < taskList.length; i++) {
    // console.log("Current Task: ", taskList[i]);
    if (taskList[i].status == "to-do") {
      todoList.append(createTaskCard(taskList[i]));
      // create a new card in the TODO column
    } else if (taskList[i].status == "in-progress") {
      inProgressList.append(createTaskCard(taskList[i]));
      // create a new card in the IN PROGRESS column
    } else if (taskList[i].status == "done") {
      doneList.append(createTaskCard(taskList[i]));
      // create a new card in the DONE column
    }
  }
  // ? Use JQuery UI to make task cards draggable
  $('.draggable').draggable({
    opacity: 0.7,
    zIndex: 100,
    // ? This is the function that creates the clone of the card that is dragged. This is purely visual and does not affect the data.
    helper: function (e) {
      // ? Check if the target of the drag event is the card itself or a child element. If it is the card itself, clone it, otherwise find the parent card  that is draggable and clone that.
      const original = $(e.target).hasClass('ui-draggable')
        ? $(e.target)
        : $(e.target).closest('.ui-draggable');
      // ? Return the clone with the width set to the width of the original card. This is so the clone does not take up the entire width of the lane. This is to also fix a visual bug where the card shrinks as it's dragged to the right.
      return original.clone().css({
        width: original.outerWidth(),
      });
    },
  });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
  //console.log("Form Submitted...");
  const title = $("#task-title").val();
  const description = $("#task-description").val();
  const date = $("#datepicker").val();


  // console.log("task list: ", savedData);
  const task = {
    id: generateTaskId(),
    title: title,
    description: description,
    dueDate: date,
    status: "to-do",
  };
  console.log("new Task: ", task);
  taskList.push(task);
  localStorage.setItem("tasks", JSON.stringify(taskList));
  $("#formModal").modal("hide");
  renderTaskList();

  // ? Clear the form inputs
  $("#task-title").val('');
  $("#task-description").val('');
  $("#datepicker").val('');

}

// Todo: create a function to handle deleting a task
function handleDeleteTask() {
  const taskId = $(this).attr('data-task-id');
  
  
  // ? Remove task from the array. There is a method called `filter()` for this that is better suited which we will go over in a later activity. For now, we will use a `forEach()` loop to remove the task.
  taskList.forEach((task) => {
    if (task.id === +taskId) {
      console.log("test")
      taskList.splice(taskList.indexOf(task), 1);
    }
  });

localStorage.setItem("tasks",JSON.stringify(taskList))
  // ? Here we use our other function to print tasks back to the screen
  renderTaskList();
}


// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  

  // ? Get the task id from the event
  const taskId = ui.draggable[0].dataset.taskId;

  // ? Get the id of the lane that the card was dropped into
  const newStatus = event.target.id;
  console.log(newStatus)
  for (let task of taskList) {
    // ? Find the task card by the `id` and update the task status.
    if (task.id === +taskId) {
      task.status = newStatus;
    }
  }
  // ? Save the updated tasks array to localStorage (overwritting the previous one) and render the new task data to the screen.
  localStorage.setItem("tasks", JSON.stringify(taskList));

  renderTaskList();
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {

  renderTaskList();

  // Datepicker widget
  $(function () {
    $("#datepicker").datepicker({
      changeMonth: true,
      changeYear: true,
    });
  });
  // ? Make lanes droppable
  $(".lane").droppable({
    accept: ".draggable",
    drop: handleDrop,
  });

  $("#add-task-btn").on("click", handleAddTask);
});
