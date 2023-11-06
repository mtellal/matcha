import { InputCitiesReco } from "../../../Inputs/InputCitiesReco/InputCitiesReco"
import InputSmall from "../../../Inputs/InputSmall/InputSmall"
import { City, User } from "../../../../types"

type ProfileInfosUserEditProps = {
    user: User,
    setUser: (u: User | ((u: User) => User)) => void
}

export default function ProfileInfosUserEdit(props: ProfileInfosUserEditProps) {

    function setEmail(s: string) { props.setUser((u: User) => ({ ...u, email: s })) }

    function setUsername(s: string) { props.setUser((u: User) => ({ ...u, username: s })) }

    function setFirstName(s: string) { props.setUser((u: User) => ({ ...u, firstName: s })) }

    function setLastName(s: string) { props.setUser((u: User) => ({ ...u, lastName: s })) }

    function setAge(s: string) { props.setUser((u: User) => ({ ...u, age: s })) }

    function setCity(c: City) { props.setUser((u: User) => ({ ...u, city: c })) }

    return (
        <>
            <InputSmall
                id="user-email"
                label="Email"
                value={props.user && props.user.email}
                setValue={setEmail}
                maxLength={30}
            />

            <InputSmall
                id="user-username"
                label="Username"
                value={props.user && props.user.username}
                setValue={setUsername}
                maxLength={30}
            />

            <InputSmall
                id="user-firstname"
                label="First name"
                value={props.user && props.user.firstName}
                setValue={setFirstName}
                maxLength={30}
            />

            <InputSmall
                id="user-lastname"
                label="Last name"
                value={props.user && props.user.lastName}
                setValue={setLastName}
                maxLength={30}
            />

            <InputSmall
                id="user-birthday"
                label="Birthday"
                value={props.user && props.user.age && props.user.age.length >= 10 && props.user.age.slice(0, 10)}
                setValue={setAge}
                type="date"
            />

            <InputCitiesReco
                city={props.user && props.user.city && props.user.city.name}
                setCity={setCity}
            />
        </>
    )
}