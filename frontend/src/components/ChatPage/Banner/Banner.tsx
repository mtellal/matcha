import { useCallback } from "react";

import './Banner.css'
import { ProfilePicture } from "../../ProfilePicture/ProfilePicture";
import { useNavigate, useOutletContext } from "react-router";
import { getUserAge } from "../../../utils";
import useWindowDimensions from "../../../hooks/useWindowDimensions";

import arrowLeft from '../../../assets/Arrow_Right.svg'
import { Icon } from "../../Icons/Icon";
import { User } from "../../../types";
import { MobileChatContext } from "../../../pages/Chat/ChatPage";

type BannerProps = {
    user: User
}

export default function Banner({ user }: BannerProps) {

    const contextMenu: MobileChatContext = useOutletContext();
    let setMenu: null | ((p: boolean | ((p: boolean) => boolean)) => void) = null;
    if (contextMenu)
        setMenu = contextMenu.setMenu;
    const { width } = useWindowDimensions();

    const navigate = useNavigate();

    const onClick = useCallback(() => {
        if (navigate && user)
            navigate(`/profile/${user.userId}`)
    }, [navigate, user]);

    const handleBackArrow = () => {
        setMenu((p: boolean) => !p);
        navigate('/chat')
    }

    return (
        <div className="banner">
            <div className="banner-arrow-c">
                {
                    width <= 900 &&
                    <Icon
                        className="banner-arrowleft"
                        icon={arrowLeft}
                        onClick={handleBackArrow}
                    />
                }
                <div className="banner-pp-c">
                    <ProfilePicture
                        userId={user && user.userId}
                        url={user && user.photos && user.photos[0].url}
                        style={{ height: '70%' }}
                        onClick={onClick}
                    />
                    <div className="banner-status" />
                </div>
            </div>
            <div className="banner-infos">
                <div className="banner-infos-user">
                    <p className="banner-infos-username">{user && user.firstName}, </p>
                    <p className="banner-font-18">{user && getUserAge(user.age)} -</p>
                    <p className="banner-font-16">{user && user.city && user.city.name}, </p>
                    <p className="banner-font-16">{user && user.department && user.department.name}</p>
                </div>
                <p className="banner-infos-msg">online</p>
            </div>
        </div>
    )
}