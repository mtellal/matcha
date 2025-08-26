
import { useEffect, useState } from 'react';
import { useCurrentUser } from '../../contexts/UserContext'
import './ProfilePicture.css'


type TProfilePicture = {
    url: string, 
    userId: number,
    onClick?: () => void,
    style?: {}
}

export function ProfilePicture(props: TProfilePicture) {

    const [userBlocked, setUserBlocked] = useState(false);
    const { currentUser } = useCurrentUser();

    useEffect(() => {
        if (currentUser) {
            if (currentUser.blockIds && currentUser.blockIds.length && 
                currentUser.blockIds.find((id: number) => id === props.userId))
                setUserBlocked(true)
        }
    }, [currentUser, props.userId])


    return (
        <>
            {
                props.url ?
                    <img
                        src={props.url}
                        className="profilepicture-img"
                        onClick={props.onClick}
                        style={userBlocked ? { ...props.style, opacity: '60%' } : props.style}
                        alt='user profile'
                    />
                    :
                    <div
                        className='profilepicture-img'
                        style={{ background: 'var(--blue2)' }}
                        onClick={props.onClick}
                    >
                    </div>
            }
        </>
    )
}