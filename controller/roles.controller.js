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
            const { rolesID } = req.params
            const [rows, fields] = await pool.query("select * from roles where rolesID = ?", [rolesID])
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
            const { rolesID } = req.params
            const sql = "update posts set title = ?, content = ? where rolesID = ?"
            const [rows, fields] = await pool.query(sql, [title, content, rolesID])
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
            const { rolesID } = req.params
            const [rows, fields] = await pool.query("delete from roles where rolesID = ?", [rolesID])
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