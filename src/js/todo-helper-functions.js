const placeCursorTextEnd = (inputEl) => {
  const taskDescLength = inputEl.value.length;

  if (inputEl.setSelectionRange) {
    inputEl.focus();
    inputEl.setSelectionRange(taskDescLength, taskDescLength);
  } else if (inputEl.createTextRange) {
    const textRange = inputEl.createTextRange();
    textRange.collapse(true);
    textRange.moveEnd('character', taskDescLength);
    textRange.moveStart('character', taskDescLength);
    textRange.select();
  }
};

const hideTaskEl = (taskEl, taskEditInput, taskCheckBox) => {
  taskEditInput.classList.add('edit_active');
  taskEditInput.style.width = `${taskEl.offsetWidth}px`;
  taskEditInput.style.height = `${taskEl.offsetHeight + 1}px`;

  taskCheckBox.setAttribute('disabled', true);
  taskEl.setAttribute('draggable', false);
};

const showTaskEl = (taskEl, taskEditInput, taskCheckBox) => {
  taskCheckBox.removeAttribute('disabled');
  taskEl.setAttribute('draggable', true);
  taskEditInput.classList.remove('edit_active');
};

export const showEditField = (taskEl, taskEditInput, taskCheckBox, taskDescription, toDoList) => {
  hideTaskEl(taskEl, taskEditInput, taskCheckBox);
  placeCursorTextEnd(taskEditInput);

  taskEditInput.addEventListener('keypress', (ev) => {
    if (ev.key !== 'Enter') return;

    const editedText = taskEditInput.value;

    toDoList
      .find((task) => task.index === parseInt(taskEl.id, 10))
      .description = editedText;

    localStorage.setItem('todo', JSON.stringify(toDoList));

    taskDescription.textContent = editedText;
    showTaskEl(taskEl, taskEditInput, taskCheckBox);
  });

  document.addEventListener('click', (ev) => {
    if (ev.target.closest('li') === taskEl) return;
    taskEditInput.value = taskDescription.textContent;
    showTaskEl(taskEl, taskEditInput, taskCheckBox);
  });
};

export const toggleCheckBox = (taskEl, taskCheckBox, taskDescription, toDoList) => {
  toDoList
    .find((task) => task.index === parseInt(taskEl.id, 10))
    .isCompleted = taskCheckBox.checked;

  localStorage.setItem('todo', JSON.stringify(toDoList));
  taskDescription.classList.toggle('line_through');
};

export const appendTaskEl = (task, tasksListEl) => {
  const taskEl = `
  <li id="${task.index}" class="task" draggable="true">
    <article>
      <div class="todo__task">
        <input class="task_checkbox" type="checkbox" ${task.isCompleted && 'checked'} />
        <p class="${task.isCompleted && 'line_through'}">${task.description}</p>
        <input class="task_description" value="${task.description}" />
      </div>
      <div class="task_options">
        <i class="fa-solid fa-pen-to-square edit-option-icon"></i>
        <i class="fa-solid fa-trash-can delete-option-icon"></i>
      </div>
    </article>
  </li>
  `;
  tasksListEl.insertAdjacentHTML('beforeend', taskEl);
};

export const resetTasksIndexes = (todoTaskList) => todoTaskList
  .map((task, idx) => ({ ...task, index: idx + 1 }));

export const removeTaskEl = (taskEl, taskListEl, toDoList, callback) => {
  const filteredTaskList = toDoList.filter((task) => task.index !== parseInt(taskEl.id, 10));
  toDoList = resetTasksIndexes(filteredTaskList);

  localStorage.setItem('todo', JSON.stringify(toDoList));
  taskListEl.innerHTML = '';
  callback();
};