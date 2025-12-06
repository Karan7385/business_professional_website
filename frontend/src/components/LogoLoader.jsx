import LOGO from '../assets/logos/logo.png';

export default function Loader() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-amber-50 via-yellow-100 to-green-50 flex items-center justify-center overflow-hidden relative px-4">
      {/* Animated background orbs */}
      <div className="pointer-events-none">
        <div className="absolute -top-10 -left-10 sm:top-10 sm:left-10 w-40 h-40 sm:w-60 sm:h-60 lg:w-72 lg:h-72 bg-amber-200 rounded-full mix-blend-multiply blur-3xl opacity-70 animate-pulse" />
        <div className="absolute top-24 -right-16 sm:top-32 sm:right-10 w-40 h-40 sm:w-60 sm:h-60 lg:w-72 lg:h-72 bg-yellow-200 rounded-full mix-blend-multiply blur-3xl opacity-70 animate-pulse [animation-delay:1s]" />
        <div className="absolute -bottom-10 left-12 sm:bottom-10 sm:left-40 w-40 h-40 sm:w-60 sm:h-60 lg:w-72 lg:h-72 bg-green-200 rounded-full mix-blend-multiply blur-3xl opacity-70 animate-pulse [animation-delay:2s]" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Outer rotating gradient ring */}
        <div className="relative w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40">
          {/* Outer ring */}
          <div
            className="
              absolute inset-0 rounded-full
              bg-[conic-gradient(from_0deg,_#7c2d3a,_#d4af37,_#4a7c59,_#7c2d3a)]
              animate-[spin_3s_linear_infinite]
            "
          >
            <div className="absolute inset-1 bg-white rounded-full shadow-2xl" />
          </div>

          {/* Middle ring */}
          <div
            className="
              absolute inset-3 rounded-full
              bg-[conic-gradient(from_180deg,_#4a7c59,_#d4af37,_#7c2d3a,_#4a7c59)]
              animate-[spin_2s_linear_infinite_reverse]
            "
          >
            <div className="absolute inset-1 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-full shadow-inner" />
          </div>

          {/* Logo container */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-full shadow-lg flex items-center justify-center p-3">
              <img
                src={LOGO}
                alt="Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Orbiting dots */}
          <div className="absolute top-1/2 left-1/2 w-full h-full animate-[spin_4s_linear_infinite]">
            <div className="absolute top-0 left-1/2 w-3 h-3 bg-amber-600 rounded-full -ml-1.5 shadow-lg" />
          </div>
          <div className="absolute top-1/2 left-1/2 w-full h-full animate-[spin_4s_linear_infinite] [animation-delay:1s]">
            <div className="absolute top-0 left-1/2 w-3 h-3 bg-yellow-600 rounded-full -ml-1.5 shadow-lg" />
          </div>
          <div className="absolute top-1/2 left-1/2 w-full h-full animate-[spin_4s_linear_infinite] [animation-delay:2s]">
            <div className="absolute top-0 left-1/2 w-3 h-3 bg-green-600 rounded-full -ml-1.5 shadow-lg" />
          </div>
        </div>

        {/* Loading text with shimmer-like pulse */}
        <div className="mt-8 sm:mt-10 text-center">
          <div className="relative inline-block">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-800 via-yellow-700 to-green-800 bg-clip-text text-transparent animate-pulse">
              Loading
            </h2>
            <div className="flex justify-center mt-2 space-x-1">
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-amber-600 rounded-full animate-bounce" />
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-yellow-600 rounded-full animate-bounce [animation-delay:0.1s]" />
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-green-600 rounded-full animate-bounce [animation-delay:0.2s]" />
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-6 sm:mt-8 w-48 sm:w-64 md:w-72 h-2 sm:h-2.5 bg-amber-200 rounded-full overflow-hidden shadow-inner">
          <div
            className="
              h-full rounded-full
              bg-gradient-to-r from-amber-600 via-yellow-500 to-green-600
              animate-[pulse_2s_ease-in-out_infinite]
            "
          />
        </div>
      </div>

      {/* Floating particles */}
      <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-400 rounded-full animate-ping" />
      <div className="absolute top-3/4 right-1/4 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-yellow-400 rounded-full animate-ping [animation-delay:0.5s]" />
      <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-ping [animation-delay:1s]" />
    </div>
  );
}