import { useEffect, useState } from "react";
import { useCitiesReco } from "../../../hooks/useCitiesReco";
import InputSmall from "../InputSmall/InputSmall";

import './InputCitiesReco.css'
import { City } from "../../../types";

type TInputCitiesReco = {
    city?: string,
    setCity: (s: City) => void
}

export function InputCitiesReco({ city, setCity }: TInputCitiesReco) {
    const [cityValue, setCityValue] = useState("");
    const { cities, setCities, citiesReco } = useCitiesReco();

    useEffect(() => {
        if (!cityValue && city)
            setCityValue(city)
    }, [city])

    return (
        <div style={{ position: 'relative' }}>
            <InputSmall
                id="inputcitiesreco"
                label="City"
                value={cityValue}
                setValue={setCityValue}
                maxLength={50}
                placeholder=""
                onChange={citiesReco}
            />
            {
                cities && cities.length ?
                    <div className="inputcities-c">
                        {
                            cities.map((o: City) =>
                                <p key={o.id} onClick={() => { setCity(o); setCityValue(o.name); setCities([]) }}>{o.name}</p>
                            )
                        }
                    </div>
                    : null
            }
        </div>
    )
}
