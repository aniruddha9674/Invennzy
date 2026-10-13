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

const LabAssistants = () => {
  const [assistants, setAssistants] = useState([]);
  const [labs, setLabs] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAssistant, setEditingAssistant] = useState(null);
  const [viewingAssistant, setViewingAssistant] = useState(null);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState(null);
  const [expandedDepts, setExpandedDepts] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    assignedLab: null,
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

      setAssistants([
        {
          id: 1,
          name: "John Smith",
          email: "john.smith@college.edu",
          phone: "+1-555-0101",
          assignedLab: 1,
          department: "Computer",
          created_at: new Date("2024-01-15"),
        },
        {
          id: 2,
          name: "Sarah Johnson",
          email: "sarah.j@college.edu",
          phone: "+1-555-0102",
          assignedLab: 2,
          department: "Computer",
          created_at: new Date("2024-02-20"),
        },
        {
          id: 3,
          name: "Michael Brown",
          email: "m.brown@college.edu",
          phone: "+1-555-0103",
          assignedLab: 3,
          department: "Mechanical",
          created_at: new Date("2024-03-10"),
        },
        {
          id: 4,
          name: "Emily Davis",
          email: "emily.d@college.edu",
          phone: "+1-555-0104",
          assignedLab: 4,
          department: "Mechanical",
          created_at: new Date("2024-03-25"),
        },
        {
          id: 5,
          name: "David Wilson",
          email: "d.wilson@college.edu",
          phone: "+1-555-0105",
          assignedLab: 5,
          department: "Electrical",
          created_at: new Date("2024-04-10"),
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

  const getAssistantsByDepartment = (deptName) => {
    return assistants
      .filter((assistant) => assistant.department === deptName)
      .filter(
        (assistant) =>
          assistant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          assistant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          assistant.phone.includes(searchQuery)
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
      assignedLab: null,
      department: "",
    });
  };

  const handleAddAssistant = () => {
    const lab = getLabById(formData.assignedLab);
    setAssistants([
      ...assistants,
      {
        id: assistants.length + 1,
        ...formData,
        department: lab?.department || formData.department,
        created_at: new Date(),
      },
    ]);
    setShowAddModal(false);
    resetForm();
  };

  const handleEditAssistant = (assistant) => {
    setEditingAssistant(assistant);
    setFormData({
      name: assistant.name,
      email: assistant.email,
      phone: assistant.phone,
      assignedLab: assistant.assignedLab,
      department: assistant.department,
    });
    setShowAddModal(true);
  };

  const handleUpdateAssistant = () => {
    const lab = getLabById(formData.assignedLab);
    setAssistants(
      assistants.map((a) =>
        a.id === editingAssistant.id
          ? {
              ...editingAssistant,
              ...formData,
              department: lab?.department || formData.department,
            }
          : a
      )
    );
    setShowAddModal(false);
    setEditingAssistant(null);
    resetForm();
  };

  const confirmDeleteAssistant = () => {
    setAssistants(assistants.filter((a) => a.id !== deleteConfirmModal.id));
    setDeleteConfirmModal(null);
  };

  const getLabsForDepartment = (deptName) => {
    return labs.filter((lab) => lab.department === deptName);
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
              Lab Assistants by Department
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Manage lab assistants organized by department
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm w-full sm:w-auto justify-center font-medium"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Assistant
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {departments.map((dept) => {
            const deptAssistants = assistants.filter(
              (a) => a.department === dept.name
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
                      {deptAssistants.length}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Assistants</p>
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
            const deptAssistants = getAssistantsByDepartment(dept.name);
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
                      {deptAssistants.length} Assistant
                      {deptAssistants.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </button>

                {isExpanded && (
                  <div className="overflow-x-auto">
                    {deptAssistants.length > 0 ? (
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Assistant
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Email
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Phone
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Assigned Lab
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
                          {deptAssistants.map((assistant) => {
                            const assignedLab = getLabById(
                              assistant.assignedLab
                            );

                            return (
                              <tr
                                key={assistant.id}
                                className="hover:bg-gray-50 transition-colors"
                              >
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                                      <User className="text-white" size={18} />
                                    </div>
                                    <div className="ml-4">
                                      <div className="text-sm font-semibold text-gray-900">
                                        {assistant.name}
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
                                      {assistant.email}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center text-sm text-gray-600">
                                    <Phone
                                      className="mr-2 text-green-500 flex-shrink-0"
                                      size={14}
                                    />
                                    {assistant.phone}
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  {assignedLab ? (
                                    <div className="flex items-center">
                                      <Building
                                        className="mr-2 text-gray-400 flex-shrink-0"
                                        size={16}
                                      />
                                      <div>
                                        <div className="text-sm font-medium text-gray-900">
                                          {assignedLab.lab_no}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          {assignedLab.building} -{" "}
                                          {assignedLab.floor}
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <span className="text-sm text-gray-500 italic">
                                      No lab assigned
                                    </span>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                                  {new Date(
                                    assistant.created_at
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
                                        setViewingAssistant(assistant)
                                      }
                                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                      title="View details"
                                    >
                                      <Eye size={18} />
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleEditAssistant(assistant)
                                      }
                                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                      title="Edit"
                                    >
                                      <Edit size={18} />
                                    </button>
                                    <button
                                      onClick={() =>
                                        setDeleteConfirmModal(assistant)
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
                          No assistants found
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {searchQuery
                            ? "Try adjusting your search query"
                            : `No assistants in ${dept.name} department yet`}
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
                  {editingAssistant
                    ? "Edit Lab Assistant"
                    : "Add New Lab Assistant"}
                </h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingAssistant(null);
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
                      placeholder="John Doe"
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
                  Select one lab to assign to this assistant
                </p>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Assigned Lab <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.assignedLab || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        assignedLab: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a lab...</option>
                    {departments.map((dept) => (
                      <optgroup key={dept.id} label={dept.name}>
                        {getLabsForDepartment(dept.name).map((lab) => (
                          <option key={lab.id} value={lab.id}>
                            {lab.lab_no} - {lab.lab_name} ({lab.building})
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                {formData.assignedLab && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start space-x-3">
                      <Building className="text-blue-600 mt-1" size={20} />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {getLabById(formData.assignedLab)?.lab_no} -{" "}
                          {getLabById(formData.assignedLab)?.lab_name}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {getLabById(formData.assignedLab)?.building} -{" "}
                          {getLabById(formData.assignedLab)?.floor}
                        </p>
                        <p className="text-xs font-medium text-blue-600 mt-1">
                          Department:{" "}
                          {getLabById(formData.assignedLab)?.department}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="sticky bottom-0 p-6 border-t border-gray-200 flex justify-end space-x-3 bg-gray-50 rounded-b-2xl z-10">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingAssistant(null);
                  resetForm();
                }}
                className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={
                  editingAssistant ? handleUpdateAssistant : handleAddAssistant
                }
                disabled={
                  !formData.name ||
                  !formData.email ||
                  !formData.phone ||
                  !formData.assignedLab
                }
                className="flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="mr-2" size={18} />
                {editingAssistant ? "Update" : "Add"} Assistant
              </button>
            </div>
          </div>
        </div>
      )}

      {viewingAssistant && (
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
                      {viewingAssistant.name}
                    </h3>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 mt-1">
                      {viewingAssistant.department} Department
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setViewingAssistant(null)}
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
                        {viewingAssistant.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <Phone className="mr-3 text-green-500" size={20} />
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Phone</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {viewingAssistant.phone}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Assigned Lab
                </h4>
                {viewingAssistant.assignedLab ? (
                  <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Building className="text-blue-600" size={20} />
                      </div>
                      <div>
                        <p className="text-base font-semibold text-gray-900">
                          {getLabById(viewingAssistant.assignedLab)?.lab_no}
                        </p>
                        <p className="text-sm text-gray-600">
                          {getLabById(viewingAssistant.assignedLab)?.lab_name}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {getLabById(viewingAssistant.assignedLab)?.building} -{" "}
                          {getLabById(viewingAssistant.assignedLab)?.floor}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Building className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                    <p className="text-gray-500 font-medium">
                      No lab assigned yet
                    </p>
                  </div>
                )}
              </div>

              <div className="text-center text-sm text-gray-500 pt-4 border-t border-gray-200">
                Added on:{" "}
                {new Date(viewingAssistant.created_at).toLocaleDateString(
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
                  Delete Lab Assistant
                </h3>
                <p className="text-base text-gray-600 mb-4">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-gray-900">
                    {deleteConfirmModal.name}
                  </span>
                  ?
                </p>
                <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                  This action cannot be undone. The assistant will be removed
                  from their assigned lab.
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
                  onClick={confirmDeleteAssistant}
                  className="flex items-center justify-center w-full sm:w-auto px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-sm"
                >
                  <Trash2 className="mr-2" size={18} />
                  Delete Assistant
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabAssistants;
