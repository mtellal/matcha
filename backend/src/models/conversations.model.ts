
import pool from "../db";

/*
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, 
    `userId` INT UNSIGNED NOT NULL, 
    `memberId` INT UNSIGNED NOT NULL,
);
*/

const getConvsFromUserId = exports.getConvsFromUserId = async (userId: string | number) => {
    const query = `SELECT * FROM conversations WHERE userId=? or memberId=?;`
    return (await pool.query(query, [userId, userId]));
}

const getConvIdFromUserIds = exports.getConvIdFromUserIds = async (userId1: string | number, userId2: string | number) => {
    const query = `SELECT id FROM conversations WHERE userId IN (?, ?) AND memberId IN (?, ?) ;`
    return (await pool.query(query, [userId1, userId2, userId1, userId2]));
}

const getConvFromUserIds = exports.getConvFromUserIds = async (userId1: string | number, userId2: string | number) => {
    const query = `SELECT * FROM conversations WHERE userId IN (?, ?) AND memberId IN (?, ?) ;`
    return (await pool.query(query, [userId1, userId2, userId1, userId2]));
}

const createNewConv = exports.createNewConv = async (userId: string | number, memberId: string | number) => {
    const query = `INSERT INTO conversations (userId, memberId)
    SELECT ? AS userId, ? AS memberId
    WHERE NOT EXISTS (
        SELECT 1
        FROM conversations
        WHERE (userId = ? AND memberId = ?) OR (userId = ? AND memberId = ?)
    )`
    return (await pool.query(query, [userId, memberId, userId, memberId, userId, memberId]))
}

const deleteConvFromUserIds = exports.deleteConvFromUserIds = async (userId: string | number, memberId: number | string) => {
    const query = `DELETE FROM conversations WHERE userId IN (?, ?) AND memberId IN (?, ?) ;`
    return (await pool.query(query, [userId, memberId, userId, memberId]))
}

export default {
    getConvsFromUserId,
    getConvIdFromUserIds,
    getConvFromUserIds,
    createNewConv,
    deleteConvFromUserIds,
}