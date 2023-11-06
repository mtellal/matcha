import pool from '../db';

/*
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, 
    `userId1` INT UNSIGNED NOT NULL, 
    `userId2` INT UNSIGNED NOT NULL, 
    `action` CHAR(10) NOT NULL, 
    `createdAt` DATETIME(0) NOT NULL DEFAULT NOW(),
*/


const getAll = exports.getAll = async (userId: number | string) => {
    const query = `SELECT * FROM notifications WHERE userId2=? ;`
    return (await pool.query(query, [userId]))
}

const getNotifFromIds = exports.getNotifFromIds = async (userId1: string | number, userId2: number | string, action: string) => {
    const query = `SELECT * FROM notifications WHERE userId1=? AND userId2=? AND action=? ;`
    return (await pool.query(query, [userId1, userId2, action]))
}

const updateNotifTime = exports.updateNotifTime = async (userId1: string | number, userId2: string | number, action: string) => {
    const query = `UPDATE notifications SET createdAt=NOW() WHERE userId1=? AND userId2=? AND action=? ;`
    return (await pool.query(query, [userId1, userId2, action]))
}

const insertNotif = exports.insertNotif = async (userId1: string | number, userId2: string | number, action: string) => {
    const query = `INSERT IGNORE INTO notifications(userId1, userId2, action) VALUES (?, ?, ?);`
    return (await pool.query(query, [userId1, userId2, action]))
}

export default {
    getAll,
    getNotifFromIds,
    updateNotifTime,
    insertNotif,
}