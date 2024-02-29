const pool = require("../database/dbConnect")
const exportController = {
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
    }

}

module.exports = exportController