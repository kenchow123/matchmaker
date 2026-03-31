import { useState, useRef } from 'react';
import SearchableDropdown from './SearchableDropdown';
import CooldownBar from './CooldownBar';
import { useCooldown } from '../hooks/useCooldown';
import { INTRO_MIN_LENGTH, INTRO_MAX_LENGTH, NAME_MAX_LENGTH } from '../utils/constants';

export default function PublicPage({ profiles, loading, onSubmit, onToast }) {
  const [selected, setSelected] = useState(null);
  const [name, setName] = useState('');
  const [ig, setIg] = useState('');
  const [intro, setIntro] = useState('');
  const [honey, setHoney] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const loadTime = useRef(Date.now());
  const [cooldown, triggerCooldown] = useCooldown();

  const activeProfiles = profiles.filter((p) => p.active !== false);

  const validate = () => {
    if (honey) return '提交失敗';
    if (Date.now() - loadTime.current < 3000) return '請慢啲填寫';
    if (!selected) return '請揀選想認識嘅人';
    if (!name.trim()) return '請填寫暱稱';
    if (!intro.trim()) return '請填寫自我介紹';
    if (intro.trim().length < INTRO_MIN_LENGTH) return `自介太短喇，至少寫 ${INTRO_MIN_LENGTH} 個字`;
    if (intro.trim().length > INTRO_MAX_LENGTH) return `自介太長喇，最多 ${INTRO_MAX_LENGTH} 字`;
    if (cooldown > 0) return '請等冷卻時間結束後再提交';
    if (/(.)\1{9,}/.test(intro.trim().toLowerCase())) return '請認真填寫自介';
    return null;
  };

  const handleSubmit = async () => {
    const error = validate();
    if (error) { onToast(error); return; }

    setSubmitting(true);
    const result = await onSubmit({
      target: selected,
      name: name.trim(),
      ig: ig.trim(),
      intro: intro.trim(),
    });
    setSubmitting(false);

    if (result?.error) {
      onToast('提交失敗，請稍後再試');
      return;
    }

    triggerCooldown();
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setSelected(null);
    setName('');
    setIg('');
    setIntro('');
    loadTime.current = Date.now();
  };

  const canSubmit = selected && name.trim() && intro.trim().length >= INTRO_MIN_LENGTH && cooldown === 0 && !submitting;

  if (submitted) {
    return (
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl p-12 border border-gray-200 shadow-sm text-center animate-fade-up">
          <div className="text-5xl mb-4">💌</div>
          <h2 className="text-xl font-extrabold mb-2">提交成功！</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            管理員收到後會幫你轉發俾對方<br />請耐心等候 ☺️
          </p>
          <button onClick={handleReset} className="mt-5 px-6 py-2.5 rounded-lg bg-gradient-to-r from-brand-pink to-brand-orange text-white font-bold text-sm">
            再交一份
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <div className="bg-white rounded-2xl px-6 py-7 border border-gray-200 shadow-sm animate-fade-up relative">
        <div className="text-center mb-5">
          <h1 className="text-2xl font-black bg-gradient-to-r from-brand-pink to-brand-orange bg-clip-text text-transparent">
            💘 交友配對
          </h1>
          <p className="text-sm text-gray-400 mt-1">揀選你想認識嘅人，寫低自我介紹</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-7 h-7 border-[3px] border-gray-200 border-t-brand-pink rounded-full animate-spin" />
          </div>
        ) : activeProfiles.length === 0 ? (
          <p className="text-center text-gray-400 py-8 text-sm">暫時未有可配對嘅人，遲啲再嚟啦！</p>
        ) : (
          <>
            <label className="block text-sm font-bold mb-1.5 mt-4">
              想認識邊位？ <span className="text-brand-pink">*</span>
            </label>
            <SearchableDropdown profiles={activeProfiles} value={selected} onChange={setSelected} />

            <label className="block text-sm font-bold mb-1.5 mt-4">
              你嘅暱稱 <span className="text-brand-pink">*</span>
            </label>
            <input className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm bg-gray-50 focus:outline-none focus:border-brand-pink" placeholder="例：小明" value={name} onChange={(e) => setName(e.target.value)} maxLength={NAME_MAX_LENGTH} />

            <label className="block text-sm font-bold mb-1.5 mt-4">你嘅 IG Handle（選填）</label>
            <input className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm bg-gray-50 focus:outline-none focus:border-brand-pink" placeholder="唔使打 @" value={ig} onChange={(e) => setIg(e.target.value)} maxLength={NAME_MAX_LENGTH} />

            <label className="block text-sm font-bold mb-1.5 mt-4">
              自我介紹 <span className="text-brand-pink">*</span>
            </label>
            <textarea className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm bg-gray-50 focus:outline-none focus:border-brand-pink resize-y leading-relaxed" placeholder={'介紹下自己啦～\n例如：興趣、工作、想搵咩類型嘅人...'} value={intro} onChange={(e) => setIntro(e.target.value)} rows={5} maxLength={INTRO_MAX_LENGTH} />
            <div className="text-right text-xs text-gray-300 mt-1">{intro.length} / {INTRO_MAX_LENGTH}</div>

            {/* Honeypot */}
            <input className="absolute -left-[9999px] opacity-0 h-0" tabIndex={-1} autoComplete="off" value={honey} onChange={(e) => setHoney(e.target.value)} />

            <CooldownBar remaining={cooldown} />

            <button
              onClick={handleSubmit}
              disabled={cooldown > 0 || submitting}
              className={`w-full py-3 rounded-lg bg-gradient-to-r from-brand-pink to-brand-orange text-white font-bold text-base transition-opacity ${
                cooldown > 0 ? 'mt-2' : 'mt-5'
              } ${canSubmit ? 'opacity-100 hover:opacity-90 cursor-pointer' : 'opacity-40 cursor-not-allowed'}`}
            >
              {submitting ? '提交中...' : cooldown > 0 ? '冷卻中...' : '送出 💌'}
            </button>
          </>
        )}
      </div>
      <p className="text-center text-xs text-gray-300 mt-5">你嘅資料只會由管理員轉發俾你揀選嘅對象</p>
    </div>
  );
}
