import pool from '../db';

/*
    FROM TABLE
    id
    region_code
    name
    slug
*/


const getDepartmentFromId = exports.getDepartmentFromId = async (id: string | number) => {
    const query = `SELECT * FROM departments WHERE id=?;`
    return (await pool.query(query, [id]))
}

const getDepartmentFromCode = exports.getDepartmentFromCode = async (code: string | number) => {
    const query = `SELECT * FROM departments WHERE code=?;`
    return (await pool.query(query, [code]))
}

export default {
    getDepartmentFromId,
    getDepartmentFromCode,
}