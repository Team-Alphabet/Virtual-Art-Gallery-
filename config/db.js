const mongoose = require('mongoose');

exports.connectToMongo = () => {
    mongoose
        .connect(process.env.MONGO_URI)
        .then((con) => console.log(`Database: ${con.connection.host}`))
        .catch((err) => { console.log(err) });
}

