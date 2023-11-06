import citiesModels from "~/models/cities.models";
import { City } from "~/type";

const getCityFromId = exports.getCityFromId = async (id: string | number) => {
    let res = await citiesModels.getCityFromId(id);
    if (!res || !res.length)
        throw "City not found";
    return (res[0])
}

const pickBigCity = exports.pickBigCity = async () => {
    let res = await citiesModels.pickBigCity();
    if (!res || !res.length)
        throw "Pick City failed";
    return (res[0])
}


const getCitiesfromString = exports.getCitiesfromString = async (city: string) => {
    city = city.toLocaleLowerCase();
    let recoCities: City[] = [];
    const nbCities = 20
    try {
        const data = await citiesModels.getCitiesfromString(city);
        data.map((o: City) => {
            if (recoCities.length < nbCities &&
                o.slug.length >= city.length &&
                o.slug.slice(0, city.length) === city) {
                if (o.slug === "paris") {
                    o.name += ' ' + o.zip_code.slice(-2, o.zip_code.length);
                }
                recoCities.push(o)
            }
        })
    }
    catch (e) {
        // console.log(e)
    }
    return (recoCities)
}


export default {
    getCityFromId,
    pickBigCity,
    getCitiesfromString,
}