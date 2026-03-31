import { useState } from 'react';
import SubmissionCard from './SubmissionCard';
import { buildBulkForwardMessage, copyToClipboard } from '../utils/helpers';

export default function AdminPage({
  profiles,
  subs,
  loading,
  onAddProfile,
  onUpdateProfile,
  onDeleteProfile,
  onToggleRead,
  onMarkAllRead,
  onDeleteSub,
  onDeleteSubsByProfile,
  onToast,
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editLabel, setEditLabel] = useState('');
  const [filter, setFilter] = useState('all');

  const addProfile = async () => {
    if (!newLabel.trim()) return;
    if (profiles.some((p) => p.label === newLabel.trim())) {
      onToast('呢個名已經用咗');
      return;
    }
    const { error } = await onAddProfile(newLabel.trim());
    if (error) { onToast('新增失敗'); return; }
    setNewLabel('');
    setShowAdd(false);
    onToast('已新增');
  };

  const toggleActive = async (id, current) => {
    await onUpdateProfile(id, { active: !current });
    onToast('已更新');
  };

  const deleteProfile = async (id) => {
    await onDeleteSubsByProfile(id);
    await onDeleteProfile(id);
    setConfirmDel(null);
    setExpandedId(null);
    onToast('已刪除');
  };

  const updateLabel = async (id) => {
    if (!editLabel.trim()) return;
    await onUpdateProfile(id, { label: editLabel.trim() });
    setEditId(null);
    onToast('已更新');
  };

  const copyAllUnread = async (profileId) => {
    const unread = subs.filter((s) => s.target === profileId && !s.read);
    if (unread.length === 0) { onToast('全部都處理咗喇'); return; }
    await copyToClipboard(buildBulkForwardMessage(unread));
    onToast(`已複製 ${unread.length} 份！`);
  };

  const getSubsFor = (pid) => {
    let list = subs.filter((s) => s.target === pid);
    if (filter === 'unread') list = list.filter((s) => !s.read);
    if (filter === 'read') list = list.filter((s) => s.read);
    return list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  };

  const totalUnread = subs.filter((s) => !s.read).length;

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-7 h-7 border-[3px] border-gray-200 border-t-brand-pink rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-3.5 py-4 pb-16">
      <h1 className="text-xl font-black text-center mb-4">🔒 後台管理</h1>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <StatBox value={profiles.length} label="出 Pool" />
        <StatBox value={subs.length} label="總提交" />
        <StatBox value={totalUnread} label="未處理" highlight={totalUnread > 0} />
      </div>

      <button onClick={() => setShowAdd(!showAdd)} className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-brand-pink to-brand-orange text-white font-bold text-sm mb-2.5">
        + 新增投稿人
      </button>

      {showAdd && (
        <div className="flex gap-2 mb-3 flex-wrap animate-fade-up">
          <input
            className="flex-1 min-w-[160px] px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm bg-gray-50 focus:outline-none focus:border-brand-pink"
            placeholder="例：A小姐、B先生"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addProfile()}
          />
          <button onClick={addProfile} className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-brand-pink to-brand-orange text-white font-bold text-sm">新增</button>
          <button onClick={() => setShowAdd(false)} className="btn-ghost">取消</button>
        </div>
      )}

      <div className="flex gap-1 mb-3">
        {[['all', '全部'], ['unread', '未處理'], ['read', '已處理']].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === key
                ? 'border border-brand-pink bg-pink-50 text-brand-pink font-bold'
                : 'border border-gray-300 bg-white text-gray-500'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {profiles.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-8">未有投稿人，先新增啦</p>
        )}

        {profiles.map((pr) => {
          const pSubs = getSubsFor(pr.id);
          const allSubs = subs.filter((s) => s.target === pr.id);
          const unread = allSubs.filter((s) => !s.read).length;
          const isOpen = expandedId === pr.id;

          return (
            <div key={pr.id} className={`bg-white border border-gray-200 rounded-xl overflow-hidden animate-fade-up ${pr.active === false ? 'opacity-50' : ''}`}>
              <div className="flex justify-between items-center px-4 py-3.5 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setExpandedId(isOpen ? null : pr.id)}>
                <div className="flex items-center gap-2 flex-wrap">
                  {editId === pr.id ? (
                    <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <input className="w-36 px-2 py-1 rounded-md border border-gray-300 text-sm focus:outline-none focus:border-brand-pink" value={editLabel} onChange={(e) => setEditLabel(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && updateLabel(pr.id)} autoFocus />
                      <button className="btn-ghost-sm" onClick={() => updateLabel(pr.id)}>✓</button>
                      <button className="btn-ghost-sm" onClick={() => setEditId(null)}>✕</button>
                    </div>
                  ) : (
                    <span className="font-extrabold text-base">{pr.label}</span>
                  )}
                  {pr.active === false && <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">已下架</span>}
                  {unread > 0 && <span className="text-[11px] font-bold text-brand-orange bg-gradient-to-r from-pink-50 to-orange-50 px-2.5 py-0.5 rounded-full">{unread} 新</span>}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{allSubs.length} 份</span>
                  <span className={`text-[11px] text-gray-300 transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
                </div>
              </div>

              {isOpen && (
                <div className="px-4 pb-4 border-t border-gray-100">
                  <div className="flex gap-1.5 flex-wrap py-3">
                    <button className="btn-ghost" onClick={() => { setEditId(pr.id); setEditLabel(pr.label); }}>✏️ 改名</button>
                    <button className="btn-ghost" onClick={() => toggleActive(pr.id, pr.active !== false)}>{pr.active === false ? '📢 上架' : '🔇 下架'}</button>
                    <button className="btn-ghost" onClick={() => confirmDel === pr.id ? deleteProfile(pr.id) : setConfirmDel(pr.id)}>{confirmDel === pr.id ? '⚠️ 確定？' : '🗑️ 刪除'}</button>
                    {unread > 0 && (
                      <>
                        <button className="btn-accent" onClick={() => copyAllUnread(pr.id)}>📋 複製全部未處理 ({unread})</button>
                        <button className="btn-ghost" onClick={() => { onMarkAllRead(pr.id); onToast('全部標記已處理'); }}>✅ 全標已處理</button>
                      </>
                    )}
                  </div>

                  {pSubs.length === 0 && <p className="text-center text-gray-300 text-sm py-4">冇符合篩選嘅提交</p>}
                  {pSubs.map((sub) => (
                    <SubmissionCard key={sub.id} submission={sub} onToggleRead={onToggleRead} onDelete={onDeleteSub} onToast={onToast} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <p className="text-center text-xs text-gray-300 mt-8">數據儲存喺 Supabase ☁️</p>
    </div>
  );
}

function StatBox({ value, label, highlight = false }) {
  return (
    <div className="bg-white rounded-xl py-3 px-2 text-center border border-gray-200 flex flex-col gap-0.5">
      <span className={`text-xl font-black ${highlight ? 'text-brand-orange' : ''}`}>{value}</span>
      <span className="text-[10px] text-gray-400 font-medium">{label}</span>
    </div>
  );
}
