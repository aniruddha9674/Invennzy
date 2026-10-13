import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import {
  FileText,
  Download,
  Search,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  RefreshCw,
  User,
  Building,
  ChevronDown,
  X,
  XCircle,
} from "lucide-react";
import api from "../../Utils/BackEnd";

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch reports from the same API endpoint as notifications
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/admin/reports");

        // Filter only approved or rejected reports (completed actions)
        const completedReports = response.data.filter(
          (notification) =>
            notification.adminApprovalStatus === "approved" ||
            notification.adminApprovalStatus === "rejected",
        );

        setReports(completedReports);
        setFilteredReports(completedReports);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  useEffect(() => {
    let filtered = reports;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (report) =>
          report.complaint_details
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          report.department
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          report.lab_assistant // Changed from assistant_name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          report.id.toString().includes(searchQuery),
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (report) => report.adminApprovalStatus === statusFilter,
      );
    }

    setFilteredReports(filtered);
  }, [searchQuery, statusFilter, reports]);

  const getStatusColor = (status) => {
    const colors = {
      approved: "bg-green-100 text-green-800 border-green-200",
      rejected: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getStatusIcon = (status) => {
    const icons = {
      approved: CheckCircle,
      rejected: XCircle,
    };
    const Icon = icons[status] || Clock;
    return <Icon size={16} />;
  };

  const downloadPDF = async (report) => {
    const doc = new jsPDF();

    // Page dimensions
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 8;

    // Helper function to draw a rectangle with text
    const drawBox = (
      x,
      y,
      width,
      height,
      text,
      fontSize = 10,
      isBold = false,
      align = "left",
    ) => {
      doc.rect(x, y, width, height);
      if (text) {
        doc.setFont("helvetica", isBold ? "bold" : "normal");
        doc.setFontSize(fontSize);
        const textY = y + height / 2 + fontSize / 3;
        if (align === "center") {
          doc.text(text, x + width / 2, textY, { align: "center" });
        } else {
          doc.text(text, x + 2, textY);
        }
      }
    };

    // Header section with logos
    let currentY = 10;
    const headerHeight = 30;
    drawBox(
      margin,
      currentY,
      pageWidth - 2 * margin,
      headerHeight,
      "",
      10,
      false,
    );

    const logoSize = 26;

    const getBase64Image = (imgPath) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          const dataURL = canvas.toDataURL("image/jpeg");
          resolve(dataURL);
        };
        img.onerror = reject;
        img.src = imgPath;
      });
    };

    try {
      const leftLogoData = await getBase64Image("/left_logo.jpg");
      doc.addImage(
        leftLogoData,
        "JPEG",
        margin + 3,
        currentY + 2,
        logoSize,
        logoSize,
      );
    } catch (error) {
      console.error("Error loading left logo:", error);
    }

    try {
      const rightLogoData = await getBase64Image("/right_logo.png");
      doc.addImage(
        rightLogoData,
        "PNG",
        pageWidth - margin - logoSize - 3,
        currentY + 2,
        logoSize,
        logoSize,
      );
    } catch (error) {
      console.error("Error loading right logo:", error);
    }

    doc.line(
      margin + logoSize + 6,
      currentY,
      margin + logoSize + 6,
      currentY + headerHeight,
    );
    doc.line(
      pageWidth - margin - logoSize - 6,
      currentY,
      pageWidth - margin - logoSize - 6,
      currentY + headerHeight,
    );

    const centerX = margin + logoSize + 6;
    const centerWidth = pageWidth - 2 * margin - 2 * logoSize - 12;
    const textStartY = currentY + 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(
      "Pimpri Chinchwad Education Trust's",
      centerX + centerWidth / 2,
      textStartY,
      { align: "center" },
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(
      "Pimpri Chinchwad College of Engineering & Research",
      centerX + centerWidth / 2,
      textStartY + 4.5,
      { align: "center" },
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.text("Ravet, Pune", centerX + centerWidth / 2, textStartY + 9, {
      align: "center",
    });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6);
    doc.text(
      "An Autonomous Institute | NBA Accredited (4 UG Programs) | NAAC A++ Accredited | ISO 21001:2018 Certified",
      centerX + centerWidth / 2,
      textStartY + 13,
      { align: "center" },
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.text("IQAC PCCOER", centerX + centerWidth / 2, textStartY + 18.5, {
      align: "center",
    });

    currentY += headerHeight;

    // Second row - Academic year and IT/R/03
    const row2Height = 8;
    const yearWidth = 45;
    const termWidth = 25;
    const titleWidth = pageWidth - 2 * margin - yearWidth - termWidth - 35;

    drawBox(
      margin,
      currentY,
      yearWidth,
      row2Height,
      "A. Year: 2025-26",
      8,
      true,
    );
    drawBox(
      margin + yearWidth,
      currentY,
      termWidth,
      row2Height,
      "Term: I/II",
      8,
      false,
    );
    drawBox(
      margin + yearWidth + termWidth,
      currentY,
      titleWidth,
      row2Height,
      "Maintenance Report",
      9,
      true,
      "center",
    );
    drawBox(
      pageWidth - margin - 35,
      currentY,
      35,
      row2Height,
      "IT/R/03",
      8,
      true,
      "center",
    );

    currentY += row2Height;

    // Date field
    const dateHeight = 8;
    drawBox(
      pageWidth - margin - 55,
      currentY,
      55,
      dateHeight,
      `Date: ${report.date || ""}`,
      8,
      false,
    );

    currentY += dateHeight;

    // Type of problem
    const typeHeight = 8;
    drawBox(
      margin,
      currentY,
      pageWidth - 2 * margin,
      typeHeight,
      `Type of problem: ${report.type_of_problem || ""}`,
      8,
      false,
    );

    currentY += typeHeight;

    // Originator section
    const originatorHeight = 55;
    const leftColWidth = 40;

    drawBox(margin, currentY, leftColWidth, originatorHeight, "", 8, false);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(
      "Originator",
      margin + leftColWidth / 2,
      currentY + originatorHeight / 2,
      { align: "center" },
    );

    const rightStartX = margin + leftColWidth;
    const rightWidth = pageWidth - 2 * margin - leftColWidth;
    const deptWidth = rightWidth * 0.5;
    const locationWidth = rightWidth * 0.5;

    drawBox(rightStartX, currentY, deptWidth, 8, "", 7, false);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.text("Department:", rightStartX + 2, currentY + 6);
    doc.setFont("helvetica", "normal");
    doc.text(report.department || "", rightStartX + 28, currentY + 6);

    drawBox(rightStartX + deptWidth, currentY, locationWidth, 8, "", 7, false);
    doc.setFont("helvetica", "bold");
    doc.text("Location:", rightStartX + deptWidth + 2, currentY + 6);
    doc.setFont("helvetica", "normal");
    doc.text(report.location || "", rightStartX + deptWidth + 22, currentY + 6);

    // Complaint details
    const complaintY = currentY + 8;
    const complaintHeight = 20;
    drawBox(rightStartX, complaintY, rightWidth, complaintHeight, "", 7, false);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.text("Complaint details:", rightStartX + 2, complaintY + 4);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    const complaintText = report.complaint_details || "";
    const splitComplaint = doc.splitTextToSize(complaintText, rightWidth - 4);
    doc.text(splitComplaint, rightStartX + 2, complaintY + 10);

    // Recurring complaint
    const recurringY = complaintY + complaintHeight;
    const recurringHeight = 8;
    const recurringWidth = rightWidth * 0.5;

    drawBox(
      rightStartX,
      recurringY,
      recurringWidth,
      recurringHeight,
      "",
      7,
      false,
    );
    doc.setFont("helvetica", "bold");
    doc.text("Recurring complaint:", rightStartX + 2, recurringY + 6);
    doc.setFont("helvetica", "normal");
    doc.text(
      report.recurring_complaint || "",
      rightStartX + 38,
      recurringY + 6,
    );

    drawBox(
      rightStartX + recurringWidth,
      recurringY,
      rightWidth - recurringWidth,
      recurringHeight,
      "",
      7,
      false,
    );
    doc.setFont("helvetica", "bold");
    doc.text(
      "If Yes, how many times:",
      rightStartX + recurringWidth + 2,
      recurringY + 6,
    );
    doc.setFont("helvetica", "normal");
    doc.text(
      report.recurring_times || "",
      rightStartX + recurringWidth + 42,
      recurringY + 6,
    );

    // Signature boxes
    const sigY = recurringY + recurringHeight;
    const sigHeight = 19;
    const sigWidth = rightWidth / 2;

    drawBox(rightStartX, sigY, sigWidth, sigHeight, "", 7, false);
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.text("In charge/Lab Assistant", rightStartX + sigWidth / 2, sigY + 5, {
      align: "center",
    });
    doc.setFont("helvetica", "normal");
    doc.text(
      report.lab_assistant || "",
      rightStartX + sigWidth / 2,
      sigY + 10,
      { align: "center" },
    );
    doc.text(
      report.lab_assistant_date || "",
      rightStartX + sigWidth / 2,
      sigY + 15,
      { align: "center" },
    );

    drawBox(rightStartX + sigWidth, sigY, sigWidth, sigHeight, "", 7, false);
    doc.setFont("helvetica", "bold");
    doc.text(
      "Head of Department",
      rightStartX + sigWidth + sigWidth / 2,
      sigY + 5,
      { align: "center" },
    );
    doc.setFont("helvetica", "normal");
    doc.text(
      report.hod || "",
      rightStartX + sigWidth + sigWidth / 2,
      sigY + 10,
      { align: "center" },
    );
    doc.text(
      report.hod_date || "",
      rightStartX + sigWidth + sigWidth / 2,
      sigY + 15,
      { align: "center" },
    );

    currentY += originatorHeight;

    // Verification section
    const verificationHeight = 42;
    drawBox(margin, currentY, leftColWidth, verificationHeight, "", 8, false);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(
      "Verification",
      margin + leftColWidth / 2,
      currentY + verificationHeight / 2,
      { align: "center" },
    );

    drawBox(rightStartX, currentY, rightWidth, 8, "", 7, false);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.text(
      "Name of the person to whom work is allotted:",
      rightStartX + 2,
      currentY + 6,
    );
    doc.setFont("helvetica", "normal");
    doc.text(report.assigned_person || "", rightStartX + 80, currentY + 6);

    const maintY = currentY + 8;
    const maintHeight = verificationHeight - 8;
    const maintLeftWidth = rightWidth * 0.45;

    drawBox(rightStartX, maintY, maintLeftWidth, maintHeight, "", 7, false);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.text("Maintenance Section In charge", rightStartX + 2, maintY + 5);
    doc.setFont("helvetica", "normal");
    doc.text(report.in_charge_date || "", rightStartX + 2, maintY + 10);
    doc.setFont("helvetica", "bold");
    doc.text("Verification and remarks:", rightStartX + 2, maintY + 18);
    doc.setFont("helvetica", "normal");
    const verificationText = report.verification_remarks || "";
    const splitVerification = doc.splitTextToSize(
      verificationText,
      maintLeftWidth - 4,
    );
    doc.text(splitVerification, rightStartX + 2, maintY + 23);

    drawBox(
      rightStartX + maintLeftWidth,
      maintY,
      rightWidth - maintLeftWidth,
      maintHeight,
      "",
      7,
      false,
    );
    doc.setFont("helvetica", "bold");
    doc.text(
      "Material replaced/repaired/used",
      rightStartX + maintLeftWidth + 2,
      maintY + 5,
    );
    doc.text(
      "for attending complaint:",
      rightStartX + maintLeftWidth + 2,
      maintY + 10,
    );
    doc.setFont("helvetica", "normal");
    const materialsText = report.materials_used || "";
    const splitMaterials = doc.splitTextToSize(
      materialsText,
      rightWidth - maintLeftWidth - 4,
    );
    doc.text(splitMaterials, rightStartX + maintLeftWidth + 2, maintY + 15);

    currentY += verificationHeight;

    // Corrective Action section
    const correctiveHeight = 55;
    drawBox(margin, currentY, leftColWidth, correctiveHeight, "", 8, false);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(
      "Corrective",
      margin + leftColWidth / 2,
      currentY + correctiveHeight / 2 - 4,
      { align: "center" },
    );
    doc.text(
      "Action",
      margin + leftColWidth / 2,
      currentY + correctiveHeight / 2 + 2,
      { align: "center" },
    );

    const actionRowHeight = correctiveHeight / 3;
    const actionLeftWidth = rightWidth * 0.5;

    // Row 1: Complaint resolved
    drawBox(
      rightStartX,
      currentY,
      actionLeftWidth,
      actionRowHeight,
      "",
      7,
      false,
    );
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.text(
      "Complaint resolved and closed inhouse:",
      rightStartX + 2,
      currentY + actionRowHeight / 2 - 2,
    );
    doc.setFont("helvetica", "normal");
    doc.text(
      report.resolved_inhouse || "",
      rightStartX + 2,
      currentY + actionRowHeight / 2 + 3,
    );

    drawBox(
      rightStartX + actionLeftWidth,
      currentY,
      rightWidth - actionLeftWidth,
      actionRowHeight,
      "",
      7,
      false,
    );
    doc.setFont("helvetica", "bold");
    doc.text("Remark:", rightStartX + actionLeftWidth + 2, currentY + 8);
    doc.setFont("helvetica", "normal");
    const resolvedRemarkText = report.resolved_remark || "";
    const splitResolvedRemark = doc.splitTextToSize(
      resolvedRemarkText,
      rightWidth - actionLeftWidth - 4,
    );
    doc.text(
      splitResolvedRemark,
      rightStartX + actionLeftWidth + 2,
      currentY + 13,
    );

    // Row 2: Purchase required
    const row2Y = currentY + actionRowHeight;
    drawBox(rightStartX, row2Y, actionLeftWidth, actionRowHeight, "", 7, false);
    doc.setFont("helvetica", "bold");
    doc.text(
      "Purchase of consumable required:",
      rightStartX + 2,
      row2Y + actionRowHeight / 2 - 2,
    );
    doc.setFont("helvetica", "normal");
    doc.text(
      report.consumables_needed || "",
      rightStartX + 2,
      row2Y + actionRowHeight / 2 + 3,
    );

    drawBox(
      rightStartX + actionLeftWidth,
      row2Y,
      rightWidth - actionLeftWidth,
      actionRowHeight,
      "",
      7,
      false,
    );
    doc.setFont("helvetica", "bold");
    doc.text(
      "Details (Description/Qty./cost):",
      rightStartX + actionLeftWidth + 2,
      row2Y + 8,
    );
    doc.setFont("helvetica", "normal");
    const consumableText = report.consumable_details || "";
    const splitConsumable = doc.splitTextToSize(
      consumableText,
      rightWidth - actionLeftWidth - 4,
    );
    doc.text(splitConsumable, rightStartX + actionLeftWidth + 2, row2Y + 13);

    // Row 3: External agency
    const row3Y = row2Y + actionRowHeight;
    drawBox(rightStartX, row3Y, actionLeftWidth, actionRowHeight, "", 7, false);
    doc.setFont("helvetica", "bold");
    doc.text(
      "Recommended Maintenance from",
      rightStartX + 2,
      row3Y + actionRowHeight / 2 - 2,
    );
    doc.text(
      "external agency:",
      rightStartX + 2,
      row3Y + actionRowHeight / 2 + 3,
    );
    doc.setFont("helvetica", "normal");
    doc.text(
      report.external_agency_needed || "",
      rightStartX + 2,
      row3Y + actionRowHeight / 2 + 8,
    );

    drawBox(
      rightStartX + actionLeftWidth,
      row3Y,
      rightWidth - actionLeftWidth,
      actionRowHeight,
      "",
      7,
      false,
    );
    doc.setFont("helvetica", "bold");
    doc.text("Agency Name:", rightStartX + actionLeftWidth + 2, row3Y + 7);
    doc.setFont("helvetica", "normal");
    doc.text(
      report.agency_name || "",
      rightStartX + actionLeftWidth + 28,
      row3Y + 7,
    );
    doc.setFont("helvetica", "bold");
    doc.text(
      "Expected Approx. Expenditure:",
      rightStartX + actionLeftWidth + 2,
      row3Y + 13,
    );
    doc.setFont("helvetica", "normal");
    doc.text(
      report.approx_expenditure || "",
      rightStartX + actionLeftWidth + 58,
      row3Y + 13,
    );

    currentY += correctiveHeight;

    // Maintenance Report closure section
    const closureHeight = 45;
    drawBox(margin, currentY, leftColWidth, closureHeight, "", 9, false);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(
      "Maintenance",
      margin + leftColWidth / 2,
      currentY + closureHeight / 2 - 7,
      { align: "center" },
    );
    doc.text(
      "Report",
      margin + leftColWidth / 2,
      currentY + closureHeight / 2,
      { align: "center" },
    );
    doc.text(
      "closure",
      margin + leftColWidth / 2,
      currentY + closureHeight / 2 + 7,
      { align: "center" },
    );

    const closureRowHeight = closureHeight / 2;

    // Row 1: Lab assistant remark
    drawBox(rightStartX, currentY, rightWidth, closureRowHeight, "", 8, false);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.text(
      "Remark on work completion by person In charge of lab/class:",
      rightStartX + 2,
      currentY + 5,
    );
    doc.setFont("helvetica", "normal");
    const labRemarkText = report.completion_remark_lab || "";
    const splitLabRemark = doc.splitTextToSize(
      labRemarkText,
      rightWidth * 0.55,
    );
    doc.text(splitLabRemark, rightStartX + 2, currentY + 10);

    doc.setFont("helvetica", "bold");
    doc.text(
      "In charge/Lab Assistant",
      rightStartX + rightWidth - 55,
      currentY + 8,
    );
    doc.setFont("helvetica", "normal");
    doc.text(
      report.lab_completion_name || "",
      rightStartX + rightWidth - 55,
      currentY + 13,
    );
    doc.text(
      report.lab_completion_date || "",
      rightStartX + rightWidth - 55,
      currentY + 18,
    );

    // Row 2: Maintenance section remark
    const closure2Y = currentY + closureRowHeight;
    drawBox(rightStartX, closure2Y, rightWidth, closureRowHeight, "", 8, false);
    doc.setFont("helvetica", "bold");
    doc.text(
      "Remark on work completion by maintenance section In charge:",
      rightStartX + 2,
      closure2Y + 5,
    );
    doc.setFont("helvetica", "normal");
    const maintRemarkText = report.completion_remark_maintenance || "";
    const splitMaintRemark = doc.splitTextToSize(
      maintRemarkText,
      rightWidth * 0.55,
    );
    doc.text(splitMaintRemark, rightStartX + 2, closure2Y + 10);

    doc.setFont("helvetica", "bold");
    doc.text(
      "Maintenance Section Incharge",
      rightStartX + rightWidth - 60,
      closure2Y + 8,
    );
    doc.setFont("helvetica", "normal");
    doc.text(
      report.maintenance_closed_date || "",
      rightStartX + rightWidth - 60,
      closure2Y + 13,
    );

    currentY += closureHeight;

    // Footer
    currentY += 8;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text(`Rev.: 00    Date: 03.07.2023`, margin, currentY);

    doc.save(`maintenance_report_${report.id}_${report.date || "report"}.pdf`);
  };

  const handleExportPDF = (report) => {
    const content = `
Report ID: ${report.id}
Assistant Name: ${report.lab_assistant || "N/A"} // Changed from assistant_name
Department: ${report.department || "N/A"}
Status: ${report.adminApprovalStatus}

Complaint Details:
${report.complaint_details || "N/A"}

Date Submitted: ${
      report.created_at ? new Date(report.created_at).toLocaleString() : "N/A"
    }
Date Processed: ${
      report.updated_at ? new Date(report.updated_at).toLocaleString() : "N/A"
    }

Additional Information:
${JSON.stringify(report, null, 2)}
    `;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `report-${report.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Assistant Reports
        </h1>
        <p className="text-gray-600">
          View processed corrective actions submitted by assistants
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Reports</p>
              <p className="text-2xl font-bold text-gray-900">
                {reports.length}
              </p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">
                {
                  reports.filter((r) => r.adminApprovalStatus === "approved")
                    .length
                }
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600">
                {
                  reports.filter((r) => r.adminApprovalStatus === "rejected")
                    .length
                }
              </p>
            </div>
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search reports by ID, complaint details, department, or assistant name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex space-x-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports Table - Desktop */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Report Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {report.complaint_details || "No details available"}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {report.id}
                        </div>
                        <div className="text-xs text-gray-400">
                          Dept: {report.department || "N/A"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {report.lab_assistant || "Assistant"}{" "}
                      {/* Changed from assistant_name */}
                    </div>
                    <div className="text-xs text-gray-500">
                      {report.department || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                        report.adminApprovalStatus,
                      )}`}
                    >
                      {getStatusIcon(report.adminApprovalStatus)}
                      <span className="ml-1 capitalize">
                        {report.adminApprovalStatus}
                      </span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(report.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedReport(report);
                        setShowModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-900 p-1"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => downloadPDF(report)}
                      className="text-green-600 hover:text-green-900 p-1"
                    >
                      <Download size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile View - Cards */}
      <div className="block md:hidden space-y-4">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="bg-white shadow-sm rounded-lg border border-gray-200 p-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Report #{report.id}
                </p>
                <p className="text-xs text-gray-500">
                  {report.department || "N/A"}
                </p>
              </div>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                  report.adminApprovalStatus,
                )}`}
              >
                {getStatusIcon(report.adminApprovalStatus)}
                <span className="ml-1 capitalize">
                  {report.adminApprovalStatus}
                </span>
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-700">
              {report.complaint_details || "No details available"}
            </p>
            <div className="mt-3 flex justify-between text-xs text-gray-500">
              <span>By: {report.lab_assistant || "Assistant"}</span>{" "}
              {/* Changed from assistant_name */}
              <span>{formatDate(report.date)}</span>
            </div>
            <div className="mt-3 flex space-x-3">
              <button
                onClick={() => {
                  setSelectedReport(report);
                  setShowModal(true);
                }}
                className="text-blue-600 hover:text-blue-900 text-sm flex items-center space-x-1"
              >
                <Eye size={14} />
                <span>View</span>
              </button>
              <button
                onClick={() => downloadPDF(report)}
                className="text-green-600 hover:text-green-900 text-sm flex items-center space-x-1"
              >
                <Download size={14} />
                <span>Export</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Report Details */}
      {showModal && selectedReport && (
        <div className="fixed inset-0 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                Report Details
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">
                    Report Information
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        Report ID:
                      </span>
                      <p className="text-sm text-gray-900">
                        {selectedReport.id}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        Complaint Details:
                      </span>
                      <p className="text-sm text-gray-900">
                        {selectedReport.complaint_details || "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        Department:
                      </span>
                      <p className="text-sm text-gray-900">
                        {selectedReport.department || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">
                    Additional Details
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm text-gray-700">
                    {Object.entries(selectedReport).map(([key, value]) => {
                      if (
                        [
                          "id",
                          "complaint_details",
                          "department",
                          "lab_assistant", // Changed from assistant_name
                          "adminApprovalStatus",
                          "created_at",
                          "updated_at",
                        ].includes(key)
                      ) {
                        return null; // Skip already displayed fields
                      }
                      return (
                        <div
                          key={key}
                          className="border-b border-gray-100 pb-2"
                        >
                          <span className="font-semibold capitalize">
                            {key.replace(/([A-Z])/g, " $1")}:{" "}
                          </span>
                          <span>
                            {value !== null ? value.toString() : "N/A"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">
                    Submission Details
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        Submitted By:
                      </span>
                      <p className="text-sm text-gray-900">
                        {selectedReport.lab_assistant || "Assistant"}{" "}
                        {/* Changed from assistant_name */}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        Role:
                      </span>
                      <p className="text-sm text-gray-900">Assistant</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        Current Status:
                      </span>
                      <span
                        className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                          selectedReport.adminApprovalStatus,
                        )}`}
                      >
                        {getStatusIcon(selectedReport.adminApprovalStatus)}
                        <span className="ml-1 capitalize">
                          {selectedReport.adminApprovalStatus}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">
                    Timeline
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        Date Created:
                      </span>
                      <p className="text-sm text-gray-900">
                        {formatDate(selectedReport.created_at)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Date Processed:
                      </p>
                      <p className="text-sm text-gray-900">
                        {selectedReport.date ? selectedReport.date : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
