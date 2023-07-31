const express = require('express');
const app = express()
app.use(express.json())
const {usersRouter} = require("./database/Routes/usersRouter");


app.listen(9500, () => {
	console.log("App running on server 9500");
})

app.use("/users", usersRouter)

app.use((err, req, res, next) =>{
res.json({Error: err})
});
