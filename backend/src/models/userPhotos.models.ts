import pool from "../db";

/* 
    `userId` INT UNSIGNED NOT NULL,
    `path` CHAR(100) NOT NULL DEFAULT "",
    `photoId` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    PRIMARY KEY(photoId), 
    FOREIGN KEY (userId) REFERENCES users(userId)
*/

// index => [userId * 5 + 0 ---- userId * 5 + 4]
// userId * 5 + 0 = profilePicture 

const getUserPhotos = exports.getUserPhotos = async (userId: string | number) => {
    const query = `SELECT * FROM userPhotos WHERE userId=? ;`
    return (await pool.query(query, [userId]))
}

const getPathFromIds = exports.getPathFromIds = async (userId: number, index: number) => {
    const query = `SELECT path FROM userPhotos WHERE userId=? AND photoId=? ;`
    return (await pool.query(query, [userId, Number(userId) * 5 + Number(index)]))
}

const updateUserPhotos = exports.updateUserPhotos = async (userId: number, fileNames: string[], photosIndex: any[]) => {
    if (fileNames.length !== photosIndex.length)
        throw ("fileName and photosIndex lengths differ");

    photosIndex = photosIndex.map((i: string) => userId * 5 + parseInt(i));

    const query = `INSERT INTO userPhotos(userId, path, photoId) \
        VALUES ${fileNames.map((f: string) => `(${userId}, ?, ?)`)} \
        ON DUPLICATE KEY UPDATE path=VALUES(path);`
    let params: string[] = [];
    let i = 0;
    while (i < fileNames.length) {
        params.push(fileNames[i]);
        params.push(photosIndex[i]);
        i++;
    }
    return (await pool.query(query, params))
}

export default {
    getUserPhotos,
    getPathFromIds,
    updateUserPhotos,
}