
export const getUserInfo = (pdf, pageWidth, margin, yOffset, userData) => {
    const info = [
      ['Name', userData.name],
      ['Email', userData.email],
      ['Age', userData.age],
      ['Gender', userData.gender],
      ['Weight', userData.weight + ' kg'],
      ['Height', userData.height + ' m'],
    ];
  
    const maxWidth = pageWidth - 2 * margin;
    const col1X = margin;
    const col2X = margin + maxWidth / 2;
    const rowHeight = 10;
  
    // Header
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('User Info', col1X, yOffset);
    pdf.text('Value', col2X, yOffset);
    yOffset += 4;
    pdf.setDrawColor(0);
    pdf.line(margin, yOffset, margin + maxWidth, yOffset);
    yOffset += 6;
  
    // Content
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    info.forEach(([label, value]) => {
      pdf.text(label, col1X, yOffset);
      pdf.text(value.toString(), col2X, yOffset);
      yOffset += rowHeight;
  
      // Optional row separator
      pdf.setDrawColor(200);
      pdf.line(margin, yOffset - 4, margin + maxWidth, yOffset - 4);
    });
  
    return yOffset + 10;
  };
  