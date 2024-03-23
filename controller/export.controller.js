const pool = require("../database/dbConnect")
const exportController = {
    getExcel: async (req, res) => {
        try {
            const [rows] = await pool.promise().execute(`
              SELECT 
                Task.*,
                TaskDetails.*
              FROM 
                Task
              JOIN 
                TaskDetails ON Task.taskID = TaskDetails.taskID;
            `);
            if (!Array.isArray(rows) || rows.length === 0) {
                return res.status(404).json({ error: 'No data found' });
            }
            const workbook = new exceljs.Workbook();
            const worksheet = workbook.addWorksheet('Tasks');
            const columns = Object.keys(rows[0]);
            worksheet.columns = columns.map(column => ({ header: column, key: column, width: 20 }));
            worksheet.addRows(rows);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=tasks.xlsx');
            await workbook.xlsx.write(res);
            res.end();
        } catch (error) {
            console.error('Download Excel Error:', error);
            res.status(500).json({ error: 'Internal Server Error', details: error.message });
        }
    }
}

module.exports = exportController