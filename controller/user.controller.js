const pool = require("../database/dbConnect")
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
            const passwordHash = await bcryptjs.hash(password, saltRounds);
            const sql = "INSERT INTO Users (picture, fullName, passwordHash, emailAddress, phoneNumber, roleID, lastLogin, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)"
            const [rows, fields] = await pool.query(sql, [picture, fullName, passwordHash, emailAddress, phoneNumber, roleID])
            res.json({
                data: rows
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: "Đăng ký người dùng không thành công !!!"
            });
        }
    },
    login: async (req, res) => {
        try {
            const { emailAddress, password } = req.body;
            const query = "SELECT * FROM Users WHERE emailAddress = ?";
            const [rows, fields] = await pool.query(query, [emailAddress]);
            if (rows.length === 0) {
                return res.status(401).json({ success: false, message: 'Email không tồn tại' });
            }
            const user = rows[0];
            const passwordMatch = await bcryptjs.compare(password, user.passwordHash);
            if (!passwordMatch) {
                return res.status(401).json({ success: false, message: 'Mật khẩu không đúng' });
            }
            const token = jwt.sign({ userID: user.userID, emailAddress: user.emailAddress }, 'your-secret-key', { expiresIn: '1h' });
            res.json({ 
                success: true, 
                message: 'Đăng nhập thành công', 
                token, 
                user: {
                    userID: user.userID,
                    picture: user.picture,
                    fullName: user.fullName,
                    emailAddress: user.emailAddress,
                    phoneNumber: user.phoneNumber,
                    roleID: user.roleID,
                    lastLogin: user.lastLogin
                },
                userID : user.userID,
            });
        } catch (error) {
            console.error('Lỗi trong quá trình đăng nhập:', error);
            res.status(500).json({ success: false, message: 'Lỗi trong quá trình đăng nhập', details: error.message });
        }
    },
    userlogin: async (req, res) =>{
        try {
            const userId = req.params.userID;

            const userLoginQuery = `
                SELECT Users.*, roles.roleName
                FROM Users
                JOIN roles ON Users.roleID = roles.roleID
                WHERE Users.userID = ?`;

            const [userLoginResult] = await pool.query(userLoginQuery, [userId]);

            res.json({ userLogin: userLoginResult });
        } catch (error) {
            console.error(`Lỗi truy vấn UserLogin: ${error.message}`);
            res.status(500).json({ error: 'Lỗi truy vấn UserLogin', details: error.message });
        }
    },
    delete: async (req, res) => {
        try {
            const { id } = req.params
            const [rows, fields] = await pool.query("delete from Users where userID = ?", [id])
            res.json({
                data: rows
            })
        } catch (error) {
            console.log(error)
            res.json({
                status: "Lỗi thực hiện khi xóa người dùng"
            })
        }
    }



}

module.exports = userController