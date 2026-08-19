export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#f3f4f6]/60 backdrop-blur-sm">
      
      {/* Simple Music Wave Dots */}
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 bg-[#0055a5] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-3 h-3 bg-[#0055a5] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-3 h-3 bg-[#0055a5] rounded-full animate-bounce"></div>
      </div>

    </div>
  );
}