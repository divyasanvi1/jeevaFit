// src/utils/generatePDF.js
import jsPDF from 'jspdf';
import { getUserInfo } from './getUserInfo';
import { addChartsToPDF } from './addChartsToPDF';
import { addFooterToPDF } from './addFooterToPDF';

const generatePDF = async ({ userData, healthData }) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageHeight = pdf.internal.pageSize.height;
  const pageWidth = pdf.internal.pageSize.width;
  const margin = 15;
  const maxWidth = pageWidth - 2 * margin;
  const dateStr = new Date().toLocaleDateString();
  let yOffset = 20;

  const vitalData = healthData?.data?.[0] || {};
  console.log("pdf data",vitalData);
  console.log("Keys in vitalData:", Object.keys(vitalData));

  // Header
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Medical Health Report', pageWidth / 2, 15, { align: 'center' });

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Date: ${dateStr}`, pageWidth - margin, 10, { align: 'right' });

  yOffset += 10;

  // User Info
  yOffset = getUserInfo(pdf, pageWidth, margin, yOffset, userData);

  // Charts Section
  const sections = [
    { id: 'heart-rate-chart', label: 'Heart Rate (bpm)' },
    { id: 'oxygen-saturation-chart', label: 'Oxygen Saturation (%)' },
    { id: 'respiratory-rate-chart', label: 'Respiratory Rate (breaths/min)' },
    { id: 'blood-pressure-chart', label: 'Blood Pressure (mmHg)' },
    { id: 'hrv-chart', label: 'Heart Rate Variability (HRV)' },
  ];
  yOffset = await addChartsToPDF(pdf, sections, margin, maxWidth, yOffset, pageWidth);

  // Vitals Table
  const vitalRows = [
    ['Heart Rate (bpm)', vitalData.heartRate ?? 'N/A'],
    ['Oxygen Saturation (%)', vitalData.oxygenSaturation ?? 'N/A'],
    ['Respiratory Rate (breaths/min)', vitalData.respiratoryRate ?? 'N/A'],
    ['Systolic BP (mmHg)', vitalData.systolicBP ?? 'N/A'],
    ['Diastolic BP (mmHg)', vitalData.diastolicBP ?? 'N/A'],
    ['Heart Rate Variability (HRV)', vitalData.derived_HRV ?? 'N/A'],
    ['Body Temperature (°C)', vitalData.bodyTemperature ?? 'N/A'],
    ['Pulse Pressure (mmHg)', vitalData.derived_Pulse_Pressure ?? 'N/A'],
  ['MAP (mmHg)', vitalData.derived_MAP ?? 'N/A'],
  ];

  const rowHeight = 10;
  const col1X = margin;
  const col2X = margin + maxWidth / 2;

  // Table Header
  pdf.setFontSize(13);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Vital Sign', col1X, yOffset);
  pdf.text('Value', col2X, yOffset);
  yOffset += 5;

  pdf.setDrawColor(100);
  pdf.setLineWidth(0.5);
  pdf.line(margin, yOffset, margin + maxWidth, yOffset);
  yOffset += 4;

  // Table Rows
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');

  vitalRows.forEach(([label, value]) => {
    // Check for page break
    if (yOffset + rowHeight > pageHeight - margin) {
      pdf.addPage();
      yOffset = margin;

      // Redraw table header on new page
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(13);
      pdf.text('Vital Sign', col1X, yOffset);
      pdf.text('Value', col2X, yOffset);
      yOffset += 5;
      pdf.line(margin, yOffset, margin + maxWidth, yOffset);
      yOffset += 4;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
    }

    pdf.text(label, col1X, yOffset);
    pdf.text(value.toString(), col2X, yOffset);
    yOffset += rowHeight;

    // Divider
    pdf.setDrawColor(220);
    pdf.setLineWidth(0.3);
    pdf.line(margin, yOffset - 5, margin + maxWidth, yOffset - 5);
  });

  // Footer
  if (yOffset + 20 > pageHeight - margin) {
    pdf.addPage();
    yOffset = margin;
  }
  addFooterToPDF(pdf, pageWidth);

  // Save
  pdf.save(`Medical_Health_Report_${dateStr}.pdf`);
};

export default generatePDF;
