import html2canvas from 'html2canvas';

export const addChartsToPDF = async (pdf, sections, margin, maxWidth, yOffset, pageWidth) => {
  for (let i = 0; i < sections.length; i++) {
    const { id, label } = sections[i];
    const element = document.getElementById(id);
    if (!element) continue;

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');
    const imgHeight = (canvas.height * maxWidth) / canvas.width;

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

  return yOffset;
};
