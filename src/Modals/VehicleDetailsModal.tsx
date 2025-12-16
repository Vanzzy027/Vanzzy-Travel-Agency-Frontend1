import React, { useState, useEffect } from 'react';
import { useCreateBookingMutation } from '../features/api/BookingApi';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { 
  Car, Fuel, Settings, Users, Gauge, Shield, Calendar, 
  MapPin, CheckCircle, Clock, CreditCard, Zap, Star, 
  ShieldCheck, Wrench, AlertCircle, X
} from 'lucide-react';

interface VehicleDetailsModalProps {
  vehicleId: number;
  onClose: () => void;
  vehicleData?: any; // Optional: If you want to pass vehicle data directly
}

const VehicleDetailsModal: React.FC<VehicleDetailsModalProps> = ({ vehicleId, onClose, vehicleData }) => {
  const [selectedTab, setSelectedTab] = useState<'details' | 'booking'>('details');
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
  const [vehicle, setVehicle] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // --- API HOOKS ---
  const [createBooking, { isLoading: isBookingLoading }] = useCreateBookingMutation();

  // --- HELPER FUNCTIONS ---
  const parseSafe = (data: any): any[] => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (typeof data === 'string') {
      try {
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch (e) {
        // Check if it's a string with comma separation
        if (data.includes(',')) {
          return data.split(',').map((item: string) => item.trim());
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
          const foundVehicle = vehicles.find((v: any) => v.vehicle_id === vehicleId);
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
        } else {
          toast.error('Failed to load vehicle details');
        }
      } catch (error) {
        console.error('Error fetching vehicle:', error);
        toast.error('Error loading vehicle details');
      } finally {
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
    if (!bookingDates.booking_date || !bookingDates.return_date) return 0;
    const start = new Date(bookingDates.booking_date);
    const end = new Date(bookingDates.return_date);
    if (start >= end) return 0;
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    if (!vehicle) return 0;
    const days = calculateDays();
    if (days === 0) return 0;

    let dailyTotal = Number(vehicle.rental_rate || 0);
    if (services.insurance) dailyTotal += 25;
    if (services.roadside) dailyTotal += 15;
    if (services.driver) dailyTotal += 50; // Increased for driver service
    
    return dailyTotal * days;
  };

  const days = calculateDays();
  const totalAmount = calculateTotal();

  // --- SUBMIT HANDLER ---
  const handleBookingSubmit = async (e: React.FormEvent) => {
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

    } catch (error: any) {
      console.error("Booking Error:", error);
      
      const errorMessage = error?.data?.error || 
                          error?.data?.message || 
                          error?.error || 
                          'Failed to create booking. Please try again.';

      if (errorMessage && errorMessage.toLowerCase().includes('not available')) {
        toast.error('❌ Vehicle not available for these dates.');
      } else if (errorMessage && errorMessage.toLowerCase().includes('already booked')) {
        toast.error('❌ This vehicle is already booked for the selected dates.');
      } else {
        toast.error(errorMessage);
      }
    }
  };

  // --- EARLY RETURNS (LOADING/ERROR) ---
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-[#001524] rounded-2xl p-8 max-w-md w-full text-center border border-[#027480]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#027480] mx-auto mb-4"></div>
          <p className="text-[#E9E6DD] text-lg">Loading vehicle details...</p>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-[#001524] rounded-2xl p-8 max-w-md w-full text-center border border-[#F57251]">
          <AlertCircle className="h-12 w-12 text-[#F57251] mx-auto mb-4" />
          <p className="text-[#F57251] text-lg mb-4">Vehicle not found.</p>
          <button 
            onClick={onClose} 
            className="bg-[#445048] hover:bg-[#556059] text-[#E9E6DD] px-6 py-2 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // Parse data
  const images = parseSafe(vehicle.images);
  const features = parseSafe(vehicle.features);
  const defaultImage = 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=80';

  // Format date for min attribute
  const today = new Date().toISOString().split('T')[0];

  // --- MAIN RENDER ---
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#001524] rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#445048]">
        
        {/* HEADER */}
        <div className="sticky top-0 bg-[#001524] border-b border-[#445048] p-6 flex justify-between items-center z-10">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#027480] to-[#014d57] flex items-center justify-center">
              <Car size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                {vehicle.year} {vehicle.manufacturer} {vehicle.model}
              </h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-sm text-[#C4AD9D]">{vehicle.color}</span>
                <span className="text-sm px-2 py-1 rounded-full bg-[#027480]/20 text-[#027480] font-medium">
                  {vehicle.status || 'Available'}
                </span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-[#C4AD9D] hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* TABS */}
        <div className="border-b border-[#445048] bg-[#001524]">
          <div className="flex px-6">
            <button
              onClick={() => setSelectedTab('details')}
              className={`py-4 px-6 font-semibold text-sm transition-colors relative flex items-center gap-2 ${
                selectedTab === 'details' 
                  ? 'text-[#027480] border-b-2 border-[#027480]' 
                  : 'text-[#C4AD9D] hover:text-[#E9E6DD]'
              }`}
            >
              <Car size={18} />
              Vehicle Details
            </button>
            <button
              onClick={() => setSelectedTab('booking')}
              className={`py-4 px-6 font-semibold text-sm transition-colors relative flex items-center gap-2 ${
                selectedTab === 'booking' 
                  ? 'text-[#027480] border-b-2 border-[#027480]' 
                  : 'text-[#C4AD9D] hover:text-[#E9E6DD]'
              }`}
            >
              <Calendar size={18} />
              Book This Vehicle
            </button>
          </div>
        </div>

        <div className="p-6">
          {selectedTab === 'details' ? (
            /* === DETAILS TAB === */
            <div className="space-y-8">
              {/* Images & Key Info */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Image Gallery */}
                <div className="space-y-4">
                  <div className="aspect-video w-full rounded-xl overflow-hidden bg-gradient-to-br from-[#0f2434] to-[#1a3247] border border-[#445048]">
                    <img 
                      src={images[0] || defaultImage} 
                      alt={`${vehicle.manufacturer} ${vehicle.model}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = defaultImage;
                      }}
                    />
                  </div>
                  {images.length > 1 && (
                    <div className="grid grid-cols-4 gap-3">
                      {images.slice(0, 4).map((img: string, i: number) => (
                        <img 
                          key={i} 
                          src={img} 
                          alt={`${vehicle.manufacturer} ${vehicle.model} - View ${i + 1}`}
                          className="h-20 w-full object-cover rounded-lg cursor-pointer border border-[#445048] hover:border-[#027480] transition-colors"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = defaultImage;
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Key Information */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-[#0f2434] to-[#1a3247] rounded-xl p-6 border border-[#445048]">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <ShieldCheck size={20} className="text-[#027480]" />
                      Quick Facts
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <InfoBox label="License Plate" value={vehicle.license_plate || '-'} icon={<Car size={16} />} />
                      <InfoBox label="Status" value={vehicle.status || 'Available'} highlight={vehicle.status === 'Available'} icon={<Shield size={16} />} />
                      <InfoBox label="Mileage" value={`${(vehicle.current_mileage || 0).toLocaleString()} km`} icon={<Gauge size={16} />} />
                      <InfoBox label="Daily Rate" value={`$${vehicle.rental_rate || '0'}`} large icon={<CreditCard size={16} />} />
                      <InfoBox label="VIN Number" value={vehicle.vin_number || '-'} icon={<Zap size={16} />} />
                      <InfoBox label="Color" value={vehicle.color || '-'} icon={<MapPin size={16} />} />
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="bg-gradient-to-br from-[#0f2434] to-[#1a3247] rounded-xl p-6 border border-[#445048]">
                    <h3 className="text-lg font-bold text-white mb-4">Pricing</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[#C4AD9D]">Daily Rate</span>
                        <span className="text-2xl font-bold text-[#027480]">${vehicle.rental_rate || '0'}</span>
                      </div>
                      {vehicle.on_promo && (
                        <div className="flex items-center gap-2 p-3 bg-[#F57251]/10 rounded-lg border border-[#F57251]/20">
                          <Star size={16} className="text-[#F57251]" />
                          <span className="text-sm text-[#F57251] font-medium">Special promotion applied!</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Specs & Features */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Specifications */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Wrench size={20} className="text-[#027480]" />
                    Specifications
                  </h3>
                  <div className="bg-gradient-to-br from-[#0f2434] to-[#1a3247] rounded-xl p-6 border border-[#445048] space-y-4">
                    <SpecRow label="Fuel Type" value={vehicle.fuel_type || '-'} icon={<Fuel size={16} />} />
                    <SpecRow label="Transmission" value={vehicle.transmission || '-'} icon={<Settings size={16} />} />
                    <SpecRow label="Seating Capacity" value={`${vehicle.seating_capacity || '0'} Seats`} icon={<Users size={16} />} />
                    <SpecRow label="Vehicle Type" value={vehicle.vehicle_type || 'Sedan'} icon={<Car size={16} />} />
                    {vehicle.engine_capacity && <SpecRow label="Engine Capacity" value={vehicle.engine_capacity} icon={<Zap size={16} />} />}
                    {vehicle.fuel_efficiency && <SpecRow label="Fuel Efficiency" value={vehicle.fuel_efficiency} icon={<Gauge size={16} />} />}
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Features & Amenities</h3>
                  <div className="bg-gradient-to-br from-[#0f2434] to-[#1a3247] rounded-xl p-6 border border-[#445048]">
                    {features.length > 0 ? (
                      <div className="grid grid-cols-2 gap-3">
                        {features.map((feat: string, i: number) => (
                          feat && (
                            <div key={i} className="flex items-center gap-2 p-3 bg-[#001524] rounded-lg border border-[#445048]">
                              <CheckCircle size={14} className="text-green-400" />
                              <span className="text-sm text-white">{feat}</span>
                            </div>
                          )
                        ))}
                      </div>
                    ) : (
                      <p className="text-[#C4AD9D] text-center py-4">No additional features listed</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* === BOOKING TAB === */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Left Column: Summary & Breakdown */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-[#0f2434] to-[#1a3247] rounded-xl p-6 border border-[#445048]">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Calendar size={20} className="text-[#027480]" />
                    Booking Summary
                  </h3>
                  <div className="flex items-center gap-4 mb-6 p-4 bg-[#001524] rounded-lg border border-[#445048]">
                    <img 
                      src={images[0] || defaultImage} 
                      className="w-20 h-20 object-cover rounded-lg"
                      alt={`${vehicle.manufacturer} ${vehicle.model}`}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = defaultImage;
                      }}
                    />
                    <div>
                      <h4 className="text-white font-semibold">{vehicle.manufacturer} {vehicle.model}</h4>
                      <p className="text-[#027480] font-bold text-lg">${vehicle.rental_rate || '0'} <span className="text-xs text-[#C4AD9D] font-normal">/ day</span></p>
                    </div>
                  </div>

                  {days > 0 && (
                    <div className="space-y-3 border-t border-[#445048] pt-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-[#C4AD9D]">Vehicle Rental ({days} days)</span>
                        <span className="text-white font-medium">${Number(vehicle.rental_rate || 0) * days}</span>
                      </div>
                      
                      {services.insurance && (
                        <div className="flex justify-between text-sm">
                          <span className="text-[#C4AD9D]">Full Insurance Coverage</span>
                          <span className="text-white font-medium">${25 * days}</span>
                        </div>
                      )}
                      {services.roadside && (
                        <div className="flex justify-between text-sm">
                          <span className="text-[#C4AD9D]">24/7 Roadside Assistance</span>
                          <span className="text-white font-medium">${15 * days}</span>
                        </div>
                      )}
                      {services.driver && (
                        <div className="flex justify-between text-sm">
                          <span className="text-[#C4AD9D]">Professional Driver Service</span>
                          <span className="text-white font-medium">${50 * days}</span>
                        </div>
                      )}

                      <div className="border-t border-[#445048] pt-3 mt-2">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-white">Total Amount</span>
                          <span className="text-2xl font-bold text-[#F57251]">${totalAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Availability Status */}
                  {vehicle.status !== 'Available' && (
                    <div className="mt-4 p-3 bg-red-900/20 rounded-lg border border-red-900/30">
                      <div className="flex items-center gap-2">
                        <AlertCircle size={16} className="text-red-400" />
                        <p className="text-red-400 text-sm">
                          This vehicle is currently {vehicle.status.toLowerCase()}. Please check back later.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Benefits */}
                <div className="bg-gradient-to-br from-[#0f2434] to-[#1a3247] rounded-xl p-6 border border-[#445048]">
                  <h4 className="font-bold text-white mb-4">Booking Benefits</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <Shield size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                      <p className="text-[#C4AD9D]">Full insurance coverage included with every booking</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                      <p className="text-[#C4AD9D]">Free cancellation up to 24 hours before pickup</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Star size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                      <p className="text-[#C4AD9D]">Priority customer support 24/7</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Form */}
              <div>
                <h3 className="text-lg font-bold text-white mb-4">Rental Details</h3>
                <form onSubmit={handleBookingSubmit} className="space-y-6">
                  
                  {/* Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
                        <Calendar size={16} className="text-[#027480]" />
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={bookingDates.booking_date}
                        onChange={(e) => setBookingDates(p => ({ ...p, booking_date: e.target.value }))}
                        min={today}
                        className="w-full px-4 py-3 bg-[#0f2434] border border-[#445048] rounded-xl text-white focus:border-[#027480] focus:outline-none focus:ring-2 focus:ring-[#027480]/50"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
                        <Calendar size={16} className="text-[#027480]" />
                        End Date
                      </label>
                      <input
                        type="date"
                        value={bookingDates.return_date}
                        onChange={(e) => setBookingDates(p => ({ ...p, return_date: e.target.value }))}
                        min={bookingDates.booking_date || today}
                        className="w-full px-4 py-3 bg-[#0f2434] border border-[#445048] rounded-xl text-white focus:border-[#027480] focus:outline-none focus:ring-2 focus:ring-[#027480]/50"
                        required
                      />
                    </div>
                  </div>

                  {/* Days Counter */}
                  {days > 0 && (
                    <div className="p-4 bg-[#027480]/10 rounded-lg border border-[#027480]/20">
                      <div className="flex justify-between items-center">
                        <span className="text-white">Rental Period</span>
                        <span className="text-[#027480] font-bold">{days} day{days !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  )}

                  {/* Services */}
                  {/* <div className="bg-gradient-to-br from-[#0f2434] to-[#1a3247] p-6 rounded-xl border border-[#445048]">
                    <h4 className="text-lg font-semibold text-white mb-4">Additional Services</h4>
                    <div className="space-y-4">
                      <Checkbox 
                        label="Full Insurance Coverage (+$25/day)" 
                        description="Comprehensive coverage for peace of mind"
                        checked={services.insurance} 
                        onChange={(c) => setServices(p => ({...p, insurance: c}))} 
                      />
                      <Checkbox 
                        label="24/7 Roadside Assistance (+$15/day)" 
                        description="Help available anytime, anywhere"
                        checked={services.roadside} 
                        onChange={(c) => setServices(p => ({...p, roadside: c}))} 
                      />
                      <Checkbox 
                        label="Professional Driver Service (+$50/day)" 
                        description="Let our experienced drivers handle the journey"
                        checked={services.driver} 
                        onChange={(c) => setServices(p => ({...p, driver: c}))} 
                      />
                    </div>
                  </div> */}
                  <div className="bg-gradient-to-br from-[#0f2434] to-[#1a3247] p-6 rounded-xl border border-[#445048]">
    <h4 className="text-lg font-semibold text-white mb-4">Additional Services</h4>
    <div className="space-y-4">
        <Checkbox 
            label="Full Insurance Coverage (+$25/day)" 
            description="Comprehensive coverage for peace of mind"
            checked={services.insurance} 
            // 💡 FIX 1: Explicitly type 'c' as boolean
            onChange={(c: boolean) => setServices(p => ({...p, insurance: c}))} 
        />
        <Checkbox 
            label="24/7 Roadside Assistance (+$15/day)" 
            description="Help available anytime, anywhere"
            checked={services.roadside} 
            // 💡 FIX 2: Explicitly type 'c' as boolean
            onChange={(c: boolean) => setServices(p => ({...p, roadside: c}))} 
        />
        <Checkbox 
            label="Professional Driver Service (+$50/day)" 
            description="Let our experienced drivers handle the journey"
            checked={services.driver} 
            // 💡 FIX 3: Explicitly type 'c' as boolean
            onChange={(c: boolean) => setServices(p => ({...p, driver: c}))} 
        />
    </div>
</div>

                  {/* Terms */}
                  <div className="flex items-start gap-3 p-4 bg-[#0f2434] rounded-lg border border-[#445048]">
                    <input
                      id="terms"
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="w-5 h-5 mt-0.5 accent-[#027480] cursor-pointer flex-shrink-0"
                    />
                    <label htmlFor="terms" className="text-sm text-[#C4AD9D] cursor-pointer select-none">
                      I agree to the <span className="text-[#027480] hover:underline">Rental Terms & Conditions</span> and understand the cancellation policy. I confirm that I have a valid driver's license and meet the age requirements.
                    </label>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 pt-4">
                    <button 
                      type="button"
                      onClick={() => setSelectedTab('details')}
                      className="flex-1 bg-[#445048] hover:bg-[#556059] text-white px-6 py-4 rounded-xl transition-colors font-semibold flex items-center justify-center gap-2"
                    >
                      <ArrowLeft size={18} />
                      Back to Details
                    </button>
                    <button 
                      type="submit"
                      disabled={isBookingLoading || vehicle.status !== 'Available' || !termsAccepted || days === 0}
                      className="flex-1 bg-gradient-to-r from-[#F57251] to-[#d65f41] hover:from-[#e56546] hover:to-[#c75437] text-white px-6 py-4 rounded-xl transition-all transform hover:scale-[1.02] font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#F57251]/20 flex items-center justify-center gap-3"
                    >
                      {isBookingLoading ? (
                        <>
                          <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard size={20} />
                          Book Now • ${totalAmount.toFixed(2)}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const InfoBox = ({ label, value, highlight, large, icon }: any) => (
  <div className="space-y-1">
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-xs text-[#C4AD9D] uppercase tracking-wider">{label}</span>
    </div>
    <span className={`block ${large ? 'text-2xl' : 'text-lg'} font-bold ${highlight ? 'text-[#027480]' : 'text-white'}`}>
      {value || '-'}
    </span>
  </div>
);

const SpecRow = ({ label, value, icon }: any) => (
  <div className="flex items-center justify-between py-3 border-b border-[#445048] last:border-0">
    <div className="flex items-center gap-3">
      {icon}
      <span className="text-[#C4AD9D]">{label}</span>
    </div>
    <span className="text-white font-medium">{value || '-'}</span>
  </div>
);

const Checkbox = ({ label, description, checked, onChange }: any) => (
  <label className="flex items-start gap-3 cursor-pointer group">
    <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all mt-0.5 ${checked ? 'bg-[#027480] border-[#027480]' : 'border-[#445048] group-hover:border-[#027480]'}`}>
      {checked && <CheckCircle size={14} className="text-white" />}
    </div>
    <input type="checkbox" className="hidden" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    <div className="flex-1">
      <span className={`block font-medium transition-colors ${checked ? 'text-white' : 'text-[#C4AD9D]'}`}>
        {label}
      </span>
      {description && (
        <span className="block text-xs text-[#445048] mt-1">{description}</span>
      )}
    </div>
  </label>
);

// ArrowLeft component (add this if not already imported)
const ArrowLeft = ({ size, className }: { size: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
);

export default VehicleDetailsModal;


// import React, { useState } from 'react';
// import { useGetVehicleByIdQuery } from '../features/api/VehicleAPI';
// import { useCreateBookingMutation } from '../features/api/BookingApi';
// import { toast } from 'sonner';
// import { useNavigate } from 'react-router-dom';

// interface VehicleDetailsModalProps {
//   vehicleId: number;
//   onClose: () => void;
// }

// const VehicleDetailsModal: React.FC<VehicleDetailsModalProps> = ({ vehicleId, onClose }) => {
//   const [selectedTab, setSelectedTab] = useState<'details' | 'booking'>('details');
//   const navigate = useNavigate();

//   // --- STATE ---
//   const [bookingDates, setBookingDates] = useState({
//     booking_date: '',
//     return_date: '',
//   });

//   const [services, setServices] = useState({
//     insurance: false,
//     roadside: false,
//     driver: false,
//   });

//   const [termsAccepted, setTermsAccepted] = useState(false);

//   // --- API HOOKS ---
//   const { data: vehicle, isLoading, error } = useGetVehicleByIdQuery(vehicleId);
//   const [createBooking, { isLoading: isBookingLoading }] = useCreateBookingMutation();

//   // --- HELPERS ---
//   const parseSafe = (data: any) => {
//     if (!data) return [];
//     if (Array.isArray(data)) return data;
//     try {
//       return JSON.parse(data);
//     } catch (e) {
//       return [];
//     }
//   };

//   const images = vehicle ? parseSafe(vehicle.images) : [];
//   const features = vehicle ? parseSafe(vehicle.features) : [];
//   const defaultImage = 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=80';

//   // --- CALCULATIONS ---
//   const calculateDays = () => {
//     if (!bookingDates.booking_date || !bookingDates.return_date) return 0;
//     const start = new Date(bookingDates.booking_date);
//     const end = new Date(bookingDates.return_date);
//     if (start >= end) return 0;
//     const diffTime = Math.abs(end.getTime() - start.getTime());
//     return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//   };

//   const calculateTotal = () => {
//     if (!vehicle) return 0;
//     const days = calculateDays();
//     if (days === 0) return 0;

//     let dailyTotal = Number(vehicle.rental_rate);
//     if (services.insurance) dailyTotal += 25;
//     if (services.roadside) dailyTotal += 15;
//     if (services.driver) dailyTotal += 10;
//     return dailyTotal * days;
//   };

//   const days = calculateDays();
//   const totalAmount = calculateTotal();

//   // --- SUBMIT HANDLER (FIXED) ---
//   const handleBookingSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     // 1. Validation
//     if (!bookingDates.booking_date || !bookingDates.return_date) {
//       toast.error('Please select valid dates');
//       return;
//     }
//     if (!termsAccepted) {
//       toast.error('You must accept the terms and conditions');
//       return;
//     }

//     try {
//       // 2. Prepare Payload
//       const payload = {
//         vehicle_id: vehicleId,
//         booking_date: bookingDates.booking_date,
//         return_date: bookingDates.return_date,
//         total_amount: totalAmount, // Use the calculated const
//       };

//       console.log("🚀 SENDING BOOKING REQUEST:", payload); 

//       // 3. API Call
//       await createBooking(payload).unwrap();

//       // 4. Success Handling
//       toast.success('Booking confirmed! 🎉');
//       onClose();
//       navigate('/UserDashboard/my-bookings'); 

//     } catch (error: any) {
//       console.error("Booking Error:", error);
      
//       const errorMessage = error?.data?.error || error?.data?.message || 'Failed to create booking';

//       if (errorMessage && errorMessage.includes('not available')) {
//         toast.error('❌ Vehicle not available for these dates.');
//       } else {
//         toast.error(errorMessage);
//       }
//     }
//   };

//   // --- EARLY RETURNS (LOADING/ERROR) ---
//   if (isLoading) {
//     return (
//       <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//         <div className="bg-[#001524] rounded-2xl p-8 max-w-2xl w-full text-white">Loading...</div>
//       </div>
//     );
//   }

//   if (error || !vehicle) {
//     return (
//       <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//         <div className="bg-[#001524] rounded-2xl p-8 max-w-md w-full text-center border border-[#F57251]">
//           <p className="text-[#F57251]">Vehicle not found.</p>
//           <button onClick={onClose} className="bg-gray-700 text-white px-4 py-2 mt-4 rounded">Close</button>
//         </div>
//       </div>
//     );
//   }

//   // --- MAIN RENDER ---
//   return (
//     <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//       <div className="bg-[#001524] rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#445048]">
        
//         {/* HEADER */}
//         <div className="flex justify-between items-center p-6 border-b border-[#445048] sticky top-0 bg-[#001524] z-10">
//           <div>
//             <h2 className="text-2xl font-bold text-[#E9E6DD]">
//               {vehicle.manufacturer} {vehicle.model}
//             </h2>
//             <p className="text-[#C4AD9D] text-sm">
//               {vehicle.year} • {vehicle.color} • {vehicle.vehicle_type}
//             </p>
//           </div>
//           <button onClick={onClose} className="text-[#C4AD9D] hover:text-[#F57251] text-2xl transition-colors">×</button>
//         </div>

//         {/* TABS */}
//         <div className="border-b border-[#445048] px-6 bg-[#001524]">
//           <div className="flex space-x-6">
//             <button
//               onClick={() => setSelectedTab('details')}
//               className={`py-4 font-semibold text-sm transition-colors relative ${
//                 selectedTab === 'details' ? 'text-[#027480]' : 'text-[#C4AD9D] hover:text-[#E9E6DD]'
//               }`}
//             >
//               Vehicle Details
//               {selectedTab === 'details' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#027480]"></span>}
//             </button>
//             <button
//               onClick={() => setSelectedTab('booking')}
//               className={`py-4 font-semibold text-sm transition-colors relative ${
//                 selectedTab === 'booking' ? 'text-[#027480]' : 'text-[#C4AD9D] hover:text-[#E9E6DD]'
//               }`}
//             >
//               Book This Vehicle
//               {selectedTab === 'booking' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#027480]"></span>}
//             </button>
//           </div>
//         </div>

//         <div className="p-6">
//           {selectedTab === 'details' ? (
//             /* === DETAILS TAB === */
//             <div className="space-y-8">
//               {/* Images & Key Info */}
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 <div className="space-y-4">
//                   <div className="aspect-video w-full rounded-xl overflow-hidden bg-[#445048]">
//                     <img src={images[0] || defaultImage} alt="Main" className="w-full h-full object-cover" />
//                   </div>
//                   {images.length > 1 && (
//                     <div className="grid grid-cols-4 gap-2">
//                       {images.slice(0, 4).map((img: string, i: number) => (
//                         <img key={i} src={img} alt="thumb" className="h-16 w-full object-cover rounded-md cursor-pointer border border-[#445048]" />
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 <div className="bg-[#445048]/20 rounded-xl p-6 border border-[#445048]">
//                   <div className="grid grid-cols-2 gap-6">
//                     <InfoBox label="License Plate" value={vehicle.license_plate} />
//                     <InfoBox label="Status" value={vehicle.status} highlight={vehicle.status === 'Available'} />
//                     <InfoBox label="Mileage" value={`${(vehicle.current_mileage || 0).toLocaleString()} km`} />
//                     <InfoBox label="Daily Rate" value={`$${vehicle.rental_rate}`} large />
//                   </div>
                  
//                   {/* Additional Pricing Info */}
//                   <div className="mt-6 pt-4 border-t border-[#445048] space-y-2">
//                     {vehicle.weekly_rate && (
//                       <div className="flex justify-between text-sm">
//                         <span className="text-[#C4AD9D]">Weekly Rate</span>
//                         <span className="text-[#E9E6DD] font-medium">${vehicle.weekly_rate}</span>
//                       </div>
//                     )}
//                     {vehicle.monthly_rate && (
//                       <div className="flex justify-between text-sm">
//                         <span className="text-[#C4AD9D]">Monthly Rate</span>
//                         <span className="text-[#E9E6DD] font-medium">${vehicle.monthly_rate}</span>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Specs & Features */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                 <div>
//                   <h3 className="text-[#E9E6DD] font-bold mb-4">Specifications</h3>
//                   <div className="bg-[#445048]/20 rounded-xl p-4 space-y-3 border border-[#445048]">
//                     <SpecRow label="Fuel Type" value={vehicle.fuel_type} />
//                     <SpecRow label="Transmission" value={vehicle.transmission} />
//                     <SpecRow label="Capacity" value={`${vehicle.seating_capacity} Seats`} />
//                     <SpecRow label="Engine" value={vehicle.engine_capacity} />
//                     <SpecRow label="Fuel Efficiency" value={vehicle.fuel_efficiency} />
//                     <SpecRow label="Insurance Group" value={vehicle.insurance_group} />
//                   </div>
//                 </div>
//                 <div>
//                   <h3 className="text-[#E9E6DD] font-bold mb-4">Features</h3>
//                   <div className="flex flex-wrap gap-2">
//                     {features.length > 0 ? features.map((feat: string, i: number) => (
//                       <span key={i} className="bg-[#445048] text-[#C4AD9D] px-3 py-1 rounded-lg text-sm border border-[#56635b]">
//                         {feat}
//                       </span>
//                     )) : <span className="text-[#C4AD9D]">No features listed</span>}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             /* === BOOKING TAB === */
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
//               {/* Left Column: Summary & Breakdown */}
//               <div className="space-y-6">
//                 <div className="bg-[#445048]/30 rounded-xl p-6 border border-[#445048]">
//                   <h3 className="text-lg font-bold text-[#E9E6DD] mb-4">Booking Summary</h3>
//                   <div className="flex items-center space-x-4 mb-6">
//                     <img src={images[0] || defaultImage} className="w-20 h-20 object-cover rounded-lg" alt="Thumbnail" />
//                     <div>
//                       <h4 className="text-[#E9E6DD] font-semibold">{vehicle.manufacturer} {vehicle.model}</h4>
//                       <p className="text-[#027480] font-bold">${vehicle.rental_rate} <span className="text-xs text-[#C4AD9D] font-normal">/ day</span></p>
//                     </div>
//                   </div>

//                   {days > 0 && (
//                     <div className="space-y-3 border-t border-[#445048] pt-4">
//                       <div className="flex justify-between text-sm text-[#C4AD9D]">
//                         <span>Vehicle Rental ({days} days)</span>
//                         <span>${Number(vehicle.rental_rate) * days}</span>
//                       </div>
                      
//                       {services.insurance && (
//                         <div className="flex justify-between text-sm text-[#C4AD9D]">
//                           <span>Full Insurance ($25/day)</span>
//                           <span>${25 * days}</span>
//                         </div>
//                       )}
//                       {services.roadside && (
//                         <div className="flex justify-between text-sm text-[#C4AD9D]">
//                           <span>Roadside Assist ($15/day)</span>
//                           <span>${15 * days}</span>
//                         </div>
//                       )}
//                       {services.driver && (
//                         <div className="flex justify-between text-sm text-[#C4AD9D]">
//                           <span>Extra Driver ($10/day)</span>
//                           <span>${10 * days}</span>
//                         </div>
//                       )}

//                       <div className="flex justify-between font-bold text-lg text-[#E9E6DD] border-t border-[#445048] pt-3 mt-2">
//                         <span>Total Amount</span>
//                         <span className="text-[#F57251]">${totalAmount}</span>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Right Column: Form */}
//               <div>
//                 <h3 className="text-lg font-bold text-[#E9E6DD] mb-4">Select Rental Period</h3>
//                 <form onSubmit={handleBookingSubmit} className="space-y-6">
                  
//                   {/* Dates */}
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-[#C4AD9D] mb-2">Start Date</label>
//                       <input
//                         type="date"
//                         value={bookingDates.booking_date}
//                         onChange={(e) => setBookingDates(p => ({ ...p, booking_date: e.target.value }))}
//                         min={new Date().toISOString().split('T')[0]}
//                         className="w-full px-4 py-3 bg-[#445048] border-2 border-transparent rounded-xl text-[#E9E6DD] focus:border-[#027480] focus:outline-none"
//                         required
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-[#C4AD9D] mb-2">End Date</label>
//                       <input
//                         type="date"
//                         value={bookingDates.return_date}
//                         onChange={(e) => setBookingDates(p => ({ ...p, return_date: e.target.value }))}
//                         min={bookingDates.booking_date}
//                         className="w-full px-4 py-3 bg-[#445048] border-2 border-transparent rounded-xl text-[#E9E6DD] focus:border-[#027480] focus:outline-none"
//                         required
//                       />
//                     </div>
//                   </div>

//                   {/* Services */}
//                   <div className="bg-[#445048]/20 p-4 rounded-xl border border-[#445048]">
//                     <h4 className="text-sm font-semibold text-[#E9E6DD] mb-3">Additional Services</h4>
//                     <div className="space-y-3">
//                       <Checkbox 
//                         label="Full Insurance Coverage (+$25/day)" 
//                         checked={services.insurance} 
//                         onChange={(c) => setServices(p => ({...p, insurance: c}))} 
//                       />
//                       <Checkbox 
//                         label="24/7 Roadside Assistance (+$15/day)" 
//                         checked={services.roadside} 
//                         onChange={(c) => setServices(p => ({...p, roadside: c}))} 
//                       />
//                       <Checkbox 
//                         label="Additional Driver (+$10/day)" 
//                         checked={services.driver} 
//                         onChange={(c) => setServices(p => ({...p, driver: c}))} 
//                       />
//                     </div>
//                   </div>

//                   {/* Terms */}
//                   <div className="flex items-start space-x-3 p-3 bg-[#445048]/10 rounded-lg">
//                     <input
//                       id="terms"
//                       type="checkbox"
//                       checked={termsAccepted}
//                       onChange={(e) => setTermsAccepted(e.target.checked)}
//                       className="w-5 h-5 mt-0.5 accent-[#027480] cursor-pointer"
//                     />
//                     <label htmlFor="terms" className="text-sm text-[#C4AD9D] cursor-pointer select-none">
//                       I agree to the <span className="text-[#027480] hover:underline">Rental Terms & Conditions</span> and understand the cancellation policy.
//                     </label>
//                   </div>

//                   {/* Actions */}
//                   <div className="flex space-x-4 pt-2">
//                     <button 
//                       type="button"
//                       onClick={() => setSelectedTab('details')}
//                       className="flex-1 bg-[#445048] text-[#E9E6DD] px-6 py-3 rounded-xl hover:bg-[#556059] transition-colors font-semibold"
//                     >
//                       Back
//                     </button>
//                     <button 
//                       type="submit"
//                       disabled={isBookingLoading || vehicle.status !== 'Available' || !termsAccepted}
//                       className="flex-1 bg-[#F57251] text-[#E9E6DD] px-6 py-3 rounded-xl hover:bg-[#e56546] transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#F57251]/20"
//                     >
//                       {isBookingLoading ? 'Processing...' : `Book Now • $${totalAmount}`}
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // --- SUB-COMPONENTS for Cleanliness ---

// const InfoBox = ({ label, value, highlight, large }: any) => (
//   <div>
//     <span className="text-[#C4AD9D] text-xs uppercase tracking-wider block mb-1">{label}</span>
//     <span className={`${large ? 'text-2xl' : 'text-base'} font-bold ${highlight ? 'text-[#027480]' : 'text-[#E9E6DD]'}`}>
//       {value || '-'}
//     </span>
//   </div>
// );

// const SpecRow = ({ label, value }: any) => (
//   <div className="flex justify-between items-center border-b border-[#445048] pb-2 last:border-0 last:pb-0">
//     <span className="text-[#C4AD9D] text-sm">{label}</span>
//     <span className="text-[#E9E6DD] font-medium text-sm text-right">{value || '-'}</span>
//   </div>
// );

// const Checkbox = ({ label, checked, onChange }: { label: string, checked: boolean, onChange: (c: boolean) => void }) => (
//   <label className="flex items-center space-x-3 cursor-pointer group">
//     <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${checked ? 'bg-[#027480] border-[#027480]' : 'border-[#C4AD9D] group-hover:border-[#E9E6DD]'}`}>
//       {checked && <span className="text-white text-xs">✓</span>}
//     </div>
//     <input type="checkbox" className="hidden" checked={checked} onChange={(e) => onChange(e.target.checked)} />
//     <span className={`text-sm transition-colors ${checked ? 'text-[#E9E6DD]' : 'text-[#C4AD9D]'}`}>{label}</span>
//   </label>
// );

// export default VehicleDetailsModal;