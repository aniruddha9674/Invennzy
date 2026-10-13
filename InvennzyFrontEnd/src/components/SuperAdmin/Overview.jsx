import React, { useState, useEffect } from "react";
import {
  Building,
  Users,
  UserCheck,
  Monitor,
  Projector,
  Zap,
  Fan,
  Wifi,
  Box,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock,
  Activity,
  BarChart3,
  PieChart,
} from "lucide-react";

const Overview = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    labs: {
      total: 0,
      active: 0,
      maintenance: 0,
      inactive: 0,
    },
    equipment: {
      monitors: 0,
      projectors: 0,
      switchBoards: 0,
      fans: 0,
      wifi: 0,
      others: 0,
      total: 0,
    },
    staff: {
      admins: 0,
      incharges: 0,
      assistants: 0,
      total: 0,
    },
    departments: 0,
    recentActivity: [],
  });

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        labs: {
          total: 25,
          active: 20,
          maintenance: 3,
          inactive: 2,
        },
        equipment: {
          monitors: 450,
          projectors: 25,
          switchBoards: 120,
          fans: 180,
          wifi: 50,
          others: 75,
          total: 900,
        },
        staff: {
          admins: 8,
          incharges: 15,
          assistants: 22,
          total: 45,
        },
        departments: 6,
        recentActivity: [
          {
            id: 1,
            type: "lab_added",
            message: "New lab CS-103 added",
            time: "2 hours ago",
            icon: Building,
            color: "blue",
          },
          {
            id: 2,
            type: "equipment_update",
            message: "Equipment updated in Lab-404",
            time: "5 hours ago",
            icon: Monitor,
            color: "green",
          },
          {
            id: 3,
            type: "maintenance",
            message: "Lab ME-301 under maintenance",
            time: "1 day ago",
            icon: AlertCircle,
            color: "yellow",
          },
          {
            id: 4,
            type: "staff_assigned",
            message: "New assistant assigned to PH-201",
            time: "2 days ago",
            icon: UserCheck,
            color: "purple",
          },
        ],
      });
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusPercentage = (value, total) => {
    return total > 0 ? ((value / total) * 100).toFixed(1) : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white p-6 rounded-xl border h-32">
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
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Dashboard Overview
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Welcome back! Here's what's happening in your labs today.
          </p>
        </div>

        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <Building className="text-white" size={24} />
              </div>
              <span className="flex items-center text-green-600 text-sm font-medium">
                <TrendingUp size={16} className="mr-1" />
                8%
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Labs</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stats.labs.total}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {stats.labs.active} Active • {stats.labs.maintenance}{" "}
                Maintenance
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <Monitor className="text-white" size={24} />
              </div>
              <span className="flex items-center text-green-600 text-sm font-medium">
                <TrendingUp size={16} className="mr-1" />
                12%
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Equipment
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stats.equipment.total}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Across all laboratories
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <Users className="text-white" size={24} />
              </div>
              <span className="flex items-center text-green-600 text-sm font-medium">
                <TrendingUp size={16} className="mr-1" />
                5%
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Staff</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stats.staff.total}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {stats.staff.incharges} In-charges • {stats.staff.assistants}{" "}
                Assistants
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                <Activity className="text-white" size={24} />
              </div>
              <span className="flex items-center text-gray-600 text-sm font-medium">
                <Activity size={16} className="mr-1" />
                Live
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Departments</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stats.departments}
              </p>
              <p className="text-xs text-gray-500 mt-2">Active departments</p>
            </div>
          </div>
        </div>

        {/* Lab Status Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Laboratory Status
              </h2>
              <BarChart3 className="text-gray-400" size={20} />
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="text-green-600" size={18} />
                    <span className="text-sm font-medium text-gray-700">
                      Active Labs
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {stats.labs.active} (
                    {getStatusPercentage(stats.labs.active, stats.labs.total)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${getStatusPercentage(
                        stats.labs.active,
                        stats.labs.total
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Clock className="text-yellow-600" size={18} />
                    <span className="text-sm font-medium text-gray-700">
                      Under Maintenance
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {stats.labs.maintenance} (
                    {getStatusPercentage(
                      stats.labs.maintenance,
                      stats.labs.total
                    )}
                    %)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-yellow-500 h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${getStatusPercentage(
                        stats.labs.maintenance,
                        stats.labs.total
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="text-red-600" size={18} />
                    <span className="text-sm font-medium text-gray-700">
                      Inactive Labs
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {stats.labs.inactive} (
                    {getStatusPercentage(stats.labs.inactive, stats.labs.total)}
                    %)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-red-500 h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${getStatusPercentage(
                        stats.labs.inactive,
                        stats.labs.total
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Staff Distribution
              </h2>
              <PieChart className="text-gray-400" size={20} />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <UserCheck className="text-white" size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Admins</p>
                    <p className="text-xs text-gray-600">
                      System administrators
                    </p>
                  </div>
                </div>
                <span className="text-xl font-bold text-blue-600">
                  {stats.staff.admins}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <UserCheck className="text-white" size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      In-charges
                    </p>
                    <p className="text-xs text-gray-600">Lab in-charges</p>
                  </div>
                </div>
                <span className="text-xl font-bold text-green-600">
                  {stats.staff.incharges}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Users className="text-white" size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Assistants
                    </p>
                    <p className="text-xs text-gray-600">Lab assistants</p>
                  </div>
                </div>
                <span className="text-xl font-bold text-purple-600">
                  {stats.staff.assistants}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Equipment Overview */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Equipment Inventory
            </h2>
            <span className="text-sm text-gray-600">
              Total: {stats.equipment.total} items
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Monitor className="mx-auto text-blue-600 mb-2" size={28} />
              <p className="text-2xl font-bold text-gray-900">
                {stats.equipment.monitors}
              </p>
              <p className="text-xs text-gray-600 mt-1">Monitors</p>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <Projector className="mx-auto text-purple-600 mb-2" size={28} />
              <p className="text-2xl font-bold text-gray-900">
                {stats.equipment.projectors}
              </p>
              <p className="text-xs text-gray-600 mt-1">Projectors</p>
            </div>

            <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <Zap className="mx-auto text-yellow-600 mb-2" size={28} />
              <p className="text-2xl font-bold text-gray-900">
                {stats.equipment.switchBoards}
              </p>
              <p className="text-xs text-gray-600 mt-1">Switch Boards</p>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <Fan className="mx-auto text-green-600 mb-2" size={28} />
              <p className="text-2xl font-bold text-gray-900">
                {stats.equipment.fans}
              </p>
              <p className="text-xs text-gray-600 mt-1">Fans</p>
            </div>

            <div className="text-center p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <Wifi className="mx-auto text-indigo-600 mb-2" size={28} />
              <p className="text-2xl font-bold text-gray-900">
                {stats.equipment.wifi}
              </p>
              <p className="text-xs text-gray-600 mt-1">WiFi Points</p>
            </div>

            <div className="text-center p-4 bg-pink-50 rounded-lg border border-pink-200">
              <Box className="mx-auto text-pink-600 mb-2" size={28} />
              <p className="text-2xl font-bold text-gray-900">
                {stats.equipment.others}
              </p>
              <p className="text-xs text-gray-600 mt-1">Others</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Activity
            </h2>
            <Activity className="text-gray-400" size={20} />
          </div>
          <div className="space-y-4">
            {stats.recentActivity.map((activity) => {
              const Icon = activity.icon;
              const colorClasses = {
                blue: "bg-blue-100 text-blue-600",
                green: "bg-green-100 text-green-600",
                yellow: "bg-yellow-100 text-yellow-600",
                purple: "bg-purple-100 text-purple-600",
              };

              return (
                <div
                  key={activity.id}
                  className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      colorClasses[activity.color]
                    }`}
                  >
                    <Icon size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {activity.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
