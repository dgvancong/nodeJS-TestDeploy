const pool = require("../database/dbConnect")
const teamController = {
    getAll: async (req, res) => {
        try {
            const [rows, fields] = await pool.query("select * from Team")
            res.json({
                data: rows
            })
        } catch (error) {
            console.log(error)
            res.json({
                status: "Lỗi dữ liệu bảng Team"
            })
        }
    },
    getById: async (req, res) => {
        try {
            const { id } = req.params
            const [rows, fields] = await pool.query("select * from Team where teamID = ?", [id])
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
    create: async (req, res) => {
        try {
            const { roleName } = req.body
            const sql = "insert into roles (roleName) values (?)"
            const [rows, fields] = await pool.query(sql, [roleName])
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

module.exports = teamController