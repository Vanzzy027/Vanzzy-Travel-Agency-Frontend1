import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, Search, Car, AlertCircle, 
  ArrowRight, ArrowLeft, CheckCircle2, X, Save,
  ToggleLeft, ToggleRight, DollarSign, Calendar,
  Gauge, Users, Fuel, Cog, Tag, Image as ImageIcon
} from 'lucide-react';
import { 
  useGetVehiclesQuery, 
  useCreateVehicleSpecMutation, 
  useAddVehicleMutation, 
  useDeleteVehicleMutation,
  useUpdateVehicleMutation,
  useUpdateVehicleSpecMutation,
  useGetVehicleSpecsQuery,
  useDeleteVehicleSpecMutation,
  type Vehicle
} from '../../features/api/VehicleAPI';
import { toast } from 'sonner';

// Define type for vehicle status
type VehicleStatus = 'Available' | 'Rented' | 'Maintenance' | 'Unavailable';

const FleetManagement: React.FC = () => {
  // Queries
  const { data: vehicles, isLoading, error, refetch: refetchVehicles } = useGetVehiclesQuery(); 
  
  
  // const allSpecs = Array.isArray(specsData) 
  // ? specsData 
  // : (specsData as any)?.data || [];

  const { data: allSpecs, isLoading: isLoadingSpecs, refetch: refetchSpecs } = useGetVehicleSpecsQuery();
  
  // Mutations
  const [createSpec] = useCreateVehicleSpecMutation();
  const [createVehicle] = useAddVehicleMutation();
  const [deleteVehicle] = useDeleteVehicleMutation();
  const [updateVehicle] = useUpdateVehicleMutation();
  const [updateVehicleSpec] = useUpdateVehicleSpecMutation();
  const [deleteVehicleSpec] = useDeleteVehicleSpecMutation();

  // UI State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<'select' | 'specs' | 'inventory'>('select');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentEditingVehicle, setCurrentEditingVehicle] = useState<Vehicle | null>(null);
  const [selectedExistingSpecId, setSelectedExistingSpecId] = useState<number | null>(null);
  const [useExistingSpec, setUseExistingSpec] = useState(false);

  // DATA State
  const [createdSpecData, setCreatedSpecData] = useState<{id: number, name: string} | null>(null);

  const initialFormState = {
    // SPECS
    manufacturer: '', model: '', year: new Date().getFullYear(),
    fuel_type: 'Petrol', engine_capacity: '1.5L', transmission: 'Automatic',
    seating_capacity: 5, color: 'White', features: '', vehicle_type: 'Sedan',
    image_url: '', 
    
    // PROMO
    on_promo: false, promo_rate: 0, promo_start_date: '', promo_end_date: '',
    
    // INVENTORY
    vin_number: '', license_plate: '', current_mileage: 0, 
    rental_rate: 0, status: 'Available' as VehicleStatus,
    vehicle_id: 0, vehicleSpec_id: 0
  };

  const [formData, setFormData] = useState(initialFormState);

  // Debug useEffect
  useEffect(() => {
    console.log('Current form data:', formData);
    console.log('All specs:', allSpecs);
    console.log('Selected spec ID:', selectedExistingSpecId);
  }, [formData, allSpecs, selectedExistingSpecId]);

  // Helper functions
  const parseFeatures = (featuresString: string): string[] => {
    try {
      if (!featuresString) return [];
      if (Array.isArray(featuresString)) return featuresString;
      const parsed = JSON.parse(featuresString);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return featuresString.split(',').map(f => f.trim()).filter(f => f);
    }
  };

  const parseImages = (imagesString: string): string[] => {
    try {
      if (!imagesString) return [];
      if (Array.isArray(imagesString)) return imagesString;
      const parsed = JSON.parse(imagesString);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return imagesString ? [imagesString] : [];
    }
  };

  // Handle existing spec selection
  const handleExistingSpecSelect = (specId: number) => {
    console.log('Selecting spec ID:', specId);
    setSelectedExistingSpecId(specId);
    const spec = allSpecs?.find(s => s.vehicleSpec_id === specId);
    console.log('Found spec:', spec);
    
    if (spec) {
      setFormData(prev => ({
        ...prev,
        manufacturer: spec.manufacturer,
        model: spec.model,
        year: spec.year,
        fuel_type: spec.fuel_type,
        transmission: spec.transmission,
        seating_capacity: spec.seating_capacity,
        color: spec.color,
        vehicle_type: spec.vehicle_type || 'Sedan',
        features: parseFeatures(spec.features || '').join(', '),
        image_url: parseImages(spec.images || '')[0] || '',
        on_promo: spec.on_promo || false,
        promo_rate: spec.promo_rate || 0,
        promo_start_date: spec.promo_start_date || '',
        promo_end_date: spec.promo_end_date || '',
        vehicleSpec_id: spec.vehicleSpec_id
      }));
      console.log('Form data updated with spec:', spec);
    }
  };

  // Step 1: Create Spec or Use Existing
  const handleCreateSpecStep = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Create spec step triggered');

    if (useExistingSpec && selectedExistingSpecId) {
      console.log('Using existing spec:', selectedExistingSpecId);
      const spec = allSpecs?.find(s => s.vehicleSpec_id === selectedExistingSpecId);
      if (spec) {
        setCreatedSpecData({
          id: selectedExistingSpecId,
          name: `${spec.manufacturer} ${spec.model} (${spec.year})`
        });
        toast.success("Using existing specification!");
        setCurrentStep('inventory');
      } else {
        toast.error("Selected specification not found");
      }
      return;
    }

    // Create new spec
    if (!formData.manufacturer || !formData.model) {
      toast.error("Please fill in Manufacturer and Model");
      return;
    }

    try {
      console.log('Creating new specification...');
      
      // Prepare features and images as JSON strings
      const featuresArray = formData.features 
        ? formData.features.split(',').map(s => s.trim()).filter(s => s)
        : [];
      const imagesArray = formData.image_url ? [formData.image_url] : [];

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
        features: JSON.stringify(featuresArray),
        images: JSON.stringify(imagesArray),
        on_promo: formData.on_promo,
        promo_rate: formData.on_promo ? formData.promo_rate : 0,
        promo_start_date: formData.on_promo ? formData.promo_start_date : undefined,
        promo_end_date: formData.on_promo ? formData.promo_end_date : undefined,
      };

      console.log('Sending spec payload:', specPayload);
// const payload = {
//   ...formData,
//   // Convert null to undefined for date fields
//   promo_start_date: formData.promo_start_date || undefined,
//   promo_end_date: formData.promo_end_date || undefined,
// };
      const response = await createSpec(specPayload).unwrap();
      console.log('Create spec response:', response);
// Extract spec ID safely
let newSpecId: number | undefined;

// Some APIs wrap data, some return directly — so handle both safely
const maybeWrapped: any = response;

// Case 1: API returned { data: {...} }
if (maybeWrapped?.data?.vehicleSpec_id) {
  newSpecId = maybeWrapped.data.vehicleSpec_id;
}

// Case 2: API returned vehicleSpec fields directly
else if (maybeWrapped?.vehicleSpec_id) {
  newSpecId = maybeWrapped.vehicleSpec_id;
}

if (!newSpecId) {
  console.error("No vehicleSpec_id found in create spec response:", response);
  toast.error("Specification created but no ID was returned");
  return;
}


      // // Extract the spec ID from response
      // let newSpecId;
      // if (response.data && response.data.vehicleSpec_id) {
      //   newSpecId = response.data.vehicleSpec_id;
      // } else if (response.vehicleSpec_id) {
      //   newSpecId = response.vehicleSpec_id;
      // } else {
      //   console.error('No vehicleSpec_id in response:', response);
      //   toast.error("Specification created but ID not returned");
      //   return;
      // }

      console.log('New spec ID:', newSpecId);

      setCreatedSpecData({
        id: newSpecId,
        name: `${formData.manufacturer} ${formData.model} (${formData.year})`
      });
      
      toast.success("Specification Created!");
      setCurrentStep('inventory');
      
    } catch (err: any) {
      console.error("Spec Creation Error:", err);
      console.error("Error details:", err.data);
      toast.error(err.data?.message || "Failed to create specification");
    }
  };

  // Step 2: Create Inventory
  const handleCreateInventoryStep = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Create inventory step triggered');

    const specId = useExistingSpec ? selectedExistingSpecId : createdSpecData?.id;
    
    if (!specId) {
      toast.error("Error: Specification ID not found.");
      return;
    }

    try {
      const vehiclePayload = {
        vehicleSpec_id: specId,
        vin_number: formData.vin_number,
        license_plate: formData.license_plate,
        current_mileage: formData.current_mileage,
        rental_rate: formData.rental_rate,
        status: formData.status
      };

      console.log('Creating vehicle with payload:', vehiclePayload);
      await createVehicle(vehiclePayload).unwrap();
      
      toast.success("Vehicle Added Successfully!");
      setIsModalOpen(false);
      resetForm();
      refetchVehicles();
      refetchSpecs();
    } catch (err: any) {
      console.error("Inventory Creation Failed", err);
      console.error("Error details:", err.data);
      toast.error(err.data?.message || "Failed to add vehicle");
    }
  };

  // Edit functions
  const handleEditClick = (vehicle: Vehicle) => {
    setCurrentEditingVehicle(vehicle);
    
    // Parse features and images
    const features = parseFeatures(vehicle.features || '');
    const images = parseImages(vehicle.images || '');
    
    // Populate form with vehicle data
    setFormData({
      manufacturer: vehicle.manufacturer || '',
      model: vehicle.model || '',
      year: vehicle.year || new Date().getFullYear(),
      fuel_type: vehicle.fuel_type || 'Petrol',
      engine_capacity: vehicle.engine_capacity || '1.5L',
      transmission: vehicle.transmission || 'Automatic',
      seating_capacity: vehicle.seating_capacity || 5,
      color: vehicle.color || 'White',
      features: features.join(', '),
      vehicle_type: vehicle.vehicle_type || 'Sedan',
      image_url: images[0] || '',
      on_promo: vehicle.on_promo || false,
      promo_rate: vehicle.promo_rate || 0,
      promo_start_date: vehicle.promo_start_date || '',
      promo_end_date: vehicle.promo_end_date || '',
      vin_number: vehicle.vin_number || '',
      license_plate: vehicle.license_plate || '',
      current_mileage: vehicle.current_mileage || 0,
      rental_rate: vehicle.rental_rate || 0,
      status: vehicle.status || 'Available',
      vehicle_id: vehicle.vehicle_id,
      vehicleSpec_id: vehicle.vehicleSpec_id
    });
    
    setIsEditModalOpen(true);
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentEditingVehicle) return;
    
    try {
      console.log('Updating vehicle and spec...');
      
      // Prepare features and images as JSON strings
      const featuresArray = formData.features 
        ? formData.features.split(',').map(s => s.trim()).filter(s => s)
        : [];
      const imagesArray = formData.image_url ? [formData.image_url] : [];

      // Update spec
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
        features: JSON.stringify(featuresArray),
        images: JSON.stringify(imagesArray),
        on_promo: formData.on_promo,
        promo_rate: formData.on_promo ? formData.promo_rate : 0,
        promo_start_date: formData.on_promo ? formData.promo_start_date : undefined,
        promo_end_date: formData.on_promo ? formData.promo_end_date : undefined
      };
      
      console.log('Updating spec with payload:', specPayload);
      await updateVehicleSpec({ 
        id: currentEditingVehicle.vehicleSpec_id, 
        data: specPayload 
      }).unwrap();
      
      // Update vehicle
      const vehiclePayload = {
        vin_number: formData.vin_number,
        license_plate: formData.license_plate,
        current_mileage: formData.current_mileage,
        rental_rate: formData.rental_rate,
        status: formData.status
      };
      
      console.log('Updating vehicle with payload:', vehiclePayload);
      await updateVehicle({ 
        id: currentEditingVehicle.vehicle_id, 
        data: vehiclePayload 
      }).unwrap();
      
      toast.success("Vehicle updated successfully!");
      
      setIsEditModalOpen(false);
      refetchVehicles();
      resetForm();
    } catch (err: any) {
      console.error("Update failed:", err);
      console.error("Error details:", err.data);
      toast.error(err.data?.message || "Failed to update");
    }
  };

  // Delete function
  const handleDeleteVehicle = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this vehicle? This action cannot be undone.")) {
      try {
        await deleteVehicle(id).unwrap();
        toast.success("Vehicle deleted successfully");
        refetchVehicles();
      } catch (err: any) {
        console.error("Delete failed:", err);
        console.error("Error details:", err.data);
        if (err.data?.message?.includes("foreign key constraint")) {
          toast.error("Cannot delete vehicle because it has related records. Please delete bookings first.");
        } else {
          toast.error(err.data?.message || "Failed to delete vehicle");
        }
      }
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setCreatedSpecData(null);
    setSelectedExistingSpecId(null);
    setUseExistingSpec(false);
    setCurrentStep('select');
    setCurrentEditingVehicle(null);
  };

  // Filter vehicles
  const filteredVehicles = vehicles?.filter(v => 
    v.model?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.manufacturer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.license_plate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.vin_number?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) return (
    <div className="flex h-64 items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#027480]"></div>
    </div>
  );

  return (
    <div className="space-y-6 p-4 min-h-screen bg-[#001524]">
      {/* HEADER & ACTIONS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Fleet Management</h1>
          <p className="text-[#C4AD9D]">Manage specifications and fleet inventory.</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by model, plate, or VIN..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full bg-[#0f2434] border border-[#445048] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#027480]"
            />
          </div>
          <button 
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="bg-[#027480] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#025e69] transition-colors shadow-lg font-semibold"
          >
            <Plus size={20} /> Add Vehicle
          </button>
        </div>
      </div>

      {/* ERROR STATE */}
      {error && (
        <div className="bg-red-900/20 border border-red-700 text-red-300 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle size={20} />
          <span>Error loading vehicles. Please check connection.</span>
        </div>
      )}

      {/* VEHICLES TABLE - DARK THEME */}
      <div className="bg-[#0f2434] rounded-xl shadow-lg border border-[#445048] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#001524] text-white">
              <tr>
                <th className="p-4 font-semibold">Vehicle</th>
                <th className="p-4 font-semibold">Details</th>
                <th className="p-4 font-semibold">Inventory</th>
                <th className="p-4 font-semibold">Status & Price</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#445048]">
              {filteredVehicles?.map((v) => {
                const images = parseImages(v.images || '');
                
                return (
                  <tr key={v.vehicle_id} className="hover:bg-[#1a3247] transition-colors text-white">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-700 flex items-center justify-center">
                          {images[0] ? (
                            <img 
                              src={images[0]} 
                              alt={`${v.manufacturer} ${v.model}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          ) : null}
                          <div className={`${images[0] ? 'hidden' : ''} w-full h-full flex items-center justify-center bg-gray-800`}>
                            <Car size={24} className="text-gray-400"/>
                          </div>
                        </div>
                        <div>
                          <div className="font-bold text-white">{v.manufacturer} {v.model}</div>
                          <div className="text-sm text-[#C4AD9D]">{v.year}</div>
                          <div className="text-xs text-gray-400">Type: {v.vehicle_type || 'Sedan'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Users size={14} className="text-[#027480]" />
                          <span>{v.seating_capacity} Seats</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Fuel size={14} className="text-[#027480]" />
                          <span>{v.fuel_type}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Cog size={14} className="text-[#027480]" />
                          <span>{v.transmission}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-2">
                        <div className="font-mono text-sm bg-[#001524] px-3 py-2 rounded-lg">
                          {v.license_plate}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Gauge size={14} className="text-[#F57251]" />
                          <span>{v.current_mileage?.toLocaleString()} km</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="text-lg font-bold text-[#027480]">
                            ${v.rental_rate}/day
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={async () => {
                                try {
                                  await updateVehicleSpec({ 
                                    id: v.vehicleSpec_id, 
                                    data: { on_promo: !v.on_promo } 
                                  }).unwrap();
                                  refetchVehicles();
                                  toast.success(`Promotion ${v.on_promo ? 'disabled' : 'enabled'}`);
                                } catch (err) {
                                  toast.error("Failed to update promotion status");
                                }
                              }}
                              className={`p-1 rounded-full transition-colors ${v.on_promo ? 'bg-green-500' : 'bg-gray-600'}`}
                            >
                              {v.on_promo ? (
                                <ToggleRight size={20} className="text-white" />
                              ) : (
                                <ToggleLeft size={20} className="text-gray-300" />
                              )}
                            </button>
                            {v.on_promo && v.promo_rate && (
                              <span className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded">
                                -{v.promo_rate}%
                              </span>
                            )}
                          </div>
                        </div>
                        <div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            v.status === 'Available' ? 'bg-green-900/30 text-green-400 border border-green-900' :
                            v.status === 'Rented' ? 'bg-blue-900/30 text-blue-400 border border-blue-900' :
                            v.status === 'Maintenance' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-900' :
                            'bg-red-900/30 text-red-400 border border-red-900'
                          }`}>
                            {v.status}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleEditClick(v)}
                          className="p-2 bg-[#027480] text-white hover:bg-[#025e69] rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteVehicle(v.vehicle_id)}
                          className="p-2 bg-red-900/30 text-red-400 hover:bg-red-900/50 rounded-lg transition-colors border border-red-900"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
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

      {/* ADD VEHICLE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f2434] rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-[#445048]">
            {/* Modal Header */}
            <div className="bg-[#001524] p-6 flex justify-between items-center text-[#E9E6DD]">
              <div>
                <h2 className="text-2xl font-bold">Add New Vehicle</h2>
                <p className="text-[#C4AD9D] text-sm">
                  {currentStep === 'select' && 'Choose how to add vehicle'}
                  {currentStep === 'specs' && 'Step 1: Vehicle Specifications'}
                  {currentStep === 'inventory' && 'Step 2: Inventory Details'}
                </p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-[#C4AD9D] hover:text-white text-2xl p-2 rounded-full hover:bg-white/10"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto">
              {/* STEP 1: SELECT METHOD */}
              {currentStep === 'select' && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="bg-[#001524] p-6 rounded-xl border border-[#445048]">
                    <h3 className="text-xl font-bold text-white mb-4">Choose Creation Method</h3>
                    <div className="space-y-4">
                      <button
                        onClick={() => {
                          setUseExistingSpec(true);
                          setCurrentStep('specs');
                        }}
                        className="w-full p-6 bg-[#1a3247] hover:bg-[#2a4267] border-2 border-[#445048] rounded-xl text-left transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-[#027480] flex items-center justify-center">
                            <Car className="text-white" size={24} />
                          </div>
                          <div>
                            <h4 className="font-bold text-white text-lg">Use Existing Specification</h4>
                            <p className="text-[#C4AD9D] text-sm mt-1">
                              Select from existing vehicle specifications.
                            </p>
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          setUseExistingSpec(false);
                          setCurrentStep('specs');
                        }}
                        className="w-full p-6 bg-[#1a3247] hover:bg-[#2a4267] border-2 border-[#445048] rounded-xl text-left transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-[#F57251] flex items-center justify-center">
                            <Plus className="text-white" size={24} />
                          </div>
                          <div>
                            <h4 className="font-bold text-white text-lg">Create New Specification</h4>
                            <p className="text-[#C4AD9D] text-sm mt-1">
                              Create a new vehicle specification with custom details.
                            </p>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: SPECIFICATIONS */}
              {currentStep === 'specs' && (
                <form onSubmit={handleCreateSpecStep} className="space-y-6">
                  {useExistingSpec && (
                    <div className="bg-[#001524] p-4 rounded-lg border border-[#027480]/30">
                      <label className="text-sm font-bold text-[#027480] mb-2 block">Select Existing Specification</label>
                      {isLoadingSpecs ? (
                        <div className="text-center py-4 text-[#C4AD9D]">Loading specifications...</div>
                      ) : (
                        <>
                          <select
                            value={selectedExistingSpecId || ''}
                            onChange={(e) => {
                              const specId = Number(e.target.value);
                              console.log('Dropdown changed to:', specId);
                              handleExistingSpecSelect(specId);
                            }}
                            className="w-full bg-[#0f2434] border border-[#445048] rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#027480]"
                          >
                            <option value="">-- Select a specification --</option>
                            {allSpecs?.map((spec) => (
                              <option key={spec.vehicleSpec_id} value={spec.vehicleSpec_id}>
                                {spec.manufacturer} {spec.model} ({spec.year}) - {spec.vehicle_type}
                              </option>
                            ))}
                          </select>
                          <p className="text-xs text-[#C4AD9D] mt-2">
                            Selecting an existing spec will pre-fill the form below
                          </p>
                        </>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Basic Info */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#C4AD9D] uppercase">Manufacturer *</label>
                      <input
                        required
                        className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
                        value={formData.manufacturer}
                        onChange={e => setFormData({...formData, manufacturer: e.target.value})}
                        placeholder="e.g. Toyota"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#C4AD9D] uppercase">Model *</label>
                      <input
                        required
                        className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
                        value={formData.model}
                        onChange={e => setFormData({...formData, model: e.target.value})}
                        placeholder="e.g. Camry"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#C4AD9D] uppercase">Type</label>
                      <select
                        className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
                        value={formData.vehicle_type}
                        onChange={e => setFormData({...formData, vehicle_type: e.target.value})}
                      >
                        <option value="Sedan">Sedan</option>
                        <option value="SUV">SUV</option>
                        <option value="Truck">Truck</option>
                        <option value="Van">Van</option>
                        <option value="Hatchback">Hatchback</option>
                        <option value="Coupe">Coupe</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#C4AD9D] uppercase">Year</label>
                      <input
                        type="number"
                        required
                        min="1900"
                        max={new Date().getFullYear() + 1}
                        className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
                        value={formData.year}
                        onChange={e => setFormData({...formData, year: parseInt(e.target.value)})}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#C4AD9D] uppercase">Fuel Type</label>
                      <select
                        className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
                        value={formData.fuel_type}
                        onChange={e => setFormData({...formData, fuel_type: e.target.value})}
                      >
                        <option value="Petrol">Petrol</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Electric">Electric</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#C4AD9D] uppercase">Transmission</label>
                      <select
                        className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
                        value={formData.transmission}
                        onChange={e => setFormData({...formData, transmission: e.target.value})}
                      >
                        <option value="Automatic">Automatic</option>
                        <option value="Manual">Manual</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#C4AD9D] uppercase">Engine Capacity</label>
                      <select
                        className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
                        value={formData.engine_capacity}
                        onChange={e => setFormData({...formData, engine_capacity: e.target.value})}
                      >
                        <option value="1.0L">1.0L</option>
                        <option value="1.5L">1.5L</option>
                        <option value="2.0L">2.0L</option>
                        <option value="2.5L">2.5L</option>
                        <option value="3.0L">3.0L</option>
                        <option value="3.5L">3.5L</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#C4AD9D] uppercase">Seats</label>
                      <select
                        className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
                        value={formData.seating_capacity}
                        onChange={e => setFormData({...formData, seating_capacity: parseInt(e.target.value)})}
                      >
                        {[2, 4, 5, 7, 8].map(num => (
                          <option key={num} value={num}>{num} Seats</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#C4AD9D] uppercase">Color</label>
                      <input
                        className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
                        value={formData.color}
                        onChange={e => setFormData({...formData, color: e.target.value})}
                        placeholder="e.g. White"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-1">
                      <label className="text-xs font-bold text-[#C4AD9D] uppercase">Features</label>
                      <input
                        className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
                        value={formData.features}
                        onChange={e => setFormData({...formData, features: e.target.value})}
                        placeholder="GPS, Bluetooth, Sunroof"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-1">
                      <label className="text-xs font-bold text-[#C4AD9D] uppercase">Image URL</label>
                      <input
                        className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
                        value={formData.image_url}
                        onChange={e => setFormData({...formData, image_url: e.target.value})}
                        placeholder="https://example.com/image.jpg"
                      />
                      {formData.image_url && (
                        <div className="mt-2 flex items-center gap-3">
                          <div className="w-32 h-32 rounded-lg border border-[#445048] overflow-hidden">
                            <img
                              src={formData.image_url}
                              alt="Preview"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          </div>
                          <div className="text-sm text-[#C4AD9D]">
                            Image preview will appear here
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Promotion Section */}
                    <div className="md:col-span-2 border-t border-[#445048] pt-4 mt-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-white">Promotion Settings</h4>
                        <div className="flex items-center gap-2">
                          <label className="flex items-center gap-2 text-sm text-[#C4AD9D]">
                            <input
                              type="checkbox"
                              checked={formData.on_promo}
                              onChange={e => setFormData({...formData, on_promo: e.target.checked})}
                              className="rounded"
                            />
                            Enable Promotion
                          </label>
                        </div>
                      </div>
                      
                      {formData.on_promo && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-[#C4AD9D] uppercase">Discount Rate (%)</label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
                              value={formData.promo_rate}
                              onChange={e => setFormData({...formData, promo_rate: parseFloat(e.target.value)})}
                              placeholder="e.g., 15"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-[#C4AD9D] uppercase">Start Date</label>
                            <input
                              type="date"
                              className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
                              value={formData.promo_start_date}
                              onChange={e => setFormData({...formData, promo_start_date: e.target.value})}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-[#C4AD9D] uppercase">End Date</label>
                            <input
                              type="date"
                              className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
                              value={formData.promo_end_date}
                              onChange={e => setFormData({...formData, promo_end_date: e.target.value})}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-[#445048]">
                    <button
                      type="button"
                      onClick={() => setCurrentStep('select')}
                      className="px-6 py-2 border border-[#445048] text-[#C4AD9D] hover:text-white rounded-lg hover:border-white/30 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="bg-[#027480] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#025e69] transition-colors flex items-center gap-2"
                    >
                      {useExistingSpec ? 'Use This Spec' : 'Create Specification'} <ArrowRight size={16} />
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 3: INVENTORY */}
              {currentStep === 'inventory' && (
                <form onSubmit={handleCreateInventoryStep} className="space-y-6">
                  {createdSpecData && (
                    <div className="bg-[#001524] border border-[#027480]/30 p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-[#027480] mb-1">
                        <CheckCircle2 size={18} />
                        <span className="font-bold text-xs uppercase tracking-wide">Specification Ready</span>
                      </div>
                      <p className="font-bold text-xl text-white">
                        {createdSpecData.name}
                      </p>
                      <p className="text-xs text-[#C4AD9D]">Spec ID: {createdSpecData.id}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#C4AD9D] uppercase">VIN Number *</label>
                      <input
                        required
                        className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
                        value={formData.vin_number}
                        onChange={e => setFormData({...formData, vin_number: e.target.value})}
                        placeholder="e.g. 1HGCM82633A123456"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#C4AD9D] uppercase">License Plate *</label>
                      <input
                        required
                        className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
                        value={formData.license_plate}
                        onChange={e => setFormData({...formData, license_plate: e.target.value})}
                        placeholder="e.g. KDT 132R"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#C4AD9D] uppercase">Current Mileage</label>
                      <input
                        type="number"
                        required
                        className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
                        value={formData.current_mileage}
                        onChange={e => setFormData({...formData, current_mileage: parseInt(e.target.value)})}
                        min="0"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#C4AD9D] uppercase">Daily Rate ($)</label>
                      <input
                        type="number"
                        required
                        className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
                        value={formData.rental_rate}
                        onChange={e => setFormData({...formData, rental_rate: parseFloat(e.target.value)})}
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#C4AD9D] uppercase">Availability</label>
                      <select
                        className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
                        value={formData.status}
                        onChange={e => setFormData({...formData, status: e.target.value as VehicleStatus})}
                      >
                        <option value="Available">Available</option>
                        <option value="Rented">Rented</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Unavailable">Unavailable</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-[#445048]">
                    <button
                      type="button"
                      onClick={() => setCurrentStep('specs')}
                      className="px-6 py-2 border border-[#445048] text-[#C4AD9D] hover:text-white rounded-lg hover:border-white/30 transition-colors flex items-center gap-2"
                    >
                      <ArrowLeft size={16} /> Back to Specs
                    </button>
                    <button
                      type="submit"
                      className="bg-[#F57251] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#d65f41] transition-colors"
                    >
                      Finish & Save Vehicle
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditModalOpen && currentEditingVehicle && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f2434] rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-[#445048]">
            <div className="bg-[#001524] p-6 flex justify-between items-center text-[#E9E6DD]">
              <div>
                <h2 className="text-2xl font-bold">Edit Vehicle</h2>
                <p className="text-[#C4AD9D] text-sm">
                  {currentEditingVehicle.manufacturer} {currentEditingVehicle.model}
                </p>
              </div>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="text-[#C4AD9D] hover:text-white text-2xl p-2 rounded-full hover:bg-white/10"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <form onSubmit={handleEditSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Basic Info */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#C4AD9D] uppercase">Manufacturer *</label>
                    <input
                      required
                      className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
                      value={formData.manufacturer}
                      onChange={e => setFormData({...formData, manufacturer: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#C4AD9D] uppercase">Model *</label>
                    <input
                      required
                      className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
                      value={formData.model}
                      onChange={e => setFormData({...formData, model: e.target.value})}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#C4AD9D] uppercase">Type</label>
                    <select
                      className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
                      value={formData.vehicle_type}
                      onChange={e => setFormData({...formData, vehicle_type: e.target.value})}
                    >
                      <option value="Sedan">Sedan</option>
                      <option value="SUV">SUV</option>
                      <option value="Truck">Truck</option>
                      <option value="Van">Van</option>
                      <option value="Hatchback">Hatchback</option>
                      <option value="Coupe">Coupe</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#C4AD9D] uppercase">Year</label>
                    <input
                      type="number"
                      required
                      min="1900"
                      max={new Date().getFullYear() + 1}
                      className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
                      value={formData.year}
                      onChange={e => setFormData({...formData, year: parseInt(e.target.value)})}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#C4AD9D] uppercase">Fuel Type</label>
                    <select
                      className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
                      value={formData.fuel_type}
                      onChange={e => setFormData({...formData, fuel_type: e.target.value})}
                    >
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Electric">Electric</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#C4AD9D] uppercase">Transmission</label>
                    <select
                      className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
                      value={formData.transmission}
                      onChange={e => setFormData({...formData, transmission: e.target.value})}
                    >
                      <option value="Automatic">Automatic</option>
                      <option value="Manual">Manual</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#C4AD9D] uppercase">Engine Capacity</label>
                    <select
                      className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
                      value={formData.engine_capacity}
                      onChange={e => setFormData({...formData, engine_capacity: e.target.value})}
                    >
                      <option value="1.0L">1.0L</option>
                      <option value="1.5L">1.5L</option>
                      <option value="2.0L">2.0L</option>
                      <option value="2.5L">2.5L</option>
                      <option value="3.0L">3.0L</option>
                      <option value="3.5L">3.5L</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#C4AD9D] uppercase">Seats</label>
                    <select
                      className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
                      value={formData.seating_capacity}
                      onChange={e => setFormData({...formData, seating_capacity: parseInt(e.target.value)})}
                    >
                      {[2, 4, 5, 7, 8].map(num => (
                        <option key={num} value={num}>{num} Seats</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#C4AD9D] uppercase">Color</label>
                    <input
                      className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
                      value={formData.color}
                      onChange={e => setFormData({...formData, color: e.target.value})}
                    />
                  </div>

                  <div className="md:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-[#C4AD9D] uppercase">Features</label>
                    <input
                      className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
                      value={formData.features}
                      onChange={e => setFormData({...formData, features: e.target.value})}
                      placeholder="Comma separated features"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-[#C4AD9D] uppercase">Image URL</label>
                    <input
                      className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
                      value={formData.image_url}
                      onChange={e => setFormData({...formData, image_url: e.target.value})}
                    />
                    {formData.image_url && (
                      <div className="mt-2">
                        <div className="w-32 h-32 rounded-lg border border-[#445048] overflow-hidden">
                          <img
                            src={formData.image_url}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Vehicle Inventory Fields */}
                  <div className="md:col-span-2 border-t border-[#445048] pt-4 mt-2">
                    <h4 className="font-bold text-white mb-4">Vehicle Inventory</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-[#C4AD9D] uppercase">VIN Number</label>
                        <input
                          required
                          className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
                          value={formData.vin_number}
                          onChange={e => setFormData({...formData, vin_number: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-[#C4AD9D] uppercase">License Plate</label>
                        <input
                          required
                          className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
                          value={formData.license_plate}
                          onChange={e => setFormData({...formData, license_plate: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-[#C4AD9D] uppercase">Mileage</label>
                        <input
                          type="number"
                          required
                          className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
                          value={formData.current_mileage}
                          onChange={e => setFormData({...formData, current_mileage: parseInt(e.target.value)})}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-[#C4AD9D] uppercase">Daily Rate ($)</label>
                        <input
                          type="number"
                          required
                          className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
                          value={formData.rental_rate}
                          onChange={e => setFormData({...formData, rental_rate: parseFloat(e.target.value)})}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-[#C4AD9D] uppercase">Availability</label>
                        <select
                          className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
                          value={formData.status}
                          onChange={e => setFormData({...formData, status: e.target.value as VehicleStatus})}
                        >
                          <option value="Available">Available</option>
                          <option value="Rented">Rented</option>
                          <option value="Maintenance">Maintenance</option>
                          <option value="Unavailable">Unavailable</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Promotion Section */}
                  <div className="md:col-span-2 border-t border-[#445048] pt-4 mt-2">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-white">Promotion Settings</h4>
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-2 text-sm text-[#C4AD9D]">
                          <input
                            type="checkbox"
                            checked={formData.on_promo}
                            onChange={e => setFormData({...formData, on_promo: e.target.checked})}
                            className="rounded"
                          />
                          Enable Promotion
                        </label>
                      </div>
                    </div>
                    
                    {formData.on_promo && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-[#C4AD9D] uppercase">Discount Rate (%)</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
                            value={formData.promo_rate}
                            onChange={e => setFormData({...formData, promo_rate: parseFloat(e.target.value)})}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-[#C4AD9D] uppercase">Start Date</label>
                          <input
                            type="date"
                            className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
                            value={formData.promo_start_date}
                            onChange={e => setFormData({...formData, promo_start_date: e.target.value})}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-[#C4AD9D] uppercase">End Date</label>
                          <input
                            type="date"
                            className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
                            value={formData.promo_end_date}
                            onChange={e => setFormData({...formData, promo_end_date: e.target.value})}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-[#445048]">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-6 py-2 border border-[#445048] text-[#C4AD9D] hover:text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#027480] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#025e69] transition-colors flex items-center gap-2"
                  >
                    <Save size={18} /> Save Changes
                  </button>
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
// import { 
//   Plus, Edit, Trash2, Search, Car, AlertCircle, 
//   ArrowRight, ArrowLeft, CheckCircle2, X, Save,
//   ToggleLeft, ToggleRight, DollarSign, Calendar,
//   Gauge, Users, Fuel, Cog, Tag
// } from 'lucide-react';
// import { 
//   useGetVehiclesQuery, 
//   useCreateVehicleSpecMutation, 
//   useAddVehicleMutation, 
//   useDeleteVehicleMutation,
//   useUpdateVehicleMutation,
//   useUpdateVehicleSpecMutation,
//   useGetVehicleSpecsQuery,
//   useDeleteVehicleSpecMutation,
//   type Vehicle
// } from '../../features/api/VehicleAPI';
// import { toast } from 'sonner';

// // Define type for vehicle status
// type VehicleStatus = 'Available' | 'Rented' | 'Maintenance' | 'Unavailable';

// const FleetManagement: React.FC = () => {
//   // Queries
//   const { data: vehicles, isLoading, error, refetch: refetchVehicles } = useGetVehiclesQuery(); 
//   const { data: allSpecs } = useGetVehicleSpecsQuery();
  
//   // Mutations
//   const [createSpec] = useCreateVehicleSpecMutation();
//   const [createVehicle] = useAddVehicleMutation();
//   const [deleteVehicle] = useDeleteVehicleMutation();
//   const [updateVehicle] = useUpdateVehicleMutation();
//   const [updateVehicleSpec] = useUpdateVehicleSpecMutation();
//   const [deleteVehicleSpec] = useDeleteVehicleSpecMutation();

//   // UI State
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [currentStep, setCurrentStep] = useState<'select' | 'specs' | 'inventory'>('select');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentEditingVehicle, setCurrentEditingVehicle] = useState<Vehicle | null>(null);
//   const [selectedExistingSpecId, setSelectedExistingSpecId] = useState<number | null>(null);
//   const [useExistingSpec, setUseExistingSpec] = useState(false);

//   // DATA State
//   const [createdSpecData, setCreatedSpecData] = useState<{id: number, name: string} | null>(null);

//   const initialFormState = {
//     // SPECS
//     manufacturer: '', model: '', year: new Date().getFullYear(),
//     fuel_type: 'Petrol', engine_capacity: '1.5L', transmission: 'Automatic',
//     seating_capacity: 5, color: 'White', features: '', vehicle_type: 'Sedan',
//     image_url: '', 
    
//     // PROMO
//     on_promo: false, promo_rate: 0, promo_start_date: '', promo_end_date: '',
    
//     // INVENTORY
//     vin_number: '', license_plate: '', current_mileage: 0, 
//     rental_rate: 0, status: 'Available' as VehicleStatus,
//     vehicle_id: 0, vehicleSpec_id: 0
//   };

//   const [formData, setFormData] = useState(initialFormState);

//   // Helper functions
//   const parseFeatures = (featuresString: string): string[] => {
//     try {
//       if (!featuresString) return [];
//       if (Array.isArray(featuresString)) return featuresString;
//       const parsed = JSON.parse(featuresString);
//       return Array.isArray(parsed) ? parsed : [];
//     } catch {
//       return featuresString.split(',').map(f => f.trim()).filter(f => f);
//     }
//   };

//   const parseImages = (imagesString: string): string[] => {
//     try {
//       if (!imagesString) return [];
//       if (Array.isArray(imagesString)) return imagesString;
//       const parsed = JSON.parse(imagesString);
//       return Array.isArray(parsed) ? parsed : [];
//     } catch {
//       return imagesString ? [imagesString] : [];
//     }
//   };

//   // Handle existing spec selection
//   const handleExistingSpecSelect = (specId: number) => {
//     setSelectedExistingSpecId(specId);
//     const spec = allSpecs?.find(s => s.vehicleSpec_id === specId);
//     if (spec) {
//       setFormData(prev => ({
//         ...prev,
//         manufacturer: spec.manufacturer,
//         model: spec.model,
//         year: spec.year,
//         fuel_type: spec.fuel_type,
//         transmission: spec.transmission,
//         seating_capacity: spec.seating_capacity,
//         color: spec.color,
//         vehicle_type: spec.vehicle_type || 'Sedan',
//         features: parseFeatures(spec.features || '').join(', '),
//         image_url: parseImages(spec.images || '')[0] || '',
//         vehicleSpec_id: spec.vehicleSpec_id
//       }));
//     }
//   };

//   // Step 1: Create Spec or Use Existing
//   const handleCreateSpecStep = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (useExistingSpec && selectedExistingSpecId) {
//       const spec = allSpecs?.find(s => s.vehicleSpec_id === selectedExistingSpecId);
//       if (spec) {
//         setCreatedSpecData({
//           id: selectedExistingSpecId,
//           name: `${spec.manufacturer} ${spec.model} (${spec.year})`
//         });
//         toast.success("Using existing specification!");
//         setCurrentStep('inventory');
//       }
//       return;
//     }

//     if (!formData.manufacturer || !formData.model) {
//       toast.error("Please fill in Manufacturer and Model");
//       return;
//     }

//     try {
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
//         features: formData.features ? JSON.stringify(formData.features.split(',').map(s => s.trim())) : undefined,
//         images: formData.image_url ? JSON.stringify([formData.image_url]) : undefined,
//         on_promo: formData.on_promo,
//         promo_rate: formData.promo_rate || undefined,
//         promo_start_date: formData.promo_start_date || undefined,
//         promo_end_date: formData.promo_end_date || undefined,
//       };

//       const response = await createSpec(specPayload).unwrap();
//       const newSpecId = response.vehicleSpec_id;

//       if (newSpecId) {
//         setCreatedSpecData({
//           id: newSpecId,
//           name: `${response.manufacturer} ${response.model} (${response.year})`
//         });
//         toast.success("Specification Created!");
//         setCurrentStep('inventory');
//       }
//     } catch (err: any) {
//       console.error("Spec Creation Error:", err);
//       toast.error(err.data?.message || "Failed to create specification");
//     }
//   };

//   // Step 2: Create Inventory
//   const handleCreateInventoryStep = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const specId = useExistingSpec ? selectedExistingSpecId : createdSpecData?.id;
    
//     if (!specId) {
//       toast.error("Error: Specification ID not found.");
//       return;
//     }

//     try {
//       const vehiclePayload = {
//         vehicleSpec_id: specId,
//         vin_number: formData.vin_number,
//         license_plate: formData.license_plate,
//         current_mileage: formData.current_mileage,
//         rental_rate: formData.rental_rate,
//         status: formData.status
//       };

//       await createVehicle(vehiclePayload).unwrap();
//       toast.success("Vehicle Added Successfully!");
//       setIsModalOpen(false);
//       resetForm();
//       refetchVehicles();
//     } catch (err: any) {
//       console.error("Inventory Creation Failed", err);
//       toast.error(err.data?.message || "Failed to add vehicle");
//     }
//   };

//   // Edit functions
//   const handleEditClick = (vehicle: Vehicle) => {
//     setCurrentEditingVehicle(vehicle);
    
//     // Populate form with vehicle data
//     setFormData({
//       manufacturer: vehicle.manufacturer || '',
//       model: vehicle.model || '',
//       year: vehicle.year || new Date().getFullYear(),
//       fuel_type: vehicle.fuel_type || 'Petrol',
//       engine_capacity: vehicle.engine_capacity || '1.5L',
//       transmission: vehicle.transmission || 'Automatic',
//       seating_capacity: vehicle.seating_capacity || 5,
//       color: vehicle.color || 'White',
//       features: parseFeatures(vehicle.features || '').join(', '),
//       vehicle_type: vehicle.vehicle_type || 'Sedan',
//       image_url: parseImages(vehicle.images || '')[0] || '',
//       on_promo: vehicle.on_promo || false,
//       promo_rate: vehicle.promo_rate || 0,
//       promo_start_date: vehicle.promo_start_date || '',
//       promo_end_date: vehicle.promo_end_date || '',
//       vin_number: vehicle.vin_number || '',
//       license_plate: vehicle.license_plate || '',
//       current_mileage: vehicle.current_mileage || 0,
//       rental_rate: vehicle.rental_rate || 0,
//       status: vehicle.status || 'Available',
//       vehicle_id: vehicle.vehicle_id,
//       vehicleSpec_id: vehicle.vehicleSpec_id
//     });
    
//     setIsEditModalOpen(true);
//   };

//   const handleEditSave = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!currentEditingVehicle) return;
    
//     try {
//       // Update both spec and vehicle at once
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
//         features: formData.features ? JSON.stringify(formData.features.split(',').map(s => s.trim())) : undefined,
//         images: formData.image_url ? JSON.stringify([formData.image_url]) : undefined,
//         on_promo: formData.on_promo,
//         promo_rate: formData.promo_rate || undefined,
//         promo_start_date: formData.promo_start_date || undefined,
//         promo_end_date: formData.promo_end_date || undefined
//       };
      
//       const vehiclePayload = {
//         vin_number: formData.vin_number,
//         license_plate: formData.license_plate,
//         current_mileage: formData.current_mileage,
//         rental_rate: formData.rental_rate,
//         status: formData.status
//       };
      
//       // Update spec
//       await updateVehicleSpec({ 
//         id: currentEditingVehicle.vehicleSpec_id, 
//         data: specPayload 
//       }).unwrap();
      
//       // Update vehicle
//       await updateVehicle({ 
//         id: currentEditingVehicle.vehicle_id, 
//         data: vehiclePayload 
//       }).unwrap();
      
//       toast.success("Vehicle updated successfully!");
      
//       setIsEditModalOpen(false);
//       refetchVehicles();
//       resetForm();
//     } catch (err: any) {
//       console.error("Update failed:", err);
//       toast.error(err.data?.message || "Failed to update");
//     }
//   };

//   // Delete function
//   const handleDeleteVehicle = async (id: number) => {
//     if (window.confirm("Are you sure you want to delete this vehicle? This action cannot be undone.")) {
//       try {
//         await deleteVehicle(id).unwrap();
//         toast.success("Vehicle deleted successfully");
//         refetchVehicles();
//       } catch (err: any) {
//         console.error("Delete failed:", err);
//         if (err.data?.message?.includes("foreign key constraint")) {
//           toast.error("Cannot delete vehicle because it has related records. Please delete bookings first.");
//         } else {
//           toast.error(err.data?.message || "Failed to delete vehicle");
//         }
//       }
//     }
//   };

//   const resetForm = () => {
//     setFormData(initialFormState);
//     setCreatedSpecData(null);
//     setSelectedExistingSpecId(null);
//     setUseExistingSpec(false);
//     setCurrentStep('select');
//     setCurrentEditingVehicle(null);
//   };

//   // Filter vehicles
//   const filteredVehicles = vehicles?.filter(v => 
//     v.model?.toLowerCase().includes(searchTerm.toLowerCase()) || 
//     v.manufacturer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     v.license_plate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     v.vin_number?.toLowerCase().includes(searchTerm.toLowerCase())
//   ) || [];

//   if (isLoading) return (
//     <div className="flex h-64 items-center justify-center">
//       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#027480]"></div>
//     </div>
//   );

//   return (
//     <div className="space-y-6 p-4 min-h-screen bg-[#001524]">
//       {/* HEADER & ACTIONS */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//         <div>
//           <h1 className="text-3xl font-bold text-white">Fleet Management</h1>
//           <p className="text-[#C4AD9D]">Manage specifications and fleet inventory.</p>
//         </div>
        
//         <div className="flex gap-3 w-full md:w-auto">
//           <div className="relative flex-1 md:w-64">
//             <Search className="absolute left-3 top-3 text-gray-400" size={18} />
//             <input 
//               type="text" 
//               placeholder="Search by model, plate, or VIN..." 
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10 pr-4 py-2 w-full bg-[#0f2434] border border-[#445048] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#027480]"
//             />
//           </div>
//           <button 
//             onClick={() => {
//               resetForm();
//               setIsModalOpen(true);
//             }}
//             className="bg-[#027480] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#025e69] transition-colors shadow-lg font-semibold"
//           >
//             <Plus size={20} /> Add Vehicle
//           </button>
//         </div>
//       </div>

//       {/* ERROR STATE */}
//       {error && (
//         <div className="bg-red-900/20 border border-red-700 text-red-300 px-4 py-3 rounded-lg flex items-center gap-2">
//           <AlertCircle size={20} />
//           <span>Error loading vehicles. Please check connection.</span>
//         </div>
//       )}

//       {/* VEHICLES TABLE - DARK THEME */}
//       <div className="bg-[#0f2434] rounded-xl shadow-lg border border-[#445048] overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left">
//             <thead className="bg-[#001524] text-white">
//               <tr>
//                 <th className="p-4 font-semibold">Vehicle</th>
//                 <th className="p-4 font-semibold">Details</th>
//                 <th className="p-4 font-semibold">Inventory</th>
//                 <th className="p-4 font-semibold">Status & Price</th>
//                 <th className="p-4 font-semibold text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-[#445048]">
//               {filteredVehicles?.map((v) => {
//                 const images = parseImages(v.images || '');
                
//                 return (
//                   <tr key={v.vehicle_id} className="hover:bg-[#1a3247] transition-colors text-white">
//                     <td className="p-4">
//                       <div className="flex items-center gap-3">
//                         <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-700 flex items-center justify-center">
//                           {images[0] ? (
//                             <img 
//                               src={images[0]} 
//                               alt={`${v.manufacturer} ${v.model}`}
//                               className="w-full h-full object-cover"
//                               onError={(e) => {
//                                 (e.target as HTMLImageElement).style.display = 'none';
//                                 (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
//                               }}
//                             />
//                           ) : null}
//                           <div className={`${images[0] ? 'hidden' : ''} w-full h-full flex items-center justify-center bg-gray-800`}>
//                             <Car size={24} className="text-gray-400"/>
//                           </div>
//                         </div>
//                         <div>
//                           <div className="font-bold text-white">{v.manufacturer} {v.model}</div>
//                           <div className="text-sm text-[#C4AD9D]">{v.year}</div>
//                           <div className="text-xs text-gray-400">Type: {v.vehicle_type || 'Sedan'}</div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="p-4">
//                       <div className="space-y-2">
//                         <div className="flex items-center gap-2 text-sm">
//                           <Users size={14} className="text-[#027480]" />
//                           <span>{v.seating_capacity} Seats</span>
//                         </div>
//                         <div className="flex items-center gap-2 text-sm">
//                           <Fuel size={14} className="text-[#027480]" />
//                           <span>{v.fuel_type}</span>
//                         </div>
//                         <div className="flex items-center gap-2 text-sm">
//                           <Cog size={14} className="text-[#027480]" />
//                           <span>{v.transmission}</span>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="p-4">
//                       <div className="space-y-2">
//                         <div className="font-mono text-sm bg-[#001524] px-3 py-2 rounded-lg">
//                           {v.license_plate}
//                         </div>
//                         <div className="flex items-center gap-2 text-sm">
//                           <Gauge size={14} className="text-[#F57251]" />
//                           <span>{v.current_mileage?.toLocaleString()} km</span>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="p-4">
//                       <div className="space-y-3">
//                         <div className="flex items-center justify-between">
//                           <div className="text-lg font-bold text-[#027480]">
//                             ${v.rental_rate}/day
//                           </div>
//                           <div className="flex items-center gap-2">
//                             <button
//                               onClick={async () => {
//                                 try {
//                                   await updateVehicleSpec({ 
//                                     id: v.vehicleSpec_id, 
//                                     data: { on_promo: !v.on_promo } 
//                                   }).unwrap();
//                                   refetchVehicles();
//                                   toast.success(`Promotion ${v.on_promo ? 'disabled' : 'enabled'}`);
//                                 } catch (err) {
//                                   toast.error("Failed to update promotion status");
//                                 }
//                               }}
//                               className={`p-1 rounded-full transition-colors ${v.on_promo ? 'bg-green-500' : 'bg-gray-600'}`}
//                             >
//                               {v.on_promo ? (
//                                 <ToggleRight size={20} className="text-white" />
//                               ) : (
//                                 <ToggleLeft size={20} className="text-gray-300" />
//                               )}
//                             </button>
//                             {v.on_promo && v.promo_rate && (
//                               <span className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded">
//                                 -{v.promo_rate}%
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                         <div>
//                           <span className={`px-3 py-1 rounded-full text-xs font-bold ${
//                             v.status === 'Available' ? 'bg-green-900/30 text-green-400 border border-green-900' :
//                             v.status === 'Rented' ? 'bg-blue-900/30 text-blue-400 border border-blue-900' :
//                             v.status === 'Maintenance' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-900' :
//                             'bg-red-900/30 text-red-400 border border-red-900'
//                           }`}>
//                             {v.status}
//                           </span>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="p-4">
//                       <div className="flex justify-end gap-2">
//                         <button 
//                           onClick={() => handleEditClick(v)}
//                           className="p-2 bg-[#027480] text-white hover:bg-[#025e69] rounded-lg transition-colors"
//                           title="Edit"
//                         >
//                           <Edit size={18} />
//                         </button>
//                         <button 
//                           onClick={() => handleDeleteVehicle(v.vehicle_id)}
//                           className="p-2 bg-red-900/30 text-red-400 hover:bg-red-900/50 rounded-lg transition-colors border border-red-900"
//                           title="Delete"
//                         >
//                           <Trash2 size={18} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 );
//               })}
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

//       {/* ADD VEHICLE MODAL */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-[#0f2434] rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-[#445048]">
//             {/* Modal Header */}
//             <div className="bg-[#001524] p-6 flex justify-between items-center text-[#E9E6DD]">
//               <div>
//                 <h2 className="text-2xl font-bold">Add New Vehicle</h2>
//                 <p className="text-[#C4AD9D] text-sm">
//                   {currentStep === 'select' && 'Choose how to add vehicle'}
//                   {currentStep === 'specs' && 'Step 1: Vehicle Specifications'}
//                   {currentStep === 'inventory' && 'Step 2: Inventory Details'}
//                 </p>
//               </div>
//               <button 
//                 onClick={() => setIsModalOpen(false)}
//                 className="text-[#C4AD9D] hover:text-white text-2xl p-2 rounded-full hover:bg-white/10"
//               >
//                 <X size={24} />
//               </button>
//             </div>

//             {/* Modal Body */}
//             <div className="p-6 overflow-y-auto">
//               {/* STEP 1: SELECT METHOD */}
//               {currentStep === 'select' && (
//                 <div className="space-y-6 animate-in fade-in">
//                   <div className="bg-[#001524] p-6 rounded-xl border border-[#445048]">
//                     <h3 className="text-xl font-bold text-white mb-4">Choose Creation Method</h3>
//                     <div className="space-y-4">
//                       <button
//                         onClick={() => {
//                           setUseExistingSpec(true);
//                           setCurrentStep('specs');
//                         }}
//                         className="w-full p-6 bg-[#1a3247] hover:bg-[#2a4267] border-2 border-[#445048] rounded-xl text-left transition-all group"
//                       >
//                         <div className="flex items-center gap-4">
//                           <div className="w-12 h-12 rounded-lg bg-[#027480] flex items-center justify-center">
//                             <Car className="text-white" size={24} />
//                           </div>
//                           <div>
//                             <h4 className="font-bold text-white text-lg">Use Existing Specification</h4>
//                             <p className="text-[#C4AD9D] text-sm mt-1">
//                               Select from existing vehicle specifications.
//                             </p>
//                           </div>
//                         </div>
//                       </button>

//                       <button
//                         onClick={() => {
//                           setUseExistingSpec(false);
//                           setCurrentStep('specs');
//                         }}
//                         className="w-full p-6 bg-[#1a3247] hover:bg-[#2a4267] border-2 border-[#445048] rounded-xl text-left transition-all group"
//                       >
//                         <div className="flex items-center gap-4">
//                           <div className="w-12 h-12 rounded-lg bg-[#F57251] flex items-center justify-center">
//                             <Plus className="text-white" size={24} />
//                           </div>
//                           <div>
//                             <h4 className="font-bold text-white text-lg">Create New Specification</h4>
//                             <p className="text-[#C4AD9D] text-sm mt-1">
//                               Create a new vehicle specification with custom details.
//                             </p>
//                           </div>
//                         </div>
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* STEP 2: SPECIFICATIONS */}
//               {currentStep === 'specs' && (
//                 <form onSubmit={handleCreateSpecStep} className="space-y-6">
//                   {useExistingSpec && (
//                     <div className="bg-[#001524] p-4 rounded-lg border border-[#027480]/30">
//                       <label className="text-sm font-bold text-[#027480] mb-2 block">Select Existing Specification</label>
//                       <select
//                         value={selectedExistingSpecId || ''}
//                         onChange={(e) => handleExistingSpecSelect(Number(e.target.value))}
//                         className="w-full bg-[#0f2434] border border-[#445048] text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#027480]"
//                       >
//                         <option value="">-- Select a specification --</option>
//                         {allSpecs?.map((spec) => (
//                           <option key={spec.vehicleSpec_id} value={spec.vehicleSpec_id}>
//                             {spec.manufacturer} {spec.model} ({spec.year}) - {spec.vehicle_type}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   )}

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="space-y-1">
//                       <label className="text-xs font-bold text-[#C4AD9D] uppercase">Manufacturer *</label>
//                       <input
//                         required
//                         className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
//                         value={formData.manufacturer}
//                         onChange={e => setFormData({...formData, manufacturer: e.target.value})}
//                         placeholder="e.g. Toyota"
//                       />
//                     </div>
                    
//                     <div className="space-y-1">
//                       <label className="text-xs font-bold text-[#C4AD9D] uppercase">Model *</label>
//                       <input
//                         required
//                         className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
//                         value={formData.model}
//                         onChange={e => setFormData({...formData, model: e.target.value})}
//                         placeholder="e.g. Camry"
//                       />
//                     </div>

//                     <div className="space-y-1">
//                       <label className="text-xs font-bold text-[#C4AD9D] uppercase">Type</label>
//                       <select
//                         className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
//                         value={formData.vehicle_type}
//                         onChange={e => setFormData({...formData, vehicle_type: e.target.value})}
//                       >
//                         <option value="Sedan">Sedan</option>
//                         <option value="SUV">SUV</option>
//                         <option value="Truck">Truck</option>
//                         <option value="Van">Van</option>
//                         <option value="Hatchback">Hatchback</option>
//                         <option value="Coupe">Coupe</option>
//                       </select>
//                     </div>

//                     <div className="space-y-1">
//                       <label className="text-xs font-bold text-[#C4AD9D] uppercase">Year</label>
//                       <input
//                         type="number"
//                         required
//                         className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
//                         value={formData.year}
//                         onChange={e => setFormData({...formData, year: parseInt(e.target.value)})}
//                       />
//                     </div>

//                     <div className="space-y-1">
//                       <label className="text-xs font-bold text-[#C4AD9D] uppercase">Fuel Type</label>
//                       <select
//                         className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
//                         value={formData.fuel_type}
//                         onChange={e => setFormData({...formData, fuel_type: e.target.value})}
//                       >
//                         <option value="Petrol">Petrol</option>
//                         <option value="Diesel">Diesel</option>
//                         <option value="Electric">Electric</option>
//                         <option value="Hybrid">Hybrid</option>
//                       </select>
//                     </div>

//                     <div className="space-y-1">
//                       <label className="text-xs font-bold text-[#C4AD9D] uppercase">Transmission</label>
//                       <select
//                         className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
//                         value={formData.transmission}
//                         onChange={e => setFormData({...formData, transmission: e.target.value})}
//                       >
//                         <option value="Automatic">Automatic</option>
//                         <option value="Manual">Manual</option>
//                       </select>
//                     </div>

//                     <div className="space-y-1">
//                       <label className="text-xs font-bold text-[#C4AD9D] uppercase">Engine Capacity</label>
//                       <select
//                         className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
//                         value={formData.engine_capacity}
//                         onChange={e => setFormData({...formData, engine_capacity: e.target.value})}
//                       >
//                         <option value="1.0L">1.0L</option>
//                         <option value="1.5L">1.5L</option>
//                         <option value="2.0L">2.0L</option>
//                         <option value="2.5L">2.5L</option>
//                         <option value="3.0L">3.0L</option>
//                         <option value="3.5L">3.5L</option>
//                       </select>
//                     </div>

//                     <div className="space-y-1">
//                       <label className="text-xs font-bold text-[#C4AD9D] uppercase">Seats</label>
//                       <select
//                         className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
//                         value={formData.seating_capacity}
//                         onChange={e => setFormData({...formData, seating_capacity: parseInt(e.target.value)})}
//                       >
//                         {[2, 4, 5, 7, 8].map(num => (
//                           <option key={num} value={num}>{num} Seats</option>
//                         ))}
//                       </select>
//                     </div>

//                     <div className="md:col-span-2 space-y-1">
//                       <label className="text-xs font-bold text-[#C4AD9D] uppercase">Features</label>
//                       <input
//                         className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
//                         value={formData.features}
//                         onChange={e => setFormData({...formData, features: e.target.value})}
//                         placeholder="GPS, Bluetooth, Sunroof"
//                       />
//                     </div>

//                     <div className="md:col-span-2 space-y-1">
//                       <label className="text-xs font-bold text-[#C4AD9D] uppercase">Image URL</label>
//                       <input
//                         className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
//                         value={formData.image_url}
//                         onChange={e => setFormData({...formData, image_url: e.target.value})}
//                         placeholder="https://example.com/image.jpg"
//                       />
//                     </div>

//                     {/* Promotion Section */}
//                     <div className="md:col-span-2 border-t border-[#445048] pt-4 mt-4">
//                       <div className="flex items-center justify-between mb-4">
//                         <h4 className="font-bold text-white">Promotion Settings</h4>
//                         <div className="flex items-center gap-2">
//                           <label className="flex items-center gap-2 text-sm text-[#C4AD9D]">
//                             <input
//                               type="checkbox"
//                               checked={formData.on_promo}
//                               onChange={e => setFormData({...formData, on_promo: e.target.checked})}
//                               className="rounded"
//                             />
//                             Enable Promotion
//                           </label>
//                         </div>
//                       </div>
                      
//                       {formData.on_promo && (
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                           <div className="space-y-1">
//                             <label className="text-xs font-bold text-[#C4AD9D] uppercase">Discount Rate (%)</label>
//                             <input
//                               type="number"
//                               min="0"
//                               max="100"
//                               className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
//                               value={formData.promo_rate}
//                               onChange={e => setFormData({...formData, promo_rate: parseFloat(e.target.value)})}
//                               placeholder="e.g., 15"
//                             />
//                           </div>
//                           <div className="space-y-1">
//                             <label className="text-xs font-bold text-[#C4AD9D] uppercase">Start Date</label>
//                             <input
//                               type="date"
//                               className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
//                               value={formData.promo_start_date}
//                               onChange={e => setFormData({...formData, promo_start_date: e.target.value})}
//                             />
//                           </div>
//                           <div className="space-y-1">
//                             <label className="text-xs font-bold text-[#C4AD9D] uppercase">End Date</label>
//                             <input
//                               type="date"
//                               className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
//                               value={formData.promo_end_date}
//                               onChange={e => setFormData({...formData, promo_end_date: e.target.value})}
//                             />
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   <div className="flex justify-between pt-4 border-t border-[#445048]">
//                     <button
//                       type="button"
//                       onClick={() => setCurrentStep('select')}
//                       className="px-6 py-2 border border-[#445048] text-[#C4AD9D] hover:text-white rounded-lg hover:border-white/30 transition-colors"
//                     >
//                       Back
//                     </button>
//                     <button
//                       type="submit"
//                       className="bg-[#027480] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#025e69] transition-colors flex items-center gap-2"
//                     >
//                       {useExistingSpec ? 'Use This Spec' : 'Create Specification'} <ArrowRight size={16} />
//                     </button>
//                   </div>
//                 </form>
//               )}

//               {/* STEP 3: INVENTORY */}
//               {currentStep === 'inventory' && (
//                 <form onSubmit={handleCreateInventoryStep} className="space-y-6">
//                   {createdSpecData && (
//                     <div className="bg-[#001524] border border-[#027480]/30 p-4 rounded-lg">
//                       <div className="flex items-center gap-2 text-[#027480] mb-1">
//                         <CheckCircle2 size={18} />
//                         <span className="font-bold text-xs uppercase tracking-wide">Specification Ready</span>
//                       </div>
//                       <p className="font-bold text-xl text-white">
//                         {createdSpecData.name}
//                       </p>
//                     </div>
//                   )}

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="space-y-1">
//                       <label className="text-xs font-bold text-[#C4AD9D] uppercase">VIN Number *</label>
//                       <input
//                         required
//                         className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
//                         value={formData.vin_number}
//                         onChange={e => setFormData({...formData, vin_number: e.target.value})}
//                         placeholder="e.g. 1HGCM82633A123456"
//                       />
//                     </div>

//                     <div className="space-y-1">
//                       <label className="text-xs font-bold text-[#C4AD9D] uppercase">License Plate *</label>
//                       <input
//                         required
//                         className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
//                         value={formData.license_plate}
//                         onChange={e => setFormData({...formData, license_plate: e.target.value})}
//                         placeholder="e.g. KDT 132R"
//                       />
//                     </div>

//                     <div className="space-y-1">
//                       <label className="text-xs font-bold text-[#C4AD9D] uppercase">Current Mileage</label>
//                       <input
//                         type="number"
//                         required
//                         className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
//                         value={formData.current_mileage}
//                         onChange={e => setFormData({...formData, current_mileage: parseInt(e.target.value)})}
//                         min="0"
//                       />
//                     </div>

//                     <div className="space-y-1">
//                       <label className="text-xs font-bold text-[#C4AD9D] uppercase">Daily Rate ($)</label>
//                       <input
//                         type="number"
//                         required
//                         className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
//                         value={formData.rental_rate}
//                         onChange={e => setFormData({...formData, rental_rate: parseFloat(e.target.value)})}
//                         min="0"
//                         step="0.01"
//                       />
//                     </div>

//                     <div className="space-y-1">
//                       <label className="text-xs font-bold text-[#C4AD9D] uppercase">Availability</label>
//                       <select
//                         className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
//                         value={formData.status}
//                         onChange={e => setFormData({...formData, status: e.target.value as VehicleStatus})}
//                       >
//                         <option value="Available">Available</option>
//                         <option value="Rented">Rented</option>
//                         <option value="Maintenance">Maintenance</option>
//                         <option value="Unavailable">Unavailable</option>
//                       </select>
//                     </div>
//                   </div>

//                   <div className="flex justify-between pt-4 border-t border-[#445048]">
//                     <button
//                       type="button"
//                       onClick={() => setCurrentStep('specs')}
//                       className="px-6 py-2 border border-[#445048] text-[#C4AD9D] hover:text-white rounded-lg hover:border-white/30 transition-colors flex items-center gap-2"
//                     >
//                       <ArrowLeft size={16} /> Back to Specs
//                     </button>
//                     <button
//                       type="submit"
//                       className="bg-[#F57251] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#d65f41] transition-colors"
//                     >
//                       Finish & Save Vehicle
//                     </button>
//                   </div>
//                 </form>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* EDIT MODAL */}
//       {isEditModalOpen && currentEditingVehicle && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-[#0f2434] rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-[#445048]">
//             <div className="bg-[#001524] p-6 flex justify-between items-center text-[#E9E6DD]">
//               <div>
//                 <h2 className="text-2xl font-bold">Edit Vehicle</h2>
//                 <p className="text-[#C4AD9D] text-sm">
//                   {currentEditingVehicle.manufacturer} {currentEditingVehicle.model}
//                 </p>
//               </div>
//               <button 
//                 onClick={() => setIsEditModalOpen(false)}
//                 className="text-[#C4AD9D] hover:text-white text-2xl p-2 rounded-full hover:bg-white/10"
//               >
//                 <X size={24} />
//               </button>
//             </div>

//             <div className="p-6 overflow-y-auto">
//               <form onSubmit={handleEditSave} className="space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {/* Basic Info */}
//                   <div className="space-y-1">
//                     <label className="text-xs font-bold text-[#C4AD9D] uppercase">Manufacturer *</label>
//                     <input
//                       required
//                       className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
//                       value={formData.manufacturer}
//                       onChange={e => setFormData({...formData, manufacturer: e.target.value})}
//                     />
//                   </div>
                  
//                   <div className="space-y-1">
//                     <label className="text-xs font-bold text-[#C4AD9D] uppercase">Model *</label>
//                     <input
//                       required
//                       className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
//                       value={formData.model}
//                       onChange={e => setFormData({...formData, model: e.target.value})}
//                     />
//                   </div>

//                   <div className="space-y-1">
//                     <label className="text-xs font-bold text-[#C4AD9D] uppercase">Type</label>
//                     <select
//                       className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
//                       value={formData.vehicle_type}
//                       onChange={e => setFormData({...formData, vehicle_type: e.target.value})}
//                     >
//                       <option value="Sedan">Sedan</option>
//                       <option value="SUV">SUV</option>
//                       <option value="Truck">Truck</option>
//                       <option value="Van">Van</option>
//                       <option value="Hatchback">Hatchback</option>
//                       <option value="Coupe">Coupe</option>
//                     </select>
//                   </div>

//                   <div className="space-y-1">
//                     <label className="text-xs font-bold text-[#C4AD9D] uppercase">Year</label>
//                     <input
//                       type="number"
//                       required
//                       className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
//                       value={formData.year}
//                       onChange={e => setFormData({...formData, year: parseInt(e.target.value)})}
//                     />
//                   </div>

//                   <div className="space-y-1">
//                     <label className="text-xs font-bold text-[#C4AD9D] uppercase">Fuel Type</label>
//                     <select
//                       className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
//                       value={formData.fuel_type}
//                       onChange={e => setFormData({...formData, fuel_type: e.target.value})}
//                     >
//                       <option value="Petrol">Petrol</option>
//                       <option value="Diesel">Diesel</option>
//                       <option value="Electric">Electric</option>
//                       <option value="Hybrid">Hybrid</option>
//                     </select>
//                   </div>

//                   <div className="space-y-1">
//                     <label className="text-xs font-bold text-[#C4AD9D] uppercase">Transmission</label>
//                     <select
//                       className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
//                       value={formData.transmission}
//                       onChange={e => setFormData({...formData, transmission: e.target.value})}
//                     >
//                       <option value="Automatic">Automatic</option>
//                       <option value="Manual">Manual</option>
//                     </select>
//                   </div>

//                   <div className="space-y-1">
//                     <label className="text-xs font-bold text-[#C4AD9D] uppercase">Engine Capacity</label>
//                     <select
//                       className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
//                       value={formData.engine_capacity}
//                       onChange={e => setFormData({...formData, engine_capacity: e.target.value})}
//                     >
//                       <option value="1.0L">1.0L</option>
//                       <option value="1.5L">1.5L</option>
//                       <option value="2.0L">2.0L</option>
//                       <option value="2.5L">2.5L</option>
//                       <option value="3.0L">3.0L</option>
//                       <option value="3.5L">3.5L</option>
//                     </select>
//                   </div>

//                   <div className="space-y-1">
//                     <label className="text-xs font-bold text-[#C4AD9D] uppercase">Seats</label>
//                     <select
//                       className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
//                       value={formData.seating_capacity}
//                       onChange={e => setFormData({...formData, seating_capacity: parseInt(e.target.value)})}
//                     >
//                       {[2, 4, 5, 7, 8].map(num => (
//                         <option key={num} value={num}>{num} Seats</option>
//                       ))}
//                     </select>
//                   </div>

//                   <div className="md:col-span-2 space-y-1">
//                     <label className="text-xs font-bold text-[#C4AD9D] uppercase">Features</label>
//                     <input
//                       className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
//                       value={formData.features}
//                       onChange={e => setFormData({...formData, features: e.target.value})}
//                       placeholder="Comma separated features"
//                     />
//                   </div>

//                   <div className="space-y-1">
//                     <label className="text-xs font-bold text-[#C4AD9D] uppercase">Color</label>
//                     <input
//                       className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
//                       value={formData.color}
//                       onChange={e => setFormData({...formData, color: e.target.value})}
//                     />
//                   </div>

//                   <div className="space-y-1">
//                     <label className="text-xs font-bold text-[#C4AD9D] uppercase">Image URL</label>
//                     <input
//                       className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
//                       value={formData.image_url}
//                       onChange={e => setFormData({...formData, image_url: e.target.value})}
//                     />
//                   </div>

//                   {/* Vehicle Inventory Fields */}
//                   <div className="md:col-span-2 border-t border-[#445048] pt-4 mt-2">
//                     <h4 className="font-bold text-white mb-4">Vehicle Inventory</h4>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div className="space-y-1">
//                         <label className="text-xs font-bold text-[#C4AD9D] uppercase">VIN Number</label>
//                         <input
//                           required
//                           className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
//                           value={formData.vin_number}
//                           onChange={e => setFormData({...formData, vin_number: e.target.value})}
//                         />
//                       </div>
//                       <div className="space-y-1">
//                         <label className="text-xs font-bold text-[#C4AD9D] uppercase">License Plate</label>
//                         <input
//                           required
//                           className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
//                           value={formData.license_plate}
//                           onChange={e => setFormData({...formData, license_plate: e.target.value})}
//                         />
//                       </div>
//                       <div className="space-y-1">
//                         <label className="text-xs font-bold text-[#C4AD9D] uppercase">Mileage</label>
//                         <input
//                           type="number"
//                           required
//                           className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
//                           value={formData.current_mileage}
//                           onChange={e => setFormData({...formData, current_mileage: parseInt(e.target.value)})}
//                         />
//                       </div>
//                       <div className="space-y-1">
//                         <label className="text-xs font-bold text-[#C4AD9D] uppercase">Daily Rate ($)</label>
//                         <input
//                           type="number"
//                           required
//                           className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
//                           value={formData.rental_rate}
//                           onChange={e => setFormData({...formData, rental_rate: parseFloat(e.target.value)})}
//                         />
//                       </div>
//                       <div className="space-y-1">
//                         <label className="text-xs font-bold text-[#C4AD9D] uppercase">Availability</label>
//                         <select
//                           className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
//                           value={formData.status}
//                           onChange={e => setFormData({...formData, status: e.target.value as VehicleStatus})}
//                         >
//                           <option value="Available">Available</option>
//                           <option value="Rented">Rented</option>
//                           <option value="Maintenance">Maintenance</option>
//                           <option value="Unavailable">Unavailable</option>
//                         </select>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Promotion Section */}
//                   <div className="md:col-span-2 border-t border-[#445048] pt-4 mt-2">
//                     <div className="flex items-center justify-between mb-4">
//                       <h4 className="font-bold text-white">Promotion Settings</h4>
//                       <div className="flex items-center gap-2">
//                         <label className="flex items-center gap-2 text-sm text-[#C4AD9D]">
//                           <input
//                             type="checkbox"
//                             checked={formData.on_promo}
//                             onChange={e => setFormData({...formData, on_promo: e.target.checked})}
//                             className="rounded"
//                           />
//                           Enable Promotion
//                         </label>
//                       </div>
//                     </div>
                    
//                     {formData.on_promo && (
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div className="space-y-1">
//                           <label className="text-xs font-bold text-[#C4AD9D] uppercase">Discount Rate (%)</label>
//                           <input
//                             type="number"
//                             min="0"
//                             max="100"
//                             className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
//                             value={formData.promo_rate}
//                             onChange={e => setFormData({...formData, promo_rate: parseFloat(e.target.value)})}
//                           />
//                         </div>
//                         <div className="space-y-1">
//                           <label className="text-xs font-bold text-[#C4AD9D] uppercase">Start Date</label>
//                           <input
//                             type="date"
//                             className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
//                             value={formData.promo_start_date}
//                             onChange={e => setFormData({...formData, promo_start_date: e.target.value})}
//                           />
//                         </div>
//                         <div className="space-y-1">
//                           <label className="text-xs font-bold text-[#C4AD9D] uppercase">End Date</label>
//                           <input
//                             type="date"
//                             className="w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg"
//                             value={formData.promo_end_date}
//                             onChange={e => setFormData({...formData, promo_end_date: e.target.value})}
//                           />
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 <div className="flex justify-end gap-3 pt-4 border-t border-[#445048]">
//                   <button
//                     type="button"
//                     onClick={() => setIsEditModalOpen(false)}
//                     className="px-6 py-2 border border-[#445048] text-[#C4AD9D] hover:text-white rounded-lg transition-colors"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="bg-[#027480] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#025e69] transition-colors flex items-center gap-2"
//                   >
//                     <Save size={18} /> Save Changes
//                   </button>
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



// // import React, { useState } from 'react';
// // import { Plus, Edit, Trash2, Search, Car, AlertCircle, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
// // import { 
// //   useGetVehiclesQuery, 
// //   useCreateVehicleSpecMutation, 
// //   useAddVehicleMutation, 
// //   useDeleteVehicleMutation 
// // } from '../../features/api/VehicleAPI';
// // import { toast } from 'sonner';

// // const FleetManagement: React.FC = () => {
// //   // Queries
// //   const { data: vehicles, isLoading, error } = useGetVehiclesQuery({}); 
  
// //   // Mutations
// //   const [createSpec, { isLoading: isCreatingSpec }] = useCreateVehicleSpecMutation();
// //   const [createVehicle, { isLoading: isCreatingVehicle }] = useAddVehicleMutation();
// //   const [deleteVehicle] = useDeleteVehicleMutation();

// //   // UI State
// //   const [isModalOpen, setIsModalOpen] = useState(false);
// //   const [step, setStep] = useState(1); 
// //   const [searchTerm, setSearchTerm] = useState('');

// //   // DATA State
// //   // We need to store the created Spec ID and Details to show them in Step 2
// //   const [createdSpecData, setCreatedSpecData] = useState<{id: number, name: string} | null>(null);

// //   const initialFormState = {
// //     // SPECS
// //     manufacturer: '', model: '', year: new Date().getFullYear(),
// //     fuel_type: 'Petrol', engine_capacity: '1.5L', transmission: 'Automatic',
// //     seating_capacity: 5, color: 'White', features: '', vehicle_type: 'Sedan', image_url: '',
    
// //     // INVENTORY
// //     vin_number: '', license_plate: '', current_mileage: 0, rental_rate: 0, status: 'Available'
// //   };

// //   const [formData, setFormData] = useState(initialFormState);



// // // --- LOGIC: STEP 1 (Create Spec) ---
// //   const handleCreateSpecStep = async (e: React.FormEvent) => {
// //     e.preventDefault(); // Prevent form reload

// //     // 1. Basic Validation
// //     if (!formData.manufacturer || !formData.model) {
// //       toast.error("Please fill in Manufacturer and Model");
// //       return;
// //     }

// //     try {
// //       // 2. Prepare Spec Payload
// //       const specPayload = {
// //         manufacturer: formData.manufacturer,
// //         model: formData.model,
// //         year: formData.year,
// //         fuel_type: formData.fuel_type,
// //         engine_capacity: formData.engine_capacity,
// //         transmission: formData.transmission,
// //         seating_capacity: formData.seating_capacity,
// //         color: formData.color,
// //         vehicle_type: formData.vehicle_type,
// //         features: JSON.stringify(formData.features.split(',').map(s => s.trim())), 
// //         images: JSON.stringify([formData.image_url]), 
// //         on_promo: false,
// //         review_count: 0
// //       };

// //       console.log("Submitting Spec...", specPayload);
      
// //       // 3. CALL API
// //       const response = await createSpec(specPayload).unwrap();
      
// //       console.log("Backend Response:", response);

// //       // 4. EXTRACT ID (Based on your log: { message: "...", data: { vehicleSpec_id: 1011 } })
// //       // We explicitly check for the 'data' property because your backend wraps the result
// //       const createdSpec = (response as any).data || response;
// //       const newSpecId = createdSpec.vehicleSpec_id;

// //       if (newSpecId) {
// //         console.log("✅ Spec Created with ID:", newSpecId);
        
// //         // 5. Update State for Step 2
// //         setCreatedSpecData({
// //           id: newSpecId,
// //           name: `${createdSpec.manufacturer} ${createdSpec.model} (${createdSpec.year})`
// //         });
        
// //         // 6. Move to Inventory Step
// //         toast.success("Specification Created! Proceeding to Inventory.");
// //         setStep(2); 
// //       } else {
// //         console.error("❌ ID Missing in response data:", createdSpec);
// //         toast.error("Spec created, but ID was missing. Check console.");
// //       }

// //     } catch (err: any) {
// //       console.error("Spec Creation Error:", err);
// //       toast.error(err.data?.message || "Failed to create specification");
// //     }
// //   };
// //   // // --- LOGIC: STEP 1 (Create Spec) ---
// //   // const handleCreateSpecStep = async (e: React.FormEvent) => {
// //   //   e.preventDefault(); // Prevent form reload

// //   //   // Basic Validation
// //   //   if (!formData.manufacturer || !formData.model) {
// //   //     toast.error("Please fill in Manufacturer and Model");
// //   //     return;
// //   //   }

// //   //   try {
// //   //     // 1. Prepare Spec Payload
// //   //     const specPayload = {
// //   //       manufacturer: formData.manufacturer,
// //   //       model: formData.model,
// //   //       year: formData.year,
// //   //       fuel_type: formData.fuel_type,
// //   //       engine_capacity: formData.engine_capacity,
// //   //       transmission: formData.transmission,
// //   //       seating_capacity: formData.seating_capacity,
// //   //       color: formData.color,
// //   //       vehicle_type: formData.vehicle_type,
// //   //       features: JSON.stringify(formData.features.split(',').map(s => s.trim())), 
// //   //       images: JSON.stringify([formData.image_url]), 
// //   //       on_promo: false,
// //   //       review_count: 0
// //   //     };

// //   //     console.log("Creating vehicle spec...", specPayload);
      
// //   //     // 2. CALL API (Create Spec)
// //   //     const result = await createSpec(specPayload).unwrap();

// //   //           // DEBUG: Look at this log in your browser console to see exactly what the server sent back
// //   //     console.log("Backend Response (Result):", result);

// //   //     // We check response.data.vehicleSpec_id first, then fallback to response.vehicleSpec_id
// //   //     const createdSpec = (response as any).data || response;
// //   //     const newSpecId = createdSpec.vehicleSpec_id;
      
      
// //   //     // 3. Handle Success
// //   //     if (result && result.vehicleSpec_id) {
// //   //       // Save the ID and Name for Step 2
// //   //       setCreatedSpecData({
// //   //         id: result.vehicleSpec_id,
// //   //         name: `${result.manufacturer} ${result.model} (${result.year})`
// //   //       });
        
// //   //       toast.success("Specification Created! Proceeding to Inventory details.");
// //   //       setStep(2); // MOVE TO NEXT STEP
// //   //     }

// //   //   } catch (err: any) {
// //   //     console.error("Spec Creation Failed", err);
// //   //     toast.error(err.data?.message || "Failed to create vehicle specifications");
// //   //   }
// //   // };

// //   // --- LOGIC: STEP 2 (Create Inventory) ---
// //   const handleCreateInventoryStep = async (e: React.FormEvent) => {
// //     e.preventDefault();

// //     if (!createdSpecData?.id) {
// //       toast.error("Error: Specification ID not found. Please go back.");
// //       return;
// //     }

// //     try {
// //       // 1. Prepare Vehicle Payload
// //       const vehiclePayload = {
// //         vehicleSpec_id: createdSpecData.id, // LINKING TO THE ID FROM STEP 1
// //         vin_number: formData.vin_number,
// //         license_plate: formData.license_plate,
// //         current_mileage: formData.current_mileage,
// //         rental_rate: formData.rental_rate,
// //         status: formData.status as any
// //       };

// //       console.log("Creating Vehicle...", vehiclePayload);

// //       // 2. CALL API (Create Vehicle)
// //       await createVehicle(vehiclePayload).unwrap();

// //       // 3. Success
// //       toast.success("Vehicle Inventory Added Successfully!");
// //       setIsModalOpen(false);
// //       resetForm();

// //     } catch (err: any) {
// //       console.error("Inventory Creation Failed", err);
// //       toast.error(err.data?.message || "Failed to add vehicle inventory");
// //     }
// //   };

// //   const resetForm = () => {
// //     setFormData(initialFormState);
// //     setCreatedSpecData(null);
// //     setStep(1);
// //   };

// //   const handleDelete = async (id: number) => {
// //     if (window.confirm("Are you sure? This will delete the vehicle inventory.")) {
// //       try {
// //         await deleteVehicle(id).unwrap();
// //         toast.success("Vehicle deleted");
// //       } catch (err) {
// //         toast.error("Failed to delete vehicle");
// //       }
// //     }
// //   };

// //   // Filter Logic
// //   const filteredVehicles = vehicles?.filter(v => 
// //     v.model?.toLowerCase().includes(searchTerm.toLowerCase()) || 
// //     v.license_plate?.toLowerCase().includes(searchTerm.toLowerCase())
// //   ) || [];

// //   if (isLoading) return <div className="p-8 text-[#E9E6DD] animate-pulse">Loading Fleet Data...</div>;

// //   return (
// //     <div className="space-y-6">
      
// //       {/* HEADER & ACTIONS */}
// //       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
// //         <div>
// //           <h1 className="text-3xl font-bold text-[#001524]">Fleet Management</h1>
// //           <p className="text-[#445048]">Manage specifications and fleet inventory.</p>
// //         </div>
        
// //         <div className="flex gap-3 w-full md:w-auto">
// //           <div className="relative flex-1 md:w-64">
// //             <Search className="absolute left-3 top-3 text-gray-400" size={18} />
// //             <input 
// //               type="text" 
// //               placeholder="Search plate or model..." 
// //               value={searchTerm}
// //               onChange={(e) => setSearchTerm(e.target.value)}
// //               className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#027480] outline-none"
// //             />
// //           </div>
// //           <button 
// //             onClick={() => setIsModalOpen(true)}
// //             className="bg-[#027480] text-[#E9E6DD] px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#025e69] transition-colors shadow-lg"
// //           >
// //             <Plus size={20} /> Add Vehicle
// //           </button>
// //         </div>
// //       </div>

// //       {/* ERROR STATE */}
// //       {error && (
// //         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center gap-2">
// //           <AlertCircle size={20} />
// //           <span>Error loading vehicles. Please check connection.</span>
// //         </div>
// //       )}

// //       {/* TABLE */}
// //       <div className="bg-white rounded-xl shadow-lg border border-[#445048]/20 overflow-hidden">
// //         <div className="overflow-x-auto">
// //           <table className="w-full text-left">
// //             <thead className="bg-[#001524] text-[#E9E6DD]">
// //               <tr>
// //                 <th className="p-4 font-semibold">Vehicle Details</th>
// //                 <th className="p-4 font-semibold">Specs</th>
// //                 <th className="p-4 font-semibold">Inventory Info</th>
// //                 <th className="p-4 font-semibold">Status</th>
// //                 <th className="p-4 font-semibold text-right">Actions</th>
// //               </tr>
// //             </thead>
// //             <tbody className="divide-y divide-gray-100">
// //               {filteredVehicles?.map((v) => (
// //                 <tr key={v.vehicle_id} className="hover:bg-gray-50 transition-colors">
// //                   <td className="p-4">
// //                     <div className="flex items-center gap-3">
// //                       <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-2xl">
// //                         {v.images && v.images !== '[]' ? '🚙' : <Car size={24} className="text-gray-500"/>}
// //                       </div>
// //                       <div>
// //                         <div className="font-bold text-[#001524]">{v.manufacturer} {v.model}</div>
// //                         <div className="text-xs text-gray-500">{v.year} • {v.color}</div>
// //                       </div>
// //                     </div>
// //                   </td>
// //                   <td className="p-4 text-sm text-gray-600">
// //                     <div>{v.transmission} • {v.fuel_type}</div>
// //                     <div className="text-xs">{v.seating_capacity} Seats</div>
// //                   </td>
// //                   <td className="p-4">
// //                     <div className="font-mono text-sm bg-gray-100 inline-block px-2 py-1 rounded">{v.license_plate}</div>
// //                     <div className="text-xs text-gray-500 mt-1">VIN: {v.vin_number}</div>
// //                     <div className="text-sm font-bold text-[#027480]">${v.rental_rate}/day</div>
// //                   </td>
// //                   <td className="p-4">
// //                     <span className={`px-3 py-1 rounded-full text-xs font-bold ${
// //                       v.status === 'Available' ? 'bg-[#027480]/10 text-[#027480]' :
// //                       v.status === 'Maintenance' ? 'bg-[#F57251]/10 text-[#F57251]' :
// //                       'bg-gray-200 text-gray-600'
// //                     }`}>
// //                       {v.status}
// //                     </span>
// //                   </td>
// //                   <td className="p-4 text-right">
// //                     <div className="flex justify-end gap-2">
// //                       <button className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Edit">
// //                         <Edit size={18} />
// //                       </button>
// //                       <button 
// //                         onClick={() => handleDelete(v.vehicle_id)}
// //                         className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors" 
// //                         title="Delete"
// //                       >
// //                         <Trash2 size={18} />
// //                       </button>
// //                     </div>
// //                   </td>
// //                 </tr>
// //               ))}
// //               {filteredVehicles?.length === 0 && (
// //                 <tr>
// //                   <td colSpan={5} className="p-8 text-center text-gray-500">
// //                     No vehicles found matching your search.
// //                   </td>
// //                 </tr>
// //               )}
// //             </tbody>
// //           </table>
// //         </div>
// //       </div>

// //       {/* --- MODAL WIZARD --- */}
// //       {isModalOpen && (
// //         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
// //           <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
// //             {/* Modal Header */}
// //             <div className="bg-[#001524] p-6 flex justify-between items-center text-[#E9E6DD] shrink-0">
// //               <div>
// //                 <h2 className="text-2xl font-bold">Add New Vehicle</h2>
// //                 <p className="text-[#C4AD9D] text-sm">Step {step} of 2: {step === 1 ? 'Specifications' : 'Inventory Details'}</p>
// //               </div>
// //               <button onClick={() => setIsModalOpen(false)} className="text-[#C4AD9D] hover:text-white text-2xl">&times;</button>
// //             </div>

// //             {/* Modal Body */}
// //             <div className="p-6 overflow-y-auto">
// //               <form className="space-y-6">
                
// //                 {/* STEP 1: SPECIFICATIONS */}
// //                 {step === 1 && (
// //                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-right-8">
// //                     <div className="space-y-1">
// //                       <label className="text-xs font-bold text-gray-500 uppercase">Manufacturer</label>
// //                       <input required className="w-full border p-2 rounded focus:ring-2 focus:ring-[#027480] outline-none" 
// //                         value={formData.manufacturer} onChange={e => setFormData({...formData, manufacturer: e.target.value})} placeholder="e.g. Toyota" />
// //                     </div>
// //                     <div className="space-y-1">
// //                       <label className="text-xs font-bold text-gray-500 uppercase">Model</label>
// //                       <input required className="w-full border p-2 rounded focus:ring-2 focus:ring-[#027480] outline-none" 
// //                         value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} placeholder="e.g. Camry" />
// //                     </div>
                    
// //                     <div className="space-y-1">
// //                       <label className="text-xs font-bold text-gray-500 uppercase">Type</label>
// //                       <select className="w-full border p-2 rounded" value={formData.vehicle_type} onChange={e => setFormData({...formData, vehicle_type: e.target.value})}>
// //                         <option>Sedan</option><option>SUV</option><option>Truck</option><option>Van</option><option>Coupe</option>
// //                       </select>
// //                     </div>
                    
// //                     <div className="space-y-1">
// //                       <label className="text-xs font-bold text-gray-500 uppercase">Year</label>
// //                       <input type="number" required className="w-full border p-2 rounded" 
// //                         value={formData.year} onChange={e => setFormData({...formData, year: parseInt(e.target.value)})} />
// //                     </div>

// //                     <div className="space-y-1">
// //                       <label className="text-xs font-bold text-gray-500 uppercase">Fuel Type</label>
// //                       <select className="w-full border p-2 rounded" value={formData.fuel_type} onChange={e => setFormData({...formData, fuel_type: e.target.value})}>
// //                         <option>Petrol</option><option>Diesel</option><option>Electric</option><option>Hybrid</option>
// //                       </select>
// //                     </div>

// //                     <div className="space-y-1">
// //                       <label className="text-xs font-bold text-gray-500 uppercase">Transmission</label>
// //                       <select className="w-full border p-2 rounded" value={formData.transmission} onChange={e => setFormData({...formData, transmission: e.target.value})}>
// //                         <option>Automatic</option><option>Manual</option>
// //                       </select>
// //                     </div>

// //                     <div className="space-y-1">
// //                       <label className="text-xs font-bold text-gray-500 uppercase">Engine Capacity</label>
// //                       <input className="w-full border p-2 rounded" 
// //                         value={formData.engine_capacity} onChange={e => setFormData({...formData, engine_capacity: e.target.value})} placeholder="e.g. 2.0L" />
// //                     </div>

// //                     <div className="space-y-1">
// //                       <label className="text-xs font-bold text-gray-500 uppercase">Color</label>
// //                       <input className="w-full border p-2 rounded" 
// //                         value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} />
// //                     </div>

// //                     <div className="md:col-span-2 space-y-1">
// //                       <label className="text-xs font-bold text-gray-500 uppercase">Features (Comma separated)</label>
// //                       <input className="w-full border p-2 rounded" 
// //                         value={formData.features} onChange={e => setFormData({...formData, features: e.target.value})} placeholder="GPS, Bluetooth, Sunroof" />
// //                     </div>
                    
// //                     <div className="md:col-span-2 space-y-1">
// //                       <label className="text-xs font-bold text-gray-500 uppercase">Image URL</label>
// //                       <input className="w-full border p-2 rounded" 
// //                         value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} placeholder="https://..." />
// //                     </div>
// //                   </div>
// //                 )}

// //                 {/* STEP 2: INVENTORY */}
// //                 {step === 2 && (
// //                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-right-8">
                    
// //                     {/* DISPLAY THE CREATED SPEC DATA FROM DB */}
// //                     <div className="md:col-span-2 bg-[#027480]/10 border border-[#027480]/30 p-4 rounded-lg mb-2">
// //                       <div className="flex items-center gap-2 text-[#027480] mb-1">
// //                         <CheckCircle2 size={18} />
// //                         <span className="font-bold text-xs uppercase tracking-wide">Specification Created</span>
// //                       </div>
// //                       <p className="font-bold text-xl text-[#001524]">
// //                         {createdSpecData ? createdSpecData.name : "Loading..."}
// //                       </p>
// //                       <p className="text-xs text-gray-500">Spec ID: {createdSpecData?.id}</p>
// //                     </div>

// //                     <div className="space-y-1">
// //                       <label className="text-xs font-bold text-gray-500 uppercase">VIN Number</label>
// //                       <input required className="w-full border p-2 rounded focus:ring-2 focus:ring-[#F57251] outline-none" 
// //                         value={formData.vin_number} onChange={e => setFormData({...formData, vin_number: e.target.value})} />
// //                     </div>

// //                     <div className="space-y-1">
// //                       <label className="text-xs font-bold text-gray-500 uppercase">License Plate</label>
// //                       <input required className="w-full border p-2 rounded focus:ring-2 focus:ring-[#F57251] outline-none" 
// //                         value={formData.license_plate} onChange={e => setFormData({...formData, license_plate: e.target.value})} />
// //                     </div>

// //                     <div className="space-y-1">
// //                       <label className="text-xs font-bold text-gray-500 uppercase">Current Mileage</label>
// //                       <input type="number" required className="w-full border p-2 rounded" 
// //                         value={formData.current_mileage} onChange={e => setFormData({...formData, current_mileage: parseInt(e.target.value)})} />
// //                     </div>

// //                     <div className="space-y-1">
// //                       <label className="text-xs font-bold text-gray-500 uppercase">Daily Rate ($)</label>
// //                       <input type="number" required className="w-full border p-2 rounded font-bold text-[#027480]" 
// //                         value={formData.rental_rate} onChange={e => setFormData({...formData, rental_rate: parseInt(e.target.value)})} />
// //                     </div>

// //                     <div className="space-y-1">
// //                       <label className="text-xs font-bold text-gray-500 uppercase">Status</label>
// //                       <select className="w-full border p-2 rounded" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
// //                         <option>Available</option>
// //                         <option>Maintenance</option>
// //                         <option>Rented</option>
// //                       </select>
// //                     </div>
// //                   </div>
// //                 )}

// //                 {/* Footer Buttons */}
// //                 <div className="pt-4 flex justify-between border-t border-gray-100 mt-6">
// //                   {step === 2 ? (
// //                     // We don't allow going back to edit specs because the spec is ALREADY created in DB. 
// //                     // To edit, they would need to cancel and use the Edit feature later.
// //                     <button type="button" onClick={resetForm} className="text-red-500 hover:text-red-700 font-medium">
// //                       Cancel
// //                     </button>
// //                   ) : (
// //                     <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-black">
// //                       Cancel
// //                     </button>
// //                   )}

// //                   {step === 1 ? (
// //                     <button 
// //                       type="button" 
// //                       onClick={handleCreateSpecStep} 
// //                       disabled={isCreatingSpec}
// //                       className="bg-[#027480] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#025e69] transition-colors flex items-center gap-2 disabled:opacity-50"
// //                     >
// //                       {isCreatingSpec ? 'Saving Spec...' : <>Next Step <ArrowRight size={16}/></>}
// //                     </button>
// //                   ) : (
// //                     <button 
// //                       type="button" // Use type="button" and call onClick to prevent double submission
// //                       onClick={handleCreateInventoryStep}
// //                       disabled={isCreatingVehicle}
// //                       className="bg-[#F57251] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#d65f41] transition-colors flex items-center gap-2 disabled:opacity-50"
// //                     >
// //                       {isCreatingVehicle ? 'Adding Vehicle...' : 'Finish & Save'}
// //                     </button>
// //                   )}
// //                 </div>
// //               </form>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default FleetManagement;






