const pool = require("../database/dbConnect")
const bcrypt = require('bcrypt');
const userController = {
    getAll: async (req, res) => {
        try {
            const [rows, fields] = await pool.query("select * from Users")
            res.json({
                data: rows
            })
        } catch (error) {
            console.log(error)
            res.json({
                status: "Lỗi dữ liệu của người dùng !!!"
            })
        }
    },
    getById: async (req, res) => {
        try {
            const { id } = req.params
            const [rows, fields] = await pool.query(`
            SELECT Users.*, roles.roleName
            FROM Users
            JOIN roles ON Users.roleID = roles.roleID
            WHERE Users.userID = ?`, [id])
            res.json({
                data: rows
            })
        } catch (error) {
            console.log(error)
            res.json({
                status: "Không tìm thấy người dùng !!!"
            })
        }
    },
    create: async (req, res) => {
        try {
            const { picture, fullName, password, emailAddress, phoneNumber, roleID } = req.body;
            const saltRounds = 10;
            const passwordHash = await bcrypt.hash(password, saltRounds);
            const sql = "INSERT INTO Users (picture, fullName, passwordHash, emailAddress, phoneNumber, roleID, lastLogin, createdDate) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)"
            const [rows, fields] = await pool.query(sql, [picture, fullName, passwordHash, emailAddress, phoneNumber, roleID])
            res.json({
                data: rows
            })
        } catch (error) {
            console.log(error)
            res.json({
                status: "Đăng ký người dùng không thành công !!!"
            })
        }
    },
    update: async (req, res) => {
        try {
            const { roleName } = req.body
            const { id } = req.params
            const sql = "update roles set roleName = ? where roleID = ?"
            const [rows, fields] = await pool.query(sql, [roleName, id])
            res.json({
                data: rows
            })
        } catch (error) {
            console.log(error)
            res.json({
                status: "error"
            })
        }
    }, 
    delete: async (req, res) => {
        try {
            const { id } = req.params
            const [rows, fields] = await pool.query("delete from roles where roleID = ?", [id])
            res.json({
                data: rows
            })
        } catch (error) {
            console.log(error)
            res.json({
                status: "error"
            })
        }
    }

}

module.exports = userController