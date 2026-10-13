import React, { useState, useEffect } from "react";
import {
  Search,
  Download,
  FileText,
  AlertCircle,
  RefreshCw,
  IndianRupee,
  Package,
  Eye,
  Building2,
  CheckCircle2,
  Users,
  TrendingUp,
  UserCheck,
  UserCircle,
  Calendar,
  Edit,
  Trash2,
} from "lucide-react";
import api from "../../Utils/BackEnd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EquipmentDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadingIds, setDownloadingIds] = useState(new Set());
  const [viewingLab, setViewingLab] = useState(null);
  const [currentLabDeadstock, setCurrentLabDeadstock] = useState([]);
  const [modalSearchTerm, setModalSearchTerm] = useState("");
  const [loadingDeadstock, setLoadingDeadstock] = useState(false);

  // Fetch labs from backend
  const fetchLabs = async () => {
    try {
      setLoading(true);
      setError(null);

      const adminId = localStorage.getItem("adminId");
      const response = await api.get(`/api/labs/admin/${adminId}`);

      const data = response.data;
      console.log("Labs fetched:", data);

      setLabs(data);
    } catch (err) {
      console.error("Error fetching labs:", err);
      if (err.name === "TypeError") {
        setError(
          "Network Error: Unable to connect to server. Please check your connection.",
        );
      } else {
        setError(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAllDeadstock = async (lab) => {
    try {
      const labId = lab.id;
      const response = await api.get(`/api/fetch/lab/deadstock?labId=${labId}`);
      const data = response.data;

      if (data.message === "No equipment found" || data.data?.length === 0) {
        setCurrentLabDeadstock([]);
      } else {
        setCurrentLabDeadstock(data.data || data);
      }
    } catch (err) {
      console.error("Error fetching deadstock:", err);
      setCurrentLabDeadstock([]);
    }
  };

  const handleView = async (lab) => {
    const labId = lab.id;
    console.log("Opening modal for lab:", labId, lab);

    setViewingLab(lab);
    setModalSearchTerm("");
    setLoadingDeadstock(true);

    await fetchAllDeadstock(lab);

    setLoadingDeadstock(false);
  };

  const handleDownload = async (labId) => {
    try {
      setDownloadingIds((prev) => new Set([...prev, labId]));

      const response = await api.get(
        `/api/downloads/deadstock-full-report?labId=${labId}`,
        {
          responseType: "blob",
          headers: {
            Accept: "application/pdf",
          },
        },
      );

      const blob = response.data;

      const url = window.URL.createObjectURL(blob);
      const fileName = `Deadstock_Report_Lab_${labId}_${new Date()
        .toISOString()
        .slice(0, 10)}.pdf`;

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        toast.error("No equipment found to generate PDF for this lab.");
      } else {
        toast.error("Failed to download report. Please try again later.");
      }
    } finally {
      setDownloadingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(labId);
        return newSet;
      });
    }
  };

  // Get filtered items for modal
  const getFilteredModalItems = () => {
    if (!viewingLab) return [];

    const items = currentLabDeadstock;

    if (!modalSearchTerm) return items;

    const searchLower = modalSearchTerm.toLowerCase();
    return items.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchLower),
      ),
    );
  };

  // Calculate summary for modal
  const getModalSummary = () => {
    if (!viewingLab) return { totalValue: 0, totalItems: 0 };

    const items = currentLabDeadstock;

    const totalValue = items.reduce(
      (sum, item) => sum + Number(item.total_incl_gst || item.cost || 0),
      0,
    );

    return {
      totalValue,
      totalItems: items.length,
    };
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchLabs();
  }, []);

  // Calculate summary statistics
  const totalLabs = labs.length;
  const activeLabs = labs.length;
  const totalStaff = labs.reduce((count, lab) => {
    let staffCount = 0;
    if (lab.inchargeName || lab.incharge_name) staffCount++;
    if (lab.assistantName || lab.assistant_name) staffCount++;
    return count + staffCount;
  }, 0);
  const utilizationRate =
    totalLabs > 0 ? Math.round((activeLabs / totalLabs) * 100) : 0;

  // Filter data based on search
  const filteredData = labs.filter((lab) => {
    const matchesSearch =
      lab.lab_id?.toString().includes(searchTerm.toLowerCase()) ||
      lab.labNo?.toString().includes(searchTerm.toLowerCase()) ||
      lab.lab_no?.toString().includes(searchTerm.toLowerCase()) ||
      lab.labName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lab.lab_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lab.block?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lab.building?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lab.inchargeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lab.incharge_name?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const handleRefresh = () => {
    fetchLabs();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading labs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">
            Laboratory Management Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Monitor and manage laboratory information in real-time
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Last updated: {new Date().toLocaleTimeString()}
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Total Laboratories */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-blue-600">Total</span>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-gray-900">{totalLabs}</p>
              <p className="text-sm text-gray-600">Total Laboratories</p>
            </div>
          </div>

          {/* Active Labs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-sm font-medium text-green-600">Active</span>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-gray-900">{activeLabs}</p>
              <p className="text-sm text-gray-600">Active Labs</p>
            </div>
          </div>

          {/* Total Staff */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-50 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-purple-600">Staff</span>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-gray-900">{totalStaff}</p>
              <p className="text-sm text-gray-600">Total Staff Members</p>
            </div>
          </div>

          {/* Utilization Rate */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-50 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <span className="text-sm font-medium text-orange-600">Rate</span>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-gray-900">
                {utilizationRate}%
              </p>
              <p className="text-sm text-gray-600">Lab Utilization</p>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by ID, name, block, or incharge..."
                className="pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={handleRefresh}
              className="bg-blue-500 text-white px-4 py-2.5 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Labs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredData.map((lab) => (
            <div
              key={lab.lab_id || lab.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 overflow-hidden"
            >
              {/* Header Section */}
              <div className="px-6 py-5 border-b border-gray-100">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {lab.labNo || lab.lab_no || lab.lab_id || lab.id || "N/A"}
                  </h3>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" />
                    active
                  </span>
                </div>
                <p className="text-base text-gray-700 font-medium">
                  {lab.labName || lab.lab_name || "Lab Name"}
                </p>
              </div>

              {/* Body Section */}
              <div className="px-6 py-4">
                {/* Lab Info */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2.5 text-sm text-gray-600">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span>
                      {lab.block || lab.building || "Building"} -{" "}
                      {lab.inchargeName?.split(" ")[0] ||
                        lab.incharge_name?.split(" ")[0] ||
                        "Department"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-gray-600">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span>Capacity: 30 students</span>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100 my-4"></div>

                {/* Staff Information */}
                <div className="space-y-2.5 mb-5">
                  <div className="flex items-center gap-2.5 text-sm">
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    <span className="text-gray-500">In-charge:</span>
                    <span className="text-gray-900 font-medium">
                      {lab.inchargeName || lab.incharge_name || "Not assigned"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm">
                    <UserCircle className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-500">Assistant:</span>
                    <span className="text-gray-900">
                      {lab.assistantName ||
                        lab.assistant_name ||
                        "Not assigned"}
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100 my-4"></div>

                {/* Footer with Date and Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Updated: {new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleView(lab)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDownload(lab.lab_id || lab.id)}
                      disabled={downloadingIds.has(lab.lab_id || lab.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        downloadingIds.has(lab.lab_id || lab.id)
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-red-600 hover:bg-red-50"
                      }`}
                      title="Download PDF"
                    >
                      {downloadingIds.has(lab.lab_id || lab.id) ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400"></div>
                      ) : (
                        <Download className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredData.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              No labs found
            </div>
          )}
        </div>

        {/* View Modal */}
        {viewingLab && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">
                  Deadstock Details -{" "}
                  {viewingLab.labName || viewingLab.lab_name}
                </h2>
                <button
                  onClick={() => setViewingLab(null)}
                  className="text-gray-500 hover:text-gray-700 p-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              {/* Modal Search */}
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search in this lab..."
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={modalSearchTerm}
                    onChange={(e) => setModalSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Modal Content */}
              <div className="overflow-y-auto flex-grow">
                {loadingDeadstock ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-gray-600">
                          Total Value (Incl. GST)
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          ₹
                          {getModalSummary().totalValue.toLocaleString("en-IN")}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-gray-600">
                          Total Items
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {getModalSummary().totalItems}
                        </p>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Sr No
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Equipment
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Vendor
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                DS Number
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Purchase Year
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Qty
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Rate
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                GST%
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Total Cost
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {getFilteredModalItems().length > 0 ? (
                              getFilteredModalItems().map((item, index) => (
                                <tr
                                  key={item.id || index}
                                  className="hover:bg-gray-50"
                                >
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                    {index + 1}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                    {item.equipment_name || "N/A"}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                    {item.name || item.vendor_name || "N/A"}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                    {item.ds_number || "N/A"}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                    {item.purchase_year || "N/A"}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                    {item.quantity || 0}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                    ₹
                                    {item.subtotal_excl_gst && item.quantity
                                      ? (
                                          parseFloat(item.subtotal_excl_gst) /
                                          parseInt(item.quantity)
                                        ).toFixed(2)
                                      : item.cost && item.quantity
                                        ? (
                                            parseFloat(item.cost) /
                                            parseInt(item.quantity)
                                          ).toFixed(2)
                                        : "0.00"}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                    {item.gst_rate || "18.00"}%
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                    ₹
                                    {(
                                      item.total_incl_gst ||
                                      item.cost ||
                                      0
                                    ).toLocaleString("en-IN")}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td
                                  colSpan="9"
                                  className="px-4 py-8 text-center text-gray-500"
                                >
                                  No items match your search criteria
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Showing {getFilteredModalItems().length} of{" "}
                  {currentLabDeadstock.length} items
                </div>
                <button
                  onClick={() => setViewingLab(null)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default EquipmentDashboard;
