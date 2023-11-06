import { useCallback } from 'react'
import pinIcon from '../../../assets/Map_Pin.svg'

import './UserCart.css'
import { useNavigate } from 'react-router';
import HeartBlue from '../../../assets/Heart_Blue.svg'
import { useCurrentUser } from '../../../contexts/UserContext';
import { getUserAge } from '../../../utils';
import { User, UserPhoto } from '../../../types';


type TUserCart = {
    user: User,
    profilePicture: string
}

export function UserCart({ user, profilePicture }: TUserCart) {

    const { currentUser } = useCurrentUser();

    const navigate = useNavigate();

    const navigateProfile = useCallback(async () => {
        navigate(`/profile/${user.userId}`, { state: { user: user } })
    }, [user])

    // console.log(profilePicture)

    return (
        <div className="usercart-user-c" onClick={navigateProfile}>
            <div style={{ position: 'relative', minHeight: '70%' }}>
                <img
                    loading='lazy'
                    className="usercart-user-img"
                    src={profilePicture}
                    style={
                        currentUser && currentUser.blockIds && currentUser.blockIds.length && user &&
                            currentUser.blockIds.find((id: number) => id === user.userId) ?
                            { opacity: '50%' } : {}
                    }
                />
                {user.likedYou ? <img src={HeartBlue} className='usrcart-heart' /> : null}
            </div>
            <div className="usercart-user-infos">
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <h1 className="usercart-username" style={user && user.age ? {} : { fontSize: '24px' }}>
                        {user && user.firstName}{user && user.age ? `, ${getUserAge(user.age)}` : ''}
                    </h1>
                    <div className="likepage-localisation-c">
                        <p>{user && String(user.fameRating)}</p>
                    </div>
                </div>
                {
                    user && user.city && user.city.name &&
                    user.department && user.region &&
                    <div style={{ width: '100%', overflow: 'hidden' }}>
                        <div className="likepage-localisation-c">
                            <img src={pinIcon} />
                            <p className='usercart-city'>{user.city.name}</p>
                        </div>
                        <p className='usercart-city font-12' >{`${user.department.name}, ${user.region.name}`}</p>
                    </div>
                }
                {
                    user &&
                    <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                        <p className={user.distance ? "font-14" : "font-12-second"}>
                            {user.distance ? user.distance : "Same city from you"}
                        </p>
                        {
                            user.distance > 0 &&
                            <p className='font-12-second'>  km away from you</p>
                        }
                    </div>
                }
            </div>
        </div>
    )
}