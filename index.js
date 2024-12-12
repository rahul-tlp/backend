const express = require('express');
const app = express();
var router = require('./routes/route');
// const bodyParser = require('body-parser')
const db = require('./config/db')
const cors = require('cors');
app.use(cors());


db ();
//

app.use(express.json({}));

const PORT = 8000

app.use('/', router);

app.listen(PORT, ()=> {
    console.log(`Server is conncted on port ${PORT}`);
})