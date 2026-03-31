import { COOLDOWN_SECS } from '../utils/constants';
import { formatCountdown } from '../utils/helpers';

export default function CooldownBar({ remaining }) {
  if (remaining <= 0) return null;
  const percent = (remaining / COOLDOWN_SECS) * 100;

  return (
    <div className="mt-5">
      <div className="bg-gray-200 rounded-full h-1.5 overflow-hidden mb-2">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-pink to-brand-orange transition-[width] duration-1000 linear"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="text-center text-sm text-brand-orange font-semibold">
        ⏳ 請等 {formatCountdown(remaining)} 後再提交
      </p>
    </div>
  );
}
