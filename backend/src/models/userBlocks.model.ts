import pool from "../db";

/* 
    `userId` INT UNSIGNED NOT NULL, 
    `blockUserId` INT UNSIGNED NOT NULL, 
    `createdAt` DATETIME NOT NULL DEFAULT NOW(),
    PRIMARY KEY (userId, blockUserId), 
    FOREIGN KEY (userId) REFERENCES users(userId),
    FOREIGN KEY (blockUserId) REFERENCES users(userId)

*/

const getUserBlocks = exports.getUserBlocks = async (userId: string | number) => {
    const query = `SELECT * FROM userBlocks WHERE userId=? ;`;
    return (await pool.query(query, [userId]))
}

const isUserIdBlocked = exports.isUserIdBlocked = async (userId: string | number, blockUserId: string | number) => {
    const query = `SELECT * FROM userBlocks WHERE userId=? AND blockUserId=?;`
    return (await pool.query(query, [userId, blockUserId]));
}

// return all Blocked users by userId
const getUserIdsBlocked = exports.getUserIdsBlocked = async (userId: number | string) => {
    const query = `SELECT blockUserId FROM userBlocks WHERE userId=?;`
    return (await pool.query(query, [userId]))
}

// add a row in userBlocks
const insertUserBlock = exports.insertUserBlock = async (userId: string | number, blockUserId: string | number) => {
    const query = `INSERT IGNORE INTO userBlocks(userId, blockUserId) VALUES (?, ?);`
    return (await pool.query(query, [userId, blockUserId]))
}

// remove a row in userBlocks
const deleteUserBlock = exports.deleteUserBlock = async (userId: string, blockUserId: string) => {
    const query = `DELETE FROM userBlocks WHERE userId=? AND blockUserId=?;`
    return (await pool.query(query, [parseInt(userId), parseInt(blockUserId)]))
}


export default {
    getUserBlocks, 
    isUserIdBlocked, 
    getUserIdsBlocked, 
    insertUserBlock, 
    deleteUserBlock
}