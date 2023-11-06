
import { useEffect, useState } from 'react';
import { useCurrentUser } from '../../contexts/UserContext'
import './ProfilePicture.css'


type TProfilePicture = {
    userId: number, 
    url: string, 
    onClick?: () => void,
    style?: {}
}

export function ProfilePicture(props: TProfilePicture) {

    const [userBlocked, setUserBlocked] = useState(false);
    const {currentUser} = useCurrentUser();

    useEffect(() => {
        if (currentUser && currentUser.blockIds && currentUser.blockIds.length) {
            if (currentUser.blockIds.find((id: number) => id === props.userId))
                setUserBlocked(true)
        }
    }, [currentUser, props.userId])

    return (
        <img 
            src={props.url} 
            className="profilepicture-img" 
            onClick={props.onClick}
            style={userBlocked ? {...props.style, opacity: '60%'} : props.style}
        />
    )
}