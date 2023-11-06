import pool from '../db';

/*
    FROM TABLE
    id
    region_code
    name
    slug
*/

const getRegionFromId = exports.getRegionFromId = async (id: string | number) => {
    const query = `SELECT * FROM regions WHERE id=?;`
    return (await pool.query(query, [id]))
}

const getRegionFromCode = exports.getRegionFromCode = async (code: string | number) => {
    const query = `SELECT * FROM regions WHERE code=?;`
    return (await pool.query(query, [code]))
}

export default {
    getRegionFromId,
    getRegionFromCode,
}