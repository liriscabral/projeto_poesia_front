import React, {useState} from 'react';
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
  const [activeItem, setActiveItem] = useState('inicio');

  const menuItems = [
    { id: 'inicio', label: 'Início', 
      icon: activeItem === 'inicio' ? <IoHomeSharp size={24} /> : <IoHomeOutline size={24} /> },
    { id: 'explorar', label: 'Explorar', 
      icon: activeItem === 'explorar' ? <IoSearchSharp size={24} /> : <IoSearchOutline size={24} /> },
    { id: 'curtidas', label: 'Curtidas', 
      icon: activeItem === 'curtidas' ? <IoHeartSharp size={24} /> : <IoHeartOutline size={24} /> },
    { id: 'salvos', label: 'Salvos', 
      icon: activeItem === 'salvos' ? <IoBookmarkSharp size={24} /> : <IoBookmarkOutline size={24} /> },
    { id: 'perfil', label: 'Perfil', 
      icon: activeItem === 'perfil' ? <IoPersonSharp size={24} /> : <IoPersonOutline size={24} /> },
    { id: 'sair', label: 'Sair', 
      icon: <IoLogOutOutline size={24} />, isBottom: true }
  ];

  return (
    <div className={`sidebar ${isOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-header">
        <h1 className="sidebar-title">
          <FaThreads style={{ marginRight: '10px', color: '#000' }} />
          Poesia Livre
        </h1>
      </div>
      <nav>
        <ul>
          {menuItems.map((item) => (
            <li
              key={item.id}
              className={`${activeItem === item.id ? 'active' : ''} ${item.isBottom ? 'bottom-item' : ''}`}
              onClick={() => setActiveItem(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;