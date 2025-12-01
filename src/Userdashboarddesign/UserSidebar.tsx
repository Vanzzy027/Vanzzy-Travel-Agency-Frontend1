import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

const UserSidebar: React.FC = () => {
  const { user } = useSelector((state: any) => state.auth); 
  const userFromStorage = JSON.parse(localStorage.getItem('user') || '{}');
  const displayUser = user || userFromStorage;
  const userInitial = displayUser?.first_name ? displayUser.first_name[0].toUpperCase() : 'U';
  
  const location = useLocation();

  const menuItems = [
    { icon: '🏠', label: 'Overview', path: '/UserDashboard' }, // Renamed from Dashboard to Overview
    { icon: '🚗', label: 'Browse Vehicles', path: '/UserDashboard/vehicles' },
    { icon: '📋', label: 'My Bookings', path: '/UserDashboard/my-bookings' },
    { icon: '💰', label: 'Payments', path: '/UserDashboard/payments' },
    { icon: '⚙️', label: 'Settings', path: '/UserDashboard/settings' },
  ];

  const bottomItems = [
     { icon: '🦺', label: 'Support', path: '/UserDashboard/emergency'},
     { icon: '🚪', label: 'Logout', path: '/logout' }, 
  ];

  return (
    <div className="w-72 bg-[#001524] border-r border-[#445048] min-h-screen flex flex-col shadow-2xl z-20">
      
      {/* Brand / Logo Area */}
      <div className="p-8 pb-4">
        <h2 className="text-2xl font-bold text-[#E9E6DD] tracking-tight">
          Rental<span className="text-[#F57251]">App</span>
        </h2>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 space-y-2 mt-4">
        <p className="px-4 text-xs font-semibold text-[#C4AD9D] uppercase tracking-wider mb-2">Menu</p>
        {menuItems.map((item, index) => {
          // Exact match for dashboard home, startsWith for others
          const isActive = item.path === '/UserDashboard' 
            ? location.pathname === '/UserDashboard'
            : location.pathname.startsWith(item.path);
          
          return (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-[#027480] text-[#E9E6DD] shadow-lg shadow-[#027480]/20 translate-x-1' 
                  : 'text-[#C4AD9D] hover:bg-[#445048]/50 hover:text-[#E9E6DD]'
              }`}
            >
              <span className={`text-xl ${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform`}>{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}

        <div className="pt-8">
           <p className="px-4 text-xs font-semibold text-[#C4AD9D] uppercase tracking-wider mb-2">Other</p>
           {bottomItems.map((item, index) => (
             <Link
               key={index}
               to={item.path}
               className="flex items-center space-x-3 px-4 py-3.5 rounded-xl text-[#C4AD9D] hover:bg-[#445048]/50 hover:text-[#F57251] transition-all duration-200"
             >
               <span className="text-xl">{item.icon}</span>
               <span className="font-medium">{item.label}</span>
             </Link>
           ))}
        </div>
      </nav>

      {/* Mini Profile Section */}
      <div className="p-4 border-t border-[#445048] bg-[#00101f]">
        <div className="flex items-center space-x-3 p-2 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#027480] to-[#F57251] flex items-center justify-center text-[#E9E6DD] font-bold shadow-md">
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
//   // Get User Data
//   const { user } = useSelector((state: any) => state.auth); 
//   const userFromStorage = JSON.parse(localStorage.getItem('user') || '{}');
  
//   //  Decide which user object to use
//   const displayUser = user || userFromStorage;

//   // Letter Avater
//   const userInitial = displayUser?.first_name ? displayUser.first_name[0].toUpperCase() : 'U';

//   const location = useLocation();

//   const menuItems = [
//     { icon: '🏠', label: 'Dashboard', path: '/UserDashboard' },
//     { icon: '🚗', label: 'Browse Vehicles', path: '/UserDashboard/vehicles' },
//     { icon: '📧', label: 'Messages', path: '/UserDashboard/messages' },
//     { icon: '📋', label: 'My Bookings', path: '/UserDashboard/bookings' },
//     { icon: '💰', label: 'Payments', path: '/UserDashboard/payments' },
//     { icon: '⚙️', label: 'Settings', path: '/UserDashboard/settings' },
//     { icon: '🦺', label: 'Emergency', path: '/UserDashboard/emergency'},
//     { icon: '⛹️‍♂️', label: 'Logout', path: '/logout' }, // You'll need to handle logout logic
//   ]

//   return (
//     <div className="w-64 bg-[#001524] min-h-screen p-6 flex flex-col">
      
//       {/* Search */}
//       <div className="mb-8">
//         <div className="relative">
//           <input 
//             type="text" 
//             placeholder="Search..."
//             className="w-full bg-[#027480] text-[#E9E6DD] placeholder-[#E9E6DD] rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#F57251]"
//           />
//           <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
//             <span className="text-[#E9E6DD]">🔍</span>
//           </div>
//         </div>
//       </div>

//       {/* Menu Items */}
//       <ul className="space-y-2">
//         {menuItems.map((item, index) => {
//           // Check if this link is currently active
//           const isActive = location.pathname === item.path || (item.path !== '/UserDashboard' && location.pathname.startsWith(item.path));
          
//           return (
//             <li key={index}>
//               <Link
//                 to={item.path}
//                 className={`flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 ${
//                   isActive 
//                     ? 'bg-[#027480] text-[#E9E6DD]' 
//                     : 'text-[#E9E6DD] hover:bg-[#445048]'
//                 }`}
//               >
//                 <span className="text-lg">{item.icon}</span>
//                 <span className="font-medium">{item.label}</span>
//               </Link>
//             </li>
//           );
//         })}
//       </ul>

//       {/* User Profile Section - Dynamic Data */}
//       <div className="mt-auto pt-6">
//         <div className="flex items-center space-x-3 p-3 bg-[#445048] rounded-lg">
          
//           {/* Avatar with Dynamic Initial */}
//           <div className="w-12 h-12 rounded-full bg-[#D6CC99] flex items-center justify-center">
//             <span className="text-[#001524] font-bold text-lg">
//               {userInitial}
//             </span>
//           </div>

//           {/* User Details - REPLACED HARDCODED TEXT HERE */}
//           <div className="flex-1 min-w-5">
//             <p className="text-[#E9E6DD] font-semibold truncate">
//                {/* Show Name or Fallback */}
//                {displayUser?.first_name || 'User'} {displayUser?.last_name || ''}
//             </p>
//             <p className="text-[#C4AD9D] text-sm truncate capitalize">
//                {/* Show Role or Email */}
//                {displayUser?.role || 'Guest'}
//             </p>
//           </div>

//         </div>
//       </div>

//     </div>
//   );
// };

// export default UserSidebar;