
import Header from "../Components/Header"
import Footer from "../Components/Footer"
import MusicCard from "../Components/MusicCard"
import '../styles/shop.css'


function ShopSection(){

    const musicCard = [];

    for(let x = 0; x< 8; x++){
        musicCard.push(<MusicCard key={x} />);
    }

    return(
        <div className="shop-section section">

            <div className="empty">OPENING SOON</div>
            {/* <h1 className="headings">SHOP</h1>
            <div className="music-items-container">
                {musicCard}
            </div> */}
        </div>
    )
}

export default function Shop(){
    return(
        <>
            <Header/>
            <ShopSection/>
            <Footer/>
        </>
    )
}