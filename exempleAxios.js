const axios = require("axios");

axios.get("http://localhost:3000/tasks").then((res) => console.log(res.data));
axios
  .post("http://localhost:3000/tasks", {
    checked: true,
    date: new Date(),
    text: "Test Axsios",
  })
  .then((res) => console.log(res.data));
