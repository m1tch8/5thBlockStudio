export default function MusicCard(){

    return(
        <div className="music-card-container">
            <div className="music-card-image-container">
                <img className="music-card-image" src="../../src/assets/MixTape.jpeg" alt="music" />
                <div className="card-play-container">
                    <img className="music-card-play-btn" src="../../src/assets/playbutton.png" alt="" />
                </div>
            </div>
            <div className="music-card-details">
                <p>Like Jennie - Jennie</p>
                <p>$100.00</p>
            </div>
            <button className="transparent-btn">Add to Cart</button>
        </div>
    )
}