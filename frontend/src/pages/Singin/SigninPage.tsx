import './SigninPage.css'
import '../../generic.css'
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
        <div className="c" >
            <h1 className='c-title'>Log into Your
                <span className='c-title-pink'>Account</span></h1>
            <p className='c-description'>Authenticate yourself and get access to 2000+ profiles.</p>

            <div className='c-input-c'>
                {error && <p className='c-error-msg'>{error}</p>}
                {message && <p className='c-success-msg'>{message}</p>}
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
                    <p
                        onClick={() => navigate("/signin/password")}
                        className='cb-text-underline'>Forgot your password ? </p>
                </div>
                <div className='c-button'>
                    <ButtonLarge
                        title="Signin"
                        style={{ marginTop: '2vh' }}
                        onClick={onSignin}
                    />
                    <div className='cb-text-c'>
                        <p className='cb-text'>Don't have an account ?</p>
                        <p onClick={() => navigate("/signup")} className='cb-text-underline'>Register here</p>
                    </div>
                </div>
            </div>
        </div>
    )
}