import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useCreateBookingMutation } from '../features/api/BookingApi';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Car, Fuel, Settings, Users, Gauge, Shield, Calendar, MapPin, CheckCircle, Clock, CreditCard, Zap, Star, ShieldCheck, Wrench, AlertCircle, X } from 'lucide-react';
const VehicleDetailsModal = ({ vehicleId, onClose, vehicleData }) => {
    const [selectedTab, setSelectedTab] = useState('details');
    const navigate = useNavigate();
    // --- STATE ---
    const [bookingDates, setBookingDates] = useState({
        booking_date: '',
        return_date: '',
    });
    const [services, setServices] = useState({
        insurance: true, // Default to true for better UX
        roadside: true,
        driver: false,
    });
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [vehicle, setVehicle] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    // --- API HOOKS ---
    const [createBooking, { isLoading: isBookingLoading }] = useCreateBookingMutation();
    // --- HELPER FUNCTIONS ---
    const parseSafe = (data) => {
        if (!data)
            return [];
        if (Array.isArray(data))
            return data;
        if (typeof data === 'string') {
            try {
                const parsed = JSON.parse(data);
                return Array.isArray(parsed) ? parsed : [parsed];
            }
            catch (e) {
                // Check if it's a string with comma separation
                if (data.includes(',')) {
                    return data.split(',').map((item) => item.trim());
                }
                return [data];
            }
        }
        return [];
    };
    // --- FETCH VEHICLE DATA ---
    useEffect(() => {
        const fetchVehicleData = async () => {
            setIsLoading(true);
            try {
                // Try to get vehicle from localStorage or context first
                const vehiclesFromStorage = localStorage.getItem('availableVehicles');
                if (vehiclesFromStorage) {
                    const vehicles = JSON.parse(vehiclesFromStorage);
                    const foundVehicle = vehicles.find((v) => v.vehicle_id === vehicleId);
                    if (foundVehicle) {
                        setVehicle(foundVehicle);
                        setIsLoading(false);
                        return;
                    }
                }
                // If not found, fetch from API
                const response = await fetch(`https://vanske-car-rental.azurewebsites.net/api/vehicles/${vehicleId}`);
                if (response.ok) {
                    const data = await response.json();
                    setVehicle(data.data || data);
                }
                else {
                    toast.error('Failed to load vehicle details');
                }
            }
            catch (error) {
                console.error('Error fetching vehicle:', error);
                toast.error('Error loading vehicle details');
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchVehicleData();
    }, [vehicleId]);
    // If vehicleData is passed directly, use it
    useEffect(() => {
        if (vehicleData) {
            setVehicle(vehicleData);
        }
    }, [vehicleData]);
    // --- CALCULATIONS ---
    const calculateDays = () => {
        if (!bookingDates.booking_date || !bookingDates.return_date)
            return 0;
        const start = new Date(bookingDates.booking_date);
        const end = new Date(bookingDates.return_date);
        if (start >= end)
            return 0;
        const diffTime = Math.abs(end.getTime() - start.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };
    const calculateTotal = () => {
        if (!vehicle)
            return 0;
        const days = calculateDays();
        if (days === 0)
            return 0;
        let dailyTotal = Number(vehicle.rental_rate || 0);
        if (services.insurance)
            dailyTotal += 25;
        if (services.roadside)
            dailyTotal += 15;
        if (services.driver)
            dailyTotal += 50; // Increased for driver service
        return dailyTotal * days;
    };
    const days = calculateDays();
    const totalAmount = calculateTotal();
    // --- SUBMIT HANDLER ---
    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        if (!vehicle) {
            toast.error('Vehicle data not loaded');
            return;
        }
        // 1. Validation
        if (!bookingDates.booking_date || !bookingDates.return_date) {
            toast.error('Please select valid dates');
            return;
        }
        if (!termsAccepted) {
            toast.error('You must accept the terms and conditions');
            return;
        }
        try {
            // 2. Prepare Payload
            const payload = {
                vehicle_id: vehicleId,
                booking_date: bookingDates.booking_date,
                return_date: bookingDates.return_date,
                total_amount: totalAmount,
            };
            console.log("🚀 SENDING BOOKING REQUEST:", payload);
            // 3. API Call
            const result = await createBooking(payload).unwrap();
            console.log("✅ BOOKING CREATED:", result);
            // 4. Success Handling
            toast.success('Booking confirmed! 🎉 Redirecting to bookings...');
            // Clear form
            setBookingDates({ booking_date: '', return_date: '' });
            setTermsAccepted(false);
            // Close modal after delay
            setTimeout(() => {
                onClose();
                navigate('/UserDashboard/my-bookings');
            }, 1500);
        }
        catch (error) {
            console.error("Booking Error:", error);
            const errorMessage = error?.data?.error ||
                error?.data?.message ||
                error?.error ||
                'Failed to create booking. Please try again.';
            if (errorMessage && errorMessage.toLowerCase().includes('not available')) {
                toast.error('❌ Vehicle not available for these dates.');
            }
            else if (errorMessage && errorMessage.toLowerCase().includes('already booked')) {
                toast.error('❌ This vehicle is already booked for the selected dates.');
            }
            else {
                toast.error(errorMessage);
            }
        }
    };
    // --- EARLY RETURNS (LOADING/ERROR) ---
    if (isLoading) {
        return (_jsx("div", { className: "fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4", children: _jsxs("div", { className: "bg-[#001524] rounded-2xl p-8 max-w-md w-full text-center border border-[#027480]", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-[#027480] mx-auto mb-4" }), _jsx("p", { className: "text-[#E9E6DD] text-lg", children: "Loading vehicle details..." })] }) }));
    }
    if (!vehicle) {
        return (_jsx("div", { className: "fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4", children: _jsxs("div", { className: "bg-[#001524] rounded-2xl p-8 max-w-md w-full text-center border border-[#F57251]", children: [_jsx(AlertCircle, { className: "h-12 w-12 text-[#F57251] mx-auto mb-4" }), _jsx("p", { className: "text-[#F57251] text-lg mb-4", children: "Vehicle not found." }), _jsx("button", { onClick: onClose, className: "bg-[#445048] hover:bg-[#556059] text-[#E9E6DD] px-6 py-2 rounded-lg transition-colors", children: "Close" })] }) }));
    }
    // Parse data
    const images = parseSafe(vehicle.images);
    const features = parseSafe(vehicle.features);
    const defaultImage = 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=80';
    // Format date for min attribute
    const today = new Date().toISOString().split('T')[0];
    // --- MAIN RENDER ---
    return (_jsx("div", { className: "fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4", children: _jsxs("div", { className: "bg-[#001524] rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#445048]", children: [_jsxs("div", { className: "sticky top-0 bg-[#001524] border-b border-[#445048] p-6 flex justify-between items-center z-10", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "h-12 w-12 rounded-xl bg-gradient-to-br from-[#027480] to-[#014d57] flex items-center justify-center", children: _jsx(Car, { size: 24, className: "text-white" }) }), _jsxs("div", { children: [_jsxs("h2", { className: "text-2xl font-bold text-white", children: [vehicle.year, " ", vehicle.manufacturer, " ", vehicle.model] }), _jsxs("div", { className: "flex items-center gap-3 mt-1", children: [_jsx("span", { className: "text-sm text-[#C4AD9D]", children: vehicle.color }), _jsx("span", { className: "text-sm px-2 py-1 rounded-full bg-[#027480]/20 text-[#027480] font-medium", children: vehicle.status || 'Available' })] })] })] }), _jsx("button", { onClick: onClose, className: "text-[#C4AD9D] hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors", children: _jsx(X, { size: 24 }) })] }), _jsx("div", { className: "border-b border-[#445048] bg-[#001524]", children: _jsxs("div", { className: "flex px-6", children: [_jsxs("button", { onClick: () => setSelectedTab('details'), className: `py-4 px-6 font-semibold text-sm transition-colors relative flex items-center gap-2 ${selectedTab === 'details'
                                    ? 'text-[#027480] border-b-2 border-[#027480]'
                                    : 'text-[#C4AD9D] hover:text-[#E9E6DD]'}`, children: [_jsx(Car, { size: 18 }), "Vehicle Details"] }), _jsxs("button", { onClick: () => setSelectedTab('booking'), className: `py-4 px-6 font-semibold text-sm transition-colors relative flex items-center gap-2 ${selectedTab === 'booking'
                                    ? 'text-[#027480] border-b-2 border-[#027480]'
                                    : 'text-[#C4AD9D] hover:text-[#E9E6DD]'}`, children: [_jsx(Calendar, { size: 18 }), "Book This Vehicle"] })] }) }), _jsx("div", { className: "p-6", children: selectedTab === 'details' ? (
                    /* === DETAILS TAB === */
                    _jsxs("div", { className: "space-y-8", children: [_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [_jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "aspect-video w-full rounded-xl overflow-hidden bg-gradient-to-br from-[#0f2434] to-[#1a3247] border border-[#445048]", children: _jsx("img", { src: images[0] || defaultImage, alt: `${vehicle.manufacturer} ${vehicle.model}`, className: "w-full h-full object-cover", onError: (e) => {
                                                        e.target.src = defaultImage;
                                                    } }) }), images.length > 1 && (_jsx("div", { className: "grid grid-cols-4 gap-3", children: images.slice(0, 4).map((img, i) => (_jsx("img", { src: img, alt: `${vehicle.manufacturer} ${vehicle.model} - View ${i + 1}`, className: "h-20 w-full object-cover rounded-lg cursor-pointer border border-[#445048] hover:border-[#027480] transition-colors", onError: (e) => {
                                                        e.target.src = defaultImage;
                                                    } }, i))) }))] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "bg-gradient-to-br from-[#0f2434] to-[#1a3247] rounded-xl p-6 border border-[#445048]", children: [_jsxs("h3", { className: "text-lg font-bold text-white mb-4 flex items-center gap-2", children: [_jsx(ShieldCheck, { size: 20, className: "text-[#027480]" }), "Quick Facts"] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx(InfoBox, { label: "License Plate", value: vehicle.license_plate || '-', icon: _jsx(Car, { size: 16 }) }), _jsx(InfoBox, { label: "Status", value: vehicle.status || 'Available', highlight: vehicle.status === 'Available', icon: _jsx(Shield, { size: 16 }) }), _jsx(InfoBox, { label: "Mileage", value: `${(vehicle.current_mileage || 0).toLocaleString()} km`, icon: _jsx(Gauge, { size: 16 }) }), _jsx(InfoBox, { label: "Daily Rate", value: `$${vehicle.rental_rate || '0'}`, large: true, icon: _jsx(CreditCard, { size: 16 }) }), _jsx(InfoBox, { label: "VIN Number", value: vehicle.vin_number || '-', icon: _jsx(Zap, { size: 16 }) }), _jsx(InfoBox, { label: "Color", value: vehicle.color || '-', icon: _jsx(MapPin, { size: 16 }) })] })] }), _jsxs("div", { className: "bg-gradient-to-br from-[#0f2434] to-[#1a3247] rounded-xl p-6 border border-[#445048]", children: [_jsx("h3", { className: "text-lg font-bold text-white mb-4", children: "Pricing" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-[#C4AD9D]", children: "Daily Rate" }), _jsxs("span", { className: "text-2xl font-bold text-[#027480]", children: ["$", vehicle.rental_rate || '0'] })] }), vehicle.on_promo && (_jsxs("div", { className: "flex items-center gap-2 p-3 bg-[#F57251]/10 rounded-lg border border-[#F57251]/20", children: [_jsx(Star, { size: 16, className: "text-[#F57251]" }), _jsx("span", { className: "text-sm text-[#F57251] font-medium", children: "Special promotion applied!" })] }))] })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [_jsxs("div", { children: [_jsxs("h3", { className: "text-lg font-bold text-white mb-4 flex items-center gap-2", children: [_jsx(Wrench, { size: 20, className: "text-[#027480]" }), "Specifications"] }), _jsxs("div", { className: "bg-gradient-to-br from-[#0f2434] to-[#1a3247] rounded-xl p-6 border border-[#445048] space-y-4", children: [_jsx(SpecRow, { label: "Fuel Type", value: vehicle.fuel_type || '-', icon: _jsx(Fuel, { size: 16 }) }), _jsx(SpecRow, { label: "Transmission", value: vehicle.transmission || '-', icon: _jsx(Settings, { size: 16 }) }), _jsx(SpecRow, { label: "Seating Capacity", value: `${vehicle.seating_capacity || '0'} Seats`, icon: _jsx(Users, { size: 16 }) }), _jsx(SpecRow, { label: "Vehicle Type", value: vehicle.vehicle_type || 'Sedan', icon: _jsx(Car, { size: 16 }) }), vehicle.engine_capacity && _jsx(SpecRow, { label: "Engine Capacity", value: vehicle.engine_capacity, icon: _jsx(Zap, { size: 16 }) }), vehicle.fuel_efficiency && _jsx(SpecRow, { label: "Fuel Efficiency", value: vehicle.fuel_efficiency, icon: _jsx(Gauge, { size: 16 }) })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold text-white mb-4", children: "Features & Amenities" }), _jsx("div", { className: "bg-gradient-to-br from-[#0f2434] to-[#1a3247] rounded-xl p-6 border border-[#445048]", children: features.length > 0 ? (_jsx("div", { className: "grid grid-cols-2 gap-3", children: features.map((feat, i) => (feat && (_jsxs("div", { className: "flex items-center gap-2 p-3 bg-[#001524] rounded-lg border border-[#445048]", children: [_jsx(CheckCircle, { size: 14, className: "text-green-400" }), _jsx("span", { className: "text-sm text-white", children: feat })] }, i)))) })) : (_jsx("p", { className: "text-[#C4AD9D] text-center py-4", children: "No additional features listed" })) })] })] })] })) : (
                    /* === BOOKING TAB === */
                    _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "bg-gradient-to-br from-[#0f2434] to-[#1a3247] rounded-xl p-6 border border-[#445048]", children: [_jsxs("h3", { className: "text-lg font-bold text-white mb-4 flex items-center gap-2", children: [_jsx(Calendar, { size: 20, className: "text-[#027480]" }), "Booking Summary"] }), _jsxs("div", { className: "flex items-center gap-4 mb-6 p-4 bg-[#001524] rounded-lg border border-[#445048]", children: [_jsx("img", { src: images[0] || defaultImage, className: "w-20 h-20 object-cover rounded-lg", alt: `${vehicle.manufacturer} ${vehicle.model}`, onError: (e) => {
                                                            e.target.src = defaultImage;
                                                        } }), _jsxs("div", { children: [_jsxs("h4", { className: "text-white font-semibold", children: [vehicle.manufacturer, " ", vehicle.model] }), _jsxs("p", { className: "text-[#027480] font-bold text-lg", children: ["$", vehicle.rental_rate || '0', " ", _jsx("span", { className: "text-xs text-[#C4AD9D] font-normal", children: "/ day" })] })] })] }), days > 0 && (_jsxs("div", { className: "space-y-3 border-t border-[#445048] pt-4", children: [_jsxs("div", { className: "flex justify-between text-sm", children: [_jsxs("span", { className: "text-[#C4AD9D]", children: ["Vehicle Rental (", days, " days)"] }), _jsxs("span", { className: "text-white font-medium", children: ["$", Number(vehicle.rental_rate || 0) * days] })] }), services.insurance && (_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-[#C4AD9D]", children: "Full Insurance Coverage" }), _jsxs("span", { className: "text-white font-medium", children: ["$", 25 * days] })] })), services.roadside && (_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-[#C4AD9D]", children: "24/7 Roadside Assistance" }), _jsxs("span", { className: "text-white font-medium", children: ["$", 15 * days] })] })), services.driver && (_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-[#C4AD9D]", children: "Professional Driver Service" }), _jsxs("span", { className: "text-white font-medium", children: ["$", 50 * days] })] })), _jsx("div", { className: "border-t border-[#445048] pt-3 mt-2", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-lg font-bold text-white", children: "Total Amount" }), _jsxs("span", { className: "text-2xl font-bold text-[#F57251]", children: ["$", totalAmount.toFixed(2)] })] }) })] })), vehicle.status !== 'Available' && (_jsx("div", { className: "mt-4 p-3 bg-red-900/20 rounded-lg border border-red-900/30", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(AlertCircle, { size: 16, className: "text-red-400" }), _jsxs("p", { className: "text-red-400 text-sm", children: ["This vehicle is currently ", vehicle.status.toLowerCase(), ". Please check back later."] })] }) }))] }), _jsxs("div", { className: "bg-gradient-to-br from-[#0f2434] to-[#1a3247] rounded-xl p-6 border border-[#445048]", children: [_jsx("h4", { className: "font-bold text-white mb-4", children: "Booking Benefits" }), _jsxs("div", { className: "space-y-3 text-sm", children: [_jsxs("div", { className: "flex items-start gap-3", children: [_jsx(Shield, { size: 16, className: "text-green-400 mt-0.5 flex-shrink-0" }), _jsx("p", { className: "text-[#C4AD9D]", children: "Full insurance coverage included with every booking" })] }), _jsxs("div", { className: "flex items-start gap-3", children: [_jsx(Clock, { size: 16, className: "text-green-400 mt-0.5 flex-shrink-0" }), _jsx("p", { className: "text-[#C4AD9D]", children: "Free cancellation up to 24 hours before pickup" })] }), _jsxs("div", { className: "flex items-start gap-3", children: [_jsx(Star, { size: 16, className: "text-green-400 mt-0.5 flex-shrink-0" }), _jsx("p", { className: "text-[#C4AD9D]", children: "Priority customer support 24/7" })] })] })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold text-white mb-4", children: "Rental Details" }), _jsxs("form", { onSubmit: handleBookingSubmit, className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-white mb-2 flex items-center gap-2", children: [_jsx(Calendar, { size: 16, className: "text-[#027480]" }), "Start Date"] }), _jsx("input", { type: "date", value: bookingDates.booking_date, onChange: (e) => setBookingDates(p => ({ ...p, booking_date: e.target.value })), min: today, className: "w-full px-4 py-3 bg-[#0f2434] border border-[#445048] rounded-xl text-white focus:border-[#027480] focus:outline-none focus:ring-2 focus:ring-[#027480]/50", required: true })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-white mb-2 flex items-center gap-2", children: [_jsx(Calendar, { size: 16, className: "text-[#027480]" }), "End Date"] }), _jsx("input", { type: "date", value: bookingDates.return_date, onChange: (e) => setBookingDates(p => ({ ...p, return_date: e.target.value })), min: bookingDates.booking_date || today, className: "w-full px-4 py-3 bg-[#0f2434] border border-[#445048] rounded-xl text-white focus:border-[#027480] focus:outline-none focus:ring-2 focus:ring-[#027480]/50", required: true })] })] }), days > 0 && (_jsx("div", { className: "p-4 bg-[#027480]/10 rounded-lg border border-[#027480]/20", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-white", children: "Rental Period" }), _jsxs("span", { className: "text-[#027480] font-bold", children: [days, " day", days !== 1 ? 's' : ''] })] }) })), _jsxs("div", { className: "bg-gradient-to-br from-[#0f2434] to-[#1a3247] p-6 rounded-xl border border-[#445048]", children: [_jsx("h4", { className: "text-lg font-semibold text-white mb-4", children: "Additional Services" }), _jsxs("div", { className: "space-y-4", children: [_jsx(Checkbox, { label: "Full Insurance Coverage (+$25/day)", description: "Comprehensive coverage for peace of mind", checked: services.insurance, 
                                                                // 💡 FIX 1: Explicitly type 'c' as boolean
                                                                onChange: (c) => setServices(p => ({ ...p, insurance: c })) }), _jsx(Checkbox, { label: "24/7 Roadside Assistance (+$15/day)", description: "Help available anytime, anywhere", checked: services.roadside, 
                                                                // 💡 FIX 2: Explicitly type 'c' as boolean
                                                                onChange: (c) => setServices(p => ({ ...p, roadside: c })) }), _jsx(Checkbox, { label: "Professional Driver Service (+$50/day)", description: "Let our experienced drivers handle the journey", checked: services.driver, 
                                                                // 💡 FIX 3: Explicitly type 'c' as boolean
                                                                onChange: (c) => setServices(p => ({ ...p, driver: c })) })] })] }), _jsxs("div", { className: "flex items-start gap-3 p-4 bg-[#0f2434] rounded-lg border border-[#445048]", children: [_jsx("input", { id: "terms", type: "checkbox", checked: termsAccepted, onChange: (e) => setTermsAccepted(e.target.checked), className: "w-5 h-5 mt-0.5 accent-[#027480] cursor-pointer flex-shrink-0" }), _jsxs("label", { htmlFor: "terms", className: "text-sm text-[#C4AD9D] cursor-pointer select-none", children: ["I agree to the ", _jsx("span", { className: "text-[#027480] hover:underline", children: "Rental Terms & Conditions" }), " and understand the cancellation policy. I confirm that I have a valid driver's license and meet the age requirements."] })] }), _jsxs("div", { className: "flex gap-4 pt-4", children: [_jsxs("button", { type: "button", onClick: () => setSelectedTab('details'), className: "flex-1 bg-[#445048] hover:bg-[#556059] text-white px-6 py-4 rounded-xl transition-colors font-semibold flex items-center justify-center gap-2", children: [_jsx(ArrowLeft, { size: 18 }), "Back to Details"] }), _jsx("button", { type: "submit", disabled: isBookingLoading || vehicle.status !== 'Available' || !termsAccepted || days === 0, className: "flex-1 bg-gradient-to-r from-[#F57251] to-[#d65f41] hover:from-[#e56546] hover:to-[#c75437] text-white px-6 py-4 rounded-xl transition-all transform hover:scale-[1.02] font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#F57251]/20 flex items-center justify-center gap-3", children: isBookingLoading ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" }), "Processing..."] })) : (_jsxs(_Fragment, { children: [_jsx(CreditCard, { size: 20 }), "Book Now \u2022 $", totalAmount.toFixed(2)] })) })] })] })] })] })) })] }) }));
};
// --- SUB-COMPONENTS ---
const InfoBox = ({ label, value, highlight, large, icon }) => (_jsxs("div", { className: "space-y-1", children: [_jsxs("div", { className: "flex items-center gap-2", children: [icon, _jsx("span", { className: "text-xs text-[#C4AD9D] uppercase tracking-wider", children: label })] }), _jsx("span", { className: `block ${large ? 'text-2xl' : 'text-lg'} font-bold ${highlight ? 'text-[#027480]' : 'text-white'}`, children: value || '-' })] }));
const SpecRow = ({ label, value, icon }) => (_jsxs("div", { className: "flex items-center justify-between py-3 border-b border-[#445048] last:border-0", children: [_jsxs("div", { className: "flex items-center gap-3", children: [icon, _jsx("span", { className: "text-[#C4AD9D]", children: label })] }), _jsx("span", { className: "text-white font-medium", children: value || '-' })] }));
const Checkbox = ({ label, description, checked, onChange }) => (_jsxs("label", { className: "flex items-start gap-3 cursor-pointer group", children: [_jsx("div", { className: `w-6 h-6 rounded border-2 flex items-center justify-center transition-all mt-0.5 ${checked ? 'bg-[#027480] border-[#027480]' : 'border-[#445048] group-hover:border-[#027480]'}`, children: checked && _jsx(CheckCircle, { size: 14, className: "text-white" }) }), _jsx("input", { type: "checkbox", className: "hidden", checked: checked, onChange: (e) => onChange(e.target.checked) }), _jsxs("div", { className: "flex-1", children: [_jsx("span", { className: `block font-medium transition-colors ${checked ? 'text-white' : 'text-[#C4AD9D]'}`, children: label }), description && (_jsx("span", { className: "block text-xs text-[#445048] mt-1", children: description }))] })] }));
// ArrowLeft component (add this if not already imported)
const ArrowLeft = ({ size, className }) => (_jsx("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: className, children: _jsx("path", { d: "M19 12H5M12 19l-7-7 7-7" }) }));
export default VehicleDetailsModal;
