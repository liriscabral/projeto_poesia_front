import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Sidebar.css';


import { 
  IoHomeOutline, 
  IoHomeSharp,
  IoHeartOutline,
  IoHeartSharp,
  IoBookmarkOutline,
  IoBookmarkSharp,
  IoPersonOutline,
  IoPersonSharp,
  IoLogOutOutline
} from 'react-icons/io5';

function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const menuItems = [
    { id: 'inicio', label: 'Início', path: '/home', 
      icon: location.pathname === '/home' ? <IoHomeSharp size={24} /> : <IoHomeOutline size={24} /> },
    { id: 'salvos', label: 'Salvos', path: '/salvos', 
      icon: location.pathname === '/salvos' ? <IoBookmarkSharp size={24} /> : <IoBookmarkOutline size={24} /> },
    { id: 'perfil', label: 'Perfil', path: '/perfil', 
      icon: location.pathname === '/perfil' ? <IoPersonSharp size={24} /> : <IoPersonOutline size={24} /> },
    { id: 'logout', label: 'Sair', path: '/', 
      icon: <IoLogOutOutline size={24} />, isBottom: true, onClick: handleLogout }
  ];

  return (
    <div className={`sidebar ${isOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-header">
        <h1 className="sidebar-title">
          Verso Livre
        </h1>
      </div>
      <nav>
        <ul>
          {menuItems.map((item) => (
            <li
              key={item.id}
              className={`${location.pathname === item.path ? 'active' : ''} ${item.isBottom ? 'bottom-item' : ''}`}
            >
              {item.onClick ? (
                <button onClick={item.onClick} className="sidebar-link logout-button">
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ) : (
                <Link to={item.path} className="sidebar-link">
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;