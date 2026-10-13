import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import api from "../../Utils/BackEnd";

const LabSelector = ({ onLabChange, selectedStaffId }) => {
  const [labs, setLabs] = useState([]);
  const [selectedLab, setSelectedLab] = useState(null);

  useEffect(() => {
    fetchLabs();
  }, []);

  const fetchLabs = async () => {
    try {
      const staffIds = localStorage.getItem("staffId");
      if (!staffIds) return;

      const staffIdArray = staffIds.split(",").map((id) => id.trim());

      const labsData = await Promise.all(
        staffIdArray.map(async (staffId) => {
          const res = await api.get(`/api/staff/${staffId}`);
          return {
            staff_id: staffId,
            lab_id: res.data.lab?.id,
            lab_name: res.data.lab?.lab_name,
            lab_no: res.data.lab?.lab_no,
          };
        }),
      );

      setLabs(labsData);
      if (labsData.length > 0 && !selectedLab) {
        setSelectedLab(labsData[0]);
      }
    } catch (error) {
      console.error("Error fetching labs:", error);
    }
  };

  const handleLabChange = (e) => {
    const staffId = e.target.value;
    const lab = labs.find((l) => l.staff_id.toString() === staffId);
    setSelectedLab(lab);
    onLabChange(lab.staff_id, lab.lab_id);
  };

  if (labs.length <= 1) return null;

  return (
    <div className="relative inline-block">
      <select
        value={selectedLab?.staff_id || ""}
        onChange={handleLabChange}
        className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
      >
        {labs.map((lab) => (
          <option key={lab.staff_id} value={lab.staff_id}>
            {lab.lab_name} ({lab.lab_no})
          </option>
        ))}
      </select>
      <ChevronDown
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
        size={16}
      />
    </div>
  );
};

export default LabSelector;
