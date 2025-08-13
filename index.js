require('dotenv').config()
const express= require('express');
const app = express();
const port = 3000;
require('./database/connection')
const cors = require('cors');
app.use(cors());
app.use(express.json());
const router = require('./routes/routes.js')
app.use( router);


app.get('/', (req, res) => {
    res.send('Hello World!');
    }
);
app.listen(port, (error) => {
    if (!error) {
        console.log("Server is Successfully Running, and App is listening on port " + port)

    } else {
        console.log("Error occurred, server can't start", error)

    }

})
