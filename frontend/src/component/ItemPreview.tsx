import { Link } from "react-router-dom";
import DataItem from "../interfaces/DataItem";
import '../styles/ItemPreview.css'
import LocationOnIcon from '@mui/icons-material/LocationOn';

function ItemPreview(props:DataItem) {
    return(
        <div className="item-preview">
            <Link to={`/inzerat/${props.inzerat_id}`}>
                <img src={props.img_arr[0]} alt="" />
                <div className="info">
                    <h2>{props.title}</h2>
                    <h3 className="location">
                        <LocationOnIcon className="icon"/>
                        {props.location}
                    </h3>
                    <h3 className="price">{props.price}</h3>
                </div>
            </Link>
        </div>
    );
}

export default ItemPreview;