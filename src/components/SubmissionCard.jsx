import { formatDate, buildForwardMessage, copyToClipboard } from '../utils/helpers';

export default function SubmissionCard({ submission, onToggleRead, onDelete, onToast }) {
  const { name, ig, intro, created_at, read } = submission;

  const handleCopy = async () => {
    await copyToClipboard(buildForwardMessage(submission));
    onToast('已複製！貼去 DM 啦');
  };

  return (
    <div
      className={`bg-gray-50 rounded-lg p-3 mb-1.5 border border-gray-200 transition-opacity ${
        is_read ? 'opacity-50' : ''
      }`}
      style={{ borderLeft: `3px solid ${is_read ? '#2b8a3e' : '#f06595'}` }}
    >
      <div className="flex justify-between items-center mb-1.5">
        <div>
          <span className="font-bold text-sm">{name}</span>
          {ig && <span className="ml-2 text-xs text-gray-400">@{ig}</span>}
        </div>
        <span className="text-[10px] text-gray-300">{formatDate(created_at)}</span>
      </div>
      <p className="text-[13px] leading-relaxed text-gray-600 mb-2 whitespace-pre-wrap break-words">
        {intro}
      </p>
      <div className="flex gap-1.5 flex-wrap">
        <button onClick={handleCopy} className="btn-ghost text-xs">📋 複製</button>
        <button
          onClick={() => onToggleRead(submission.id)}
          className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
            read
              ? 'border border-gray-300 bg-transparent text-gray-400'
              : 'bg-brand-green text-white'
          }`}
        >
          {is_read ? '↩ 未處理' : '✅ 已處理'}
        </button>
        <button
          onClick={() => onDelete(submission.id)}
          className="px-2.5 py-1 rounded-md text-gray-400 hover:text-red-400 text-sm"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
