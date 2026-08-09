export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen flex bg-stone font-body">
      {/* Left panel — brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-ink text-stone flex-col justify-between p-12 relative overflow-hidden">
        <div className="relative z-10">
          <span className="font-display text-2xl tracking-tight">
            Haven&nbsp;&amp;&nbsp;Co.
          </span>
        </div>

        <div className="relative z-10">
          <h1 className="font-display text-5xl leading-[1.1] font-medium mb-4">
            Every listing<br />tells a story.
          </h1>
          <p className="text-stone/60 text-sm max-w-xs">
            Browse, list, and inquire — a marketplace built for people who
            take their next move seriously.
          </p>
        </div>

        {/* Subtle line-art skyline */}
        <svg
          className="absolute bottom-0 left-0 w-full opacity-[0.08]"
          viewBox="0 0 500 200"
          fill="none"
        >
          <path
            d="M0 200V120H40V80H80V140H120V60H160V150H200V40H240V130H280V90H320V160H360V70H400V140H440V100H480V180H500V200H0Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-sm relative">
          {/* Corner brackets — signature element */}
          <span className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-brass" />
          <span className="absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 border-brass" />
          <span className="absolute -bottom-3 -left-3 w-6 h-6 border-b-2 border-l-2 border-brass" />
          <span className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-brass" />

          <div className="bg-white p-10">
            <h2 className="font-display text-3xl font-medium text-ink mb-1">
              {title}
            </h2>
            <p className="text-slate text-sm mb-8">{subtitle}</p>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}