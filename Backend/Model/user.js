const {pool} = require('../Config/db')

class User{
    static async createUser(email,hashPassword){
    const query = 'INSERT INTO Users(email,passwordHash)VALUES(?,?)';
    const [rows] = await pool.query(query,[email,hashPassword])
    return rows;    
    }

    static async findEmail(email){
        const query = 'SELECT * FROM Users WHERE email = ?';
        const [rows] = await pool.query(query,[email]);
        return rows
    }
}

module.exports = User;