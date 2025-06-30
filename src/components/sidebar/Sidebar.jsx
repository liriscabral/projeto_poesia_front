import {useState} from 'react';
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
import { useNavigate } from 'react-router-dom';

function Sidebar({ isOpen, onClose, onLogout }) {
  const [activeItem, setActiveItem] = useState('inicio');
  const navigate = useNavigate();

  const menuItems = [
    { id: 'inicio', label: 'Início', 
      icon: activeItem === 'inicio' ? <IoHomeSharp size={24} /> : <IoHomeOutline size={24} />,
      action: () => navigate('/') 
    },
    { id: 'explorar', label: 'Explorar', 
      icon: activeItem === 'explorar' ? <IoSearchSharp size={24} /> : <IoSearchOutline size={24} />,
      action: () => navigate('/explorar')
    },
    { id: 'curtidas', label: 'Curtidas', 
      icon: activeItem === 'curtidas' ? <IoHeartSharp size={24} /> : <IoHeartOutline size={24} />,
      action: () => navigate('/curtidas')
    },
    { id: 'minhasPoesia', label: 'Minha Poesia', 
      icon: activeItem === 'minhaPoesia' ? <IoBookmarkSharp size={24} /> : <IoBookmarkOutline size={24} />,
      action: () => navigate('/minhaPoesia')
    },
    { id: 'perfil', label: 'Perfil', 
      icon: activeItem === 'perfil' ? <IoPersonSharp size={24} /> : <IoPersonOutline size={24} />,
      action: () => navigate('/perfil')
    },
    { id: 'sair', label: 'Sair', 
      icon: <IoLogOutOutline size={24} />, 
      isBottom: true,
      action: () => {
        if (onLogout) {
          onLogout();
        } else {
          navigate('/login');
        }
      }
    }
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
              onClick={() => {
                setActiveItem(item.id);
                if (item.action) item.action();
              }}
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