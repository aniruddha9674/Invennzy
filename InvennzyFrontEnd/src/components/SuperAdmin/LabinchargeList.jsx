import React, { useState, useEffect } from "react";
import {
  User,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  X,
  Save,
  Mail,
  Phone,
  Building,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

const LabIncharge = () => {
  const [incharges, setIncharges] = useState([]);
  const [labs, setLabs] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingIncharge, setEditingIncharge] = useState(null);
  const [viewingIncharge, setViewingIncharge] = useState(null);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState(null);
  const [expandedDepts, setExpandedDepts] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    assignedLabs: [],
    department: "",
  });

  useEffect(() => {
    setTimeout(() => {
      setDepartments([
        { id: 1, name: "Computer", color: "blue" },
        { id: 2, name: "Mechanical", color: "green" },
        { id: 3, name: "Electrical", color: "purple" },
      ]);

      setLabs([
        {
          id: 1,
          lab_no: "CS-101",
          lab_name: "Computer Science Lab 1",
          building: "Block A",
          floor: "1st Floor",
          department: "Computer",
        },
        {
          id: 2,
          lab_no: "CS-102",
          lab_name: "Computer Science Lab 2",
          building: "Block A",
          floor: "2nd Floor",
          department: "Computer",
        },
        {
          id: 3,
          lab_no: "ME-201",
          lab_name: "Mechanical Workshop",
          building: "Block B",
          floor: "1st Floor",
          department: "Mechanical",
        },
        {
          id: 4,
          lab_no: "ME-202",
          lab_name: "Thermodynamics Lab",
          building: "Block B",
          floor: "2nd Floor",
          department: "Mechanical",
        },
        {
          id: 5,
          lab_no: "EE-301",
          lab_name: "Electrical Circuits Lab",
          building: "Block C",
          floor: "3rd Floor",
          department: "Electrical",
        },
        {
          id: 6,
          lab_no: "EE-302",
          lab_name: "Power Systems Lab",
          building: "Block C",
          floor: "4th Floor",
          department: "Electrical",
        },
      ]);

      setIncharges([
        {
          id: 1,
          name: "Dr. John Smith",
          email: "john.smith@college.edu",
          phone: "+1-555-0101",
          assignedLabs: [1, 2],
          department: "Computer",
          created_at: new Date("2024-01-15"),
        },
        {
          id: 2,
          name: "Prof. Sarah Johnson",
          email: "sarah.j@college.edu",
          phone: "+1-555-0102",
          assignedLabs: [3],
          department: "Mechanical",
          created_at: new Date("2024-02-20"),
        },
        {
          id: 3,
          name: "Dr. Michael Brown",
          email: "m.brown@college.edu",
          phone: "+1-555-0103",
          assignedLabs: [4],
          department: "Mechanical",
          created_at: new Date("2024-03-10"),
        },
        {
          id: 4,
          name: "Prof. Emily Davis",
          email: "emily.d@college.edu",
          phone: "+1-555-0104",
          assignedLabs: [5, 6],
          department: "Electrical",
          created_at: new Date("2024-03-25"),
        },
      ]);

      setExpandedDepts({
        Computer: false,
        Mechanical: false,
        Electrical: false,
      });

      setLoading(false);
    }, 1000);
  }, []);

  const getLabById = (labId) => labs.find((lab) => lab.id === labId);

  const getLabsByIds = (labIds) =>
    labs.filter((lab) => labIds.includes(lab.id));

  const getInchargesByDepartment = (deptName) => {
    return incharges
      .filter((incharge) => incharge.department === deptName)
      .filter(
        (incharge) =>
          incharge.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          incharge.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          incharge.phone.includes(searchQuery)
      );
  };

  const toggleDepartment = (deptName) => {
    setExpandedDepts((prev) => ({
      ...prev,
      [deptName]: !prev[deptName],
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      assignedLabs: [],
      department: "",
    });
  };

  const handleAddIncharge = () => {
    const selectedLabs = getLabsByIds(formData.assignedLabs);
    const department =
      selectedLabs.length > 0
        ? selectedLabs[0].department
        : formData.department;

    setIncharges([
      ...incharges,
      {
        id: incharges.length + 1,
        ...formData,
        department: department,
        created_at: new Date(),
      },
    ]);
    setShowAddModal(false);
    resetForm();
  };

  const handleEditIncharge = (incharge) => {
    setEditingIncharge(incharge);
    setFormData({
      name: incharge.name,
      email: incharge.email,
      phone: incharge.phone,
      assignedLabs: incharge.assignedLabs,
      department: incharge.department,
    });
    setShowAddModal(true);
  };

  const handleUpdateIncharge = () => {
    const selectedLabs = getLabsByIds(formData.assignedLabs);
    const department =
      selectedLabs.length > 0
        ? selectedLabs[0].department
        : formData.department;

    setIncharges(
      incharges.map((i) =>
        i.id === editingIncharge.id
          ? {
              ...editingIncharge,
              ...formData,
              department: department,
            }
          : i
      )
    );
    setShowAddModal(false);
    setEditingIncharge(null);
    resetForm();
  };

  const confirmDeleteIncharge = () => {
    setIncharges(incharges.filter((i) => i.id !== deleteConfirmModal.id));
    setDeleteConfirmModal(null);
  };

  const getLabsForDepartment = (deptName) => {
    return labs.filter((lab) => lab.department === deptName);
  };

  const handleLabToggle = (labId) => {
    setFormData((prev) => ({
      ...prev,
      assignedLabs: prev.assignedLabs.includes(labId)
        ? prev.assignedLabs.filter((id) => id !== labId)
        : [...prev.assignedLabs, labId],
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-6 rounded-xl border">
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-8 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Lab In-charge by Department
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Manage lab in-charge organized by department
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {departments.map((dept) => {
            const deptIncharges = incharges.filter(
              (i) => i.department === dept.name
            );
            return (
              <div
                key={dept.id}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {dept.name}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {deptIncharges.length}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">In-charge</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <User className="text-blue-600" size={24} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="space-y-4">
          {departments.map((dept) => {
            const deptIncharges = getInchargesByDepartment(dept.name);
            const isExpanded = expandedDepts[dept.name];

            return (
              <div
                key={dept.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => toggleDepartment(dept.name)}
                  className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    {isExpanded ? (
                      <ChevronDown className="text-gray-600" size={20} />
                    ) : (
                      <ChevronRight className="text-gray-600" size={20} />
                    )}
                    <h3 className="text-lg font-bold text-gray-900">
                      {dept.name} Department
                    </h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                      {deptIncharges.length} In-charge
                      {deptIncharges.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </button>

                {isExpanded && (
                  <div className="overflow-x-auto">
                    {deptIncharges.length > 0 ? (
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              In-charge
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Email
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Phone
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Assigned Labs
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Added On
                            </th>
                            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {deptIncharges.map((incharge) => {
                            const assignedLabsList = getLabsByIds(
                              incharge.assignedLabs
                            );

                            return (
                              <tr
                                key={incharge.id}
                                className="hover:bg-gray-50 transition-colors"
                              >
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                                      <User className="text-white" size={18} />
                                    </div>
                                    <div className="ml-4">
                                      <div className="text-sm font-semibold text-gray-900">
                                        {incharge.name}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center text-sm text-gray-600">
                                    <Mail
                                      className="mr-2 text-blue-500 flex-shrink-0"
                                      size={14}
                                    />
                                    <span className="truncate max-w-xs">
                                      {incharge.email}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center text-sm text-gray-600">
                                    <Phone
                                      className="mr-2 text-green-500 flex-shrink-0"
                                      size={14}
                                    />
                                    {incharge.phone}
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  {assignedLabsList.length > 0 ? (
                                    <div className="space-y-1">
                                      {assignedLabsList
                                        .slice(0, 2)
                                        .map((lab) => (
                                          <div
                                            key={lab.id}
                                            className="flex items-center"
                                          >
                                            <Building
                                              className="mr-2 text-gray-400 flex-shrink-0"
                                              size={16}
                                            />
                                            <div>
                                              <div className="text-sm font-medium text-gray-900">
                                                {lab.lab_no}
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      {assignedLabsList.length > 2 && (
                                        <span className="text-xs text-blue-600 font-medium ml-6">
                                          +{assignedLabsList.length - 2} more
                                        </span>
                                      )}
                                    </div>
                                  ) : (
                                    <span className="text-sm text-gray-500 italic">
                                      No labs assigned
                                    </span>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                                  {new Date(
                                    incharge.created_at
                                  ).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center justify-center space-x-2">
                                    <button
                                      onClick={() =>
                                        setViewingIncharge(incharge)
                                      }
                                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                      title="View details"
                                    >
                                      <Eye size={18} />
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleEditIncharge(incharge)
                                      }
                                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                      title="Edit"
                                    >
                                      <Edit size={18} />
                                    </button>
                                    <button
                                      onClick={() =>
                                        setDeleteConfirmModal(incharge)
                                      }
                                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                      title="Delete"
                                    >
                                      <Trash2 size={18} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    ) : (
                      <div className="text-center py-12">
                        <User className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                          No in-charge found
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {searchQuery
                            ? "Try adjusting your search query"
                            : `No in-charge in ${dept.name} department yet`}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl z-10">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingIncharge
                    ? "Edit Lab In-charge"
                    : "Add New Lab In-charge"}
                </h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingIncharge(null);
                    resetForm();
                  }}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Personal Information
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Dr. John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="john.doe@college.edu"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+1-555-0123"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Lab Assignment
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  Select one or more labs to assign to this in-charge. All labs
                  must be from the same department.
                </p>

                <div className="space-y-3">
                  {departments.map((dept) => {
                    const deptLabs = getLabsForDepartment(dept.name);
                    return (
                      <div
                        key={dept.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <h5 className="font-semibold text-gray-900 mb-3">
                          {dept.name} Department
                        </h5>
                        <div className="space-y-2">
                          {deptLabs.map((lab) => (
                            <label
                              key={lab.id}
                              className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                            >
                              <input
                                type="checkbox"
                                checked={formData.assignedLabs.includes(lab.id)}
                                onChange={() => handleLabToggle(lab.id)}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <div className="ml-3 flex-1">
                                <div className="flex items-center">
                                  <Building
                                    className="mr-2 text-gray-400"
                                    size={16}
                                  />
                                  <span className="text-sm font-medium text-gray-900">
                                    {lab.lab_no} - {lab.lab_name}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-500 ml-6">
                                  {lab.building} - {lab.floor}
                                </p>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {formData.assignedLabs.length > 0 && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm font-semibold text-gray-900 mb-2">
                      Selected Labs ({formData.assignedLabs.length}):
                    </p>
                    <div className="space-y-1">
                      {getLabsByIds(formData.assignedLabs).map((lab) => (
                        <div key={lab.id} className="text-xs text-gray-600">
                          • {lab.lab_no} - {lab.lab_name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="sticky bottom-0 p-6 border-t border-gray-200 flex justify-end space-x-3 bg-gray-50 rounded-b-2xl z-10">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingIncharge(null);
                  resetForm();
                }}
                className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={
                  editingIncharge ? handleUpdateIncharge : handleAddIncharge
                }
                disabled={
                  !formData.name ||
                  !formData.email ||
                  !formData.phone ||
                  formData.assignedLabs.length === 0
                }
                className="flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="mr-2" size={18} />
                {editingIncharge ? "Update" : "Add"} In-charge
              </button>
            </div>
          </div>
        </div>
      )}

      {viewingIncharge && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                    <User className="text-white" size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {viewingIncharge.name}
                    </h3>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 mt-1">
                      {viewingIncharge.department} Department
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setViewingIncharge(null)}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Contact Information
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <Mail className="mr-3 text-blue-500" size={20} />
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Email</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {viewingIncharge.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <Phone className="mr-3 text-green-500" size={20} />
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Phone</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {viewingIncharge.phone}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Assigned Labs ({viewingIncharge.assignedLabs.length})
                </h4>
                {viewingIncharge.assignedLabs.length > 0 ? (
                  <div className="space-y-3">
                    {getLabsByIds(viewingIncharge.assignedLabs).map((lab) => (
                      <div
                        key={lab.id}
                        className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Building className="text-blue-600" size={20} />
                          </div>
                          <div>
                            <p className="text-base font-semibold text-gray-900">
                              {lab.lab_no}
                            </p>
                            <p className="text-sm text-gray-600">
                              {lab.lab_name}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {lab.building} - {lab.floor}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Building className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                    <p className="text-gray-500 font-medium">
                      No labs assigned yet
                    </p>
                  </div>
                )}
              </div>

              <div className="text-center text-sm text-gray-500 pt-4 border-t border-gray-200">
                Added on:{" "}
                {new Date(viewingIncharge.created_at).toLocaleDateString(
                  "en-US",
                  { month: "long", day: "numeric", year: "numeric" }
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center border-2 border-red-200">
                  <AlertTriangle className="text-red-600" size={32} />
                </div>
              </div>
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Delete Lab In-charge
                </h3>
                <p className="text-base text-gray-600 mb-4">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-gray-900">
                    {deleteConfirmModal.name}
                  </span>
                  ?
                </p>
                <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                  This action cannot be undone. The in-charge will be removed
                  from their assigned labs.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => setDeleteConfirmModal(null)}
                  className="w-full sm:w-auto px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteIncharge}
                  className="flex items-center justify-center w-full sm:w-auto px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-sm"
                >
                  <Trash2 className="mr-2" size={18} />
                  Delete In-charge
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabIncharge;
