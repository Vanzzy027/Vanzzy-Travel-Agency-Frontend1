import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import { useGetProfileQuery, useUpdateProfileMutation } from "../../features/api/UserApi";
import { User, Mail, Phone, MapPin, Camera, Save, X, Shield, CheckCircle, Upload, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
const ProfilePage = () => {
    const fileInputRef = useRef(null);
    // Use RTK Query hooks
    const { data: profileData, isLoading, error: fetchError, refetch } = useGetProfileQuery();
    const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();
    const [isEditing, setIsEditing] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [success] = useState("");
    // Form state
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        contact_phone: "",
        address: "",
        email: "",
        national_id: "",
        photo: "",
    });
    // Initialize form data when profile loads
    useEffect(() => {
        if (profileData) {
            setFormData({
                first_name: profileData.first_name || "",
                last_name: profileData.last_name || "",
                contact_phone: profileData.contact_phone || "",
                address: profileData.address || "",
                email: profileData.email || "",
                national_id: profileData.national_id || "",
                photo: profileData.photo || "",
            });
        }
    }, [profileData]);
    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    // Handle image upload via backend API
    const handleImageUpload = async (file) => {
        if (!file)
            return;
        try {
            setUploadingImage(true);
            const formData = new FormData();
            formData.append('image', file);
            // Get token for authorization
            const token = localStorage.getItem('token');
            const response = await fetch('https://vanske-car-rental.azurewebsites.net/api/upload/profile-picture', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Upload failed');
            }
            const data = await response.json();
            const imageUrl = data.url;
            // Update profile with new image URL
            await updateProfile({ photo: imageUrl }).unwrap();
            // Update local form state
            setFormData(prev => ({ ...prev, photo: imageUrl }));
            // Refresh profile data
            refetch();
            toast.success("Profile picture updated successfully!");
        }
        catch (error) {
            console.error('Error uploading image:', error);
            toast.error(error.message || "Failed to upload image");
        }
        finally {
            setUploadingImage(false);
        }
    };
    // Handle file input change
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            toast.error("Please select a valid image file (JPEG, PNG, GIF, WebP)");
            return;
        }
        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            toast.error("Image size should be less than 5MB");
            return;
        }
        handleImageUpload(file);
    };
    // Trigger file input click
    const handleImageClick = () => {
        fileInputRef.current?.click();
    };
    // Handle profile update
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const updateData = {
                first_name: formData.first_name,
                last_name: formData.last_name,
                contact_phone: formData.contact_phone,
                address: formData.address
            };
            await updateProfile(updateData).unwrap();
            setIsEditing(false);
            // Refresh profile data
            refetch();
            // Update localStorage user data
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            localStorage.setItem('user', JSON.stringify({
                ...currentUser,
                first_name: formData.first_name,
                last_name: formData.last_name
            }));
            toast.success("Profile updated successfully!");
        }
        catch (err) {
            console.error("Error updating profile:", err);
            toast.error(err.data?.message || "Failed to update profile");
        }
    };
    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString)
            return "Never";
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    // Get role display text
    const getRoleDisplay = (role) => {
        switch (role) {
            case 'superAdmin': return 'Super Administrator';
            case 'admin': return 'Administrator';
            case 'user': return 'Customer';
            default: return role.charAt(0).toUpperCase() + role.slice(1);
        }
    };
    // Get status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'text-green-500 bg-green-500/10';
            case 'inactive': return 'text-yellow-500 bg-yellow-500/10';
            case 'banned': return 'text-red-500 bg-red-500/10';
            default: return 'text-gray-500 bg-gray-500/10';
        }
    };
    if (isLoading) {
        return (_jsx("div", { className: "p-8", children: _jsx("div", { className: "max-w-4xl mx-auto", children: _jsx("div", { className: "flex items-center justify-center h-64", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-[#027480]" }) }) }) }));
    }
    const profile = profileData;
    return (_jsx("div", { className: "p-6", children: _jsxs("div", { className: "max-w-4xl mx-auto", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-[#001524]", children: "Profile Settings" }), _jsx("p", { className: "text-[#C4AD9D] mt-2", children: "Manage your account information and preferences" })] }), _jsx("input", { type: "file", ref: fileInputRef, onChange: handleFileChange, accept: "image/*", className: "hidden" }), fetchError && (_jsx("div", { className: "mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500", children: "Error loading profile. Please try again." })), success && (_jsxs("div", { className: "mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500 flex items-center", children: [_jsx(CheckCircle, { className: "mr-2", size: 20 }), success] })), !profile ? (_jsx("div", { className: "text-center py-12", children: _jsx("p", { className: "text-[#001524]", children: "No profile data found." }) })) : (_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [_jsxs("div", { className: "lg:col-span-1", children: [_jsxs("div", { className: "bg-[#001524] rounded-2xl p-6 shadow-lg", children: [_jsxs("div", { className: "flex flex-col items-center mb-6", children: [_jsxs("div", { className: "relative mb-4 group", children: [_jsx("div", { className: "w-32 h-32 rounded-full bg-[#D6CC99] flex items-center justify-center overflow-hidden border-4 border-[#027480]", children: formData.photo ? (_jsx("img", { src: formData.photo, alt: `${formData.first_name} ${formData.last_name}`, className: "w-full h-full object-cover" })) : (_jsxs("span", { className: "text-[#001524] text-4xl font-bold", children: [formData.first_name?.[0], formData.last_name?.[0]] })) }), _jsx("div", { className: "absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity", children: _jsx("button", { type: "button", onClick: handleImageClick, disabled: uploadingImage, className: "p-3 bg-[#027480] rounded-full text-[#E9E6DD] hover:bg-[#F57251] transition-colors disabled:opacity-50 disabled:cursor-not-allowed", title: "Change profile picture", children: uploadingImage ? (_jsx("div", { className: "animate-spin rounded-full h-6 w-6 border-2 border-[#E9E6DD] border-t-transparent" })) : (_jsx(Camera, { size: 24 })) }) }), _jsx("div", { className: "absolute -top-2 -right-2", children: _jsx("div", { className: "relative", children: _jsx("button", { type: "button", onClick: handleImageClick, className: "w-10 h-10 rounded-full bg-[#F57251] text-[#E9E6DD] flex items-center justify-center shadow-lg hover:scale-110 transition-transform", title: "Upload new photo", children: _jsx(Upload, { size: 18 }) }) }) })] }), _jsxs("h2", { className: "text-2xl font-bold text-[#E9E6DD] text-center", children: [formData.first_name, " ", formData.last_name] }), _jsx("div", { className: `mt-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(profile.status)}`, children: profile.status.toUpperCase() }), _jsx("p", { className: "text-xs text-[#C4AD9D] mt-2 text-center", children: "Click the camera icon to upload a new profile picture" })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center space-x-3 text-[#E9E6DD]", children: [_jsx(Shield, { size: 20, className: "text-[#C4AD9D]" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-[#C4AD9D]", children: "Role" }), _jsx("p", { className: "font-medium", children: getRoleDisplay(profile.role) })] })] }), _jsxs("div", { className: "flex items-center space-x-3 text-[#E9E6DD]", children: [_jsx(Mail, { size: 20, className: "text-[#C4AD9D]" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-[#C4AD9D]", children: "Email" }), _jsx("p", { className: "font-medium", children: profile.email })] })] }), _jsxs("div", { className: "flex items-center space-x-3 text-[#E9E6DD]", children: [_jsx(User, { size: 20, className: "text-[#C4AD9D]" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-[#C4AD9D]", children: "Member Since" }), _jsx("p", { className: "font-medium", children: formatDate(profile.created_at) })] })] }), _jsxs("div", { className: "flex items-center space-x-3 text-[#E9E6DD]", children: [_jsx(Shield, { size: 20, className: "text-[#C4AD9D]" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-[#C4AD9D]", children: "Verification" }), _jsx("p", { className: `font-medium ${profile.verified ? 'text-green-400' : 'text-yellow-400'}`, children: profile.verified ? 'Verified' : 'Pending Verification' })] })] }), _jsxs("div", { className: "pt-4 border-t border-[#445048]", children: [_jsx("p", { className: "text-sm text-[#C4AD9D] mb-2", children: "Account ID" }), _jsx("p", { className: "text-xs font-mono text-[#E9E6DD] bg-[#00101f] p-2 rounded break-all", children: profile.user_id })] })] })] }), _jsxs("div", { className: "mt-6 bg-[#001524] rounded-2xl p-6 shadow-lg", children: [_jsx("h3", { className: "text-lg font-bold text-[#E9E6DD] mb-4", children: "Profile Status" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-[#C4AD9D] text-sm", children: "Profile Completeness" }), _jsx("span", { className: "text-[#E9E6DD] font-medium", children: "85%" })] }), _jsx("div", { className: "w-full bg-[#445048] rounded-full h-2", children: _jsx("div", { className: "bg-[#027480] h-2 rounded-full", style: { width: '85%' } }) }), _jsx("div", { className: "pt-3 border-t border-[#445048]", children: _jsx("p", { className: "text-xs text-[#C4AD9D]", children: "Add profile picture and complete address to reach 100%" }) })] })] })] }), _jsx("div", { className: "lg:col-span-2", children: _jsxs("div", { className: "bg-[#001524] rounded-2xl p-6 shadow-lg", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h3", { className: "text-xl font-bold text-[#E9E6DD]", children: isEditing ? 'Edit Profile Information' : 'Personal Information' }), !isEditing ? (_jsxs("button", { onClick: () => setIsEditing(true), className: "px-4 py-2 bg-gradient-to-r from-[#027480] to-[#F57251] text-[#E9E6DD] rounded-lg hover:from-[#026270] hover:to-[#e56546] transition-colors font-medium flex items-center", children: [_jsx(Camera, { size: 18, className: "mr-2" }), "Edit Profile"] })) : (_jsxs("div", { className: "flex space-x-2", children: [_jsxs("button", { onClick: () => {
                                                            setIsEditing(false);
                                                            setFormData({
                                                                first_name: profile.first_name,
                                                                last_name: profile.last_name,
                                                                contact_phone: profile.contact_phone,
                                                                address: profile.address || "",
                                                                email: profile.email,
                                                                national_id: profile.national_id,
                                                                photo: profile.photo || "",
                                                            });
                                                        }, className: "px-4 py-2 border border-[#445048] text-[#E9E6DD] rounded-lg hover:bg-[#00101f] transition-colors font-medium flex items-center", children: [_jsx(X, { size: 18, className: "mr-2" }), "Cancel"] }), _jsxs("button", { onClick: handleUpdateProfile, disabled: isSaving, className: "px-4 py-2 bg-gradient-to-r from-[#027480] to-[#F57251] text-[#E9E6DD] rounded-lg hover:from-[#026270] hover:to-[#e56546] transition-colors font-medium flex items-center disabled:opacity-50", children: [_jsx(Save, { size: 18, className: "mr-2" }), isSaving ? 'Saving...' : 'Save Changes'] })] }))] }), _jsx("form", { onSubmit: handleUpdateProfile, children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-[#C4AD9D] mb-2", children: "First Name" }), isEditing ? (_jsx("input", { type: "text", name: "first_name", value: formData.first_name, onChange: handleInputChange, required: true, className: "w-full p-3 bg-[#00101f] border border-[#445048] rounded-lg text-[#E9E6DD] focus:outline-none focus:ring-2 focus:ring-[#027480] focus:border-transparent", placeholder: "Enter first name" })) : (_jsx("p", { className: "p-3 bg-[#00101f] border border-[#445048] rounded-lg text-[#E9E6DD]", children: profile.first_name }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-[#C4AD9D] mb-2", children: "Last Name" }), isEditing ? (_jsx("input", { type: "text", name: "last_name", value: formData.last_name, onChange: handleInputChange, required: true, className: "w-full p-3 bg-[#00101f] border border-[#445048] rounded-lg text-[#E9E6DD] focus:outline-none focus:ring-2 focus:ring-[#027480] focus:border-transparent", placeholder: "Enter last name" })) : (_jsx("p", { className: "p-3 bg-[#00101f] border border-[#445048] rounded-lg text-[#E9E6DD]", children: profile.last_name }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-[#C4AD9D] mb-2", children: "Email Address" }), _jsxs("div", { className: "flex items-center p-3 bg-[#00101f] border border-[#445048] rounded-lg", children: [_jsx(Mail, { size: 20, className: "text-[#C4AD9D] mr-3" }), _jsx("span", { className: "text-[#E9E6DD]", children: profile.email })] }), _jsx("p", { className: "text-xs text-[#C4AD9D] mt-1", children: "Email cannot be changed for security reasons" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-[#C4AD9D] mb-2", children: "Phone Number" }), isEditing ? (_jsxs("div", { className: "relative", children: [_jsx(Phone, { size: 20, className: "absolute left-3 top-3 text-[#C4AD9D]" }), _jsx("input", { type: "tel", name: "contact_phone", value: formData.contact_phone, onChange: handleInputChange, required: true, className: "w-full pl-12 p-3 bg-[#00101f] border border-[#445048] rounded-lg text-[#E9E6DD] focus:outline-none focus:ring-2 focus:ring-[#027480] focus:border-transparent", placeholder: "Enter phone number" })] })) : (_jsxs("div", { className: "flex items-center p-3 bg-[#00101f] border border-[#445048] rounded-lg", children: [_jsx(Phone, { size: 20, className: "text-[#C4AD9D] mr-3" }), _jsx("span", { className: "text-[#E9E6DD]", children: profile.contact_phone })] }))] }), _jsxs("div", { className: "md:col-span-2", children: [_jsx("label", { className: "block text-sm font-medium text-[#C4AD9D] mb-2", children: "Address" }), isEditing ? (_jsxs("div", { className: "relative", children: [_jsx(MapPin, { size: 20, className: "absolute left-3 top-3 text-[#C4AD9D]" }), _jsx("input", { type: "text", name: "address", value: formData.address, onChange: handleInputChange, className: "w-full pl-12 p-3 bg-[#00101f] border border-[#445048] rounded-lg text-[#E9E6DD] focus:outline-none focus:ring-2 focus:ring-[#027480] focus:border-transparent", placeholder: "Enter your address" })] })) : (_jsxs("div", { className: "flex items-start p-3 bg-[#00101f] border border-[#445048] rounded-lg", children: [_jsx(MapPin, { size: 20, className: "text-[#C4AD9D] mr-3 mt-1 flex-shrink-0" }), _jsx("span", { className: "text-[#E9E6DD]", children: profile.address || 'Not provided' })] }))] }), _jsxs("div", { className: "md:col-span-2", children: [_jsx("label", { className: "block text-sm font-medium text-[#C4AD9D] mb-2", children: "National ID" }), _jsxs("div", { className: "flex items-center p-3 bg-[#00101f] border border-[#445048] rounded-lg", children: [_jsx(Shield, { size: 20, className: "text-[#C4AD9D] mr-3" }), _jsx("span", { className: "text-[#E9E6DD] font-mono", children: profile.national_id })] }), _jsx("p", { className: "text-xs text-[#C4AD9D] mt-1", children: "For security reasons, National ID cannot be changed" })] }), _jsx("div", { className: "md:col-span-2 pt-6 border-t border-[#445048]", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsxs("p", { className: "text-sm text-[#C4AD9D]", children: ["Last updated: ", formatDate(profile.updated_at)] }), _jsxs("p", { className: "text-xs text-[#C4AD9D]", children: ["Account created: ", formatDate(profile.created_at)] })] }), profile.verified && (_jsxs("div", { className: "flex items-center text-green-400", children: [_jsx(CheckCircle, { size: 16, className: "mr-1" }), _jsx("span", { className: "text-sm", children: "Verified Account" })] }))] }) })] }) }), _jsxs("div", { className: "mt-8 pt-6 border-t border-[#445048]", children: [_jsxs("h4", { className: "text-lg font-bold text-[#E9E6DD] mb-3 flex items-center", children: [_jsx(ImageIcon, { size: 20, className: "mr-2" }), "Profile Picture Guidelines"] }), _jsxs("ul", { className: "text-sm text-[#C4AD9D] space-y-1", children: [_jsx("li", { children: "\u2022 Supported formats: JPG, PNG, GIF, WebP" }), _jsx("li", { children: "\u2022 Maximum file size: 5MB" }), _jsx("li", { children: "\u2022 Recommended dimensions: 400x400 pixels" }), _jsx("li", { children: "\u2022 Use a clear, well-lit photo of yourself" }), _jsx("li", { children: "\u2022 Square images work best" })] })] })] }) })] }))] }) }));
};
export default ProfilePage;
