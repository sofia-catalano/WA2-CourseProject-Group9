import wallpaper from './assets/wallpaper.jpg'
import './Homepage.css';
import OutlinedCard from "./HomepageCard";

function Homepage() {
    return (
        <div style={{overflow: "hidden", position: "relative", maxHeight: "90.3vh", justifyContent: "center"}}>
            <img style={{maxHeight: "91vh", width: "100vw", marginLeft: "0rem", marginRight: "0rem"}} src={wallpaper}
                 alt={"homepage"}>
            </img>
            <div className="overlayCard">
                <OutlinedCard/>
            </div>
        </div>
    );
}

export default Homepage;