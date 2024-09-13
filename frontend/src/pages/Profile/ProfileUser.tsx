import { useCallback, useEffect, useRef, useState } from "react";


import PhotoCarrousel from "../../components/PhotoCarrousel/PhotoCarrousel";
import { useNavigate, useParams } from "react-router";
import { getUserPhotoRequest, getUserRequest, } from "../../requests";
import { useUserSocket } from "../../contexts/UserSocketProvider";
import { useCurrentUser } from "../../contexts/UserContext";
import { User, UserPhoto } from "../../types";
import { AxiosResponse } from "axios";


import './ProfileUser.css'
import ProfileUserPref from "../../components/ProfilePage/ProfileUserPref/ProfileUserPref";
import { BioLabelEdit } from "./BioLabelEdit";

export default function ProfileUser() {

    const { id } = useParams();
    const navigate = useNavigate();
    const { userSocket } = useUserSocket();
    const { currentUser } = useCurrentUser();

    const [user, setUser] = useState<User>();
    const [photos, setPhotos] = useState([
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

    const userLoadedRef = useRef(false);

    async function loadPhotos(u: User) {
        for (let i = 0; u && i < Number(u.nbPhotos); i++) {
            getUserPhotoRequest(i, parseInt(id), 400)
                .then(res => {
                    if (res && res.data) {
                        setPhotos((photos: UserPhoto[]) => photos.map((photo: UserPhoto) =>
                            photo.index === i ? { ...photo, url: window.URL.createObjectURL(new Blob([res.data])) } : photo
                        ))
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
        <div className="profilepage-c">

            <div className="profileuser">
                <div>

                    <div className="profileuser-carousel">
                        <PhotoCarrousel
                            currentUser={false}
                            photos={photos}
                            user={user}
                        />
                    </div>

                    <div className="profileuser-infos">

                        <ProfileUserPref
                            user={user}
                            setUser={null}
                            setEditInfos={null}
                            editing={false}
                            editable={false}
                        />
                        <BioLabelEdit
                            user={user}
                            profileUser={user}
                            setProfileUser={null}
                            editBio={null}
                            setEditBio={null}
                            editable={false}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}