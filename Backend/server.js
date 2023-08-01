const express = require('express');
const cors = require('cors');
const app = express()
app.use(express.json())
const {usersRouter} = require("./database/Routes/usersRouter");
const {projectRouter} = require("./database/Routes/projectRouter");

app.use(cors());
app.listen(9500, () => {
	console.log("App running on server 9500");
})

app.use("/users", usersRouter)
app.use("/projects", projectRouter)
app.use((err, req, res, next) =>{
res.json({Error: err})
});
