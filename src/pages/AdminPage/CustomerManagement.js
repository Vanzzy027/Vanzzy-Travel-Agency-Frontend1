import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Search, UserX, ShieldAlert, RefreshCcw, Mail, Phone } from 'lucide-react';
import { useGetAllUsersQuery, useUpdateUserMutation } from '../../features/api/UserApi'; // Assuming this exists
import { toast } from 'sonner';
const CustomerManagement = () => {
    // 1. Fetch Users
    const { data: users, isLoading, error } = useGetAllUsersQuery();
    const [updateUser] = useUpdateUserMutation();
    // 2. Local State for Filtering
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    // 3. Handle Status Changes (Delete/Retrieve/Ban)
    const handleStatusChange = async (id, newStatus) => {
        try {
            await updateUser({ id, updates: { status: newStatus } }).unwrap();
            const actionMap = {
                active: 'User reactivated successfully',
                inactive: 'User deactivated (Soft Deleted)',
                banned: 'User has been banned'
            };
            toast.success(actionMap[newStatus]);
        }
        catch (err) {
            toast.error('Failed to update user status');
        }
    };
    // 4. Filtering Logic
    const filteredUsers = users?.filter((user) => {
        const matchesSearch = user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.national_id?.includes(searchTerm);
        const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
        return matchesSearch && matchesStatus;
    });
    if (isLoading)
        return _jsx("div", { className: "p-8 text-[#001524] animate-pulse", children: "Loading Customers..." });
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-[#001524]", children: "Customer Management" }), _jsx("p", { className: "text-gray-500", children: "View, manage, and verify customer accounts." })] }), _jsxs("div", { className: "bg-[#E9E6DD] px-4 py-2 rounded-lg border border-[#D6CC99] text-[#001524] font-semibold", children: ["Total Users: ", users?.length || 0] })] }), _jsxs("div", { className: "bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 justify-between", children: [_jsxs("div", { className: "relative flex-1 max-w-md", children: [_jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400", size: 20 }), _jsx("input", { type: "text", placeholder: "Search by name, email, or National ID...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#027480]" })] }), _jsx("div", { className: "flex bg-gray-100 p-1 rounded-lg", children: ['all', 'active', 'inactive', 'banned'].map((status) => (_jsx("button", { onClick: () => setFilterStatus(status), className: `px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-all ${filterStatus === status
                                ? 'bg-white text-[#027480] shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'}`, children: status }, status))) })] }), _jsx("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-left", children: [_jsx("thead", { className: "bg-[#001524] text-[#E9E6DD] text-sm uppercase tracking-wider", children: _jsxs("tr", { children: [_jsx("th", { className: "p-4", children: "Customer" }), _jsx("th", { className: "p-4", children: "Contact Info" }), _jsx("th", { className: "p-4", children: "Status" }), _jsx("th", { className: "p-4", children: "Verification" }), _jsx("th", { className: "p-4 text-right", children: "Actions" })] }) }), _jsxs("tbody", { className: "divide-y divide-gray-100", children: [filteredUsers?.map((user) => (_jsxs("tr", { className: "hover:bg-gray-50 transition-colors", children: [_jsx("td", { className: "p-4", children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-10 h-10 rounded-full bg-[#027480]/10 flex items-center justify-center text-[#027480] font-bold", children: user.photo ? (_jsx("img", { src: user.photo, alt: "", className: "w-full h-full rounded-full object-cover" })) : (user.first_name[0]) }), _jsxs("div", { children: [_jsxs("div", { className: "font-semibold text-[#001524]", children: [user.first_name, " ", user.last_name] }), _jsxs("div", { className: "text-xs text-gray-500", children: ["ID: ", user.national_id || 'N/A'] })] })] }) }), _jsx("td", { className: "p-4", children: _jsxs("div", { className: "flex flex-col space-y-1", children: [_jsxs("div", { className: "flex items-center text-sm text-gray-600", children: [_jsx(Mail, { size: 14, className: "mr-2" }), " ", user.email] }), _jsxs("div", { className: "flex items-center text-sm text-gray-600", children: [_jsx(Phone, { size: 14, className: "mr-2" }), " ", user.contact_phone] })] }) }), _jsx("td", { className: "p-4", children: _jsxs("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.status === 'active' ? 'bg-green-100 text-green-800' :
                                                        user.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                                                            'bg-red-100 text-red-800'}`, children: [user.status === 'active' && _jsx("span", { className: "w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5" }), user.status] }) }), _jsx("td", { className: "p-4", children: user.verified ? (_jsxs("span", { className: "flex items-center text-[#027480] text-sm font-semibold", children: [_jsx(ShieldAlert, { size: 16, className: "mr-1" }), " Verified"] })) : (_jsx("span", { className: "text-orange-500 text-sm flex items-center", children: "Pending" })) }), _jsx("td", { className: "p-4 text-right", children: _jsxs("div", { className: "flex justify-end gap-2", children: [user.status !== 'active' && (_jsx("button", { onClick: () => handleStatusChange(user.user_id, 'active'), className: "p-2 text-green-600 hover:bg-green-50 rounded-lg tooltip", title: "Reactivate User", children: _jsx(RefreshCcw, { size: 18 }) })), user.status === 'active' && (_jsx("button", { onClick: () => handleStatusChange(user.user_id, 'inactive'), className: "p-2 text-gray-500 hover:bg-gray-100 rounded-lg", title: "Deactivate (Soft Delete)", children: _jsx(UserX, { size: 18 }) })), user.status !== 'banned' && (_jsx("button", { onClick: () => handleStatusChange(user.user_id, 'banned'), className: "p-2 text-red-500 hover:bg-red-50 rounded-lg", title: "Ban User", children: _jsx(ShieldAlert, { size: 18 }) }))] }) })] }, user.user_id))), filteredUsers?.length === 0 && (_jsx("tr", { children: _jsx("td", { colSpan: 5, className: "p-8 text-center text-gray-500", children: "No customers found matching your search." }) }))] })] }) }) })] }));
};
export default CustomerManagement;
