import pool from '../db';


/* ////////////////////     T A G S      //////////////////// */

/*
    `tagId` INT UNSIGNED NOT NULL AUTO_INCREMENT, 
    `tag` CHAR(30) NOT NULL DEFAULT '',
*/

const getAllTags = exports.getAllTags = async () => {
    return (await pool.query(`SELECT * from tags ;`))
}

const getTagsFromTagIds = exports.getTagsFromTagIds = async (tagIds: number[]) => {
    const query = `SELECT * FROM tags WHERE tagId IN (${tagIds.map((id: number) => '?')});`
    return (await pool.query(query, tagIds))
}

const getTagsIdsFromTags = exports.getTagsIdsFromTags = async (tags: string[]) => {
    const query = `SELECT tagId FROM tags WHERE tag IN (${tags.map((t: string) => '?')});`
    return (await pool.query(query, tags));
}


/* //////////////////// U S E R     T A G S //////////////////// */

/*
  `userId` INT UNSIGNED NOT NULL,
  `tagId` INT UNSIGNED NOT NULL,
*/

const getUserTags = exports.getUserTags = async (userId: string | number) => {
    const query = `SELECT tags.tagId, tag \
    FROM tags \
    JOIN userTags ON tags.tagId=userTags.tagId WHERE userId=? ;`
    return (await pool.query(query, [userId]))
}

const getUserTagIds = exports.getUserTagIds = async (userId: number | string) => {
    const query = `SELECT tagId FROM userTags where userId=?;`
    return (await pool.query(query, [userId]));
}

const insertUserTagIds = exports.insertUserTagIds = async (userId: number | string, tagsIds: number[] | string[]) => {
    const query = `INSERT INTO userTags(userId, tagId) VALUES ${tagsIds.map((id: number | string) => `(${userId}, ?)`)};`;
    return (await pool.query(query, tagsIds))
}

const deleteUserTagIds = exports.deleteUserTagIds = async (userId: string | number) => {
    const query = `DELETE FROM userTags WHERE userId=?;`
    return (await pool.query(query, [userId]))
}

export default {
    getAllTags,
    getTagsFromTagIds,
    getTagsIdsFromTags,
    getUserTags,
    getUserTagIds,
    deleteUserTagIds,
    insertUserTagIds, 
}