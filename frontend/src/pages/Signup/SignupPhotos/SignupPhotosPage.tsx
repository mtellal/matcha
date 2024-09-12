
import './SignupPhotosPage.css'
import '../../../generic.css'
import { useState } from 'react';
import { ButtonWrapper } from '../../../components/Buttons/ButtonWrapper';

import arroRightIcon from '../../../assets/Arrow_Right.svg';
import PickPhotos from '../../../components/PickPhotos/PickPhotos';

import { useNavigate } from 'react-router';
import { updatePhotosRequest } from '../../../requests';
import { ButtonLarge } from '../../../components/Buttons/ButtonLarge';
import PhotoCarrousel from '../../../components/PhotoCarrousel/PhotoCarrousel';
import PhotoCar from '../../../components/PhotoCarrousel/PhotoCarrousel';
import { UserPhoto } from '../../../types';

export default function SignupPhotosPage() {

    const navigate = useNavigate();
    const [photos, setPhotos] = useState<UserPhoto[]>([
        {
            index: 0,
            url: "",
        },
        {
            index: 1,
            url: "",
        },
        {
            index: 2,
            url: "",
        },
        {
            index: 3,
            url: "",
        },
        {
            index: 4,
            url: "",
        }
    ])

    async function onSubmit() {
        if (photos.length) {
            const _photos = photos.filter((o) => typeof o === "object");
            if (_photos && _photos.length) {
                try {
                    const res = await updatePhotosRequest(_photos)
                    if (res && res.status === 200) {
                        navigate("/profile")
                    }
                }
                catch (e) {
                    // console.log(e)
                }
            }
        }
        navigate("/profile")
    }

    return (
        <div className="c">
            <p className='c-title'>Tell us more about
                <span className='c-title-pink'>You</span>
            </p>
            <p className='c-description'>To uncover the most relevant profiles, we require additional details about you.</p>
            <div className='signup-photos-c'>
                <PhotoCarrousel 
                    photos={photos}
                    setPhotos={setPhotos}
                />

            </div>
            <ButtonLarge
                title="Valid"
                style={{ marginTop: '2vh' }}
                onClick={onSubmit}
            />

        </div>
    )
}