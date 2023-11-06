import MenuFilter from "./MenuFilter";
import MenuFilterSearch from "./MenuFilterSearch";
import MenuSort from "./Sort";

import './BrowserMenu.css'
import { User } from "../../../types";

type BrowserMenu = {
    user: User,
}

export default function BrowserMenu(props: BrowserMenu) {

    return (
        <div className="browsermenu" >
            <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                <MenuFilterSearch title="Advanced Search" {...props} />
            </div>
            <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                <MenuFilter title="Filter" />
            </div>
            <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                <MenuSort title="Sort" />
            </div>
        </div>
    )
}
