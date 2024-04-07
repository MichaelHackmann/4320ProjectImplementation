const express = require('express');
const bodyParser = require('body-parser');
const customerRouter = require('./customerApp')
const adminRouter = require('./adminApp');

const app = express();
const port = 5500; // Change the port as needed

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use('/public', express.static('public'));

// Use the admin router
app.use('/admin', adminRouter);
app.use('/customer', customerRouter);

app.get('/', (req, res) => {
    res.redirect('/customer');
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});