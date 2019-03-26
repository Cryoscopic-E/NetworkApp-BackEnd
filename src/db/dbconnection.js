const moongoose = require('mongoose');

moongoose.connect('mongodb://127.0.0.1/na-backend', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})