module.exports = function () {

    const mysql = require('mysql2');

    // Create a connection to the MySQL server
    const connection = mysql.createConnection({ // change the below information to match the servers info on your device
        host: 'localhost',
        user: 'root',
        password: 'SurfBreak1270!',
        database: 'ICLOTHING'
    });
    // Connect to the database
    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to the database:', err.stack);
            return;
        }
    
        console.log('Connected to the database');
    });

    return connection
}