const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.send('Hello, I am sample router');
});

module.exports = router;