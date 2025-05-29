
import jsPDF from 'jspdf';

interface MedicationEntry {
  id: number;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
  skipped?: boolean;
}

interface VitalEntry {
  id: number;
  type: string;
  value: string;
  time: string;
  status: string;
}

interface HistoryDay {
  date: string;
  medications?: MedicationEntry[];
  vitals?: VitalEntry[];
}

export const exportHistoryToPDF = (
  medicationHistory: HistoryDay[],
  vitalsHistory: HistoryDay[],
  adherencePercentage: number,
  timeframe: string
) => {
  const doc = new jsPDF();
  let yPosition = 20;
  
  // Title
  doc.setFontSize(20);
  doc.text('Histórico Médico - MedControl', 20, yPosition);
  yPosition += 15;
  
  // Export date
  doc.setFontSize(10);
  const exportDate = new Date().toLocaleDateString('pt-BR');
  doc.text(`Exportado em: ${exportDate}`, 20, yPosition);
  yPosition += 10;
  
  // Timeframe
  const timeframeText = timeframe === "week" ? "Última Semana" : 
                       timeframe === "month" ? "Último Mês" : "Últimos 3 Meses";
  doc.text(`Período: ${timeframeText}`, 20, yPosition);
  yPosition += 15;
  
  // Adherence summary
  doc.setFontSize(14);
  doc.text('Resumo de Adesão', 20, yPosition);
  yPosition += 8;
  doc.setFontSize(12);
  doc.text(`Adesão geral: ${adherencePercentage}%`, 20, yPosition);
  yPosition += 15;
  
  // Medications section
  doc.setFontSize(14);
  doc.text('Histórico de Medicações', 20, yPosition);
  yPosition += 10;
  
  medicationHistory.forEach((day) => {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(day.date, 20, yPosition);
    yPosition += 8;
    
    day.medications?.forEach((med) => {
      doc.setFont(undefined, 'normal');
      doc.setFontSize(10);
      
      const status = med.taken ? 'Tomado' : med.skipped ? 'Ignorado' : 'Não tomado';
      const statusSymbol = med.taken ? '✓' : med.skipped ? '○' : '✗';
      
      doc.text(`${med.time} - ${med.name} ${med.dosage} - ${statusSymbol} ${status}`, 25, yPosition);
      yPosition += 6;
    });
    
    yPosition += 5;
  });
  
  // Add new page for vitals if needed
  if (yPosition > 200) {
    doc.addPage();
    yPosition = 20;
  } else {
    yPosition += 10;
  }
  
  // Vitals section
  doc.setFontSize(14);
  doc.text('Histórico de Sinais Vitais', 20, yPosition);
  yPosition += 10;
  
  vitalsHistory.forEach((day) => {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(day.date, 20, yPosition);
    yPosition += 8;
    
    day.vitals?.forEach((vital) => {
      doc.setFont(undefined, 'normal');
      doc.setFontSize(10);
      
      const vitalText = vital.type === 'blood-pressure' ? `Pressão Arterial: ${vital.value} mmHg` :
                       vital.type === 'glucose' ? `Glicemia: ${vital.value} mg/dL` :
                       vital.type === 'heart-rate' ? `Batimentos: ${vital.value} BPM` : vital.value;
      
      const statusText = vital.status === 'normal' ? 'Normal' : 
                        vital.status === 'elevated' ? 'Elevado' : 'Baixo';
      
      doc.text(`${vital.time} - ${vitalText} - ${statusText}`, 25, yPosition);
      yPosition += 6;
    });
    
    yPosition += 5;
  });
  
  // Generate filename with current date
  const fileName = `historico-medico-${new Date().toISOString().split('T')[0]}.pdf`;
  
  // Download the PDF
  doc.save(fileName);
};
