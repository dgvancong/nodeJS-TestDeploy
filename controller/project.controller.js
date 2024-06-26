const pool = require("../database/dbConnect");
const util = require("util");
const query = util.promisify(pool.query).bind(pool);

const projectController = {
    getAll: async (req, res) => {
        try {
            const [rows, fields] = await pool.query (`
            SELECT Project.*, ProjectDetails.*,
                Users.fullName AS leadFullName,
                Users.picture AS imgUser,
                Team.teamName AS teamFullName
                FROM Project
                LEFT JOIN ProjectDetails ON Project.projectID = ProjectDetails.projectID
                LEFT JOIN Users AS Users ON ProjectDetails.userID = Users.userID
                LEFT JOIN Team AS Team ON ProjectDetails.teamID = Team.teamID
            `)
            res.json({
                data: rows
            })
        } catch (error) {
            res.json({
                status: "Lỗi khi lấy dữ liệu của dự án"
            })
        }
    },

    getById: async (req, res) => {
        try {
            const { id } = req.params
            const [rows, fields] = await pool.query ( `
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
            `, [id]);
            res.json({
                data: rows
            })
        } catch (error) {
            console.log(error)
            res.json({
                status: "Lỗi khi lấy dữ liệu dự án"
            })
        }
    },

    create: async (req, res) => {
        const {
            projectName,
            projectKey,
            progress,
            createdDate,
            endDate,
            projectDescription,
            clientContactName,
            clientContactEmail,
            clientContactPhone,
            teamID,
            userID,
        } = req.body;
        db.beginTransaction((beginTransactionErr) => {
            try {
                if (beginTransactionErr) {
                    throw new Error(
                        `Lỗi bắt đầu giao dịch: ${beginTransactionErr.message}`
                    );
                }
                const projectQuery = `
                    INSERT INTO project (projectName, projectKey, progress, createdDate, endDate) 
                    VALUES ('${projectName}', '${projectKey}', '${progress}','${createdDate}','${endDate}')`;
                db.query(
                    projectQuery,
                    [projectName, projectKey, progress, createdDate, endDate],
                    (projectErr, projectResult) => {
                        try {
                            if (projectErr) {
                                throw new Error(
                                    `Lỗi thực hiện truy vấn dự án: ${projectErr.message}`
                                );
                            }
                            const projectId = projectResult.insertId;
                            const projectDetailsQuery = `
                                INSERT INTO projectDetails (projectID, projectDescription, clientContactName, clientContactEmail, clientContactPhone, teamID, userID) 
                                VALUES (${projectId},'${projectDescription}','${clientContactName}', '${clientContactEmail}','${clientContactPhone}', '${teamID}', '${userID}')`;
                            db.query(
                                projectDetailsQuery,
                                [
                                    projectId,
                                    projectDescription,
                                    clientContactName,
                                    clientContactEmail,
                                    clientContactPhone,
                                    teamID,
                                    userID,
                                ],
                                (detailsErr, projectDetailsResult) => {
                                    try {
                                        if (detailsErr) {
                                            throw new Error(
                                                `Lỗi thực hiện truy vấn projectDetails: ${detailsErr.message}`
                                            );
                                        }
                                        const projectTeamQuery = `
                                            INSERT INTO ProjectTeam (projectID, teamID, userID) 
                                            VALUES (${projectId}, ${teamID}, ${userID})`;
                                        db.query(
                                            projectTeamQuery,
                                            [projectId, teamID, userID],
                                            (projectTeamErr, projectTeamResult) => {
                                                try {
                                                    if (projectTeamErr) {
                                                        throw new Error(
                                                            `Lỗi thực hiện truy vấn ProjectTeam: ${projectTeamErr.message}`
                                                        );
                                                    }
                                                    db.commit((commitErr) => {
                                                        try {
                                                            if (commitErr) {
                                                                throw new Error(
                                                                    `Lỗi commit giao dịch: ${commitErr.message}`
                                                                );
                                                            }
                                                            res.json({
                                                                project: projectResult,
                                                                projectDetails: projectDetailsResult,
                                                                projectTeam: projectTeamResult,
                                                            });
                                                        } catch (commitCatchErr) {
                                                            db.rollback(() =>
                                                                res
                                                                    .status(500)
                                                                    .json({
                                                                        error: "Lỗi commit giao dịch",
                                                                        details: commitCatchErr.message,
                                                                    })
                                                            );
                                                        }
                                                    });
                                                } catch (projectTeamCatchErr) {
                                                    db.rollback(() =>
                                                        res
                                                            .status(500)
                                                            .json({
                                                                error: "Lỗi thực hiện truy vấn ProjectTeam",
                                                                details: projectTeamCatchErr.message,
                                                            })
                                                    );
                                                }
                                            }
                                        );
                                    } catch (detailsCatchErr) {
                                        db.rollback(() =>
                                            res
                                                .status(500)
                                                .json({
                                                    error: "Lỗi thực hiện truy vấn projectDetails",
                                                    details: detailsCatchErr.message,
                                                })
                                        );
                                    }
                                }
                            );
                        } catch (projectCatchErr) {
                            db.rollback(() =>
                                res
                                    .status(500)
                                    .json({
                                        error: "Lỗi thực hiện truy vấn dự án",
                                        details: projectCatchErr.message,
                                    })
                            );
                        }
                    }
                );
            } catch (beginTransactionCatchErr) {
                res
                    .status(500)
                    .json({
                        error: "Lỗi bắt đầu giao dịch",
                        details: beginTransactionCatchErr.message,
                    });
            }
        });
    },

    update: async (req, res) => {
        const { projectID } = req.params;
        const {
            projectName,
            projectKey,
            progress,
            createdDate,
            endDate,
            projectDescription,
            clientContactName,
            clientContactEmail,
            clientContactPhone,
            teamID,
            userID,
        } = req.body;
        try {
            await query("START TRANSACTION");
            await query(
                "UPDATE Project SET projectName=?, projectKey=?, progress=?, createdDate=?, endDate=? WHERE projectID=?",
                [projectName, projectKey, progress, createdDate, endDate, projectID]
            );
            await query(
                "UPDATE ProjectDetails SET projectDescription=?, clientContactName=?, clientContactEmail=?, clientContactPhone=?, teamID=?, userID=? WHERE projectID=?",
                [
                    projectDescription,
                    clientContactName,
                    clientContactEmail,
                    clientContactPhone,
                    teamID,
                    userID,
                    projectID,
                ]
            );
            await query("COMMIT");
            res
                .status(200)
                .json({
                    message:
                        "Thông tin dự án và chi tiết dự án đã được cập nhật thành công",
                });
        } catch (error) {
            await query("ROLLBACK");
            console.error("Lỗi cập nhật dự án và chi tiết dự án:", error.message);
            res
                .status(500)
                .json({
                    error: "Lỗi cập nhật dự án và chi tiết dự án",
                    details: error.message,
                });
        }
    },

    delete: async (req, res) => {
        const projectId = req.params.id;
        try {
            const result1 = await query("DELETE FROM Project WHERE projectID = ?", [
                projectId,
            ]);
            console.log("Deleted from Project:", result1);
            const result2 = await query(
                "DELETE FROM ProjectDetails WHERE projectID = ?",
                [projectId]
            );
            console.log("Deleted from ProjectDetails:", result2);
            res.status(200).json({ message: "Đã xóa dự án và chi tiết của dự án" });
        } catch (error) {
            res.status(500).json({ error: "Lỗi xóa dự án", details: error.message });
        }
    },

    projectTeam: async (req, res) => {
        try {
            const { id } = req.params
            const [rows, fields] = await pool.query (
                ` SELECT ProjectTeam.*, TeamMembers.*, Users.picture, Users.fullName, Users.roleID, Team.teamName
                    FROM ProjectTeam
                    JOIN TeamMembers ON ProjectTeam.teamID = TeamMembers.teamID
                    JOIN Users ON TeamMembers.userID = Users.userID
                    JOIN Team ON TeamMembers.teamID = Team.teamID
                    WHERE ProjectTeam.projectID = ?
                `, [id])
                res.json({
                    data: rows
                })
                } catch (error) {
                    res.json({
                        status: "Lỗi khi lấy dữ liệu Roles"
                    })
                }
      }
      
    
    
};

module.exports = projectController;
