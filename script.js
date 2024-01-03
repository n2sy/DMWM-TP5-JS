const olTasks = document.getElementById("list-tasks");

let tabTasks = [];

function getAllTasks() {
  fetch("http://localhost:3000/tasks")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      tabTasks = data;
      olTasks.innerHTML = "";
      convertTasksToLi();
    });
}

function convertTasksToLi() {
  for (const task of tabTasks) {
    const newLi = document.createElement("li");
    newLi.className = "list-group-item";
    newLi.textContent = task.text;
    if (task.checked) newLi.style.textDecoration = "line-through";
    const newInput = document.createElement("input");
    newInput.type = "checkbox";
    newInput.checked = task.checked;
    newInput.addEventListener("click", () => {
      fetch(`http://localhost:3000/tasks/${task.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          checked: !task.checked,
        }),
        headers: {
          "Content-type": "application/json",
        },
      })
        .then((res) => {
          //  alert("Task modifié!");
          getAllTasks();
        })
        .catch((err) => {
          console.log(err);
        });
    });
    newInput.style.margin = "0 10px";
    newLi.appendChild(newInput);

    let newSpan = document.createElement("span");
    newSpan.className = "badge bg-secondary";
    newSpan.textContent = `${new Date(task.date).getHours()}H ${new Date(
      task.date
    ).getMinutes()}Mn`;
    newLi.appendChild(newSpan);
    newLi.addEventListener("dblclick", () => {
      if (confirm("Etes-vous sur de vouloir supprimer ce task?")) {
        fetch(`http://localhost:3000/tasks/${task.id}`, {
          method: "DELETE",
        })
          .then((res) => {
            //  alert("Task modifié!");
            getAllTasks();
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });

    olTasks.appendChild(newLi);
  }
}

getAllTasks();

function toggleHiddenButtons() {
  //console.log(document.getElementById("btn-add").hidden);
  document.getElementById("btn-add").hidden =
    !document.getElementById("btn-add").hidden;
  document.getElementById("btn-cancel").hidden =
    !document.getElementById("btn-add").hidden;
  document.getElementById("input-task").hidden =
    !document.getElementById("btn-add").hidden;
}

document.getElementById("btn-add").addEventListener("click", () => {
  toggleHiddenButtons();
});
document.getElementById("btn-cancel").addEventListener("click", () => {
  toggleHiddenButtons();
});
document.getElementById("input-task").addEventListener("change", () => {
  fetch("http://localhost:3000/tasks", {
    method: "POST",
    body: JSON.stringify({
      checked: false,
      date: new Date(),
      text: document.getElementById("input-task").value,
    }),
    headers: {
      "Content-type": "application/json",
    },
  })
    .then((response) => {
      alert("Task ajouté !");
      getAllTasks();
    })
    .catch((err) => {
      console.log("Probléme avec notre API");
    });
  toggleHiddenButtons();
});

// fetch("http://localhost:3000/tasks", {
//   method: "POST",
//   body: JSON.stringify({
//     checked: false,
//     date: new Date(),
//     text: "Task 1",
//   }),
//   headers: {
//     "Content-type": "application/json",
//   },
// })
//   .then((response) => {
//     console.log("Task ajouté !");
//   })
//   .catch((err) => {
//     console.log("Probléme avec notre API");
//   });
