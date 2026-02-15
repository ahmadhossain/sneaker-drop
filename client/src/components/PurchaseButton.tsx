interface PurchaseButtonProps {
  onPurchase: () => void;
  loading: boolean;
}

export default function PurchaseButton({
  onPurchase,
  loading,
}: PurchaseButtonProps) {
  return (
    <button
      onClick={onPurchase}
      disabled={loading}
      className="w-full py-3 px-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-200 disabled:opacity-60 bg-green-600 hover:bg-green-500 text-white active:scale-[0.98]"
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
          Processing...
        </span>
      ) : (
        'Complete Purchase'
      )}
    </button>
  );
}
