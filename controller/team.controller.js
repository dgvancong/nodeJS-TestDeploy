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
    groupMember: async (req, res) => {
        try {
            const { teamID, userID, roleID, joinDate } = req.body;
            const getRoleQuery = `SELECT u.roleID, r.roleName FROM Users u JOIN roles r ON u.roleID = r.roleID WHERE u.userID = ?`;
            const roleResult = await pool.query(getRoleQuery, [userID]);
    
            if (roleResult.length > 0) {
                const { roleID, roleName } = roleResult[0];
                const addMemberQuery = `INSERT INTO TeamMembers (teamID, userID, roleID, joinDate) VALUES (?, ?, ?, ?)`;
                await pool.query(addMemberQuery, [teamID, userID, roleID, joinDate]);
    
                return res.json({ message: 'Thêm thành viên vào nhóm thành công', roleName });
                console.log(addMemberQuery);
            } else {
                return res.status(404).json({ error: 'Không tìm thấy vai trò của người dùng' });
            }
        } catch (error) {
            console.error('Lỗi trong quá trình xử lý:', error);
            return res.status(500).json({ error: 'Đã xảy ra lỗi trong quá trình xử lý' });
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