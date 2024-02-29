const pool = require("../database/dbConnect")
const importController = {
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
    }

}

module.exports = importController