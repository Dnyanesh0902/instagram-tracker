import React, { useState } from 'react';
import { HelpCircle, Download, FileJson, CheckCircle2, ChevronDown, ChevronUp, Lock } from 'lucide-react';

export default function InstructionGuide() {
  const [isOpen, setIsOpen] = useState(false);

  const steps = [
    {
      title: "Go to Download Your Information",
      description: "Log in to Instagram on your phone or web browser. Navigate to your Profile > Menu (three lines) > Settings > Accounts Center > Your information and permissions > Download your information."
    },
    {
      title: "Create a Download Request",
      description: "Click 'Request a download' or 'Download or transfer information'. Choose 'Some of your information' rather than 'All available information' to keep the download size small."
    },
    {
      title: "Select Followers & Following",
      description: "Scroll down, check the box next to 'Followers and following', and click Next. This is the only folder we need!"
    },
    {
      title: "Select Format as JSON (CRITICAL)",
      description: "On the final options screen, change the 'Format' dropdown from 'HTML' to 'JSON'. Set the date range to 'All time' and media quality to 'Low' (to speed it up). Click 'Submit request'."
    },
    {
      title: "Wait & Download",
      description: "Instagram will email you in 5 to 15 minutes when the file is ready. Go back to the 'Download your information' page, click 'Download' next to your request, enter your password, and save the .zip file."
    }
  ];

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          background: 'none',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: 'var(--text-main)',
          cursor: 'pointer',
          fontFamily: 'inherit',
          fontSize: '1.1rem',
          fontWeight: 600
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <HelpCircle style={{ color: 'var(--accent-pink)' }} size={22} />
          How do I get my Instagram data?
        </span>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {isOpen && (
        <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', padding: '0.75rem', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '10px' }}>
            <Lock style={{ color: 'var(--success-color)', flexShrink: 0, marginTop: '2px' }} size={18} />
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              <strong style={{ color: 'var(--text-main)' }}>Privacy-First:</strong> All processing is done 100% locally on your computer. Your file is never uploaded to any server, and your passwords are never required.
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {steps.map((step, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '1rem' }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'var(--instagram-gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '0.85rem',
                  color: 'white',
                  flexShrink: 0,
                  boxShadow: '0 2px 8px rgba(193,53,132,0.2)'
                }}>
                  {idx + 1}
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                    {step.title}
                  </h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ 
            marginTop: '1.5rem', 
            padding: '1rem', 
            background: 'rgba(255, 255, 255, 0.03)', 
            border: '1px dashed var(--border-color)', 
            borderRadius: '10px',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <FileJson size={16} style={{ color: 'var(--text-secondary)' }} />
            <span>Once you get the zip file, just drag and drop it here. You don't need to extract it!</span>
          </div>
        </div>
      )}
    </div>
  );
}
