export default function WaveLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-50/60 backdrop-blur-sm transition-all duration-300 animate-in fade-in">
      <div className="flex items-center gap-2">
        {/* Deep Fix: Using standard inline styles for perfect animation delays across all browsers */}
        <div className="w-3.5 h-3.5 bg-[#0055a5] rounded-full animate-bounce" style={{ animationDelay: '-0.3s' }}></div>
        <div className="w-3.5 h-3.5 bg-[#0055a5] rounded-full animate-bounce" style={{ animationDelay: '-0.15s' }}></div>
        <div className="w-3.5 h-3.5 bg-[#0055a5] rounded-full animate-bounce"></div>
      </div>
    </div>
  );
}