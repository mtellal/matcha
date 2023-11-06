import { useState } from "react";
import { getCitiesRequest } from "../requests";

export function useCitiesReco() {

    const [cities, setCities] = useState([]);

    async function citiesReco(city: string) {
        if (!city || !city.trim()) {
            setCities([]);
            return;
        }
        city = city.trim();
        await getCitiesRequest(city)
            .then(res => {
                setCities(res.data.cities)
            })
            .catch(err => {})
    }

    return (
        {
            cities,
            setCities,
            citiesReco
        }
    )
}