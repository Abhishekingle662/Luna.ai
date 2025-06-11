export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="text-4xl font-bold text-purple-400 animate-pulse">
          Luna.ai
        </div>
        <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-white/70 text-sm">
          Loading your cosmic experience...
        </div>
      </div>
    </div>
  )
}
