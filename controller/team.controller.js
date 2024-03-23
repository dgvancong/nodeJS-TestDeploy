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
                status: "Lỗi khi cập nhật lại dữ liệu nhóm"
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
                status: "Lỗi khi xóa dữ liệu nhóm"
            })
        }
    }

}

module.exports = teamController