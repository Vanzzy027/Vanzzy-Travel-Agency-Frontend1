

import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Car, AlertCircle, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { 
  useGetVehiclesQuery, 
  useCreateVehicleSpecMutation, 
  useAddVehicleMutation, 
  useDeleteVehicleMutation 
} from '../../features/api/VehicleAPI';
import { toast } from 'sonner';

const FleetManagement: React.FC = () => {
  // Queries
  const { data: vehicles, isLoading, error } = useGetVehiclesQuery({}); 
  
  // Mutations
  const [createSpec, { isLoading: isCreatingSpec }] = useCreateVehicleSpecMutation();
  const [createVehicle, { isLoading: isCreatingVehicle }] = useAddVehicleMutation();
  const [deleteVehicle] = useDeleteVehicleMutation();

  // UI State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1); 
  const [searchTerm, setSearchTerm] = useState('');

  // DATA State
  // We need to store the created Spec ID and Details to show them in Step 2
  const [createdSpecData, setCreatedSpecData] = useState<{id: number, name: string} | null>(null);

  const initialFormState = {
    // SPECS
    manufacturer: '', model: '', year: new Date().getFullYear(),
    fuel_type: 'Petrol', engine_capacity: '1.5L', transmission: 'Automatic',
    seating_capacity: 5, color: 'White', features: '', vehicle_type: 'Sedan', image_url: '',
    
    // INVENTORY
    vin_number: '', license_plate: '', current_mileage: 0, rental_rate: 0, status: 'Available'
  };

  const [formData, setFormData] = useState(initialFormState);



// --- LOGIC: STEP 1 (Create Spec) ---
  const handleCreateSpecStep = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form reload

    // 1. Basic Validation
    if (!formData.manufacturer || !formData.model) {
      toast.error("Please fill in Manufacturer and Model");
      return;
    }

    try {
      // 2. Prepare Spec Payload
      const specPayload = {
        manufacturer: formData.manufacturer,
        model: formData.model,
        year: formData.year,
        fuel_type: formData.fuel_type,
        engine_capacity: formData.engine_capacity,
        transmission: formData.transmission,
        seating_capacity: formData.seating_capacity,
        color: formData.color,
        vehicle_type: formData.vehicle_type,
        features: JSON.stringify(formData.features.split(',').map(s => s.trim())), 
        images: JSON.stringify([formData.image_url]), 
        on_promo: false,
        review_count: 0
      };

      console.log("Submitting Spec...", specPayload);
      
      // 3. CALL API
      const response = await createSpec(specPayload).unwrap();
      
      console.log("Backend Response:", response);

      // 4. EXTRACT ID (Based on your log: { message: "...", data: { vehicleSpec_id: 1011 } })
      // We explicitly check for the 'data' property because your backend wraps the result
      const createdSpec = (response as any).data || response;
      const newSpecId = createdSpec.vehicleSpec_id;

      if (newSpecId) {
        console.log("✅ Spec Created with ID:", newSpecId);
        
        // 5. Update State for Step 2
        setCreatedSpecData({
          id: newSpecId,
          name: `${createdSpec.manufacturer} ${createdSpec.model} (${createdSpec.year})`
        });
        
        // 6. Move to Inventory Step
        toast.success("Specification Created! Proceeding to Inventory.");
        setStep(2); 
      } else {
        console.error("❌ ID Missing in response data:", createdSpec);
        toast.error("Spec created, but ID was missing. Check console.");
      }

    } catch (err: any) {
      console.error("Spec Creation Error:", err);
      toast.error(err.data?.message || "Failed to create specification");
    }
  };
  // // --- LOGIC: STEP 1 (Create Spec) ---
  // const handleCreateSpecStep = async (e: React.FormEvent) => {
  //   e.preventDefault(); // Prevent form reload

  //   // Basic Validation
  //   if (!formData.manufacturer || !formData.model) {
  //     toast.error("Please fill in Manufacturer and Model");
  //     return;
  //   }

  //   try {
  //     // 1. Prepare Spec Payload
  //     const specPayload = {
  //       manufacturer: formData.manufacturer,
  //       model: formData.model,
  //       year: formData.year,
  //       fuel_type: formData.fuel_type,
  //       engine_capacity: formData.engine_capacity,
  //       transmission: formData.transmission,
  //       seating_capacity: formData.seating_capacity,
  //       color: formData.color,
  //       vehicle_type: formData.vehicle_type,
  //       features: JSON.stringify(formData.features.split(',').map(s => s.trim())), 
  //       images: JSON.stringify([formData.image_url]), 
  //       on_promo: false,
  //       review_count: 0
  //     };

  //     console.log("Creating vehicle spec...", specPayload);
      
  //     // 2. CALL API (Create Spec)
  //     const result = await createSpec(specPayload).unwrap();

  //           // DEBUG: Look at this log in your browser console to see exactly what the server sent back
  //     console.log("Backend Response (Result):", result);

  //     // We check response.data.vehicleSpec_id first, then fallback to response.vehicleSpec_id
  //     const createdSpec = (response as any).data || response;
  //     const newSpecId = createdSpec.vehicleSpec_id;
      
      
  //     // 3. Handle Success
  //     if (result && result.vehicleSpec_id) {
  //       // Save the ID and Name for Step 2
  //       setCreatedSpecData({
  //         id: result.vehicleSpec_id,
  //         name: `${result.manufacturer} ${result.model} (${result.year})`
  //       });
        
  //       toast.success("Specification Created! Proceeding to Inventory details.");
  //       setStep(2); // MOVE TO NEXT STEP
  //     }

  //   } catch (err: any) {
  //     console.error("Spec Creation Failed", err);
  //     toast.error(err.data?.message || "Failed to create vehicle specifications");
  //   }
  // };

  // --- LOGIC: STEP 2 (Create Inventory) ---
  const handleCreateInventoryStep = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!createdSpecData?.id) {
      toast.error("Error: Specification ID not found. Please go back.");
      return;
    }

    try {
      // 1. Prepare Vehicle Payload
      const vehiclePayload = {
        vehicleSpec_id: createdSpecData.id, // LINKING TO THE ID FROM STEP 1
        vin_number: formData.vin_number,
        license_plate: formData.license_plate,
        current_mileage: formData.current_mileage,
        rental_rate: formData.rental_rate,
        status: formData.status as any
      };

      console.log("Creating Vehicle...", vehiclePayload);

      // 2. CALL API (Create Vehicle)
      await createVehicle(vehiclePayload).unwrap();

      // 3. Success
      toast.success("Vehicle Inventory Added Successfully!");
      setIsModalOpen(false);
      resetForm();

    } catch (err: any) {
      console.error("Inventory Creation Failed", err);
      toast.error(err.data?.message || "Failed to add vehicle inventory");
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setCreatedSpecData(null);
    setStep(1);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure? This will delete the vehicle inventory.")) {
      try {
        await deleteVehicle(id).unwrap();
        toast.success("Vehicle deleted");
      } catch (err) {
        toast.error("Failed to delete vehicle");
      }
    }
  };

  // Filter Logic
  const filteredVehicles = vehicles?.filter(v => 
    v.model?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.license_plate?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) return <div className="p-8 text-[#E9E6DD] animate-pulse">Loading Fleet Data...</div>;

  return (
    <div className="space-y-6">
      
      {/* HEADER & ACTIONS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#001524]">Fleet Management</h1>
          <p className="text-[#445048]">Manage specifications and fleet inventory.</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search plate or model..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#027480] outline-none"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#027480] text-[#E9E6DD] px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#025e69] transition-colors shadow-lg"
          >
            <Plus size={20} /> Add Vehicle
          </button>
        </div>
      </div>

      {/* ERROR STATE */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center gap-2">
          <AlertCircle size={20} />
          <span>Error loading vehicles. Please check connection.</span>
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-lg border border-[#445048]/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#001524] text-[#E9E6DD]">
              <tr>
                <th className="p-4 font-semibold">Vehicle Details</th>
                <th className="p-4 font-semibold">Specs</th>
                <th className="p-4 font-semibold">Inventory Info</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredVehicles?.map((v) => (
                <tr key={v.vehicle_id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-2xl">
                        {v.images && v.images !== '[]' ? '🚙' : <Car size={24} className="text-gray-500"/>}
                      </div>
                      <div>
                        <div className="font-bold text-[#001524]">{v.manufacturer} {v.model}</div>
                        <div className="text-xs text-gray-500">{v.year} • {v.color}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    <div>{v.transmission} • {v.fuel_type}</div>
                    <div className="text-xs">{v.seating_capacity} Seats</div>
                  </td>
                  <td className="p-4">
                    <div className="font-mono text-sm bg-gray-100 inline-block px-2 py-1 rounded">{v.license_plate}</div>
                    <div className="text-xs text-gray-500 mt-1">VIN: {v.vin_number}</div>
                    <div className="text-sm font-bold text-[#027480]">${v.rental_rate}/day</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      v.status === 'Available' ? 'bg-[#027480]/10 text-[#027480]' :
                      v.status === 'Maintenance' ? 'bg-[#F57251]/10 text-[#F57251]' :
                      'bg-gray-200 text-gray-600'
                    }`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Edit">
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(v.vehicle_id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors" 
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredVehicles?.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    No vehicles found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL WIZARD --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-[#001524] p-6 flex justify-between items-center text-[#E9E6DD] shrink-0">
              <div>
                <h2 className="text-2xl font-bold">Add New Vehicle</h2>
                <p className="text-[#C4AD9D] text-sm">Step {step} of 2: {step === 1 ? 'Specifications' : 'Inventory Details'}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-[#C4AD9D] hover:text-white text-2xl">&times;</button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto">
              <form className="space-y-6">
                
                {/* STEP 1: SPECIFICATIONS */}
                {step === 1 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-right-8">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">Manufacturer</label>
                      <input required className="w-full border p-2 rounded focus:ring-2 focus:ring-[#027480] outline-none" 
                        value={formData.manufacturer} onChange={e => setFormData({...formData, manufacturer: e.target.value})} placeholder="e.g. Toyota" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">Model</label>
                      <input required className="w-full border p-2 rounded focus:ring-2 focus:ring-[#027480] outline-none" 
                        value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} placeholder="e.g. Camry" />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">Type</label>
                      <select className="w-full border p-2 rounded" value={formData.vehicle_type} onChange={e => setFormData({...formData, vehicle_type: e.target.value})}>
                        <option>Sedan</option><option>SUV</option><option>Truck</option><option>Van</option><option>Coupe</option>
                      </select>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">Year</label>
                      <input type="number" required className="w-full border p-2 rounded" 
                        value={formData.year} onChange={e => setFormData({...formData, year: parseInt(e.target.value)})} />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">Fuel Type</label>
                      <select className="w-full border p-2 rounded" value={formData.fuel_type} onChange={e => setFormData({...formData, fuel_type: e.target.value})}>
                        <option>Petrol</option><option>Diesel</option><option>Electric</option><option>Hybrid</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">Transmission</label>
                      <select className="w-full border p-2 rounded" value={formData.transmission} onChange={e => setFormData({...formData, transmission: e.target.value})}>
                        <option>Automatic</option><option>Manual</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">Engine Capacity</label>
                      <input className="w-full border p-2 rounded" 
                        value={formData.engine_capacity} onChange={e => setFormData({...formData, engine_capacity: e.target.value})} placeholder="e.g. 2.0L" />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">Color</label>
                      <input className="w-full border p-2 rounded" 
                        value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} />
                    </div>

                    <div className="md:col-span-2 space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">Features (Comma separated)</label>
                      <input className="w-full border p-2 rounded" 
                        value={formData.features} onChange={e => setFormData({...formData, features: e.target.value})} placeholder="GPS, Bluetooth, Sunroof" />
                    </div>
                    
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">Image URL</label>
                      <input className="w-full border p-2 rounded" 
                        value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} placeholder="https://..." />
                    </div>
                  </div>
                )}

                {/* STEP 2: INVENTORY */}
                {step === 2 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-right-8">
                    
                    {/* DISPLAY THE CREATED SPEC DATA FROM DB */}
                    <div className="md:col-span-2 bg-[#027480]/10 border border-[#027480]/30 p-4 rounded-lg mb-2">
                      <div className="flex items-center gap-2 text-[#027480] mb-1">
                        <CheckCircle2 size={18} />
                        <span className="font-bold text-xs uppercase tracking-wide">Specification Created</span>
                      </div>
                      <p className="font-bold text-xl text-[#001524]">
                        {createdSpecData ? createdSpecData.name : "Loading..."}
                      </p>
                      <p className="text-xs text-gray-500">Spec ID: {createdSpecData?.id}</p>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">VIN Number</label>
                      <input required className="w-full border p-2 rounded focus:ring-2 focus:ring-[#F57251] outline-none" 
                        value={formData.vin_number} onChange={e => setFormData({...formData, vin_number: e.target.value})} />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">License Plate</label>
                      <input required className="w-full border p-2 rounded focus:ring-2 focus:ring-[#F57251] outline-none" 
                        value={formData.license_plate} onChange={e => setFormData({...formData, license_plate: e.target.value})} />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">Current Mileage</label>
                      <input type="number" required className="w-full border p-2 rounded" 
                        value={formData.current_mileage} onChange={e => setFormData({...formData, current_mileage: parseInt(e.target.value)})} />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">Daily Rate ($)</label>
                      <input type="number" required className="w-full border p-2 rounded font-bold text-[#027480]" 
                        value={formData.rental_rate} onChange={e => setFormData({...formData, rental_rate: parseInt(e.target.value)})} />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">Status</label>
                      <select className="w-full border p-2 rounded" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                        <option>Available</option>
                        <option>Maintenance</option>
                        <option>Rented</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Footer Buttons */}
                <div className="pt-4 flex justify-between border-t border-gray-100 mt-6">
                  {step === 2 ? (
                    // We don't allow going back to edit specs because the spec is ALREADY created in DB. 
                    // To edit, they would need to cancel and use the Edit feature later.
                    <button type="button" onClick={resetForm} className="text-red-500 hover:text-red-700 font-medium">
                      Cancel
                    </button>
                  ) : (
                    <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-black">
                      Cancel
                    </button>
                  )}

                  {step === 1 ? (
                    <button 
                      type="button" 
                      onClick={handleCreateSpecStep} 
                      disabled={isCreatingSpec}
                      className="bg-[#027480] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#025e69] transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      {isCreatingSpec ? 'Saving Spec...' : <>Next Step <ArrowRight size={16}/></>}
                    </button>
                  ) : (
                    <button 
                      type="button" // Use type="button" and call onClick to prevent double submission
                      onClick={handleCreateInventoryStep}
                      disabled={isCreatingVehicle}
                      className="bg-[#F57251] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#d65f41] transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      {isCreatingVehicle ? 'Adding Vehicle...' : 'Finish & Save'}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FleetManagement;








// import React, { useState } from 'react';
// import { Plus, Edit, Trash2, Search, Car, AlertCircle } from 'lucide-react';
// import { 
//   useGetVehiclesQuery, 
//   useCreateVehicleSpecMutation, 
//   useAddVehicleMutation, 
//   useDeleteVehicleMutation 
// } from '../../features/api/VehicleAPI';
// import { toast } from 'sonner'; // Assuming you use sonner or react-hot-toast

// const FleetManagement: React.FC = () => {
//   // Queries & Mutations
//   const { data: vehicles, isLoading, error } = useGetVehiclesQuery({}); 
//   const [createSpec, { isLoading: isCreatingSpec }] = useCreateVehicleSpecMutation();
//   const [createVehicle, { isLoading: isCreatingVehicle }] = useAddVehicleMutation();
//   const [deleteVehicle] = useDeleteVehicleMutation();

//   // Modal & Wizard State
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [step, setStep] = useState(1); 
  
//   // Search State
//   const [searchTerm, setSearchTerm] = useState('');

//   // Form State
//   const initialFormState = {
//     // STEP 1: SPECS
//     manufacturer: '',
//     model: '',
//     year: new Date().getFullYear(),
//     fuel_type: 'Petrol',
//     engine_capacity: '1.5L',
//     transmission: 'Automatic',
//     seating_capacity: 5,
//     color: 'White',
//     features: '', // User types comma separated
//     vehicle_type: 'Sedan',
//     image_url: '', // Simple string for now
    
//     // STEP 2: INVENTORY
//     vin_number: '',
//     license_plate: '',
//     current_mileage: 0,
//     rental_rate: 0,
//     status: 'Available'
//   };

//   const [formData, setFormData] = useState(initialFormState);

//   // --- HANDLERS ---

//   const handleNextStep = () => {
//     if (!formData.manufacturer || !formData.model) {
//       toast.error("Please fill in Manufacturer and Model");
//       return;
//     }
//     setStep(2);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     try {
//       // 1. Prepare Spec Payload
//       const specPayload = {
//         manufacturer: formData.manufacturer,
//         model: formData.model,
//         year: formData.year,
//         fuel_type: formData.fuel_type,
//         engine_capacity: formData.engine_capacity,
//         transmission: formData.transmission,
//         seating_capacity: formData.seating_capacity,
//         color: formData.color,
//         vehicle_type: formData.vehicle_type,
//         // Convert comma-separated string to JSON string for DB
//         features: JSON.stringify(formData.features.split(',').map(s => s.trim())), 
//         images: JSON.stringify([formData.image_url]), 
//         on_promo: false,
//         review_count: 0
//       };

//       // 2. Call API to Create Spec
//       const specResult = await createSpec(specPayload).unwrap();
      
//       if (!specResult || !specResult.vehicleSpec_id) {
//         throw new Error("Failed to generate Specification ID");
//       }

//       console.log("Spec Created ID:", specResult.vehicleSpec_id);

//       // 3. Prepare Vehicle Payload using the new ID
//       const vehiclePayload = {
//         vehicleSpec_id: specResult.vehicleSpec_id,
//         vin_number: formData.vin_number,
//         license_plate: formData.license_plate,
//         current_mileage: formData.current_mileage,
//         rental_rate: formData.rental_rate,
//         status: formData.status as any
//       };

//       // 4. Call API to Create Vehicle
//       await createVehicle(vehiclePayload).unwrap();

//       // 5. Success cleanup
//       toast.success("Vehicle added successfully!");
//       setIsModalOpen(false);
//       setFormData(initialFormState);
//       setStep(1);

//     } catch (err: any) {
//       console.error(err);
//       toast.error(err.data?.message || err.message || "Failed to add vehicle");
//     }
//   };

//   const handleDelete = async (id: number) => {
//     if (window.confirm("Are you sure? This will delete the vehicle inventory.")) {
//       try {
//         await deleteVehicle(id).unwrap();
//         toast.success("Vehicle deleted");
//       } catch (err) {
//         toast.error("Failed to delete vehicle");
//       }
//     }
//   };

//   // Filter Logic
//   const filteredVehicles = vehicles?.filter(v => 
//     v.model.toLowerCase().includes(searchTerm.toLowerCase()) || 
//     v.license_plate.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   if (isLoading) return <div className="p-8 text-[#E9E6DD] animate-pulse">Loading Fleet Data...</div>;

//   return (
//     <div className="space-y-6">
      
//       {/* HEADER & ACTIONS */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//         <div>
//           <h1 className="text-3xl font-bold text-[#001524]">Fleet Management</h1>
//           <p className="text-[#445048]">Manage specifications and fleet inventory.</p>
//         </div>
        
//         <div className="flex gap-3 w-full md:w-auto">
//           <div className="relative flex-1 md:w-64">
//             <Search className="absolute left-3 top-3 text-gray-400" size={18} />
//             <input 
//               type="text" 
//               placeholder="Search plate or model..." 
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#027480] outline-none"
//             />
//           </div>
//           <button 
//             onClick={() => setIsModalOpen(true)}
//             className="bg-[#027480] text-[#E9E6DD] px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#025e69] transition-colors shadow-lg"
//           >
//             <Plus size={20} /> Add Vehicle
//           </button>
//         </div>
//       </div>

//       {/* ERROR STATE */}
//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center gap-2">
//           <AlertCircle size={20} />
//           <span>Error loading vehicles. Please check your connection.</span>
//         </div>
//       )}

//       {/* TABLE */}
//       <div className="bg-white rounded-xl shadow-lg border border-[#445048]/20 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left">
//             <thead className="bg-[#001524] text-[#E9E6DD]">
//               <tr>
//                 <th className="p-4 font-semibold">Vehicle Details</th>
//                 <th className="p-4 font-semibold">Specs</th>
//                 <th className="p-4 font-semibold">Inventory Info</th>
//                 <th className="p-4 font-semibold">Status</th>
//                 <th className="p-4 font-semibold text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100">
//               {filteredVehicles?.map((v) => (
//                 <tr key={v.vehicle_id} className="hover:bg-gray-50 transition-colors">
//                   <td className="p-4">
//                     <div className="flex items-center gap-3">
//                       <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-2xl">
//                         {/* Try to parse image, fallback to icon */}
//                         {v.images && v.images !== '[]' ? '🚙' : <Car size={24} className="text-gray-500"/>}
//                       </div>
//                       <div>
//                         <div className="font-bold text-[#001524]">{v.manufacturer} {v.model}</div>
//                         <div className="text-xs text-gray-500">{v.year} • {v.color}</div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="p-4 text-sm text-gray-600">
//                     <div>{v.transmission} • {v.fuel_type}</div>
//                     <div className="text-xs">{v.seating_capacity} Seats</div>
//                   </td>
//                   <td className="p-4">
//                     <div className="font-mono text-sm bg-gray-100 inline-block px-2 py-1 rounded">{v.license_plate}</div>
//                     <div className="text-xs text-gray-500 mt-1">VIN: {v.vin_number}</div>
//                     <div className="text-sm font-bold text-[#027480]">${v.rental_rate}/day</div>
//                   </td>
//                   <td className="p-4">
//                     <span className={`px-3 py-1 rounded-full text-xs font-bold ${
//                       v.status === 'Available' ? 'bg-[#027480]/10 text-[#027480]' :
//                       v.status === 'Maintenance' ? 'bg-[#F57251]/10 text-[#F57251]' :
//                       'bg-gray-200 text-gray-600'
//                     }`}>
//                       {v.status}
//                     </span>
//                   </td>
//                   <td className="p-4 text-right">
//                     <div className="flex justify-end gap-2">
//                       <button className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Edit">
//                         <Edit size={18} />
//                       </button>
//                       <button 
//                         onClick={() => handleDelete(v.vehicle_id)}
//                         className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors" 
//                         title="Delete"
//                       >
//                         <Trash2 size={18} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//               {filteredVehicles?.length === 0 && (
//                 <tr>
//                   <td colSpan={5} className="p-8 text-center text-gray-500">
//                     No vehicles found matching your search.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* --- MODAL WIZARD --- */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
//             {/* Modal Header */}
//             <div className="bg-[#001524] p-6 flex justify-between items-center text-[#E9E6DD] shrink-0">
//               <div>
//                 <h2 className="text-2xl font-bold">Add New Vehicle</h2>
//                 <p className="text-[#C4AD9D] text-sm">Step {step} of 2: {step === 1 ? 'Specifications' : 'Inventory Details'}</p>
//               </div>
//               <button onClick={() => setIsModalOpen(false)} className="text-[#C4AD9D] hover:text-white text-2xl">&times;</button>
//             </div>

//             {/* Modal Body (Scrollable) */}
//             <div className="p-6 overflow-y-auto">
//               <form onSubmit={handleSubmit} className="space-y-6">
                
//                 {/* STEP 1: SPECIFICATIONS */}
//                 {step === 1 && (
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-right-8">
//                     <div className="space-y-1">
//                       <label className="text-xs font-bold text-gray-500 uppercase">Manufacturer</label>
//                       <input required className="w-full border p-2 rounded focus:ring-2 focus:ring-[#027480] outline-none" 
//                         value={formData.manufacturer} onChange={e => setFormData({...formData, manufacturer: e.target.value})} placeholder="e.g. Toyota" />
//                     </div>
//                     <div className="space-y-1">
//                       <label className="text-xs font-bold text-gray-500 uppercase">Model</label>
//                       <input required className="w-full border p-2 rounded focus:ring-2 focus:ring-[#027480] outline-none" 
//                         value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} placeholder="e.g. Camry" />
//                     </div>
                    
//                     <div className="space-y-1">
//                       <label className="text-xs font-bold text-gray-500 uppercase">Type</label>
//                       <select className="w-full border p-2 rounded" value={formData.vehicle_type} onChange={e => setFormData({...formData, vehicle_type: e.target.value})}>
//                         <option>Sedan</option><option>SUV</option><option>Truck</option><option>Van</option><option>Coupe</option>
//                       </select>
//                     </div>
                    
//                     <div className="space-y-1">
//                       <label className="text-xs font-bold text-gray-500 uppercase">Year</label>
//                       <input type="number" required className="w-full border p-2 rounded" 
//                         value={formData.year} onChange={e => setFormData({...formData, year: parseInt(e.target.value)})} />
//                     </div>

//                     <div className="space-y-1">
//                       <label className="text-xs font-bold text-gray-500 uppercase">Fuel Type</label>
//                       <select className="w-full border p-2 rounded" value={formData.fuel_type} onChange={e => setFormData({...formData, fuel_type: e.target.value})}>
//                         <option>Petrol</option><option>Diesel</option><option>Electric</option><option>Hybrid</option>
//                       </select>
//                     </div>

//                     <div className="space-y-1">
//                       <label className="text-xs font-bold text-gray-500 uppercase">Transmission</label>
//                       <select className="w-full border p-2 rounded" value={formData.transmission} onChange={e => setFormData({...formData, transmission: e.target.value})}>
//                         <option>Automatic</option><option>Manual</option>
//                       </select>
//                     </div>

//                     <div className="space-y-1">
//                       <label className="text-xs font-bold text-gray-500 uppercase">Engine Capacity</label>
//                       <input className="w-full border p-2 rounded" 
//                         value={formData.engine_capacity} onChange={e => setFormData({...formData, engine_capacity: e.target.value})} placeholder="e.g. 2.0L" />
//                     </div>

//                     <div className="space-y-1">
//                       <label className="text-xs font-bold text-gray-500 uppercase">Color</label>
//                       <input className="w-full border p-2 rounded" 
//                         value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} />
//                     </div>

//                     <div className="md:col-span-2 space-y-1">
//                       <label className="text-xs font-bold text-gray-500 uppercase">Features (Comma separated)</label>
//                       <input className="w-full border p-2 rounded" 
//                         value={formData.features} onChange={e => setFormData({...formData, features: e.target.value})} placeholder="GPS, Bluetooth, Sunroof" />
//                     </div>
                    
//                     <div className="md:col-span-2 space-y-1">
//                       <label className="text-xs font-bold text-gray-500 uppercase">Image URL</label>
//                       <input className="w-full border p-2 rounded" 
//                         value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} placeholder="https://..." />
//                     </div>
//                   </div>
//                 )}

//                 {/* STEP 2: INVENTORY */}
//                 {step === 2 && (
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-right-8">
//                     <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg mb-2 border border-gray-200">
//                       <h4 className="text-sm font-bold text-[#001524]">Adding Inventory for:</h4>
//                       <p className="text-[#027480] text-lg">{formData.manufacturer} {formData.model} ({formData.year})</p>
//                     </div>

//                     <div className="space-y-1">
//                       <label className="text-xs font-bold text-gray-500 uppercase">VIN Number</label>
//                       <input required className="w-full border p-2 rounded focus:ring-2 focus:ring-[#F57251] outline-none" 
//                         value={formData.vin_number} onChange={e => setFormData({...formData, vin_number: e.target.value})} />
//                     </div>

//                     <div className="space-y-1">
//                       <label className="text-xs font-bold text-gray-500 uppercase">License Plate</label>
//                       <input required className="w-full border p-2 rounded focus:ring-2 focus:ring-[#F57251] outline-none" 
//                         value={formData.license_plate} onChange={e => setFormData({...formData, license_plate: e.target.value})} />
//                     </div>

//                     <div className="space-y-1">
//                       <label className="text-xs font-bold text-gray-500 uppercase">Current Mileage</label>
//                       <input type="number" required className="w-full border p-2 rounded" 
//                         value={formData.current_mileage} onChange={e => setFormData({...formData, current_mileage: parseInt(e.target.value)})} />
//                     </div>

//                     <div className="space-y-1">
//                       <label className="text-xs font-bold text-gray-500 uppercase">Daily Rate ($)</label>
//                       <input type="number" required className="w-full border p-2 rounded font-bold text-[#027480]" 
//                         value={formData.rental_rate} onChange={e => setFormData({...formData, rental_rate: parseInt(e.target.value)})} />
//                     </div>

//                     <div className="space-y-1">
//                       <label className="text-xs font-bold text-gray-500 uppercase">Status</label>
//                       <select className="w-full border p-2 rounded" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
//                         <option>Available</option>
//                         <option>Maintenance</option>
//                         <option>Rented</option>
//                       </select>
//                     </div>
//                   </div>
//                 )}

//                 {/* Footer Buttons */}
//                 <div className="pt-4 flex justify-between border-t border-gray-100 mt-6">
//                   {step === 2 ? (
//                     <button type="button" onClick={() => setStep(1)} className="text-gray-500 hover:text-black font-medium">
//                       ← Back to Specs
//                     </button>
//                   ) : (
//                     <div></div> // Empty div for spacing
//                   )}

//                   {step === 1 ? (
//                     <button type="button" onClick={handleNextStep} className="bg-[#027480] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#025e69] transition-colors">
//                       Next Step →
//                     </button>
//                   ) : (
//                     <button 
//                       type="submit" 
//                       disabled={isCreatingSpec || isCreatingVehicle}
//                       className="bg-[#F57251] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#d65f41] transition-colors flex items-center gap-2 disabled:opacity-50"
//                     >
//                       {(isCreatingSpec || isCreatingVehicle) ? 'Saving...' : 'Create Vehicle'}
//                     </button>
//                   )}
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FleetManagement;

