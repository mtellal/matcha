import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { ButtonBorderMenu } from "../../Buttons/ButtonBorder";

import './MobileHeaderMenu.css'
import { useOutsideComponent } from "../../../hooks/useOutsideComponent";

export default function MobileHeaderMenu() {

    const navigate = useNavigate();
    const [paths, setPaths] = useState([]);
    const location = useLocation();
    const [picking, setPicking] = useState(false);

    const buttonRef = useRef(null);

    useOutsideComponent(buttonRef, () => {
        setPicking(false)
    })

    useEffect(() => {
        if (location && location.pathname) {
            if (location.pathname === "/browse")
                setPaths(["Browse", "Chat", "Profile"])
            else if (location.pathname.startsWith("/profile"))
                setPaths(["Profile", "Chat", "Browse"])
            else if (location.pathname.startsWith("/chat"))
                setPaths(["Chat", "Profile", "Browse"])
        }
    }, [location])

    const handlePick = useCallback((path: string) => {
        setPicking((p: boolean) => !p)
        if (location.pathname !== path || !location.pathname.startsWith(path))
            navigate(`/${path.toLocaleLowerCase()}`)
    }, [location])

    return (
        <div className="mobileheadermenu">
            <div ref={buttonRef} className="mobileheadermenu-button">
                <ButtonBorderMenu
                    title={paths[0]}
                    style={{ backgroundColor: 'var(--purple2)' }}
                    onClick={() => setPicking((p: boolean) => !p)} />
                {
                    picking &&
                    <div className="mobileheader-menu">
                        {
                            paths.map((p: string) => <p key={p} onClick={() => handlePick(p)}>{p}</p>)
                        }
                    </div>
                }
            </div>
        </div>
    )
}