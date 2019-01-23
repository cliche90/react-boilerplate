const path = require('path');
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set('views', path.resolve(__dirname, 'public'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.static(path.resolve(__dirname, 'public')));

app.get('/', (req, res, next) => {
    res.render('index.html');
});

app.use('/sample_router', require('./routes/sample_router'));

app.listen(port, () => console.log(`Listen on port ${port}`));
