import { useState } from "react";
import DataItem from "../interfaces/DataItem";
import '../styles/ItemContent.css'
import LocationOnIcon from '@mui/icons-material/LocationOn';

function ItemContent(props:DataItem) {

    const [currentIndex, setCurrentIndex] = useState(0);

    const goToSlide = (slideIndex: any) => {
        setCurrentIndex(slideIndex);
    };
    
    return(
        <div className='item-content'>
            <div className="images">
                <div className="big-img">
                    <img src={props.img_arr[currentIndex]} alt="" />
                </div>
                <div className="small-img">
                    {props.img_arr.map((item, index)=> (
                        <div onClick={()=>goToSlide(index)} className="small-img-img">
                            <img src={item} alt="" />
                        </div>
                    ))}
                </div>
            </div>
            <div className="info">
                <div>
                    <h2>{props.title}</h2>
                    <h3 className="location">
                        <LocationOnIcon className="icon"/>
                        {props.location}
                    </h3>
                </div>
                <h3 className="price">{props.price}</h3>
            </div>
        </div>
    );
}

export default ItemContent;