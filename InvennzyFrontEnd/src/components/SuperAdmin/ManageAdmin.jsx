import React, { useState, useEffect } from "react";
import {
  Users,
  Mail,
  Phone,
  Building,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  X,
  Save,
  AlertTriangle,
  UserCheck,
  Shield,
  Award,
} from "lucide-react";

const ManageAdmin = () => {
  const [admins, setAdmins] = useState([
    {
      id: 1,
      name: "Dr. John Smith",
      email: "john.smith@college.edu",
      phone: "+1-555-0123",
      department: "Computer Science",
      createdAt: new Date("2024-01-15"),
    },
    {
      id: 2,
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@college.edu",
      phone: "+1-555-0124",
      department: "Electronics",
      createdAt: new Date("2024-02-20"),
    },
    {
      id: 3,
      name: "Dr. Michael Chen",
      email: "michael.chen@college.edu",
      phone: "+1-555-0125",
      department: "Mechanical",
      createdAt: new Date("2024-03-10"),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [viewingAdmin, setViewingAdmin] = useState(null);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
  });

  const departments = [
    "Computer Science",
    "Electronics",
    "Mechanical",
    "Civil",
    "Information Technology",
    "Electrical",
  ];

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      department: "",
    });
  };

  const handleAddAdmin = () => {
    const newAdmin = {
      id: admins.length + 1,
      ...formData,
      createdAt: new Date(),
    };
    setAdmins([...admins, newAdmin]);
    setShowAddModal(false);
    resetForm();
  };

  const handleEditAdmin = (admin) => {
    setEditingAdmin(admin);
    setFormData({
      name: admin.name,
      email: admin.email,
      phone: admin.phone,
      department: admin.department,
    });
    setShowAddModal(true);
  };

  const handleUpdateAdmin = () => {
    setAdmins(
      admins.map((admin) =>
        admin.id === editingAdmin.id ? { ...admin, ...formData } : admin
      )
    );
    setShowAddModal(false);
    setEditingAdmin(null);
    resetForm();
  };

  const handleDeleteAdmin = (admin) => {
    setDeleteConfirmModal(admin);
  };

  const confirmDeleteAdmin = () => {
    setAdmins(admins.filter((admin) => admin.id !== deleteConfirmModal.id));
    setDeleteConfirmModal(null);
  };

  const filteredAdmins = admins.filter((admin) => {
    const matchesSearch =
      admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterDepartment === "all" || admin.department === filterDepartment;
    return matchesSearch && matchesFilter;
  });

  const departmentCounts = departments.reduce((acc, dept) => {
    acc[dept] = admins.filter((admin) => admin.department === dept).length;
    return acc;
  }, {});

  return (
    <div className="space-y-6 p-2 sm:p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Manage Administrators
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Manage administrative staff and their departments
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Admin
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Users className="text-white" size={20} />
            </div>
            <div className="text-right">
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                Total Admins
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {admins.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <Building className="text-white" size={20} />
            </div>
            <div className="text-right">
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                Departments
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {departments.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <Shield className="text-white" size={20} />
            </div>
            <div className="text-right">
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                Active
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {admins.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
              <Award className="text-white" size={20} />
            </div>
            <div className="text-right">
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                New This Month
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {
                  admins.filter(
                    (a) =>
                      new Date(a.createdAt).getMonth() === new Date().getMonth()
                  ).length
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by name, email, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Admin Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Sr No
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAdmins.map((admin, index) => (
                <tr
                  key={admin.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <UserCheck className="text-blue-600" size={16} />
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {admin.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="mr-2 text-gray-400" size={14} />
                      {admin.email}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="mr-2 text-gray-400" size={14} />
                      {admin.phone}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <Building className="mr-1" size={12} />
                      {admin.department}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => setViewingAdmin(admin)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleEditAdmin(admin)}
                        className="p-1.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        title="Edit admin"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteAdmin(admin)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete admin"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredAdmins.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600 text-lg">No administrators found</p>
            <p className="text-gray-500 text-sm mt-2">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Admin Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-300 ring-1 ring-gray-200">
            <div className="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                  {editingAdmin
                    ? "Edit Administrator"
                    : "Add New Administrator"}
                </h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingAdmin(null);
                    resetForm();
                  }}
                  className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            <div className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  placeholder="Dr. John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  placeholder="john.doe@college.edu"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  placeholder="+1-555-0123"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="p-4 sm:p-6 border-t border-gray-200 flex justify-end space-x-2 sm:space-x-3 bg-gray-50">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingAdmin(null);
                  resetForm();
                }}
                className="px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={editingAdmin ? handleUpdateAdmin : handleAddAdmin}
                className="flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg text-sm sm:text-base"
              >
                <Save className="mr-1.5 sm:mr-2" size={16} />
                {editingAdmin ? "Update Admin" : "Add Admin"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Admin Modal */}
      {viewingAdmin && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-300 ring-1 ring-gray-200">
            <div className="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Administrator Details
                </h3>
                <button
                  onClick={() => setViewingAdmin(null)}
                  className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            <div className="p-4 sm:p-6 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                  <UserCheck className="text-white" size={32} />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900">
                    {viewingAdmin.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {viewingAdmin.department}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center mb-2">
                    <Mail className="text-blue-600 mr-2" size={18} />
                    <p className="text-sm font-medium text-gray-600">Email</p>
                  </div>
                  <p className="text-base text-gray-900 ml-7">
                    {viewingAdmin.email}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center mb-2">
                    <Phone className="text-green-600 mr-2" size={18} />
                    <p className="text-sm font-medium text-gray-600">Phone</p>
                  </div>
                  <p className="text-base text-gray-900 ml-7">
                    {viewingAdmin.phone}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center mb-2">
                    <Building className="text-purple-600 mr-2" size={18} />
                    <p className="text-sm font-medium text-gray-600">
                      Department
                    </p>
                  </div>
                  <p className="text-base text-gray-900 ml-7">
                    {viewingAdmin.department}
                  </p>
                </div>
              </div>
              <div className="text-center text-sm text-gray-500 pt-4 border-t border-gray-200">
                Added on:{" "}
                {new Date(viewingAdmin.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmModal && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl border border-gray-300 ring-1 ring-gray-200">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-center mb-3 sm:mb-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center border-2 border-red-200">
                  <AlertTriangle className="text-red-600" size={24} />
                </div>
              </div>
              <div className="text-center mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  Delete Administrator
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-gray-900">
                    {deleteConfirmModal.name}
                  </span>
                  ?
                </p>
                <p className="text-xs sm:text-sm text-red-600 bg-red-50 p-2 sm:p-3 rounded-lg border border-red-200">
                  This action cannot be undone. All admin access and data will
                  be permanently removed.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => setDeleteConfirmModal(null)}
                  className="w-full sm:w-auto px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteAdmin}
                  className="flex items-center justify-center w-full sm:w-auto px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-lg text-sm sm:text-base"
                >
                  <Trash2 className="mr-1.5 sm:mr-2" size={16} />
                  Delete Admin
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAdmin;
