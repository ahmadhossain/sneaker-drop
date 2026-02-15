import { useToast } from '../hooks/useToast';

export default function Toast() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all duration-300 ${
            toast.type === 'success'
              ? 'bg-green-900/90 text-green-100 border border-green-700/50'
              : 'bg-red-900/90 text-red-100 border border-red-700/50'
          }`}
        >
          <span>{toast.type === 'success' ? '+' : '!'}</span>
          <span className="flex-1">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-gray-400 hover:text-white ml-2"
          >
            x
          </button>
        </div>
      ))}
    </div>
  );
}
