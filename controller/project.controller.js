const pool = require("../database/dbConnect")
const util = require('util');
const query = util.promisify(pool.query).bind(pool);

const projectController = {
    getAll: async (req, res) => {
        try {
            const query = `
                SELECT Project.*, ProjectDetails.*,
                Users.fullName AS leadFullName,
                Users.picture AS imgUser,
                Team.teamName AS teamFullName
                FROM Project
                LEFT JOIN ProjectDetails ON Project.projectID = ProjectDetails.projectID
                LEFT JOIN Users AS Users ON ProjectDetails.userID = Users.userID
                LEFT JOIN Team AS Team ON ProjectDetails.teamID = Team.teamID
            `;
            const result = await pool.query(query);
            res.status(200).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).send("Lỗi Server Nội Bộ");
        }
    },    
    
    getById: async (req, res) => {
        try {
            const projectId = req.params.id;
            const query = `
                SELECT
                    p.*,
                    pd.*,
                    u.fullName AS projectManagerName
                FROM
                    Project p
                LEFT JOIN
                    ProjectDetails pd ON p.projectID = pd.projectID
                LEFT JOIN
                    Users u ON pd.userID = u.userID
                WHERE
                    p.projectID = ?;
            `;
            const result = await pool.query(query, [projectId]); 
            res.status(200).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
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
        const projectId = req.params.id;
        try {
            const result1 = await query("DELETE FROM Project WHERE projectID = ?", [projectId]);
            console.log('Deleted from Project:', result1);
            const result2 = await query("DELETE FROM ProjectDetails WHERE projectID = ?", [projectId]);
            console.log('Deleted from ProjectDetails:', result2);
            res.status(200).json({ message: 'Đã xóa dự án và chi tiết của dự án' });
        } catch (error) {
            res.status(500).json({ error: 'Lỗi xóa dự án', details: error.message });
        }
    }

}

module.exports = projectController