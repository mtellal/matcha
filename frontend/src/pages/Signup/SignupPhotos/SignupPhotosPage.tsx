
import './SignupPhotosPage.css'
import { useState } from 'react';
import { ButtonWrapper } from '../../../components/Buttons/ButtonWrapper';

import arroRightIcon from '../../../assets/Arrow_Right.svg';
import PickPhotos from '../../../components/PickPhotos/PickPhotos';

import { useNavigate } from 'react-router';
import { updatePhotosRequest } from '../../../requests';

export default function SignupPhotosPage() {

    const navigate = useNavigate();
    const [photos, setPhotos] = useState([]);


    async function onSubmit() {
        if (photos.length) {
            const _photos = photos.filter((o: string | File) => typeof o === "object");
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
        <div className="signuppagephotos-c">
            <div className="signuppagephotos-title-c">
                <p className='signuppagephotos-title'>Tell us more about</p>
                <span className='signuppagephotos-title-pink'>You</span>
            </div>
            <p className='signuppagephotos-description'>To uncover the most relevant profiles, we require additional details about you.</p>
            <div className='signup-photos-c'>
                <PickPhotos
                    title="Import some photos"
                    photos={photos}
                    setPhotos={setPhotos}
                />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <ButtonWrapper onClick={onSubmit}>
                        <h1 className='buttonlarge-title'>Profile</h1>
                        <img src={arroRightIcon} style={{ padding: '0 15px' }} />
                    </ButtonWrapper>
                </div>
            </div>

        </div>
    )
}