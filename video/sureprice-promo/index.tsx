/* @jsxImportSource @diffusionstudio/jsx */
/* SurePrice V2 — first launch promo (~20s, 9:16)
 *
 * Authentic assets from public/images; copy verified against landing + app UI.
 * Motion driven by anime.js timeline seeked from useTicker.
 */

import { createEffect, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { createTimeline, type Timeline } from "animejs";
import { useTicker } from "@diffusionstudio/jsx";

const W = 1080;
const H = 1920;
const DURATION = 20;

const COLORS = {
  bg: "#020617",
  surface: "#0f172a",
  card: "#1e293b",
  lime: "#13ec5b",
  limeDark: "#0dcf4d",
  text: "#f8fafc",
  muted: "#94a3b8",
  black: "#000000",
} as const;

const ASSETS = {
  handScan: "assets/images/hand-scan.jpeg",
  zeroFriction: "assets/images/zero_webview_friction.jpg",
  priceSync: "assets/images/instant_price_update.jpg",
  hardware: "assets/images/waterproof_qr_tags_naira.jpg",
} as const;

const beats = {
  hook: { start: 0, end: 3 },
  value: { start: 3, end: 7 },
  scan: { start: 7, end: 11 },
  sync: { start: 11, end: 15 },
  hardware: { start: 15, end: 17.5 },
  cta: { start: 17.5, end: DURATION },
} as const;

type MotionState = {
  hook: { logoY: number; logoOpacity: number; tagOpacity: number; glow: number };
  value: { imageY: number; imageOpacity: number; textY: number; textOpacity: number };
  feature: { imageScale: number; imageOpacity: number; labelY: number; labelOpacity: number; statOpacity: number };
  cta: { logoScale: number; logoOpacity: number; buttonY: number; buttonOpacity: number; subOpacity: number };
};

const initial: MotionState = {
  hook: { logoY: 48, logoOpacity: 0, tagOpacity: 0, glow: 0.15 },
  value: { imageY: 80, imageOpacity: 0, textY: 40, textOpacity: 0 },
  feature: { imageScale: 1.08, imageOpacity: 0, labelY: 32, labelOpacity: 0, statOpacity: 0 },
  cta: { logoScale: 0.92, logoOpacity: 0, buttonY: 56, buttonOpacity: 0, subOpacity: 0 },
};

function FeatureSlide(props: {
  src: string;
  start: number;
  end: number;
  label: string;
  stat: string;
  statDetail: string;
  accent?: string;
}) {
  return (
    <image
      name={props.label}
      src={props.src}
      x={0}
      y={0}
      width={W}
      height={H}
      start={props.start}
      end={props.end}
      objectFit="cover"
      opacity={0.92} id="vsvmj6"
    >
      <animation type="fade" duration="12f" id="2qks4s" />
      <animation type="fade" phase="out" duration="12f" id="w89z47" />
    </image>
  );
}

export default function SurePricePromo() {
  const { time } = useTicker();
  const [v, setV] = createStore<MotionState>(structuredClone(initial));
  let tl!: Timeline;

  onMount(() => {
    const hook = { ...initial.hook };
    const value = { ...initial.value };
    const feature = { ...initial.feature };
    const cta = { ...initial.cta };

    tl = createTimeline({ autoplay: false })
      // Hook 0–3s
      .add(hook, { logoOpacity: 1, logoY: 0, ease: "cubicBezier(0,0.6,0.4,1)", duration: 700 }, 0)
      .add(hook, { tagOpacity: 1, ease: "cubicBezier(0,1,0,1)", duration: 600 }, 350)
      .add(hook, { glow: 0.45, ease: "inOutSine", duration: 2200 }, 0)
      .add(hook, { logoOpacity: 0, tagOpacity: 0, ease: "cubicBezier(0.6,0,1,0.4)", duration: 450 }, 2550)

      // Value 3–7s
      .add(value, { imageOpacity: 1, imageY: 0, ease: "cubicBezier(0,0.6,0.4,1)", duration: 650 }, 3000)
      .add(value, { textOpacity: 1, textY: 0, ease: "cubicBezier(0,1,0,1)", duration: 700 }, 3300)
      .add(value, { imageOpacity: 0, textOpacity: 0, ease: "cubicBezier(0.6,0,1,0.4)", duration: 500 }, 6500)

      // Feature beats share motion targets; timeline resets per segment via seek
      .add(feature, { imageOpacity: 1, imageScale: 1, labelOpacity: 1, labelY: 0, statOpacity: 1, ease: "cubicBezier(0,0.6,0.4,1)", duration: 550 }, 7000)
      .add(feature, { imageOpacity: 0, labelOpacity: 0, statOpacity: 0, ease: "cubicBezier(0.6,0,1,0.4)", duration: 450 }, 10600)

      .add(feature, { imageOpacity: 1, imageScale: 1, labelOpacity: 1, labelY: 0, statOpacity: 1, ease: "cubicBezier(0,0.6,0.4,1)", duration: 550 }, 11000)
      .add(feature, { imageOpacity: 0, labelOpacity: 0, statOpacity: 0, ease: "cubicBezier(0.6,0,1,0.4)", duration: 450 }, 14600)

      .add(feature, { imageOpacity: 1, imageScale: 1, labelOpacity: 1, labelY: 0, statOpacity: 1, ease: "cubicBezier(0,0.6,0.4,1)", duration: 550 }, 15000)
      .add(feature, { imageOpacity: 0, labelOpacity: 0, statOpacity: 0, ease: "cubicBezier(0.6,0,1,0.4)", duration: 450 }, 17200)

      // CTA 17.5–20s
      .add(cta, { logoOpacity: 1, logoScale: 1, ease: "cubicBezier(0,1,0,1)", duration: 650 }, 17500)
      .add(cta, { buttonOpacity: 1, buttonY: 0, ease: "cubicBezier(0,0.6,0.4,1)", duration: 600 }, 17850)
      .add(cta, { subOpacity: 1, ease: "outQuad", duration: 500 }, 18200);
  });

  createEffect(() => {
    if (!tl) return;
    tl.seek(time() * 1000);
    setV({
      hook: { ...initial.hook },
      value: { ...initial.value },
      feature: { ...initial.feature },
      cta: { ...initial.cta },
    });
  });

  const t = () => time();
  const inBeat = (start: number, end: number) => t() >= start && t() < end;

  const featureLabel = () => {
    if (inBeat(beats.scan.start, beats.scan.end)) return "Zero app install";
    if (inBeat(beats.sync.start, beats.sync.end)) return "1-tap cloud price sync";
    if (inBeat(beats.hardware.start, beats.hardware.end)) return "Built for Nigerian stores";
    return "";
  };

  const featureStat = () => {
    if (inBeat(beats.scan.start, beats.scan.end)) return "0.4s";
    if (inBeat(beats.sync.start, beats.sync.end)) return "100%";
    if (inBeat(beats.hardware.start, beats.hardware.end)) return "₦";
    return "";
  };

  const featureDetail = () => {
    if (inBeat(beats.scan.start, beats.scan.end)) return "Average scan load · Verified Naira pricing";
    if (inBeat(beats.sync.start, beats.sync.end)) return "Price accuracy across every shelf";
    if (inBeat(beats.hardware.start, beats.hardware.end)) return "Shelf tags · Menus · Festival passes";
    return "";
  };

  const featureImage = () => {
    if (inBeat(beats.scan.start, beats.scan.end)) return ASSETS.zeroFriction;
    if (inBeat(beats.sync.start, beats.sync.end)) return ASSETS.priceSync;
    if (inBeat(beats.hardware.start, beats.hardware.end)) return ASSETS.hardware;
    return ASSETS.zeroFriction;
  };

  return (
    <stage camera={[0.25, 0, 0, 0.25, W / 2, H / 2]} id="571gbo">
      <scene
        id="sureprice-promo"
        name="SurePrice Promo"
        width={W}
        height={H}
        fill={COLORS.bg}
        active
      >
        {/* Ambient lime glow — always subtle drift */}
        <rect
          name="Ambient glow"
          x={W * 0.1}
          y={H * 0.08}
          width={W * 0.8}
          height={H * 0.35}
          cornerRadius={999}
          fill={COLORS.lime}
          opacity={v.hook.glow * 0.12}
          start={0}
          end={DURATION} id="3jx9k4"
        />

        {/* ── B-roll sequence ── */}
        <sequence name="Feature stills" id="0kplla">
          <FeatureSlide
            src={ASSETS.zeroFriction}
            start={beats.scan.start}
            end={beats.scan.end}
            label="Zero friction scan"
            stat="0.4s"
            statDetail="Average scan load"
          />
          <FeatureSlide
            src={ASSETS.priceSync}
            start={beats.sync.start}
            end={beats.sync.end}
            label="Cloud price sync"
            stat="100%"
            statDetail="Price accuracy"
          />
          <FeatureSlide
            src={ASSETS.hardware}
            start={beats.hardware.start}
            end={beats.hardware.end}
            label="Waterproof QR hardware"
            stat="₦"
            statDetail="Naira-native tags"
          />
        </sequence>

        {/* Value beat illustration */}
        <image
          name="Hand scan illustration"
          src={ASSETS.handScan}
          x={72}
          y={520 + v.value.imageY}
          width={W - 144}
          height={720}
          cornerRadius={32}
          start={beats.value.start}
          end={beats.value.end}
          objectFit="cover"
          opacity={v.value.imageOpacity} id="v9yvho"
        />

        {/* ── Hook overlay ── */}
        <html x={0} y={0} width={W} height={H} start={beats.hook.start} end={beats.hook.end} id="ox79rk">
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              "flex-direction": "column",
              "align-items": "center",
              "justify-content": "center",
              "font-family": "Inter, sans-serif",
              color: COLORS.text,
              "text-align": "center",
              padding: "0 64px",
              transform: `translateY(${v.hook.logoY}px)`,
              opacity: v.hook.logoOpacity,
            }}
          >
            <div
              style={{
                width: "88px",
                height: "88px",
                "border-radius": "24px",
                background: COLORS.lime,
                display: "flex",
                "align-items": "center",
                "justify-content": "center",
                "margin-bottom": "32px",
                "box-shadow": `0 12px 40px ${COLORS.lime}40`,
              }}
            >
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.5">
                <path d="M3 7V5a2 2 0 0 1 2-2h2" />
                <path d="M17 3h2a2 2 0 0 1 2 2v2" />
                <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
                <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
                <line x1="7" y1="12" x2="17" y2="12" />
              </svg>
            </div>
            <div style={{ "font-size": "88px", "font-weight": "900", "letter-spacing": "-0.03em", "line-height": "1.05" }}>
              SurePrice
            </div>
            <div
              style={{
                "margin-top": "20px",
                "font-size": "40px",
                "font-weight": "800",
                color: COLORS.lime,
                opacity: v.hook.tagOpacity,
                "letter-spacing": "-0.01em",
              }}
            >
              Scan it. Know it.
            </div>
          </div>
        </html>

        {/* ── Value proposition copy ── */}
        <html x={0} y={0} width={W} height={H} start={beats.value.start} end={beats.value.end} id="3qb5li">
          <div
            style={{
              position: "absolute",
              left: "56px",
              right: "56px",
              bottom: "120px",
              transform: `translateY(${v.value.textY}px)`,
              opacity: v.value.textOpacity,
              "font-family": "Inter, sans-serif",
            }}
          >
            <div
              style={{
                "font-size": "52px",
                "font-weight": "900",
                "line-height": "1.12",
                "letter-spacing": "-0.02em",
                color: COLORS.text,
              }}
            >
              Know the exact price before you reach checkout
            </div>
            <div
              style={{
                "margin-top": "20px",
                "font-size": "22px",
                "font-weight": "600",
                color: COLORS.muted,
                "line-height": "1.5",
              }}
            >
              Digital price tags & menus for supermarkets, cafés, and pop-ups across Nigeria.
            </div>
          </div>
        </html>

        {/* ── Feature label overlay (scan / sync / hardware) ── */}
        <html
          x={0}
          y={0}
          width={W}
          height={H}
          start={beats.scan.start}
          end={beats.hardware.end} id="0hk0vb"
        >
          <div
            style={{
              position: "absolute",
              left: "48px",
              right: "48px",
              bottom: "96px",
              "font-family": "Inter, sans-serif",
              transform: `translateY(${v.feature.labelY}px)`,
              opacity: inBeat(beats.scan.start, beats.hardware.end) ? v.feature.labelOpacity : 0,
            }}
          >
            <div
              style={{
                display: "inline-flex",
                "align-items": "center",
                gap: "10px",
                padding: "10px 18px",
                "border-radius": "999px",
                background: `${COLORS.lime}22`,
                border: `1px solid ${COLORS.lime}55`,
                color: COLORS.lime,
                "font-size": "14px",
                "font-weight": "800",
                "letter-spacing": "0.06em",
                "text-transform": "uppercase",
                "margin-bottom": "16px",
              }}
            >
              Verified Product
            </div>
            <div
              style={{
                "font-size": "48px",
                "font-weight": "900",
                "letter-spacing": "-0.02em",
                color: COLORS.text,
                "line-height": "1.1",
              }}
            >
              {featureLabel()}
            </div>
            <div
              style={{
                display: "flex",
                "align-items": "center",
                gap: "16px",
                "margin-top": "24px",
                opacity: v.feature.statOpacity,
              }}
            >
              <div
                style={{
                  "font-size": "56px",
                  "font-weight": "900",
                  color: COLORS.lime,
                  "line-height": "1",
                }}
              >
                {featureStat()}
              </div>
              <div
                style={{
                  "font-size": "20px",
                  "font-weight": "600",
                  color: COLORS.muted,
                  "max-width": "360px",
                  "line-height": "1.4",
                }}
              >
                {featureDetail()}
              </div>
            </div>
          </div>
        </html>

        {/* ── CTA end card ── */}
        <html x={0} y={0} width={W} height={H} start={beats.cta.start} end={DURATION} id="kxxgr4">
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              "flex-direction": "column",
              "align-items": "center",
              "justify-content": "center",
              "font-family": "Inter, sans-serif",
              padding: "0 56px",
              background: `radial-gradient(ellipse 80% 50% at 50% 30%, ${COLORS.lime}18, transparent 70%)`,
            }}
          >
            <div
              style={{
                opacity: v.cta.logoOpacity,
                transform: `scale(${v.cta.logoScale})`,
                "text-align": "center",
              }}
            >
              <div
                style={{
                  width: "96px",
                  height: "96px",
                  "border-radius": "28px",
                  background: COLORS.lime,
                  display: "flex",
                  "align-items": "center",
                  "justify-content": "center",
                  margin: "0 auto 28px",
                  "box-shadow": `0 16px 48px ${COLORS.lime}45`,
                }}
              >
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.5">
                  <path d="M3 7V5a2 2 0 0 1 2-2h2" />
                  <path d="M17 3h2a2 2 0 0 1 2 2v2" />
                  <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
                  <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
                  <line x1="7" y1="12" x2="17" y2="12" />
                </svg>
              </div>
              <div style={{ "font-size": "64px", "font-weight": "900", color: COLORS.text, "letter-spacing": "-0.03em" }}>
                SurePrice
              </div>
              <div style={{ "font-size": "28px", "font-weight": "700", color: COLORS.lime, "margin-top": "8px" }}>
                Scan it. Know it.
              </div>
            </div>

            <div
              style={{
                "margin-top": "48px",
                transform: `translateY(${v.cta.buttonY}px)`,
                opacity: v.cta.buttonOpacity,
                width: "100%",
                "max-width": "520px",
              }}
            >
              <div
                style={{
                  background: COLORS.lime,
                  color: COLORS.black,
                  "font-size": "28px",
                  "font-weight": "900",
                  padding: "28px 40px",
                  "border-radius": "20px",
                  "text-align": "center",
                  "box-shadow": `0 20px 60px ${COLORS.lime}40`,
                }}
              >
                Try Scanning Now
              </div>
            </div>

            <div
              style={{
                "margin-top": "28px",
                opacity: v.cta.subOpacity,
                "font-size": "18px",
                "font-weight": "600",
                color: COLORS.muted,
              }}
            >
              Zero app install · Lagos, Nigeria
            </div>
          </div>
        </html>
      </scene>
    </stage>
  );
}
