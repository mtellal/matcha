import './SigninPage.css'
import Input from '../../components/Inputs/Input/Input';
import { useEffect, useState } from 'react';
import { ButtonLarge } from '../../components/Buttons/ButtonLarge';
import { useLocation, useNavigate } from 'react-router';
import { signinRequest } from '../../requests';
import { AxiosError, AxiosResponse } from 'axios';
import { InputIconPassword } from '../../components/Inputs/InputIcon/InputIcon';

export default function SigninPage() {

    const navigate = useNavigate();
    const location = useLocation();

    const [error, setError] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        document.cookie = 'access_token=; path=/';
        if (location.state && location.state.message)
            setMessage(location.state.message);
    }, [])

    function handleError(error: AxiosError) {
        if (error.response.data && (error.response.data as any).message) {
            setError((error.response.data as any).message);
        }
        else
            setError(`Error: ${error.response.statusText}`);
    }

    function handleSuccess(res: AxiosResponse) {
        if (res.data && res.data.token) {
            document.cookie = `access_token=${res.data.token}; path=/`;
            navigate("/profile");
        }
    }

    async function onSignin() {
        let _username = username.trim();
        let _password = password.trim();
        if (!_username)
            return (setError("Username required"));
        if (!_password)
            return (setError("Password required"));
        await signinRequest(_username, _password)
            .then(res => handleSuccess(res))
            .catch(err => handleError(err))
    }

    return (
        <div className="signinpage-c" >
            <div className="signinpage-title-c">
                <p className='signinpage-title'>Log into Your</p>
                <span className='signinpage-title-pink'>Account</span>
            </div>
            <p className='signinpage-description'>Authenticate yourself and get access to 2000+ profiles.</p>

            {error && <p style={{ color: 'var(--red)', margin: '10px 0' }}>{error}</p>}
            {message && <p style={{ color: 'var(--green)' }}>{message}</p>}
            <div className='signinpage-input-c' style={{ position: 'relative' }}>
                <Input
                    id='singin-username'
                    placeholder='Username'
                    value={username}
                    setValue={setUsername}
                    maxLength={20}
                    onSubmit={onSignin}
                    onChange={() => setError("")}
                />

                <div className='signinpage-pass'>
                    <InputIconPassword
                        id='signin-password'
                        placeholder='Password'
                        value={password}
                        setValue={setPassword}
                        maxLength={40}
                        onSubmit={onSignin}
                        onChange={() => setError("")}
                    />
                    <p onClick={() => navigate("/signin/password")} className='signinpage-fpass'>Forgot your password ? </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <ButtonLarge
                        title="Signin"
                        style={{ marginTop: '2vh' }}
                        onClick={onSignin}
                    />
                    <div style={{ display: 'flex', marginTop: '5px' }}>
                        <p className='signinpage-fpass-raw'>Don't have an account ?</p>
                        <p onClick={() => navigate("/signup")} className='signinpage-fpass' style={{ paddingLeft: '5px' }}>Register here</p>
                    </div>
                </div>
            </div>
        </div>
    )
}