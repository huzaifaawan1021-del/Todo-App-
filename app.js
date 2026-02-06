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
let unorder = document.querySelector("#list"); // ✅ FIXED

firebase.database().ref('todos').on('child_added', function (da) {

    if (!da.val() || !da.val().value) return; // ✅ FIX

    let li = document.createElement("li");

    li.innerHTML = `
        <span class="todoText">${da.val().value}</span>
        <div>
            <button id="${da.val().key}" onclick="edit(this)">Edit</button>
            <button id="${da.val().key}" onclick="del(this)">Delete</button>
        </div>
    `;

    unorder.appendChild(li);
});


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

    firebase.database().ref('todos').child(key).set(obj);
}

button.addEventListener("click", addTodo);

input.addEventListener("keypress", (evt) => {
    if (evt.key === "Enter") {
        evt.preventDefault();
        addTodo();
    }
});

function del(t) {
    firebase.database().ref('todos').child(t.id).remove();
    t.parentElement.parentElement.remove();
}

function edit(th) {
    let span = th.closest("li").querySelector("span");
    let oldText = span.textContent;
    let newText = prompt("Edit the Todo", oldText);

    if (newText !== null && newText.trim() !== "") {
        let ob = {
            value: newText,
            key: th.id
        };

        firebase.database().ref('todos').child(th.id).set(ob);
        span.textContent = newText;
    }
}

unorder.addEventListener("click", function (e) {
    if (e.target.classList.contains("todoText")) {
        e.target.classList.toggle("completed");
    }
});
