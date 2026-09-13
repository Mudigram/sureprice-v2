import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Qarty · 1-Tap In-Store QR Tags & Menus'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#090d16',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: '80px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top bar with badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '30px',
              background: '#0DCF4D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              fontWeight: 900,
              color: '#000000',
            }}
          >
            Q
          </div>
          <span
            style={{
              fontSize: '38px',
              fontWeight: 900,
              color: '#ffffff',
              letterSpacing: '-0.03em',
            }}
          >
            Qarty
          </span>
          <span
            style={{
              marginLeft: '16px',
              padding: '8px 18px',
              borderRadius: '999px',
              background: 'rgba(13, 207, 77, 0.15)',
              border: '1px solid rgba(13, 207, 77, 0.4)',
              color: '#0DCF4D',
              fontSize: '18px',
              fontWeight: 800,
            }}
          >
            Ibadan &amp; Across Nigeria
          </span>
        </div>

        {/* Main Headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h1
            style={{
              fontSize: '64px',
              fontWeight: 900,
              color: '#ffffff',
              lineHeight: 1.1,
              letterSpacing: '-0.04em',
              margin: 0,
            }}
          >
            1-Tap In-Store QR Tags &amp; Digital Menus.
          </h1>
          <p
            style={{
              fontSize: '28px',
              color: '#94a3b8',
              lineHeight: 1.4,
              margin: 0,
              maxWidth: '900px',
            }}
          >
            Point your camera for instant verified Naira prices. Zero app download required.
          </p>
        </div>

        {/* Bottom Feature Badges */}
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#cbd5e1',
              fontSize: '20px',
              fontWeight: 700,
            }}
          >
            <span>⚡ Instant Mobile Scan</span>
          </div>
          <div style={{ color: '#475569', fontSize: '24px' }}>•</div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#cbd5e1',
              fontSize: '20px',
              fontWeight: 700,
            }}
          >
            <span>🏪 Physical Retail &amp; Dining</span>
          </div>
          <div style={{ color: '#475569', fontSize: '24px' }}>•</div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#0DCF4D',
              fontSize: '20px',
              fontWeight: 700,
            }}
          >
            <span>✓ Verified Merchant Catalog</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
