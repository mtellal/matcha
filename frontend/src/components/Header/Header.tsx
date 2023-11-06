
import './Header.css'

import heart from '../../assets/Heart_Header.svg'
import { Location, useLocation, useNavigate } from 'react-router'
import { useCallback } from 'react';

export default function Header() {

    const navigate = useNavigate();
    const location: Location = useLocation()

    const handleClick = useCallback(() => {
        if (location.pathname && location.pathname !== "/")
            navigate("/")
    }, [location.pathname])

    return (
        <header className="header" >
            <div className="header-c1" >
                <img className="header-logo" src={heart} />
                <h2 className="header-name" onClick={handleClick}>Matcha</h2>
            </div>
        </header>
    )
}