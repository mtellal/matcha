
import '../../generic.css'
import { useEffect, useState } from 'react';
import { ButtonLarge } from '../../components/Buttons/ButtonLarge';
import { useNavigate } from 'react-router';
import { updatePasswordRequest } from '../../requests';
import { useSearchParams } from 'react-router-dom';

import { InputIconPassword } from '../../components/Inputs/InputIcon/InputIcon';
import { AxiosError, AxiosResponse } from 'axios';

export default function ResetPasswordPage() {

    const navigate = useNavigate();
    const [params] = useSearchParams();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (params) {
            if (!params.get("token"))
                navigate("/signin")
            else
                document.cookie = `access_token=${params.get("token")}; path=/`
        }
    }, [navigate, params])


    function handleError(err: AxiosError) {
        if (err.response.data && (err.response.data as any).message) {
            if ((err.response.data as any).message === "Invalid token")
                setError("Session expired, please ask a new mail");
            else
                setError((err.response.data as any).message);
        }
        else
            setError(err.response.statusText);
    }


    function handleSuccess(res: AxiosResponse) {
        if (res.data && res.data.message) {
            navigate("/signin", { state: { message: "Password updated !" } })
        }
    }

    async function onSubmit() {
        setError("");
        setSuccess("");
        const _password = password.trim();
        const _confirmPassword = confirmPassword.trim();
        if (!_password)
            return (setError("Password required"));
        if (!_confirmPassword)
            return (setError("Confirm password required"));
        if (_password !== _confirmPassword)
            return (setError("Password and Confirm password different"));
        await updatePasswordRequest(_password)
            .then(res => handleSuccess(res))
            .catch(err => handleError(err))
    }

    function resetInfo() {
        setError("");
        setSuccess("");
    }

    return (
        <div className="c" >
            <p className='c-title'>
                Reset your<span className='c-title-pink'>Password</span>
            </p>
            <p className='c-description'>Set a new password to your account. We recommand you to choose a strong password with at least 8 characters with letters, numbers and special charachters.</p>

            <div className='c-input-c'>
                {error && <p className='c-error-msg'>{error}</p>}
                {success && <p className='c-success-msg'>{success}</p>}

                <InputIconPassword
                    id='reset-newpass'
                    placeholder='New password'
                    value={password}
                    setValue={setPassword}
                    maxLength={30}
                    style={{ width: '400px' }}
                    onSubmit={onSubmit}
                    onChange={resetInfo}
                />

                <InputIconPassword
                    id='reset-cnewpass'
                    placeholder='Confirm new password'
                    value={confirmPassword}
                    setValue={setConfirmPassword}
                    maxLength={30}
                    style={{ width: '400px' }}
                    onSubmit={onSubmit}
                    onChange={resetInfo}
                />

                <div className='c-button'>
                    <ButtonLarge
                        title="Reset"
                        style={{ marginTop: '2vh' }}
                        onClick={onSubmit}
                    />
                    <div className='cb-text-c'>
                        <p className='cb-text'>Have an account ?</p>
                        <p onClick={() => navigate("/signin")} className='cb-text-underline'>Authenticate here</p>
                    </div>
                </div>
            </div>

        </div>
    )
}