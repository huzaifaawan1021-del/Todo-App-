/* global firebase */

const firebaseConfig = {
    apiKey: "AIzaSyC7Tou6npbNbod5OpHLPDqxrG56j_LkWkw",
    authDomain: "landing-page1-1a715.firebaseapp.com",
    projectId: "landing-page1-1a715",
    storageBucket: "landing-page1-1a715.firebasestorage.app",
    messagingSenderId: "666614904541",
    appId: "1:666614904541:web:0581f3c420afde20274d34",
    measurementId: "G-4FTJ1Z05HP"
};

firebase.initializeApp(firebaseConfig);

let input = document.querySelector("#input");
let button = document.querySelector("#btn");
let unorder = document.querySelector("#list");

if (!input || !button || !unorder) {
    console.error("Required elements not found!");
}

function startApp() {
    document.getElementById("start-screen").style.display = "none";
    document.getElementById("todo-container").style.display = "block";
}

function addTodo() {
    if (input.value.trim() === "") {
        alert("Please Enter the Todo");
        return;
    }

    let key = firebase.database().ref('todos').push().key;
    let obj = {
        value: input.value,
        key: key
    };

    input.value = "";

    firebase.database().ref('todos').child(key).set(obj)
        .catch((error) => {
            console.error("Firebase Error: ", error);
        });
}

button.addEventListener("click", addTodo);

input.addEventListener("keypress", (evt) => {
    if (evt.key === "Enter") {
        addTodo();
    }
});

firebase.database().ref('todos').on('child_added', function (da) {
    if (!da.val() || !da.val().value) return;

    let li = document.createElement("li");
    li.innerHTML = `
        <span class="todoText">${da.val().value}</span>
        <div style="display:flex; gap:5px;">
            <button id="edit-${da.val().key}" onclick="edit(this)" style="padding: 5px 10px; font-size: 12px; background: #4ecdc4;">Edit</button>
            <button id="del-${da.val().key}" onclick="del(this)" style="padding: 5px 10px; font-size: 12px; background: #ff6b6b;">Delete</button>
        </div>
    `;
    unorder.appendChild(li);
});

function del(t) {
    const key = t.id.replace('del-', '');
    firebase.database().ref('todos').child(key).remove();
    t.parentElement.parentElement.remove();
}

function edit(th) {
    let span = th.closest("li").querySelector("span");
    let oldText = span.textContent;
    let newText = prompt("Edit the Todo", oldText);

    if (newText !== null && newText.trim() !== "") {
        const key = th.id.replace('edit-', '');
        firebase.database().ref('todos').child(key).update({ value: newText });
        span.textContent = newText;
    }
}

unorder.addEventListener("click", function (e) {
    if (e.target.classList.contains("todoText")) {
        e.target.classList.toggle("completed");
    }
});