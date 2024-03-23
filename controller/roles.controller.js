const pool = require("../database/dbConnect")
const rolesController = {
    getAll: async (req, res) => {
        try {
            const [rows, fields] = await pool.query("SELECT * FROM roles")
            res.json({
                data: rows
            })
        } catch (error) {
            console.log(error)
            res.json({
                status: "Lỗi khi lấy dữ liệu của bảng Roles"
            })
        }
    },
    getById: async (req, res) => {
        try {
            const { id } = req.params
            const [rows, fields] = await pool.query("SELECT * FROM roles WHERE roleID = ?", [id])
            res.json({
                data: rows
            })
        } catch (error) {
            console.log(error)
            res.json({
                status: "Lỗi khi lấy dữ liệu Roles"
            })
        }
    },
    create: async (req, res) => {
        try {
            const { roleName } = req.body
            const sql = "INSERT INTO roles (roleName, create_at, updated_at) VALUES (?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)"
            const [rows, fields] = await pool.query(sql, [roleName])
            res.json({
                data: rows,
                status: "Thêm thêm vị trí chức vụ, Quyền hạn thành công"
            })
        } catch (error) {
            console.log(error)
            res.json({
                status: "Lỗi khi thêm vị trí chức vụ, Quyền hạn"
            })
        }
    },
    update: async (req, res) => {
        try {
            const { roleName } = req.body
            const { id } = req.params
            const sql = "UPDATE roles SET roleName = ? WHERE roleID = ?"
            const [rows, fields] = await pool.query(sql, [roleName, id])
            res.json({
                data: rows
            })
        } catch (error) {
            console.log(error)
            res.json({
                status: "Lỗi cập nhật vị trí chức vụ, Quyền hạn"
            })
        }
    }, 
    delete: async (req, res) => {
        try {
            const { id } = req.params
            const [rows, fields] = await pool.query("DELETE FROM roles WHERE roleID = ?", [id])
            res.json({
                data: rows
            })
        } catch (error) {
            console.log(error)
            res.json({
                status: "Lỗi khi xóa vị trí chức vụ, Quyền hạn"
            })
        }
    }

}

module.exports = rolesController