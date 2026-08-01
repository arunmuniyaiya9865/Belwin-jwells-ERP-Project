import React, { useState } from 'react';
import { Save, UploadCloud } from 'lucide-react';

const VehicleLoanForm = () => {
  const [formData, setFormData] = useState({
    vehicleType: 'Bike',
    vehicleBrand: '',
    modelName: '',
    variant: '',
    manufacturingYear: '',
    registrationNumber: '',
    chassisNumber: '',
    engineNumber: '',
    showroomPrice: '',
    onRoadPrice: '',
    dealerName: '',
    nomineeName: '',
    nomineeRelationship: '',
    nomineeDob: '',
    nomineeMobile: '',
    nomineeAadhaar: '',
    nomineeAddress: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const inp = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-erp-green bg-white";
  const lbl = "block text-sm font-medium text-gray-700 mb-1";
  const sectionTitle = "text-lg font-bold text-gray-800 mb-4 pb-2 border-b";

  return (
    <div className="w-full space-y-6">
      
      {/* 3. Vehicle Details */}
      <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-6">
        <h3 className={sectionTitle}>3. Vehicle Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className={lbl}>Vehicle Type <span className="text-red-500">*</span></label>
            <select name="vehicleType" className={inp} value={formData.vehicleType} onChange={handleChange}>
              <option value="Bike">Bike</option>
              <option value="Car">Car</option>
              <option value="Commercial">Commercial</option>
            </select>
          </div>
          <div>
            <label className={lbl}>Vehicle Brand <span className="text-red-500">*</span></label>
            <input type="text" name="vehicleBrand" className={inp} value={formData.vehicleBrand} onChange={handleChange} placeholder="e.g., Honda" />
          </div>
          <div>
            <label className={lbl}>Model Name <span className="text-red-500">*</span></label>
            <input type="text" name="modelName" className={inp} value={formData.modelName} onChange={handleChange} placeholder="e.g., City" />
          </div>
          <div>
            <label className={lbl}>Variant <span className="text-red-500">*</span></label>
            <input type="text" name="variant" className={inp} value={formData.variant} onChange={handleChange} placeholder="e.g., VXi" />
          </div>
          <div>
            <label className={lbl}>Manufacturing Year <span className="text-red-500">*</span></label>
            <input type="number" name="manufacturingYear" className={inp} value={formData.manufacturingYear} onChange={handleChange} placeholder="e.g., 2023" />
          </div>
          <div>
            <label className={lbl}>Registration Number (Optional)</label>
            <input type="text" name="registrationNumber" className={inp} value={formData.registrationNumber} onChange={handleChange} placeholder="e.g., TN 01 AB 1234" />
          </div>
          <div>
            <label className={lbl}>Chassis Number <span className="text-red-500">*</span></label>
            <input type="text" name="chassisNumber" className={inp} value={formData.chassisNumber} onChange={handleChange} placeholder="Enter Chassis Number" />
          </div>
          <div>
            <label className={lbl}>Engine Number <span className="text-red-500">*</span></label>
            <input type="text" name="engineNumber" className={inp} value={formData.engineNumber} onChange={handleChange} placeholder="Enter Engine Number" />
          </div>
          <div>
            <label className={lbl}>Showroom Price <span className="text-red-500">*</span></label>
            <input type="number" name="showroomPrice" className={inp} value={formData.showroomPrice} onChange={handleChange} placeholder="₹ Amount" />
          </div>
          <div>
            <label className={lbl}>On Road Price <span className="text-red-500">*</span></label>
            <input type="number" name="onRoadPrice" className={inp} value={formData.onRoadPrice} onChange={handleChange} placeholder="₹ Amount" />
          </div>
          <div>
            <label className={lbl}>Dealer Name <span className="text-red-500">*</span></label>
            <input type="text" name="dealerName" className={inp} value={formData.dealerName} onChange={handleChange} placeholder="Enter Dealer Name" />
          </div>
        </div>
      </div>

      {/* 4. Nominee Details */}
      <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-6">
        <h3 className={sectionTitle}>4. Nominee Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className={lbl}>Nominee Name <span className="text-red-500">*</span></label>
            <input type="text" name="nomineeName" className={inp} value={formData.nomineeName} onChange={handleChange} placeholder="Enter Nominee Name" />
          </div>
          <div>
            <label className={lbl}>Relationship <span className="text-red-500">*</span></label>
            <input type="text" name="nomineeRelationship" className={inp} value={formData.nomineeRelationship} onChange={handleChange} placeholder="e.g., Father, Wife" />
          </div>
          <div>
            <label className={lbl}>Date of Birth <span className="text-red-500">*</span></label>
            <input type="date" name="nomineeDob" className={inp} value={formData.nomineeDob} onChange={handleChange} />
          </div>
          <div>
            <label className={lbl}>Mobile Number <span className="text-red-500">*</span></label>
            <input type="text" name="nomineeMobile" className={inp} value={formData.nomineeMobile} onChange={handleChange} placeholder="Enter Mobile Number" />
          </div>
          <div>
            <label className={lbl}>Aadhaar Number <span className="text-red-500">*</span></label>
            <input type="text" name="nomineeAadhaar" className={inp} value={formData.nomineeAadhaar} onChange={handleChange} placeholder="Enter Aadhaar Number" />
          </div>
          <div className="md:col-span-2 lg:col-span-3">
            <label className={lbl}>Address <span className="text-red-500">*</span></label>
            <textarea name="nomineeAddress" rows="2" className={inp} value={formData.nomineeAddress} onChange={handleChange} placeholder="Enter Nominee Address"></textarea>
          </div>
          <div className="flex flex-col">
            <label className={lbl}>Nominee Photo Upload <span className="text-red-500">*</span></label>
            <div className="flex items-center gap-2">
              <input type="file" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-bold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" />
            </div>
          </div>
          <div className="flex flex-col">
            <label className={lbl}>Nominee ID Proof Upload <span className="text-red-500">*</span></label>
            <div className="flex items-center gap-2">
              <input type="file" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-bold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" />
            </div>
          </div>
        </div>
      </div>

      {/* Document Uploads */}
      <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-6">
        <h3 className={sectionTitle}>Document Upload</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className={lbl}>Driving License <span className="text-red-500">*</span></label>
            <div className="flex items-center gap-2">
              <input type="file" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-bold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" />
            </div>
          </div>
          <div className="flex flex-col">
            <label className={lbl}>Salary Slip / Income Proof <span className="text-red-500">*</span></label>
            <div className="flex items-center gap-2">
              <input type="file" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-bold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" />
            </div>
          </div>
          <div className="flex flex-col">
            <label className={lbl}>Bank Statement <span className="text-red-500">*</span></label>
            <div className="flex items-center gap-2">
              <input type="file" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-bold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" />
            </div>
          </div>
          <div className="flex flex-col">
            <label className={lbl}>Vehicle Invoice / Quotation <span className="text-red-500">*</span></label>
            <div className="flex items-center gap-2">
              <input type="file" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-bold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 mt-6">
        <button className="px-6 py-2 bg-gray-200 text-gray-800 text-sm font-bold rounded-md hover:bg-gray-300 transition-colors">Cancel</button>
        <button className="px-8 py-2 bg-black text-white text-sm font-bold rounded-md hover:bg-gray-800 transition-colors flex items-center gap-2">
          <Save className="w-4 h-4" /> Save Loan
        </button>
      </div>

    </div>
  );
};

export default VehicleLoanForm;
