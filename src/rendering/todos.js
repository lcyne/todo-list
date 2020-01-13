import { formatISO } from 'date-fns';
import { formatTitle } from './common';
import { classes } from '../selectors';
import { deleteTodo } from '../editing/display';
import { getTodoElement, getProjectElement } from '../editing/data';
import { Todo } from '../models/todo';

function formatTodos(todos) {
  const todoList = makeTodoListContainer();
  todos.forEach(item => {
    todoList.appendChild(formatSingleTodo(item));
  });
  return todoList;
}

function makeTodoListContainer() {
  let todoContainer = document.createElement('ul');
  todoContainer.classList.add(classes.todoList);
  return todoContainer;
}

function formatSingleTodo(todo) {
  const output = makeTodoItem();
  for (let key in todo) {
    switch (key) {
      case 'title':
        output.appendChild(formatTitle(todo[key]));
        break;
      case 'description':
        output.appendChild(formatDescription(todo[key]));
        break;
      case 'deadline':
        output.appendChild(formatDate(todo[key]));
        break;
      case 'priority':
        output.appendChild(formatPriority(todo[key]));
        setPriorityColor(todo[key], output);
        break;
      default:
        console.warn(`Unexpected key ${key} while formatting todo: skipping`);
        break;
    }
  }
  addDeleteButton(output);
  return output;
}

function makeTodoItem() {
  const todo = document.createElement('li');
  todo.classList.add(classes.todo);
  return todo;
}

function formatDescription(description) {
  const element = formatTitle(description);
  element.classList.remove(classes.title);
  element.classList.add(classes.description);
  return element;
}

function formatDate(date) {
  const element = document.createElement('p');
  element.classList.add(classes.deadline, classes.editable);
  element.textContent = formatISO(new Date(date), { representation: 'date'});
  return element;
}

function formatPriority(priority) {
  const element = formatTitle(priority.level);
  element.classList.remove(classes.title, classes.editable);
  element.classList.add(classes.priority);
  return element;
}

function setPriorityColor(priority, element) {
  element.style.outline = `1px solid ${priority.color}`;
}

function addDeleteButton(element) {
  const button = document.createElement('button');
  button.textContent = 'Delete this todo';
  button.addEventListener('click', deleteTodo);
  element.appendChild(button);
}

function deleteTodoFromDOM(element) {
  const todo = getTodoElement(element);
  return todo.parentNode.removeChild(todo);
}

function addTodoToDOM(target) {
  const project = getProjectElement(target);
  const newTodo = formatSingleTodo(Todo());
  const todoList = project.querySelector(`.${classes.todoList}`);
  return todoList.appendChild(newTodo);
}

export {
  formatTodos,
  formatDate,
  formatDescription,
  addTodoToDOM,
  deleteTodoFromDOM,
}