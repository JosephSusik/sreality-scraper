import { useState, useEffect } from "react";
import DataItem from "../interfaces/DataItem";
import ItemPreview from "./ItemPreview";

import '../styles/ListItems.css'

function ListItems() {
    const [data, setData] = useState<DataItem[]>([]);

    useEffect(() => {
      async function fetchData() {
        try {
          const response = await fetch('http://localhost:1234/data');
          const jsonData = await response.json();
          setData(jsonData);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
  
      fetchData();
    }, []);
  
    return(
      <div className="list-items">
        {data.map((item, index) => (
          <ItemPreview {...item} />
        ))}
      </div>
    );
}

export default ListItems;