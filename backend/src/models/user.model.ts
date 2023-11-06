import pool from '../db';
import { City, ICreate } from '../type';


const usersTable = 'users'

/*
    `userId` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `username` CHAR(50) NOT NULL DEFAULT "",
    `email` CHAR(100) NOT NULL DEFAULT "",
    `password` CHAR(100) NOT NULL DEFAULT "",
    `firstName` CHAR(50) NOT NULL DEFAULT "",
    `lastName` CHAR(50) NOT NULL DEFAULT "",
    `age` DATE DEFAULT NULL,
    `city` CHAR(50) NOT NULL DEFAULT "",
    `department` CHAR(50) NOT NULL DEFAULT "",
    `region` CHAR(50) NOT NULL DEFAULT "",
    `gender` CHAR(10) NOT NULL DEFAULT "",
    `sexualPreferences` CHAR(10) NOT NULL DEFAULT "",
    `biography` TEXT(400) NOT NULL DEFAULT "",
    `likes` INT UNSIGNED NOT NULL DEFAULT 0,
    `views` INT UNSIGNED NOT NULL DEFAULT 0,
    `matches` INT UNSIGNED NOT NULL DEFAULT 0,
    `fameRating` FLOAT UNSIGNED NOT NULL DEFAULT 2.5,
    `status` BIT DEFAULT 0,
    `confirmAccount` BIT DEFAULT 0,
    `notifications` INT UNSIGNED NOT NULL DEFAULT 0,
    `nbPhotos` INT UNSIGNED NOT NULL DEFAULT 0,
    `lastConnection` DATETIME(0) NOT NULL DEFAULT NOW(),
*/


const getAll = exports.getAll = async () => {
    return (await pool.query("SELECT userId, username, firstName, lastName FROM users;"));
}

const getUserDataFieldFromField = exports.getUserDataFieldFromField = async (dataField: string | number, field: string, valueField: string | number) => {
    return (await pool.query(`SELECT ${dataField} FROM ${usersTable} WHERE ${field} = (?);`, [valueField]));
}

const getUserDatasFieldsFromUserId = exports.getUserDatasFieldsFromUserId = async (fields: string[], userId: number | string) => {
    const query = `SELECT ${fields.map((f: string) => f)} FROM ${usersTable} WHERE userId=${userId};`
    return (await pool.query(query));
}

const getMaxViews = exports.getMaxViews = async () => {
    return (await pool.query(`SELECT MAX(views) as maxViews FROM ${usersTable};`));
}

const getMaxLikes = exports.getMaxLikes = async () => {
    return (await pool.query(`SELECT MAX(likes) maxLikes FROM ${usersTable};`));
}

const getMaxMatches = exports.getMaxMatches = async () => {
    return (await pool.query(`SELECT MAX(matches) as maxMatches FROM ${usersTable};`));
}

const createUser = exports.createUser = async (fields: string[], datas: any) => {
    const query = `INSERT INTO ${usersTable} (${fields.map((s: string) => datas[s] ? s : '')}) 
    VALUES (${fields.map(() => '?')})`;
    return (await pool.query(query, fields.map((s: string) => datas[s])));
}

/* //////////////////   U P D A T E     //////////////////*/

const updateUser = exports.updateUser = async (id: number, datas: ICreate) => {
    const keys = Object.keys(datas);

    const query = `UPDATE ${usersTable} \
    SET ${keys.map((s: string) => {
        if (s === "age")
            return (`${s}='DATE ${datas[s as keyof ICreate]}'`)
        return (`${s}='${datas[s as keyof ICreate]}'`)
    })} \
    WHERE id='${id}'`;

    return (await pool.query(query, Object.values(datas)));
}

const updateUserDataFieldFromUserId = exports.updateUserDataFieldFromUserId = async (field: string, dataField: string, userId: string | number) => {
    const query = `UPDATE ${usersTable} SET ${field}=? WHERE userId=?;`;
    return (await pool.query(query, [dataField, userId]))
}

const updateUserDatasFieldsFromUserId = exports.updateUserDatasFieldsFromUserId = async (keys: string[], values: string[], userId: string | number) => {
    const query = `UPDATE ${usersTable} SET ${keys.map((k: string, i: number) => `${k}=?`)} WHERE userId=?;`
    return (await pool.query(query, [...values, userId]));
}

const updateLastConnection = exports.updateLastConnection = async (userId: number | string) => {
    const query = `UPDATE ${usersTable} SET lastConnection=CURRENT_TIMESTAMP WHERE userId=? ;`
    return (await pool.query(query, [userId]))
}

const incrementUserNotif = exports.incrementUserNotif = async (userId: number | string) => {
    const query = `UPDATE ${usersTable} SET notifications=notifications+1 WHERE userId=? ;`
    return (await pool.query(query, [userId]))
}

const updateUserStatusFromUserId = exports.updateUserStatusFromUserId = async (status: string, userId: string | number) => {
    let query;
    if (status === "true")
        query = `UPDATE ${usersTable} SET status=true WHERE userId=?;`;
    else if (status === "false")
        query = `UPDATE ${usersTable} SET status=false WHERE userId=?;`;
    else
        return;
    return (await pool.query(query, [userId]))
}

const updateConfirmAccountFromUserId = exports.updateConfirmAccountFromUserId = async (status: string, userId: string | number) => {
    let query;
    if (status === "true")
        query = `UPDATE ${usersTable} SET confirmAccount=true WHERE userId=?;`;
    else if (status === "false")
        query = `UPDATE ${usersTable} SET confirmAccount=false WHERE userId=?;`;
    else
        return;
    return (await pool.query(query, [userId]))
}


/* //////////////////   F A M E   R A T I N G    //////////////////*/

/*
    {
        ageGap: {begin: x, end: y},
        fameRatingGap: {begin: x, end: y},
        city: 'Nantes',
    }
*/

export type SearchAdvancedOptionsModel = {
    ageGap?: {
        userAge: string, 
        gap: number
    }, 
    fameRatingGap?: {
        begin: number, 
        end: number
    },
    city?: City
}

const getUsersFromAdvancedSearch = exports.getUsersFromAdvancedSearch = async (advancedOptions: SearchAdvancedOptionsModel) => {

    let nbOptions = Object.keys(advancedOptions).length;

    let query = `SELECT * FROM ${usersTable} ${nbOptions-- > 0 ? ' WHERE ' : ';'}`;

    const values = [];

    if (advancedOptions.ageGap && advancedOptions.ageGap.gap) {
        const userAge = new Date(advancedOptions.ageGap.userAge).toISOString().slice(0, 10);
        query += `age BETWEEN DATE_SUB(?, interval ? year) and DATE_ADD(?, interval ? year)${nbOptions-- ? ' AND ' : ';'}`;
        values.push(userAge);
        values.push(advancedOptions.ageGap.gap);
        values.push(userAge);
        values.push(advancedOptions.ageGap.gap);
    }
    if (advancedOptions.fameRatingGap && advancedOptions.fameRatingGap.begin && advancedOptions.fameRatingGap.end) {
        query += `fameRating BETWEEN ? and ?${nbOptions-- ? ' AND ' : ';'}`;
        values.push(advancedOptions.fameRatingGap.begin);
        values.push(advancedOptions.fameRatingGap.end);
    }
    if (advancedOptions.city) {
        query += `city=?;`
        values.push(advancedOptions.city)
    }
    return (await pool.query(query, values))
}

/* //////////////////   V I E W S    //////////////////*/


// increment the view of an user
const addUserView = exports.addUserView = async (viewUserid: string) => {
    const query = `UPDATE ${usersTable} SET views=views+1 WHERE userId=?`;
    return (await pool.query(query, [viewUserid]))
}


/* //////////////////   L I K E S    //////////////////*/

// increment the views of an user
const addUserLike = exports.addUserLike = async (likeUserId: string) => {
    const query = `UPDATE ${usersTable} SET likes=likes+1 WHERE userId=?`;
    return (await pool.query(query, [likeUserId]))
}

// decrement the views of an user
const deleteUserLike = exports.deleteUserLike = async (likeUserId: string) => {
    const query = `UPDATE ${usersTable} SET likes=GREATEST(likes-1, 0) WHERE userId=?`;
    return (await pool.query(query, [likeUserId]))
}


const deleteUser = exports.deleteUser = async (userId: number | string) => {
    const query = `DELETE FROM ${usersTable} WHERE  userId=? ;`
    return (await pool.query(query, [userId]))
}


export default {
    getAll,
    getUserDataFieldFromField,
    getUserDatasFieldsFromUserId,
    getMaxViews,
    getMaxLikes,
    getMaxMatches,
    createUser,
    updateUser,
    updateUserDataFieldFromUserId,
    updateUserDatasFieldsFromUserId,
    updateLastConnection,
    incrementUserNotif,
    updateUserStatusFromUserId,
    updateConfirmAccountFromUserId,
    getUsersFromAdvancedSearch,
    addUserView,
    addUserLike,
    deleteUserLike,
    deleteUser
}