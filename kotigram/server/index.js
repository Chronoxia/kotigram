const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const auth = require('./routes/auth');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb'}));
app.use('/auth', auth);

const db = require('./config');

mongoose.connect(db.url, { useNewUrlParser: true })
    .then(() => console.log('connected'))
    .catch((err) => console.log(err.message));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Listening on port ${port}...`))