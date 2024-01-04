const btnCancel = document.getElementById("btn-cancel");
const btnAdd = document.getElementById("btn-add");
const inputAdd = document.getElementById("input-task");

let tabTasks = [];
function getAllTasks() {
  fetch("http://localhost:3000/tasks")
    .then((res) => res.json())
    .then((data) => {
      tabTasks = data;
      document.getElementById("list-tasks").innerHTML = "";
      console.log(tabTasks);
      convertTaskToLi();
    });
}

getAllTasks();

function toggleHidden() {
  btnCancel.hidden = !btnCancel.hidden;
  btnAdd.hidden = !btnAdd.hidden;
  inputAdd.hidden = !inputAdd.hidden;
}

btnAdd.addEventListener("click", () => {
  toggleHidden();
});
btnCancel.addEventListener("click", () => {
  toggleHidden();
});
inputAdd.addEventListener("change", () => {
  fetch("http://localhost:3000/tasks", {
    method: "POST",
    body: JSON.stringify({
      checked: false,
      text: inputAdd.value,
      date: new Date(),
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      alert("Task Added !");
      getAllTasks();
    })
    .catch((err) => {
      console.log(err);
    });
  toggleHidden();
});

function convertTaskToLi() {
  for (const task of tabTasks) {
    const newLi = document.createElement("li");
    newLi.className = "list-group-item";

    const newCheckbox = document.createElement("input");
    newCheckbox.type = "checkbox";
    newCheckbox.style.margin = "0 10px";
    newCheckbox.checked = task.checked;
    newCheckbox.addEventListener("click", () => {
      fetch(`http://localhost:3000/tasks/${task.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          checked: !task.checked,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          getAllTasks();
        })
        .catch((err) => {
          console.log(err);
        });
    });

    const newSpan = document.createElement("span");
    newSpan.textContent = task.text;
    newSpan.style.textDecoration = task.checked ? "line-through" : "null";

    const newBadge = document.createElement("span");
    newBadge.className = "badge bg-secondary";
    newBadge.style.margin = "0 10px";
    newBadge.textContent = `${new Date(task.date).getHours()}H ${new Date(
      task.date
    ).getMinutes()}Mn`;

    newLi.appendChild(newCheckbox);
    newLi.appendChild(newSpan);
    newLi.appendChild(newBadge);
    newLi.addEventListener("dblclick", () => {
      if (confirm("Etes vous sur de vouloir supprimer ce task ?")) {
        fetch(`http://localhost:3000/tasks/${task.id}`, {
          method: "DELETE",
        })
          .then((res) => {
            alert("Task Supprimé!");
            getAllTasks();
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
    document.getElementById("list-tasks").appendChild(newLi);
  }
}
