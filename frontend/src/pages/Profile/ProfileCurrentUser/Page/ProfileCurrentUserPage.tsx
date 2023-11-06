import { Outlet, useLocation, useNavigate } from "react-router";

import './ProfileCurrentUserPage.css'
import TagsPickerPage from "../../../../components/TagsPickerPage/TagsPickerPage";


export default function ProfileCurrentUserPage() {

    const location = useLocation();
    const navigate = useNavigate();

    return (
        <div className="profilepage-c">
            <TagsPickerPage>
                <div className="profilepage-menu">
                    <p
                        style={location.pathname === "/profile" ? { color: 'white', cursor: 'unset' } : {}}
                        onClick={() => navigate("/profile")}
                    >profile</p>
                    <p
                        style={location.pathname === "/profile/likes" ? { color: 'white', cursor: 'unset' } : {}}
                        onClick={() => navigate("/profile/likes")}
                    >likes</p>
                    <p
                        style={location.pathname === "/profile/views" ? { color: 'white', cursor: 'unset' } : {}}
                        onClick={() => navigate("/profile/views")}
                    >views</p>
                </div>
                <Outlet />
            </TagsPickerPage>
        </div>
    )
}