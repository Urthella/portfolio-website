'use client'

export default function Loading() {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="text-center">
                {/* Main Loading Animation */}
                <div className="relative mb-8">
                    {/* Outer ring */}
                    <div className="w-24 h-24 mx-auto rounded-full border-4 border-cyan-500/20 animate-pulse"></div>

                    {/* Spinning ring */}
                    <div className="absolute inset-0 w-24 h-24 mx-auto rounded-full border-4 border-transparent border-t-cyan-400 border-r-purple-400 animate-spin"></div>

                    {/* Center glow */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500/30 to-purple-500/30 animate-pulse"></div>
                    </div>
                </div>

                {/* Loading text */}
                <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
                    Loading...
                </h2>

                {/* Subtitle */}
                <p className="text-gray-400 text-sm animate-pulse">
                    Preparing the digital universe
                </p>

                {/* Progress bar */}
                <div className="w-64 h-1 mx-auto mt-6 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full animate-loading-bar"></div>
                </div>
            </div>

            <style jsx>{`
        @keyframes loading-bar {
          0% {
            width: 0%;
            margin-left: 0%;
          }
          50% {
            width: 40%;
            margin-left: 30%;
          }
          100% {
            width: 0%;
            margin-left: 100%;
          }
        }
        
        .animate-loading-bar {
          animation: loading-bar 2s ease-in-out infinite;
        }
      `}</style>
        </div>
    )
}
