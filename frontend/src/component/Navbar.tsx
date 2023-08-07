import '../styles/Navbar.css'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { Link } from 'react-router-dom';

function Navbar() {
    return(
        <nav>
            <div className='nav-content'>
                <Link to={'/'}>
                    <HomeOutlinedIcon />
                    JS Reality
                </Link>
            </div>
        </nav>
    );
}

export default Navbar;