//import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
//import { useLocation } from 'react-router-dom';
//import { NavigationItemModel } from '../../models/navigation';
//import { NavigationItems } from '../../mocks/navigation';
import { UI } from '../../components';

// Assets
import Logo from '../../assets/img/logo.svg';

const NavBar = () => {
  //const location = useLocation();
  //const [menuItems, setMenuItems] = useState<NavigationItemModel[]>([]);

  //useEffect(() => {
  //  const currentUrl = location.pathname.replace('/', '');
  //  const updatedMenuItems = NavigationItems.map((el: NavigationItemModel) => {
  //    return {
  //      ...el,
  //      isActive: el.path === currentUrl,
  //    };
  //  });
  //  setMenuItems(updatedMenuItems);
  //}, [location]);

  //const navItems = menuItems.map((el: NavigationItemModel) => {
  //  return (
  //    <Link
  //      to={`/${el.path}`}
  //      key={el.title}
  //      className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium text-gray-900 ${
  //        el.isActive ? 'border-indigo-500' : 'border-b-2 border-transparent'
  //      }`}
  //    >
  //      {el.title}
  //    </Link>
  //  );
  //});

  return (
    <nav className="bg-white ">
      <div className="mx-auto px-2 md:px-10">
        <div className="flex h-16 justify-between">
          <div className="flex px-2 lg:px-0">
            <div className="flex flex-shrink-0 items-center">
              <Link to="/">
                <img
                  className="h-8 w-auto"
                  src={Logo}
                  alt="Teppich Reinigung Wien"
                />
              </Link>
            </div>
            {/*<div className="hidden lg:ml-6 lg:flex lg:space-x-8">
              {navItems}
            </div>*/}
          </div>
          <UI.SearchBar />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
