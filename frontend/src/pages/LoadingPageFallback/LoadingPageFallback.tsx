import Header from "../../components/Header/Header";
import './LoadingPageFallback.css'


export default function LoadingPageFallback() {
    return (
        <>
            <div style={{ height: '93vh', width: '100%', background: 'var(--dark-1)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div id="heart"></div>
            </div>
        </>
    )
}