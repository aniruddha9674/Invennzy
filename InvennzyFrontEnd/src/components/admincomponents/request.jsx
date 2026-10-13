import React, { useEffect, useState, useMemo } from "react";
import jsPDF from "jspdf";
import {
  CheckCircle,
  AlertCircle,
  X,
  Clock,
  User,
  FileText,
  Settings,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useParams } from "react-router-dom";
import api from "../../Utils/BackEnd";

// Modal Component
function Modal({ isOpen, onClose, type, title, message }) {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case "info":
        return <AlertCircle className="w-8 h-8 text-blue-500" />;
      default:
        return <AlertCircle className="w-8 h-8 text-gray-500" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "info":
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {getIcon()}
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className={`p-4 rounded-lg border ${getBgColor()}`}>
            <p className="text-gray-700">{message}</p>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ProgressBar Component
function ProgressBar({ steps, currentStep, completedSteps = 0 }) {
  const pct = useMemo(() => {
    const clamped = Math.max(0, completedSteps - 1);
    return (clamped / (steps.length - 1)) * 100;
  }, [completedSteps]);

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="relative">
        <div className="absolute top-6 left-0 w-full h-0.5 bg-gray-200"></div>
        <div
          className="absolute top-6 left-0 h-0.5 bg-blue-600 transition-all duration-500 ease-in-out"
          style={{ width: `${pct}%` }}
        />
        <div className="relative flex justify-between">
          {steps.map((step) => {
            const StepIcon = step.icon;
            const isCompleted = step.id <= completedSteps;
            const isActive = step.id === currentStep;
            const isCurrent = step.id === currentStep;
            const isAccessible = step.id <= Math.max(completedSteps, 2);
            return (
              <div key={step.id} className="flex flex-col items-center group">
                <div
                  className={`relative z-10 w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    isCompleted
                      ? "bg-blue-600 border-blue-600 text-white shadow-lg"
                      : isCurrent
                        ? "bg-white border-blue-600 text-blue-600 shadow-lg ring-4 ring-blue-100"
                        : isAccessible
                          ? "bg-white border-gray-300 text-gray-400"
                          : "bg-gray-100 border-gray-200 text-gray-300"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <StepIcon className="w-5 h-5" />
                  )}
                </div>
                <div className="mt-3 text-center max-w-24">
                  <p
                    className={`text-sm font-semibold ${
                      isCurrent
                        ? "text-blue-700"
                        : isCompleted
                          ? "text-blue-600"
                          : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </p>
                  <p
                    className={`text-xs mt-1 ${
                      isCurrent
                        ? "text-blue-600"
                        : isCompleted
                          ? "text-blue-500"
                          : "text-gray-400"
                    }`}
                  >
                    {step.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Main AdminRequestPage Component
function AdminRequestPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [completedSteps, setCompletedSteps] = useState(0);
  const [form, setForm] = useState({
    typeOfProblem: "",
    date: "",
    department: "",
    location: "",
    complaintDetails: "",
    recurringComplaint: "no",
    recurringTimes: "",
    labAssistant: "",
    labAssistantDate: "",
    hod: "",
    hodDate: "",
    inChargeDate: "",
    inChargeSignature: "",
    assignedPerson: "",
    verificationRemarks: "",
    materialsUsed: "",
    resolvedInhouse: "yes",
    resolvedRemark: "",
    consumablesNeeded: "no",
    consumableDetails: "",
    externalAgencyNeeded: "no",
    agencyName: "",
    approxExpenditure: "",
    completionRemarkLab: "",
    labCompletionName: "",
    labCompletionSignature: "",
    labCompletionDate: "",
    completionRemarkMaintenance: "",
    maintenanceClosedDate: "",
    maintenanceClosedSignature: "",
    adminApprovalStatus: "",
    adminApprovalDate: "",
    equipment_id: "",
    equipmentStatus: "",
  });
  const [modal, setModal] = useState({
    isOpen: false,
    type: "",
    title: "",
    message: "",
  });
  const { requestId } = useParams();

  const stepFields = {
    1: ["typeOfProblem", "date"],
    2: [
      "department",
      "location",
      "complaintDetails",
      "labAssistant",
      "labAssistantDate",
      "hod",
      "hodDate",
    ],
    3: ["assignedPerson", "inChargeDate", "verificationRemarks"],
    4: ["materialsUsed", "resolvedInhouse", "resolvedRemark"],
    5: ["adminApprovalStatus"],
    6: [
      "completionRemarkLab",
      "labCompletionName",
      "labCompletionDate",
      "completionRemarkMaintenance",
      "maintenanceClosedDate",
    ],
  };

  const steps = [
    {
      id: 1,
      title: "Problem Details",
      subtitle: "Type & Date",
      icon: FileText,
      role: "Lab In-charge",
    },
    {
      id: 2,
      title: "Submit Request",
      subtitle: "Originator Info",
      icon: User,
      role: "Lab In-charge",
    },
    {
      id: 3,
      title: "Verification",
      subtitle: "Under Review",
      icon: Clock,
      role: "Maintenance Team",
    },
    {
      id: 4,
      title: "Corrective Action",
      subtitle: "In Progress",
      icon: Settings,
      role: "Maintenance Team",
    },
    {
      id: 5,
      title: "Admin Approval",
      subtitle:
        form?.adminApprovalStatus === "approved"
          ? "Approved"
          : form?.adminApprovalStatus === "rejected"
            ? "Rejected"
            : "Pending Review",
      icon: AlertCircle,
      role: "Admin",
    },
    {
      id: 6,
      title: "Closure",
      subtitle: "Completed",
      icon: CheckSquare,
      role: "Maintenance Team",
    },
  ];

  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    action: null,
    requestId: null,
    requestDetails: null,
  });

  const openConfirmationModal = (action) => {
    setConfirmationModal({ isOpen: true, action });
  };

  const closeConfirmationModal = () => {
    setConfirmationModal({ isOpen: false, action: null });
  };

  const isStepCompleted = (step) => {
    if (step === 5) {
      return (
        form?.adminApprovalStatus === "approved" ||
        form?.adminApprovalStatus === "rejected"
      );
    }
    const fields = stepFields[step];
    return fields.every(
      (field) => form[field] && form[field].toString().trim() !== "",
    );
  };

  const showModal = (type, title, message) =>
    setModal({ isOpen: true, type, title, message });
  const closeModal = () =>
    setModal({ isOpen: false, type: "", title: "", message: "" });

  // Fetch request details
  useEffect(() => {
    const fetchRequest = async () => {
      if (!requestId) return;
      try {
        setLoading(true);
        const res = await api.get(`/api/requests/${requestId}`);
        const data = res.data || {};
        setForm({
          typeOfProblem: data.type_of_problem || "",
          date: data.date ? String(data.date).split("T")[0] : "",
          department: data.department || "",
          location: data.location || "",
          complaintDetails: data.complaint_details || "",
          recurringComplaint: data.recurring_complaint || "no",
          recurringTimes: data.recurring_times ?? "",
          labAssistant: data.lab_assistant || "",
          labAssistantDate: data.lab_assistant_date
            ? String(data.lab_assistant_date).split("T")[0]
            : "",
          hod: data.hod || "",
          hodDate: data.hod_date ? String(data.hod_date).split("T")[0] : "",
          inChargeDate: data.in_charge_date
            ? String(data.in_charge_date).split("T")[0]
            : "",
          inChargeSignature: data.in_charge_signature || "",
          assignedPerson: data.assigned_person || "",
          verificationRemarks: data.verification_remarks || "",
          materialsUsed: data.materials_used || "",
          resolvedInhouse: data.resolved_inhouse || "yes",
          resolvedRemark: data.resolved_remark || "",
          consumablesNeeded: data.consumables_needed || "no",
          consumableDetails: data.consumable_details || "",
          externalAgencyNeeded: data.external_agency_needed || "no",
          agencyName: data.agency_name || "",
          approxExpenditure: data.approx_expenditure || "",
          completionRemarkLab: data.completion_remark_lab || "",
          labCompletionName: data.lab_completion_name || "",
          labCompletionSignature: data.lab_completion_signature || "",
          labCompletionDate: data.lab_completion_date
            ? String(data.lab_completion_date).split("T")[0]
            : "",
          completionRemarkMaintenance: data.completion_remark_maintenance || "",
          maintenanceClosedDate: data.maintenance_closed_date
            ? String(data.maintenance_closed_date).split("T")[0]
            : "",
          maintenanceClosedSignature: data.maintenance_closed_signature || "",
          adminApprovalStatus: data.admin_approval_status || "",
          adminApprovalDate: data.admin_approval_date
            ? String(data.admin_approval_date).split("T")[0]
            : "",
          equipment_id: res.data.equipment_id
            ? res.data.equipment_id.toString()
            : "",
          equipmentStatus:
            data.equipment_status === "0"
              ? "active"
              : data.equipment_status === "1"
                ? "damaged"
                : "maintenance",
        });
      } catch (err) {
        console.error("Error fetching request:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequest();
  }, [requestId]);

  // Update completed steps
  useEffect(() => {
    let maxCompleted = 0;
    for (let step = 1; step <= 6; step++) {
      if (isStepCompleted(step)) {
        maxCompleted = step;
      } else {
        break;
      }
    }
    setCompletedSteps(maxCompleted);
  }, [form]);

  // Download PDF
  const downloadPDF = async () => {
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

    // Header section with logos and institution info
    let currentY = 10;

    // Main header box - compact for single page
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

    // Logo dimensions - smaller and more compact
    const logoSize = 26;

    // Function to convert image to base64
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

    // Load and add logos - positioned closer to edges
    try {
      // Left Logo - positioned at left edge with small padding
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
      // Right Logo - positioned at right edge with small padding
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
    ); // after left logo
    doc.line(
      pageWidth - margin - logoSize - 6,
      currentY,
      pageWidth - margin - logoSize - 6,
      currentY + headerHeight,
    ); // before right logo

    // Center text area (between logos) - adjusted spacing
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
      "A. Year: 2026-27",
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

    // Date field - populated from form
    const dateHeight = 8;
    drawBox(
      pageWidth - margin - 55,
      currentY,
      55,
      dateHeight,
      `Date: ${form.date || ""}`,
      8,
      false,
    );

    currentY += dateHeight;

    // Type of problem - populated from form
    const typeHeight = 8;
    drawBox(
      margin,
      currentY,
      pageWidth - 2 * margin,
      typeHeight,
      `Type of problem: ${form.typeOfProblem || ""}`,
      8,
      false,
    );

    currentY += typeHeight;

    // Main form section - Originator (reduced height)
    const originatorHeight = 55;
    const leftColWidth = 40;

    // Left column label
    drawBox(margin, currentY, leftColWidth, originatorHeight, "", 8, false);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(
      "Originator",
      margin + leftColWidth / 2,
      currentY + originatorHeight / 2,
      { align: "center" },
    );

    // Department and Location - populated from form
    const rightStartX = margin + leftColWidth;
    const rightWidth = pageWidth - 2 * margin - leftColWidth;
    const deptWidth = rightWidth * 0.5;
    const locationWidth = rightWidth * 0.5;

    drawBox(rightStartX, currentY, deptWidth, 8, "", 7, false);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.text("Department:", rightStartX + 2, currentY + 6);
    doc.setFont("helvetica", "normal");
    doc.text(form.department || "", rightStartX + 28, currentY + 6);

    drawBox(rightStartX + deptWidth, currentY, locationWidth, 8, "", 7, false);
    doc.setFont("helvetica", "bold");
    doc.text("Location:", rightStartX + deptWidth + 2, currentY + 6);
    doc.setFont("helvetica", "normal");
    doc.text(form.location || "", rightStartX + deptWidth + 22, currentY + 6);

    // Complaint details - populated from form
    const complaintY = currentY + 8;
    const complaintHeight = 20;
    drawBox(rightStartX, complaintY, rightWidth, complaintHeight, "", 7, false);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.text("Complaint details:", rightStartX + 2, complaintY + 4);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    const complaintText = form.complaintDetails || "";
    const splitComplaint = doc.splitTextToSize(complaintText, rightWidth - 4);
    doc.text(splitComplaint, rightStartX + 2, complaintY + 10);

    // Recurring complaint - populated from form
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
    doc.text(form.recurringComplaint || "", rightStartX + 38, recurringY + 6);

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
      form.recurringTimes || "",
      rightStartX + recurringWidth + 42,
      recurringY + 6,
    );

    // Signature boxes - populated from form
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
    doc.text(form.labAssistant || "", rightStartX + sigWidth / 2, sigY + 10, {
      align: "center",
    });
    doc.text(
      form.labAssistantDate || "",
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
    doc.text(form.hod || "", rightStartX + sigWidth + sigWidth / 2, sigY + 10, {
      align: "center",
    });
    doc.text(
      form.hodDate || "",
      rightStartX + sigWidth + sigWidth / 2,
      sigY + 15,
      { align: "center" },
    );

    currentY += originatorHeight;

    // Verification section - populated from form
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

    // Name of person allotted - populated from form
    drawBox(rightStartX, currentY, rightWidth, 8, "", 7, false);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.text(
      "Name of the person to whom work is allotted:",
      rightStartX + 2,
      currentY + 6,
    );
    doc.setFont("helvetica", "normal");
    doc.text(form.assignedPerson || "", rightStartX + 80, currentY + 6);

    // Maintenance section boxes - populated from form
    const maintY = currentY + 8;
    const maintHeight = verificationHeight - 8;
    const maintLeftWidth = rightWidth * 0.45;

    drawBox(rightStartX, maintY, maintLeftWidth, maintHeight, "", 7, false);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.text("Maintenance Section In charge", rightStartX + 2, maintY + 5);
    doc.setFont("helvetica", "normal");
    doc.text(form.inChargeDate || "", rightStartX + 2, maintY + 10);
    doc.setFont("helvetica", "bold");
    doc.text("Verification and remarks:", rightStartX + 2, maintY + 18);
    doc.setFont("helvetica", "normal");
    const verificationText = form.verificationRemarks || "";
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
    const materialsText = form.materialsUsed || "";
    const splitMaterials = doc.splitTextToSize(
      materialsText,
      rightWidth - maintLeftWidth - 4,
    );
    doc.text(splitMaterials, rightStartX + maintLeftWidth + 2, maintY + 15);

    currentY += verificationHeight;

    // Corrective Action section - populated from form
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

    // Three rows for corrective actions
    const actionRowHeight = correctiveHeight / 3;
    const actionLeftWidth = rightWidth * 0.5;

    // Row 1: Complaint resolved - populated from form
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
      form.resolvedInhouse || "",
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
    const resolvedRemarkText = form.resolvedRemark || "";
    const splitResolvedRemark = doc.splitTextToSize(
      resolvedRemarkText,
      rightWidth - actionLeftWidth - 4,
    );
    doc.text(
      splitResolvedRemark,
      rightStartX + actionLeftWidth + 2,
      currentY + 13,
    );

    // Row 2: Purchase required - populated from form
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
      form.consumablesNeeded || "",
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
    const consumableText = form.consumableDetails || "";
    const splitConsumable = doc.splitTextToSize(
      consumableText,
      rightWidth - actionLeftWidth - 4,
    );
    doc.text(splitConsumable, rightStartX + actionLeftWidth + 2, row2Y + 13);

    // Row 3: External agency - populated from form
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
      form.externalAgencyNeeded || "",
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
      form.agencyName || "",
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
      form.approxExpenditure || "",
      rightStartX + actionLeftWidth + 58,
      row3Y + 13,
    );

    currentY += correctiveHeight;

    // Maintenance Report closure section - populated from form
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

    // Row 1: Lab assistant remark - populated from form
    drawBox(rightStartX, currentY, rightWidth, closureRowHeight, "", 8, false);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.text(
      "Remark on work completion by person In charge of lab/class:",
      rightStartX + 2,
      currentY + 5,
    );
    doc.setFont("helvetica", "normal");
    const labRemarkText = form.completionRemarkLab || "";
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
      form.labCompletionName || "",
      rightStartX + rightWidth - 55,
      currentY + 13,
    );
    doc.text(
      form.labCompletionDate || "",
      rightStartX + rightWidth - 55,
      currentY + 18,
    );

    // Row 2: Maintenance section remark - populated from form
    const closure2Y = currentY + closureRowHeight;
    drawBox(rightStartX, closure2Y, rightWidth, closureRowHeight, "", 8, false);
    doc.setFont("helvetica", "bold");
    doc.text(
      "Remark on work completion by maintenance section In charge:",
      rightStartX + 2,
      closure2Y + 5,
    );
    doc.setFont("helvetica", "normal");
    const maintRemarkText = form.completionRemarkMaintenance || "";
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
      form.maintenanceClosedDate || "",
      rightStartX + rightWidth - 60,
      closure2Y + 13,
    );

    currentY += closureHeight;

    // Footer - ensure it's visible
    currentY += 8;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text(`Rev.: 00    Date: 01.09.2025`, margin, currentY);

    doc.save(`maintenance_report_${form.date || "form"}.pdf`);
  };

  // Approve request
  const handleApproval = async (status) => {
    try {
      await api.put(`/api/requests/admin/${requestId}/${status}`);
      setForm((prev) => ({
        ...prev,
        adminApprovalStatus: status,
        adminApprovalDate: new Date().toISOString().split("T")[0],
      }));

      // ✅ close confirmation modal
      setConfirmationModal({ isOpen: false, action: null });

      // ✅ show success modal
      showModal(
        "success",
        status === "approve" ? "approve" : "reject",
        `Request ${status} successfully.`,
      );
    } catch (err) {
      console.error(err);
      showModal("info", "Error", `Failed to ${status} request.`);
    }
  };

  // Navigation
  const nextStep = () => {
    if (currentStep < 6) setCurrentStep(currentStep + 1);
  };
  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4 px-2 sm:py-8 sm:px-4">
      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        type={modal.type}
        title={modal.title}
        message={modal.message}
      />
      <div className="max-w-4xl mx-auto w-full">
        <ProgressBar
          steps={steps}
          currentStep={currentStep}
          completedSteps={completedSteps}
        />
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-8 border border-gray-100">
          {loading ? (
            <div className="animate-pulse text-gray-500 text-center py-6 sm:py-8">
              Loading request...
            </div>
          ) : (
            <>
              {/* Step 1: Problem Details */}
              {currentStep === 1 && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="border-b border-gray-200 pb-3 sm:pb-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
                      <FileText className="w-5 h-5 sm:w-7 sm:h-7 text-blue-600" />
                      Problem Details
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                        Type of Problem
                      </label>
                      <input
                        type="text"
                        value={form.typeOfProblem}
                        disabled
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 bg-gray-100 text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                        Date
                      </label>
                      <input
                        type="text"
                        value={form.date}
                        disabled
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 bg-gray-100 text-sm sm:text-base"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Submit Request */}
              {currentStep === 2 && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="border-b border-gray-200 pb-3 sm:pb-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
                      <User className="w-5 h-5 sm:w-7 sm:h-7 text-blue-600" />
                      Request Details
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                        Department
                      </label>
                      <input
                        type="text"
                        value={form.department}
                        disabled
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 bg-gray-100 text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={form.location}
                        disabled
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 bg-gray-100 text-sm sm:text-base"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                      Complaint Details
                    </label>
                    <textarea
                      value={form.complaintDetails}
                      disabled
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 bg-gray-100 text-sm sm:text-base"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                        Recurring Complaint?
                      </label>
                      <input
                        type="text"
                        value={form.recurringComplaint}
                        disabled
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 bg-gray-100 text-sm sm:text-base"
                      />
                    </div>
                    {form.recurringComplaint === "yes" && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                          Number of times
                        </label>
                        <input
                          type="text"
                          value={form.recurringTimes}
                          disabled
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 bg-gray-100 text-sm sm:text-base"
                        />
                      </div>
                    )}
                  </div>
                  <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6 mt-4 sm:mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                      Approval Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Lab Assistant Name
                        </label>
                        <input
                          type="text"
                          value={form.labAssistant}
                          disabled
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 bg-gray-100 text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Date
                        </label>
                        <input
                          type="text"
                          value={form.labAssistantDate}
                          disabled
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 bg-gray-100 text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Head of Department
                        </label>
                        <input
                          type="text"
                          value={form.hod}
                          disabled
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 bg-gray-100 text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Date
                        </label>
                        <input
                          type="text"
                          value={form.hodDate}
                          disabled
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 bg-gray-100 text-sm sm:text-base"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Verification */}
              {currentStep === 3 && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="border-b border-gray-200 pb-3 sm:pb-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
                      <Clock className="w-5 h-5 sm:w-7 sm:h-7 text-orange-500" />
                      Verification Stage
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        Assigned Person
                      </label>
                      <input
                        type="text"
                        value={form.assignedPerson}
                        disabled
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 bg-gray-100 text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        In-Charge Date
                      </label>
                      <input
                        type="text"
                        value={form.inChargeDate}
                        disabled
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 bg-gray-100 text-sm sm:text-base"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        Verification Remarks
                      </label>
                      <textarea
                        value={form.verificationRemarks}
                        disabled
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 bg-gray-100 text-sm sm:text-base"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Corrective Action */}
              {currentStep === 4 && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="border-b border-gray-200 pb-3 sm:pb-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
                      <Settings className="w-5 h-5 sm:w-7 sm:h-7 text-blue-500" />
                      Corrective Action
                    </h2>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <Settings className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
                      <h3 className="text-base sm:text-lg font-semibold text-blue-800">
                        Work in Progress
                      </h3>
                    </div>
                    <p className="text-blue-700 text-sm sm:text-base">
                      The maintenance team is actively working on resolving the
                      issue.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        Materials Used
                      </label>
                      <textarea
                        value={form.materialsUsed}
                        disabled
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 bg-gray-100 text-sm sm:text-base"
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        Resolved In-house?
                      </label>
                      <input
                        type="text"
                        value={form.resolvedInhouse}
                        disabled
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 bg-gray-100 text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        Resolution Remark
                      </label>
                      <input
                        type="text"
                        value={form.resolvedRemark}
                        disabled
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 bg-gray-100 text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        Consumables Needed?
                      </label>
                      <input
                        type="text"
                        value={form.consumablesNeeded}
                        disabled
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 bg-gray-100 text-sm sm:text-base"
                      />
                    </div>
                    {form.consumablesNeeded === "yes" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                          Consumable Details
                        </label>
                        <input
                          type="text"
                          value={form.consumableDetails}
                          disabled
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 bg-gray-100 text-sm sm:text-base"
                        />
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        External Agency Needed?
                      </label>
                      <input
                        type="text"
                        value={form.externalAgencyNeeded}
                        disabled
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 bg-gray-100 text-sm sm:text-base"
                      />
                    </div>
                    {form.externalAgencyNeeded === "yes" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                          Agency Name
                        </label>
                        <input
                          type="text"
                          value={form.agencyName}
                          disabled
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 bg-gray-100 text-sm sm:text-base"
                        />
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        Approx. Expenditure
                      </label>
                      <input
                        type="text"
                        value={form.approxExpenditure}
                        disabled
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 bg-gray-100 text-sm sm:text-base"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Admin Approval */}
              {currentStep === 5 && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="border-b border-gray-200 pb-3 sm:pb-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
                      <AlertCircle className="w-5 h-5 sm:w-7 sm:h-7 text-purple-500" />
                      Admin Approval
                    </h2>
                    <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                      {form?.adminApprovalStatus === "approved"
                        ? "This request has been approved by Admin."
                        : form?.adminApprovalStatus === "rejected"
                          ? "This request was rejected by Admin."
                          : "This request is pending admin approval."}
                    </p>
                  </div>
                  {form.adminApprovalStatus !== "approved" &&
                    form.adminApprovalStatus !== "rejected" && (
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <button
                          type="button"
                          className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium text-sm sm:text-base"
                          onClick={() => openConfirmationModal("approved")}
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium text-sm sm:text-base"
                          onClick={() => openConfirmationModal("rejected")}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                </div>
              )}

              {/* Step 6: Closure */}
              {currentStep === 6 && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="border-b border-gray-200 pb-3 sm:pb-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
                      <CheckSquare className="w-5 h-5 sm:w-7 sm:h-7 text-green-500" />
                      Closure
                    </h2>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg sm:rounded-xl p-4 sm:p-6">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <CheckSquare className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
                      <h3 className="text-base sm:text-lg font-semibold text-green-800">
                        Finalize Request
                      </h3>
                    </div>
                    <p className="text-green-700 text-sm sm:text-base">
                      The maintenance request has been completed.
                    </p>
                  </div>
                  <div className="mt-3 sm:mt-4 bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                    <h3 className="text-sm font-semibold text-gray-800 mb-2 sm:mb-3">
                      Equipment Status
                    </h3>
                    {form.equipmentStatus === "active" && (
                      <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 sm:px-3 sm:py-1 rounded-full">
                        Active
                      </span>
                    )}
                    {form.equipmentStatus === "damaged" && (
                      <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 sm:px-3 sm:py-1 rounded-full">
                        Damaged
                      </span>
                    )}
                    {form.equipmentStatus === "maintenance" && (
                      <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 sm:px-3 sm:py-1 rounded-full">
                        In Maintenance
                      </span>
                    )}
                  </div>
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        Completion Remarks (Lab)
                      </label>
                      <textarea
                        value={form.completionRemarkLab}
                        disabled
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 bg-gray-100 text-sm sm:text-base"
                        rows={2}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                          Completed By (Lab)
                        </label>
                        <input
                          type="text"
                          value={form.labCompletionName}
                          disabled
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 bg-gray-100 text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                          Completion Date (Lab)
                        </label>
                        <input
                          type="text"
                          value={form.labCompletionDate}
                          disabled
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 bg-gray-100 text-sm sm:text-base"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        Completion Remarks (Maintenance)
                      </label>
                      <textarea
                        value={form.completionRemarkMaintenance}
                        disabled
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 bg-gray-100 text-sm sm:text-base"
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        Closed Date (Maintenance)
                      </label>
                      <input
                        type="text"
                        value={form.maintenanceClosedDate}
                        disabled
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 bg-gray-100 text-sm sm:text-base"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
                <button
                  type="button"
                  className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto px-4 sm:px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-medium text-sm sm:text-base justify-center"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                  Previous
                </button>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                  {currentStep < 6 && (
                    <button
                      type="button"
                      className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium text-sm sm:text-base justify-center"
                      onClick={nextStep}
                    >
                      Next
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  )}
                  <button
                    type="button"
                    className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto px-4 sm:px-6 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition-all font-medium text-sm sm:text-base justify-center"
                    onClick={downloadPDF}
                  >
                    <span className="text-base">📄</span>
                    Download PDF
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmationModal.isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-sm z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
              Confirm{" "}
              {confirmationModal.action === "approved"
                ? "Approval"
                : "Rejection"}
            </h2>
            <p className="text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base">
              Are you sure you want to {confirmationModal.action} this request?
            </p>
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={closeConfirmationModal}
                className="w-full sm:w-auto px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={() => handleApproval(confirmationModal.action)}
                className={`w-full sm:w-auto px-4 py-2 text-white rounded-lg text-sm sm:text-base ${
                  confirmationModal.action === "approved"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {confirmationModal.action === "approved" ? "Approve" : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminRequestPage;
