
// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));
const todoCardsEl = $('#todo-cards');

// Todo: create a function to generate a unique task id
function generateTaskId() {
    if(nextId == null){
      nextId = 1}
      else {
        nextId++;
      }
      localStorage.setItem('nextId',JSON.stringify(nextId));
      return nextId

    }



// Todo: create a function to create a task card
function createTaskCard(task) {
    const taskCard = $('<div>')
    .addClass('card task-card draggable my-3')
    .attr('data-task-id', task.id);
  const cardHeader = $('<div>').addClass('card-header h4').text(task.title);
  const cardBody = $('<div>').addClass('card-body');
  const cardDescription = $('<p>').addClass('card-text').text(task.description);
  const cardDueDate = $('<p>').addClass('card-text').text(task.dueDate);
  const cardDeleteBtn = $('<button>')
    .addClass('btn btn-danger delete')
    .text('Delete')
    .attr('data-task-id', task.id);
  cardDeleteBtn.on('click', handleDeleteTask);

  if (task.dueDate && task.status !== 'done') {
    const now = dayjs();
    const taskDueDate = dayjs(task.dueDate, 'DD/MM/YYYY');

    // ? If the task is due today, make the card yellow. If it is overdue, make it red.
    if (now.isSame(taskDueDate, 'day')) {
      taskCard.addClass('bg-warning text-white');
    } else if (now.isAfter(taskDueDate)) {
      taskCard.addClass('bg-danger text-white');
      cardDeleteBtn.addClass('border-light');
    }
  }

  // ? Gather all the elements created above and append them to the correct elements.
  cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
  taskCard.append(cardHeader, cardBody);

  taskCard.appendTo(todoCardsEl);
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {

  // we should GRAB or CURRENT DATASET 
  const currentTasks = JSON.parse(localStorage.getItem('tasks'));

  // HOW would we differentiate one task from another(?)  --> which tasks belong in which column(?)
  for(let i = 0; i < currentTasks.length; i++) {
    console.log("Current Task: ", currentTasks[i])
    if(currentTasks[i].status == 'todo') {
      // create a new card in the TODO column
      createTaskCard(currentTasks[i])

    } else if(currentTasks[i].status == 'inprogress') {
      // create a new card in the IN PROGRESS column 
    } else if(currentTasks[i].status == 'done') {
      // create a new card in the DONE column
    }
  }

}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
  //console.log("Form Submitted...");

  const title = $('#task-title').val();
  const description = $('#task-description').val();
  const date = $('#datepicker').val();

 // console.log("User data: ", title, description, date);
 /* if(!taskList){ 
    tasklist = [];
  }
  */
  let savedData = JSON.parse(localStorage.getItem('tasks'));
  if(!savedData) {
    savedData = [];
  }

 // console.log("task list: ", savedData);
  const task = {
    id: generateTaskId(),
    title: title,
    description: description,
    dueDate: date,
    status: 'todo'
  }
  console.log("new Task: ", task)
  //taskList.push(task);
  savedData.push(task);
  localStorage.setItem('tasks', JSON.stringify(savedData));
  $('#formModal').modal('hide');
  renderTaskList();

  // ? Clear the form inputs
  titleInputEl.val('');
  descriptionInputEl.val('');
  dateInputEl.val('');
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
  todoCardsEl.on('click', '.btn-delete-task', handleDeletetask);
}


// Todo: create a function to handle dropping a task into a new status lane
  function handleDrop(event, ui) {
    // ? Read tasks from localStorage
    const tasks = readtasksFromStorage();
  
    // ? Get the task id from the event
    const taskId = ui.draggable[0].dataset.taskId;
  
    // ? Get the id of the lane that the card was dropped into
    const newStatus = event.target.id;
  
    for (let task of tasks) {
      // ? Find the task card by the `id` and update the task status.
      if (task.id === taskId) {
        task.status = newStatus;
      }
    }
    // ? Save the updated tasks array to localStorage (overwritting the previous one) and render the new task data to the screen.
    localStorage.setItem('tasks', JSON.stringify(tasks));
    printtaskData();
  }



// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
  

  // Datepicker widget
$(function () {
  $('#datepicker').datepicker({
    changeMonth: true,
    changeYear: true,
  });
});
// ? Make lanes droppable
$('.lane').droppable({
  accept: '.draggable',
  drop: handleDrop,
});

  $('#add-task-btn').on('click', handleAddTask);

});
