import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, Car, CalendarDays, CreditCard, Settings, 
  HelpCircle, LogOut, User, 
  ChevronLeft, ChevronRight, Menu 
} from 'lucide-react';

interface UserSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobile: boolean;
}

const UserSidebar: React.FC<UserSidebarProps> = ({ 
  isCollapsed, 
  onToggleCollapse,
  isMobile 
}) => {
  const { user } = useSelector((state: any) => state.auth); 
  const userFromStorage = JSON.parse(localStorage.getItem('user') || '{}');
  const displayUser = user || userFromStorage;
  const userInitial = displayUser?.first_name ? displayUser.first_name[0].toUpperCase() : 'U';
  
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const menuItems = [
    { icon: Home, label: 'Overview', path: '/UserDashboard' },
    { icon: Car, label: 'Browse Vehicles', path: '/UserDashboard/vehicles' },
    { icon: CalendarDays, label: 'My Bookings', path: '/UserDashboard/my-bookings' },
    { icon: CreditCard, label: 'Payments', path: '/UserDashboard/my-payments' },
    { icon: Settings, label: 'Settings', path: '/UserDashboard/settings' },
  ];

  const bottomItems = [
    { icon: HelpCircle, label: 'Support', path: '/UserDashboard/support' },
    { icon: User, label: 'Review', path: '/UserDashboard/review' },
    { icon: LogOut, label: 'Logout', action: handleLogout },
  ];

  const isActive = (path: string) => {
    if (path === '/UserDashboard') return location.pathname === '/UserDashboard';
    return location.pathname.startsWith(path);
  };

  // Logic: Show labels if sidebar is NOT collapsed
  const showLabels = !isCollapsed;

  // Handle clicking a link on mobile -> Close the sidebar to see content
  const handleLinkClick = () => {
    if (isMobile && !isCollapsed) {
      onToggleCollapse();
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#001524] text-[#E9E6DD] overflow-hidden">
      
      {/* 1. Header / Logo Area */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[#445048] flex-shrink-0">
        
        {/* Logo Text - Only visible when expanded */}
        <div className={`transition-opacity duration-200 ${showLabels ? 'opacity-100' : 'opacity-0 w-0 hidden'}`}>
          <h2 className="text-xl font-bold whitespace-nowrap">
            Rental<span className="text-[#F57251]">App</span>
          </h2>
        </div>

        {/* Logo Icon - Visible when collapsed */}
        <div className={`${!showLabels ? 'mx-auto' : 'hidden'}`}>
           <div className="w-8 h-8 bg-[#027480] rounded flex items-center justify-center font-bold">R</div>
        </div>

        {/* Toggle Button */}
        {showLabels && (
          <button
            onClick={onToggleCollapse}
            className="p-1 rounded-md hover:bg-[#445048] text-[#C4AD9D] transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
        )}
      </div>

      {/* If collapsed, show a toggle button at the top to expand */}
      {!showLabels && (
        <div className="flex justify-center py-2 border-b border-[#445048]">
          <button
            onClick={onToggleCollapse}
            className="p-1 rounded-md hover:bg-[#445048] text-[#C4AD9D]"
          >
            {isMobile ? <Menu size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>
      )}

      {/* 2. Scrollable Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 custom-scrollbar">
        <div className="space-y-1">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              onClick={handleLinkClick}
              className={`
                flex items-center rounded-lg transition-all duration-200 group
                ${showLabels ? 'px-3 py-3 space-x-3' : 'justify-center py-3 px-2'}
                ${isActive(item.path) 
                  ? 'bg-[#027480] text-[#E9E6DD] shadow-md' 
                  : 'text-[#C4AD9D] hover:bg-[#445048]/50 hover:text-[#E9E6DD]'}
              `}
              title={!showLabels ? item.label : ''}
            >
              <item.icon size={22} className="flex-shrink-0" />
              
              <span className={`whitespace-nowrap transition-all duration-300 origin-left
                ${showLabels ? 'w-auto opacity-100' : 'w-0 opacity-0 hidden'}
              `}>
                {item.label}
              </span>

              {/* Tooltip for collapsed state (Desktop only) */}
              {!isMobile && !showLabels && (
                <div className="absolute left-16 bg-[#00101f] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none z-50 whitespace-nowrap border border-[#445048]">
                  {item.label}
                </div>
              )}
            </NavLink>
          ))}
        </div>

        <div className="mt-8 pt-4 border-t border-[#445048]/50 space-y-1">
            {bottomItems.map((item, index) => {
              // Logic to handle button vs NavLink
              const isButton = 'action' in item;
              const content = (
                <>
                  <item.icon size={22} className="flex-shrink-0" />
                  <span className={`whitespace-nowrap transition-all duration-300 origin-left
                    ${showLabels ? 'w-auto opacity-100' : 'w-0 opacity-0 hidden'}
                  `}>
                    {item.label}
                  </span>
                </>
              );

              const commonClasses = `
                flex items-center rounded-lg transition-all duration-200 w-full group
                ${showLabels ? 'px-3 py-3 space-x-3' : 'justify-center py-3 px-2'}
                text-[#C4AD9D] hover:bg-[#445048]/50 hover:text-[#F57251]
              `;

              if (isButton) {
                return (
                  <button key={index} onClick={() => { item.action?.(); handleLinkClick(); }} className={commonClasses}>
                    {content}
                  </button>
                );
              }
              return (
                <NavLink key={index} to={(item as any).path} onClick={handleLinkClick} className={commonClasses}>
                  {content}
                </NavLink>
              );
            })}
        </div>
      </nav>

      {/* 3. User Profile Footer */}
      <div className="p-3 border-t border-[#445048] bg-[#00101f] flex-shrink-0">
        <div className={`flex items-center ${showLabels ? 'space-x-3' : 'justify-center'}`}>
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#027480] to-[#F57251] flex items-center justify-center text-white font-bold shadow-lg flex-shrink-0">
            {userInitial}
          </div>
          
          {showLabels && (
            <div className="overflow-hidden">
              <p className="text-[#E9E6DD] text-sm font-semibold truncate w-32">
                {displayUser?.first_name || 'Guest'}
              </p>
              <p className="text-[#C4AD9D] text-xs truncate">View Profile</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSidebar;



// // UserSidebar.tsx
// import React from 'react';
// import { useSelector } from 'react-redux';
// import { NavLink, useLocation, useNavigate } from 'react-router-dom';
// // Make sure your imports include these:
// import { 
//   Home,
//   Car,
//   CalendarDays,
//   CreditCard,
//   Settings,
//   HelpCircle,
//   LogOut,
//   User,
//   ChevronLeft, // Make sure this is imported
//   ChevronRight, // Make sure this is imported
//   X
// } from 'lucide-react';

// interface UserSidebarProps {
//   isCollapsed?: boolean;
//   onToggleCollapse?: () => void;
//   isMobile?: boolean;
// }

// const UserSidebar: React.FC<UserSidebarProps> = ({ 
//   isCollapsed = false, 
//   onToggleCollapse,
//   isMobile = false 
// }) => {
//   const { user } = useSelector((state: any) => state.auth); 
//   const userFromStorage = JSON.parse(localStorage.getItem('user') || '{}');
//   const displayUser = user || userFromStorage;
//   const userInitial = displayUser?.first_name ? displayUser.first_name[0].toUpperCase() : 'U';
//   const location = useLocation();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem('user');
//     localStorage.removeItem('token');
//     navigate('/login');
//   };

//   const menuItems = [
//     { icon: Home, label: 'Overview', path: '/UserDashboard' },
//     { icon: Car, label: 'Browse Vehicles', path: '/UserDashboard/vehicles' },
//     { icon: CalendarDays, label: 'My Bookings', path: '/UserDashboard/my-bookings' },
//     { icon: CreditCard, label: 'Payments', path: '/UserDashboard/my-payments' },
//     { icon: Settings, label: 'Settings', path: '/UserDashboard/settings' },
//   ];

//   const bottomItems = [
//     { icon: HelpCircle, label: 'Support', path: '/UserDashboard/support' },
//     { icon: User, label: 'Review', path: '/UserDashboard/review' },
//     { icon: LogOut, label: 'Logout', action: handleLogout },
//   ];

//   const isActive = (path: string) => {
//     if (path === '/UserDashboard') return location.pathname === '/UserDashboard';
//     return location.pathname.startsWith(path);
//   };

//   // Determine if we should show labels
//   const showLabels = !isCollapsed;

//   return (
//     <div className="h-screen flex flex-col bg-[#001524]">
//       {/* Brand / Logo Area */}
//       <div className="p-4 border-b border-[#445048] flex items-center justify-between">
//         {showLabels ? (
//           <>
//             <h2 className="text-xl font-bold text-[#E9E6DD]">
//               Rental<span className="text-[#F57251]">App</span>
//             </h2>
//             {isMobile && (
//               <button
//                 onClick={onToggleCollapse}
//                 className="text-[#C4AD9D] hover:text-[#E9E6DD]"
//                 aria-label="Collapse sidebar"
//               >
//                 <ChevronLeft size={20} />
//               </button>
//             )}
//           </>
//         ) : (
//           <div className="w-full flex flex-col items-center gap-2">
//             <div className="w-8 h-8 bg-[#027480] rounded flex items-center justify-center">
//               <span className="text-[#E9E6DD] font-bold text-sm">R</span>
//             </div>
//             {isMobile && (
//               <button
//                 onClick={onToggleCollapse}
//                 className="text-[#C4AD9D] hover:text-[#E9E6DD]"
//                 aria-label="Expand sidebar"
//               >
//                 <ChevronRight size={20} />
//               </button>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Main Navigation - Scrollable */}
//       <nav className="flex-1 overflow-y-auto py-4 px-2">
//         {/* Main Menu Items */}
//         <div className="space-y-1">
//           {menuItems.map((item, index) => (
//             <NavLink
//               key={index}
//               to={item.path}
//               className={`
//                 flex items-center ${showLabels ? 'space-x-3 px-3' : 'justify-center px-2'} 
//                 py-3 rounded-lg transition-all duration-200
//                 ${isActive(item.path) 
//                   ? 'bg-[#027480] text-[#E9E6DD] shadow-md' 
//                   : 'text-[#C4AD9D] hover:bg-[#445048]/50 hover:text-[#E9E6DD]'}
//               `}
//               title={!showLabels ? item.label : undefined}
//               end={item.path === '/UserDashboard'}
//             >
//               <item.icon size={20} />
//               {showLabels && <span className="font-medium text-sm">{item.label}</span>}
//             </NavLink>
//           ))}
//         </div>

//         {/* Bottom Items */}
//         <div className="pt-6 space-y-1">
//           {bottomItems.map((item, index) => {
//             if ('action' in item) {
//               return (
//                 <button
//                   key={index}
//                   onClick={item.action}
//                   className={`
//                     flex items-center ${showLabels ? 'space-x-3 px-3' : 'justify-center px-2'} 
//                     py-3 rounded-lg text-[#C4AD9D] hover:bg-[#445048]/50 hover:text-[#F57251] 
//                     transition-all duration-200 w-full
//                   `}
//                   title={!showLabels ? item.label : undefined}
//                 >
//                   <item.icon size={20} />
//                   {showLabels && <span className="font-medium text-sm">{item.label}</span>}
//                 </button>
//               );
//             }
            
//             return (
//               <NavLink
//                 key={index}
//                 to={item.path}
//                 className={`
//                   flex items-center ${showLabels ? 'space-x-3 px-3' : 'justify-center px-2'} 
//                   py-3 rounded-lg text-[#C4AD9D] hover:bg-[#445048]/50 hover:text-[#F57251] 
//                   transition-all duration-200
//                 `}
//                 title={!showLabels ? item.label : undefined}
//               >
//                 <item.icon size={20} />
//                 {showLabels && <span className="font-medium text-sm">{item.label}</span>}
//               </NavLink>
//             );
//           })}
//         </div>
//       </nav>

//       {/* Mini Profile Section */}
//       <div className="p-3 border-t border-[#445048] bg-[#00101f]">
//         {showLabels ? (
//           <div className="flex items-center space-x-3 p-2">
//             <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-tr from-[#027480] to-[#F57251] flex items-center justify-center text-[#E9E6DD] font-bold text-sm">
//               {userInitial}
//             </div>
//             <div className="flex-1 overflow-hidden">
//               <p className="text-[#E9E6DD] text-sm font-semibold truncate">
//                 {displayUser?.first_name || 'Guest'}
//               </p>
//               <p className="text-[#C4AD9D] text-xs truncate">View Profile</p>
//             </div>
//           </div>
//         ) : (
//           <div className="flex justify-center p-2">
//             <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-tr from-[#027480] to-[#F57251] flex items-center justify-center text-[#E9E6DD] font-bold text-sm">
//               {userInitial}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UserSidebar;
