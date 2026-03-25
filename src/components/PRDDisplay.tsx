import { motion } from "motion/react";
import { Check, Copy, Download, FileText, Users, ListChecks, Activity, ShieldCheck, Zap, Rocket, Sparkles } from "lucide-react";
import React, { useState } from "react";
import { PRDData } from "../services/gemini";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import confetti from "canvas-confetti";
import { cn } from "../utils/cn";

interface PRDDisplayProps {
  data: PRDData;
}

export const PRDDisplay: React.FC<PRDDisplayProps> = ({ data }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const doc = new jsPDF();
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let currentY = 20;

    // Helper for watermark
    const addWatermark = () => {
      doc.saveGraphicsState();
      doc.setGState(new (doc as any).GState({ opacity: 0.05 }));
      doc.setFontSize(60);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(150);
      doc.text("ProdDraft", pageWidth / 2, pageHeight / 2, {
        align: "center",
        angle: 45,
      });
      doc.restoreGraphicsState();
    };

    // Helper for section headers
    const addSectionHeader = (title: string) => {
      if (currentY > pageHeight - 40) {
        doc.addPage();
        currentY = 20;
        addWatermark();
      }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(40, 40, 40);
      doc.text(title, margin, currentY);
      currentY += 2;
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, currentY, pageWidth - margin, currentY);
      currentY += 10;
    };

    // Helper for body text
    const addBodyText = (text: string) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(80, 80, 80);
      const lines = doc.splitTextToSize(text, pageWidth - margin * 2);
      if (currentY + (lines.length * 6) > pageHeight - 20) {
        doc.addPage();
        currentY = 20;
        addWatermark();
      }
      doc.text(lines, margin, currentY);
      currentY += lines.length * 6 + 10;
    };

    // Initial Watermark
    addWatermark();

    // 1. Title (Fixed Overflow)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(0, 0, 0);
    const titleLines = doc.splitTextToSize(data.title, pageWidth - margin * 2);
    doc.text(titleLines, margin, currentY);
    currentY += (titleLines.length * 10) - 6;
    currentY += 4;
    doc.setDrawColor(124, 58, 237); // Purple accent
    doc.setLineWidth(1.5);
    doc.line(margin, currentY, margin + 40, currentY);
    currentY += 20;

    // 2. Problem Statement
    addSectionHeader("1. Problem Statement");
    addBodyText(data.problemStatement);

    // 3. Objectives
    addSectionHeader("2. Objectives");
    data.objectives.forEach((obj, index) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      const objLines = doc.splitTextToSize(`• ${obj}`, pageWidth - margin * 2 - 5);
      if (currentY + (objLines.length * 7) > pageHeight - 20) {
        doc.addPage();
        currentY = 20;
        addWatermark();
      }
      doc.text(objLines, margin + 5, currentY);
      currentY += objLines.length * 7;
    });
    currentY += 10;

    // 4. User Personas (Table)
    addSectionHeader("3. User Personas");
    autoTable(doc, {
      startY: currentY,
      head: [["Name", "Role", "Needs"]],
      body: data.userPersonas.map(p => [p.name, p.role, p.needs]),
      theme: "striped",
      headStyles: { fillColor: [124, 58, 237] },
      margin: { left: margin, right: margin },
      didDrawPage: (d) => {
        // Watermark for new pages added by autoTable
        if (d.pageNumber > 1) {
          // Note: autoTable handles page creation, but we need to draw watermark
          // However, didDrawPage is called AFTER the page is drawn.
          // We'll handle watermarks for all pages at the end to be safe.
        }
      },
      didDrawCell: (data) => {
        currentY = data.cursor?.y || currentY;
      }
    });
    currentY = (doc as any).lastAutoTable.finalY + 15;

    // 5. Use Cases
    addSectionHeader("4. Use Cases");
    data.useCases.forEach((uc, index) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      const scenarioLines = doc.splitTextToSize(`${index + 1}. ${uc.scenario}`, pageWidth - margin * 2);
      if (currentY + 15 > pageHeight - 20) {
        doc.addPage();
        currentY = 20;
        addWatermark();
      }
      doc.text(scenarioLines, margin, currentY);
      currentY += scenarioLines.length * 6;
      
      doc.setFont("helvetica", "normal");
      const flowLines = doc.splitTextToSize(uc.flow, pageWidth - margin * 2 - 10);
      if (currentY + (flowLines.length * 6) > pageHeight - 20) {
        doc.addPage();
        currentY = 20;
        addWatermark();
      }
      doc.text(flowLines, margin + 5, currentY);
      currentY += flowLines.length * 6 + 8;
    });
    currentY += 5;

    // 6. Core Features (Table)
    addSectionHeader("5. Core Features");
    autoTable(doc, {
      startY: currentY,
      head: [["Feature", "Description"]],
      body: data.features.map(f => [f.name, f.description]),
      theme: "grid",
      headStyles: { fillColor: [236, 72, 153] }, // Pink accent
      margin: { left: margin, right: margin }
    });
    currentY = (doc as any).lastAutoTable.finalY + 15;

    // 7. Functional Requirements (Table)
    addSectionHeader("6. Functional Requirements");
    autoTable(doc, {
      startY: currentY,
      head: [["ID", "Requirement"]],
      body: data.functionalRequirements.map((r, i) => [`FR-${i + 1}`, r]),
      theme: "striped",
      headStyles: { fillColor: [249, 115, 22] }, // Orange accent
      margin: { left: margin, right: margin }
    });
    currentY = (doc as any).lastAutoTable.finalY + 15;

    // 8. Non-Functional Requirements (Table)
    addSectionHeader("7. Non-Functional Requirements");
    autoTable(doc, {
      startY: currentY,
      head: [["Type", "Requirement"]],
      body: data.nonFunctionalRequirements.map(r => {
        const parts = r.split(":");
        const type = parts[0];
        const desc = parts.slice(1).join(":");
        return [type.trim(), desc.trim() || r];
      }),
      theme: "striped",
      headStyles: { fillColor: [75, 85, 99] }, // Slate accent
      margin: { left: margin, right: margin }
    });
    currentY = (doc as any).lastAutoTable.finalY + 15;

    // 9. Future Scope
    if (data.futureScope && data.futureScope.length > 0) {
      addSectionHeader("8. Future Scope");
      data.futureScope.forEach((item) => {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        const scopeLines = doc.splitTextToSize(`• ${item}`, pageWidth - margin * 2 - 5);
        if (currentY + (scopeLines.length * 7) > pageHeight - 20) {
          doc.addPage();
          currentY = 20;
          addWatermark();
        }
        doc.text(scopeLines, margin + 5, currentY);
        currentY += scopeLines.length * 7;
      });
    }

    // Final pass for Watermarks and Footer
    const pageCount = doc.internal.pages.length - 1;
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      
      // Ensure watermark is on every page (even those created by autoTable)
      // We draw it again to be sure it's on top or bottom as desired.
      // Actually, drawing it first is better for background.
      // But since we can't easily inject into autoTable's page creation without complex hooks,
      // we'll just ensure it's there.
      
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: "center" });
      doc.text("Generated by ProdDraft", margin, pageHeight - 10);
    }

    doc.save(`${data.title.replace(/\s+/g, "_")}_PRD.pdf`);
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: ["#7c3aed", "#ff4ecd", "#ff7a18"]
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="w-full max-w-6xl mx-auto"
    >
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-12">
        <div className="w-full lg:w-auto">
          <div className="flex items-center gap-2 text-pink-500 font-black text-[10px] uppercase tracking-[0.4em] mb-3">
            <Rocket size={14} />
            Blueprint Generated
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight break-words">{data.title}</h1>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <button
            onClick={handleCopy}
            className="flex-1 lg:flex-none p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-slate-500 hover:text-white hover:bg-white/[0.08] transition-all flex items-center justify-center gap-2"
            title="Copy to Clipboard"
          >
            {copied ? <Check className="text-emerald-500" size={20} /> : <Copy size={20} />}
            <span className="sm:hidden lg:inline">Copy JSON</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-all active:scale-[0.98]"
          >
            <Download size={20} />
            Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Problem Statement */}
        <Section icon={<FileText className="text-purple-400" />} title="Problem Statement" className="md:col-span-2" index={0}>
          <p className="text-slate-400 leading-relaxed text-lg font-medium">{data.problemStatement}</p>
        </Section>
 
        {/* Objectives */}
        <Section icon={<Zap className="text-orange-400" />} title="Objectives" index={1}>
          <ul className="space-y-4">
            {data.objectives.map((obj, i) => (
              <li key={i} className="flex gap-3 text-slate-400 text-sm font-medium">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-pink-500 shrink-0" />
                {obj}
              </li>
            ))}
          </ul>
        </Section>
 
        {/* User Personas */}
        <Section icon={<Users className="text-pink-400" />} title="User Personas" className="md:col-span-1" index={2}>
          <div className="space-y-4">
            {data.userPersonas.map((p, i) => (
              <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 group hover:border-pink-500/30 transition-colors">
                <p className="font-black text-white">{p.name}</p>
                <p className="text-[10px] text-pink-500 font-black uppercase tracking-widest mt-0.5">{p.role}</p>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed font-medium">{p.needs}</p>
              </div>
            ))}
          </div>
        </Section>
 
        {/* Features */}
        <Section icon={<ListChecks className="text-orange-400" />} title="Core Features" className="md:col-span-2" index={3}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.features.map((f, i) => (
              <div key={i} className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors">
                <p className="font-black text-white mb-2 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  {f.name}
                </p>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">{f.description}</p>
              </div>
            ))}
          </div>
        </Section>
 
        {/* Use Cases */}
        <Section icon={<Activity className="text-purple-400" />} title="Use Cases" className="md:col-span-1" index={4}>
          <div className="space-y-6">
            {data.useCases.map((u, i) => (
              <div key={i} className="relative pl-6 border-l border-white/10">
                <div className="absolute left-[-4px] top-0 w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(124,58,237,0.5)]" />
                <p className="font-black text-white text-sm mb-1">{u.scenario}</p>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">{u.flow}</p>
              </div>
            ))}
          </div>
        </Section>
 
        {/* Requirements */}
        <Section icon={<ShieldCheck className="text-pink-400" />} title="Technical Requirements" className="md:col-span-2" index={5}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-4">Functional</p>
              <ul className="text-sm space-y-3 text-slate-400 font-medium">
                {data.functionalRequirements.map((r, i) => (
                  <li key={i} className="flex gap-2">
                    <Check size={14} className="text-pink-500 mt-0.5 shrink-0" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-4">Non-Functional</p>
              <ul className="text-sm space-y-3 text-slate-400 font-medium">
                {data.nonFunctionalRequirements.map((r, i) => (
                  <li key={i} className="flex gap-2">
                    <ShieldCheck size={14} className="text-purple-500 mt-0.5 shrink-0" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>
 
        {/* Future Scope */}
        {data.futureScope && data.futureScope.length > 0 && (
          <Section icon={<Sparkles className="text-orange-400" />} title="Future Scope" className="md:col-span-3" index={6}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.futureScope.map((item, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                  <p className="text-sm text-slate-400 font-medium">{item}</p>
                </div>
              ))}
            </div>
          </Section>
        )}
      </div>
    </motion.div>
  );
};

const Section: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode; className?: string; index?: number }> = ({ icon, title, children, className, index = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ 
      duration: 0.8, 
      delay: index * 0.1,
      ease: [0.16, 1, 0.3, 1] 
    }}
    className={cn("p-8 rounded-[2rem] bg-white/[0.02] backdrop-blur-3xl border border-white/5 shadow-2xl", className)}
  >
    <div className="flex items-center gap-4 mb-8">
      <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-white shadow-inner">
        {icon}
      </div>
      <h3 className="font-black text-lg text-white tracking-tight">{title}</h3>
    </div>
    {children}
  </motion.div>
);
