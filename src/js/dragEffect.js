import { resetTasksIndexes } from './todo-helper-functions.js';

let dragStartTaskEl;
let todoListItems;

const swapTaskEl = (dragStartTaskEl, dragEndTaskEl, callback) => {
  const listContainer = document.querySelectorAll('ul li');
  const taskListEl = document.getElementById('tasksList');
  let taskOneIndex;
  let taskTwoIndex;

  listContainer.forEach((task, index) => {
    if (task === dragStartTaskEl) {
      taskOneIndex = index;
    }
    if (task === dragEndTaskEl) {
      taskTwoIndex = index;
    }
  });

  if (taskOneIndex > taskTwoIndex) {
    listContainer.item(taskTwoIndex).insertAdjacentElement('beforebegin', dragStartTaskEl);
    listContainer.item(taskOneIndex).insertAdjacentElement('afterend', dragEndTaskEl);
  } else {
    listContainer.item(taskTwoIndex).insertAdjacentElement('afterend', dragStartTaskEl);
    listContainer.item(taskOneIndex).insertAdjacentElement('beforebegin', dragEndTaskEl);
  }

  const tmpItem = todoListItems.splice(taskOneIndex, 1)[0];
  todoListItems.splice(taskTwoIndex, 0, tmpItem);

  todoListItems = resetTasksIndexes(todoListItems);

  localStorage.setItem('todo', JSON.stringify(todoListItems));
  taskListEl.innerHTML = '';
  callback();
};

const dragStart = (ev) => {
  dragStartTaskEl = ev.target.closest('li');
};

const dragOver = (ev) => {
  ev.preventDefault();
};

const drop = (ev, callback) => {
  const dragEndTaskEl = ev.target.closest('li');
  swapTaskEl(dragStartTaskEl, dragEndTaskEl, callback);
  ev.target.closest('article').classList.remove('drag_over');
};

const dragEnter = (ev) => {
  ev.target.closest('article').classList.add('drag_over');
};

const dragLeave = (ev) => {
  ev.target.closest('article').classList.remove('drag_over');
};

const addDraggableListener = (draggableItem, listItems, callback) => {
  draggableItem.addEventListener('dragstart', dragStart);
  draggableItem.addEventListener('dragover', dragOver);
  draggableItem.addEventListener('drop', (ev) => {
    drop(ev, callback);
  });
  draggableItem.addEventListener('dragenter', dragEnter);
  draggableItem.addEventListener('dragleave', dragLeave);

  todoListItems = listItems;
};

export default addDraggableListener;