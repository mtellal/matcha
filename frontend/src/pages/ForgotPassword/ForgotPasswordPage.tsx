
import loveIllustration from '../../assets/loveIllustration1.jpg'
import cartsUsers from '../../assets/cartsUsers.svg'

import './ForgotPasswordPage.css'
import Input from '../../components/Inputs/Input/Input';
import { useState } from 'react';
import { ButtonLarge } from '../../components/Buttons/ButtonLarge';
import { useNavigate } from 'react-router';
import { resetPasswordRequest } from '../../requests';

export default function ForgotPasswordPage() {

    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    async function onSubmit() {
        setSuccess("");
        setError("");
        const _email = email.trim();
        if (!_email)
            return (setError("Mail required"));
        await resetPasswordRequest(_email)
            .then(res => setSuccess(res.data.message))
            .catch(err => setError(err.response.data.message))
    }

    return (
        <div className="frgtpassword-c" >
            <div className="frgtpassword-title-c">
                <p className='frgtpassword-title'>Reset your</p>
                <span className='frgtpassword-title-pink'>Password</span>
            </div>
            <p className='frgtpassword-description'>Forgot your password ? No worries, we'll send you reset instructions.</p>

            <div className='frgtpassword-input-c' style={{ position: 'relative' }}>
                {error && <p style={{ margin: '0', position: 'absolute', top: '-5vh', color: 'var(--red)' }}>{error}</p>}
                {success && <p style={{ margin: '0', position: 'absolute', top: '-5vh', color: 'var(--green)' }}>{success}</p>}

                <Input
                    id='forgetpass-firstname'
                    placeholder='Email'
                    value={email}
                    setValue={setEmail}
                    maxLength={30}
                    onSubmit={onSubmit}
                />

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <ButtonLarge
                        title="Send"
                        style={{ marginTop: '2vh' }}
                        onClick={onSubmit}
                    />
                    <div style={{ display: 'flex', marginTop: '5px' }}>
                        <p className='frgtpassword-fpass-raw'>Have an account ?</p>
                        <p onClick={() => navigate("/signin")} className='frgtpassword-fpass' style={{ paddingLeft: '5px' }}>Authenticate here</p>
                    </div>
                </div>
            </div>

        </div>
    )
}