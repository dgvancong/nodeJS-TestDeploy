const pool = require("../database/dbConnect")
const teamController = {
    getAll: async (req, res) => {
        try {
            const [rows, fields] = await pool.query("SELECT * FROM Team")
            res.json({
                data: rows
            })
        } catch (error) {
            console.log(error)
            res.json({
                status: "Lỗi khi lấy dữ liệu bảng Team"
            })
        }
    },
    getById: async (req, res) => {
        try {
            const { id } = req.params
            const [rows, fields] = await pool.query("SELECT * FROM Team WHERE teamID = ?", [id])
            res.json({
                data: rows
            })
        } catch (error) {
            console.log(error)
            res.json({
                status: "Lỗi khi lấy dữ liệu Team"
            })
        }
    },
    create: async (req, res) => {
        try {
            const { teamName } = req.body
            const sql = "INSERT INTO Team (teamName, create_at, updated_at) VALUES (?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)"
            const [rows, fields] = await pool.query(sql, [teamName])
            res.json({
                data: rows,
                status: "Thêm nhóm hoạt động thành công"
            })
        } catch (error) {
            console.log(error)
            res.json({
                status: "Lỗi khi thêm nhóm hoạt động thành công"
            })
        }
    },
    update: async (req, res) => {
        try {
            const { teamName } = req.body
            const { id } = req.params
            const sql = "UPDATE Team SET teamName = ? WHERE teamID = ?"
            const [rows, fields] = await pool.query(sql, [teamName, id])
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
            const [rows, fields] = await pool.query("DELETE FROM Team WHERE teamID = ?", [id])
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

module.exports = teamController