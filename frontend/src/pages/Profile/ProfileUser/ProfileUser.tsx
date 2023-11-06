import { useCallback, useEffect, useRef, useState } from "react";

import '../ProfileUser.css'

import PhotoCarousel from "../../../components/PhotoCarousel/PhotoCarousel";
import ProfileInfos from "../../../components/ProfilePage/ProfileInfos/ProfileInfos";
import { InfoLabel, InfoLabelTags } from "../../../components/ProfilePage/InfoLabel/InfoLabel";
import { useNavigate, useParams } from "react-router";
import { getUserPhotoRequest, getUserRequest, } from "../../../requests";
import { useUserSocket } from "../../../contexts/UserSocketProvider";
import { useCurrentUser } from "../../../contexts/UserContext";
import Biolabel from "../../../components/Label/BioLabel/BioLabel";
import { User, UserPhoto } from "../../../types";
import { AxiosResponse } from "axios";


export default function ProfileUser() {

    const { id } = useParams();
    const navigate = useNavigate();
    const { userSocket } = useUserSocket();
    const { currentUser } = useCurrentUser();

    const [user, setUser] = useState<User>();
    const [photos, setPhotos] = useState([]);

    const userLoadedRef = useRef(false);

    async function loadPhotos(u: User) {
        for (let i = 0; u && i < Number(u.nbPhotos); i++) {
            getUserPhotoRequest(i, parseInt(id), 400)
                .then(res => {
                    if (res && res.data) {
                        if (i === 0)
                            setPhotos((p: UserPhoto[]) => [{ index: 0, url: window.URL.createObjectURL(new Blob([res.data])) }, ...p])
                        else
                            setPhotos((p: UserPhoto[]) => [...p, { index: 0, url: window.URL.createObjectURL(new Blob([res.data])) }])
                    }
                })
                .catch(err => { })
        }
    }

    const loadUser = useCallback(async () => {
        let u: User = null;
        userLoadedRef.current = true;
        await getUserRequest(id)
            .then((res: AxiosResponse) => {
                if (res.data && res.data.user) {
                    setUser({ ...res.data.user, id })
                    u = res.data.user;
                    if (userSocket) {
                        // console.log("emitted view event with ", id)
                        userSocket.emit("view", id)
                    }
                    else {
                        // console.log(userSocket)
                    }
                }
            })
            .catch(() => {
                navigate("/profile")
                // console.log(err)
            })
        loadPhotos(u);
    }, [userSocket]);

    useEffect(() => {
        if (id) {
            if (currentUser && parseInt(id) === Number(currentUser.userId))
                navigate("/profile")
            if (!userLoadedRef.current)
                loadUser();
        }
    }, [id, currentUser, userLoadedRef.current])

    return (
        <div className="profileuser">
            <div className="profileuser-c1">
                <div className="profileuser-carousel">
                    <PhotoCarousel photos={photos} user={user} />
                    <ProfileInfos user={user} isCurrentUser={user && currentUser && user.userId === currentUser.userId} />

                </div>
            </div>

            <div className="profileuser-infos">
                <div className="profileuserpref-informations">
                    <InfoLabel title="Gender" text={user && user.gender} />
                    <InfoLabel title="Sexual Preferences" text={user && user.sexualPreferences} />
                    <InfoLabelTags title="Interests Tags" tags={user && user.tags} seeCommonTags={true} />
                </div>

                <div className="profileuser-biolabel">
                    <Biolabel
                        title="Biography"
                        value={user && user.biography}
                    />
                </div>
            </div>
        </div>
    )
}