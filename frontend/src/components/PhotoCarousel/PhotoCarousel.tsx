import React, { useCallback, useEffect, useState } from "react";

import './PhotoCarousel.css'

import ArrowRightIcon from '../../assets/Arrow_Right.svg'
import HeartBorder from '../../assets/Heart_Border.svg';
import HeartFill from '../../assets/Heart_Fill.svg';
import HeartBlue from '../../assets/Heart_Blue.svg';
import Edit from '../../assets/Edit_Pencil.svg';
import { Icon } from "../Icons/Icon";
import { RoundIconBorder } from "../Icons/RoundIconBorder";
import { useUserSocket } from "../../contexts/UserSocketProvider";
import { useLikesContext } from "../../contexts/LikesProvider";
import { useCurrentUser } from "../../contexts/UserContext";
import { User, UserPhoto } from "../../types";


type PhotoCarouselProps = {
    user: User,
    photos: UserPhoto[],
    onClickIcon?: () => void,
    isCurrentUser?: boolean
}


export default function PhotoCarousel(props: PhotoCarouselProps) {

    const { userSocket } = useUserSocket();
    const { currentUser } = useCurrentUser();

    const { userIdsRef } = useLikesContext();
    const [userLiked, setUserLiked] = useState(props.user && props.user.isLiked);
    const [userLikeYou, setUserLikeYou] = useState(false)
    const [index, setIndex] = useState(props.photos.length >= 2 ? 1 : 0);

    useEffect(() => {
        if (props.user) {
            setUserLiked(props.user.isLiked)
            if (userIdsRef.current && userIdsRef.current.length) {
                if (userIdsRef.current.find((id: number) => Number(id) === Number(props.user.userId)))
                    setUserLikeYou(true)
            }
            else
                setUserLikeYou(false);
        }
    }, [props.user, userIdsRef.current])

    const likeProfile = useCallback(async () => {
        if (props.isCurrentUser)
            return;
        setUserLiked((p: boolean) => !p)
        if (userSocket) {
            if (userLiked && props.user) {
                // console.log("emitted unlike profile event with ", props.user.userId)
                userSocket.emit("unlike", props.user.userId);
            }
            else {
                // console.log("emitted like profile event with ", props.user.userId)
                userSocket.emit("like", props.user.userId);
            }
        }
    }, [props.user, userLiked, userSocket]);

    return (
        <div className="photocarousel" >
            <div className="photocarousel-c2">
                {
                    props.photos.length >= 2 && index - 1 >= 0 && props.photos[index - 1] &&
                    <>
                        <img src={props.photos[index - 1].url}
                            className="photocarousel-i2"
                        />
                        <div className="photocarousel-shadow-left">
                            <Icon
                                icon={ArrowRightIcon}
                                style={{ height: '25px', transform: 'rotate(180deg)' }}
                                onClick={() => setIndex((i: number) => i > 0 ? i - 1 : i)}
                            />
                        </div>
                    </>
                }
            </div>

            <div className="photocarousel-c1-c">
                <div className="photocarousel-c1">
                    <img
                        src={props.photos.length >= index && props.photos[index] && props.photos[index].url}
                        className="photocarousel-i2"
                        style={currentUser && currentUser.blockIds && currentUser.blockIds.length && props.user &&
                            currentUser.blockIds.find((id: number) => id === props.user.userId) ?
                            { opacity: '50%' } : {}
                        }
                    />
                    <div className="photocarousel-heart1" onClick={likeProfile} >
                        {
                            props.isCurrentUser ?
                                <RoundIconBorder
                                    icon={Edit}
                                    onClick={props.onClickIcon}
                                    style={{ height: '100%', width: '100%' }}
                                /> :
                                <>
                                    {
                                        userLiked ?
                                            <img src={HeartFill} style={{ height: '100%', width: '100%' }} /> :
                                            <img src={HeartBorder} style={{ height: '100%', width: '100%' }} />
                                    }
                                </>

                        }
                    </div>
                    {
                        !props.isCurrentUser && userLikeYou &&
                        <img src={HeartBlue} className="photocarousel-heart2" />
                    }
                </div>
                {
                    !props.isCurrentUser && userLikeYou &&
                    <p className="photocarousel-like-text" >liked you</p>
                }
            </div>

            <div className="photocarousel-c2">
                {
                    props.photos.length >= index + 1 && props.photos[index + 1] &&
                    <>
                        <img src={props.photos[index + 1].url}
                            className="photocarousel-i2"
                        />
                        <div className="photocarousel-shadow-right">
                            <Icon
                                icon={ArrowRightIcon}
                                style={{ height: '25px', }}
                                onClick={() => setIndex((i: number) => i < props.photos.length ? i + 1 : i)}
                            />
                        </div>
                    </>
                }
            </div>
        </div>
    )
}
