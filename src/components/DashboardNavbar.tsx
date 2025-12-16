// DashboardNavbar.tsx (Responsive Updated)
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { 
  Bell, 
  Search, 
  ChevronDown, 
  LogOut, 
  Settings,
  HelpCircle,
  User
} from "lucide-react";

interface DashboardNavbarProps {
  userType: 'admin' | 'user';
}

const DashboardNavbar: React.FC<DashboardNavbarProps> = ({ userType }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Get user from Redux store or localStorage
  const { user } = useSelector((state: any) => state.auth) || 
    { user: JSON.parse(localStorage.getItem('user') || 'null') };

  // Get page title from path based on user type
  const getPageTitle = (path: string): string => {
    if (userType === 'admin') {
      const adminTitles: Record<string, string> = {
        '/admin': 'Dashboard',
        '/admin/customers': 'Customers',
        '/admin/fleet': 'Fleet Management',
        '/admin/bookings': 'Bookings',
        '/admin/analytics': 'Analytics',
        '/admin/payments': 'Payments',
        '/admin/messages': 'Messages',
        '/admin/settings': 'Settings',
        '/admin/receipts': 'Receipts',
        '/admin/profile': 'Profile'
      };
      return adminTitles[path] || 'Admin Dashboard';
    } else {
      const userTitles: Record<string, string> = {
        '/UserDashboard': 'Overview',
        '/UserDashboard/vehicles': 'Browse Vehicles',
        '/UserDashboard/my-bookings': 'My Bookings',
        '/UserDashboard/payments': 'Payments',
        '/UserDashboard/settings': 'Settings',
        '/UserDashboard/profile': 'Profile',
        '/UserDashboard/emergency': 'Support'
      };
      return userTitles[path] || 'User Dashboard';
    }
  };

  // Get user initials
  const getUserInitials = (): string => {
    if (!user) return userType === 'admin' ? 'A' : 'U';
    const { first_name, last_name } = user;
    return `${first_name?.[0] || ''}${last_name?.[0] || ''}`.toUpperCase() || 
           (userType === 'admin' ? 'A' : 'U');
  };

  // Get user role display text
  const getUserRole = (): string => {
    if (!user) return userType === 'admin' ? 'Administrator' : 'Customer';
    const role = user.role || (userType === 'admin' ? 'admin' : 'user');
    return role === 'superAdmin' ? 'Super Administrator' : 
           role === 'admin' ? 'Administrator' : 
           role.charAt(0).toUpperCase() + role.slice(1);
  };

  // Handle logout
  const handleLogout = (): void => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Get profile route based on user type - FIXED to use correct route
  const getProfileRoute = (): string => {
    return userType === 'admin' ? '/admin/profile' : '/UserDashboard/profile';
  };

  // Check if profile route exists in user's routes
  const canNavigateToProfile = (): boolean => {
    return true; // You might want to add actual route checking logic here
  };

  const currentPage = getPageTitle(location.pathname);

  // Fixed navigation function with validation
  const handleProfileNavigation = (): void => {
    const profileRoute = getProfileRoute();
    if (canNavigateToProfile()) {
      navigate(profileRoute);
      setUserMenuOpen(false);
    } else {
      console.warn(`Profile route ${profileRoute} not available`);
      // You could show a toast message here
    }
  };

  const handleSettingsNavigation = (): void => {
    const settingsRoute = userType === 'admin' ? '/admin/settings' : '/UserDashboard/settings';
    navigate(settingsRoute);
    setUserMenuOpen(false);
  };

  return (
    <div className="p-4 bg-[#E9E6DD]">
      {/* Restored original navbar container styling with rounded corners and margins */}
      <nav className="max-w-7xl mx-auto bg-[#001524] rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between">
          
          {/* Brand - Restored original styling */}
          <Link to={userType === 'admin' ? '/admin' : '/UserDashboard'} 
                className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-[#027480] flex items-center justify-center">
              <span className="text-[#E9E6DD] font-bold text-lg">V</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl sm:text-2xl font-bold text-[#E9E6DD]">VansKE Car Rental</h1>
              <p className="text-[#C4AD9D] text-xs sm:text-sm">Luxury & Performance</p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-lg font-bold text-[#E9E6DD]">VansKE</h1>
            </div>
          </Link>

          {/* Current Page Title - Hidden on extra small, shown on medium+ */}
          <div className="hidden md:block">
            <h2 className="text-xl font-bold text-[#E9E6DD]">{currentPage}</h2>
          </div>

          {/* Right: Search and User */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            
            {/* Search - Hidden on small screens, shown on medium+ */}
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-[#C4AD9D]" />
                </div>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 w-48 bg-[#00101f] border border-[#445048] rounded-lg text-[#E9E6DD] text-sm placeholder-[#C4AD9D] focus:outline-none focus:ring-1 focus:ring-[#027480]"
                />
              </div>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 text-[#C4AD9D] hover:text-[#E9E6DD] transition-colors"
              >
                <Bell size={20} />
                <span className="absolute top-1 right-1 h-2 w-2 bg-[#F57251] rounded-full"></span>
              </button>

              {/* Notifications Dropdown */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#001524] border border-[#445048] rounded-lg shadow-lg z-50">
                  <div className="p-3 border-b border-[#445048]">
                    <h3 className="text-[#E9E6DD] font-medium">Notifications</h3>
                  </div>
                  <div className="p-3">
                    {[1, 2, 3].map((notification) => (
                      <div
                        key={notification}
                        className="py-2 border-b border-[#445048] last:border-b-0 cursor-pointer hover:bg-[#00101f] px-2 rounded"
                      >
                        <p className="text-[#E9E6DD] text-sm">
                          {userType === 'admin' 
                            ? `Admin notification ${notification}` 
                            : `User notification ${notification}`}
                        </p>
                        <p className="text-[#C4AD9D] text-xs mt-1">2 min ago</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Help/Support - Hidden on small screens, shown on medium+ */}
            <button
              className="hidden md:flex p-2 text-[#C4AD9D] hover:text-[#E9E6DD] transition-colors"
              title="Help & Support"
            >
              <HelpCircle size={20} />
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 p-2 hover:bg-[#00101f] rounded-lg transition-colors"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#D6CC99] flex items-center justify-center overflow-hidden">
                  <span className="text-[#001524] font-bold text-sm sm:text-base">
                    {getUserInitials()}
                  </span>
                </div>
                <ChevronDown className={`hidden sm:block h-4 w-4 text-[#C4AD9D] transition-transform ${
                  userMenuOpen ? 'rotate-180' : ''
                }`} />
              </button>

              {/* Dropdown Menu - Fixed profile navigation */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#001524] border border-[#445048] rounded-lg shadow-lg z-50">
                  {/* User Info */}
                  <div className="p-3 border-b border-[#445048]">
                    <p className="text-[#E9E6DD] font-medium">
                      {user?.first_name} {user?.last_name}
                    </p>
                    <p className="text-sm text-[#C4AD9D]">{user?.email}</p>
                    <span className="text-xs text-[#027480] bg-[#027480]/10 px-2 py-1 rounded mt-1 inline-block">
                      {getUserRole()}
                    </span>
                  </div>
                  
                  {/* Profile Settings - FIXED: Now properly navigates */}
                  <div className="p-2">
                    <button
                      onClick={handleProfileNavigation}
                      className="w-full text-left px-3 py-2 text-[#E9E6DD] hover:bg-[#00101f] rounded text-sm transition-colors flex items-center"
                    >
                      <User size={16} className="mr-2" />
                      Profile Settings
                    </button>
                  </div>

                  {/* Settings */}
                  <div className="p-2">
                    <button
                      onClick={handleSettingsNavigation}
                      className="w-full text-left px-3 py-2 text-[#E9E6DD] hover:bg-[#00101f] rounded text-sm transition-colors flex items-center"
                    >
                      <Settings size={16} className="mr-2" />
                      Settings
                    </button>
                  </div>
                  
                  {/* Logout */}
                  <div className="p-2 border-t border-[#445048]">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm bg-[#F57251]/10 text-[#F57251] hover:bg-[#F57251] hover:text-[#001524] rounded-lg transition-colors font-medium"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile: Current Page Title - Shown on small screens only */}
        <div className="md:hidden mt-4 pt-4 border-t border-[#445048]">
          <h2 className="text-lg font-bold text-[#E9E6DD]">{currentPage}</h2>
        </div>
      </nav>
    </div>
  );
};

export default DashboardNavbar;

// // DashboardNavbar.tsx (Responsive Updated)
// import React, { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { Link } from "react-router-dom";
// import { 
//   Bell, 
//   Search, 
//   ChevronDown, 
//   LogOut, 
//   Settings,
//   HelpCircle,
//   User
// } from "lucide-react";

// interface DashboardNavbarProps {
//   userType: 'admin' | 'user';
// }

// const DashboardNavbar: React.FC<DashboardNavbarProps> = ({ userType }) => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [userMenuOpen, setUserMenuOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [notificationsOpen, setNotificationsOpen] = useState(false);

//   // Get user from Redux store or localStorage
//   const { user } = useSelector((state: any) => state.auth) || 
//     { user: JSON.parse(localStorage.getItem('user') || 'null') };

//   // Get page title from path based on user type
//   const getPageTitle = (path: string): string => {
//     if (userType === 'admin') {
//       const adminTitles: Record<string, string> = {
//         '/admin': 'Dashboard',
//         '/admin/customers': 'Customers',
//         '/admin/fleet': 'Fleet Management',
//         '/admin/bookings': 'Bookings',
//         '/admin/analytics': 'Analytics',
//         '/admin/payments': 'Payments',
//         '/admin/messages': 'Messages',
//         '/admin/settings': 'Settings',
//         '/admin/receipts': 'Receipts',
//         '/admin/profile': 'Profile'
//       };
//       return adminTitles[path] || 'Admin Dashboard';
//     } else {
//       const userTitles: Record<string, string> = {
//         '/UserDashboard': 'Overview',
//         '/UserDashboard/vehicles': 'Browse Vehicles',
//         '/UserDashboard/my-bookings': 'My Bookings',
//         '/UserDashboard/payments': 'Payments',
//         '/UserDashboard/settings': 'Settings',
//         '/UserDashboard/profile': 'Profile',
//         '/UserDashboard/emergency': 'Support'
//       };
//       return userTitles[path] || 'User Dashboard';
//     }
//   };

//   // Get user initials
//   const getUserInitials = (): string => {
//     if (!user) return userType === 'admin' ? 'A' : 'U';
//     const { first_name, last_name } = user;
//     return `${first_name?.[0] || ''}${last_name?.[0] || ''}`.toUpperCase() || 
//            (userType === 'admin' ? 'A' : 'U');
//   };

//   // Get user role display text
//   const getUserRole = (): string => {
//     if (!user) return userType === 'admin' ? 'Administrator' : 'Customer';
//     const role = user.role || (userType === 'admin' ? 'admin' : 'user');
//     return role === 'superAdmin' ? 'Super Administrator' : 
//            role === 'admin' ? 'Administrator' : 
//            role.charAt(0).toUpperCase() + role.slice(1);
//   };

//   // Handle logout
//   const handleLogout = (): void => {
//     localStorage.removeItem('user');
//     localStorage.removeItem('token');
//     navigate('/login');
//   };

//   // Get profile route based on user type - FIXED to use correct route
//   const getProfileRoute = (): string => {
//     return userType === 'admin' ? '/admin/profile' : '/UserDashboard/profile';
//   };

//   // Check if profile route exists in user's routes
//   const canNavigateToProfile = (): boolean => {
//     return true; // You might want to add actual route checking logic here
//   };

//   const currentPage = getPageTitle(location.pathname);

//   // Fixed navigation function with validation
//   const handleProfileNavigation = (): void => {
//     const profileRoute = getProfileRoute();
//     if (canNavigateToProfile()) {
//       navigate(profileRoute);
//       setUserMenuOpen(false);
//     } else {
//       console.warn(`Profile route ${profileRoute} not available`);
//       // You could show a toast message here
//     }
//   };

//   const handleSettingsNavigation = (): void => {
//     const settingsRoute = userType === 'admin' ? '/admin/settings' : '/UserDashboard/settings';
//     navigate(settingsRoute);
//     setUserMenuOpen(false);
//   };

//   return (
//     <div className="p-4 bg-[#E9E6DD]">
//       {/* Restored original navbar container styling with rounded corners and margins */}
//       <nav className="max-w-7xl mx-auto bg-[#001524] rounded-2xl p-4 shadow-lg">
//         <div className="flex items-center justify-between">
          
//           {/* Brand - Restored original styling */}
//           <Link to={userType === 'admin' ? '/admin' : '/UserDashboard'} 
//                 className="flex items-center space-x-2">
//             <div className="w-10 h-10 rounded-full bg-[#027480] flex items-center justify-center">
//               <span className="text-[#E9E6DD] font-bold text-lg">V</span>
//             </div>
//             <div className="hidden sm:block">
//               <h1 className="text-xl sm:text-2xl font-bold text-[#E9E6DD]">VansKE Car Rental</h1>
//               <p className="text-[#C4AD9D] text-xs sm:text-sm">Luxury & Performance</p>
//             </div>
//             <div className="sm:hidden">
//               <h1 className="text-lg font-bold text-[#E9E6DD]">VansKE</h1>
//             </div>
//           </Link>

//           {/* Current Page Title - Hidden on extra small, shown on medium+ */}
//           <div className="hidden md:block">
//             <h2 className="text-xl font-bold text-[#E9E6DD]">{currentPage}</h2>
//           </div>

//           {/* Right: Search and User */}
//           <div className="flex items-center space-x-2 sm:space-x-4">
            
//             {/* Search - Hidden on small screens, shown on medium+ */}
//             <div className="hidden md:block">
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Search className="h-4 w-4 text-[#C4AD9D]" />
//                 </div>
//                 <input
//                   type="search"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   placeholder="Search..."
//                   className="pl-10 pr-4 py-2 w-48 bg-[#00101f] border border-[#445048] rounded-lg text-[#E9E6DD] text-sm placeholder-[#C4AD9D] focus:outline-none focus:ring-1 focus:ring-[#027480]"
//                 />
//               </div>
//             </div>

//             {/* Notifications */}
//             <div className="relative">
//               <button
//                 onClick={() => setNotificationsOpen(!notificationsOpen)}
//                 className="relative p-2 text-[#C4AD9D] hover:text-[#E9E6DD] transition-colors"
//               >
//                 <Bell size={20} />
//                 <span className="absolute top-1 right-1 h-2 w-2 bg-[#F57251] rounded-full"></span>
//               </button>

//               {/* Notifications Dropdown */}
//               {notificationsOpen && (
//                 <div className="absolute right-0 mt-2 w-56 bg-[#001524] border border-[#445048] rounded-lg shadow-lg z-50">
//                   <div className="p-3 border-b border-[#445048]">
//                     <h3 className="text-[#E9E6DD] font-medium">Notifications</h3>
//                   </div>
//                   <div className="p-3">
//                     {[1, 2, 3].map((notification) => (
//                       <div
//                         key={notification}
//                         className="py-2 border-b border-[#445048] last:border-b-0 cursor-pointer hover:bg-[#00101f] px-2 rounded"
//                       >
//                         <p className="text-[#E9E6DD] text-sm">
//                           {userType === 'admin' 
//                             ? `Admin notification ${notification}` 
//                             : `User notification ${notification}`}
//                         </p>
//                         <p className="text-[#C4AD9D] text-xs mt-1">2 min ago</p>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Help/Support - Hidden on small screens, shown on medium+ */}
//             <button
//               className="hidden md:flex p-2 text-[#C4AD9D] hover:text-[#E9E6DD] transition-colors"
//               title="Help & Support"
//             >
//               <HelpCircle size={20} />
//             </button>

//             {/* User Menu */}
//             <div className="relative">
//               <button
//                 onClick={() => setUserMenuOpen(!userMenuOpen)}
//                 className="flex items-center space-x-2 p-2 hover:bg-[#00101f] rounded-lg transition-colors"
//               >
//                 <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#D6CC99] flex items-center justify-center overflow-hidden">
//                   <span className="text-[#001524] font-bold text-sm sm:text-base">
//                     {getUserInitials()}
//                   </span>
//                 </div>
//                 <ChevronDown className={`hidden sm:block h-4 w-4 text-[#C4AD9D] transition-transform ${
//                   userMenuOpen ? 'rotate-180' : ''
//                 }`} />
//               </button>

//               {/* Dropdown Menu - Fixed profile navigation */}
//               {userMenuOpen && (
//                 <div className="absolute right-0 mt-2 w-56 bg-[#001524] border border-[#445048] rounded-lg shadow-lg z-50">
//                   {/* User Info */}
//                   <div className="p-3 border-b border-[#445048]">
//                     <p className="text-[#E9E6DD] font-medium">
//                       {user?.first_name} {user?.last_name}
//                     </p>
//                     <p className="text-sm text-[#C4AD9D]">{user?.email}</p>
//                     <span className="text-xs text-[#027480] bg-[#027480]/10 px-2 py-1 rounded mt-1 inline-block">
//                       {getUserRole()}
//                     </span>
//                   </div>
                  
//                   {/* Profile Settings - FIXED: Now properly navigates */}
//                   <div className="p-2">
//                     <button
//                       onClick={handleProfileNavigation}
//                       className="w-full text-left px-3 py-2 text-[#E9E6DD] hover:bg-[#00101f] rounded text-sm transition-colors flex items-center"
//                     >
//                       <User size={16} className="mr-2" />
//                       Profile Settings
//                     </button>
//                   </div>

//                   {/* Settings */}
//                   <div className="p-2">
//                     <button
//                       onClick={handleSettingsNavigation}
//                       className="w-full text-left px-3 py-2 text-[#E9E6DD] hover:bg-[#00101f] rounded text-sm transition-colors flex items-center"
//                     >
//                       <Settings size={16} className="mr-2" />
//                       Settings
//                     </button>
//                   </div>
                  
//                   {/* Logout */}
//                   <div className="p-2 border-t border-[#445048]">
//                     <button
//                       onClick={handleLogout}
//                       className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm bg-[#F57251]/10 text-[#F57251] hover:bg-[#F57251] hover:text-[#001524] rounded-lg transition-colors font-medium"
//                     >
//                       <LogOut size={16} />
//                       <span>Logout</span>
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Mobile: Current Page Title - Shown on small screens only */}
//         <div className="md:hidden mt-4 pt-4 border-t border-[#445048]">
//           <h2 className="text-lg font-bold text-[#E9E6DD]">{currentPage}</h2>
//         </div>
//       </nav>
//     </div>
//   );
// };

// export default DashboardNavbar;


// // DashboardNavbar.tsx
// import React, { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { Link } from "react-router-dom";
// import { 
//   Bell, 
//   Search, 
//   ChevronDown, 
//   LogOut, 
//   Settings,
//   HelpCircle,
//   User,
//   Menu,
//   X
// } from "lucide-react";

// interface DashboardNavbarProps {
//   userType: 'admin' | 'user';
//   onMenuClick?: () => void; // For mobile sidebar toggle
// }

// const DashboardNavbar: React.FC<DashboardNavbarProps> = ({ 
//   userType,
//   onMenuClick 
// }) => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [userMenuOpen, setUserMenuOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [notificationsOpen, setNotificationsOpen] = useState(false);

//   // Get user from Redux store or localStorage
//   const { user } = useSelector((state: any) => state.auth) || 
//     { user: JSON.parse(localStorage.getItem('user') || 'null') };

//   // Get page title from path based on user type
//   const getPageTitle = (path: string): string => {
//     if (userType === 'admin') {
//       const adminTitles: Record<string, string> = {
//         '/admin': 'Dashboard',
//         '/admin/customers': 'Customers',
//         '/admin/fleet': 'Fleet Management',
//         '/admin/bookings': 'Bookings',
//         '/admin/analytics': 'Analytics',
//         '/admin/payments': 'Payments',
//         '/admin/receipts': 'Receipts',
//         '/admin/support': 'Support',
//         '/admin/review': 'Reviews',
//         '/admin/profile': 'Profile'
//       };
//       return adminTitles[path] || 'Admin Dashboard';
//     } else {
//       const userTitles: Record<string, string> = {
//         '/UserDashboard': 'Overview',
//         '/UserDashboard/vehicles': 'Browse Vehicles',
//         '/UserDashboard/my-bookings': 'My Bookings',
//         '/UserDashboard/my-payments': 'Payments',
//         '/UserDashboard/settings': 'Settings',
//         '/UserDashboard/profile': 'Profile',
//         '/UserDashboard/support': 'Support',
//         '/UserDashboard/review': 'Reviews',
//         '/UserDashboard/my-receipts': 'Receipts'
//       };
//       return userTitles[path] || 'User Dashboard';
//     }
//   };

//   // Get user initials
//   const getUserInitials = (): string => {
//     if (!user) return userType === 'admin' ? 'A' : 'U';
//     const { first_name, last_name } = user;
//     return `${first_name?.[0] || ''}${last_name?.[0] || ''}`.toUpperCase() || 
//            (userType === 'admin' ? 'A' : 'U');
//   };

//   // Get user role display text
//   const getUserRole = (): string => {
//     if (!user) return userType === 'admin' ? 'Administrator' : 'Customer';
//     const role = user.role || (userType === 'admin' ? 'admin' : 'user');
//     return role === 'superAdmin' ? 'Super Administrator' : 
//            role === 'admin' ? 'Administrator' : 
//            role.charAt(0).toUpperCase() + role.slice(1);
//   };

//   // Handle logout
//   const handleLogout = (): void => {
//     localStorage.removeItem('user');
//     localStorage.removeItem('token');
//     navigate('/login');
//   };

//   // Get profile route based on user type
//   const getProfileRoute = (): string => {
//     return userType === 'admin' ? '/admin/profile' : '/UserDashboard/profile';
//   };

//   const currentPage = getPageTitle(location.pathname);

//   // Fixed navigation function
//   const handleProfileNavigation = (): void => {
//     navigate(getProfileRoute());
//     setUserMenuOpen(false);
//   };

//   const handleSettingsNavigation = (): void => {
//     const settingsRoute = userType === 'admin' ? '/admin/settings' : '/UserDashboard/settings';
//     navigate(settingsRoute);
//     setUserMenuOpen(false);
//   };

//   return (
//     <div className="p-4 bg-[#E9E6DD]">
//       <nav className="max-w-7xl mx-auto bg-[#001524] rounded-2xl p-4 shadow-lg">
//         <div className="flex items-center justify-between">
          
//           {/* Left: Mobile Menu Button + Brand */}
//           <div className="flex items-center space-x-4">
//             {/* Mobile Menu Button for Sidebar */}
//             <button
//               onClick={onMenuClick}
//               className="lg:hidden p-2 text-[#C4AD9D] hover:text-[#E9E6DD] hover:bg-[#00101f] rounded-lg transition-colors"
//               aria-label="Toggle sidebar menu"
//             >
//               <Menu size={24} />
//             </button>
            
//             {/* Brand - Keep original styling */}
//             <Link to={userType === 'admin' ? '/admin' : '/UserDashboard'} 
//                   className="flex items-center space-x-2">
//               <div className="w-10 h-10 rounded-full bg-[#027480] flex items-center justify-center">
//                 <span className="text-[#E9E6DD] font-bold text-lg">V</span>
//               </div>
//               <div className="hidden md:block">
//                 <h1 className="text-xl font-bold text-[#E9E6DD]">VansKE Car Rental</h1>
//                 <p className="text-[#C4AD9D] text-sm">Luxury & Performance</p>
//               </div>
//               {/* Mobile Brand Text */}
//               <div className="md:hidden">
//                 <h1 className="text-lg font-bold text-[#E9E6DD]">VansKE</h1>
//                 <p className="text-[#C4AD9D] text-xs">Luxury & Performance</p>
//               </div>
//             </Link>
//           </div>

//           {/* Center: Current Page Title - Desktop Only */}
//           <div className="hidden lg:block">
//             <h2 className="text-xl font-bold text-[#E9E6DD]">{currentPage}</h2>
//           </div>

//           {/* Right: Search and User Actions */}
//           <div className="flex items-center space-x-3 md:space-x-4">
            
//             {/* Mobile Search Button */}
//             <button 
//               className="lg:hidden p-2 text-[#C4AD9D] hover:text-[#E9E6DD] hover:bg-[#00101f] rounded-lg transition-colors"
//               aria-label="Search"
//               onClick={() => {/* Implement mobile search if needed */}}
//             >
//               <Search size={20} />
//             </button>

//             {/* Desktop Search */}
//             <div className="hidden lg:block">
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Search className="h-4 w-4 text-[#C4AD9D]" />
//                 </div>
//                 <input
//                   type="search"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   placeholder="Search..."
//                   className="pl-10 pr-4 py-2 w-48 bg-[#00101f] border border-[#445048] rounded-lg text-[#E9E6DD] text-sm placeholder-[#C4AD9D] focus:outline-none focus:ring-1 focus:ring-[#027480]"
//                 />
//               </div>
//             </div>

//             {/* Notifications */}
//             <div className="relative">
//               <button
//                 onClick={() => setNotificationsOpen(!notificationsOpen)}
//                 className="relative p-2 text-[#C4AD9D] hover:text-[#E9E6DD] hover:bg-[#00101f] rounded-lg transition-colors"
//               >
//                 <Bell size={20} />
//                 <span className="absolute top-1 right-1 h-2 w-2 bg-[#F57251] rounded-full"></span>
//               </button>

//               {/* Notifications Dropdown */}
//               {notificationsOpen && (
//                 <div className="absolute right-0 mt-2 w-72 bg-[#001524] border border-[#445048] rounded-lg shadow-lg z-50">
//                   <div className="p-3 border-b border-[#445048]">
//                     <h3 className="text-[#E9E6DD] font-medium">Notifications</h3>
//                   </div>
//                   <div className="p-3 max-h-64 overflow-y-auto">
//                     {[1, 2, 3].map((notification) => (
//                       <div
//                         key={notification}
//                         className="py-2 border-b border-[#445048] last:border-b-0 cursor-pointer hover:bg-[#00101f] px-2 rounded"
//                       >
//                         <p className="text-[#E9E6DD] text-sm">
//                           {userType === 'admin' 
//                             ? `New booking request #${100 + notification}` 
//                             : `Your booking #${200 + notification} is confirmed`}
//                         </p>
//                         <p className="text-[#C4AD9D] text-xs mt-1">2 min ago</p>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Help/Support */}
//             <Link
//               to={userType === 'admin' ? '/admin/support' : '/UserDashboard/support'}
//               className="hidden md:block p-2 text-[#C4AD9D] hover:text-[#E9E6DD] hover:bg-[#00101f] rounded-lg transition-colors"
//               title="Help & Support"
//             >
//               <HelpCircle size={20} />
//             </Link>

//             {/* Mobile Support Button */}
//             <Link
//               to={userType === 'admin' ? '/admin/support' : '/UserDashboard/support'}
//               className="md:hidden p-2 text-[#C4AD9D] hover:text-[#E9E6DD] hover:bg-[#00101f] rounded-lg transition-colors"
//               title="Help & Support"
//             >
//               <HelpCircle size={20} />
//             </Link>

//             {/* User Menu */}
//             <div className="relative">
//               <button
//                 onClick={() => setUserMenuOpen(!userMenuOpen)}
//                 className="flex items-center space-x-2 p-2 hover:bg-[#00101f] rounded-lg transition-colors"
//               >
//                 <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#D6CC99] flex items-center justify-center overflow-hidden">
//                   <span className="text-[#001524] font-bold text-sm md:text-base">
//                     {getUserInitials()}
//                   </span>
//                 </div>
//                 <ChevronDown className={`hidden md:block h-4 w-4 text-[#C4AD9D] transition-transform ${
//                   userMenuOpen ? 'rotate-180' : ''
//                 }`} />
//               </button>

//               {/* Dropdown Menu - Fixed profile navigation */}
//               {userMenuOpen && (
//                 <div className="absolute right-0 mt-2 w-56 bg-[#001524] border border-[#445048] rounded-lg shadow-lg z-50">
//                   {/* User Info */}
//                   <div className="p-3 border-b border-[#445048]">
//                     <p className="text-[#E9E6DD] font-medium truncate">
//                       {user?.first_name || 'User'} {user?.last_name || ''}
//                     </p>
//                     <p className="text-sm text-[#C4AD9D] truncate">{user?.email || 'No email'}</p>
//                     <span className="text-xs text-[#027480] bg-[#027480]/10 px-2 py-1 rounded mt-1 inline-block">
//                       {getUserRole()}
//                     </span>
//                   </div>
                  
//                   {/* Profile Settings */}
//                   <div className="p-2">
//                     <button
//                       onClick={handleProfileNavigation}
//                       className="w-full text-left px-3 py-2 text-[#E9E6DD] hover:bg-[#00101f] rounded text-sm transition-colors flex items-center"
//                     >
//                       <User size={16} className="mr-2" />
//                       Profile Settings
//                     </button>
//                   </div>

//                   {/* Settings */}
//                   <div className="p-2">
//                     <button
//                       onClick={handleSettingsNavigation}
//                       className="w-full text-left px-3 py-2 text-[#E9E6DD] hover:bg-[#00101f] rounded text-sm transition-colors flex items-center"
//                     >
//                       <Settings size={16} className="mr-2" />
//                       Settings
//                     </button>
//                   </div>

//                   {/* Support Link */}
//                   <div className="p-2">
//                     <Link
//                       to={userType === 'admin' ? '/admin/support' : '/UserDashboard/support'}
//                       className="w-full text-left px-3 py-2 text-[#E9E6DD] hover:bg-[#00101f] rounded text-sm transition-colors flex items-center"
//                       onClick={() => setUserMenuOpen(false)}
//                     >
//                       <HelpCircle size={16} className="mr-2" />
//                       Help & Support
//                     </Link>
//                   </div>
                  
//                   {/* Logout */}
//                   <div className="p-2 border-t border-[#445048]">
//                     <button
//                       onClick={handleLogout}
//                       className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm bg-[#F57251]/10 text-[#F57251] hover:bg-[#F57251] hover:text-[#001524] rounded-lg transition-colors font-medium"
//                     >
//                       <LogOut size={16} />
//                       <span>Logout</span>
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Mobile: Current Page Title */}
//         <div className="lg:hidden mt-4 pt-4 border-t border-[#445048]">
//           <h2 className="text-lg font-bold text-[#E9E6DD]">{currentPage}</h2>
//         </div>
//       </nav>
//     </div>
//   );
// };

// export default DashboardNavbar;





// //The Multi platform Navbar (All Roles)
// import React, { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { Link } from "react-router-dom";
// import { 
//   Bell, 
//   Search, 
//   ChevronDown, 
//   LogOut, 
//   Settings,
//   HelpCircle,
//   User
// } from "lucide-react";

// interface DashboardNavbarProps {
//   userType: 'admin' | 'user';
// }

// const DashboardNavbar: React.FC<DashboardNavbarProps> = ({ userType }) => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [userMenuOpen, setUserMenuOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [notificationsOpen, setNotificationsOpen] = useState(false);

//   // Get user from Redux store or localStorage
//   const { user } = useSelector((state: any) => state.auth) || 
//     { user: JSON.parse(localStorage.getItem('user') || 'null') };

//   // Get page title from path based on user type
//   const getPageTitle = (path: string): string => {
//     if (userType === 'admin') {
//       const adminTitles: Record<string, string> = {
//         '/admin': 'Dashboard',
//         '/admin/customers': 'Customers',
//         '/admin/fleet': 'Fleet Management',
//         '/admin/bookings': 'Bookings',
//         '/admin/analytics': 'Analytics',
//         '/admin/payments': 'Payments',
//         '/admin/messages': 'Messages',
//         '/admin/settings': 'Settings',
//         '/admin/receipts': 'Receipts',
//         '/admin/profile': 'Profile'
//       };
//       return adminTitles[path] || 'Admin Dashboard';
//     } else {
//       const userTitles: Record<string, string> = {
//         '/UserDashboard': 'Overview',
//         '/UserDashboard/vehicles': 'Browse Vehicles',
//         '/UserDashboard/my-bookings': 'My Bookings',
//         '/UserDashboard/payments': 'Payments',
//         '/UserDashboard/settings': 'Settings',
//         '/UserDashboard/profile': 'Profile',
//         '/UserDashboard/emergency': 'Support'
//       };
//       return userTitles[path] || 'User Dashboard';
//     }
//   };

//   // Get user initials
//   const getUserInitials = (): string => {
//     if (!user) return userType === 'admin' ? 'A' : 'U';
//     const { first_name, last_name } = user;
//     return `${first_name?.[0] || ''}${last_name?.[0] || ''}`.toUpperCase() || 
//            (userType === 'admin' ? 'A' : 'U');
//   };
// // ... other code stays the same ...

//   // Get user role display text
//   const getUserRole = (): string => {
//     if (!user) return userType === 'admin' ? 'Administrator' : 'Customer';
//     const role = user.role || (userType === 'admin' ? 'admin' : 'user');
//     return role === 'superAdmin' ? 'Super Administrator' : 
//            role === 'admin' ? 'Administrator' : 
//            role.charAt(0).toUpperCase() + role.slice(1);
//   };

//   // Handle logout
//   const handleLogout = (): void => {
//     localStorage.removeItem('user');
//     localStorage.removeItem('token');
//     navigate('/login');
//   };

//   // ... rest of the code stays exactly the same ...
//   // // Get user role display text
//   // const getUserRole = (): string => {
//   //   if (!user) return userType === 'admin' ? 'Administrator' : 'Customer';
//   //   const role = user.role || (userType === 'admin' ? 'admin' : 'user');
//   //   return role === 'superAdmin' ? 'Super Administrator' : 
//   //          role === 'admin' ? 'Administrator' : 
//   //          role.charAt(0).toUpperCase() + role.slice(1);
//   // };

//   // // Get dashboard title based on user type
//   // const getDashboardTitle = (): string => {
//   //   return userType === 'admin' ? 'Admin Panel' : 'Customer Dashboard';
//   // };

//   // // Handle logout
//   // const handleLogout = (): void => {
//   //   localStorage.removeItem('user');
//   //   localStorage.removeItem('token');
//   //   navigate('/login');
//   // };

//   // Get profile route based on user type - FIXED to use correct route
//   const getProfileRoute = (): string => {
//     return userType === 'admin' ? '/admin/profile' : '/UserDashboard/profile';
//   };

//   // Check if profile route exists in user's routes
//   const canNavigateToProfile = (): boolean => {
//    // const route = getProfileRoute();
//     // Check if the profile component is actually imported/routed in your app
//     return true; // You might want to add actual route checking logic here
//   };

//   const currentPage = getPageTitle(location.pathname);
//   //const dashboardTitle = getDashboardTitle();

//   // Fixed navigation function with validation
//   const handleProfileNavigation = (): void => {
//     const profileRoute = getProfileRoute();
//     if (canNavigateToProfile()) {
//       navigate(profileRoute);
//       setUserMenuOpen(false);
//     } else {
//       console.warn(`Profile route ${profileRoute} not available`);
//       // You could show a toast message here
//     }
//   };

//   const handleSettingsNavigation = (): void => {
//     const settingsRoute = userType === 'admin' ? '/admin/settings' : '/UserDashboard/settings';
//     navigate(settingsRoute);
//     setUserMenuOpen(false);
//   };

//   return (
//     <div className="p-4 bg-[#E9E6DD]">
//       {/* Restored original navbar container styling with rounded corners and margins */}
//       <nav className="max-w-7xl mx-auto bg-[#001524] rounded-2xl p-4 shadow-lg">
//         <div className="flex items-center justify-between">
          
//           {/* Brand - Restored original styling */}
//           <Link to={userType === 'admin' ? '/admin' : '/UserDashboard'} 
//                 className="flex items-center space-x-2">
//             <div className="w-10 h-10 rounded-full bg-[#027480] flex items-center justify-center">
//               <span className="text-[#E9E6DD] font-bold text-lg">V</span>
//             </div>
//             <div>
//               <h1 className="text-2xl font-bold text-[#E9E6DD]">VansKE Car Rental</h1>
//               <p className="text-[#C4AD9D] text-sm">Luxury & Performance</p>
//             </div>
//           </Link>

//           {/* Current Page Title */}
//           <div className="hidden md:block">
//             <h2 className="text-xl font-bold text-[#E9E6DD]">{currentPage}</h2>
//           </div>

//           {/* Right: Search and User */}
//           <div className="flex items-center space-x-4">
            
//             {/* Search */}
//             <div className="hidden md:block">
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Search className="h-4 w-4 text-[#C4AD9D]" />
//                 </div>
//                 <input
//                   type="search"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   placeholder="Search..."
//                   className="pl-10 pr-4 py-2 w-48 bg-[#00101f] border border-[#445048] rounded-lg text-[#E9E6DD] text-sm placeholder-[#C4AD9D] focus:outline-none focus:ring-1 focus:ring-[#027480]"
//                 />
//               </div>
//             </div>

//             {/* Notifications */}
//             <div className="relative">
//               <button
//                 onClick={() => setNotificationsOpen(!notificationsOpen)}
//                 className="relative p-2 text-[#C4AD9D] hover:text-[#E9E6DD] transition-colors"
//               >
//                 <Bell size={20} />
//                 <span className="absolute top-1 right-1 h-2 w-2 bg-[#F57251] rounded-full"></span>
//               </button>

//               {/* Notifications Dropdown */}
//               {notificationsOpen && (
//                 <div className="absolute right-0 mt-2 w-56 bg-[#001524] border border-[#445048] rounded-lg shadow-lg z-50">
//                   <div className="p-3 border-b border-[#445048]">
//                     <h3 className="text-[#E9E6DD] font-medium">Notifications</h3>
//                   </div>
//                   <div className="p-3">
//                     {[1, 2, 3].map((notification) => (
//                       <div
//                         key={notification}
//                         className="py-2 border-b border-[#445048] last:border-b-0 cursor-pointer hover:bg-[#00101f] px-2 rounded"
//                       >
//                         <p className="text-[#E9E6DD] text-sm">
//                           {userType === 'admin' 
//                             ? `Admin notification ${notification}` 
//                             : `User notification ${notification}`}
//                         </p>
//                         <p className="text-[#C4AD9D] text-xs mt-1">2 min ago</p>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Help/Support */}
//             <button
//               className="p-2 text-[#C4AD9D] hover:text-[#E9E6DD] transition-colors"
//               title="Help & Support"
//             >
//               <HelpCircle size={20} />
//             </button>

//             {/* User Menu */}
//             <div className="relative">
//               <button
//                 onClick={() => setUserMenuOpen(!userMenuOpen)}
//                 className="flex items-center space-x-2 p-2 hover:bg-[#00101f] rounded-lg transition-colors"
//               >
//                 <div className="w-10 h-10 rounded-full bg-[#D6CC99] flex items-center justify-center overflow-hidden">
//                   <span className="text-[#001524] font-bold">
//                     {getUserInitials()}
//                   </span>
//                 </div>
//                 <ChevronDown className={`h-4 w-4 text-[#C4AD9D] transition-transform ${
//                   userMenuOpen ? 'rotate-180' : ''
//                 }`} />
//               </button>

//               {/* Dropdown Menu - Fixed profile navigation */}
//               {userMenuOpen && (
//                 <div className="absolute right-0 mt-2 w-56 bg-[#001524] border border-[#445048] rounded-lg shadow-lg z-50">
//                   {/* User Info */}
//                   <div className="p-3 border-b border-[#445048]">
//                     <p className="text-[#E9E6DD] font-medium">
//                       {user?.first_name} {user?.last_name}
//                     </p>
//                     <p className="text-sm text-[#C4AD9D]">{user?.email}</p>
//                     <span className="text-xs text-[#027480] bg-[#027480]/10 px-2 py-1 rounded mt-1 inline-block">
//                       {getUserRole()}
//                     </span>
//                   </div>
                  
//                   {/* Profile Settings - FIXED: Now properly navigates */}
//                   <div className="p-2">
//                     <button
//                       onClick={handleProfileNavigation}
//                       className="w-full text-left px-3 py-2 text-[#E9E6DD] hover:bg-[#00101f] rounded text-sm transition-colors flex items-center"
//                     >
//                       <User size={16} className="mr-2" />
//                       Profile Settings
//                     </button>
//                   </div>

//                   {/* Settings */}
//                   <div className="p-2">
//                     <button
//                       onClick={handleSettingsNavigation}
//                       className="w-full text-left px-3 py-2 text-[#E9E6DD] hover:bg-[#00101f] rounded text-sm transition-colors flex items-center"
//                     >
//                       <Settings size={16} className="mr-2" />
//                       Settings
//                     </button>
//                   </div>
                  
//                   {/* Logout */}
//                   <div className="p-2 border-t border-[#445048]">
//                     <button
//                       onClick={handleLogout}
//                       className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm bg-[#F57251]/10 text-[#F57251] hover:bg-[#F57251] hover:text-[#001524] rounded-lg transition-colors font-medium"
//                     >
//                       <LogOut size={16} />
//                       <span>Logout</span>
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Mobile: Current Page Title */}
//         <div className="md:hidden mt-4 pt-4 border-t border-[#445048]">
//           <h2 className="text-lg font-bold text-[#E9E6DD]">{currentPage}</h2>
//         </div>
//       </nav>
//     </div>
//   );
// };

// export default DashboardNavbar;

