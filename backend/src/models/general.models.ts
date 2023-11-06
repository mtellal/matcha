import pool from '../db'


const truncateTables = exports.truncateTables = async () => {

    await pool.query(`SET FOREIGN_KEY_CHECKS=0;
        TRUNCATE TABLE users;
        TRUNCATE TABLE userPhotos;
        TRUNCATE TABLE userTags;
        TRUNCATE TABLE userLikes;
        TRUNCATE TABLE userViews;
        TRUNCATE TABLE conversations;
        TRUNCATE TABLE messages;
        TRUNCATE TABLE notifications;`);
}


export default {
    truncateTables
}