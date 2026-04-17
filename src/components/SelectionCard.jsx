export default function SelectionCard({ emoji, label, selected, onClick, wide = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-2 px-3 py-4 rounded-xl border-2 transition-all text-sm font-medium cursor-pointer
        ${wide ? 'flex-row gap-3' : ''}
        ${selected
          ? 'border-orange-500 bg-orange-50 text-orange-600'
          : 'border-stone-200 bg-white text-stone-700 hover:border-orange-300 hover:bg-orange-50/50'
        }`}
    >
      <span className="text-xl leading-none">{emoji}</span>
      <span className={selected ? 'text-orange-600' : 'text-stone-700'}>{label}</span>
    </button>
  )
}
