import React, { useState } from 'react';
import { useGetVehicleByIdQuery } from '../features/api/VehicleAPI';
import { useCreateBookingMutation } from '../features/api/BookingApi';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface VehicleDetailsModalProps {
  vehicleId: number;
  onClose: () => void;
}

const VehicleDetailsModal: React.FC<VehicleDetailsModalProps> = ({ vehicleId, onClose }) => {
  const [selectedTab, setSelectedTab] = useState<'details' | 'booking'>('details');
  const navigate = useNavigate();

  // --- STATE ---
  const [bookingDates, setBookingDates] = useState({
    booking_date: '',
    return_date: '',
  });

  const [services, setServices] = useState({
    insurance: false,
    roadside: false,
    driver: false,
  });

  const [termsAccepted, setTermsAccepted] = useState(false);

  // --- API HOOKS ---
  const { data: vehicle, isLoading, error } = useGetVehicleByIdQuery(vehicleId);
  const [createBooking, { isLoading: isBookingLoading }] = useCreateBookingMutation();

  // --- HELPERS ---
  const parseSafe = (data: any) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    try {
      return JSON.parse(data);
    } catch (e) {
      return [];
    }
  };

  const images = vehicle ? parseSafe(vehicle.images) : [];
  const features = vehicle ? parseSafe(vehicle.features) : [];
  const defaultImage = 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=80';

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

    let dailyTotal = Number(vehicle.rental_rate);
    if (services.insurance) dailyTotal += 25;
    if (services.roadside) dailyTotal += 15;
    if (services.driver) dailyTotal += 10;
    return dailyTotal * days;
  };

  const days = calculateDays();
  const totalAmount = calculateTotal();

  // --- SUBMIT HANDLER (FIXED) ---
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
        total_amount: totalAmount, // Use the calculated const
      };

      console.log("🚀 SENDING BOOKING REQUEST:", payload); 

      // 3. API Call
      await createBooking(payload).unwrap();

      // 4. Success Handling
      toast.success('Booking confirmed! 🎉');
      onClose();
      navigate('/UserDashboard/my-bookings'); 

    } catch (error: any) {
      console.error("Booking Error:", error);
      
      const errorMessage = error?.data?.error || error?.data?.message || 'Failed to create booking';

      if (errorMessage && errorMessage.includes('not available')) {
        toast.error('❌ Vehicle not available for these dates.');
      } else {
        toast.error(errorMessage);
      }
    }
  };

  // --- EARLY RETURNS (LOADING/ERROR) ---
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-[#001524] rounded-2xl p-8 max-w-2xl w-full text-white">Loading...</div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-[#001524] rounded-2xl p-8 max-w-md w-full text-center border border-[#F57251]">
          <p className="text-[#F57251]">Vehicle not found.</p>
          <button onClick={onClose} className="bg-gray-700 text-white px-4 py-2 mt-4 rounded">Close</button>
        </div>
      </div>
    );
  }

  // --- MAIN RENDER ---
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#001524] rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#445048]">
        
        {/* HEADER */}
        <div className="flex justify-between items-center p-6 border-b border-[#445048] sticky top-0 bg-[#001524] z-10">
          <div>
            <h2 className="text-2xl font-bold text-[#E9E6DD]">
              {vehicle.manufacturer} {vehicle.model}
            </h2>
            <p className="text-[#C4AD9D] text-sm">
              {vehicle.year} • {vehicle.color} • {vehicle.vehicle_type}
            </p>
          </div>
          <button onClick={onClose} className="text-[#C4AD9D] hover:text-[#F57251] text-2xl transition-colors">×</button>
        </div>

        {/* TABS */}
        <div className="border-b border-[#445048] px-6 bg-[#001524]">
          <div className="flex space-x-6">
            <button
              onClick={() => setSelectedTab('details')}
              className={`py-4 font-semibold text-sm transition-colors relative ${
                selectedTab === 'details' ? 'text-[#027480]' : 'text-[#C4AD9D] hover:text-[#E9E6DD]'
              }`}
            >
              Vehicle Details
              {selectedTab === 'details' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#027480]"></span>}
            </button>
            <button
              onClick={() => setSelectedTab('booking')}
              className={`py-4 font-semibold text-sm transition-colors relative ${
                selectedTab === 'booking' ? 'text-[#027480]' : 'text-[#C4AD9D] hover:text-[#E9E6DD]'
              }`}
            >
              Book This Vehicle
              {selectedTab === 'booking' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#027480]"></span>}
            </button>
          </div>
        </div>

        <div className="p-6">
          {selectedTab === 'details' ? (
            /* === DETAILS TAB === */
            <div className="space-y-8">
              {/* Images & Key Info */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="aspect-video w-full rounded-xl overflow-hidden bg-[#445048]">
                    <img src={images[0] || defaultImage} alt="Main" className="w-full h-full object-cover" />
                  </div>
                  {images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {images.slice(0, 4).map((img: string, i: number) => (
                        <img key={i} src={img} alt="thumb" className="h-16 w-full object-cover rounded-md cursor-pointer border border-[#445048]" />
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-[#445048]/20 rounded-xl p-6 border border-[#445048]">
                  <div className="grid grid-cols-2 gap-6">
                    <InfoBox label="License Plate" value={vehicle.license_plate} />
                    <InfoBox label="Status" value={vehicle.status} highlight={vehicle.status === 'Available'} />
                    <InfoBox label="Mileage" value={`${(vehicle.current_mileage || 0).toLocaleString()} km`} />
                    <InfoBox label="Daily Rate" value={`$${vehicle.rental_rate}`} large />
                  </div>
                  
                  {/* Additional Pricing Info */}
                  <div className="mt-6 pt-4 border-t border-[#445048] space-y-2">
                    {vehicle.weekly_rate && (
                      <div className="flex justify-between text-sm">
                        <span className="text-[#C4AD9D]">Weekly Rate</span>
                        <span className="text-[#E9E6DD] font-medium">${vehicle.weekly_rate}</span>
                      </div>
                    )}
                    {vehicle.monthly_rate && (
                      <div className="flex justify-between text-sm">
                        <span className="text-[#C4AD9D]">Monthly Rate</span>
                        <span className="text-[#E9E6DD] font-medium">${vehicle.monthly_rate}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Specs & Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-[#E9E6DD] font-bold mb-4">Specifications</h3>
                  <div className="bg-[#445048]/20 rounded-xl p-4 space-y-3 border border-[#445048]">
                    <SpecRow label="Fuel Type" value={vehicle.fuel_type} />
                    <SpecRow label="Transmission" value={vehicle.transmission} />
                    <SpecRow label="Capacity" value={`${vehicle.seating_capacity} Seats`} />
                    <SpecRow label="Engine" value={vehicle.engine_capacity} />
                    <SpecRow label="Fuel Efficiency" value={vehicle.fuel_efficiency} />
                    <SpecRow label="Insurance Group" value={vehicle.insurance_group} />
                  </div>
                </div>
                <div>
                  <h3 className="text-[#E9E6DD] font-bold mb-4">Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {features.length > 0 ? features.map((feat: string, i: number) => (
                      <span key={i} className="bg-[#445048] text-[#C4AD9D] px-3 py-1 rounded-lg text-sm border border-[#56635b]">
                        {feat}
                      </span>
                    )) : <span className="text-[#C4AD9D]">No features listed</span>}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* === BOOKING TAB === */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Left Column: Summary & Breakdown */}
              <div className="space-y-6">
                <div className="bg-[#445048]/30 rounded-xl p-6 border border-[#445048]">
                  <h3 className="text-lg font-bold text-[#E9E6DD] mb-4">Booking Summary</h3>
                  <div className="flex items-center space-x-4 mb-6">
                    <img src={images[0] || defaultImage} className="w-20 h-20 object-cover rounded-lg" alt="Thumbnail" />
                    <div>
                      <h4 className="text-[#E9E6DD] font-semibold">{vehicle.manufacturer} {vehicle.model}</h4>
                      <p className="text-[#027480] font-bold">${vehicle.rental_rate} <span className="text-xs text-[#C4AD9D] font-normal">/ day</span></p>
                    </div>
                  </div>

                  {days > 0 && (
                    <div className="space-y-3 border-t border-[#445048] pt-4">
                      <div className="flex justify-between text-sm text-[#C4AD9D]">
                        <span>Vehicle Rental ({days} days)</span>
                        <span>${Number(vehicle.rental_rate) * days}</span>
                      </div>
                      
                      {services.insurance && (
                        <div className="flex justify-between text-sm text-[#C4AD9D]">
                          <span>Full Insurance ($25/day)</span>
                          <span>${25 * days}</span>
                        </div>
                      )}
                      {services.roadside && (
                        <div className="flex justify-between text-sm text-[#C4AD9D]">
                          <span>Roadside Assist ($15/day)</span>
                          <span>${15 * days}</span>
                        </div>
                      )}
                      {services.driver && (
                        <div className="flex justify-between text-sm text-[#C4AD9D]">
                          <span>Extra Driver ($10/day)</span>
                          <span>${10 * days}</span>
                        </div>
                      )}

                      <div className="flex justify-between font-bold text-lg text-[#E9E6DD] border-t border-[#445048] pt-3 mt-2">
                        <span>Total Amount</span>
                        <span className="text-[#F57251]">${totalAmount}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Form */}
              <div>
                <h3 className="text-lg font-bold text-[#E9E6DD] mb-4">Select Rental Period</h3>
                <form onSubmit={handleBookingSubmit} className="space-y-6">
                  
                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#C4AD9D] mb-2">Start Date</label>
                      <input
                        type="date"
                        value={bookingDates.booking_date}
                        onChange={(e) => setBookingDates(p => ({ ...p, booking_date: e.target.value }))}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 bg-[#445048] border-2 border-transparent rounded-xl text-[#E9E6DD] focus:border-[#027480] focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#C4AD9D] mb-2">End Date</label>
                      <input
                        type="date"
                        value={bookingDates.return_date}
                        onChange={(e) => setBookingDates(p => ({ ...p, return_date: e.target.value }))}
                        min={bookingDates.booking_date}
                        className="w-full px-4 py-3 bg-[#445048] border-2 border-transparent rounded-xl text-[#E9E6DD] focus:border-[#027480] focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  {/* Services */}
                  <div className="bg-[#445048]/20 p-4 rounded-xl border border-[#445048]">
                    <h4 className="text-sm font-semibold text-[#E9E6DD] mb-3">Additional Services</h4>
                    <div className="space-y-3">
                      <Checkbox 
                        label="Full Insurance Coverage (+$25/day)" 
                        checked={services.insurance} 
                        onChange={(c) => setServices(p => ({...p, insurance: c}))} 
                      />
                      <Checkbox 
                        label="24/7 Roadside Assistance (+$15/day)" 
                        checked={services.roadside} 
                        onChange={(c) => setServices(p => ({...p, roadside: c}))} 
                      />
                      <Checkbox 
                        label="Additional Driver (+$10/day)" 
                        checked={services.driver} 
                        onChange={(c) => setServices(p => ({...p, driver: c}))} 
                      />
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="flex items-start space-x-3 p-3 bg-[#445048]/10 rounded-lg">
                    <input
                      id="terms"
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="w-5 h-5 mt-0.5 accent-[#027480] cursor-pointer"
                    />
                    <label htmlFor="terms" className="text-sm text-[#C4AD9D] cursor-pointer select-none">
                      I agree to the <span className="text-[#027480] hover:underline">Rental Terms & Conditions</span> and understand the cancellation policy.
                    </label>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-4 pt-2">
                    <button 
                      type="button"
                      onClick={() => setSelectedTab('details')}
                      className="flex-1 bg-[#445048] text-[#E9E6DD] px-6 py-3 rounded-xl hover:bg-[#556059] transition-colors font-semibold"
                    >
                      Back
                    </button>
                    <button 
                      type="submit"
                      disabled={isBookingLoading || vehicle.status !== 'Available' || !termsAccepted}
                      className="flex-1 bg-[#F57251] text-[#E9E6DD] px-6 py-3 rounded-xl hover:bg-[#e56546] transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#F57251]/20"
                    >
                      {isBookingLoading ? 'Processing...' : `Book Now • $${totalAmount}`}
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

// --- SUB-COMPONENTS for Cleanliness ---

const InfoBox = ({ label, value, highlight, large }: any) => (
  <div>
    <span className="text-[#C4AD9D] text-xs uppercase tracking-wider block mb-1">{label}</span>
    <span className={`${large ? 'text-2xl' : 'text-base'} font-bold ${highlight ? 'text-[#027480]' : 'text-[#E9E6DD]'}`}>
      {value || '-'}
    </span>
  </div>
);

const SpecRow = ({ label, value }: any) => (
  <div className="flex justify-between items-center border-b border-[#445048] pb-2 last:border-0 last:pb-0">
    <span className="text-[#C4AD9D] text-sm">{label}</span>
    <span className="text-[#E9E6DD] font-medium text-sm text-right">{value || '-'}</span>
  </div>
);

const Checkbox = ({ label, checked, onChange }: { label: string, checked: boolean, onChange: (c: boolean) => void }) => (
  <label className="flex items-center space-x-3 cursor-pointer group">
    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${checked ? 'bg-[#027480] border-[#027480]' : 'border-[#C4AD9D] group-hover:border-[#E9E6DD]'}`}>
      {checked && <span className="text-white text-xs">✓</span>}
    </div>
    <input type="checkbox" className="hidden" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    <span className={`text-sm transition-colors ${checked ? 'text-[#E9E6DD]' : 'text-[#C4AD9D]'}`}>{label}</span>
  </label>
);

export default VehicleDetailsModal;