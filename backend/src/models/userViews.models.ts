import pool from '../db';

/*
    FROM TABLE
    userId
    viewUserId
*/

/* //////////////////   V I E W S    //////////////////*/

const isUserViewed = exports.isUserViewed = async (userId: string, viewUserId: string) => {
    const query = `SELECT * FROM userViews WHERE userId=? AND viewUserId=?;`
    return (await pool.query(query, [parseInt(userId), parseInt(viewUserId)]));
}

const getUserIdsViewedMe = exports.getUserIdsViewedMe = async (viewUserId: string | number) => {
    const query = `SELECT userId FROM userViews WHERE viewUserId=?;`
    return (await pool.query(query, [viewUserId]))
}

// return all Viewed users by userId
const getUserIdsViewed = exports.getUserIdsViewed = async (userId: number | string) => {
    const query = `SELECT viewUserId FROM userViews WHERE userId=?;`
    return (await pool.query(query, [userId]))
}

// add a row in userViews
const insertUserView = exports.insertUserView = async (userId: string | number, viewUserId: string | number) => {
    const query = `INSERT IGNORE INTO userViews(userId, viewUserId) VALUES (?, ?);`
    return (await pool.query(query, [userId, viewUserId]))
}

export default {
    isUserViewed,
    getUserIdsViewed,
    getUserIdsViewedMe,
    insertUserView,
}