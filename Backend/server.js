const { connectToPool } = require('./database/config/dbconfig.js');
const express = require('express');
const adminRoute = require('./routes/adminRoutes/adminRoute.js');
const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT;
const app = express();
app.use(express.json());
app.use('/api/admin', adminRoute);

app.get('/', (req, res) => {
	res.send('hello world');
});

connectToPool().then(() => {
	app.listen(port, () => {
		console.log(`server started on port ${port}`);
	});
});
