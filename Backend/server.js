
const { connectToPool } = require('./database/config/dbconfig.js');
const express = require('express');
const adminRoute = require('./routes/adminRoutes/adminRoute.js');
const dotenv = require('dotenv');

const app = express();
const cors = require('cors');
const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
};
app.use(express.json());



app.use('/users', usersRouter);
app.use('/api/admin', adminRoute);
connectToPool().then(() => {
    app.listen(port, () => {
        console.log(`server started on port ${port}`);
    });
});
