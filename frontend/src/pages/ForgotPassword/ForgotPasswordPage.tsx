
import '../../generic.css'
import Input from '../../components/Inputs/Input/Input';
import { useState } from 'react';
import { ButtonLarge } from '../../components/Buttons/ButtonLarge';
import { useNavigate } from 'react-router';
import { resetPasswordRequest } from '../../requests';

export default function ForgotPasswordPage() {

    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function onSubmit() {
        setError("");
        setLoading(true)
        const _email = email.trim();
        if (!_email)
            return (setError("Mail required"));
        await resetPasswordRequest(_email)
            .then(res => {
                navigate("/signin", { state: { message: "Email sent ! Click on the mail's link" } })
                setLoading(false)
            })
            .catch(err => {
                setError(err.response.data.message)
                setLoading(false)
            })
    }

    return (
        <div className="c" >
            <p className='c-title'>Reset your
                <span className='c-title-pink'>Password</span></p>
            <p className='c-description'>Forgot your password ? No worries, we'll send you reset instructions.</p>

            <div className='c-input-c'>
                {error && <p className='c-error-msg'>{error}</p>}
                <Input
                    id='forgetpass-firstname'
                    placeholder='Email'
                    value={email}
                    setValue={setEmail}
                    maxLength={30}
                    onSubmit={onSubmit}
                />

                <div className='c-button'>
                    <ButtonLarge
                        title="Send"
                        style={{ marginTop: '2vh' }}
                        onClick={onSubmit}
                        onLoad={loading}
                    />
                    <div className='cb-text-c'>
                        <p className='cb-text'>Have an account ?</p>
                        <p onClick={() => navigate("/signin")} className='cb-text-underline' >Authenticate here</p>
                    </div>
                </div>
            </div>

        </div>
    )
}