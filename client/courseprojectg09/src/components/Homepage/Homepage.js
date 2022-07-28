import wallpaper from './assets/wallpaper.jpg'
import './Homepage.css';
import OutlinedCard from "./HomepageCard";

function Homepage() {
    return (
        <div style={{ overflow: "hidden"}}>
            <div style={{ overflowX: "hidden", position: "relative", maxHeight: "93vh", overflowY: "hidden", justifyContent: "center" }}>
                <img style={{ maxHeight: "93vh", width: "100vw", marginLeft: "0rem", marginRight: "0rem" }} src={wallpaper} alt={"homepage"}>
                </img>
                <div className="overlayCard">
                    <OutlinedCard/>
                </div>
            </div>

        </div>
    );
}

export default Homepage;