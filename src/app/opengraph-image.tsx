import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'mimuus — Garrafas Térmicas Personalizadas';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative glows */}
        <div
          style={{
            position: 'absolute',
            top: -120,
            left: -120,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'rgba(255, 69, 134, 0.25)',
            filter: 'blur(80px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -120,
            right: -120,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'rgba(0, 229, 204, 0.2)',
            filter: 'blur(80px)',
          }}
        />

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
          {/* Logo */}
          <div style={{ display: 'flex', fontSize: 72, fontWeight: 900, letterSpacing: -2, marginBottom: 24 }}>
            <span style={{ color: 'white' }}>mi</span>
            <span style={{ color: '#ff4586' }}>mu</span>
            <span style={{ color: 'white' }}>us</span>
            <span style={{ color: '#00e5cc' }}>.</span>
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: 28,
              color: 'rgba(255,255,255,0.8)',
              textAlign: 'center',
              maxWidth: 700,
              lineHeight: 1.4,
              marginBottom: 40,
            }}
          >
            Garrafas Térmicas de Luxo Personalizadas
          </div>

          {/* Pills */}
          <div style={{ display: 'flex', gap: 16 }}>
            {['✨ Design Único', '🌡️ Mantém Temperatura', '🇧🇷 Frete Expresso'].map((text) => (
              <div
                key={text}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(16px)',
                  borderRadius: 100,
                  padding: '10px 24px',
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: 18,
                  fontWeight: 600,
                }}
              >
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom URL */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            color: 'rgba(255,255,255,0.35)',
            fontSize: 18,
            fontWeight: 500,
            letterSpacing: 2,
          }}
        >
          mimuus.com
        </div>
      </div>
    ),
    { ...size }
  );
}
