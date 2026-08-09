import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';

export default function Navbar() {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const linkClass = ({ isActive }) =>
    `relative pb-1 transition-colors ${
      isActive ? 'text-brass' : 'hover:text-brass text-stone'
    } after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:bg-brass after:transition-all after:duration-300 ${
      isActive ? 'after:w-full' : 'after:w-0'
    }`;

  return (
    <nav className="bg-ink text-stone px-6 py-4 flex items-center justify-between">
      <Link to="/" className="font-display text-xl tracking-tight">
        Haven &amp; Co.
      </Link>

      <div className="flex items-center gap-8 text-sm">
        <NavLink to="/" end className={linkClass}>
          Browse
        </NavLink>

        {token ? (
          <>
            <NavLink to="/favourites" className={linkClass}>
              Favourites
            </NavLink>
            <NavLink to="/my-listings" className={linkClass}>
              My Listings
            </NavLink>
            <NavLink to="/listings/new" className={linkClass}>
              + New Listing
            </NavLink>
            <span className="text-stone/50">{user?.username}</span>
            <button
              onClick={handleLogout}
              className="bg-brass text-ink px-4 py-1.5 font-medium hover:bg-stone transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className={linkClass}>
              Login
            </NavLink>
            <Link
              to="/signup"
              className="bg-brass text-ink px-4 py-1.5 font-medium hover:bg-stone transition-colors"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}