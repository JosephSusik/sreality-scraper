import './App.css';
import Item from './component/Item';
import ListItems from './component/ListItems';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './component/Navbar';

function App() {
  return (    
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<ListItems />} />  
          <Route path='/inzerat/:id' element={<Item />} />  
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
