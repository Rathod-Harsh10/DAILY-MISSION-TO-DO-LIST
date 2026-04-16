const API_URL = "http://localhost:8000/tasks";

async function fetchTasks() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error();
        const tasks = await res.json();
        renderTasks(tasks);
    } catch (e) {
        showToast("Error: API Server is Offline!");
    }
}

async function addTask() {
    const input = document.getElementById('task_input');
    if (!input.value) return;
    toggleLoading(true);
    await fetch(`${API_URL}?title=${encodeURIComponent(input.value)}`, { method: 'POST' });
    input.value = "";
    toggleLoading(false);
    fetchTasks();
}

async function updateQuest(id) {
    const newTitle = document.getElementById(`title-${id}`).value;
    await fetch(`${API_URL}/${id}?title=${encodeURIComponent(newTitle)}`, { method: 'PUT' });
    showToast("Quest Saved!");
    fetchTasks();
}

async function toggleCheck(id, status) {
    await fetch(`${API_URL}/${id}?is_completed=${!status}`, { method: 'PUT' });
    fetchTasks();
}

async function deleteTask(id) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchTasks();
}

function renderTasks(tasks) {
    const list = document.getElementById('task_list');
    list.innerHTML = tasks.map(t => `
        <li class="task_item">
            <input type="checkbox" ${t.is_completed ? 'checked' : ''} onclick="toggleCheck(${t.id}, ${t.is_completed})">
            <input type="text" id="title-${t.id}" class="task_text ${t.is_completed ? 'completed' : ''}" value="${t.title}">
            <button class="btn_save" onclick="updateQuest(${t.id})">SAVE</button>
            <button class="btn_del" onclick="deleteTask(${t.id})">DEL</button>
        </li>
    `).join('');
}

function toggleLoading(show) {
    document.getElementById('loading_bar').style.display = show ? 'block' : 'none';
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.innerText = msg; toast.style.display = 'block';
    setTimeout(() => toast.style.display = 'none', 3000);
}

document.getElementById('add_btn').onclick = addTask;
window.onload = fetchTasks;
