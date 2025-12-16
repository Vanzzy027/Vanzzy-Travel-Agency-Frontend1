// src/layouts/UserSidebar.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home,
  Car,
  CalendarDays,
  CreditCard,
  Settings,
  HelpCircle,
  LogOut,
  User
} from 'lucide-react';

const UserSidebar: React.FC = () => {
  const { user } = useSelector((state: any) => state.auth); 
  const userFromStorage = JSON.parse(localStorage.getItem('user') || '{}');
  const displayUser = user || userFromStorage;
  const userInitial = displayUser?.first_name ? displayUser.first_name[0].toUpperCase() : 'U';
  
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: 'Overview', path: '/UserDashboard' },
    { icon: Car, label: 'Browse Vehicles', path: '/UserDashboard/vehicles' },
    { icon: CalendarDays, label: 'My Bookings', path: '/UserDashboard/my-bookings' },
    { icon: CreditCard, label: 'Payments', path: '/UserDashboard/my-payments' },
    { icon: Settings, label: 'Settings', path: '/UserDashboard/settings' },
  ];

  const bottomItems = [
    { icon: HelpCircle, label: 'Support', path: '/UserDashboard/support' },
    { icon: User, label: 'Review', path: '/UserDashboard/review'},
    { icon: LogOut, label: 'Logout', path: '/logout' }, 
  ];

  return (
    <div className="w-64 bg-[#001524] h-screen flex flex-col border-r border-[#445048]">
      
      {/* Brand / Logo Area */}
      <div className="p-6 border-b border-[#445048]">
        <h2 className="text-2xl font-bold text-[#E9E6DD]">
          Rental<span className="text-[#F57251]">App</span>
        </h2>
      </div>

      {/* Main Navigation - Scrollable */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <p className="px-3 text-xs font-semibold text-[#C4AD9D] uppercase tracking-wider mb-2">Menu</p>
        {menuItems.map((item, index) => {
          const isActive = item.path === '/UserDashboard' 
            ? location.pathname === '/UserDashboard'
            : location.pathname.startsWith(item.path);
          
          return (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive: active }) => `
                flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 mb-1
                ${active 
                  ? 'bg-[#027480] text-[#E9E6DD] shadow-md shadow-[#027480]/20' 
                  : 'text-[#C4AD9D] hover:bg-[#445048]/50 hover:text-[#E9E6DD]'}
              `}
              end={item.path === '/UserDashboard'}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          );
        })}

        <div className="pt-6">
          <p className="px-3 text-xs font-semibold text-[#C4AD9D] uppercase tracking-wider mb-2">Other</p>
          {bottomItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className="flex items-center space-x-3 px-3 py-3 rounded-lg text-[#C4AD9D] hover:bg-[#445048]/50 hover:text-[#F57251] transition-all duration-200 mb-1"
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Mini Profile Section */}
      <div className="p-4 border-t border-[#445048] bg-[#00101f]">
        <div className="flex items-center space-x-3 p-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#027480] to-[#F57251] flex items-center justify-center text-[#E9E6DD] font-bold">
            {userInitial}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-[#E9E6DD] text-sm font-semibold truncate">
              {displayUser?.first_name || 'Guest'}
            </p>
            <p className="text-[#C4AD9D] text-xs truncate">View Profile</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSidebar;

// import React from 'react';
// import { useSelector } from 'react-redux';
// import { Link, useLocation } from 'react-router-dom';

// const UserSidebar: React.FC = () => {
//   const { user } = useSelector((state: any) => state.auth); 
//   const userFromStorage = JSON.parse(localStorage.getItem('user') || '{}');
//   const displayUser = user || userFromStorage;
//   const userInitial = displayUser?.first_name ? displayUser.first_name[0].toUpperCase() : 'U';
  
//   const location = useLocation();

//   const menuItems = [
//     { icon: '🏠', label: 'Overview', path: '/UserDashboard' }, // Renamed from Dashboard to Overview
//     { icon: '🚗', label: 'Browse Vehicles', path: '/UserDashboard/vehicles' },
//     { icon: '📋', label: 'My Bookings', path: '/UserDashboard/my-bookings' },
//     { icon: '💰', label: 'Payments', path: '/UserDashboard/payments' },
//     { icon: '⚙️', label: 'Settings', path: '/UserDashboard/settings' },
//   ];

//   const bottomItems = [
//      { icon: '🦺', label: 'Support', path: '/UserDashboard/emergency'},
//      { icon: '🚪', label: 'Logout', path: '/logout' }, 
//   ];

//   return (
//     <div className="w-72 bg-[#001524] border-r border-[#445048] min-h-screen flex flex-col shadow-2xl z-20">
      
//       {/* Brand / Logo Area */}
//       <div className="p-8 pb-4">
//         <h2 className="text-2xl font-bold text-[#E9E6DD] tracking-tight">
//           Rental<span className="text-[#F57251]">App</span>
//         </h2>
//       </div>

//       {/* Main Navigation */}
//       <nav className="flex-1 px-4 space-y-2 mt-4">
//         <p className="px-4 text-xs font-semibold text-[#C4AD9D] uppercase tracking-wider mb-2">Menu</p>
//         {menuItems.map((item, index) => {
//           // Exact match for dashboard home, startsWith for others
//           const isActive = item.path === '/UserDashboard' 
//             ? location.pathname === '/UserDashboard'
//             : location.pathname.startsWith(item.path);
          
//           return (
//             <Link
//               key={index}
//               to={item.path}
//               className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
//                 isActive 
//                   ? 'bg-[#027480] text-[#E9E6DD] shadow-lg shadow-[#027480]/20 translate-x-1' 
//                   : 'text-[#C4AD9D] hover:bg-[#445048]/50 hover:text-[#E9E6DD]'
//               }`}
//             >
//               <span className={`text-xl ${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform`}>{item.icon}</span>
//               <span className="font-medium">{item.label}</span>
//             </Link>
//           );
//         })}

//         <div className="pt-8">
//            <p className="px-4 text-xs font-semibold text-[#C4AD9D] uppercase tracking-wider mb-2">Other</p>
//            {bottomItems.map((item, index) => (
//              <Link
//                key={index}
//                to={item.path}
//                className="flex items-center space-x-3 px-4 py-3.5 rounded-xl text-[#C4AD9D] hover:bg-[#445048]/50 hover:text-[#F57251] transition-all duration-200"
//              >
//                <span className="text-xl">{item.icon}</span>
//                <span className="font-medium">{item.label}</span>
//              </Link>
//            ))}
//         </div>
//       </nav>

//       {/* Mini Profile Section */}
//       <div className="p-4 border-t border-[#445048] bg-[#00101f]">
//         <div className="flex items-center space-x-3 p-2 rounded-xl">
//           <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#027480] to-[#F57251] flex items-center justify-center text-[#E9E6DD] font-bold shadow-md">
//             {userInitial}
//           </div>
//           <div className="flex-1 overflow-hidden">
//             <p className="text-[#E9E6DD] text-sm font-semibold truncate">
//                {displayUser?.first_name || 'Guest'}
//             </p>
//             <p className="text-[#C4AD9D] text-xs truncate">View Profile</p>
//           </div>
//         </div>
//       </div>

//     </div>
//   );
// };

// export default UserSidebar;

