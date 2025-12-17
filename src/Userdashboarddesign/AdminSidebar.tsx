import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/slice/AuthSlice';
import { 
  LayoutDashboard, Users, Car, CalendarDays, BarChart3, 
  LogOut, Receipt, CreditCard, LifeBuoy, HelpCircle,
  ChevronLeft, ChevronRight, Menu
} from 'lucide-react';

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobile: boolean;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
  isCollapsed, 
  onToggleCollapse,
  isMobile 
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get user from Redux store
  const { user } = useSelector((state: any) => state.auth) || 
    { user: JSON.parse(localStorage.getItem('user') || 'null') };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Users, label: 'Customers', path: '/admin/customers' },
    { icon: Car, label: 'Fleet Management', path: '/admin/fleet' },
    { icon: CalendarDays, label: 'Bookings', path: '/admin/bookings' },
    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
    { icon: CreditCard, label: 'Payments', path: '/admin/payments' },
    { icon: Receipt, label: 'Receipts', path: '/admin/receipts' },
  ];

  const bottomItems = [
    { icon: HelpCircle, label: 'Support', path: '/admin/support' },
    { icon: LifeBuoy, label: 'Reviews', path: '/admin/review'},
  ];

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return 'A';
    const { first_name, last_name } = user;
    return `${first_name?.[0] || ''}${last_name?.[0] || ''}`.toUpperCase() || 'A';
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (!user) return 'Admin User';
    return `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Admin User';
  };

  // Get user role with proper capitalization
  const getUserRole = () => {
    if (!user) return 'Super Admin';
    const role = user.role || 'admin';
    return role === 'superAdmin' ? 'Super Admin' : 
           role === 'admin' ? 'Admin' : 
           role.charAt(0).toUpperCase() + role.slice(1);
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
            Admin<span className="text-[#F57251]">Panel</span>
          </h2>
        </div>

        {/* Logo Icon - Visible when collapsed */}
        <div className={`${!showLabels ? 'mx-auto' : 'hidden'}`}>
           <div className="w-8 h-8 bg-[#027480] rounded flex items-center justify-center font-bold">A</div>
        </div>

        {/* Toggle Button (Desktop only here, mobile usually clicks backdrop) */}
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
        {/* Main Items */}
        <div className="space-y-1">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              onClick={handleLinkClick}
              end={item.path === '/admin'}
              className={({ isActive }) => `
                flex items-center rounded-lg transition-all duration-200 group
                ${showLabels ? 'px-3 py-3 space-x-3' : 'justify-center py-3 px-2'}
                ${isActive 
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

        {/* Bottom Items */}
        <div className="mt-8 pt-4 border-t border-[#445048]/50 space-y-1">
          {bottomItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              onClick={handleLinkClick}
              className={({ isActive }) => `
                flex items-center rounded-lg transition-all duration-200 group
                ${showLabels ? 'px-3 py-3 space-x-3' : 'justify-center py-3 px-2'}
                ${isActive 
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
            </NavLink>
          ))}
        </div>
      </nav>

      {/* 3. Admin Profile & Logout */}
      <div className="p-3 border-t border-[#445048] bg-[#00101f] flex-shrink-0">
        <div className={`flex items-center ${showLabels ? 'space-x-3 mb-2' : 'justify-center mb-2'}`}>
          <div className="w-9 h-9 rounded-full bg-[#D6CC99] flex items-center justify-center text-[#001524] font-bold shadow-lg flex-shrink-0">
            {getUserInitials()}
          </div>
          
          {showLabels && (
            <div className="overflow-hidden">
              <p className="text-[#E9E6DD] text-sm font-semibold truncate w-32">
                {getUserDisplayName()}
              </p>
              <p className="text-[#C4AD9D] text-xs truncate">
                {getUserRole()}
              </p>
            </div>
          )}
        </div>

        <button 
          onClick={() => { handleLogout(); handleLinkClick(); }}
          className={`
            flex items-center rounded-lg text-[#F57251] hover:bg-[#445048]/50 hover:text-[#E9E6DD] transition-all duration-200 w-full
            ${showLabels ? 'px-3 py-3 space-x-3' : 'justify-center py-3 px-2'}
          `}
          title={!showLabels ? "Logout" : undefined}
        >
          <LogOut size={20} className="flex-shrink-0" />
          {showLabels && <span className="font-medium text-sm">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;

// // AdminSidebar.tsx
// import React from 'react';
// import { NavLink, useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { logout } from '../features/slice/AuthSlice';
// import { 
//   LayoutDashboard, 
//   Users, 
//   Car, 
//   CalendarDays, 
//   BarChart3, 
//   LogOut, 
//   Receipt,
//   CreditCard,
//   LifeBuoy, 
//   HelpCircle,
//   ChevronLeft,
//   ChevronRight
// } from 'lucide-react';

// interface AdminSidebarProps {
//   isCollapsed?: boolean;
//   onToggleCollapse?: () => void;
//   isMobile?: boolean;
// }

// const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
//   isCollapsed = false, 
//   onToggleCollapse,
//   isMobile = false 
// }) => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
  
//   // Get user from Redux store
//   const { user } = useSelector((state: any) => state.auth) || 
//     { user: JSON.parse(localStorage.getItem('user') || 'null') };

//   const handleLogout = () => {
//     dispatch(logout());
//     navigate('/login');
//   };

//   const menuItems = [
//     { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
//     { icon: Users, label: 'Customers', path: '/admin/customers' },
//     { icon: Car, label: 'Fleet Management', path: '/admin/fleet' },
//     { icon: CalendarDays, label: 'Bookings', path: '/admin/bookings' },
//     { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
//     { icon: CreditCard, label: 'Payments', path: '/admin/payments' },
//     { icon: Receipt, label: 'Receipts', path: '/admin/receipts' },
//     { icon: HelpCircle, label: 'Support', path: '/admin/support' },
//     { icon: LifeBuoy, label: 'Reviews', path: '/admin/review'}
//   ];

//   // Get user initials for avatar
//   const getUserInitials = () => {
//     if (!user) return 'A';
//     const { first_name, last_name } = user;
//     return `${first_name?.[0] || ''}${last_name?.[0] || ''}`.toUpperCase() || 'A';
//   };

//   // Get user display name
//   const getUserDisplayName = () => {
//     if (!user) return 'Admin User';
//     return `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Admin User';
//   };

//   // Get user role with proper capitalization
//   const getUserRole = () => {
//     if (!user) return 'Super Admin';
//     const role = user.role || 'admin';
//     return role === 'superAdmin' ? 'Super Admin' : 
//            role === 'admin' ? 'Admin' : 
//            role.charAt(0).toUpperCase() + role.slice(1);
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
//               Admin<span className="text-[#F57251]">Panel</span>
//             </h2>
//             {isMobile && onToggleCollapse && (
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
//               <span className="text-[#E9E6DD] font-bold text-sm">A</span>
//             </div>
//             {isMobile && onToggleCollapse && (
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
//         {/* Menu Items */}
//         <div className="space-y-1">
//           {menuItems.map((item, index) => (
//             <NavLink
//               key={index}
//               to={item.path}
//               end={item.path === '/admin'}
//               className={({ isActive }) => `
//                 flex items-center ${showLabels ? 'space-x-3 px-3' : 'justify-center px-2'} 
//                 py-3 rounded-lg transition-all duration-200
//                 ${isActive 
//                   ? 'bg-[#027480] text-[#E9E6DD] shadow-md' 
//                   : 'text-[#C4AD9D] hover:bg-[#445048]/50 hover:text-[#E9E6DD]'}
//               `}
//               title={!showLabels ? item.label : undefined}
//             >
//               <item.icon size={20} />
//               {showLabels && <span className="font-medium text-sm">{item.label}</span>}
//             </NavLink>
//           ))}
//         </div>
//       </nav>

//       {/* Admin Profile & Logout */}
//       <div className="p-3 border-t border-[#445048] bg-[#00101f]">
//         {showLabels ? (
//           <>
//             <div className="flex items-center space-x-3 mb-4 p-2">
//               <div className="w-10 h-10 rounded-full bg-[#D6CC99] flex items-center justify-center">
//                 <span className="text-[#001524] font-bold text-sm">{getUserInitials()}</span>
//               </div>
//               <div className="overflow-hidden">
//                 <p className="text-[#E9E6DD] text-sm font-semibold truncate">
//                   {getUserDisplayName()}
//                 </p>
//                 <p className="text-[#C4AD9D] text-xs truncate">
//                   {getUserRole()}
//                 </p>
//               </div>
//             </div>
//             <button 
//               onClick={handleLogout}
//               className="flex items-center space-x-3 px-3 py-3 rounded-lg text-[#F57251] hover:bg-[#445048]/50 hover:text-[#E9E6DD] transition-all duration-200 w-full"
//             >
//               <LogOut size={20} />
//               <span className="font-medium text-sm">Logout</span>
//             </button>
//           </>
//         ) : (
//           <>
//             <div className="flex justify-center mb-4 p-2">
//               <div className="w-10 h-10 rounded-full bg-[#D6CC99] flex items-center justify-center">
//                 <span className="text-[#001524] font-bold text-sm">{getUserInitials()}</span>
//               </div>
//             </div>
//             <button 
//               onClick={handleLogout}
//               className="flex items-center justify-center p-3 rounded-lg text-[#F57251] hover:bg-[#445048]/50 hover:text-[#E9E6DD] transition-all duration-200 w-full"
//               title="Logout"
//             >
//               <LogOut size={20} />
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminSidebar;




// import React from 'react';
// import { NavLink, useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { logout } from '../features/slice/AuthSlice';
// import { 
//   LayoutDashboard, 
//   Users, 
//   Car, 
//   CalendarDays, 
//   // Settings, 
//   // MessageSquare, 
//   BarChart3, 
//   LogOut, 
//   Receipt,
//   CreditCard,
//   // Shield,
//   // Home,
//   LifeBuoy, HelpCircle
// } from 'lucide-react';

// const AdminSidebar: React.FC = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
  
//   // Get user from Redux store
//   const { user } = useSelector((state: any) => state.auth) || 
//     { user: JSON.parse(localStorage.getItem('user') || 'null') };

//   const menuItems = [
//     { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
//     { icon: Users, label: 'Customers', path: '/admin/customers' },
//     { icon: Car, label: 'Fleet Management', path: '/admin/fleet' },
//     { icon: CalendarDays, label: 'Bookings', path: '/admin/bookings' },
//     { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
//     { icon: CreditCard, label: 'Payments', path: '/admin/payments' },
//    // { icon: MessageSquare, label: 'Messages', path: '/admin/messages' },
//    // { icon: Settings, label: 'Settings', path: '/admin/settings' },
//     { icon: Receipt, label: 'Receipts', path: '/admin/receipts' },
//     { icon: HelpCircle, label: 'Support', path: '/admin/support' },
//     { icon: LifeBuoy, label: 'Reviews', path:  '/admin/review'}
//   ];

//   const handleLogout = () => {
//     dispatch(logout());
//     navigate('/login');
//   };

//   // Get user initials for avatar
//   const getUserInitials = () => {
//     if (!user) return 'A';
//     const { first_name, last_name } = user;
//     return `${first_name?.[0] || ''}${last_name?.[0] || ''}`.toUpperCase() || 'A';
//   };

//   // Get user display name
//   const getUserDisplayName = () => {
//     if (!user) return 'Admin User';
//     return `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Admin User';
//   };

//   // Get user role with proper capitalization
//   const getUserRole = () => {
//     if (!user) return 'Super Admin';
//     const role = user.role || 'admin';
//     return role === 'superAdmin' ? 'Super Admin' : 
//            role === 'admin' ? 'Admin' : 
//            role.charAt(0).toUpperCase() + role.slice(1);
//   };

//   return (
//     <div className="w-64 bg-[#001524] h-screen flex flex-col border-r border-[#445048]">
//       {/* Brand */}
//       <div className="p-6 border-b border-[#445048]">
//         <h2 className="text-2xl font-bold text-[#E9E6DD]">
//           Admin<span className="text-[#F57251]">Panel</span>
//         </h2>
//       </div>

//       {/* Menu - Scrollable */}
//       <nav className="flex-1 overflow-y-auto py-4">
//         <ul className="space-y-1 px-3">
//           {menuItems.map((item, index) => (
//             <li key={index}>
//               <NavLink
//                 to={item.path}
//                 end={item.path === '/admin'}
//                 className={({ isActive }) => `
//                   flex items-center space-x-3 p-3 rounded-lg transition-all duration-200
//                   ${isActive 
//                     ? 'bg-[#027480] text-[#E9E6DD] shadow-md shadow-[#027480]/20' 
//                     : 'text-[#C4AD9D] hover:bg-[#445048]/50 hover:text-[#E9E6DD]'}
//                 `}
//               >
//                 <item.icon size={20} />
//                 <span className="font-medium">{item.label}</span>
//               </NavLink>
//             </li>
//           ))}
//         </ul>
//       </nav>

//       {/* Admin Profile & Logout */}
//       <div className="p-4 border-t border-[#445048] bg-[#00101f]">
//         <div className="flex items-center space-x-3 mb-4">
//           <div className="w-10 h-10 rounded-full bg-[#D6CC99] flex items-center justify-center">
//             <span className="text-[#001524] font-bold">{getUserInitials()}</span>
//           </div>
//           <div className="overflow-hidden">
//             <p className="text-[#E9E6DD] text-sm font-semibold truncate">
//               {getUserDisplayName()}
//             </p>
//             <p className="text-[#C4AD9D] text-xs truncate">
//               {getUserRole()}
//             </p>
//           </div>
//         </div>
//         <button 
//           onClick={handleLogout}
//           className="flex items-center space-x-2 text-[#F57251] hover:text-[#E9E6DD] w-full p-2 rounded-lg hover:bg-[#445048] transition-colors text-sm font-medium"
//         >
//           <LogOut size={18} />
//           <span>Logout</span>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AdminSidebar;

