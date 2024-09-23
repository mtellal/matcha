
import './SignupInfosPage.css'
import '../../../generic.css'
import '../../../components/Inputs/InputCitiesReco/InputCitiesReco.css'

import { useCallback, useEffect, useState } from 'react';
import PickMenu from '../../../components/Picker/PickMenu/PickMenu';
import InputBiography from '../../../components/Inputs/InputBio/InputBiography';
import { ButtonWrapper } from '../../../components/Buttons/ButtonWrapper';

import arroRightIcon from '../../../assets/Arrow_Right.svg';
import { useNavigate, useOutletContext } from 'react-router';
import { getGeolocationRequest, updateUserRequest } from '../../../requests';
import InputLabel from '../../../components/Inputs/InputLabel/InputLabel';
import InputLabelIcon from '../../../components/Inputs/InputLabelIcon/InputLabelIcon';

import pinIcon from '../../../assets/Map_Pin_1.svg'
import ConsentLocation from './ConsentLocation/ConsentLocation';
import { useCitiesReco } from '../../../hooks/useCitiesReco';

import { differenceInYears, parse, isBefore } from 'date-fns'
import InputInterestsTags from './InputInterestsTags/InputInterestsTags';
import { City } from '../../../types';
import { ConfirmPage } from '../SignupPage';
import { AxiosError, AxiosResponse, formToJSON } from 'axios';
import { ButtonLarge } from '../../../components/Buttons/ButtonLarge';

export type TForm = {
    age: string,
    city: City,
    gender: string,
    sexualPreferences: string,
    biography: string,
    tag: string,
    tags: string[],
}

type InputGeolocationProps = {
    city: City,
    setCity: (c: City | ((c: City) => City)) => void,
    onSubmit: () => void
}

function InputGeolocation({ city, setCity, onSubmit }: InputGeolocationProps) {
    const { cities, setCities, citiesReco }: any = useCitiesReco();

    const [cityValue, setCityValue] = useState("")

    useEffect(() => {
        if (city && city.name)
            setCityValue(city.name)
    }, [city])


    return (
        <div style={{ position: 'relative', width: '100%' }}>
            <InputLabelIcon
                icon={pinIcon}
                label='Location'
                placeholder='Paris'
                maxLength={50}
                value={cityValue}
                setValue={setCityValue}
                onChange={citiesReco}
                onSubmit={onSubmit}
            />
            {
                cities && cities.length ?
                    <div className="inputcities-c">
                        {
                            cities.map((o: City) =>
                                <p key={o.id} onClick={() => { setCity(o); setCities([]) }}>{o.name}</p>
                            )
                        }
                    </div>
                    : null
            }
        </div>
    )
}

export default function SignupInfosPage() {

    const navigate = useNavigate();
    const { setConfirmPage, confirmPageRef }: ConfirmPage = useOutletContext();

    const [error, setError] = useState("");
    const [form, setForm] = useState({
        age: '',
        city: { name: "" },
        gender: '',
        sexualPreferences: '',
        biography: '',
        tag: '',
        tags: [],
    });

    const onSubmit = useCallback(async () => {
        let finalForm: any = {};
        if (form.age)
            finalForm.age = form.age

        // console.log(form.city)
        if (form.city.name || form.city)
            finalForm.city = form.city
        if (form.gender)
            finalForm.gender = form.gender
        if (form.sexualPreferences)
            finalForm.sexualPreferences = form.sexualPreferences
        if (form.biography)
            finalForm.biography = form.biography
        if (form.tags)
            finalForm.tags = form.tags
        await updateUserRequest(finalForm)
            .then((res: AxiosResponse) => { navigate("/signup/photos") })
            .catch((err: AxiosError) => { setError((err.response.data as any).message || "error invalid fields") })
    }, [form])

    const getLocationPosition = useCallback(() => {
        setConfirmPage((p: boolean) => !p)
        confirmPageRef.current = <ConsentLocation
            authorize={() => {
                setConfirmPage((p: boolean) => !p);
                if ("geolocation" in navigator) {
                    navigator.geolocation.getCurrentPosition(async (pos: any) => {
                        await getGeolocationRequest(pos.coords.latitude, pos.coords.longitude)
                            .then((res: AxiosResponse) => {
                                if (res.data && res.data.data)
                                    setForm((f: TForm) => ({ ...f, city: { ...res.data.data, name: res.data.data.city } }))
                            })
                    })
                }
            }}
            deny={() => { setConfirmPage((p: boolean) => !p); }}
        />
    }, [setConfirmPage, confirmPageRef.current, setForm]);


    function verifyDate(date: string) {
        const differenceAnnees = differenceInYears(new Date(), parse(date, "yyyy-MM-dd", new Date()));
        if (differenceAnnees < 18) {
            setError("Invalid date - Minimal Age required is 18")
        }
        else if (Math.abs(differenceAnnees) > 100)
            setError("Invalid date - Maximal Age required is 100")
        else setError("");
    }

    return (
        <div className="c" style={{paddingTop: '5vh'}}>
            <p className='c-title'> Tell us more about
                <span className='c-title-pink'>You</span>
            </p>
            <p className='c-description'>To uncover the most relevant profiles, we require additional details about you.</p>
            <div className='c-input-c' style={{ gap: '15px' }}>
                {error && <p className='c-error-msg'>{error}</p>}

                <InputLabel
                    label='Age'
                    placeholder='Age'
                    value={form.age}
                    setValue={(v: string) => setForm((f: TForm) => ({ ...f, age: v }))}
                    type='date'
                    onChange={verifyDate}
                    max='2100-01-10'
                    min='1923-01-10'
                />

                <InputGeolocation
                    city={form.city}
                    setCity={(v: City) => setForm((f: TForm) => ({ ...f, city: v }))}
                    onSubmit={getLocationPosition}
                />

                <PickMenu
                    title="Gender"
                    value={form.gender}
                    setValue={(v: string) => setForm((f: TForm) => ({ ...f, gender: v }))}
                    options={["male", "female"]}
                />
                <PickMenu
                    title="Sexual Preferences"
                    value={form.sexualPreferences}
                    setValue={(v: string) => setForm((f: TForm) => ({ ...f, sexualPreferences: v }))}
                    options={["male", "female"]}
                />

                <InputBiography
                    title="Biography"
                    placeholder='Tell us more about you ...'
                    value={form.biography}
                    setValue={(v: string) => setForm((f: TForm) => ({ ...f, biography: v }))}
                    maxLength={350}
                />

                <InputInterestsTags
                    form={form}
                    setForm={setForm}
                />

                <div className='c-button'>
                    <ButtonLarge
                        title="Continue"
                        onClick={onSubmit}
                    />
                    <p
                        className='cb-text-underline' style={{ marginTop: '3px' }}
                        onClick={() => navigate("/profile")}
                    >
                        Set these informations later
                    </p>
                </div>
            </div>
        </div>
    )
}