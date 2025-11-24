const mysql = require('mysql2/promise')
require('dotenv').config()

const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.user,
    password: process.env.PASS,
    database: process.env.NAME,
    connectionLimit: 10,
    waitForConnections: true
})

async function testConnection(){
    try{
        const connection = await pool.getConnection()
        await connection.query("SELECT 1")
        console.log('Connection Established')
        connection.release()
    } catch(error){
        console.error(error)
        console.log('Failed to Establish Connection. Check Server')
    }
}
module.exports = {
    pool,
    testConnection
}