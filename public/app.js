const form = document.querySelector('form');
const todoWrapper = document.querySelector('.todo-wrapper');
const list = document.querySelector('.todo-list');
const doneList = document.querySelector('.done-list');
const todoContainer = document.querySelector('.todo-container');
const completedList = document.querySelector('.completed-container');

// gets the current todo list items stored in local host and returns an array of objects 
const getLocalTodo = () => {
  return JSON.parse(localStorage.getItem('todoList')) || [];
}

const getLocalDoneList = () => {
  return JSON.parse(localStorage.getItem('todoDone')) || [];
}
// handles adding the list item ui when called with the list data
const addUI = (listData) => {
  list.innerHTML = "";
 listData.forEach((listItem) => {
      list.innerHTML += `
      <li class="border-b-2 border-primary bottom-red">
      <div class="flex justify-between">
          <form action="" id="item-input item-input__${listItem.id}" class="flex w-full items-center">
              <input type="text" name="todo_item" value="${listItem.name}" disabled id="${listItem.id}" class="w-full py-2 outline-none bg-transparent border-0">
              <div class="flex">  
                <span class="material-symbols-outlined cursor-pointer hover:text-primary done-icon">done_outline</span>
                 <button>                             
                  <span class="material-symbols-outlined cursor-pointer edit-icon">edit</span>
                  </button>
                  <span class="material-symbols-outlined delete-item cursor-pointer">delete</span>
              </div>
          </form>
          </div>
      </li>
          `;
  })
}

const addDoneUI = (listData) => {
  doneList.innerHTML = "";
 listData.forEach((listItem) => {
  doneList.innerHTML += `
  <li class="border-b-2 border-secondary bottom-red text-secondary">
  <div class="flex justify-between">
      <form action="" id="item-input item-input__${listItem.id}" class="flex w-full items-center">
          <input type="text" name="todo_item" value="${listItem.name}" disabled id="${listItem.id}" class="w-full py-2 outline-none bg-transparent border-0">
          <div class="flex">  
              <span class="material-symbols-outlined cursor-pointer text-primary restore-todo">done_outline</span>
              <span class="material-symbols-outlined delete-done-item cursor-pointer">delete</span>
          </div>
      </form>
      </div>
  </li>
          `;
  })
}

  // loads the todo list items if there are any stored in local storage
  localStorage.getItem('todoList') ? addUI(getLocalTodo()) : '';
  localStorage.getItem('todoDone') ? addDoneUI(getLocalDoneList()) : completedList.classList.add('hidden');

class handleTodoApp{
  constructor(todoItem){
    this.todoItem = todoItem;
    this.todoList = [];
    this.doneList = [];
  }
  // adds todo item to local storage
  addToStorage(data, listName){
    let stringfiedList = JSON.stringify(data);
    localStorage.setItem(listName, stringfiedList);

    if(listName === 'todoList'){
      addUI(JSON.parse(localStorage.getItem(listName)))
    } else {
      addDoneUI(JSON.parse(localStorage.getItem(listName)))
    }
  }
  // handles adding new todo items
  createTodoItem(){
    // creates an object with the item value and sets a random id 
    let randomNum = Math.floor(Math.random() * 1000) + 1;
    const newTodoItem = {name: this.todoItem, id: randomNum};
    // adds the todo item object to the todoList array object
    this.todoList.push(newTodoItem);
    // gets the current stored todo objects and spreads them with the new todo item in the todoList array
    const storedTodos = getLocalTodo();
    this.todoList = [...storedTodos, ...this.todoList];
    // sends the new todo list array of objects to the addToStorage function to add to local storage
    this.addToStorage(this.todoList, 'todoList');
  }
  // handles updating todo items
  updateTodoItem(){
    const editIcon = this.todoItem.querySelector('.edit-icon');
    const inputElement = this.todoItem.querySelector('input');
    // allows user to start editing todo item and changes icon to arrow
    if(!editIcon.classList.contains('edit-mode')){
      editIcon.innerText = 'arrow_forward';
      inputElement.disabled = false;
      inputElement.select();
      editIcon.classList.add('edit-mode');
    } else {
      // submits updated item to the addToStorage function to be stored and changes icon back to the pencel
      if(getLocalTodo().length > 0){
        const storedTodos = getLocalTodo();
        let index = storedTodos.findIndex(obj => {
            return obj.id === Number(inputElement.id)
        })
        storedTodos[index].name = inputElement.value;
        this.addToStorage(storedTodos, 'todoList');
      }
      editIcon.innerText = 'edit';
      inputElement.disabled = true;
      editIcon.classList.remove('edit-mode');
    }
  }
  // This method removes a todo item from local storage by filtering out the item with a matching ID and updating the list in local storage. 
  deleteItem(dataList){
    const inputElement = this.todoItem.parentNode.parentNode.querySelector('input');
    const storedTodos = JSON.parse(localStorage.getItem(dataList));
    let updatedTodoList = storedTodos.filter(todoItem => {
      return Number(todoItem.id) !== Number(inputElement.id);
    })
    this.addToStorage(updatedTodoList, dataList);
  }
  completedItem(){
    const inputElement = this.todoItem.parentNode.parentNode.querySelector('input');

    const doneItem = {name:inputElement.value, id:inputElement.id};
    this.doneList.push(doneItem);

    const storedDoneTodos = getLocalDoneList();
    this.doneList = [...storedDoneTodos, ...this.doneList];

    this.addToStorage(this.doneList, 'todoDone');

    completedList.classList.remove('hidden');
  }
  clearList(dataList){
    localStorage.removeItem(dataList);
    addDoneUI(getLocalDoneList())
    completedList.classList.add('hidden');
  }
}

// listens for the trash icon click and sends the item that was clicked

// listens for the trash icon click and sends the item that was clicked
todoContainer.addEventListener('click', (e) => {
  const item = e.target;
  if (e.target.classList.contains('delete-item')) {
    const findTodo = new handleTodoApp(item);
    findTodo.deleteItem('todoList');
  }
  if(e.target.classList.contains('done-icon')){
    const findTodo = new handleTodoApp(item);
    findTodo.deleteItem('todoList');
    
    const completedTodo = new handleTodoApp(item);
    completedTodo.completedItem();
  }
  if(e.target.classList.contains('restore-todo')){
    const inputElement = e.target.parentNode.parentNode.querySelector('input');
    const newTodoLocal = new handleTodoApp(inputElement.value);
    newTodoLocal.createTodoItem();
    const findTodo = new handleTodoApp(item);
    findTodo.deleteItem('todoDone');
    if(doneList.children.length === 0){
      completedList.classList.add('hidden');
    }
  }
  if (e.target.classList.contains('delete-done-item')) {
    const findTodo = new handleTodoApp(item);
    findTodo.deleteItem('todoDone');
    if(doneList.children.length === 0){
      completedList.classList.add('hidden');
    }
  }

  if (e.target.classList.contains('clear-list')) {
    const clearList = new handleTodoApp(item);
    clearList.clearList('todoDone');
  }

});

// handles form submissions
todoWrapper.addEventListener('submit', (e) => {
  e.preventDefault();
  if(e.target.tagName.toLowerCase() === 'form'){
    const formId = e.target.id;
// sends the input element clicked to the updateTodoItem function
    if(formId.startsWith('item-input')){
      const item = e.target;
      const updateItem = new handleTodoApp(item);
      updateItem.updateTodoItem();
// submits the new todo to the addTodoItem function 
    } else if(formId === 'add-todo'){
        const todoValue = e.target.todo.value;
        e.target.reset();
        const newTodoLocal = new handleTodoApp(todoValue);
        newTodoLocal.createTodoItem();
    }
  }
})
