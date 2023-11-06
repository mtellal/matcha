
import './HomePage.css'
import { ButtonMedium } from "../../components/Buttons/ButtonMedium";
import { useNavigate } from 'react-router';

export default function HomePage() {

    const navigate = useNavigate();

    return (
        <div className="homepage" >
            <div className="homepage-title-c">
                <span className='homepage-title-pink'>Love</span>
                <p className='homepage-title'>is waiting for you</p>
            </div>
            <p className='homepage-description'>Take the leap and open yourself up to the countless opportunities for love that await you</p>
            <ButtonMedium
                title="Join us"
                style={{ marginTop: '5%' }}
                onClick={() => navigate("/signin")}
            />
        </div>
    )
}