import pool from '../db';

/*
    FROM TABLE
    userId
    reportUserId
*/

/* //////////////////   R E P O R T S    //////////////////*/

const isUserViewed = exports.isUserViewed = async (userId: string, reportUserId: string) => {
    const query = `SELECT * FROM userReports WHERE userId=? AND reportUserId=?;`
    return (await pool.query(query, [parseInt(userId), parseInt(reportUserId)]));
}

const getUserIdsReportedMe = exports.getUserIdsReportedMe = async (reportUserId: string | number) => {
    const query = `SELECT userId FROM userReports WHERE reportUserId=?;`
    return (await pool.query(query, [reportUserId]))
}

const getUserIdsReported = exports.getUserIdsReported = async (userId: number | string) => {
    const query = `SELECT reportUserId FROM userReports WHERE userId=?;`
    return (await pool.query(query, [userId]))
}

const insertUserReport = exports.insertUserReport = async (userId: string | number, reportUserId: string | number) => {
    const query = `INSERT IGNORE INTO userReports(userId, reportUserId) VALUES (?, ?);`
    return (await pool.query(query, [userId, reportUserId]))
}

export default {
    isUserViewed,
    getUserIdsReportedMe,
    getUserIdsReported,
    insertUserReport,
}