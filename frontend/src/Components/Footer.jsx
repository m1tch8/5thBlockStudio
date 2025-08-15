
import '../../src/styles/footer.css'
import FloatingIcons from './FloatingIcons'
import Logo from './Logo'

export default function Footer(){
    return(
        <>
        <div className="footer">
            <div className="footer-img-container">
                <img className="footer-img" src="/assets/generals-hero-image.png" alt="" />
            </div>
            <div className="shadow">
                
            </div>
            <div className="footer-details">
                <Logo style={{
                    display: 'flex',
                    justifyContent: 'center',
                    fontSize: '14px'
                }}/>
                <FloatingIcons/>
                <p>5th Block Studios 2025 | All Rights Reserved </p>
            </div>
        </div>
        </>
    )
}