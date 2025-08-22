
import './SignupPage.css'
import '../../generic.css'
import Input from '../../components/Inputs/Input/Input';
import { MutableRefObject, ReactNode, useEffect, useRef, useState } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { confirmAccountRequest, signupRequest } from '../../requests';
import { AxiosError } from 'axios';
import { InputIconPassword } from '../../components/Inputs/InputIcon/InputIcon';
import { ButtonWrapper } from '../../components/Buttons/ButtonWrapper';


import TagsPickerPage from '../../components/TagsPickerPage/TagsPickerPage';
import { validateEmail, validateNames } from '../../utils';
import { useSearchParams } from 'react-router-dom';
import { ButtonLarge } from '../../components/Buttons/ButtonLarge';

type TForm = {
    email: string,
    username: string,
    firstName: string,
    lastName: string,
    password: string,
    confirmPassword: string,
}

export function SignupPageForm() {

    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [form, setForm] = useState<TForm>({
        email: '',
        username: '',
        firstName: '',
        lastName: '',
        password: '',
        confirmPassword: '',

    });

    function handleError(err: AxiosError) {
        if (err.response.data && (err.response.data as any).message)
            setError((err.response.data as any).message)
        else
            setError(err.response.statusText)
    }

    async function onSignup() {
        setError("");
        let _form: TForm = form;
        for (let [key, value] of Object.entries(_form)) {
            _form[key as keyof TForm] = (value as string).trim();
        }
        const keys = Object.keys(_form);
        const values: string[] = Object.values(_form);
        let emptyOne = values.findIndex((s: string) => !s);
        if (emptyOne !== -1)
            return (setError(`${keys[emptyOne]} required`));
        if (_form.password !== _form.confirmPassword)
            return (setError("password and confirm password different"));
        if (!validateEmail(form.email))
            return (setError("Invalid email address"))
        if (!validateNames(form.firstName))
            return (setError("Invalid first name"))
        if (!validateNames(form.lastName))
            return (setError("Invalid last name"))

        await signupRequest(_form)
            .then(res => navigate("/signup/confirm"))
            .catch(err => handleError(err))
    }

    return (
        <div className="c">
            <p className='c-title'> Create your
                <span className='c-title-pink'>Account</span>
            </p>
            <p className='c-description'>Hey, are you new ? Register your information to create an account and access profiles !</p>
            <div className='c-input-c' style={{ gap: '20px' }}>
                {error && <p className='c-error-msg'>{error}</p>}
                <Input
                    id='signup-email'
                    placeholder='Email'
                    value={form.email}
                    setValue={(v: string) => setForm((f: TForm) => ({ ...f, email: v }))}
                    maxLength={40}
                />
                <Input
                    id='signup-username'
                    placeholder='Username'
                    value={form.username}
                    setValue={(v: string) => setForm((f: TForm) => ({ ...f, username: v }))}
                    maxLength={30}
                />

                <Input
                    id='signup-firstname'
                    placeholder='First name'
                    value={form.firstName}
                    setValue={(v: string) => setForm((f: TForm) => ({ ...f, firstName: v }))}
                    maxLength={40}
                />

                <Input
                    id='signup-lastname'
                    placeholder='Last name'
                    value={form.lastName}
                    setValue={(v: string) => setForm((f: TForm) => ({ ...f, lastName: v }))}
                    maxLength={40}
                />

                <InputIconPassword
                    id='signup-password'
                    placeholder='Password'
                    value={form.password}
                    setValue={(v: string) => setForm((f: TForm) => ({ ...f, password: v }))}
                    maxLength={40}
                />

                <InputIconPassword
                    id='signup-cpassword'
                    placeholder='Confirm password'
                    value={form.confirmPassword}
                    setValue={(v: string) => setForm((f: TForm) => ({ ...f, confirmPassword: v }))}
                    maxLength={40}
                />

                <div className='c-button'>
                    <ButtonLarge
                        title="Continue"
                        style={{ marginTop: '2vh' }}
                        onClick={onSignup}
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

export type ConfirmPage = {
    setConfirmPage: (b: boolean | ((b: boolean) => boolean)) => void,
    confirmPageRef: MutableRefObject<ReactNode>
}

export default function SignupPage() {

    const [confirmPage, setConfirmPage] = useState(false);
    const confirmPageRef = useRef(null);
    const [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get("token");
        if (token && token.length) {
            document.cookie = `access_token=${token}; path=/`
            navigate("/signup/informations")
            confirmAccountRequest()
        }
    }, [])

    return (
        <TagsPickerPage>
            <Outlet context={{ setConfirmPage, confirmPageRef }} />
            {confirmPage && confirmPageRef.current}
        </TagsPickerPage>
    )

}