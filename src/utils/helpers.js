export function getProfileEmoji(label) {
  if (/小姐|女|Miss/.test(label)) return '👩';
  if (/先生|男|Mr/.test(label)) return '👨';
  return '🧑';
}

export function formatDate(timestamp) {
  const d = typeof timestamp === 'string' ? new Date(timestamp) : new Date(timestamp);
  return d.toLocaleDateString('zh-HK', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatCountdown(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function buildForwardMessage(submission) {
  const igLine = submission.ig ? `\nIG：@${submission.ig}` : '';
  return `有人想認識你 💌\n\n暱稱：${submission.name}${igLine}\n\n自我介紹：\n${submission.intro}`;
}

export function buildBulkForwardMessage(submissions) {
  const parts = submissions.map(
    (s, i) =>
      `── 第 ${i + 1} 位 ──\n暱稱：${s.name}${s.ig ? `\nIG：@${s.ig}` : ''}\n\n${s.intro}`,
  );
  return `有 ${submissions.length} 位人想認識你 💌\n\n${parts.join('\n\n')}`;
}

export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    return true;
  }
}
