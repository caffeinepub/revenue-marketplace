export default function IconDisplay({ className = '' }: { className?: string }) {
  return (
    <img
      src="/assets/generated/transaction-icon.dim_128x128.png"
      alt="Transaction"
      className={className}
    />
  );
}
