import Header from "../../components/Header/Header"

import './ErrorPage.css'

export default function ErrorPage() {
    return (
        <div className="errorpage">
            <Header />
            <div className="errorpage-c">
                <h3 className="font-14">Oops ! This page doesn't exists.</h3>
            </div>
        </div>
    )
}