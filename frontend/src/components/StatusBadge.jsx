import clsx from 'clsx'

export default function StatusBadge({ status }) {
  const colors = {
    saved: 'bg-slate-100 text-slate-700 border-slate-200',
    applied: 'bg-blue-50 text-blue-700 border-blue-200',
    rejected: 'bg-red-50 text-red-700 border-red-200',
  }

  return (
    <span className={clsx(
      'px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize',
      colors[status] || colors.saved
    )}>
      {status}
    </span>
  )
}
