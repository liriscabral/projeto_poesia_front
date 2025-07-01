import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Sidebar.css';
import { FaThreads } from 'react-icons/fa6';

import { 
  IoHomeOutline, 
  IoHomeSharp,
  IoSearchOutline,
  IoSearchSharp,
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
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeItem, setActiveItem] = useState('inicio');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { id: 'inicio', label: 'Início', path: '/home', 
      icon: location.pathname === '/home' ? <IoHomeSharp size={24} /> : <IoHomeOutline size={24} /> },
    { id: 'explorar', label: 'Explorar', path: '/explorar', 
      icon: location.pathname === '/explorar' ? <IoSearchSharp size={24} /> : <IoSearchOutline size={24} /> },
    { id: 'curtidas', label: 'Curtidas', path: '/curtidas', 
      icon: location.pathname === '/curtidas' ? <IoHeartSharp size={24} /> : <IoHeartOutline size={24} /> },
    { id: 'minhasPoesia', label: 'Minha Poesia', path: '/minhas-poesias', 
      icon: location.pathname === '/minhas-poesias' ? <IoBookmarkSharp size={24} /> : <IoBookmarkOutline size={24} /> },
    { id: 'perfil', label: 'Perfil', path: '/perfil', 
      icon: location.pathname === '/perfil' ? <IoPersonSharp size={24} /> : <IoPersonOutline size={24} /> },
    { id: 'logout', label: 'Sair', path: '/', 
      icon: <IoLogOutOutline size={24} />, isBottom: true, onClick: handleLogout }
  ];

  return (
    <div className={`sidebar ${isOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-header">
        <h1 className="sidebar-title">
          {/* <FaThreads style={{ marginRight: '10px', color: '#000' }} /> */}
          Poesia Livre
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