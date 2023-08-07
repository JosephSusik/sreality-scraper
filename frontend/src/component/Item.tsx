import { useParams } from 'react-router';
import '../styles/Item.css'
import { useState, useEffect } from 'react';
import DataItem from '../interfaces/DataItem';
import ItemContent from './ItemContent';

let initData:DataItem = {
    inzerat_id: 0,
    title: '',
    location: '',
    price: '',
    img_arr: []
}

function Item() {
    let { id } = useParams();
    
    const [data, setData] = useState<DataItem>(initData);
    
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      async function fetchData() {
        try {
          const response = await fetch(`http://localhost:1234/data/${id}`);
          const jsonData = await response.json();
          setData(jsonData);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
  
      fetchData().then(()=>setLoading(false));
    }, [id]);


    return(
        <div className='item'>            
        {loading?
            <p>LOADING</p>
        :
            <ItemContent {...data}/>
        }
        </div>
    );
}

export default Item;