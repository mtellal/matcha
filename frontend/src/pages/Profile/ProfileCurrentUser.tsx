import { useCallback, useEffect, useRef, useState } from "react";

import './ProfileUser.css'
import { differenceInYears, parse } from 'date-fns'

import PhotoCarrousel from "../../components/PhotoCarrousel/PhotoCarrousel";
import ProfileCurrentUserInformations from "../../components/ProfilePage/ProfileCurrentUserInformations/ProfileCurrentUserInformations";

import { updatePhotosRequest, updateUserRequest } from "../../requests";
import { useCurrentUser } from "../../contexts/UserContext";
import { BioLabelEdit } from "./BioLabelEdit";
import { validateEmail, validateNames } from "../../utils";
import { User, UserPhoto } from "../../types";
import { ButtonLarge } from "../../components/Buttons/ButtonLarge";



export default function ProfileCurrentUser() {

    const { currentUser, setCurrentUser, userPhotosLoadedRef } = useCurrentUser();

    const [profileUser, setProfileUser] = useState<User>();
    const [editBio, setEditBio] = useState(false);
    const [loading, setLoading] = useState(false)
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
    ]);

    const [triggerUpdatePhotos, setTriggerUpdatePhotos] = useState<boolean>(false)
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const initRef = useRef(false);

    useEffect(() => {
        if (currentUser && userPhotosLoadedRef.current && !initRef.current) {
            setProfileUser(currentUser)
            if (currentUser.photos) {
                const indexPhotosUser = currentUser.photos.map(e => e.index)
                const initPhotos = photos.map(e => indexPhotosUser.includes(e.index) ? currentUser.photos.find(v => e.index === v.index) : e)
                setPhotos(initPhotos)
            }
            initRef.current = true
        }
    }, [currentUser, userPhotosLoadedRef, initRef, photos])


    function verifyInputs(user: User) {
        if (!validateEmail(user.email.trim()))
            return ("Invalid email")
        if (!validateNames(user.username.trim()))
            return ("Invalid username");
        if (!validateNames(user.firstName.trim()))
            return ("Invalid first name");
        if (!validateNames(user.lastName.trim()))
            return ("Invalid last name")
        const differenceYears = differenceInYears(new Date(), parse(user.age, "yyyy-MM-dd", new Date()));
        if (differenceYears < 18) {
            return ("Invalid Age")
        }
        return ""
    }

    const updatePhotos = useCallback(async () => {
        let updatePhotos = [];
        const prevPhotos = profileUser.photos;
        for (let i in photos) {
            if (!prevPhotos[i] ||
                (prevPhotos[i].index !== photos[i].index ||
                    prevPhotos[i].url !== photos[i].url ||
                    prevPhotos[i].file !== photos[i].file))
                updatePhotos.push(photos[i])
        }

        if (updatePhotos.length) {
            setTriggerUpdatePhotos(false)
            await updatePhotosRequest(updatePhotos)
                .catch(err => { })
        }

    }, [profileUser, photos]);

    const updateInfos = useCallback(async () => {

        const err = verifyInputs(profileUser)
        if (err) {
            setError(err)
            setSuccess(false)
            return 
        }
        const keys = ["email", "username", "firstName", "lastName", "age", "location", "city", "gender", "sexualPreferences"];

        let updateDatas: any = {};
        let update: boolean = false;

        for (let k of keys) {
            if (currentUser[k as keyof User] !== profileUser[k as keyof User]) {
                if (!update)
                    update = !update;
                updateDatas[k] = profileUser[k as keyof User];
            }
        }
        if (profileUser.tags.length !== currentUser.tags.length ||
            profileUser.tags.find((t: string) => !currentUser.tags.includes(t))) {
            update = true;
            updateDatas.tags = profileUser.tags;
        }
        if (update) {
            setLoading(true)
            await updateUserRequest(updateDatas)
                .then(() => { 
                    setCurrentUser(profileUser)
                    setLoading(false)
                    setSuccess(true)
                    setError("")
                })
                .catch(() => { 
                    setLoading(false)
                    setError("Server error (check logs)")
                })
        }
    }, [profileUser, currentUser, setCurrentUser]);

    return (
        <div className="profileuser">
            <div className="profileuser-carousel">
                <PhotoCarrousel
                    photos={photos}
                    isCurrentUser={true}
                    setPhotos={setPhotos}
                    onChangeProps={() => setTriggerUpdatePhotos(true)}
                />

                <div style={{ visibility: triggerUpdatePhotos === true ? 'visible' : 'hidden' }}>
                    <ButtonLarge
                        title="Valid"
                        style={{ marginTop: '2vh' }}
                        onClick={updatePhotos}
                    />
                </div>

                {error && <p className="font-14" style={{ color: 'var(--red)' }}>{error}</p>}
                {success && <p className="font-14" style={{ color: 'var(--green)' }}>Informations updated</p>}
            </div>

            <div className="profileuser-infos">

                <ProfileCurrentUserInformations
                    user={profileUser}
                    setUser={setProfileUser}
                    setEditInfos={updateInfos}
                    onLoad={loading}
                />
                <BioLabelEdit
                    user={currentUser}
                    profileUser={profileUser}
                    setProfileUser={setProfileUser}
                    editBio={editBio}
                    editable={true}
                    setEditBio={setEditBio}
                />
            </div>
        </div>
    )
}
