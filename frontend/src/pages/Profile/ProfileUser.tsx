import { useCallback, useEffect, useRef, useState } from "react";

import PhotoCarrousel from "../../components/PhotoCarrousel/PhotoCarrousel";
import { useNavigate, useParams } from "react-router";
import { getUserPhotoRequest, getUserRequest, } from "../../requests";
import { useUserSocket } from "../../contexts/UserSocketProvider";
import { useCurrentUser } from "../../contexts/UserContext";
import { User, UserPhoto } from "../../types";
import { AxiosResponse } from "axios";

import './ProfileUser.css'
import '../../components/ProfilePage/ProfileInfos/ProfileInfos.css'
import '../../components/ProfilePage/ProfileCurrentUserInformations/ProfileCurrentUserInformations.css'


import { BioLabelEdit } from "./BioLabelEdit";
import ProfileInfosUser from "../../components/ProfilePage/ProfileInfos/ProfileInfosUser/ProfileInfosUser";


import HeartBorder from '../../assets/Heart_Border.svg';
import eyeIcon from '../../assets/eye.svg';
import starIcon from '../../assets/Star.svg';
import { convertDate } from "../../utils";
import { InfoLabel, InfoLabelTags } from "../../components/ProfilePage/InfoLabel/InfoLabel";

export default function ProfileUser() {

    const { id } = useParams();
    const navigate = useNavigate();
    const { userSocket } = useUserSocket();
    const { currentUser } = useCurrentUser();

    const [isLiked, setLike] = useState(false)

    const [user, setUser] = useState<User>();
    const [photos, setPhotos] = useState([
        { index: 0, url: "", },
        { index: 1, url: "", },
        { index: 2, url: "", },
        { index: 3, url: "", },
        { index: 4, url: "", },
    ]);

    const userLoadedRef = useRef(false);

    const loadPhotos = useCallback(async (u: User) => {
        for (let i = 0; u && i < Number(u.nbPhotos); i++) {
            getUserPhotoRequest(i, parseInt(id), 800)
                .then(res => {
                    if (res && res.data) {
                        setPhotos((photos: UserPhoto[]) => photos.map((photo: UserPhoto) =>
                            photo.index === i ? { ...photo, url: window.URL.createObjectURL(new Blob([res.data])) } : photo
                        ))
                    }
                })
                .catch(err => { })
        }
    }, [id])

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
    }, [userSocket, id, navigate, loadPhotos]);

    useEffect(() => {
        if (id) {
            if (currentUser && parseInt(id) === Number(currentUser.userId))
                navigate("/profile")
            if (!userLoadedRef.current)
                loadUser();
        }
    }, [id, currentUser, userLoadedRef, loadUser, navigate])

    useEffect(() => {
        if (user) {
            setLike(user.isLiked)
        }
    }, [user])

    const likeProfile = useCallback(async () => {
        if (userSocket && user) {
            if (isLiked) {
                // console.log("emitted unlike profile event with ", props.user.userId)
                userSocket.emit("unlike", user.userId);
            }
            else {
                // console.log("emitted like profile event with ", props.user.userId)
                userSocket.emit("like", user.userId);
            }
            setLike((p: boolean) => !p)
        }
    }, [user, isLiked, userSocket]);

    return (
        <div className="profilepage-c">
            <div className="profileuser">
                <div className="profileuser-carousel">
                    <PhotoCarrousel
                        isCurrentUser={false}
                        photos={photos}
                        onLike={() => likeProfile()}
                        isLiked={isLiked}
                        setPhotos={null}
                        onChangeProps={null}
                    />
                </div>
                <>
                    <div className="profileuser-infos" >

                        <div className="profileuserpref-informations" >
                            <ProfileInfosUser user={user} isCurrentUser={true} />

                            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', color: 'white' }}>

                                <div className="profileinfos-infos">
                                    <img src={HeartBorder} style={{ height: '20px', width: '20px' }} alt="heart" />
                                    <p className="profileinfos-name">{user && String(user.likes)}</p>
                                </div>

                                <div className="profileinfos-infos">
                                    <img src={eyeIcon} className="profileinfos-infos-icon" alt="eye" />
                                    <p className="profileinfos-name">{user && String(user.views)}</p>
                                </div>

                                <div className="profileinfos-infos">
                                    <img src={starIcon} className="profileinfos-infos-icon" alt="star" />
                                    <p className="profileinfos-name">
                                        {user && String(user.fameRating)}
                                    </p>
                                </div>

                                <div className="profileinfos-infos">
                                    <div className="profileinfos-infos-icon-status" style={(true || user?.status) ? { backgroundColor: 'var(--green' } : {}} ></div>
                                    <p
                                        className="profileinfos-name"
                                        style={{ textAlign: 'start', whiteSpace: 'pre-line' }}
                                    >
                                        {`${(true || user?.status) ? "Online" : "Offline"}\n${true && user && !user.status && user.lastConnection ? convertDate(user.lastConnection) : ""}`}
                                    </p>
                                </div>
                            </div>

                            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                                <InfoLabel title="Gender" text={(user && user.gender) || "Not specified"} />
                                <InfoLabel title="Sexual Preferences" text={(user && user.sexualPreferences) || "Not specified"} />
                            </div>
                            <InfoLabelTags title="Interests Tags" tags={user && user.tags} />
                        </div>

                        <BioLabelEdit
                            user={user}
                            profileUser={user}
                            setProfileUser={null}
                            editBio={null}
                            setEditBio={null}
                            editable={false}
                        />
                    </div>
                </>
            </div>
        </div>
    )
}