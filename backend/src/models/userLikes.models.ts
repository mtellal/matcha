import pool from '../db';

/*
    `userId` INT UNSIGNED NOT NULL, 
    `likeUserId` INT UNSIGNED NOT NULL, 
    PRIMARY KEY (userId, likeUserId), 
    FOREIGN KEY (userId) REFERENCES users(userId),
    FOREIGN KEY (likeUserId) REFERENCES users(userId)
*/


/* //////////////////   L I K E S    //////////////////*/

const isUserLiked = exports.isUserLiked = async (userId: string | number, likeUserId: string | number) => {
    const query = `SELECT * FROM userLikes WHERE userId=? AND likeUserId=?;`
    return (await pool.query(query, [userId, likeUserId]));
}

const getUserIdsLikedMe = exports.getUserIdsLikedMe = async (likeUserId: string | number) => {
    const query = `SELECT userId FROM userLikes WHERE likeUserId=?;`
    return (await pool.query(query, [likeUserId]))
}

// return all liked users by userId
const getUserIdsLiked = exports.getUserIdsLiked = async (userId: number | string) => {
    const query = `SELECT likeUserId FROM userLikes WHERE userId=?;`
    return (await pool.query(query, [userId]))
}

// add a row in userLikes
const insertUserLike = exports.insertUserLike = async (userId: string | number, likeUserId: string | number) => {
    const query = `INSERT IGNORE INTO userLikes(userId, likeUserId) VALUES (?, ?);`
    return (await pool.query(query, [userId, likeUserId]))
}

// remove a row in userLikes
const deleteUserLike = exports.deleteUserLike = async (userId: string | number, likeUserId: string | number) => {
    const query = `DELETE FROM userLikes WHERE userId=? AND likeUserId=?;`
    return (await pool.query(query, [userId, likeUserId]))
}

export default {
    isUserLiked,
    getUserIdsLikedMe,
    getUserIdsLiked,
    insertUserLike,
    deleteUserLike
}