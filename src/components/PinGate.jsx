import { useState } from 'react';
import { ADMIN_PIN } from '../utils/constants';

export default function PinGate({ onUnlock, onError }) {
  const [pin, setPin] = useState('');

  const handleSubmit = () => {
    if (pin === ADMIN_PIN) onUnlock();
    else onError('密碼錯誤');
  };

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="bg-white rounded-2xl p-10 text-center border border-gray-200 w-72 shadow-sm">
        <h2 className="text-lg font-extrabold mb-3">🔒 輸入管理密碼</h2>
        <input
          type="password"
          className="w-full px-3 py-3 rounded-lg border border-gray-300 text-base text-center mb-3 bg-gray-50 focus:outline-none focus:border-brand-pink"
          placeholder="密碼"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />
        <button
          onClick={handleSubmit}
          className="w-full px-5 py-2.5 rounded-lg bg-gradient-to-r from-brand-pink to-brand-orange text-white font-bold text-sm"
        >
          進入後台
        </button>
        <p className="text-xs text-gray-400 mt-3">預設密碼：1234</p>
      </div>
    </div>
  );
}
