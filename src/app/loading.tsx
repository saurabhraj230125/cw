export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#f3f4f6]/60 backdrop-blur-sm animate-in fade-in duration-300">
      
      {/* Simple Music Wave Dots */}
      <div className="flex items-center gap-1.5">
        {/* 🚨 DEEP FIX: Using inline styles guarantees the animation delay works perfectly in production */}
        <div className="w-3.5 h-3.5 bg-[#0055a5] rounded-full animate-bounce" style={{ animationDelay: '-0.3s' }}></div>
        <div className="w-3.5 h-3.5 bg-[#0055a5] rounded-full animate-bounce" style={{ animationDelay: '-0.15s' }}></div>
        <div className="w-3.5 h-3.5 bg-[#0055a5] rounded-full animate-bounce"></div>
      </div>

    </div>
  );
}