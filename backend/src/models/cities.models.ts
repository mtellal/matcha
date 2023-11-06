import pool from '../db';

/*
    FROM TABLE
    id
    department_code
    name
    slug
    gps_lat
    gps_lng
*/

const bigCities = [
    "Paris",
    "Marseille",
    "Lyon",
    "Toulouse",
    "Nice",
    "Nantes",
    "Montpellier",
    "Strasbourg",
    "Bordeaux",
    "Lille",
    "Rennes",
    "Reims",
    "Saint-Étienne",
    "Le Havre",
    "Toulon",
    "Grenoble",
    "Dijon",
    "Angers",
    "Nîmes",
    "Villeurbanne"
]

const getCityFromId = exports.getCityFromId = async (id: string | number) => {
    const query = `SELECT * FROM cities WHERE id=?;`
    return (await pool.query(query, [id]))
}

const getCitiesfromString = exports.getCitiesfromString = async (city: string) => {
    const query = `SELECT * FROM cities WHERE name LIKE ? ;`
    return (await pool.query(query, [`${city}%`]))
}

const pickBigCity = exports.pickBigCity = async () => {
    const index = Math.floor(Math.random() * ((bigCities.length - 1) - 0 + 1) + 0)
    return (await pool.query(`SELECT * FROM cities WHERE name='${bigCities[index]}';`))
}

const getCitiesLength = exports.getCitiesLength = async () => {
    return (await pool.query(`SELECT COUNT(*) FROM cities ;`))
}

export default {
    getCitiesLength,
    getCityFromId,
    getCitiesfromString,
    pickBigCity
}