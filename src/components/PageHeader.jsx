export default function PageHeader({ eyebrow, title, subtitle, action }) {
  return (
    <div className="bg-ink text-stone px-6 py-12 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10 flex items-end justify-between flex-wrap gap-6">
        <div>
          {eyebrow && (
            <span className="text-brass text-xs tracking-[0.2em] uppercase mb-3 block">
              {eyebrow}
            </span>
          )}
          <h1 className="font-display text-4xl lg:text-5xl leading-[1.05] font-medium">
            {title}
          </h1>
          {subtitle && (
            <p className="text-stone/60 mt-3 max-w-md">{subtitle}</p>
          )}
        </div>
        {action}
      </div>

      <svg
        className="absolute bottom-0 right-0 w-1/3 opacity-[0.06]"
        viewBox="0 0 500 200"
        fill="none"
      >
        <path
          d="M0 200V120H40V80H80V140H120V60H160V150H200V40H240V130H280V90H320V160H360V70H400V140H440V100H480V180H500V200H0Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}