import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Car, AlertCircle, ArrowRight, ArrowLeft, CheckCircle2, X, Save, ToggleLeft, ToggleRight, Gauge, Users, Fuel, Cog } from 'lucide-react';
import { useGetVehiclesQuery, useCreateVehicleSpecMutation, useAddVehicleMutation, useDeleteVehicleMutation, useUpdateVehicleMutation, useUpdateVehicleSpecMutation, useGetVehicleSpecsQuery, useDeleteVehicleSpecMutation } from '../../features/api/VehicleAPI';
import { toast } from 'sonner';
const FleetManagement = () => {
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
    const [currentStep, setCurrentStep] = useState('select');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentEditingVehicle, setCurrentEditingVehicle] = useState(null);
    const [selectedExistingSpecId, setSelectedExistingSpecId] = useState(null);
    const [useExistingSpec, setUseExistingSpec] = useState(false);
    // DATA State
    const [createdSpecData, setCreatedSpecData] = useState(null);
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
        rental_rate: 0, status: 'Available',
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
    const parseFeatures = (featuresString) => {
        try {
            if (!featuresString)
                return [];
            if (Array.isArray(featuresString))
                return featuresString;
            const parsed = JSON.parse(featuresString);
            return Array.isArray(parsed) ? parsed : [];
        }
        catch {
            return featuresString.split(',').map(f => f.trim()).filter(f => f);
        }
    };
    const parseImages = (imagesString) => {
        try {
            if (!imagesString)
                return [];
            if (Array.isArray(imagesString))
                return imagesString;
            const parsed = JSON.parse(imagesString);
            return Array.isArray(parsed) ? parsed : [];
        }
        catch {
            return imagesString ? [imagesString] : [];
        }
    };
    // Handle existing spec selection
    const handleExistingSpecSelect = (specId) => {
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
    const handleCreateSpecStep = async (e) => {
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
            }
            else {
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
            let newSpecId;
            // Some APIs wrap data, some return directly — so handle both safely
            const maybeWrapped = response;
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
        }
        catch (err) {
            console.error("Spec Creation Error:", err);
            console.error("Error details:", err.data);
            toast.error(err.data?.message || "Failed to create specification");
        }
    };
    // Step 2: Create Inventory
    const handleCreateInventoryStep = async (e) => {
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
        }
        catch (err) {
            console.error("Inventory Creation Failed", err);
            console.error("Error details:", err.data);
            toast.error(err.data?.message || "Failed to add vehicle");
        }
    };
    // Edit functions
    const handleEditClick = (vehicle) => {
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
    const handleEditSave = async (e) => {
        e.preventDefault();
        if (!currentEditingVehicle)
            return;
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
        }
        catch (err) {
            console.error("Update failed:", err);
            console.error("Error details:", err.data);
            toast.error(err.data?.message || "Failed to update");
        }
    };
    // Delete function
    const handleDeleteVehicle = async (id) => {
        if (window.confirm("Are you sure you want to delete this vehicle? This action cannot be undone.")) {
            try {
                await deleteVehicle(id).unwrap();
                toast.success("Vehicle deleted successfully");
                refetchVehicles();
            }
            catch (err) {
                console.error("Delete failed:", err);
                console.error("Error details:", err.data);
                if (err.data?.message?.includes("foreign key constraint")) {
                    toast.error("Cannot delete vehicle because it has related records. Please delete bookings first.");
                }
                else {
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
    const filteredVehicles = vehicles?.filter(v => v.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.manufacturer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.license_plate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.vin_number?.toLowerCase().includes(searchTerm.toLowerCase())) || [];
    if (isLoading)
        return (_jsx("div", { className: "flex h-64 items-center justify-center", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-[#027480]" }) }));
    return (_jsxs("div", { className: "space-y-6 p-4 min-h-screen bg-[#001524]", children: [_jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-white", children: "Fleet Management" }), _jsx("p", { className: "text-[#C4AD9D]", children: "Manage specifications and fleet inventory." })] }), _jsxs("div", { className: "flex gap-3 w-full md:w-auto", children: [_jsxs("div", { className: "relative flex-1 md:w-64", children: [_jsx(Search, { className: "absolute left-3 top-3 text-gray-400", size: 18 }), _jsx("input", { type: "text", placeholder: "Search by model, plate, or VIN...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "pl-10 pr-4 py-2 w-full bg-[#0f2434] border border-[#445048] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#027480]" })] }), _jsxs("button", { onClick: () => {
                                    resetForm();
                                    setIsModalOpen(true);
                                }, className: "bg-[#027480] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#025e69] transition-colors shadow-lg font-semibold", children: [_jsx(Plus, { size: 20 }), " Add Vehicle"] })] })] }), error && (_jsxs("div", { className: "bg-red-900/20 border border-red-700 text-red-300 px-4 py-3 rounded-lg flex items-center gap-2", children: [_jsx(AlertCircle, { size: 20 }), _jsx("span", { children: "Error loading vehicles. Please check connection." })] })), _jsx("div", { className: "bg-[#0f2434] rounded-xl shadow-lg border border-[#445048] overflow-hidden", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-left", children: [_jsx("thead", { className: "bg-[#001524] text-white", children: _jsxs("tr", { children: [_jsx("th", { className: "p-4 font-semibold", children: "Vehicle" }), _jsx("th", { className: "p-4 font-semibold", children: "Details" }), _jsx("th", { className: "p-4 font-semibold", children: "Inventory" }), _jsx("th", { className: "p-4 font-semibold", children: "Status & Price" }), _jsx("th", { className: "p-4 font-semibold text-right", children: "Actions" })] }) }), _jsxs("tbody", { className: "divide-y divide-[#445048]", children: [filteredVehicles?.map((v) => {
                                        const images = parseImages(v.images || '');
                                        return (_jsxs("tr", { className: "hover:bg-[#1a3247] transition-colors text-white", children: [_jsx("td", { className: "p-4", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("div", { className: "w-16 h-16 rounded-lg overflow-hidden bg-gray-700 flex items-center justify-center", children: [images[0] ? (_jsx("img", { src: images[0], alt: `${v.manufacturer} ${v.model}`, className: "w-full h-full object-cover", onError: (e) => {
                                                                            e.target.style.display = 'none';
                                                                        } })) : null, _jsx("div", { className: `${images[0] ? 'hidden' : ''} w-full h-full flex items-center justify-center bg-gray-800`, children: _jsx(Car, { size: 24, className: "text-gray-400" }) })] }), _jsxs("div", { children: [_jsxs("div", { className: "font-bold text-white", children: [v.manufacturer, " ", v.model] }), _jsx("div", { className: "text-sm text-[#C4AD9D]", children: v.year }), _jsxs("div", { className: "text-xs text-gray-400", children: ["Type: ", v.vehicle_type || 'Sedan'] })] })] }) }), _jsx("td", { className: "p-4", children: _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center gap-2 text-sm", children: [_jsx(Users, { size: 14, className: "text-[#027480]" }), _jsxs("span", { children: [v.seating_capacity, " Seats"] })] }), _jsxs("div", { className: "flex items-center gap-2 text-sm", children: [_jsx(Fuel, { size: 14, className: "text-[#027480]" }), _jsx("span", { children: v.fuel_type })] }), _jsxs("div", { className: "flex items-center gap-2 text-sm", children: [_jsx(Cog, { size: 14, className: "text-[#027480]" }), _jsx("span", { children: v.transmission })] })] }) }), _jsx("td", { className: "p-4", children: _jsxs("div", { className: "space-y-2", children: [_jsx("div", { className: "font-mono text-sm bg-[#001524] px-3 py-2 rounded-lg", children: v.license_plate }), _jsxs("div", { className: "flex items-center gap-2 text-sm", children: [_jsx(Gauge, { size: 14, className: "text-[#F57251]" }), _jsxs("span", { children: [v.current_mileage?.toLocaleString(), " km"] })] })] }) }), _jsx("td", { className: "p-4", children: _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "text-lg font-bold text-[#027480]", children: ["$", v.rental_rate, "/day"] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { onClick: async () => {
                                                                                    try {
                                                                                        await updateVehicleSpec({
                                                                                            id: v.vehicleSpec_id,
                                                                                            data: { on_promo: !v.on_promo }
                                                                                        }).unwrap();
                                                                                        refetchVehicles();
                                                                                        toast.success(`Promotion ${v.on_promo ? 'disabled' : 'enabled'}`);
                                                                                    }
                                                                                    catch (err) {
                                                                                        toast.error("Failed to update promotion status");
                                                                                    }
                                                                                }, className: `p-1 rounded-full transition-colors ${v.on_promo ? 'bg-green-500' : 'bg-gray-600'}`, children: v.on_promo ? (_jsx(ToggleRight, { size: 20, className: "text-white" })) : (_jsx(ToggleLeft, { size: 20, className: "text-gray-300" })) }), v.on_promo && v.promo_rate && (_jsxs("span", { className: "text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded", children: ["-", v.promo_rate, "%"] }))] })] }), _jsx("div", { children: _jsx("span", { className: `px-3 py-1 rounded-full text-xs font-bold ${v.status === 'Available' ? 'bg-green-900/30 text-green-400 border border-green-900' :
                                                                        v.status === 'Rented' ? 'bg-blue-900/30 text-blue-400 border border-blue-900' :
                                                                            v.status === 'Maintenance' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-900' :
                                                                                'bg-red-900/30 text-red-400 border border-red-900'}`, children: v.status }) })] }) }), _jsx("td", { className: "p-4", children: _jsxs("div", { className: "flex justify-end gap-2", children: [_jsx("button", { onClick: () => handleEditClick(v), className: "p-2 bg-[#027480] text-white hover:bg-[#025e69] rounded-lg transition-colors", title: "Edit", children: _jsx(Edit, { size: 18 }) }), _jsx("button", { onClick: () => handleDeleteVehicle(v.vehicle_id), className: "p-2 bg-red-900/30 text-red-400 hover:bg-red-900/50 rounded-lg transition-colors border border-red-900", title: "Delete", children: _jsx(Trash2, { size: 18 }) })] }) })] }, v.vehicle_id));
                                    }), filteredVehicles?.length === 0 && (_jsx("tr", { children: _jsx("td", { colSpan: 5, className: "p-8 text-center text-gray-500", children: "No vehicles found matching your search." }) }))] })] }) }) }), isModalOpen && (_jsx("div", { className: "fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4", children: _jsxs("div", { className: "bg-[#0f2434] rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-[#445048]", children: [_jsxs("div", { className: "bg-[#001524] p-6 flex justify-between items-center text-[#E9E6DD]", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold", children: "Add New Vehicle" }), _jsxs("p", { className: "text-[#C4AD9D] text-sm", children: [currentStep === 'select' && 'Choose how to add vehicle', currentStep === 'specs' && 'Step 1: Vehicle Specifications', currentStep === 'inventory' && 'Step 2: Inventory Details'] })] }), _jsx("button", { onClick: () => setIsModalOpen(false), className: "text-[#C4AD9D] hover:text-white text-2xl p-2 rounded-full hover:bg-white/10", children: _jsx(X, { size: 24 }) })] }), _jsxs("div", { className: "p-6 overflow-y-auto", children: [currentStep === 'select' && (_jsx("div", { className: "space-y-6 animate-in fade-in", children: _jsxs("div", { className: "bg-[#001524] p-6 rounded-xl border border-[#445048]", children: [_jsx("h3", { className: "text-xl font-bold text-white mb-4", children: "Choose Creation Method" }), _jsxs("div", { className: "space-y-4", children: [_jsx("button", { onClick: () => {
                                                            setUseExistingSpec(true);
                                                            setCurrentStep('specs');
                                                        }, className: "w-full p-6 bg-[#1a3247] hover:bg-[#2a4267] border-2 border-[#445048] rounded-xl text-left transition-all group", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-12 h-12 rounded-lg bg-[#027480] flex items-center justify-center", children: _jsx(Car, { className: "text-white", size: 24 }) }), _jsxs("div", { children: [_jsx("h4", { className: "font-bold text-white text-lg", children: "Use Existing Specification" }), _jsx("p", { className: "text-[#C4AD9D] text-sm mt-1", children: "Select from existing vehicle specifications." })] })] }) }), _jsx("button", { onClick: () => {
                                                            setUseExistingSpec(false);
                                                            setCurrentStep('specs');
                                                        }, className: "w-full p-6 bg-[#1a3247] hover:bg-[#2a4267] border-2 border-[#445048] rounded-xl text-left transition-all group", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-12 h-12 rounded-lg bg-[#F57251] flex items-center justify-center", children: _jsx(Plus, { className: "text-white", size: 24 }) }), _jsxs("div", { children: [_jsx("h4", { className: "font-bold text-white text-lg", children: "Create New Specification" }), _jsx("p", { className: "text-[#C4AD9D] text-sm mt-1", children: "Create a new vehicle specification with custom details." })] })] }) })] })] }) })), currentStep === 'specs' && (_jsxs("form", { onSubmit: handleCreateSpecStep, className: "space-y-6", children: [useExistingSpec && (_jsxs("div", { className: "bg-[#001524] p-4 rounded-lg border border-[#027480]/30", children: [_jsx("label", { className: "text-sm font-bold text-[#027480] mb-2 block", children: "Select Existing Specification" }), isLoadingSpecs ? (_jsx("div", { className: "text-center py-4 text-[#C4AD9D]", children: "Loading specifications..." })) : (_jsxs(_Fragment, { children: [_jsxs("select", { value: selectedExistingSpecId || '', onChange: (e) => {
                                                                const specId = Number(e.target.value);
                                                                console.log('Dropdown changed to:', specId);
                                                                handleExistingSpecSelect(specId);
                                                            }, className: "w-full bg-[#0f2434] border border-[#445048] rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#027480]", children: [_jsx("option", { value: "", children: "-- Select a specification --" }), allSpecs?.map((spec) => (_jsxs("option", { value: spec.vehicleSpec_id, children: [spec.manufacturer, " ", spec.model, " (", spec.year, ") - ", spec.vehicle_type] }, spec.vehicleSpec_id)))] }), _jsx("p", { className: "text-xs text-[#C4AD9D] mt-2", children: "Selecting an existing spec will pre-fill the form below" })] }))] })), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-xs font-bold text-[#C4AD9D] uppercase", children: "Manufacturer *" }), _jsx("input", { required: true, className: "w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg", value: formData.manufacturer, onChange: e => setFormData({ ...formData, manufacturer: e.target.value }), placeholder: "e.g. Toyota" })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-xs font-bold text-[#C4AD9D] uppercase", children: "Model *" }), _jsx("input", { required: true, className: "w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg", value: formData.model, onChange: e => setFormData({ ...formData, model: e.target.value }), placeholder: "e.g. Camry" })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-xs font-bold text-[#C4AD9D] uppercase", children: "Type" }), _jsxs("select", { className: "w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg", value: formData.vehicle_type, onChange: e => setFormData({ ...formData, vehicle_type: e.target.value }), children: [_jsx("option", { value: "Sedan", children: "Sedan" }), _jsx("option", { value: "SUV", children: "SUV" }), _jsx("option", { value: "Truck", children: "Truck" }), _jsx("option", { value: "Van", children: "Van" }), _jsx("option", { value: "Hatchback", children: "Hatchback" }), _jsx("option", { value: "Coupe", children: "Coupe" })] })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-xs font-bold text-[#C4AD9D] uppercase", children: "Year" }), _jsx("input", { type: "number", required: true, min: "1900", max: new Date().getFullYear() + 1, className: "w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg", value: formData.year, onChange: e => setFormData({ ...formData, year: parseInt(e.target.value) }) })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-xs font-bold text-[#C4AD9D] uppercase", children: "Fuel Type" }), _jsxs("select", { className: "w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg", value: formData.fuel_type, onChange: e => setFormData({ ...formData, fuel_type: e.target.value }), children: [_jsx("option", { value: "Petrol", children: "Petrol" }), _jsx("option", { value: "Diesel", children: "Diesel" }), _jsx("option", { value: "Electric", children: "Electric" }), _jsx("option", { value: "Hybrid", children: "Hybrid" })] })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-xs font-bold text-[#C4AD9D] uppercase", children: "Transmission" }), _jsxs("select", { className: "w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg", value: formData.transmission, onChange: e => setFormData({ ...formData, transmission: e.target.value }), children: [_jsx("option", { value: "Automatic", children: "Automatic" }), _jsx("option", { value: "Manual", children: "Manual" })] })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-xs font-bold text-[#C4AD9D] uppercase", children: "Engine Capacity" }), _jsxs("select", { className: "w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg", value: formData.engine_capacity, onChange: e => setFormData({ ...formData, engine_capacity: e.target.value }), children: [_jsx("option", { value: "1.0L", children: "1.0L" }), _jsx("option", { value: "1.5L", children: "1.5L" }), _jsx("option", { value: "2.0L", children: "2.0L" }), _jsx("option", { value: "2.5L", children: "2.5L" }), _jsx("option", { value: "3.0L", children: "3.0L" }), _jsx("option", { value: "3.5L", children: "3.5L" })] })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-xs font-bold text-[#C4AD9D] uppercase", children: "Seats" }), _jsx("select", { className: "w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg", value: formData.seating_capacity, onChange: e => setFormData({ ...formData, seating_capacity: parseInt(e.target.value) }), children: [2, 4, 5, 7, 8].map(num => (_jsxs("option", { value: num, children: [num, " Seats"] }, num))) })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-xs font-bold text-[#C4AD9D] uppercase", children: "Color" }), _jsx("input", { className: "w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg", value: formData.color, onChange: e => setFormData({ ...formData, color: e.target.value }), placeholder: "e.g. White" })] }), _jsxs("div", { className: "md:col-span-2 space-y-1", children: [_jsx("label", { className: "text-xs font-bold text-[#C4AD9D] uppercase", children: "Features" }), _jsx("input", { className: "w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg", value: formData.features, onChange: e => setFormData({ ...formData, features: e.target.value }), placeholder: "GPS, Bluetooth, Sunroof" })] }), _jsxs("div", { className: "md:col-span-2 space-y-1", children: [_jsx("label", { className: "text-xs font-bold text-[#C4AD9D] uppercase", children: "Image URL" }), _jsx("input", { className: "w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg", value: formData.image_url, onChange: e => setFormData({ ...formData, image_url: e.target.value }), placeholder: "https://example.com/image.jpg" }), formData.image_url && (_jsxs("div", { className: "mt-2 flex items-center gap-3", children: [_jsx("div", { className: "w-32 h-32 rounded-lg border border-[#445048] overflow-hidden", children: _jsx("img", { src: formData.image_url, alt: "Preview", className: "w-full h-full object-cover", onError: (e) => {
                                                                            e.target.style.display = 'none';
                                                                        } }) }), _jsx("div", { className: "text-sm text-[#C4AD9D]", children: "Image preview will appear here" })] }))] }), _jsxs("div", { className: "md:col-span-2 border-t border-[#445048] pt-4 mt-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h4", { className: "font-bold text-white", children: "Promotion Settings" }), _jsx("div", { className: "flex items-center gap-2", children: _jsxs("label", { className: "flex items-center gap-2 text-sm text-[#C4AD9D]", children: [_jsx("input", { type: "checkbox", checked: formData.on_promo, onChange: e => setFormData({ ...formData, on_promo: e.target.checked }), className: "rounded" }), "Enable Promotion"] }) })] }), formData.on_promo && (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-xs font-bold text-[#C4AD9D] uppercase", children: "Discount Rate (%)" }), _jsx("input", { type: "number", min: "0", max: "100", className: "w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg", value: formData.promo_rate, onChange: e => setFormData({ ...formData, promo_rate: parseFloat(e.target.value) }), placeholder: "e.g., 15" })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-xs font-bold text-[#C4AD9D] uppercase", children: "Start Date" }), _jsx("input", { type: "date", className: "w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg", value: formData.promo_start_date, onChange: e => setFormData({ ...formData, promo_start_date: e.target.value }) })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-xs font-bold text-[#C4AD9D] uppercase", children: "End Date" }), _jsx("input", { type: "date", className: "w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg", value: formData.promo_end_date, onChange: e => setFormData({ ...formData, promo_end_date: e.target.value }) })] })] }))] })] }), _jsxs("div", { className: "flex justify-between pt-4 border-t border-[#445048]", children: [_jsx("button", { type: "button", onClick: () => setCurrentStep('select'), className: "px-6 py-2 border border-[#445048] text-[#C4AD9D] hover:text-white rounded-lg hover:border-white/30 transition-colors", children: "Back" }), _jsxs("button", { type: "submit", className: "bg-[#027480] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#025e69] transition-colors flex items-center gap-2", children: [useExistingSpec ? 'Use This Spec' : 'Create Specification', " ", _jsx(ArrowRight, { size: 16 })] })] })] })), currentStep === 'inventory' && (_jsxs("form", { onSubmit: handleCreateInventoryStep, className: "space-y-6", children: [createdSpecData && (_jsxs("div", { className: "bg-[#001524] border border-[#027480]/30 p-4 rounded-lg", children: [_jsxs("div", { className: "flex items-center gap-2 text-[#027480] mb-1", children: [_jsx(CheckCircle2, { size: 18 }), _jsx("span", { className: "font-bold text-xs uppercase tracking-wide", children: "Specification Ready" })] }), _jsx("p", { className: "font-bold text-xl text-white", children: createdSpecData.name }), _jsxs("p", { className: "text-xs text-[#C4AD9D]", children: ["Spec ID: ", createdSpecData.id] })] })), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-xs font-bold text-[#C4AD9D] uppercase", children: "VIN Number *" }), _jsx("input", { required: true, className: "w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg", value: formData.vin_number, onChange: e => setFormData({ ...formData, vin_number: e.target.value }), placeholder: "e.g. 1HGCM82633A123456" })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-xs font-bold text-[#C4AD9D] uppercase", children: "License Plate *" }), _jsx("input", { required: true, className: "w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg", value: formData.license_plate, onChange: e => setFormData({ ...formData, license_plate: e.target.value }), placeholder: "e.g. KDT 132R" })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-xs font-bold text-[#C4AD9D] uppercase", children: "Current Mileage" }), _jsx("input", { type: "number", required: true, className: "w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg", value: formData.current_mileage, onChange: e => setFormData({ ...formData, current_mileage: parseInt(e.target.value) }), min: "0" })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-xs font-bold text-[#C4AD9D] uppercase", children: "Daily Rate ($)" }), _jsx("input", { type: "number", required: true, className: "w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg", value: formData.rental_rate, onChange: e => setFormData({ ...formData, rental_rate: parseFloat(e.target.value) }), min: "0", step: "0.01" })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-xs font-bold text-[#C4AD9D] uppercase", children: "Availability" }), _jsxs("select", { className: "w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg", value: formData.status, onChange: e => setFormData({ ...formData, status: e.target.value }), children: [_jsx("option", { value: "Available", children: "Available" }), _jsx("option", { value: "Rented", children: "Rented" }), _jsx("option", { value: "Maintenance", children: "Maintenance" }), _jsx("option", { value: "Unavailable", children: "Unavailable" })] })] })] }), _jsxs("div", { className: "flex justify-between pt-4 border-t border-[#445048]", children: [_jsxs("button", { type: "button", onClick: () => setCurrentStep('specs'), className: "px-6 py-2 border border-[#445048] text-[#C4AD9D] hover:text-white rounded-lg hover:border-white/30 transition-colors flex items-center gap-2", children: [_jsx(ArrowLeft, { size: 16 }), " Back to Specs"] }), _jsx("button", { type: "submit", className: "bg-[#F57251] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#d65f41] transition-colors", children: "Finish & Save Vehicle" })] })] }))] })] }) })), isEditModalOpen && currentEditingVehicle && (_jsx("div", { className: "fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4", children: _jsxs("div", { className: "bg-[#0f2434] rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-[#445048]", children: [_jsxs("div", { className: "bg-[#001524] p-6 flex justify-between items-center text-[#E9E6DD]", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold", children: "Edit Vehicle" }), _jsxs("p", { className: "text-[#C4AD9D] text-sm", children: [currentEditingVehicle.manufacturer, " ", currentEditingVehicle.model] })] }), _jsx("button", { onClick: () => setIsEditModalOpen(false), className: "text-[#C4AD9D] hover:text-white text-2xl p-2 rounded-full hover:bg-white/10", children: _jsx(X, { size: 24 }) })] }), _jsx("div", { className: "p-6 overflow-y-auto", children: _jsxs("form", { onSubmit: handleEditSave, className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-xs font-bold text-[#C4AD9D] uppercase", children: "Manufacturer *" }), _jsx("input", { required: true, className: "w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg", value: formData.manufacturer, onChange: e => setFormData({ ...formData, manufacturer: e.target.value }) })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-xs font-bold text-[#C4AD9D] uppercase", children: "Model *" }), _jsx("input", { required: true, className: "w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg", value: formData.model, onChange: e => setFormData({ ...formData, model: e.target.value }) })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-xs font-bold text-[#C4AD9D] uppercase", children: "Type" }), _jsxs("select", { className: "w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg", value: formData.vehicle_type, onChange: e => setFormData({ ...formData, vehicle_type: e.target.value }), children: [_jsx("option", { value: "Sedan", children: "Sedan" }), _jsx("option", { value: "SUV", children: "SUV" }), _jsx("option", { value: "Truck", children: "Truck" }), _jsx("option", { value: "Van", children: "Van" }), _jsx("option", { value: "Hatchback", children: "Hatchback" }), _jsx("option", { value: "Coupe", children: "Coupe" })] })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-xs font-bold text-[#C4AD9D] uppercase", children: "Year" }), _jsx("input", { type: "number", required: true, min: "1900", max: new Date().getFullYear() + 1, className: "w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg", value: formData.year, onChange: e => setFormData({ ...formData, year: parseInt(e.target.value) }) })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-xs font-bold text-[#C4AD9D] uppercase", children: "Fuel Type" }), _jsxs("select", { className: "w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg", value: formData.fuel_type, onChange: e => setFormData({ ...formData, fuel_type: e.target.value }), children: [_jsx("option", { value: "Petrol", children: "Petrol" }), _jsx("option", { value: "Diesel", children: "Diesel" }), _jsx("option", { value: "Electric", children: "Electric" }), _jsx("option", { value: "Hybrid", children: "Hybrid" })] })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-xs font-bold text-[#C4AD9D] uppercase", children: "Transmission" }), _jsxs("select", { className: "w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg", value: formData.transmission, onChange: e => setFormData({ ...formData, transmission: e.target.value }), children: [_jsx("option", { value: "Automatic", children: "Automatic" }), _jsx("option", { value: "Manual", children: "Manual" })] })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-xs font-bold text-[#C4AD9D] uppercase", children: "Engine Capacity" }), _jsxs("select", { className: "w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg", value: formData.engine_capacity, onChange: e => setFormData({ ...formData, engine_capacity: e.target.value }), children: [_jsx("option", { value: "1.0L", children: "1.0L" }), _jsx("option", { value: "1.5L", children: "1.5L" }), _jsx("option", { value: "2.0L", children: "2.0L" }), _jsx("option", { value: "2.5L", children: "2.5L" }), _jsx("option", { value: "3.0L", children: "3.0L" }), _jsx("option", { value: "3.5L", children: "3.5L" })] })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-xs font-bold text-[#C4AD9D] uppercase", children: "Seats" }), _jsx("select", { className: "w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg", value: formData.seating_capacity, onChange: e => setFormData({ ...formData, seating_capacity: parseInt(e.target.value) }), children: [2, 4, 5, 7, 8].map(num => (_jsxs("option", { value: num, children: [num, " Seats"] }, num))) })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-xs font-bold text-[#C4AD9D] uppercase", children: "Color" }), _jsx("input", { className: "w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg", value: formData.color, onChange: e => setFormData({ ...formData, color: e.target.value }) })] }), _jsxs("div", { className: "md:col-span-2 space-y-1", children: [_jsx("label", { className: "text-xs font-bold text-[#C4AD9D] uppercase", children: "Features" }), _jsx("input", { className: "w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg", value: formData.features, onChange: e => setFormData({ ...formData, features: e.target.value }), placeholder: "Comma separated features" })] }), _jsxs("div", { className: "md:col-span-2 space-y-1", children: [_jsx("label", { className: "text-xs font-bold text-[#C4AD9D] uppercase", children: "Image URL" }), _jsx("input", { className: "w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg", value: formData.image_url, onChange: e => setFormData({ ...formData, image_url: e.target.value }) }), formData.image_url && (_jsx("div", { className: "mt-2", children: _jsx("div", { className: "w-32 h-32 rounded-lg border border-[#445048] overflow-hidden", children: _jsx("img", { src: formData.image_url, alt: "Preview", className: "w-full h-full object-cover", onError: (e) => {
                                                                    e.target.style.display = 'none';
                                                                } }) }) }))] }), _jsxs("div", { className: "md:col-span-2 border-t border-[#445048] pt-4 mt-2", children: [_jsx("h4", { className: "font-bold text-white mb-4", children: "Vehicle Inventory" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-xs font-bold text-[#C4AD9D] uppercase", children: "VIN Number" }), _jsx("input", { required: true, className: "w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg", value: formData.vin_number, onChange: e => setFormData({ ...formData, vin_number: e.target.value }) })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-xs font-bold text-[#C4AD9D] uppercase", children: "License Plate" }), _jsx("input", { required: true, className: "w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg", value: formData.license_plate, onChange: e => setFormData({ ...formData, license_plate: e.target.value }) })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-xs font-bold text-[#C4AD9D] uppercase", children: "Mileage" }), _jsx("input", { type: "number", required: true, className: "w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg", value: formData.current_mileage, onChange: e => setFormData({ ...formData, current_mileage: parseInt(e.target.value) }) })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-xs font-bold text-[#C4AD9D] uppercase", children: "Daily Rate ($)" }), _jsx("input", { type: "number", required: true, className: "w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg", value: formData.rental_rate, onChange: e => setFormData({ ...formData, rental_rate: parseFloat(e.target.value) }) })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-xs font-bold text-[#C4AD9D] uppercase", children: "Availability" }), _jsxs("select", { className: "w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg", value: formData.status, onChange: e => setFormData({ ...formData, status: e.target.value }), children: [_jsx("option", { value: "Available", children: "Available" }), _jsx("option", { value: "Rented", children: "Rented" }), _jsx("option", { value: "Maintenance", children: "Maintenance" }), _jsx("option", { value: "Unavailable", children: "Unavailable" })] })] })] })] }), _jsxs("div", { className: "md:col-span-2 border-t border-[#445048] pt-4 mt-2", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h4", { className: "font-bold text-white", children: "Promotion Settings" }), _jsx("div", { className: "flex items-center gap-2", children: _jsxs("label", { className: "flex items-center gap-2 text-sm text-[#C4AD9D]", children: [_jsx("input", { type: "checkbox", checked: formData.on_promo, onChange: e => setFormData({ ...formData, on_promo: e.target.checked }), className: "rounded" }), "Enable Promotion"] }) })] }), formData.on_promo && (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-xs font-bold text-[#C4AD9D] uppercase", children: "Discount Rate (%)" }), _jsx("input", { type: "number", min: "0", max: "100", className: "w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg", value: formData.promo_rate, onChange: e => setFormData({ ...formData, promo_rate: parseFloat(e.target.value) }) })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-xs font-bold text-[#C4AD9D] uppercase", children: "Start Date" }), _jsx("input", { type: "date", className: "w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg", value: formData.promo_start_date, onChange: e => setFormData({ ...formData, promo_start_date: e.target.value }) })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-xs font-bold text-[#C4AD9D] uppercase", children: "End Date" }), _jsx("input", { type: "date", className: "w-full bg-[#001524] border border-[#445048] text-white p-3 rounded-lg", value: formData.promo_end_date, onChange: e => setFormData({ ...formData, promo_end_date: e.target.value }) })] })] }))] })] }), _jsxs("div", { className: "flex justify-end gap-3 pt-4 border-t border-[#445048]", children: [_jsx("button", { type: "button", onClick: () => setIsEditModalOpen(false), className: "px-6 py-2 border border-[#445048] text-[#C4AD9D] hover:text-white rounded-lg transition-colors", children: "Cancel" }), _jsxs("button", { type: "submit", className: "bg-[#027480] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#025e69] transition-colors flex items-center gap-2", children: [_jsx(Save, { size: 18 }), " Save Changes"] })] })] }) })] }) }))] }));
};
export default FleetManagement;
