import pool from "../db";

/*
    `msgId` INT UNSIGNED NOT NULL AUTO_INCREMENT, 
    `convId` INT UNSIGNED NOT NULL, 
    `authorId` INT UNSIGNED NOT NULL, 
    `userId` INT UNSIGNED NOT NULL,
    `text` TEXT(400),
    PRIMARY KEY (msgId),  
    FOREIGN KEY (convId) REFERENCES conversations(convId),
    FOREIGN KEY (authorId) REFERENCES users(userId),
    FOREIGN KEY (userId) REFERENCES users(userId)
*/

const getMessagesFromConvId = exports.getMessagesFromConvId = async (convId: string | number) => {
    const query = `SELECT * FROM messages WHERE convId=? ;`
    return (await pool.query(query, [convId]))
}

const getMessageFromIds = exports.getMessageFromIds = async (convId: number | string, authorId: number | string, userId: number | string, text: string) => {
    const query = `SELECT * FROM messages WHERE convId=? AND authorId=? AND userId=? AND text=? ;`
    return (await pool.query(query, [convId, authorId, userId, text]))
}

const getLastMessageFromIds = exports.getLastMessageFromIds = async (convId: number | string, userId: string | number) => {
    const query = `SELECT * FROM messages WHERE convId=? AND userId=? ;`
    return (await pool.query(query, [convId, userId]))
}

const addMessage = exports.addMessage = async (convId: string | number, authorId: string | number, userId: string | number, text: string) => {
    const query = `INSERT INTO messages(convId, authorId, userId, text) VALUES (?, ?, ?, ?) ;`
    return (await pool.query(query, [convId, authorId, userId, text]))
}

export default {
    getMessagesFromConvId,
    getMessageFromIds,
    getLastMessageFromIds,
    addMessage,
}