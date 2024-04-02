const pool = require("../database/dbConnect")
const taskController = {

    getAll: async (req, res) => {
        try {
            const [rows, fields] = await pool.query (`
                SELECT Task.*, Project.projectName, Users.fullName 
                FROM Task 
                JOIN Project ON Task.projectID = Project.projectID 
                JOIN Users ON Task.userID = Users.userID`
            );
            res.json({
                data: rows
            })
        } catch (error) {
            res.json({
                status: "Lỗi khi lấy dữ liệu của bảng Task"
            })
        }
    },
    
    getById: async (req, res) => {
        try {
            const { id } = req.params
            const [rows, fields] = await pool.query(
                `
                SELECT
                    p.*,
                    pd.*,
                    t.*,
                    td.*,
                    u.fullName
                FROM
                    Project p
                LEFT JOIN
                    ProjectDetails pd ON p.projectID = pd.projectID
                LEFT JOIN
                    Task t ON p.projectID = t.projectID
                LEFT JOIN
                    TaskDetails td ON t.taskID = td.taskID
                LEFT JOIN
                    Users u ON pd.userID = u.userID
                WHERE
                    p.projectID = ?;
            `, [id]);
            res.json({
                data: rows
            })
        } catch (error) {
            res.json({
                status: "Lỗi khi lấy dữ liệu Task"
            })
        }
    },

    create: async (req, res) => {
        try {
            const taskData = req.body;
    
            const insertTaskQuery = `
              INSERT INTO Task (projectID, taskType, summary, userID, status, createdDate, endDate, priority, description)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
            `;
          
            // Thêm công việc
            const resultTask = await pool.query(insertTaskQuery, [
                taskData.projectID,
                taskData.taskType,
                taskData.summary,
                taskData.userID,
                taskData.status,
                taskData.createdDate,
                taskData.endDate,
                taskData.priority,
                taskData.description,
            ]);
    
            const insertedTaskId = resultTask.insertId;
    
            const insertTaskDetailsQuery = `
                INSERT INTO TaskDetails (taskID, taskDescription, actualHoursSpent, taskManagerID)
                VALUES (?, ?, ?, ?);
            `;
    
            // Thêm chi tiết công việc
            await pool.query(insertTaskDetailsQuery, [
                insertedTaskId,
                taskData.taskDescription,
                taskData.actualHoursSpent,
                taskData.taskManagerID,
            ]);
    
            res.status(201).json({ message: 'Thêm công việc thành công' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Lỗi máy chủ nội bộ khi thêm công việc' });
        }
    },

    update: async (req, res) => {
        try {
            const taskId = req.params.taskId;
            const updatedTaskData = req.body;
          
            // Sửa công việc
            const updateTaskQuery = `
                UPDATE Task
                SET status = ?
                WHERE taskID = ?;
            `;
    
            // Bắt đầu transaction
            await db.beginTransactionAsync();
    
            // Sửa công việc
            const [resultTask] = await db.queryAsync(updateTaskQuery, [
                updatedTaskData.status,
                taskId,
            ]);
    
            // Commit transaction
            await db.commitAsync();
    
            res.status(200).json({ message: 'Sửa trạng thái công việc thành công' });
        } catch (error) {
            console.error(error);
            // Rollback transaction nếu có lỗi
            await db.rollbackAsync();
            res.status(500).json({ error: 'Lỗi máy chủ nội bộ khi sửa công việc' });
        }
    },

    delete: async (req, res) => {
        try {
            const taskId = req.params.id;
            const deleteTaskDetailsQuery = `DELETE FROM TaskDetails WHERE taskID = ?;`;
            await pool.query(deleteTaskDetailsQuery, [taskId]);
            const deleteTaskQuery = `DELETE FROM Task WHERE taskID = ?;`;
            await pool.query(deleteTaskQuery, [taskId]);
            res.status(200).json({ message: 'Xóa công việc thành công' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Lỗi máy chủ nội bộ khi xóa công việc' });
        }
    },

    taskProjectID: async (req, res) => {
        try {
            const projectId = req.params.projectId;
      
            const query = `
                SELECT taskID
                FROM Task
                WHERE projectID = ?;
            `;
    
            const [results] = await connection.queryAsync(query, [projectId]);
            
            const taskIDs = results.map((result) => result.taskID);
            
            res.status(200).json({ taskIDs });
        } catch (error) {
            console.error('Error fetching project tasks:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    
    

}


module.exports = taskController