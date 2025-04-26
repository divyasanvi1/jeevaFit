// src/utils/generatePDF.js
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const generatePDF = async () => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = 210;
  const margin = 10;
  const maxWidth = pageWidth - 2 * margin;
  let yOffset = 20;

  // Header
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Medical Health Report', pageWidth / 2, 15, { align: 'center' });

  const dateStr = new Date().toLocaleDateString();
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Date: ${dateStr}`, pageWidth - margin, 10, { align: 'right' });

  // User info
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) {
    yOffset += 10;
    pdf.setDrawColor(180);
    pdf.setLineWidth(0.3);
    pdf.rect(margin, yOffset, maxWidth, 40);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    const lines = [
      `Name: ${user.name || ''}`,
      `Email: ${user.email || ''}`,
      `Gender: ${user.gender || ''}`,
      `Age: ${user.age || ''}`,
      `Weight: ${user.weight || ''} kg`,
      `Height: ${user.height || ''} cm`,
    ];
    let infoY = yOffset + 7;
    lines.forEach((line, index) => {
      const x = index % 2 === 0 ? margin + 5 : pageWidth / 2;
      if (index % 2 === 0 && index !== 0) infoY += 7;
      pdf.text(line, x, infoY);
    });
    yOffset += 45;
  }

  const sections = [
    { id: 'heart-rate-chart', label: 'Heart Rate (bpm)' },
    { id: 'oxygen-saturation-chart', label: 'Oxygen Saturation (%)' },
    { id: 'respiratory-rate-chart', label: 'Respiratory Rate (breaths/min)' },
    { id: 'blood-pressure-chart', label: 'Blood Pressure (mmHg)' },
    { id: 'hrv-chart', label: 'Heart Rate Variability (HRV)' },
  ];

  for (let i = 0; i < sections.length; i++) {
    const { id, label } = sections[i];
    const element = document.getElementById(id);
    if (!element) continue;

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');
    const imgHeight = (canvas.height * maxWidth) / canvas.width;

    // Add section title
    if (yOffset + imgHeight + 20 > 290) {
      pdf.addPage();
      yOffset = 20;
    }

    pdf.setFontSize(13);
    pdf.setFont('helvetica', 'bold');
    pdf.text(label, margin, yOffset);
    yOffset += 5;

    pdf.setFont('helvetica', 'normal');
    pdf.addImage(imgData, 'PNG', margin, yOffset, maxWidth, imgHeight);
    yOffset += imgHeight + 10;
  }

  // Footer with page number
  const pageCount = pdf.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(10);
    pdf.text(`Page ${i} of ${pageCount}`, pageWidth / 2, 290, { align: 'center' });
  }

  pdf.save(`Medical_Health_Report_${dateStr}.pdf`);
};

export default generatePDF;
