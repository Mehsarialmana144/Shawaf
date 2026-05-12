export default function SelectionCard({
  emoji,
  label,
  selected,
  onClick,
  wide = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full min-w-0 flex items-center justify-center rounded-xl border-2 transition-all text-xs sm:text-sm font-medium cursor-pointer text-center
        ${wide ? 'flex-row gap-3 px-3 py-4' : 'flex-col gap-2 px-2.5 sm:px-3 py-4'}
        ${
          selected
            ? 'border-[#006A4E] bg-[#E6F2EE] text-[#006A4E] shadow-sm'
            : 'border-stone-200 bg-white text-stone-700 hover:border-[#D4AF37] hover:bg-[#FBF6E3]'
        }`}
    >
      <span className="text-xl leading-none shrink-0">{emoji}</span>

      <span
        className={`leading-snug min-w-0 ${
          selected ? 'text-[#006A4E]' : 'text-stone-700'
        }`}
        dir="auto"
      >
        {label}
      </span>
    </button>
  )
}