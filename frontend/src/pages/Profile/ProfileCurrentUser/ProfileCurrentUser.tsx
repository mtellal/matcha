import { useCallback, useEffect, useRef, useState } from "react";

import '../ProfileUser.css'
import { differenceInYears, parse } from 'date-fns'

import PhotoCarrousel from "../../../components/PhotoCar/PhotoCarrousel";
import ProfileInfos from "../../../components/ProfilePage/ProfileInfos/ProfileInfos";
import PickPhotos from "../../../components/PickPhotos/PickPhotos";

import ProfileUserPref from "../../../components/ProfilePage/ProfileUserPref/ProfileUserPref";

import { updatePhotosRequest, updateUserRequest } from "../../../requests";
import { useCurrentUser } from "../../../contexts/UserContext";
import { BioLabelEdit } from "./BioLabelEdit/BioLabelEdit";
import { validateEmail, validateNames } from "../../../utils";
import { City, User, UserPhoto } from "../../../types";
import { ButtonLarge } from "../../../components/Buttons/ButtonLarge";

//        const keys = ["email", "username", "firstName", "lastName", "age", "location", "city"];

type UpdateDatas = {
    email?: string,
    username?: string,
    firstName?: string,
    lastName?: string,
    age?: string,
    city?: City,
}


export default function ProfileCurrentUser() {

    const { currentUser, setCurrentUser, userPhotosLoadedRef } = useCurrentUser();

    const [profileUser, setProfileUser] = useState<User>();
    const [editPhotos, setEditPhotos] = useState(false);
    const [editInfos, setEditInfos] = useState(false);
    const [editBio, setEditBio] = useState(false);
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

    const initRef = useRef(false);

    useEffect(() => {
        if (currentUser && userPhotosLoadedRef.current && !initRef.current) {
            setProfileUser(currentUser)
            if (currentUser.photos) {
                const indexPhotosUser = currentUser.photos.map(e => e.index)
                const initPhotos = photos.map(e => indexPhotosUser.includes(e.index) ? currentUser.photos.find(v => e.index == v.index) : e)
                setPhotos(initPhotos)
            }
            initRef.current = true
        }
    }, [currentUser, userPhotosLoadedRef.current, initRef.current])


    function verifyInputs(user: User) {
        if (!validateEmail(user.email.trim()))
            throw ("Invalid email")
        if (!validateNames(user.username.trim()))
            throw ("Invalid username");
        if (!validateNames(user.firstName.trim()))
            throw ("Invalid first name");
        if (!validateNames(user.lastName.trim()))
            throw ("Invalid last name")
        const differenceAnnees = differenceInYears(new Date(), parse(user.age, "yyyy-MM-dd", new Date()));
        if (differenceAnnees < 18) {
            throw ("Invalid Age")
        }
    }

    const updatePhotos = useCallback(async () => {
        setEditPhotos((p: boolean) => !p);

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

    }, [profileUser, photos, currentUser]);

    const updateUserInfos = () => {
        setError("");
        try {
            verifyInputs(profileUser);
        }
        catch (e) {
            return (setError(e))
        }

        /*  const keys = ["email", "username", "firstName", "lastName", "age", "city"];
        let updateDatas: any = {};
        let update: boolean = false;
        for (let k of keys) {
            if (currentUser[k as keyof User] !== profileUser[k as keyof User]) {
                if (!update)
                    update = !update;
                updateDatas[k] = profileUser[k as keyof User];
            }
        }
        if (update) {
            await updateUserRequest(updateDatas)
                .then(() => { setCurrentUser(profileUser) })
                .catch(() => { })
        } */
    }

    const updateInfos = useCallback(async () => {
        setEditInfos((b: boolean) => !b)
        const keys = ["gender", "sexualPreferences"];
        let updateDatas: any = {};
        let update: boolean = false;
        for (let k of keys) {
            if (currentUser[k as keyof User] !== profileUser[k as keyof User]) {
                if (!update)
                    update = !update;
                updateDatas[k] = profileUser[k as keyof User];
            }
        }
        if (!profileUser.tags.length ||
            profileUser.tags.length !== currentUser.tags.length ||
            profileUser.tags.find((t: string) => !currentUser.tags.includes(t))) {
            update = true;
            updateDatas.tags = profileUser.tags;
        }
        if (update) {
            await updateUserRequest(updateDatas)
                .then(() => { setCurrentUser(profileUser) })
                .catch(() => { })
        }
    }, [profileUser, currentUser]);

    return (
        <div className="profileuser">
            <div className="profileuser-carousel">
                <PhotoCarrousel
                    key={photos}
                    currentUser={true}
                    photos={photos}
                    setPhotos={setPhotos}
                    onChangeProps= {() => setTriggerUpdatePhotos(true)}
                />

                <div style={{visibility: triggerUpdatePhotos === true ? 'visible' : 'hidden'}}>
                    <ButtonLarge
                        title="Valid"
                        style={{ marginTop: '2vh' }}
                        onClick={updatePhotos}
                    />
                </div>

                {error && <p className="font-14" style={{ color: 'var(--red)' }}>{error}</p>}
            </div>

            <div className="profileuser-infos">

                <ProfileUserPref
                    user={profileUser}
                    setUser={setProfileUser}
                    setEditInfos={updateInfos}
                    editing={editInfos}
                />

                <div className="profileuser-biolabel">
                    <BioLabelEdit
                        user={currentUser}
                        profileUser={profileUser}
                        setProfileUser={setProfileUser}
                        editBio={editBio}
                        setEditBio={setEditBio}
                    />
                </div>
            </div>
        </div>
    )
}
