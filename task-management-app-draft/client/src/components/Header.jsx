import { Link } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';

const Header = () => {
    const { user, logout } = useUserContext();
    
    return (
        <header className="header">
            <div className="logo">
                <Link to="/">Task Manager</Link>
            </div>
            <nav>
                {user ? (
                    <button onClick={logout} className="btn btn-logout">
                        Logout
                    </button>
                ) : (
                    <>
                        <Link to="/login" className="btn btn-login">Login</Link>
                        <Link to="/register" className="btn btn-register">Register</Link>
                    </>
                )}
            </nav>
        </header>
    );
};

export default Header;