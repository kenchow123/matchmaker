export default function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow-lg animate-toast whitespace-nowrap">
      {message}
    </div>
  );
}
