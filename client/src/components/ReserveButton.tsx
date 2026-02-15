interface ReserveButtonProps {
  onReserve: () => void;
  loading: boolean;
  disabled: boolean;
}

export default function ReserveButton({
  onReserve,
  loading,
  disabled,
}: ReserveButtonProps) {
  return (
    <button
      onClick={onReserve}
      disabled={disabled || loading}
      className="w-full py-3 px-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed bg-indigo-600 hover:bg-indigo-500 text-white active:scale-[0.98]"
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
          Reserving...
        </span>
      ) : disabled ? (
        'Sold Out'
      ) : (
        'Reserve Now'
      )}
    </button>
  );
}
