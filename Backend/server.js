const { connectToPool } = require('./database/config/dbconfig.js');
const express = require('express');
const adminRoute = require('./routes/adminRoutes/adminRoute.js');
const usersRouter = require('./routes/usersRouter/usersRouter.js');
const dotenv = require('dotenv');

const app = express();
const cors = require('cors');
const corsOptions = {
	origin: '*',
	optionsSuccessStatus: 200,
};
const port = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());
app.use('/users', usersRouter);
app.use('/api/admin', adminRoute);
connectToPool().then(() => {
	app.listen(port, () => {
		console.log(`server started on port ${port}`);
	});
});
