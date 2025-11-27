import React, { useState } from 'react';
import { useGetVehicleByIdQuery } from '../features/api/VehicleAPI';
import { useCreateBookingMutation } from '../features/api/BookingApi';
import { toast } from 'sonner';

interface VehicleDetailsModalProps {
  vehicleId: number;
  onClose: () => void;
}

const VehicleDetailsModal: React.FC<VehicleDetailsModalProps> = ({ vehicleId, onClose }) => {
  const [selectedTab, setSelectedTab] = useState<'details' | 'booking'>('details');
  const [bookingDates, setBookingDates] = useState({
    start_date: '',
    end_date: '',
  });

  const { data: vehicle, isLoading, error } = useGetVehicleByIdQuery(vehicleId);
  const [createBooking, { isLoading: isBookingLoading }] = useCreateBookingMutation();

  const calculateTotal = () => {
    if (!bookingDates.start_date || !bookingDates.end_date || !vehicle) return 0;
    
    const start = new Date(bookingDates.start_date);
    const end = new Date(bookingDates.end_date);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    return days * vehicle.rental_rate;
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bookingDates.start_date || !bookingDates.end_date) {
      toast.error('Please select both start and end dates');
      return;
    }

    if (new Date(bookingDates.start_date) >= new Date(bookingDates.end_date)) {
      toast.error('End date must be after start date');
      return;
    }

    try {
      const bookingData = {
        vehicle_id: vehicleId,
        start_date: bookingDates.start_date,
        end_date: bookingDates.end_date,
        total_amount: calculateTotal(),
      };

      await createBooking(bookingData).unwrap();
      toast.success('Booking confirmed! 🎉');
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to create booking');
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-[#001524] rounded-2xl p-8 max-w-2xl w-full">
          <div className="animate-pulse">
            <div className="h-8 bg-[#445048] rounded w-3/4 mb-4"></div>
            <div className="h-64 bg-[#445048] rounded mb-4"></div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-4 bg-[#445048] rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-[#001524] rounded-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🚗</div>
          <h3 className="text-2xl font-bold text-[#E9E6DD] mb-2">Vehicle Not Found</h3>
          <p className="text-[#C4AD9D] mb-6">The requested vehicle could not be loaded.</p>
          <button 
            onClick={onClose}
            className="bg-[#F57251] text-[#E9E6DD] px-6 py-3 rounded-lg hover:bg-[#e56546] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const images = vehicle.images ? JSON.parse(vehicle.images) : [];
  const features = vehicle.features ? JSON.parse(vehicle.features) : [];
  const totalAmount = calculateTotal();
  const days = totalAmount / vehicle.rental_rate;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#001524] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-[#445048]">
          <div>
            <h2 className="text-2xl font-bold text-[#E9E6DD]">
              {vehicle.manufacturer} {vehicle.model}
            </h2>
            <p className="text-[#C4AD9D]">{vehicle.year} • {vehicle.color} • {vehicle.vehicle_type}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-[#C4AD9D] hover:text-[#F57251] text-2xl transition-colors"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-[#445048]">
          <div className="flex space-x-1 px-6">
            <button
              onClick={() => setSelectedTab('details')}
              className={`px-4 py-3 font-semibold transition-colors ${
                selectedTab === 'details'
                  ? 'text-[#027480] border-b-2 border-[#027480]'
                  : 'text-[#C4AD9D] hover:text-[#E9E6DD]'
              }`}
            >
              Vehicle Details
            </button>
            <button
              onClick={() => setSelectedTab('booking')}
              className={`px-4 py-3 font-semibold transition-colors ${
                selectedTab === 'booking'
                  ? 'text-[#027480] border-b-2 border-[#027480]'
                  : 'text-[#C4AD9D] hover:text-[#E9E6DD]'
              }`}
            >
              Book This Vehicle
            </button>
          </div>
        </div>

        <div className="p-6">
          {selectedTab === 'details' ? (
            /* Vehicle Details Tab */
            <div className="space-y-6">
              {/* Image Gallery */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <img 
                    src={images[0] || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'} 
                    alt={`${vehicle.manufacturer} ${vehicle.model}`}
                    className="w-full h-64 object-cover rounded-xl"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    {images.slice(1, 4).map((img: string, index: number) => (
                      <img 
                        key={index}
                        src={img} 
                        alt={`${vehicle.manufacturer} ${vehicle.model} ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>

                {/* Quick Info */}
                <div className="bg-[#445048] rounded-xl p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-[#C4AD9D] text-sm">Status</p>
                      <p className={`font-semibold ${
                        vehicle.status === 'Available' ? 'text-[#027480]' : 
                        vehicle.status === 'Rented' ? 'text-[#F57251]' : 
                        'text-[#C4AD9D]'
                      }`}>
                        {vehicle.status}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#C4AD9D] text-sm">VIN</p>
                      <p className="text-[#E9E6DD] font-mono text-sm">{vehicle.vin_number}</p>
                    </div>
                    <div>
                      <p className="text-[#C4AD9D] text-sm">License Plate</p>
                      <p className="text-[#E9E6DD] font-semibold">{vehicle.license_plate}</p>
                    </div>
                    <div>
                      <p className="text-[#C4AD9D] text-sm">Mileage</p>
                      <p className="text-[#E9E6DD]">{vehicle.current_mileage.toLocaleString()} km</p>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="border-t border-[#001524] pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[#C4AD9D]">Daily Rate</span>
                      <span className="text-2xl font-bold text-[#E9E6DD]">${vehicle.rental_rate}</span>
                    </div>
                    {vehicle.on_promo && vehicle.daily_rate && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-[#C4AD9D]">Original Price</span>
                        <span className="text-[#C4AD9D] line-through">${vehicle.daily_rate}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-sm mt-1">
                      <span className="text-[#C4AD9D]">Weekly</span>
                      <span className="text-[#E9E6DD]">${vehicle.weekly_rate}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#C4AD9D]">Monthly</span>
                      <span className="text-[#E9E6DD]">${vehicle.monthly_rate}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Specifications */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-bold text-[#E9E6DD] mb-4">Specifications</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[#C4AD9D] text-sm">Fuel Type</p>
                      <p className="text-[#E9E6DD] font-semibold">{vehicle.fuel_type}</p>
                    </div>
                    <div>
                      <p className="text-[#C4AD9D] text-sm">Transmission</p>
                      <p className="text-[#E9E6DD] font-semibold">{vehicle.transmission}</p>
                    </div>
                    <div>
                      <p className="text-[#C4AD9D] text-sm">Seating Capacity</p>
                      <p className="text-[#E9E6DD] font-semibold">{vehicle.seating_capacity} people</p>
                    </div>
                    <div>
                      <p className="text-[#C4AD9D] text-sm">Fuel Efficiency</p>
                      <p className="text-[#E9E6DD] font-semibold">{vehicle.fuel_efficiency}</p>
                    </div>
                    <div>
                      <p className="text-[#C4AD9D] text-sm">Insurance Group</p>
                      <p className="text-[#E9E6DD] font-semibold">{vehicle.insurance_group}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-[#E9E6DD] mb-4">Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {features.map((feature: string, index: number) => (
                      <span 
                        key={index}
                        className="bg-[#445048] text-[#E9E6DD] px-3 py-2 rounded-lg text-sm"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Booking Tab */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Vehicle Summary */}
              <div className="bg-[#445048] rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#E9E6DD] mb-4">Booking Summary</h3>
                
                <div className="flex items-center space-x-4 mb-6">
                  <img 
                    src={images[0] || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'} 
                    alt={`${vehicle.manufacturer} ${vehicle.model}`}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div>
                    <h4 className="text-[#E9E6DD] font-semibold">{vehicle.manufacturer} {vehicle.model}</h4>
                    <p className="text-[#C4AD9D] text-sm">{vehicle.year} • {vehicle.color}</p>
                    <p className="text-[#027480] font-semibold">${vehicle.rental_rate}/day</p>
                  </div>
                </div>

                {/* Pricing Breakdown */}
                {totalAmount > 0 && (
                  <div className="space-y-3 border-t border-[#001524] pt-4">
                    <div className="flex justify-between">
                      <span className="text-[#C4AD9D]">${vehicle.rental_rate} × {days} days</span>
                      <span className="text-[#E9E6DD]">${totalAmount}</span>
                    </div>
                    <div className="flex justify-between font-semibold border-t border-[#001524] pt-2">
                      <span className="text-[#E9E6DD]">Total Amount</span>
                      <span className="text-[#F57251] text-lg">${totalAmount}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Booking Form */}
              <div>
                <h3 className="text-lg font-bold text-[#E9E6DD] mb-4">Select Rental Period</h3>
                
                <form onSubmit={handleBookingSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="start_date" className="block text-sm font-medium text-[#E9E6DD] mb-2">
                        Start Date *
                      </label>
                      <input
                        id="start_date"
                        type="date"
                        value={bookingDates.start_date}
                        onChange={(e) => setBookingDates(prev => ({ ...prev, start_date: e.target.value }))}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 bg-[#445048] border-2 border-transparent rounded-xl text-[#E9E6DD] focus:outline-none focus:ring-2 focus:ring-[#027480] transition-all duration-200"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="end_date" className="block text-sm font-medium text-[#E9E6DD] mb-2">
                        End Date *
                      </label>
                      <input
                        id="end_date"
                        type="date"
                        value={bookingDates.end_date}
                        onChange={(e) => setBookingDates(prev => ({ ...prev, end_date: e.target.value }))}
                        min={bookingDates.start_date || new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 bg-[#445048] border-2 border-transparent rounded-xl text-[#E9E6DD] focus:outline-none focus:ring-2 focus:ring-[#027480] transition-all duration-200"
                        required
                      />
                    </div>
                  </div>

                  {/* Additional Services */}
                  <div>
                    <h4 className="text-md font-semibold text-[#E9E6DD] mb-3">Additional Services</h4>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-[#027480] bg-[#445048] border-[#445048] rounded focus:ring-[#027480] focus:ring-2"
                        />
                        <span className="text-[#E9E6DD]">Full Insurance Coverage (+$25/day)</span>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-[#027480] bg-[#445048] border-[#445048] rounded focus:ring-[#027480] focus:ring-2"
                        />
                        <span className="text-[#E9E6DD]">24/7 Roadside Assistance (+$15/day)</span>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-[#027480] bg-[#445048] border-[#445048] rounded focus:ring-[#027480] focus:ring-2"
                        />
                        <span className="text-[#E9E6DD]">Additional Driver (+$10/day)</span>
                      </label>
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="flex items-start space-x-3">
                    <input
                      id="terms"
                      type="checkbox"
                      required
                      className="w-4 h-4 text-[#027480] bg-[#445048] border-[#445048] rounded focus:ring-[#027480] focus:ring-2 mt-1"
                    />
                    <label htmlFor="terms" className="text-sm text-[#C4AD9D]">
                      I agree to the{' '}
                      <a href="#" className="text-[#027480] hover:text-[#F57251] transition-colors duration-200">
                        rental terms and conditions
                      </a>{' '}
                      and understand the cancellation policy.
                    </label>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4 pt-4">
                    <button 
                      type="button"
                      onClick={() => setSelectedTab('details')}
                      className="flex-1 bg-[#445048] text-[#E9E6DD] px-6 py-3 rounded-lg hover:bg-[#39423b] transition-colors font-semibold"
                    >
                      Back to Details
                    </button>
                    <button 
                      type="submit"
                      disabled={isBookingLoading || vehicle.status !== 'Available'}
                      className="flex-1 bg-[#F57251] text-[#E9E6DD] px-6 py-3 rounded-lg hover:bg-[#e56546] transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isBookingLoading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-4 h-4 border-2 border-[#E9E6DD] border-t-transparent rounded-full animate-spin"></div>
                          <span>Processing...</span>
                        </div>
                      ) : (
                        `Book Now - $${totalAmount || 0}`
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

export default VehicleDetailsModal;