
import './HomePage.css'
import { ButtonMedium } from "../../components/Buttons/ButtonMedium";
import { useNavigate } from 'react-router';

export default function HomePage() {

    const navigate = useNavigate();

    return (
        <div className="homepage" >
            <p className='c-title'>
                <span className='c-title-pink' style={{ paddingRight: '7px' }}>Love</span>
                is waiting for you</p>
            <p className='c-description'>Take the leap and open yourself up to the countless opportunities for love that await you</p>
            <ButtonMedium
                title="Join us"
                style={{ marginTop: '5%' }}
                onClick={() => navigate("/signin")}
            />
        </div>
    )
}