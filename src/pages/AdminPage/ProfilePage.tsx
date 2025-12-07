import React, { useState, useEffect, useRef } from "react";
import { useGetProfileQuery, useUpdateProfileMutation } from "../../features/api/UserApi";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Save, 
  X, 
  Shield, 
  CheckCircle,
  Upload,
  Image as ImageIcon
} from "lucide-react";
import { toast } from "sonner";

interface UserProfile {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  contact_phone: string;
  address: string | null;
  photo: string | null;
  role: string;
  status: string;
  verified: boolean;
  national_id: string;
  created_at: string;
  updated_at: string | null;
}

const ProfilePage: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Use RTK Query hooks
  const { data: profileData, isLoading, error: fetchError, refetch } = useGetProfileQuery();
  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [success, setSuccess] = useState<string>("");

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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle image upload via backend API
  const handleImageUpload = async (file: File) => {
    if (!file) return;

    try {
      setUploadingImage(true);
      
      const formData = new FormData();
      formData.append('image', file);
      
      // Get token for authorization
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:3000/api/upload/profile-picture', {
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
      
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast.error(error.message || "Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
  const handleUpdateProfile = async (e: React.FormEvent) => {
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

    } catch (err: any) {
      console.error("Error updating profile:", err);
      toast.error(err.data?.message || "Failed to update profile");
    }
  };









  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get role display text
  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'superAdmin': return 'Super Administrator';
      case 'admin': return 'Administrator';
      case 'user': return 'Customer';
      default: return role.charAt(0).toUpperCase() + role.slice(1);
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500 bg-green-500/10';
      case 'inactive': return 'text-yellow-500 bg-yellow-500/10';
      case 'banned': return 'text-red-500 bg-red-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#027480]"></div>
          </div>
        </div>
      </div>
    );
  }

  const profile = profileData as UserProfile | undefined;

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#001524]">Profile Settings</h1>
          <p className="text-[#C4AD9D] mt-2">Manage your account information and preferences</p>
        </div>

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {/* Error Messages */}
        {fetchError && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
            Error loading profile. Please try again.
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500 flex items-center">
            <CheckCircle className="mr-2" size={20} />
            {success}
          </div>
        )}

        {!profile ? (
          <div className="text-center py-12">
            <p className="text-[#001524]">No profile data found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-[#001524] rounded-2xl p-6 shadow-lg">
                {/* Profile Photo with Upload Functionality */}
                <div className="flex flex-col items-center mb-6">
                  <div className="relative mb-4 group">
                    <div className="w-32 h-32 rounded-full bg-[#D6CC99] flex items-center justify-center overflow-hidden border-4 border-[#027480]">
                      {formData.photo ? (
                        <img 
                          src={formData.photo} 
                          alt={`${formData.first_name} ${formData.last_name}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-[#001524] text-4xl font-bold">
                          {formData.first_name?.[0]}{formData.last_name?.[0]}
                        </span>
                      )}
                    </div>
                    
                    {/* Upload Button Overlay */}
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={handleImageClick}
                        disabled={uploadingImage}
                        className="p-3 bg-[#027480] rounded-full text-[#E9E6DD] hover:bg-[#F57251] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Change profile picture"
                      >
                        {uploadingImage ? (
                          <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#E9E6DD] border-t-transparent"></div>
                        ) : (
                          <Camera size={24} />
                        )}
                      </button>
                    </div>
                    
                    {/* Upload Indicator */}
                    <div className="absolute -top-2 -right-2">
                      <div className="relative">
                        <button
                          type="button"
                          onClick={handleImageClick}
                          className="w-10 h-10 rounded-full bg-[#F57251] text-[#E9E6DD] flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                          title="Upload new photo"
                        >
                          <Upload size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-[#E9E6DD] text-center">
                    {formData.first_name} {formData.last_name}
                  </h2>
                  <div className={`mt-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(profile.status)}`}>
                    {profile.status.toUpperCase()}
                  </div>
                  
                  {/* Upload Hint */}
                  <p className="text-xs text-[#C4AD9D] mt-2 text-center">
                    Click the camera icon to upload a new profile picture
                  </p>
                </div>

                {/* Account Info */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-[#E9E6DD]">
                    <Shield size={20} className="text-[#C4AD9D]" />
                    <div>
                      <p className="text-sm text-[#C4AD9D]">Role</p>
                      <p className="font-medium">{getRoleDisplay(profile.role)}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-[#E9E6DD]">
                    <Mail size={20} className="text-[#C4AD9D]" />
                    <div>
                      <p className="text-sm text-[#C4AD9D]">Email</p>
                      <p className="font-medium">{profile.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-[#E9E6DD]">
                    <User size={20} className="text-[#C4AD9D]" />
                    <div>
                      <p className="text-sm text-[#C4AD9D]">Member Since</p>
                      <p className="font-medium">{formatDate(profile.created_at)}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-[#E9E6DD]">
                    <Shield size={20} className="text-[#C4AD9D]" />
                    <div>
                      <p className="text-sm text-[#C4AD9D]">Verification</p>
                      <p className={`font-medium ${profile.verified ? 'text-green-400' : 'text-yellow-400'}`}>
                        {profile.verified ? 'Verified' : 'Pending Verification'}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#445048]">
                    <p className="text-sm text-[#C4AD9D] mb-2">Account ID</p>
                    <p className="text-xs font-mono text-[#E9E6DD] bg-[#00101f] p-2 rounded break-all">
                      {profile.user_id}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Stats Card */}
              <div className="mt-6 bg-[#001524] rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-[#E9E6DD] mb-4">Profile Status</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[#C4AD9D] text-sm">Profile Completeness</span>
                    <span className="text-[#E9E6DD] font-medium">85%</span>
                  </div>
                  <div className="w-full bg-[#445048] rounded-full h-2">
                    <div className="bg-[#027480] h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <div className="pt-3 border-t border-[#445048]">
                    <p className="text-xs text-[#C4AD9D]">
                      Add profile picture and complete address to reach 100%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Edit Form */}
            <div className="lg:col-span-2">
              <div className="bg-[#001524] rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-[#E9E6DD]">
                    {isEditing ? 'Edit Profile Information' : 'Personal Information'}
                  </h3>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-gradient-to-r from-[#027480] to-[#F57251] text-[#E9E6DD] rounded-lg hover:from-[#026270] hover:to-[#e56546] transition-colors font-medium flex items-center"
                    >
                      <Camera size={18} className="mr-2" />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
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
                        }}
                        className="px-4 py-2 border border-[#445048] text-[#E9E6DD] rounded-lg hover:bg-[#00101f] transition-colors font-medium flex items-center"
                      >
                        <X size={18} className="mr-2" />
                        Cancel
                      </button>
                      <button
                        onClick={handleUpdateProfile}
                        disabled={isSaving}
                        className="px-4 py-2 bg-gradient-to-r from-[#027480] to-[#F57251] text-[#E9E6DD] rounded-lg hover:from-[#026270] hover:to-[#e56546] transition-colors font-medium flex items-center disabled:opacity-50"
                      >
                        <Save size={18} className="mr-2" />
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  )}
                </div>

                <form onSubmit={handleUpdateProfile}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* First Name */}
                    <div>
                      <label className="block text-sm font-medium text-[#C4AD9D] mb-2">
                        First Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleInputChange}
                          required
                          className="w-full p-3 bg-[#00101f] border border-[#445048] rounded-lg text-[#E9E6DD] focus:outline-none focus:ring-2 focus:ring-[#027480] focus:border-transparent"
                          placeholder="Enter first name"
                        />
                      ) : (
                        <p className="p-3 bg-[#00101f] border border-[#445048] rounded-lg text-[#E9E6DD]">
                          {profile.first_name}
                        </p>
                      )}
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className="block text-sm font-medium text-[#C4AD9D] mb-2">
                        Last Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleInputChange}
                          required
                          className="w-full p-3 bg-[#00101f] border border-[#445048] rounded-lg text-[#E9E6DD] focus:outline-none focus:ring-2 focus:ring-[#027480] focus:border-transparent"
                          placeholder="Enter last name"
                        />
                      ) : (
                        <p className="p-3 bg-[#00101f] border border-[#445048] rounded-lg text-[#E9E6DD]">
                          {profile.last_name}
                        </p>
                      )}
                    </div>

                    {/* Email (Read-only) */}
                    <div>
                      <label className="block text-sm font-medium text-[#C4AD9D] mb-2">
                        Email Address
                      </label>
                      <div className="flex items-center p-3 bg-[#00101f] border border-[#445048] rounded-lg">
                        <Mail size={20} className="text-[#C4AD9D] mr-3" />
                        <span className="text-[#E9E6DD]">{profile.email}</span>
                      </div>
                      <p className="text-xs text-[#C4AD9D] mt-1">
                        Email cannot be changed for security reasons
                      </p>
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-sm font-medium text-[#C4AD9D] mb-2">
                        Phone Number
                      </label>
                      {isEditing ? (
                        <div className="relative">
                          <Phone size={20} className="absolute left-3 top-3 text-[#C4AD9D]" />
                          <input
                            type="tel"
                            name="contact_phone"
                            value={formData.contact_phone}
                            onChange={handleInputChange}
                            required
                            className="w-full pl-12 p-3 bg-[#00101f] border border-[#445048] rounded-lg text-[#E9E6DD] focus:outline-none focus:ring-2 focus:ring-[#027480] focus:border-transparent"
                            placeholder="Enter phone number"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center p-3 bg-[#00101f] border border-[#445048] rounded-lg">
                          <Phone size={20} className="text-[#C4AD9D] mr-3" />
                          <span className="text-[#E9E6DD]">{profile.contact_phone}</span>
                        </div>
                      )}
                    </div>

                    {/* Address */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-[#C4AD9D] mb-2">
                        Address
                      </label>
                      {isEditing ? (
                        <div className="relative">
                          <MapPin size={20} className="absolute left-3 top-3 text-[#C4AD9D]" />
                          <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="w-full pl-12 p-3 bg-[#00101f] border border-[#445048] rounded-lg text-[#E9E6DD] focus:outline-none focus:ring-2 focus:ring-[#027480] focus:border-transparent"
                            placeholder="Enter your address"
                          />
                        </div>
                      ) : (
                        <div className="flex items-start p-3 bg-[#00101f] border border-[#445048] rounded-lg">
                          <MapPin size={20} className="text-[#C4AD9D] mr-3 mt-1 flex-shrink-0" />
                          <span className="text-[#E9E6DD]">{profile.address || 'Not provided'}</span>
                        </div>
                      )}
                    </div>

                    {/* National ID (Read-only) */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-[#C4AD9D] mb-2">
                        National ID
                      </label>
                      <div className="flex items-center p-3 bg-[#00101f] border border-[#445048] rounded-lg">
                        <Shield size={20} className="text-[#C4AD9D] mr-3" />
                        <span className="text-[#E9E6DD] font-mono">{profile.national_id}</span>
                      </div>
                      <p className="text-xs text-[#C4AD9D] mt-1">
                        For security reasons, National ID cannot be changed
                      </p>
                    </div>

                    {/* Last Updated */}
                    <div className="md:col-span-2 pt-6 border-t border-[#445048]">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-[#C4AD9D]">
                            Last updated: {formatDate(profile.updated_at)}
                          </p>
                          <p className="text-xs text-[#C4AD9D]">
                            Account created: {formatDate(profile.created_at)}
                          </p>
                        </div>
                        {profile.verified && (
                          <div className="flex items-center text-green-400">
                            <CheckCircle size={16} className="mr-1" />
                            <span className="text-sm">Verified Account</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </form>

                {/* Image Upload Guidelines */}
                <div className="mt-8 pt-6 border-t border-[#445048]">
                  <h4 className="text-lg font-bold text-[#E9E6DD] mb-3 flex items-center">
                    <ImageIcon size={20} className="mr-2" />
                    Profile Picture Guidelines
                  </h4>
                  <ul className="text-sm text-[#C4AD9D] space-y-1">
                    <li>• Supported formats: JPG, PNG, GIF, WebP</li>
                    <li>• Maximum file size: 5MB</li>
                    <li>• Recommended dimensions: 400x400 pixels</li>
                    <li>• Use a clear, well-lit photo of yourself</li>
                    <li>• Square images work best</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;









// // src/pages/admin/ProfilePage.tsx
// import React, { useState, useEffect } from "react";
// import { useGetProfileQuery, useUpdateProfileMutation } from "../../features/api/UserApi";
// import { useNavigate } from "react-router-dom";
// import { User, Mail, Phone, MapPin, Camera, Save, X, Shield } from "lucide-react";

// interface UserProfile {
//   user_id: string;
//   first_name: string;
//   last_name: string;
//   email: string;
//   contact_phone: string;
//   address: string | null;
//   photo: string | null;
//   role: string;
//   status: string;
//   verified: boolean;
//   national_id: string;
//   created_at: string;
//   updated_at: string | null;
// }

// const ProfilePage: React.FC = () => {
//   const navigate = useNavigate();
  
//   // Use RTK Query hooks
//   const { data: profileData, isLoading, error: fetchError, refetch } = useGetProfileQuery();
//   const [updateProfile, { isLoading: isSaving, error: updateError }] = useUpdateProfileMutation();

//   const [isEditing, setIsEditing] = useState(false);
//   const [success, setSuccess] = useState("");

//   // Form state
//   const [formData, setFormData] = useState({
//     first_name: "",
//     last_name: "",
//     contact_phone: "",
//     address: "",
//     email: "",
//     national_id: "",
//   });

//   // Initialize form data when profile loads
//   useEffect(() => {
//     if (profileData) {
//       setFormData({
//         first_name: profileData.first_name || "",
//         last_name: profileData.last_name || "",
//         contact_phone: profileData.contact_phone || "",
//         address: profileData.address || "",
//         email: profileData.email || "",
//         national_id: profileData.national_id || "",
//       });
//     }
//   }, [profileData]);

//   // Handle form input changes
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   // Handle profile update
//   const handleUpdateProfile = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     try {
//       setSuccess("");
      
//       const updateData = {
//         first_name: formData.first_name,
//         last_name: formData.last_name,
//         contact_phone: formData.contact_phone,
//         address: formData.address
//       };

//       await updateProfile(updateData).unwrap();
      
//       setSuccess("Profile updated successfully!");
//       setIsEditing(false);
      
//       // Refresh profile data
//       refetch();
      
//       // Update localStorage user data
//       const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
//       localStorage.setItem('user', JSON.stringify({
//         ...currentUser,
//         first_name: formData.first_name,
//         last_name: formData.last_name
//       }));

//     } catch (err: any) {
//       console.error("Error updating profile:", err);
//       // Error will be handled by RTK Query
//     }
//   };

//   // Format date for display
//   const formatDate = (dateString: string | null) => {
//     if (!dateString) return "Never";
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   // Get role display text
//   const getRoleDisplay = (role: string) => {
//     switch (role) {
//       case 'superAdmin': return 'Super Administrator';
//       case 'admin': return 'Administrator';
//       case 'user': return 'User';
//       default: return role;
//     }
//   };

//   // Get status color
//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'active': return 'text-green-500 bg-green-500/10';
//       case 'inactive': return 'text-yellow-500 bg-yellow-500/10';
//       case 'banned': return 'text-red-500 bg-red-500/10';
//       default: return 'text-gray-500 bg-gray-500/10';
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="p-8">
//         <div className="max-w-4xl mx-auto">
//           <div className="flex items-center justify-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#027480]"></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const profile = profileData as UserProfile | undefined;

//   return (
//     <div className="p-6">
//       <div className="max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-[#001524]">Profile Settings</h1>
//           <p className="text-[#C4AD9D] mt-2">Manage your account information and preferences</p>
//         </div>

//         {/* Error Messages */}
//         {fetchError && (
//           <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
//             Error loading profile. Please try again.
//           </div>
//         )}

//         {updateError && (
//           <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
//             {/* @ts-ignore - RTK Query error structure */}
//             {updateError.data?.message || "Failed to update profile"}
//           </div>
//         )}

//         {success && (
//           <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500">
//             {success}
//           </div>
//         )}

//         {!profile ? (
//           <div className="text-center py-12">
//             <p className="text-[#001524]">No profile data found.</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             {/* Left Column: Profile Card */}
//             <div className="lg:col-span-1">
//               <div className="bg-[#001524] rounded-2xl p-6 shadow-lg">
//                 {/* Profile Photo */}
//                 <div className="flex flex-col items-center mb-6">
//                   <div className="relative mb-4">
//                     <div className="w-32 h-32 rounded-full bg-[#D6CC99] flex items-center justify-center overflow-hidden border-4 border-[#027480]">
//                       {profile.photo ? (
//                         <img 
//                           src={profile.photo} 
//                           alt={`${profile.first_name} ${profile.last_name}`}
//                           className="w-full h-full object-cover"
//                         />
//                       ) : (
//                         <span className="text-[#001524] text-4xl font-bold">
//                           {profile.first_name?.[0]}{profile.last_name?.[0]}
//                         </span>
//                       )}
//                     </div>
//                     <button className="absolute bottom-2 right-2 p-2 bg-[#027480] rounded-full text-[#E9E6DD] hover:bg-[#F57251] transition-colors">
//                       <Camera size={18} />
//                     </button>
//                   </div>
                  
//                   <h2 className="text-2xl font-bold text-[#E9E6DD] text-center">
//                     {profile.first_name} {profile.last_name}
//                   </h2>
//                   <div className={`mt-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(profile.status)}`}>
//                     {profile.status.toUpperCase()}
//                   </div>
//                 </div>

//                 {/* Account Info */}
//                 <div className="space-y-4">
//                   <div className="flex items-center space-x-3 text-[#E9E6DD]">
//                     <Shield size={20} className="text-[#C4AD9D]" />
//                     <div>
//                       <p className="text-sm text-[#C4AD9D]">Role</p>
//                       <p className="font-medium">{getRoleDisplay(profile.role)}</p>
//                     </div>
//                   </div>

//                   <div className="flex items-center space-x-3 text-[#E9E6DD]">
//                     <Mail size={20} className="text-[#C4AD9D]" />
//                     <div>
//                       <p className="text-sm text-[#C4AD9D]">Email</p>
//                       <p className="font-medium">{profile.email}</p>
//                     </div>
//                   </div>

//                   <div className="flex items-center space-x-3 text-[#E9E6DD]">
//                     <User size={20} className="text-[#C4AD9D]" />
//                     <div>
//                       <p className="text-sm text-[#C4AD9D]">Member Since</p>
//                       <p className="font-medium">{formatDate(profile.created_at)}</p>
//                     </div>
//                   </div>

//                   <div className="pt-4 border-t border-[#445048]">
//                     <p className="text-sm text-[#C4AD9D] mb-2">Account ID</p>
//                     <p className="text-xs font-mono text-[#E9E6DD] bg-[#00101f] p-2 rounded">
//                       {profile.user_id}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Right Column: Edit Form */}
//             <div className="lg:col-span-2">
//               <div className="bg-[#001524] rounded-2xl p-6 shadow-lg">
//                 <div className="flex items-center justify-between mb-6">
//                   <h3 className="text-xl font-bold text-[#E9E6DD]">
//                     {isEditing ? 'Edit Profile' : 'Personal Information'}
//                   </h3>
//                   {!isEditing ? (
//                     <button
//                       onClick={() => setIsEditing(true)}
//                       className="px-4 py-2 bg-[#027480] text-[#E9E6DD] rounded-lg hover:bg-[#F57251] transition-colors font-medium"
//                     >
//                       Edit Profile
//                     </button>
//                   ) : (
//                     <div className="flex space-x-2">
//                       <button
//                         onClick={() => {
//                           setIsEditing(false);
//                           setFormData({
//                             first_name: profile.first_name,
//                             last_name: profile.last_name,
//                             contact_phone: profile.contact_phone,
//                             address: profile.address || "",
//                             email: profile.email,
//                             national_id: profile.national_id,
//                           });
//                         }}
//                         className="px-4 py-2 border border-[#445048] text-[#E9E6DD] rounded-lg hover:bg-[#00101f] transition-colors font-medium flex items-center"
//                       >
//                         <X size={18} className="mr-2" />
//                         Cancel
//                       </button>
//                       <button
//                         onClick={handleUpdateProfile}
//                         disabled={isSaving}
//                         className="px-4 py-2 bg-[#F57251] text-[#E9E6DD] rounded-lg hover:bg-[#e56546] transition-colors font-medium flex items-center disabled:opacity-50"
//                       >
//                         <Save size={18} className="mr-2" />
//                         {isSaving ? 'Saving...' : 'Save Changes'}
//                       </button>
//                     </div>
//                   )}
//                 </div>

//                 <form onSubmit={handleUpdateProfile}>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     {/* First Name */}
//                     <div>
//                       <label className="block text-sm font-medium text-[#C4AD9D] mb-2">
//                         First Name
//                       </label>
//                       {isEditing ? (
//                         <input
//                           type="text"
//                           name="first_name"
//                           value={formData.first_name}
//                           onChange={handleInputChange}
//                           required
//                           className="w-full p-3 bg-[#00101f] border border-[#445048] rounded-lg text-[#E9E6DD] focus:outline-none focus:ring-2 focus:ring-[#027480] focus:border-transparent"
//                         />
//                       ) : (
//                         <p className="p-3 bg-[#00101f] border border-[#445048] rounded-lg text-[#E9E6DD]">
//                           {profile.first_name}
//                         </p>
//                       )}
//                     </div>

//                     {/* Last Name */}
//                     <div>
//                       <label className="block text-sm font-medium text-[#C4AD9D] mb-2">
//                         Last Name
//                       </label>
//                       {isEditing ? (
//                         <input
//                           type="text"
//                           name="last_name"
//                           value={formData.last_name}
//                           onChange={handleInputChange}
//                           required
//                           className="w-full p-3 bg-[#00101f] border border-[#445048] rounded-lg text-[#E9E6DD] focus:outline-none focus:ring-2 focus:ring-[#027480] focus:border-transparent"
//                         />
//                       ) : (
//                         <p className="p-3 bg-[#00101f] border border-[#445048] rounded-lg text-[#E9E6DD]">
//                           {profile.last_name}
//                         </p>
//                       )}
//                     </div>

//                     {/* Email (Read-only) */}
//                     <div>
//                       <label className="block text-sm font-medium text-[#C4AD9D] mb-2">
//                         Email Address
//                       </label>
//                       <div className="flex items-center p-3 bg-[#00101f] border border-[#445048] rounded-lg">
//                         <Mail size={20} className="text-[#C4AD9D] mr-3" />
//                         <span className="text-[#E9E6DD]">{profile.email}</span>
//                       </div>
//                     </div>

//                     {/* Phone Number */}
//                     <div>
//                       <label className="block text-sm font-medium text-[#C4AD9D] mb-2">
//                         Phone Number
//                       </label>
//                       {isEditing ? (
//                         <div className="relative">
//                           <Phone size={20} className="absolute left-3 top-3 text-[#C4AD9D]" />
//                           <input
//                             type="tel"
//                             name="contact_phone"
//                             value={formData.contact_phone}
//                             onChange={handleInputChange}
//                             required
//                             className="w-full pl-12 p-3 bg-[#00101f] border border-[#445048] rounded-lg text-[#E9E6DD] focus:outline-none focus:ring-2 focus:ring-[#027480] focus:border-transparent"
//                           />
//                         </div>
//                       ) : (
//                         <div className="flex items-center p-3 bg-[#00101f] border border-[#445048] rounded-lg">
//                           <Phone size={20} className="text-[#C4AD9D] mr-3" />
//                           <span className="text-[#E9E6DD]">{profile.contact_phone}</span>
//                         </div>
//                       )}
//                     </div>

//                     {/* Address */}
//                     <div className="md:col-span-2">
//                       <label className="block text-sm font-medium text-[#C4AD9D] mb-2">
//                         Address
//                       </label>
//                       {isEditing ? (
//                         <div className="relative">
//                           <MapPin size={20} className="absolute left-3 top-3 text-[#C4AD9D]" />
//                           <input
//                             type="text"
//                             name="address"
//                             value={formData.address}
//                             onChange={handleInputChange}
//                             className="w-full pl-12 p-3 bg-[#00101f] border border-[#445048] rounded-lg text-[#E9E6DD] focus:outline-none focus:ring-2 focus:ring-[#027480] focus:border-transparent"
//                           />
//                         </div>
//                       ) : (
//                         <div className="flex items-start p-3 bg-[#00101f] border border-[#445048] rounded-lg">
//                           <MapPin size={20} className="text-[#C4AD9D] mr-3 mt-1 flex-shrink-0" />
//                           <span className="text-[#E9E6DD]">{profile.address || 'Not provided'}</span>
//                         </div>
//                       )}
//                     </div>

//                     {/* National ID (Read-only) */}
//                     <div className="md:col-span-2">
//                       <label className="block text-sm font-medium text-[#C4AD9D] mb-2">
//                         National ID
//                       </label>
//                       <p className="p-3 bg-[#00101f] border border-[#445048] rounded-lg text-[#E9E6DD] font-mono">
//                         {profile.national_id}
//                       </p>
//                       <p className="text-xs text-[#C4AD9D] mt-1">
//                         For security reasons, National ID cannot be changed
//                       </p>
//                     </div>

//                     {/* Last Updated */}
//                     <div className="md:col-span-2 pt-6 border-t border-[#445048]">
//                       <p className="text-sm text-[#C4AD9D]">
//                         Last updated: {formatDate(profile.updated_at)}
//                       </p>
//                     </div>
//                   </div>
//                 </form>

//                 {/* Security Section */}
//                 <div className="mt-8 pt-6 border-t border-[#445048]">
//                   <h4 className="text-lg font-bold text-[#E9E6DD] mb-4">Security</h4>
//                   <button
//                     onClick={() => navigate('/admin/change-password')}
//                     className="px-4 py-2 border border-[#445048] text-[#E9E6DD] rounded-lg hover:bg-[#00101f] transition-colors"
//                   >
//                     Change Password
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;