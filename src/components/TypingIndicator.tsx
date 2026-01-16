export function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex gap-1">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
