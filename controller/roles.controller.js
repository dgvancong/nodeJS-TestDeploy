const pool = require("../database/dbConnect")
const rolesController = {
    getAll: async (req, res) => {
        try {
            const [rows, fields] = await pool.query("select * from roles")
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
    getById: async (req, res) => {
        try {
            const { roleID } = req.params
            const [rows, fields] = await pool.query("select * from roles where roleID = ?", [roleID])
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
            const { title, content } = req.body
            const sql = "insert into roles (title, content) values (?, ?)"
            const [rows, fields] = await pool.query(sql, [title, content])
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
            const { title, content } = req.body
            const { roleID } = req.params
            const sql = "update posts set title = ?, content = ? where roleID = ?"
            const [rows, fields] = await pool.query(sql, [title, content, roleID])
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
            const { roleID } = req.params
            const [rows, fields] = await pool.query("delete from roles where roleID = ?", [roleID])
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

module.exports = rolesController