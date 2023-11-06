import { Request, Response } from "express";
import citiesService from "~/services/cities.service";
import citiesModels from "~/models/cities.models";

const NodeGeocoder = require('node-geocoder');

const randomCity = exports.randomCity = async (req: Request, res: Response) => {
    try {
        const resNbCities = await citiesModels.getCitiesLength();
        const nbCities = Number(resNbCities[0]['COUNT(*)']);
        let pickBigCity = true;
        let city;
        if (Math.floor(Math.random() * (10 - 1) + 1) <= 3)
            pickBigCity = false;

        if (pickBigCity) {
            city = await citiesService.pickBigCity();
        }
        else {
            const index = Math.floor(Math.random() * ((nbCities - 1) - 0 + 1) + 0);
            city = await citiesModels.getCityFromId(index);
            city = city[0]
        }
        return (res.status(200).json({ message: "City successfully generated", data: city }))
    }
    catch (e) {
        // console.log(e)
        return (res.status(500).json({ message: "Error generating random city" }))
    }
}

const searchCity = exports.searchCity = async (req: Request, res: Response) => {
    if (!req.query || !req.query.city)
        return (res.status(400).json({ message: "Query param 'city' required" }))
    try {
        const cities = await citiesService.getCitiesfromString(String(req.query.city));
        return (res.status(200).json({ message: "success", cities }))
    }
    catch (e) {
        // console.log(e);
        return (res.status(500).json({ message: "Search failed", error: e }))
    }
}

const geolocation = exports.geolocation = async (req: Request, res: Response) => {
    if (!req.query.latitude || !req.query.longitude)
        return (res.status(400).json({ message: "Query params [latitude, longitude] required" }))
    try {
        const options = {
            provider: 'locationiq',
            apiKey: process.env.LOCATIONIQ_API_KEY,
            formatter: null
        };
        const geocoder = NodeGeocoder(options);
        let data = await geocoder.reverse({ lat: req.query.latitude, lon: req.query.longitude });
        return (res.status(200).json({ data: data[0] || data, message: "Geolocation successfully sent" }))
    }
    catch (e) {
        // console.log(e)
        return (res.status(500).json({ message: "Geolocation failed" }))
    }
}

export default {
    randomCity,
    searchCity,
    geolocation
}