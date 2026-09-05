let todos = [];
let isLatestFirst = true;

// Auth check + initial load

async function init(){
    const meResponse = await fetch('/api/auth/me', { credentials: 'include' });

    if(!meResponse.ok){
        window.location.href = 'login.html';
        return;
    }

    await fetchTodos();
}

// Fetch this user's todos from the backend

async function fetchTodos(){
    const response = await fetch('/api/todos', { credentials: 'include' });
    todos = await response.json();
    renderTodos();
}


// Enter

document.getElementById("taskinput").addEventListener('keypress', function(e){
    if(e.key === 'Enter'){
        addTodo();
    }
})

// Tooggle Select

function toggleSection(section){
    const content = document.getElementById(`${section}-section`)
    const header = content.previousElementSibling;
    content.classList.toggle('expanded');
    header.classList.toggle('active');
}

// Add

async function addTodo(){
    const input = document.getElementById("taskinput");
    const text = input.value.trim();

    if(text){
        await fetch('/api/todos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ text })
        });

        input.value = '';
        await fetchTodos();
    }
}

// Delete

async function deleteTodo(id){
    await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    });

    await fetchTodos();
}

// Toggle Complete

async function toggleComplete(id){
    const todo = todos.find(t => t.id === id);
    if(!todo) return;

    await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ completed: !todo.completed })
    });

    await fetchTodos();
}

// Sort

function sortTodos(){
    isLatestFirst = !isLatestFirst;
    const button = document.getElementById("sortbtn");
    button.innerHTML = isLatestFirst ? "Sort by Oldest <i class='bx bx-sort' ></i>" : "Sort by Latest <i class='bx bx-sort' ></i>";
    renderTodos()
}

function renderTodos(){
    const uncompletedList = document.getElementById("uncompleted-list");
    const completedList = document.getElementById("completed-list");
    uncompletedList.innerHTML = '';
    completedList.innerHTML = '';

    const sortedTodos = [...todos].sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);


        return isLatestFirst ?
            dateB - dateA :
            dateA - dateB;
    });
    let completedCount = 0;
    let uncompletedCount = 0;

    sortedTodos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-items ${todo.completed ? 'completed' : ''}`;

        li.innerHTML = `
                    <input type="checkbox" 
                        class="checkbox"
                        ${todo.completed ? 'checked' : ''}
                        onclick="toggleComplete(${todo.id})">
                            <span class="todo-text">${todo.text}</span>
                            <button class="delete-btn" onclick="deleteTodo(${todo.id})">
                                <i class="bx bx-trash-alt"></i>
                            </button>
            `
        if(todo.completed){
            completedList.appendChild(li);
            completedCount++;
        } else {
            uncompletedList.appendChild(li);
            uncompletedCount++;
        }
    });
    document.getElementById('completed-count').textContent = completedCount;
    document.getElementById('uncompleted-count').textContent = uncompletedCount;


    // Update the sort

    const button = document.querySelector(".sort-btn");
    button.innerHTML = isLatestFirst ? "Sort by Oldest <i class='bx bx-sort' ></i>" : "Sort by Latest <i class='bx bx-sort' ></i>";

}


// Logout

async function logout(){
    await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
    });

    window.location.href = 'login.html';
}


init();
