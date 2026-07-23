// Animated marquee ticker banner — lime-green accented
// Static copy for V1; replace with DB-driven content in a future phase.

const TICKER_ITEMS = [
  '🔴 Tomatoes up +12% this week',
  '🟢 Rice prices stable — ₦45,000/50kg',
  '📈 Palm oil +8.4% since last month',
  '✅ Verified prices updated every hour',
  '🛒 Always check SurePrice before you buy',
  '📊 Flour prices rising — buy now at current rates',
  '💡 Scan any product QR for an instant price check',
]

export function TickerBanner() {
  const repeated = [...TICKER_ITEMS, ...TICKER_ITEMS] // duplicate for seamless loop

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--lime-base)]/30 bg-[var(--lime-base)]/8 py-2.5">
      <div className="animate-marquee flex whitespace-nowrap">
        {repeated.map((item, i) => (
          <span
            key={i}
            className="mx-6 text-sm font-medium text-foreground"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
