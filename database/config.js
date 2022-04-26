const mongoose = require('mongoose');

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.DB_CNN);
    console.log('BD Online');
    } catch (error) {
        throw new Error('Error a la hora de iniciar la BD de datos')
    }
}

module.exports = {dbConnection}