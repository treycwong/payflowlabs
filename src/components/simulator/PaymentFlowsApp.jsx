"use client";
import { useState, useEffect, useRef } from "react";
import "./simulator.css";

import { SCENARIOS, CATEGORIES, FLOW_STEPS } from "./data";

// ─── SCREEN COMPONENTS ────────────────────────────────────────────────────────

function ProgressBar({ steps, current }) {
  return (
    <div className="progress-steps">
      {steps.map((s, i) => (
        <span
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            flex: i < steps.length - 1 ? "1" : "0",
          }}
        >
          <span
            className={`step-dot ${i < current ? "done" : i === current ? "active" : ""}`}
            title={s}
          />
          {i < steps.length - 1 && (
            <span className={`step-line ${i < current ? "done" : ""}`} />
          )}
        </span>
      ))}
    </div>
  );
}

function ScreenHeader({ title, onBack, step }) {
  return (
    <div className="screen-header">
      {onBack && (
        <div className="screen-back" onClick={onBack}>
          ←
        </div>
      )}
      <span className="screen-title" style={{ flex: 1 }}>
        {title}
      </span>
      {step && <span className="pill pill-muted">{step}</span>}
    </div>
  );
}

// GrabPay Wallet Screens
function GrabPayFlow({ step, onNext, onBack }) {
  const [pin, setPin] = useState("");
  const screens = [
    // Step 0: Cart
    <div className="screen">
      <ScreenHeader title="GrabPay Checkout" onBack={onBack} step="1/4" />
      <div className="screen-body">
        <div className="order-card">
          <div className="order-header">
            <div
              className="order-merchant-icon"
              style={{ background: "#E6F9EE" }}
            >
              🍜
            </div>
            <div>
              <div className="order-merchant-name">Grab Food</div>
              <div className="order-merchant-type">Nasi Lemak Special</div>
            </div>
          </div>
          <div className="order-rows">
            <div className="order-row">
              <span className="key">Nasi Lemak Special</span>
              <span className="val">RM 12.90</span>
            </div>
            <div className="order-row">
              <span className="key">Teh Tarik x2</span>
              <span className="val">RM 6.00</span>
            </div>
            <div className="order-row">
              <span className="key">Delivery fee</span>
              <span className="val">RM 2.50</span>
            </div>
            <div className="order-row">
              <span className="key">GrabRewards</span>
              <span className="val green">−RM 3.00</span>
            </div>
            <div className="order-divider" />
            <div className="order-row">
              <span className="key order-total">Total</span>
              <span className="val order-total">RM 18.40</span>
            </div>
          </div>
        </div>
        <div className="points-display">
          <div className="points-bg-circle" />
          <div className="points-bg-circle points-bg-circle2" />
          <div style={{ position: "relative" }}>
            <div className="points-label">GrabPay Balance</div>
            <div className="points-value">RM 84.50</div>
            <div className="points-sub">● Sufficient for this order</div>
          </div>
        </div>
      </div>
      <div className="screen-footer">
        <button className="btn btn-primary btn-full btn-lg" onClick={onNext}>
          <span>Continue to Payment</span> <span>→</span>
        </button>
      </div>
    </div>,

    // Step 1: Select method
    <div className="screen">
      <ScreenHeader title="Payment Method" onBack={onBack} step="2/4" />
      <div className="screen-body">
        {[
          {
            icon: "🟢",
            name: "GrabPay Wallet",
            sub: "Balance: RM 84.50",
            sel: true,
            color: "#E6F9EE",
          },
          {
            icon: "💳",
            name: "Visa •••• 4242",
            sub: "Default card",
            sel: false,
            color: "#EEF2FF",
          },
          {
            icon: "🏦",
            name: "FPX Bank Transfer",
            sub: "Maybank, CIMB +",
            sel: false,
            color: "#F0F9FF",
          },
        ].map((m, i) => (
          <div
            key={i}
            className={`method-card ${m.sel ? "selected" : ""}`}
            onClick={onNext}
          >
            <div className="method-icon" style={{ background: m.color }}>
              {m.icon}
            </div>
            <div className="method-info">
              <div className="method-name">{m.name}</div>
              <div className="method-sub">{m.sub}</div>
            </div>
            <div className="method-check">{m.sel ? "✓" : ""}</div>
          </div>
        ))}
        <div style={{ padding: "4px 0 0" }}>
          <div className="label" style={{ marginBottom: 8 }}>
            Security
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["256-bit SSL", "PCI DSS", "Fraud Detection"].map((t) => (
              <span key={t} className="pill pill-emerald">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>,

    // Step 2: Confirm
    <div className="screen">
      <ScreenHeader title="Confirm Payment" onBack={onBack} step="3/4" />
      <div className="screen-body">
        <div style={{ textAlign: "center", padding: "20px 0 12px" }}>
          <div style={{ fontSize: 13, color: "var(--muted)" }}>
            Paying to Grab Food
          </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 42,
              fontWeight: 800,
              letterSpacing: -1.5,
              color: "var(--ink)",
              margin: "8px 0",
            }}
          >
            RM 18.40
          </div>
          <span className="pill pill-grab">GrabPay Wallet</span>
        </div>
        <div className="card card-sm">
          <div
            style={{
              fontSize: 12,
              color: "var(--muted)",
              marginBottom: 8,
              fontWeight: 600,
            }}
          >
            ENTER 6-DIGIT PIN
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                style={{
                  width: 38,
                  height: 44,
                  border: "2px solid",
                  borderColor:
                    pin.length > i ? "var(--accent)" : "var(--border)",
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  background:
                    pin.length > i ? "var(--accent-light)" : "var(--surface)",
                }}
              >
                {pin.length > i ? "●" : ""}
              </div>
            ))}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 8,
              marginTop: 16,
            }}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0, "⌫"].map((k, i) => (
              <button
                key={i}
                className="btn btn-secondary"
                style={{
                  padding: "12px",
                  fontFamily: "var(--font-mono)",
                  fontSize: 18,
                  fontWeight: 700,
                }}
                onClick={() => {
                  if (k === "⌫") setPin((p) => p.slice(0, -1));
                  else if (k !== "" && pin.length < 6) {
                    const np = pin + k;
                    setPin(np);
                    if (np.length === 6)
                      setTimeout(() => {
                        setPin("");
                        onNext();
                      }, 400);
                  }
                }}
              >
                {k}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>,

    // Step 3: Success
    <div className="screen">
      <ProgressBar steps={FLOW_STEPS["grabpay-wallet"]} current={4} />
      <div className="status-screen">
        <div className="status-icon-wrap status-icon-success">✅</div>
        <div className="status-title">Payment Successful!</div>
        <div className="status-amount">RM 18.40</div>
        <div className="status-sub">
          Your Grab Food order has been placed. Estimated delivery: 25–35 min
        </div>
        <div className="status-ref">TXN #GRB202502181234</div>
        <div
          style={{
            background: "var(--grab-light)",
            border: "1px solid var(--grab)",
            borderRadius: "var(--r-lg)",
            padding: "12px 16px",
            width: "100%",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: "var(--grab)",
              fontWeight: 700,
              letterSpacing: 1,
            }}
          >
            GRABBED!
          </div>
          <div style={{ fontSize: 13, color: "var(--ink)", marginTop: 2 }}>
            +12 GrabPoints earned 🌟
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, width: "100%" }}>
          <button
            className="btn btn-secondary"
            style={{ flex: 1 }}
            onClick={onBack}
          >
            Track Order
          </button>
          <button
            className="btn btn-primary"
            style={{ flex: 1 }}
            onClick={onBack}
          >
            Done
          </button>
        </div>
      </div>
    </div>,
  ];
  return screens[Math.min(step, screens.length - 1)];
}

// Apple Pay Biometric
function ApplePayFlow({ step, onNext, onBack }) {
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);

  const startScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanned(true);
      setTimeout(onNext, 600);
    }, 1800);
  };

  const screens = [
    <div className="screen" style={{ background: "#FAFAFA" }}>
      <ScreenHeader title="Checkout" onBack={onBack} step="1/4" />
      <div className="screen-body">
        <div className="order-card">
          <div className="order-header">
            <div
              className="order-merchant-icon"
              style={{ background: "#FFF0F2" }}
            >
              🏡
            </div>
            <div>
              <div
                className="order-merchant-name"
                style={{ color: "var(--airbnb)" }}
              >
                Airbnb
              </div>
              <div className="order-merchant-type">
                Kuala Lumpur Studio · 3 nights
              </div>
            </div>
          </div>
          <div className="order-rows">
            <div className="order-row">
              <span className="key">RM 220 × 3 nights</span>
              <span className="val">RM 660</span>
            </div>
            <div className="order-row">
              <span className="key">Cleaning fee</span>
              <span className="val">RM 65</span>
            </div>
            <div className="order-row">
              <span className="key">Service fee</span>
              <span className="val">RM 48</span>
            </div>
            <div className="order-divider" />
            <div className="order-row">
              <span className="key order-total">Total (MYR)</span>
              <span className="val order-total">RM 773</span>
            </div>
          </div>
        </div>
        <div
          style={{
            background: "var(--apple)",
            borderRadius: "var(--r-xl)",
            padding: 20,
            color: "#fff",
          }}
        >
          <div
            style={{
              fontSize: 11,
              opacity: 0.6,
              letterSpacing: 1.5,
              fontWeight: 600,
            }}
          >
            PAY WITH
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 800,
              fontFamily: "var(--font-display)",
              letterSpacing: -1,
              marginTop: 4,
            }}
          >
            🍎 Apple Pay
          </div>
          <div style={{ fontSize: 12, opacity: 0.55, marginTop: 4 }}>
            Visa •••• 4891 · Touch or Face ID
          </div>
        </div>
      </div>
      <div className="screen-footer">
        <button
          className="btn btn-full btn-lg"
          style={{ background: "#000", color: "#fff" }}
          onClick={onNext}
        >
          🍎 Pay RM 773
        </button>
        <button className="btn btn-ghost btn-full" onClick={onBack}>
          Cancel
        </button>
      </div>
    </div>,

    <div className="screen" style={{ background: "#1C1C1E" }}>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 32,
          gap: 24,
        }}
      >
        <div
          style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: 13,
            letterSpacing: 1.5,
            fontWeight: 600,
          }}
        >
          FACE ID
        </div>
        <div style={{ position: "relative", width: 120, height: 120 }}>
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              background: scanned ? "#22C55E" : "#2C2C2E",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 56,
              transition: "background 0.4s",
            }}
          >
            {scanned ? "✅" : "😐"}
          </div>
          {scanning && !scanned && (
            <div
              style={{
                position: "absolute",
                inset: -6,
                borderRadius: "50%",
                border: "3px solid transparent",
                borderTopColor: "#fff",
                borderRightColor: "#fff",
                animation: "spin 0.8s linear infinite",
              }}
            />
          )}
        </div>
        <div style={{ color: "#fff", fontSize: 18, fontWeight: 700 }}>
          {!scanning
            ? "Look at your iPhone"
            : scanned
              ? "Authenticated!"
              : "Scanning..."}
        </div>
        <div
          style={{
            color: "rgba(255,255,255,0.4)",
            fontSize: 13,
            textAlign: "center",
          }}
        >
          {!scanning
            ? "Authorise payment of RM 773"
            : scanned
              ? "Payment authorised"
              : "Hold still..."}
        </div>
        {!scanning && (
          <button
            className="btn"
            style={{ background: "#fff", color: "#000", fontWeight: 700 }}
            onClick={startScan}
          >
            Authenticate
          </button>
        )}
      </div>
    </div>,

    <div className="screen">
      <div className="status-screen">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "var(--amber-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
            }}
          >
            <div
              className="spinner spinner-accent"
              style={{ width: 32, height: 32 }}
            />
          </div>
          <div className="status-title" style={{ fontSize: 18 }}>
            Processing Payment
          </div>
          <div className="status-amount">RM 773</div>
          <div className="status-sub">
            Communicating with Airbnb & your bank. Do not close this screen.
          </div>
          <div className="status-ref" style={{ marginTop: 8 }}>
            Authorised via Face ID
          </div>
        </div>
        <div className="timeline" style={{ width: "100%", marginTop: 8 }}>
          {[
            {
              label: "Face ID Verified",
              sub: "Biometric auth complete",
              done: true,
              icon: "🔐",
            },
            {
              label: "Bank Authorisation",
              sub: "Contacting Visa network...",
              active: true,
              icon: "🏦",
            },
            {
              label: "Merchant Confirmation",
              sub: "Notifying Airbnb",
              done: false,
              icon: "🏡",
            },
          ].map((t, i, a) => (
            <div key={i} className="tl-item">
              <div className="tl-left">
                <div
                  className="tl-dot"
                  style={{
                    background: t.done
                      ? "var(--emerald-light)"
                      : t.active
                        ? "var(--amber-light)"
                        : "var(--border)",
                  }}
                >
                  {t.done ? (
                    "✓"
                  ) : t.active ? (
                    <div
                      className="spinner spinner-accent"
                      style={{ width: 16, height: 16 }}
                    />
                  ) : (
                    t.icon
                  )}
                </div>
                {i < a.length - 1 && (
                  <div
                    className="tl-line"
                    style={{
                      background: t.done ? "var(--emerald)" : "var(--border)",
                    }}
                  />
                )}
              </div>
              <div className="tl-content">
                <div className="tl-title">{t.label}</div>
                <div className="tl-sub">{t.sub}</div>
              </div>
            </div>
          ))}
        </div>
        <button
          className="btn btn-primary btn-full"
          onClick={onNext}
          style={{ marginTop: 8 }}
        >
          Fast-forward →
        </button>
      </div>
    </div>,

    <div className="screen">
      <div className="status-screen">
        <div className="status-icon-wrap status-icon-success">✅</div>
        <div className="status-title">Booking Confirmed!</div>
        <div className="status-amount">RM 773</div>
        <div className="status-sub">
          Paid via Apple Pay · Visa •••• 4891
          <br />
          Airbnb KL Studio · 20–23 Feb 2025
        </div>
        <div className="status-ref">BOOK #AIR-9821-KL</div>
        <div
          style={{
            background: "var(--airbnb-light)",
            border: "1px solid var(--airbnb)",
            borderRadius: "var(--r-lg)",
            padding: "14px 16px",
            width: "100%",
            textAlign: "left",
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: "var(--airbnb)",
              fontWeight: 700,
              marginBottom: 6,
            }}
          >
            🏡 YOUR STAY
          </div>
          <div style={{ fontSize: 12, color: "var(--ink)", lineHeight: 1.7 }}>
            Check-in: 20 Feb · 3:00 PM
            <br />
            Check-out: 23 Feb · 12:00 PM
            <br />
            Free cancellation until 18 Feb
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, width: "100%" }}>
          <button
            className="btn btn-secondary"
            style={{ flex: 1 }}
            onClick={onBack}
          >
            View Booking
          </button>
          <button
            className="btn btn-primary"
            style={{ flex: 1 }}
            onClick={onBack}
          >
            Done
          </button>
        </div>
      </div>
    </div>,
  ];
  return screens[Math.min(step, screens.length - 1)];
}

// Visa Card + 3DS
function VisaCardFlow({ step, onNext, onBack }) {
  const [otp, setOtp] = useState("");
  const [card, setCard] = useState({ num: "", exp: "", cvv: "", name: "" });

  const screens = [
    <div className="screen">
      <ScreenHeader title="Card Payment" onBack={onBack} step="1/4" />
      <div className="screen-body">
        <div
          style={{
            background: "linear-gradient(135deg, #1A1F71 0%, #2D3A8C 100%)",
            borderRadius: "var(--r-xl)",
            padding: "20px 24px",
            color: "#fff",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: 200,
              height: 200,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.04)",
              top: -60,
              right: -60,
            }}
          />
          <div
            style={{
              fontSize: 11,
              opacity: 0.6,
              letterSpacing: 2,
              fontWeight: 600,
            }}
          >
            VISA CREDIT
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 18,
              letterSpacing: 3,
              margin: "20px 0 20px",
              opacity: 0.9,
            }}
          >
            {card.num || "•••• •••• •••• ••••"}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <div>
              <div style={{ fontSize: 9, opacity: 0.5, letterSpacing: 1 }}>
                CARD HOLDER
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, marginTop: 2 }}>
                {card.name || "YOUR NAME"}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 9, opacity: 0.5, letterSpacing: 1 }}>
                EXPIRES
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 13,
                  marginTop: 2,
                }}
              >
                {card.exp || "MM/YY"}
              </div>
            </div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 800,
                fontStyle: "italic",
                opacity: 0.9,
              }}
            >
              VISA
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="input-group">
            <label className="input-label">Card Number</label>
            <input
              className="input input-card"
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              value={card.num}
              onChange={(e) =>
                setCard((c) => ({
                  ...c,
                  num: e.target.value
                    .replace(/[^0-9]/g, "")
                    .replace(/(.{4})/g, "$1 ")
                    .trim()
                    .slice(0, 19),
                }))
              }
            />
          </div>
          <div className="input-group">
            <label className="input-label">Name on Card</label>
            <input
              className="input"
              placeholder="John Smith"
              value={card.name}
              onChange={(e) => setCard((c) => ({ ...c, name: e.target.value }))}
            />
          </div>
          <div className="input-row">
            <div className="input-group">
              <label className="input-label">Expiry</label>
              <input
                className="input input-card"
                placeholder="MM / YY"
                maxLength={5}
                value={card.exp}
                onChange={(e) =>
                  setCard((c) => ({ ...c, exp: e.target.value }))
                }
              />
            </div>
            <div className="input-group">
              <label className="input-label">CVV</label>
              <input
                className="input input-card"
                placeholder="•••"
                maxLength={3}
                type="password"
                value={card.cvv}
                onChange={(e) =>
                  setCard((c) => ({ ...c, cvv: e.target.value }))
                }
              />
            </div>
          </div>
        </div>
      </div>
      <div className="screen-footer">
        <button className="btn btn-primary btn-full btn-lg" onClick={onNext}>
          🔒 Pay RM 245.00
        </button>
        <div
          style={{ textAlign: "center", fontSize: 11, color: "var(--muted)" }}
        >
          Secured by Verified by Visa
        </div>
      </div>
    </div>,

    <div className="screen">
      <ScreenHeader title="Verify Identity" onBack={onBack} step="2/4" />
      <div className="screen-body">
        <div
          style={{
            background: "#1A1F71",
            borderRadius: "var(--r-xl)",
            padding: "20px 24px",
            color: "#fff",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 28, fontStyle: "italic", fontWeight: 800 }}>
            VISA
          </div>
          <div
            style={{
              fontSize: 11,
              opacity: 0.6,
              marginTop: 4,
              letterSpacing: 1.5,
            }}
          >
            VERIFIED BY VISA · 3D SECURE
          </div>
        </div>
        <div style={{ textAlign: "center", padding: "16px 0 8px" }}>
          <div style={{ fontSize: 13, color: "var(--muted)" }}>
            One-Time Password sent to
          </div>
          <div style={{ fontWeight: 700, color: "var(--ink)", marginTop: 4 }}>
            +60 12-•••-•987
          </div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
            Valid for 5 minutes
          </div>
        </div>
        <div className="input-group">
          <label className="input-label" style={{ textAlign: "center" }}>
            Enter 6-digit OTP
          </label>
          <input
            className="input input-card"
            style={{
              textAlign: "center",
              fontSize: 24,
              letterSpacing: 12,
              fontFamily: "var(--font-mono)",
            }}
            placeholder="------"
            maxLength={6}
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value.replace(/[^0-9]/g, "").slice(0, 6));
            }}
          />
        </div>
        <div style={{ textAlign: "center" }}>
          <button className="btn btn-ghost btn-sm">Resend OTP (0:58)</button>
        </div>
      </div>
      <div className="screen-footer">
        <button
          className="btn btn-primary btn-full btn-lg"
          onClick={onNext}
          disabled={otp.length < 6 && false}
        >
          Verify & Pay
        </button>
      </div>
    </div>,

    <div className="screen">
      <div className="status-screen">
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "var(--amber-light)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="spinner spinner-accent"
            style={{ width: 36, height: 36 }}
          />
        </div>
        <div className="status-title" style={{ fontSize: 18 }}>
          Processing...
        </div>
        <div className="status-sub">
          Contacting your bank via the Visa network. This usually takes 3–5
          seconds.
        </div>
        <div
          style={{
            width: "100%",
            height: 4,
            background: "var(--border)",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              background: "var(--accent)",
              animation: "progressBar 2.5s ease-in-out forwards",
              borderRadius: 2,
            }}
          />
        </div>
        <style>{`@keyframes progressBar { from { width: 0 } to { width: 100% } }`}</style>
        <button
          className="btn btn-secondary btn-sm"
          onClick={onNext}
          style={{ marginTop: 12 }}
        >
          Skip →
        </button>
      </div>
    </div>,

    <div className="screen">
      <div className="status-screen">
        <div className="status-icon-wrap status-icon-success">✅</div>
        <div className="status-title">Payment Successful!</div>
        <div className="status-amount">RM 245.00</div>
        <div className="status-sub">
          Visa •••• 4242 was charged
          <br />
          Receipt sent to john@email.com
        </div>
        <div className="status-ref">REF #VISA20250218-8821</div>
        <div
          style={{
            background: "var(--emerald-light)",
            border: "1px solid var(--emerald)",
            borderRadius: "var(--r-lg)",
            padding: "12px 16px",
            width: "100%",
            textAlign: "center",
          }}
        >
          <div
            style={{ fontSize: 12, color: "var(--emerald)", fontWeight: 700 }}
          >
            📧 Invoice sent to john@email.com
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, width: "100%" }}>
          <button
            className="btn btn-secondary"
            style={{ flex: 1 }}
            onClick={onBack}
          >
            View Receipt
          </button>
          <button
            className="btn btn-primary"
            style={{ flex: 1 }}
            onClick={onBack}
          >
            Done
          </button>
        </div>
      </div>
    </div>,
  ];
  return screens[Math.min(step, screens.length - 1)];
}

// GrabPoints / Loyalty
function GrabPointsFlow({ step, onNext, onBack }) {
  const [usePoints, setUsePoints] = useState(true);
  const screens = [
    <div className="screen">
      <ScreenHeader title="GrabRewards" onBack={onBack} step="1/4" />
      <div className="screen-body">
        <div className="points-display">
          <div className="points-bg-circle" />
          <div className="points-bg-circle points-bg-circle2" />
          <div style={{ position: "relative" }}>
            <div className="points-label">Your Points Balance</div>
            <div className="points-value">2,850</div>
            <div className="points-sub">
              = RM 14.25 value · Expires 31 Mar 2025
            </div>
          </div>
        </div>
        <div className="order-card">
          <div className="order-rows">
            <div className="order-row">
              <span className="key">Grab Ride (GrabCar)</span>
              <span className="val">RM 28.50</span>
            </div>
            <div className="order-row">
              <span className="key">Surge pricing (1.2x)</span>
              <span className="val">RM 5.70</span>
            </div>
            <div className="order-row order-total">
              <span className="key">Subtotal</span>
              <span className="val">RM 34.20</span>
            </div>
          </div>
        </div>
        <div
          style={{
            background: "var(--card)",
            borderRadius: "var(--r-lg)",
            border: "1.5px solid var(--border)",
            padding: "14px 16px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: 13 }}>
                Use GrabPoints
              </div>
              <div
                style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}
              >
                680 pts = RM 3.40 off
              </div>
            </div>
            <div
              style={{
                width: 44,
                height: 24,
                borderRadius: 12,
                background: usePoints ? "var(--grab)" : "var(--border)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                padding: "2px 3px",
                transition: "all 0.2s",
              }}
              onClick={() => setUsePoints((u) => !u)}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: "#fff",
                  transform: usePoints ? "translateX(20px)" : "translateX(0)",
                  transition: "transform 0.2s",
                }}
              />
            </div>
          </div>
          {usePoints && (
            <div
              style={{
                marginTop: 10,
                padding: "8px 12px",
                background: "var(--grab-light)",
                borderRadius: "var(--r-sm)",
                fontSize: 12,
                color: "var(--grab)",
                fontWeight: 600,
              }}
            >
              ✓ Saving RM 3.40 with 680 points
            </div>
          )}
        </div>
        <div className="order-card">
          <div className="order-rows">
            <div className="order-row">
              <span className="key">Subtotal</span>
              <span className="val">RM 34.20</span>
            </div>
            {usePoints && (
              <div className="order-row">
                <span className="key">GrabPoints (680 pts)</span>
                <span className="val green">−RM 3.40</span>
              </div>
            )}
            <div className="order-divider" />
            <div className="order-row order-total">
              <span className="key">Total</span>
              <span className="val">{usePoints ? "RM 30.80" : "RM 34.20"}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="screen-footer">
        <button className="btn btn-primary btn-full btn-lg" onClick={onNext}>
          Confirm
        </button>
      </div>
    </div>,

    <div className="screen">
      <ScreenHeader title="Confirm Points" onBack={onBack} step="2/4" />
      <div className="screen-body">
        <div style={{ textAlign: "center", padding: "24px 0" }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>⭐</div>
          <div style={{ fontSize: 13, color: "var(--muted)" }}>Redeeming</div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 36,
              fontWeight: 800,
              color: "var(--grab)",
              letterSpacing: -1,
            }}
          >
            680 Points
          </div>
          <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
            = RM 3.40 discount
          </div>
        </div>
        <div className="order-card">
          <div className="order-rows">
            <div className="order-row">
              <span className="key">Ride Total</span>
              <span className="val">RM 34.20</span>
            </div>
            <div className="order-row">
              <span className="key">Points Redeemed</span>
              <span className="val green">−RM 3.40</span>
            </div>
            <div className="order-row">
              <span className="key">Charged to GrabPay</span>
              <span className="val accent">RM 30.80</span>
            </div>
          </div>
        </div>
        <div
          style={{
            background: "var(--amber-light)",
            borderRadius: "var(--r-lg)",
            padding: "12px 14px",
            fontSize: 12,
            color: "var(--amber)",
          }}
        >
          ⚠️ After redemption: 2,170 points remaining (≈ RM 10.85)
        </div>
      </div>
      <div className="screen-footer">
        <button
          className="btn btn-primary btn-full btn-lg"
          style={{ background: "var(--grab)" }}
          onClick={onNext}
        >
          ⭐ Redeem & Pay
        </button>
      </div>
    </div>,

    <div className="screen">
      <div className="status-screen">
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "var(--grab-light)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 36,
          }}
        >
          ⭐
        </div>
        <div className="status-title">Points Redeemed!</div>
        <div className="status-amount" style={{ color: "var(--grab)" }}>
          680 pts
        </div>
        <div className="status-sub">
          Successfully applied to your ride payment
        </div>
        <button
          className="btn btn-primary btn-full"
          onClick={onNext}
          style={{ background: "var(--grab)" }}
        >
          View Confirmation →
        </button>
      </div>
    </div>,

    <div className="screen">
      <div className="status-screen">
        <div className="status-icon-wrap status-icon-success">✅</div>
        <div className="status-title">Ride Paid!</div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 13,
              color: "var(--muted)",
              textDecoration: "line-through",
            }}
          >
            RM 34.20
          </div>
          <div className="status-amount">RM 30.80</div>
          <span className="pill pill-grab">Saved with 680 Points</span>
        </div>
        <div className="status-ref">RIDE #GRB-RIDE-5521</div>
        <div
          style={{
            background: "var(--grab-light)",
            border: "1px solid var(--grab)",
            borderRadius: "var(--r-lg)",
            padding: "14px 16px",
            width: "100%",
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: "var(--grab)",
              fontWeight: 700,
              marginBottom: 6,
            }}
          >
            POINTS SUMMARY
          </div>
          <div
            style={{
              fontSize: 12,
              color: "var(--ink)",
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Points used</span>
              <span style={{ fontWeight: 700 }}>−680 pts</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Points earned (this ride)</span>
              <span style={{ fontWeight: 700, color: "var(--grab)" }}>
                +31 pts
              </span>
            </div>
            <div
              style={{ height: 1, background: "var(--grab)", opacity: 0.2 }}
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>New balance</span>
              <span style={{ fontWeight: 800, color: "var(--grab)" }}>
                2,201 pts
              </span>
            </div>
          </div>
        </div>
        <button
          className="btn btn-primary btn-full"
          onClick={onBack}
          style={{ background: "var(--grab)" }}
        >
          Done
        </button>
      </div>
    </div>,
  ];
  return screens[Math.min(step, screens.length - 1)];
}

// Shopee Coupon
function ShopeeCouponFlow({ step, onNext, onBack }) {
  const [couponApplied, setCouponApplied] = useState(false);
  const screens = [
    <div className="screen">
      <ScreenHeader title="My Cart" onBack={onBack} step="1/4" />
      <div className="screen-body">
        {[
          {
            icon: "👟",
            name: "Nike Air Max 270",
            sub: "Size: UK8 · Black",
            price: "RM 349.00",
          },
          {
            icon: "🧴",
            name: "Skincare Set",
            sub: "Qty: 1",
            price: "RM 89.90",
          },
        ].map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 12,
              background: "var(--card)",
              borderRadius: "var(--r-lg)",
              padding: "12px 14px",
              border: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "var(--r-md)",
                background: "var(--surface)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
              }}
            >
              {item.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{item.name}</div>
              <div
                style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}
              >
                {item.sub}
              </div>
            </div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#EE4D2D" }}>
              {item.price}
            </div>
          </div>
        ))}
        <div
          className={`coupon-card ${couponApplied ? "applied" : ""}`}
          onClick={() => setCouponApplied((a) => !a)}
        >
          <span className="coupon-icon">{couponApplied ? "✅" : "🎁"}</span>
          <div>
            <div className="coupon-code">
              {couponApplied ? "SHOPEE50 Applied" : "SHOPEE50"}
            </div>
            <div className="coupon-desc">
              {couponApplied
                ? "RM 50 off · Applied automatically"
                : "Tap to apply · RM 50 off min. spend RM 300"}
            </div>
          </div>
          {couponApplied && (
            <span className="pill pill-emerald" style={{ marginLeft: "auto" }}>
              −RM 50
            </span>
          )}
        </div>
        <div
          style={{
            background: "var(--amber-light)",
            borderRadius: "var(--r-lg)",
            padding: "10px 14px",
            fontSize: 12,
            color: "var(--amber)",
            fontWeight: 600,
            border: "1px solid rgba(217,119,6,0.2)",
          }}
        >
          🪙 128 Shopee Coins available (≈ RM 1.28) · Auto-applied
        </div>
        <div className="order-card">
          <div className="order-rows">
            <div className="order-row">
              <span className="key">Merchandise</span>
              <span className="val">RM 438.90</span>
            </div>
            <div className="order-row">
              <span className="key">Shipping</span>
              <span className="val">RM 8.50</span>
            </div>
            {couponApplied && (
              <div className="order-row">
                <span className="key">Voucher (SHOPEE50)</span>
                <span className="val green">−RM 50.00</span>
              </div>
            )}
            <div className="order-row">
              <span className="key">Shopee Coins</span>
              <span className="val green">−RM 1.28</span>
            </div>
            <div className="order-divider" />
            <div className="order-row order-total">
              <span className="key">Total</span>
              <span className="val" style={{ color: "#EE4D2D" }}>
                {couponApplied ? "RM 396.12" : "RM 446.12"}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="screen-footer">
        {couponApplied && (
          <div
            style={{
              textAlign: "center",
              fontSize: 12,
              color: "var(--emerald)",
              fontWeight: 700,
            }}
          >
            🎉 You're saving RM 51.28 today!
          </div>
        )}
        <button
          className="btn btn-full btn-lg"
          style={{ background: "#EE4D2D", color: "#fff" }}
          onClick={onNext}
        >
          Checkout {couponApplied ? "(RM 396.12)" : "(RM 446.12)"}
        </button>
      </div>
    </div>,

    <div className="screen">
      <ScreenHeader title="Payment" onBack={onBack} step="2/4" />
      <div className="screen-body">
        {[
          {
            icon: "🧡",
            name: "ShopeePay",
            sub: "Balance: RM 450.00",
            sel: true,
            color: "#FFF3F0",
          },
          {
            icon: "💳",
            name: "Credit / Debit Card",
            sub: "Visa, Mastercard",
            sel: false,
            color: "#F0F9FF",
          },
        ].map((m, i) => (
          <div
            key={i}
            className={`method-card ${m.sel ? "selected" : ""}`}
            style={{ "--accent": "#EE4D2D", "--accent-light": "#FFF3F0" }}
          >
            <div className="method-icon" style={{ background: m.color }}>
              {m.icon}
            </div>
            <div className="method-info">
              <div className="method-name">{m.name}</div>
              <div className="method-sub">{m.sub}</div>
            </div>
            <div
              className="method-check"
              style={{
                background: m.sel ? "#EE4D2D" : "",
                borderColor: m.sel ? "#EE4D2D" : "",
              }}
            >
              {m.sel ? "✓" : ""}
            </div>
          </div>
        ))}
        <div
          style={{
            background: "var(--emerald-light)",
            borderRadius: "var(--r-lg)",
            padding: "12px 14px",
            border: "1px solid rgba(5,150,105,0.2)",
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "var(--emerald)",
              marginBottom: 6,
            }}
          >
            ✓ SAVINGS APPLIED
          </div>
          <div
            style={{
              fontSize: 12,
              color: "var(--ink)",
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Voucher SHOPEE50</span>
              <span style={{ color: "var(--emerald)", fontWeight: 700 }}>
                −RM 50.00
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>128 Shopee Coins</span>
              <span style={{ color: "var(--emerald)", fontWeight: 700 }}>
                −RM 1.28
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="screen-footer">
        <button
          className="btn btn-full btn-lg"
          style={{ background: "#EE4D2D", color: "#fff" }}
          onClick={onNext}
        >
          Pay RM 396.12
        </button>
      </div>
    </div>,

    <div className="screen">
      <div className="status-screen">
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "#FFF3F0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="spinner"
            style={{
              width: 36,
              height: 36,
              borderColor: "rgba(238,77,45,0.2)",
              borderTopColor: "#EE4D2D",
            }}
          />
        </div>
        <div className="status-title" style={{ fontSize: 18 }}>
          Placing Order...
        </div>
        <div className="status-sub">
          Processing with ShopeePay. This takes just a moment.
        </div>
        <button className="btn btn-secondary btn-sm" onClick={onNext}>
          Skip →
        </button>
      </div>
    </div>,

    <div className="screen">
      <div className="status-screen">
        <div className="status-icon-wrap status-icon-success">✅</div>
        <div className="status-title">Order Placed!</div>
        <div className="status-amount" style={{ color: "#EE4D2D" }}>
          RM 396.12
        </div>
        <div className="status-sub">
          Paid via ShopeePay
          <br />
          Estimated delivery: 3–5 business days
        </div>
        <div className="status-ref">ORDER #2025021800552</div>
        <div
          style={{
            background: "#FFF3F0",
            borderRadius: "var(--r-lg)",
            padding: "14px 16px",
            width: "100%",
            border: "1px solid rgba(238,77,45,0.15)",
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#EE4D2D",
              marginBottom: 8,
            }}
          >
            🎉 YOU SAVED RM 51.28
          </div>
          <div
            style={{
              fontSize: 12,
              color: "var(--ink)",
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Voucher savings</span>
              <span>RM 50.00</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Coins used</span>
              <span>RM 1.28</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Coins earned</span>
              <span style={{ color: "var(--amber)", fontWeight: 700 }}>
                +40 🪙
              </span>
            </div>
          </div>
        </div>
        <button
          className="btn btn-full"
          style={{ background: "#EE4D2D", color: "#fff" }}
          onClick={onBack}
        >
          Track Order
        </button>
      </div>
    </div>,
  ];
  return screens[Math.min(step, screens.length - 1)];
}

// Pending / FPX
function PendingFlow({ step, onNext, onBack }) {
  const screens = [
    <div className="screen">
      <ScreenHeader title="FPX Bank Transfer" onBack={onBack} step="1/4" />
      <div className="screen-body">
        <div
          style={{
            background: "var(--card)",
            borderRadius: "var(--r-xl)",
            border: "1px solid var(--border)",
            padding: "16px",
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: "var(--muted)",
              fontWeight: 600,
              marginBottom: 12,
            }}
          >
            SELECT YOUR BANK
          </div>
          {[
            { n: "Maybank2U", i: "🏦" },
            { n: "CIMB Clicks", i: "🏛️" },
            { n: "Public Bank", i: "🏢" },
            { n: "RHB Bank", i: "💼" },
          ].map((b, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px",
                borderRadius: "var(--r-md)",
                background: "var(--surface)",
                marginBottom: 8,
                cursor: "pointer",
              }}
              onClick={onNext}
            >
              <span style={{ fontSize: 22 }}>{b.i}</span>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{b.n}</span>
              <span
                style={{
                  marginLeft: "auto",
                  color: "var(--muted)",
                  fontSize: 16,
                }}
              >
                ›
              </span>
            </div>
          ))}
        </div>
        <div
          style={{
            background: "var(--amber-light)",
            borderRadius: "var(--r-lg)",
            padding: "12px 14px",
            fontSize: 12,
            color: "var(--amber)",
            border: "1px solid rgba(217,119,6,0.2)",
          }}
        >
          ⏳ Bank transfers typically take 1–2 minutes. Your order will be
          confirmed once payment is verified.
        </div>
      </div>
    </div>,

    <div className="screen" style={{ background: "#003A8C" }}>
      <div
        style={{
          padding: "16px 16px 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>
          Maybank2U
        </span>
        <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>
          Secure Portal
        </span>
      </div>
      <div
        style={{
          margin: "16px",
          background: "rgba(255,255,255,0.08)",
          borderRadius: "var(--r-lg)",
          padding: "16px",
        }}
      >
        <div
          style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: 11,
            marginBottom: 4,
          }}
        >
          PAYMENT AMOUNT
        </div>
        <div
          style={{
            color: "#fff",
            fontSize: 32,
            fontWeight: 800,
            fontFamily: "var(--font-display)",
          }}
        >
          RM 245.00
        </div>
        <div
          style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginTop: 4 }}
        >
          To: Shopee · Ref: ORDER-2025-001
        </div>
      </div>
      <div
        style={{
          margin: "0 16px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <div>
          <div
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: 11,
              marginBottom: 4,
            }}
          >
            USERNAME
          </div>
          <input
            className="input"
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff",
              "::placeholder": { color: "rgba(255,255,255,0.4)" },
            }}
            placeholder="Your Maybank ID"
          />
        </div>
        <div>
          <div
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: 11,
              marginBottom: 4,
            }}
          >
            PASSWORD
          </div>
          <input
            className="input"
            type="password"
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff",
            }}
            placeholder="••••••••"
          />
        </div>
      </div>
      <div style={{ padding: "16px" }}>
        <button
          className="btn btn-full btn-lg"
          style={{ background: "#FFB800", color: "#000", fontWeight: 800 }}
          onClick={onNext}
        >
          Proceed to Authorise
        </button>
        <div
          style={{
            textAlign: "center",
            color: "rgba(255,255,255,0.4)",
            fontSize: 11,
            marginTop: 8,
          }}
        >
          Powered by FPX · Bank Negara Malaysia
        </div>
      </div>
    </div>,

    <div className="screen">
      <div className="status-screen">
        <div className="status-icon-wrap status-icon-pending">⏳</div>
        <div className="status-title">Payment Pending</div>
        <div className="status-amount">RM 245.00</div>
        <div className="status-sub">
          Your FPX transfer is being verified. This usually takes 1–3 minutes.{" "}
          <b>Do not close this page.</b>
        </div>
        <div className="status-ref">FPX REF #MBB2025021800A</div>
        <div
          style={{
            width: "100%",
            background: "var(--amber-light)",
            borderRadius: "var(--r-lg)",
            padding: "14px 16px",
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "var(--amber)",
              marginBottom: 8,
            }}
          >
            PENDING STATUS
          </div>
          <div className="timeline">
            {[
              {
                label: "Payment Initiated",
                sub: "FPX authorisation sent",
                done: true,
              },
              {
                label: "Processing",
                sub: "Awaiting approval...",
                active: true,
              },
              {
                label: "Order Confirmation",
                sub: "Waiting for bank response",
                done: false,
              },
            ].map((t, i, a) => (
              <div key={i} className="tl-item">
                <div className="tl-left">
                  <div
                    className="tl-dot"
                    style={{
                      background: t.done
                        ? "var(--emerald-light)"
                        : t.active
                          ? "var(--amber-light)"
                          : "var(--border)",
                      fontSize: 12,
                    }}
                  >
                    {t.done ? (
                      "✓"
                    ) : t.active ? (
                      <div
                        className="spinner spinner-accent"
                        style={{
                          width: 14,
                          height: 14,
                          borderColor: "rgba(217,119,6,0.3)",
                          borderTopColor: "var(--amber)",
                        }}
                      />
                    ) : (
                      "○"
                    )}
                  </div>
                  {i < a.length - 1 && <div className="tl-line" />}
                </div>
                <div className="tl-content">
                  <div className="tl-title" style={{ fontSize: 12 }}>
                    {t.label}
                  </div>
                  <div className="tl-sub">{t.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <button className="btn btn-primary btn-full" onClick={onNext}>
          Simulate Confirmation →
        </button>
      </div>
    </div>,

    <div className="screen">
      <div className="status-screen">
        <div className="status-icon-wrap status-icon-success">✅</div>
        <div className="status-title">Payment Confirmed!</div>
        <div className="status-amount">RM 245.00</div>
        <div className="status-sub">
          FPX transfer verified by Maybank.
          <br />
          Your order is now being processed.
        </div>
        <div className="status-ref">ORDER #CONF-20250218</div>
        <div style={{ display: "flex", gap: 8, width: "100%" }}>
          <button
            className="btn btn-secondary"
            style={{ flex: 1 }}
            onClick={onBack}
          >
            Track Order
          </button>
          <button
            className="btn btn-primary"
            style={{ flex: 1 }}
            onClick={onBack}
          >
            Done
          </button>
        </div>
      </div>
    </div>,
  ];
  return screens[Math.min(step, screens.length - 1)];
}

// Card Declined
function FailedFlow({ step, onNext, onBack }) {
  const screens = [
    <div className="screen">
      <ScreenHeader title="Card Payment" onBack={onBack} step="1/4" />
      <div className="screen-body">
        <div
          style={{
            background: "var(--card)",
            borderRadius: "var(--r-xl)",
            border: "1.5px solid var(--border)",
            padding: "20px",
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: "var(--muted)",
              fontWeight: 600,
              marginBottom: 12,
            }}
          >
            CARD DETAILS
          </div>
          <div className="input-group" style={{ marginBottom: 12 }}>
            <input
              className="input input-card"
              defaultValue="4111 1111 1111 1111"
            />
          </div>
          <div className="input-row">
            <input className="input input-card" defaultValue="12 / 26" />
            <input
              className="input input-card"
              type="password"
              defaultValue="•••"
            />
          </div>
        </div>
        <div
          style={{
            background: "var(--order-card)",
            borderRadius: "var(--r-lg)",
            border: "1px solid var(--border)",
            padding: "14px 16px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            <span>Total</span>
            <span>RM 1,249.00</span>
          </div>
        </div>
      </div>
      <div className="screen-footer">
        <button className="btn btn-primary btn-full btn-lg" onClick={onNext}>
          🔒 Pay RM 1,249.00
        </button>
      </div>
    </div>,

    <div className="screen">
      <div className="status-screen">
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "var(--amber-light)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="spinner spinner-accent"
            style={{
              width: 36,
              height: 36,
              borderColor: "rgba(217,119,6,0.3)",
              borderTopColor: "var(--amber)",
            }}
          />
        </div>
        <div className="status-title" style={{ fontSize: 18 }}>
          Processing...
        </div>
        <div className="status-sub">Contacting your bank. Please wait.</div>
        <button
          className="btn btn-secondary btn-sm"
          onClick={onNext}
          style={{ marginTop: 16 }}
        >
          Simulate Result →
        </button>
      </div>
    </div>,

    <div className="screen">
      <div className="status-screen">
        <div className="status-icon-wrap status-icon-failed">❌</div>
        <div className="status-title" style={{ color: "var(--rose)" }}>
          Payment Declined
        </div>
        <div
          className="status-amount"
          style={{
            fontSize: 24,
            color: "var(--muted)",
            textDecoration: "line-through",
          }}
        >
          RM 1,249.00
        </div>
        <div
          style={{
            background: "var(--rose-light)",
            borderRadius: "var(--r-lg)",
            padding: "14px 16px",
            width: "100%",
            border: "1px solid rgba(225,29,72,0.2)",
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: "var(--rose)",
              fontWeight: 700,
              marginBottom: 6,
            }}
          >
            REASON FOR DECLINE
          </div>
          <div style={{ fontSize: 13, color: "var(--ink)" }}>
            Insufficient funds on Visa •••• 1111
          </div>
          <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>
            Your card was declined by your bank. You have not been charged.
          </div>
        </div>
        <div
          style={{
            width: "100%",
            background: "var(--surface)",
            borderRadius: "var(--r-lg)",
            padding: "14px 16px",
            border: "1px solid var(--border)",
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "var(--ink)",
              marginBottom: 10,
            }}
          >
            TRY ANOTHER METHOD
          </div>
          {[
            { icon: "💳", name: "Add New Card", sub: "Visa / Mastercard" },
            { icon: "🟢", name: "GrabPay Wallet", sub: "Balance: RM 84.50" },
            { icon: "🏦", name: "FPX Bank Transfer", sub: "Maybank, CIMB +" },
          ].map((m, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 0",
                borderBottom: i < 2 ? "1px solid var(--border)" : "none",
                cursor: "pointer",
              }}
              onClick={onNext}
            >
              <span style={{ fontSize: 18 }}>{m.icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{m.name}</div>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>
                  {m.sub}
                </div>
              </div>
              <span style={{ marginLeft: "auto", color: "var(--accent)" }}>
                ›
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>,

    <div className="screen">
      <div className="status-screen">
        <div className="status-icon-wrap status-icon-success">✅</div>
        <div className="status-title">Payment Successful!</div>
        <div className="status-amount">RM 1,249.00</div>
        <div className="status-sub">
          Paid via GrabPay Wallet
          <br />
          Previous card decline — you were not charged
        </div>
        <div className="status-ref">TXN #RETRY-20250218</div>
        <div
          style={{
            background: "var(--emerald-light)",
            borderRadius: "var(--r-lg)",
            padding: "12px 14px",
            width: "100%",
            fontSize: 12,
            color: "var(--emerald)",
            fontWeight: 600,
          }}
        >
          ✓ You were never charged for the declined transaction
        </div>
        <button className="btn btn-primary btn-full" onClick={onBack}>
          Done
        </button>
      </div>
    </div>,
  ];
  return screens[Math.min(step, screens.length - 1)];
}

// Offline / Network Error
function OfflineFlow({ step, onNext, onBack }) {
  const screens = [
    <div className="screen">
      <div className="offline-banner">📶 No Internet Connection</div>
      <ScreenHeader title="Checkout" onBack={onBack} />
      <div className="screen-body">
        <div className="order-card">
          <div className="order-rows">
            <div className="order-row">
              <span className="key">Order total</span>
              <span className="val">RM 89.00</span>
            </div>
          </div>
        </div>
        <div
          style={{
            textAlign: "center",
            padding: "32px 20px",
            background: "var(--card)",
            borderRadius: "var(--r-xl)",
            border: "2px solid var(--rose-light)",
          }}
        >
          <div style={{ fontSize: 64, marginBottom: 12 }}>📵</div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 18,
              fontWeight: 800,
              color: "var(--rose)",
            }}
          >
            No Connection Detected
          </div>
          <div
            style={{
              fontSize: 13,
              color: "var(--muted)",
              marginTop: 8,
              lineHeight: 1.5,
            }}
          >
            Your payment has <b>not been submitted</b>. Connect to Wi-Fi or
            mobile data to continue.
          </div>
        </div>
        <div
          style={{
            background: "var(--rose-light)",
            borderRadius: "var(--r-lg)",
            padding: "12px 14px",
            fontSize: 12,
            color: "var(--rose)",
            border: "1px solid rgba(225,29,72,0.2)",
          }}
        >
          <b>You have not been charged.</b> Your cart is saved and ready when
          you reconnect.
        </div>
      </div>
      <div className="screen-footer">
        <button className="btn btn-secondary btn-full" onClick={onNext}>
          Simulate Reconnect
        </button>
      </div>
    </div>,

    <div className="screen">
      <div className="status-screen">
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "var(--emerald-light)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 36,
          }}
        >
          📶
        </div>
        <div className="status-title" style={{ color: "var(--emerald)" }}>
          Connection Restored!
        </div>
        <div className="status-sub">
          Your cart has been preserved. Ready to complete your payment.
        </div>
        <button className="btn btn-primary btn-full" onClick={onNext}>
          Resume Payment →
        </button>
      </div>
    </div>,

    <div className="screen">
      <ScreenHeader title="Resume Checkout" onBack={onBack} />
      <div className="screen-body">
        <div
          style={{
            background: "var(--emerald-light)",
            borderRadius: "var(--r-lg)",
            padding: "10px 14px",
            fontSize: 12,
            color: "var(--emerald)",
            fontWeight: 600,
            border: "1px solid rgba(5,150,105,0.2)",
          }}
        >
          ✓ Cart restored · GrabPay wallet pre-selected
        </div>
        <div className="order-card">
          <div className="order-rows">
            <div className="order-row order-total">
              <span className="key">Total</span>
              <span className="val">RM 89.00</span>
            </div>
          </div>
        </div>
        <div className={`method-card selected`}>
          <div
            className="method-icon"
            style={{ background: "var(--grab-light)" }}
          >
            🟢
          </div>
          <div className="method-info">
            <div className="method-name">GrabPay Wallet</div>
            <div className="method-sub">Balance: RM 84.50</div>
          </div>
          <div
            className="method-check"
            style={{
              background: "var(--grab)",
              borderColor: "var(--grab)",
              color: "#fff",
            }}
          >
            ✓
          </div>
        </div>
      </div>
      <div className="screen-footer">
        <button className="btn btn-primary btn-full btn-lg" onClick={onNext}>
          Pay RM 89.00
        </button>
      </div>
    </div>,

    <div className="screen">
      <div className="status-screen">
        <div className="status-icon-wrap status-icon-success">✅</div>
        <div className="status-title">Payment Complete!</div>
        <div className="status-amount">RM 89.00</div>
        <div className="status-sub">
          Cart restored from offline session. No duplicate charge.
        </div>
        <div className="status-ref">TXN #OFFLINE-RESUME-001</div>
        <button className="btn btn-primary btn-full" onClick={onBack}>
          Done
        </button>
      </div>
    </div>,
  ];
  return screens[Math.min(step, screens.length - 1)];
}

// Refund Flow
function RefundFlow({ step, onNext, onBack }) {
  const [reason, setReason] = useState(null);
  const screens = [
    <div className="screen">
      <ScreenHeader title="My Orders" onBack={onBack} />
      <div className="screen-body">
        <div
          style={{
            background: "var(--card)",
            borderRadius: "var(--r-xl)",
            border: "1px solid var(--border)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "14px 16px",
              background: "var(--surface)",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 700 }}>
                ORDER #SHP-20250201
              </span>
              <span className="pill pill-emerald">Delivered</span>
            </div>
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>
              Delivered 5 Feb 2025
            </div>
          </div>
          <div
            style={{
              padding: "14px 16px",
              display: "flex",
              gap: 12,
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "var(--r-md)",
                background: "var(--surface)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
              }}
            >
              👟
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>
                Nike Air Max 270
              </div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>
                Size UK8 · Black
              </div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  color: "#EE4D2D",
                  marginTop: 4,
                }}
              >
                RM 349.00
              </div>
            </div>
          </div>
          <div
            style={{
              padding: "12px 16px",
              borderTop: "1px solid var(--border)",
              display: "flex",
              gap: 8,
            }}
          >
            <button
              className="btn btn-danger btn-sm"
              style={{ flex: 1 }}
              onClick={onNext}
            >
              ↩ Return / Refund
            </button>
            <button className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
              Buy Again
            </button>
          </div>
        </div>
      </div>
    </div>,

    <div className="screen">
      <ScreenHeader title="Request Refund" onBack={onBack} step="1/4" />
      <div className="screen-body">
        <div
          style={{
            fontSize: 12,
            color: "var(--muted)",
            fontWeight: 600,
            marginBottom: 10,
          }}
        >
          SELECT REASON
        </div>
        {[
          "Item doesn't match description",
          "Wrong size / colour received",
          "Item arrived damaged",
          "Item never arrived",
          "Changed my mind",
          "Duplicate order",
        ].map((r, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 14px",
              background: "var(--card)",
              border: "1.5px solid",
              borderColor: reason === r ? "var(--sky)" : "var(--border)",
              borderRadius: "var(--r-md)",
              cursor: "pointer",
              marginBottom: 8,
              transition: "all 0.15s",
            }}
            onClick={() => setReason(r)}
          >
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                border: "2px solid",
                borderColor: reason === r ? "var(--sky)" : "var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
                background: reason === r ? "var(--sky)" : "transparent",
                color: "#fff",
              }}
            >
              {reason === r ? "✓" : ""}
            </div>
            <span style={{ fontSize: 13, fontWeight: 500 }}>{r}</span>
          </div>
        ))}
        <div className="input-group">
          <label className="input-label">Additional details (optional)</label>
          <textarea
            className="input"
            rows={3}
            placeholder="Describe the issue..."
            style={{ resize: "none", fontFamily: "var(--font-body)" }}
          />
        </div>
      </div>
      <div className="screen-footer">
        <button
          className="btn btn-primary btn-full"
          onClick={onNext}
          disabled={!reason}
          style={{ background: "var(--sky)" }}
        >
          Submit Request
        </button>
      </div>
    </div>,

    <div className="screen">
      <ScreenHeader title="Refund Method" onBack={onBack} step="2/4" />
      <div className="screen-body">
        <div style={{ textAlign: "center", padding: "12px 0 16px" }}>
          <div
            style={{
              fontSize: 28,
              fontWeight: 800,
              fontFamily: "var(--font-display)",
              color: "var(--sky)",
            }}
          >
            RM 349.00
          </div>
          <div style={{ fontSize: 13, color: "var(--muted)" }}>
            Refund amount
          </div>
        </div>
        <div
          style={{
            fontSize: 12,
            color: "var(--muted)",
            fontWeight: 600,
            marginBottom: 10,
          }}
        >
          WHERE SHOULD WE SEND IT?
        </div>
        {[
          {
            icon: "🧡",
            name: "ShopeePay Wallet",
            sub: "Instant · Available immediately",
            badge: "FASTEST",
            badgeColor: "emerald",
          },
          {
            icon: "💳",
            name: "Original Card (Visa ••4242)",
            sub: "5–7 business days",
            badge: null,
          },
          {
            icon: "🏦",
            name: "Bank Account",
            sub: "3–5 business days",
            badge: null,
          },
        ].map((m, i) => (
          <div
            key={i}
            className={`method-card ${i === 0 ? "selected" : ""}`}
            style={{ marginBottom: 8 }}
            onClick={onNext}
          >
            <div
              className="method-icon"
              style={{ background: "var(--surface)", fontSize: 22 }}
            >
              {m.icon}
            </div>
            <div className="method-info">
              <div className="method-name">{m.name}</div>
              <div className="method-sub">{m.sub}</div>
            </div>
            {m.badge && (
              <span className={`pill pill-${m.badgeColor}`}>{m.badge}</span>
            )}
          </div>
        ))}
      </div>
    </div>,

    <div className="screen">
      <ScreenHeader title="Refund Status" onBack={onBack} step="3/4" />
      <div className="screen-body">
        <div style={{ textAlign: "center", padding: "16px 0 8px" }}>
          <div
            className="status-icon-wrap status-icon-refund"
            style={{ margin: "0 auto 12px" }}
          >
            ↩️
          </div>
          <div className="status-title" style={{ fontSize: 20 }}>
            Refund Initiated
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: "var(--sky)",
              fontFamily: "var(--font-display)",
            }}
          >
            RM 349.00
          </div>
        </div>
        <div
          style={{
            background: "var(--sky-light)",
            borderRadius: "var(--r-lg)",
            padding: "14px 16px",
            border: "1px solid rgba(2,132,199,0.2)",
            marginBottom: 16,
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: "var(--sky)",
              fontWeight: 700,
              marginBottom: 6,
            }}
          >
            REFUND TRACKER
          </div>
          <div className="refund-track">
            {[
              { label: "Requested", icon: "✓", done: true },
              { label: "Approved", icon: "✓", done: true },
              { label: "Processing", icon: "⏳", active: true },
              { label: "Credited", icon: "○", done: false },
            ].map((rt, i, a) => (
              <span
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  flex: i < a.length - 1 ? "1" : "0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: rt.done
                        ? "var(--emerald)"
                        : rt.active
                          ? "var(--amber-light)"
                          : "var(--border)",
                      border: `2.5px solid ${rt.done ? "var(--emerald)" : rt.active ? "var(--amber)" : "var(--border)"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      color: rt.done ? "#fff" : "var(--ink)",
                    }}
                  >
                    {rt.done ? (
                      "✓"
                    ) : rt.active ? (
                      <div
                        className="spinner"
                        style={{
                          width: 14,
                          height: 14,
                          borderColor: "rgba(217,119,6,0.3)",
                          borderTopColor: "var(--amber)",
                        }}
                      />
                    ) : (
                      rt.icon
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: 9,
                      color: rt.done ? "var(--emerald)" : "var(--muted)",
                      fontWeight: 600,
                      textAlign: "center",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {rt.label}
                  </div>
                </div>
                {i < a.length - 1 && (
                  <div
                    style={{
                      flex: 1,
                      height: 2.5,
                      background: rt.done ? "var(--emerald)" : "var(--border)",
                      marginBottom: 18,
                      marginLeft: 3,
                      marginRight: 3,
                    }}
                  />
                )}
              </span>
            ))}
          </div>
        </div>
        <div className="timeline">
          {[
            {
              label: "Refund Requested",
              sub: "18 Feb 2025, 10:22 AM",
              done: true,
            },
            {
              label: "Seller Approved",
              sub: "18 Feb 2025, 11:45 AM",
              done: true,
            },
            {
              label: "Shopee Processing",
              sub: "Estimated: 1–2 business days",
              active: true,
            },
            {
              label: "Credited to ShopeePay",
              sub: "Estimated: 20 Feb 2025",
              done: false,
            },
          ].map((t, i, a) => (
            <div key={i} className="tl-item">
              <div className="tl-left">
                <div
                  className="tl-dot"
                  style={{
                    background: t.done
                      ? "var(--emerald-light)"
                      : t.active
                        ? "var(--amber-light)"
                        : "var(--border)",
                    fontSize: 12,
                  }}
                >
                  {t.done ? (
                    "✓"
                  ) : t.active ? (
                    <div
                      className="spinner"
                      style={{
                        width: 14,
                        height: 14,
                        borderColor: "rgba(217,119,6,0.3)",
                        borderTopColor: "var(--amber)",
                      }}
                    />
                  ) : (
                    "○"
                  )}
                </div>
                {i < a.length - 1 && (
                  <div
                    className="tl-line"
                    style={{
                      background: t.done ? "var(--emerald)" : "var(--border)",
                    }}
                  />
                )}
              </div>
              <div className="tl-content">
                <div className="tl-title" style={{ fontSize: 12 }}>
                  {t.label}
                </div>
                <div className="tl-sub">{t.sub}</div>
              </div>
            </div>
          ))}
        </div>
        <button
          className="btn btn-primary btn-full"
          onClick={onNext}
          style={{ background: "var(--sky)" }}
        >
          Simulate Completion →
        </button>
      </div>
    </div>,

    <div className="screen">
      <div className="status-screen">
        <div className="status-icon-wrap status-icon-refund">💚</div>
        <div className="status-title">Refund Complete!</div>
        <div className="status-amount" style={{ color: "var(--sky)" }}>
          RM 349.00
        </div>
        <div className="status-sub">
          Successfully credited to your ShopeePay wallet.
        </div>
        <div className="status-ref">REFUND #REF-20250220-001</div>
        <div
          style={{
            background: "var(--sky-light)",
            borderRadius: "var(--r-lg)",
            padding: "14px 16px",
            width: "100%",
            border: "1px solid rgba(2,132,199,0.2)",
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: "var(--sky)",
              fontWeight: 700,
              marginBottom: 6,
            }}
          >
            REFUND SUMMARY
          </div>
          <div
            style={{
              fontSize: 12,
              color: "var(--ink)",
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Amount</span>
              <span style={{ fontWeight: 700 }}>RM 349.00</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Method</span>
              <span>ShopeePay Wallet</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Processing time</span>
              <span>2 business days</span>
            </div>
          </div>
        </div>
        <button
          className="btn btn-primary btn-full"
          onClick={onBack}
          style={{ background: "var(--sky)" }}
        >
          Done
        </button>
      </div>
    </div>,
  ];
  return screens[Math.min(step, Math.max(0, screens.length - 1))];
}

// Cancel Booking
function CancelBookingFlow({ step, onNext, onBack }) {
  const screens = [
    <div className="screen">
      <ScreenHeader title="My Bookings" onBack={onBack} />
      <div className="screen-body">
        <div
          style={{
            background: "var(--card)",
            borderRadius: "var(--r-xl)",
            border: "1px solid var(--border)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: 120,
              background:
                "linear-gradient(135deg, var(--airbnb) 0%, #C2185B 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 48,
            }}
          >
            🏡
          </div>
          <div style={{ padding: "16px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div>
                <div style={{ fontSize: 15, fontWeight: 800 }}>
                  KL Studio Apartment
                </div>
                <div
                  style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}
                >
                  20–23 Feb 2025 · 3 nights
                </div>
              </div>
              <span className="pill pill-emerald">Confirmed</span>
            </div>
            <div
              style={{
                marginTop: 12,
                padding: "10px 12px",
                background: "var(--emerald-light)",
                borderRadius: "var(--r-md)",
                fontSize: 12,
                color: "var(--emerald)",
                fontWeight: 600,
              }}
            >
              ✓ Free cancellation until 18 Feb 2025, 11:59 PM
            </div>
            <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
              <button
                className="btn btn-danger btn-sm"
                style={{ flex: 1 }}
                onClick={onNext}
              >
                Cancel Booking
              </button>
              <button className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,

    <div className="screen">
      <ScreenHeader title="Cancel Booking" onBack={onBack} step="1/3" />
      <div className="screen-body">
        <div
          style={{
            background: "var(--airbnb-light)",
            borderRadius: "var(--r-xl)",
            border: "1px solid rgba(255,56,92,0.2)",
            padding: "16px",
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "var(--airbnb)",
              marginBottom: 10,
            }}
          >
            🏡 CANCELLATION POLICY
          </div>
          <div
            style={{
              fontSize: 12,
              color: "var(--ink)",
              lineHeight: 1.8,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span
                style={{
                  color: "var(--emerald)",
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                ✓
              </span>
              <span>
                <b>Cancel before 18 Feb 11:59 PM</b> — Full refund of RM 773
              </span>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span
                style={{
                  color: "var(--amber)",
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                ⚠
              </span>
              <span>
                <b>Cancel 18–19 Feb</b> — 50% refund (RM 386.50)
              </span>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span
                style={{ color: "var(--rose)", fontWeight: 700, flexShrink: 0 }}
              >
                ✗
              </span>
              <span>
                <b>Cancel after check-in</b> — No refund
              </span>
            </div>
          </div>
        </div>
        <div
          style={{
            background: "var(--emerald-light)",
            borderRadius: "var(--r-lg)",
            padding: "14px 16px",
            border: "1px solid rgba(5,150,105,0.2)",
          }}
        >
          <div
            style={{ fontSize: 13, fontWeight: 700, color: "var(--emerald)" }}
          >
            CURRENT STATUS: Full Refund Eligible
          </div>
          <div style={{ fontSize: 12, color: "var(--ink)", marginTop: 4 }}>
            You're cancelling within the free cancellation window. You will
            receive RM 773.00 back.
          </div>
        </div>
        <div
          style={{
            fontSize: 12,
            color: "var(--muted)",
            textAlign: "center",
            padding: "4px 0",
          }}
        >
          Refund to: Apple Pay (Visa •••• 4891) · 5–7 business days
        </div>
      </div>
      <div className="screen-footer">
        <button
          className="btn btn-full btn-lg"
          style={{ background: "var(--rose)", color: "#fff" }}
          onClick={onNext}
        >
          Confirm Cancellation
        </button>
        <button className="btn btn-ghost btn-full" onClick={onBack}>
          Keep My Booking
        </button>
      </div>
    </div>,

    <div className="screen">
      <div className="status-screen">
        <div
          className="status-icon-wrap"
          style={{ background: "var(--rose-light)" }}
        >
          🚫
        </div>
        <div className="status-title">Booking Cancelled</div>
        <div className="status-amount">RM 773.00</div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            alignItems: "center",
          }}
        >
          <span className="pill pill-sky">Full Refund</span>
        </div>
        <div className="status-sub">
          Your KL Studio booking has been cancelled. Full refund initiated.
        </div>
        <div className="status-ref">CANCEL #AIR-CANCEL-9821</div>
        <div className="refund-track" style={{ width: "100%" }}>
          {[
            { label: "Cancelled", done: true },
            { label: "Refund Init.", done: true },
            { label: "Processing", active: true },
            { label: "Refunded", done: false },
          ].map((rt, i, a) => (
            <span
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                flex: i < a.length - 1 ? "1" : "0",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: rt.done
                      ? "var(--emerald)"
                      : rt.active
                        ? "var(--amber-light)"
                        : "var(--border)",
                    border: `2.5px solid ${rt.done ? "var(--emerald)" : rt.active ? "var(--amber)" : "var(--border)"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    color: rt.done ? "#fff" : "var(--muted)",
                  }}
                >
                  {rt.done ? "✓" : rt.active ? "⏳" : "○"}
                </div>
                <div
                  style={{
                    fontSize: 9,
                    color: rt.done ? "var(--emerald)" : "var(--muted)",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}
                >
                  {rt.label}
                </div>
              </div>
              {i < a.length - 1 && (
                <div
                  style={{
                    flex: 1,
                    height: 2.5,
                    background: rt.done ? "var(--emerald)" : "var(--border)",
                    marginBottom: 18,
                    margin: "0 3px 18px",
                  }}
                />
              )}
            </span>
          ))}
        </div>
        <div
          style={{
            background: "var(--sky-light)",
            borderRadius: "var(--r-lg)",
            padding: "12px 14px",
            width: "100%",
            fontSize: 12,
            color: "var(--sky)",
          }}
        >
          📧 Cancellation confirmation sent to your email
        </div>
        <button className="btn btn-primary btn-full" onClick={onBack}>
          Done
        </button>
      </div>
    </div>,
  ];
  return screens[Math.min(step, screens.length - 1)];
}

// Amazon 1-Click
function AmazonFlow({ step, onNext, onBack }) {
  const [clicked, setClicked] = useState(false);
  const screens = [
    <div className="screen" style={{ background: "#FAFAFA" }}>
      <ScreenHeader title="Product" onBack={onBack} step="1/4" />
      <div className="screen-body">
        <div
          style={{
            background: "var(--card)",
            borderRadius: "var(--r-xl)",
            border: "1px solid var(--border)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: 150,
              background: "linear-gradient(135deg, #FF9900 0%, #FF6600 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 64,
            }}
          >
            📱
          </div>
          <div style={{ padding: "16px" }}>
            <div style={{ fontSize: 15, fontWeight: 800 }}>
              Samsung Galaxy S24
            </div>
            <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>
              256GB · Phantom Black
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 6,
                marginTop: 8,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 26,
                  fontWeight: 800,
                  color: "var(--ink)",
                }}
              >
                RM 3,499
              </span>
              <span
                style={{
                  fontSize: 13,
                  color: "var(--muted)",
                  textDecoration: "line-through",
                }}
              >
                RM 3,999
              </span>
            </div>
            <div style={{ marginTop: 6, display: "flex", gap: 6 }}>
              <span className="pill pill-emerald">✓ In Stock</span>
              <span className="pill pill-sky">Prime Next-Day</span>
            </div>
          </div>
        </div>
        <div
          style={{
            background: "#FFF8F0",
            borderRadius: "var(--r-lg)",
            padding: "12px 14px",
            border: "1px solid rgba(255,153,0,0.2)",
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: "#FF9900",
              fontWeight: 700,
              marginBottom: 4,
            }}
          >
            1-CLICK SETTINGS
          </div>
          <div style={{ fontSize: 12, color: "var(--ink)", lineHeight: 1.7 }}>
            💳 Visa •••• 9912 · Primary card
            <br />
            📍 12, Jalan Ampang, KL 50450
            <br />
            🚚 Prime FREE Next-Day Delivery
          </div>
        </div>
      </div>
      <div className="screen-footer">
        <button
          className="btn btn-full btn-lg"
          style={{ background: "#FF9900", color: "#000", fontWeight: 800 }}
          onClick={() => {
            setClicked(true);
            setTimeout(onNext, 800);
          }}
          disabled={clicked}
        >
          {clicked ? (
            <>
              <div
                className="spinner"
                style={{
                  borderColor: "rgba(0,0,0,0.2)",
                  borderTopColor: "#000",
                }}
              />{" "}
              Processing...
            </>
          ) : (
            "⚡ Buy Now with 1-Click"
          )}
        </button>
        <button className="btn btn-secondary btn-full" onClick={onBack}>
          Add to Cart Instead
        </button>
      </div>
    </div>,

    <div className="screen">
      <div className="status-screen">
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "#FFF8F0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="spinner"
            style={{
              width: 36,
              height: 36,
              borderColor: "rgba(255,153,0,0.2)",
              borderTopColor: "#FF9900",
            }}
          />
        </div>
        <div className="status-title" style={{ fontSize: 18 }}>
          Processing 1-Click
        </div>
        <div className="status-sub">
          Authorising Visa •••• 9912 and scheduling delivery.
        </div>
        <button className="btn btn-secondary btn-sm" onClick={onNext}>
          Skip →
        </button>
      </div>
    </div>,

    <div className="screen">
      <div className="status-screen">
        <div className="status-icon-wrap status-icon-success">✅</div>
        <div className="status-title">Order Placed!</div>
        <div className="status-amount">RM 3,499</div>
        <div className="status-sub">
          Charged to Visa •••• 9912
          <br />
          Invoice sent to john@email.com
        </div>
        <div className="status-ref">ORDER #AMZ-2025-KL-8821</div>
        <div
          style={{
            background: "#FFF8F0",
            borderRadius: "var(--r-lg)",
            padding: "14px 16px",
            width: "100%",
            border: "1px solid rgba(255,153,0,0.2)",
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: "#FF9900",
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            📦 DELIVERY DETAILS
          </div>
          <div style={{ fontSize: 12, color: "var(--ink)", lineHeight: 1.8 }}>
            <b>Estimated arrival:</b> Tomorrow, 19 Feb
            <br />
            <b>Address:</b> 12, Jalan Ampang, KL
            <br />
            <b>Carrier:</b> Amazon Logistics
          </div>
        </div>
        <div
          style={{
            width: "100%",
            background: "var(--emerald-light)",
            borderRadius: "var(--r-lg)",
            padding: "10px 14px",
            fontSize: 12,
            color: "var(--emerald)",
            fontWeight: 600,
          }}
        >
          📧 Invoice & receipt sent to john@email.com
        </div>
        <div style={{ display: "flex", gap: 8, width: "100%" }}>
          <button
            className="btn btn-secondary"
            style={{ flex: 1 }}
            onClick={onBack}
          >
            Track
          </button>
          <button
            className="btn"
            style={{
              flex: 1,
              background: "#FF9900",
              color: "#000",
              fontWeight: 700,
            }}
            onClick={onNext}
          >
            Cancel Order?
          </button>
        </div>
      </div>
    </div>,

    <div className="screen">
      <ScreenHeader title="Cancel Order?" onBack={onBack} />
      <div className="screen-body">
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>⚠️</div>
          <div style={{ fontWeight: 800, fontSize: 16 }}>
            Cancel Before Dispatch?
          </div>
          <div
            style={{
              fontSize: 13,
              color: "var(--muted)",
              marginTop: 8,
              lineHeight: 1.5,
            }}
          >
            Order #AMZ-2025-KL-8821 has not yet shipped. You can cancel for a
            full refund.
          </div>
        </div>
        <div
          style={{
            background: "var(--emerald-light)",
            borderRadius: "var(--r-lg)",
            padding: "12px 14px",
            fontSize: 12,
            color: "var(--emerald)",
            fontWeight: 600,
          }}
        >
          ✓ Full refund of RM 3,499 to Visa •••• 9912 (5–7 days)
        </div>
        <button
          className="btn btn-danger btn-full"
          style={{ marginTop: 4 }}
          onClick={onBack}
        >
          Confirm Cancellation
        </button>
        <button className="btn btn-primary btn-full" onClick={onBack}>
          Keep My Order
        </button>
      </div>
    </div>,
  ];
  return screens[Math.min(step, screens.length - 1)];
}

// ─── SHOW RECEIPT FLOW ───────────────────────────────────────────────────────
function ShowReceiptFlow({ step, onNext, onBack }) {
  const [shareOpen, setShareOpen] = useState(false);

  const screens = [
    // Step 0 — Post-payment confirmation with "Show Receipt" CTA
    <div className="screen">
      <ScreenHeader title="Payment Complete" onBack={onBack} step="1/4" />
      <div className="screen-body">
        <div style={{ position: "relative", marginBottom: 4 }}>
          <div
            className="status-icon-wrap status-icon-success"
            style={{ margin: "16px auto 8px", position: "relative", zIndex: 2 }}
          >
            ✅
          </div>
        </div>
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 34,
              fontWeight: 900,
              letterSpacing: -1,
              color: "var(--ink)",
            }}
          >
            RM 245.00
          </div>
          <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>
            Payment successful · 18 Feb 2025, 12:42 PM
          </div>
        </div>

        {/* Quick summary card */}
        <div
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--r-xl)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background:
                "linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)",
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: "var(--r-md)",
                background: "rgba(255,255,255,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
              }}
            >
              🛒
            </div>
            <div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 14 }}>
                Shopee Order
              </div>
              <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 11 }}>
                ORDER #2025021800552
              </div>
            </div>
            <span
              className="pill"
              style={{
                marginLeft: "auto",
                background: "rgba(255,255,255,0.2)",
                color: "#fff",
                fontSize: 10,
              }}
            >
              Paid
            </span>
          </div>
          <div
            style={{
              padding: "14px 16px",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {[
              ["Merchant", "Shopee Official Store"],
              ["Method", "Visa •••• 4242"],
              ["Date", "18 Feb 2025, 12:42 PM"],
              ["Reference", "REF-VISA20250218-8821"],
            ].map(([k, v]) => (
              <div
                key={k}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12,
                }}
              >
                <span style={{ color: "var(--muted)" }}>{k}</span>
                <span
                  style={{
                    fontWeight: 600,
                    color: "var(--ink)",
                    fontFamily:
                      k === "Reference" ? "var(--font-mono)" : "inherit",
                    fontSize: k === "Reference" ? 11 : 12,
                  }}
                >
                  {v}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            background: "var(--emerald-light)",
            borderRadius: "var(--r-lg)",
            padding: "10px 14px",
            fontSize: 12,
            color: "var(--emerald)",
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          📧 Receipt sent to john@email.com
        </div>
      </div>
      <div className="screen-footer">
        <button className="btn btn-primary btn-full btn-lg" onClick={onNext}>
          🧾 View Full Receipt
        </button>
        <button className="btn btn-secondary btn-full" onClick={onBack}>
          Back to Home
        </button>
      </div>
    </div>,

    // Step 1 — Receipt document UI
    <div className="screen" style={{ background: "#F0EFF8" }}>
      <ScreenHeader title="Receipt" onBack={onBack} step="2/4" />
      <div className="screen-body" style={{ padding: "0 12px 80px" }}>
        {/* Receipt paper */}
        <div
          style={{
            background: "#fff",
            borderRadius: "var(--r-xl)",
            boxShadow:
              "0 8px 32px rgba(91,75,245,0.12), 0 2px 8px rgba(0,0,0,0.06)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Receipt header band */}
          <div
            style={{
              background: "linear-gradient(135deg, #0F0E17 0%, #2D3A8C 100%)",
              padding: "22px 20px 18px",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                width: 180,
                height: 180,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.04)",
                top: -60,
                right: -60,
              }}
            />
            <div
              style={{
                position: "absolute",
                width: 100,
                height: 100,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.04)",
                bottom: -30,
                left: -20,
              }}
            />
            <div style={{ position: "relative" }}>
              <div
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.5)",
                  letterSpacing: 2,
                  fontWeight: 700,
                  marginBottom: 4,
                }}
              >
                OFFICIAL RECEIPT
              </div>
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 900,
                  color: "#fff",
                  letterSpacing: -0.5,
                }}
              >
                RM 245.00
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.55)",
                  marginTop: 4,
                }}
              >
                18 February 2025 · 12:42 PM
              </div>
              <div
                style={{
                  marginTop: 10,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  background: "rgba(5,150,105,0.25)",
                  border: "1px solid rgba(5,150,105,0.4)",
                  borderRadius: "var(--r-full)",
                  padding: "4px 12px",
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "#10b981",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{ fontSize: 11, color: "#6EE7B7", fontWeight: 700 }}
                >
                  PAYMENT SUCCESSFUL
                </span>
              </div>
            </div>
          </div>

          {/* Merchant info */}
          <div
            style={{
              padding: "16px 20px 12px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              borderBottom: "1px dashed var(--border)",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "var(--r-md)",
                background: "#FFF3F0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                flexShrink: 0,
              }}
            >
              🛒
            </div>
            <div>
              <div
                style={{ fontSize: 14, fontWeight: 800, color: "var(--ink)" }}
              >
                Shopee Official Store
              </div>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>
                shopee.com.my · Verified Seller
              </div>
            </div>
            <span
              className="pill pill-emerald"
              style={{ marginLeft: "auto", fontSize: 10 }}
            >
              ✓ Verified
            </span>
          </div>

          {/* Line items */}
          <div
            style={{
              padding: "14px 20px",
              borderBottom: "1px dashed var(--border)",
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "var(--muted)",
                letterSpacing: 1.2,
                marginBottom: 10,
              }}
            >
              ORDER ITEMS
            </div>
            {[
              {
                name: "Nike Air Max 270",
                qty: "1×",
                price: "RM 349.00",
                sub: "Size UK8 · Black",
              },
              {
                name: "Skincare Gift Set",
                qty: "1×",
                price: "RM 89.90",
                sub: "Qty: 1",
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 10,
                  marginBottom: i === 0 ? 10 : 0,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: "var(--surface)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    flexShrink: 0,
                  }}
                >
                  {i === 0 ? "👟" : "🧴"}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "var(--ink)",
                    }}
                  >
                    {item.name}
                  </div>
                  <div style={{ fontSize: 10, color: "var(--muted)" }}>
                    {item.sub}
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>
                    {item.price}
                  </div>
                  <div style={{ fontSize: 10, color: "var(--muted)" }}>
                    {item.qty}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing breakdown */}
          <div
            style={{
              padding: "12px 20px",
              borderBottom: "1px dashed var(--border)",
              display: "flex",
              flexDirection: "column",
              gap: 7,
            }}
          >
            {[
              { k: "Subtotal", v: "RM 438.90", style: {} },
              { k: "Shipping", v: "RM 8.50", style: {} },
              {
                k: "Voucher (SHOPEE50)",
                v: "−RM 50.00",
                style: { color: "var(--emerald)", fontWeight: 700 },
              },
              {
                k: "Shopee Coins (128)",
                v: "−RM 1.28",
                style: { color: "var(--emerald)", fontWeight: 700 },
              },
              { k: "SST (0%)", v: "RM 0.00", style: { color: "var(--muted)" } },
            ].map(({ k, v, style }) => (
              <div
                key={k}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12,
                }}
              >
                <span style={{ color: "var(--muted)" }}>{k}</span>
                <span style={style}>{v}</span>
              </div>
            ))}
            <div
              style={{
                height: "1px",
                background: "var(--border)",
                margin: "4px 0",
              }}
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 14, fontWeight: 800 }}>Total Paid</span>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 900,
                  color: "var(--accent)",
                }}
              >
                RM 245.00
              </span>
            </div>
            <div style={{ textAlign: "right", marginTop: -4 }}>
              <span
                style={{
                  fontSize: 10,
                  color: "var(--emerald)",
                  fontWeight: 600,
                }}
              >
                You saved RM 51.28 🎉
              </span>
            </div>
          </div>

          {/* Payment method */}
          <div
            style={{
              padding: "12px 20px",
              borderBottom: "1px dashed var(--border)",
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "var(--muted)",
                letterSpacing: 1.2,
                marginBottom: 10,
              }}
            >
              PAYMENT METHOD
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 38,
                  height: 26,
                  borderRadius: 5,
                  background: "linear-gradient(135deg, #1A1F71, #2D3A8C)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    color: "#fff",
                    fontSize: 9,
                    fontWeight: 900,
                    fontStyle: "italic",
                  }}
                >
                  VISA
                </span>
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700 }}>
                  Visa Credit Card
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--muted)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  •••• •••• •••• 4242
                </div>
              </div>
              <span
                className="pill pill-emerald"
                style={{ marginLeft: "auto", fontSize: 10 }}
              >
                Charged
              </span>
            </div>
          </div>

          {/* Transaction IDs */}
          <div
            style={{ padding: "12px 20px 16px", background: "var(--surface)" }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "var(--muted)",
                letterSpacing: 1.2,
                marginBottom: 10,
              }}
            >
              TRANSACTION DETAILS
            </div>
            {[
              ["Order ID", "#2025021800552"],
              ["Payment Ref", "REF-VISA20250218-8821"],
              ["Auth Code", "AUTH-882124"],
              ["Date & Time", "18 Feb 2025 · 12:42:07 PM"],
              ["Status", "✅ Completed"],
            ].map(([k, v]) => (
              <div
                key={k}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 11,
                  marginBottom: 5,
                }}
              >
                <span style={{ color: "var(--muted)" }}>{k}</span>
                <span
                  style={{
                    fontFamily: [
                      "Order ID",
                      "Payment Ref",
                      "Auth Code",
                    ].includes(k)
                      ? "var(--font-mono)"
                      : "inherit",
                    fontSize: 10.5,
                    fontWeight: 600,
                    color: k === "Status" ? "var(--emerald)" : "var(--ink)",
                  }}
                >
                  {v}
                </span>
              </div>
            ))}
          </div>

          {/* Perforation edge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 0,
              overflow: "hidden",
              margin: "0 -1px",
            }}
          >
            {Array.from({ length: 22 }).map((_, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: 10,
                  borderRadius: "0 0 50% 50%",
                  background: "#F0EFF8",
                  borderTop: i % 2 === 0 ? "none" : "none",
                }}
              />
            ))}
          </div>

          {/* Footer note */}
          <div style={{ padding: "10px 20px 18px", textAlign: "center" }}>
            <div
              style={{ fontSize: 10, color: "var(--muted)", lineHeight: 1.7 }}
            >
              This is your official digital receipt.
              <br />
              For disputes, contact Shopee Help Centre · help.shopee.com.my
            </div>
          </div>
        </div>
      </div>
      <div className="screen-footer">
        <button className="btn btn-primary btn-full" onClick={onNext}>
          Share / Save Receipt →
        </button>
      </div>
    </div>,

    // Step 2 — Receipt close-up / detail (zoomed breakdown)
    <div className="screen" style={{ background: "#F0EFF8" }}>
      <ScreenHeader title="Receipt Details" onBack={onBack} step="3/4" />
      <div className="screen-body" style={{ padding: "0 12px 80px" }}>
        {/* Timeline of events */}
        <div
          style={{
            background: "#fff",
            borderRadius: "var(--r-xl)",
            boxShadow: "0 4px 20px rgba(91,75,245,0.08)",
            padding: "18px 20px",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "var(--muted)",
              letterSpacing: 1.2,
              marginBottom: 14,
            }}
          >
            PAYMENT TIMELINE
          </div>
          <div className="timeline">
            {[
              {
                icon: "🛒",
                label: "Order Created",
                sub: "18 Feb 2025 · 12:40:31 PM",
                done: true,
              },
              {
                icon: "💳",
                label: "Card Authorised",
                sub: "Visa •••• 4242 — Auth code: 882124",
                done: true,
              },
              {
                icon: "🔒",
                label: "3DS Verified",
                sub: "OTP confirmed via SMS",
                done: true,
              },
              {
                icon: "✅",
                label: "Payment Captured",
                sub: "RM 245.00 successfully charged",
                done: true,
              },
              {
                icon: "📧",
                label: "Receipt Emailed",
                sub: "Sent to john@email.com",
                done: true,
              },
              {
                icon: "📦",
                label: "Order Processing",
                sub: "Shopee preparing your items",
                active: true,
              },
            ].map((t, i, a) => (
              <div key={i} className="tl-item">
                <div className="tl-left">
                  <div
                    className="tl-dot"
                    style={{
                      background: t.done
                        ? "var(--emerald-light)"
                        : t.active
                          ? "var(--accent-light)"
                          : "var(--border)",
                      fontSize: 13,
                    }}
                  >
                    {t.done ? (
                      "✓"
                    ) : t.active ? (
                      <div
                        className="spinner spinner-accent"
                        style={{ width: 14, height: 14 }}
                      />
                    ) : (
                      t.icon
                    )}
                  </div>
                  {i < a.length - 1 && (
                    <div
                      className="tl-line"
                      style={{
                        background: t.done ? "var(--emerald)" : "var(--border)",
                      }}
                    />
                  )}
                </div>
                <div className="tl-content">
                  <div className="tl-title" style={{ fontSize: 12 }}>
                    {t.label}
                  </div>
                  <div className="tl-sub">{t.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Savings badge */}
        <div
          style={{
            background:
              "linear-gradient(135deg, var(--emerald) 0%, #047857 100%)",
            borderRadius: "var(--r-xl)",
            padding: "16px 20px",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div style={{ fontSize: 36 }}>🎉</div>
          <div>
            <div
              style={{
                fontSize: 11,
                opacity: 0.7,
                fontWeight: 600,
                letterSpacing: 1,
              }}
            >
              TOTAL SAVINGS
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 28,
                fontWeight: 900,
                letterSpacing: -0.5,
              }}
            >
              RM 51.28
            </div>
            <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>
              Voucher RM 50 + Coins RM 1.28
            </div>
          </div>
        </div>

        {/* Security info */}
        <div
          style={{
            background: "#fff",
            borderRadius: "var(--r-xl)",
            padding: "16px 20px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "var(--muted)",
              letterSpacing: 1.2,
              marginBottom: 12,
            }}
          >
            SECURITY & COMPLIANCE
          </div>
          {[
            {
              icon: "🔒",
              label: "256-bit SSL Encrypted",
              sub: "All data transmitted securely",
            },
            {
              icon: "🛡️",
              label: "PCI DSS Compliant",
              sub: "Card data never stored",
            },
            {
              icon: "✅",
              label: "3D Secure Verified",
              sub: "Identity confirmed via OTP",
            },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 10,
                padding: "8px 0",
                borderBottom: i < 2 ? "1px solid var(--border)" : "none",
              }}
            >
              <span style={{ fontSize: 16 }}>{s.icon}</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700 }}>{s.label}</div>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>
                  {s.sub}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="screen-footer">
        <button className="btn btn-primary btn-full" onClick={onNext}>
          Share or Save →
        </button>
      </div>
    </div>,

    // Step 3 — Share / Save options
    <div className="screen">
      <ScreenHeader title="Share Receipt" onBack={onBack} step="4/4" />
      <div className="screen-body">
        <div style={{ textAlign: "center", padding: "12px 0 16px" }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🧾</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: "var(--ink)" }}>
            Receipt Ready
          </div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
            ORDER #2025021800552 · RM 245.00
          </div>
        </div>

        <div
          style={{
            background: "var(--card)",
            borderRadius: "var(--r-xl)",
            border: "1px solid var(--border)",
            padding: "16px",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "var(--muted)",
              letterSpacing: 1.2,
              marginBottom: 12,
            }}
          >
            SHARE VIA
          </div>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
          >
            {[
              {
                icon: "📧",
                label: "Email",
                sub: "john@email.com",
                color: "#EEF2FF",
                accent: "var(--accent)",
              },
              {
                icon: "💬",
                label: "WhatsApp",
                sub: "Share to chat",
                color: "#E6F9EE",
                accent: "var(--grab)",
              },
              {
                icon: "📥",
                label: "Save PDF",
                sub: "Download to device",
                color: "#F0F9FF",
                accent: "var(--sky)",
              },
              {
                icon: "🖨️",
                label: "Print",
                sub: "Physical copy",
                color: "var(--surface)",
                accent: "var(--muted)",
              },
            ].map((opt, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px",
                  background: opt.color,
                  borderRadius: "var(--r-lg)",
                  cursor: "pointer",
                  border: "1px solid var(--border)",
                  transition: "all 0.15s",
                }}
              >
                <span style={{ fontSize: 22 }}>{opt.icon}</span>
                <div>
                  <div
                    style={{ fontSize: 12, fontWeight: 700, color: opt.accent }}
                  >
                    {opt.label}
                  </div>
                  <div style={{ fontSize: 10, color: "var(--muted)" }}>
                    {opt.sub}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            background: "var(--card)",
            borderRadius: "var(--r-xl)",
            border: "1px solid var(--border)",
            padding: "16px",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "var(--muted)",
              letterSpacing: 1.2,
              marginBottom: 12,
            }}
          >
            FIND IN APP
          </div>
          {[
            {
              icon: "📂",
              label: "Receipts folder",
              sub: "Me → Receipts & Invoices",
            },
            {
              icon: "🔔",
              label: "Push notification",
              sub: "Receipt notification sent",
            },
            { icon: "📧", label: "Email inbox", sub: "Sent to john@email.com" },
          ].map((opt, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 12,
                padding: "8px 0",
                borderBottom: i < 2 ? "1px solid var(--border)" : "none",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: 18 }}>{opt.icon}</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700 }}>{opt.label}</div>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>
                  {opt.sub}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="screen-footer">
        <button className="btn btn-primary btn-full" onClick={onBack}>
          Done
        </button>
      </div>
    </div>,
  ];

  return screens[Math.min(step, screens.length - 1)];
}

// ─── VIEW BOOKING FLOW ────────────────────────────────────────────────────────
function ViewBookingFlow({ step, onNext, onBack }) {
  const [tab, setTab] = useState("details");

  const screens = [
    // Step 0 — Booking confirmed landing / notification
    <div className="screen">
      <ScreenHeader title="My Trips" onBack={onBack} step="1/4" />
      <div className="screen-body">
        {/* Hero booking card */}
        <div
          style={{
            borderRadius: "var(--r-xl)",
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(255,56,92,0.15)",
            border: "1px solid rgba(255,56,92,0.15)",
          }}
        >
          {/* Property image placeholder */}
          <div
            style={{
              height: 140,
              background:
                "linear-gradient(160deg, #FF385C 0%, #C2185B 50%, #880E4F 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 64,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,0.15)",
              }}
            />
            <span style={{ position: "relative", zIndex: 1 }}>🏡</span>
            <div
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                background: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(8px)",
                borderRadius: "var(--r-full)",
                padding: "4px 10px",
                fontSize: 11,
                color: "#fff",
                fontWeight: 700,
              }}
            >
              ✓ Confirmed
            </div>
          </div>

          <div style={{ background: "#fff", padding: "16px" }}>
            <div
              style={{
                fontSize: 16,
                fontWeight: 900,
                color: "var(--ink)",
                letterSpacing: -0.3,
              }}
            >
              KL Studio Apartment
            </div>
            <div
              style={{
                fontSize: 12,
                color: "var(--muted)",
                marginTop: 2,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              📍 Bukit Bintang, Kuala Lumpur
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <span className="pill pill-emerald">✓ Booking Confirmed</span>
              <span
                className="pill"
                style={{
                  background: "var(--airbnb-light)",
                  color: "var(--airbnb)",
                  fontWeight: 700,
                }}
              >
                Airbnb
              </span>
            </div>
          </div>

          <div
            style={{
              background: "var(--surface)",
              padding: "12px 16px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              borderTop: "1px solid var(--border)",
            }}
          >
            {[
              {
                label: "Check-in",
                value: "20 Feb 2025",
                sub: "3:00 PM onwards",
              },
              {
                label: "Check-out",
                value: "23 Feb 2025",
                sub: "12:00 PM latest",
              },
            ].map((d) => (
              <div key={d.label}>
                <div
                  style={{
                    fontSize: 10,
                    color: "var(--muted)",
                    fontWeight: 700,
                    letterSpacing: 0.8,
                  }}
                >
                  {d.label.toUpperCase()}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 800,
                    color: "var(--ink)",
                    marginTop: 2,
                  }}
                >
                  {d.value}
                </div>
                <div style={{ fontSize: 10, color: "var(--muted)" }}>
                  {d.sub}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Booking reference */}
        <div
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--r-lg)",
            padding: "12px 16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 10,
                color: "var(--muted)",
                fontWeight: 700,
                letterSpacing: 1,
              }}
            >
              BOOKING REFERENCE
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 14,
                fontWeight: 700,
                color: "var(--ink)",
                marginTop: 2,
              }}
            >
              AIR-9821-KL
            </div>
          </div>
          <button className="btn btn-secondary btn-sm">Copy</button>
        </div>

        {/* Quick actions */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
        >
          {[
            { icon: "🗺️", label: "Get Directions" },
            { icon: "💬", label: "Message Host" },
          ].map((a) => (
            <button
              key={a.label}
              className="btn btn-secondary"
              style={{ gap: 8 }}
            >
              <span>{a.icon}</span> {a.label}
            </button>
          ))}
        </div>
      </div>
      <div className="screen-footer">
        <button
          className="btn btn-full btn-lg"
          style={{
            background: "var(--airbnb)",
            color: "#fff",
            fontWeight: 700,
          }}
          onClick={onNext}
        >
          View Full Booking Details →
        </button>
      </div>
    </div>,

    // Step 1 — Full booking details with tabs
    <div className="screen">
      <ScreenHeader title="Booking Details" onBack={onBack} step="2/4" />
      <div className="screen-body" style={{ paddingTop: 0 }}>
        {/* Tab bar */}
        <div className="tab-bar" style={{ margin: "0 0 14px" }}>
          {["details", "payment", "host"].map((t) => (
            <div
              key={t}
              className={`tab ${tab === t ? "active" : ""}`}
              onClick={() => setTab(t)}
              style={{ textTransform: "capitalize" }}
            >
              {t === "details"
                ? "📋 Details"
                : t === "payment"
                  ? "💳 Payment"
                  : "👤 Host"}
            </div>
          ))}
        </div>

        {tab === "details" && (
          <>
            {/* Property */}
            <div
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--r-xl)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "14px 16px",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 800 }}>
                  KL Studio Apartment
                </div>
                <div
                  style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}
                >
                  Bukit Bintang, Kuala Lumpur · Entire apartment
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    marginTop: 8,
                    flexWrap: "wrap",
                  }}
                >
                  {[
                    "1 bed",
                    "1 bath",
                    "2 guests",
                    "Wifi",
                    "Kitchen",
                    "A/C",
                  ].map((f) => (
                    <span
                      key={f}
                      className="pill pill-muted"
                      style={{ fontSize: 10 }}
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
              <div
                style={{
                  padding: "12px 16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {[
                  ["Check-in", "20 Feb 2025 · 3:00 PM"],
                  ["Check-out", "23 Feb 2025 · 12:00 PM"],
                  ["Duration", "3 nights"],
                  ["Guests", "2 adults"],
                  ["Booking Ref", "AIR-9821-KL"],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 12,
                    }}
                  >
                    <span style={{ color: "var(--muted)" }}>{k}</span>
                    <span
                      style={{
                        fontWeight: 600,
                        fontFamily:
                          k === "Booking Ref" ? "var(--font-mono)" : "inherit",
                        fontSize: k === "Booking Ref" ? 11 : 12,
                      }}
                    >
                      {v}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {/* Cancellation policy */}
            <div
              style={{
                background: "var(--emerald-light)",
                border: "1px solid rgba(5,150,105,0.2)",
                borderRadius: "var(--r-lg)",
                padding: "12px 14px",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--emerald)",
                  marginBottom: 4,
                }}
              >
                FREE CANCELLATION
              </div>
              <div
                style={{ fontSize: 12, color: "var(--ink)", lineHeight: 1.6 }}
              >
                Cancel before <b>18 Feb 2025 at 11:59 PM</b> for a full refund
                of RM 773. After that, the first night and service fee are
                non-refundable.
              </div>
            </div>
          </>
        )}

        {tab === "payment" && (
          <>
            <div
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--r-xl)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  background:
                    "linear-gradient(135deg, var(--airbnb) 0%, #C2185B 100%)",
                  padding: "14px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <div style={{ fontSize: 22 }}>💳</div>
                <div>
                  <div style={{ color: "#fff", fontWeight: 800 }}>
                    Payment Summary
                  </div>
                  <div
                    style={{ color: "rgba(255,255,255,0.65)", fontSize: 11 }}
                  >
                    Paid via Apple Pay
                  </div>
                </div>
              </div>
              <div
                style={{
                  padding: "14px 16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {[
                  ["RM 220 × 3 nights", "RM 660.00"],
                  ["Cleaning fee", "RM 65.00"],
                  ["Airbnb service fee", "RM 48.00"],
                  ["Total paid", "RM 773.00"],
                ].map(([k, v], i) => (
                  <div
                    key={k}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: i === 3 ? 14 : 12,
                      fontWeight: i === 3 ? 800 : 400,
                    }}
                  >
                    <span
                      style={{ color: i === 3 ? "var(--ink)" : "var(--muted)" }}
                    >
                      {k}
                    </span>
                    <span
                      style={{
                        fontWeight: i === 3 ? 900 : 600,
                        color: i === 3 ? "var(--airbnb)" : "var(--ink)",
                      }}
                    >
                      {v}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--r-lg)",
                padding: "12px 14px",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "var(--muted)",
                  letterSpacing: 1,
                  marginBottom: 8,
                }}
              >
                PAYMENT DETAILS
              </div>
              {[
                ["Method", "Apple Pay · Visa •••• 4891"],
                ["Date Charged", "18 Feb 2025 · 12:04 PM"],
                ["Auth Code", "AUTH-773-AIR"],
                ["Status", "✅ Paid in Full"],
              ].map(([k, v]) => (
                <div
                  key={k}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 12,
                    marginBottom: 6,
                  }}
                >
                  <span style={{ color: "var(--muted)" }}>{k}</span>
                  <span
                    style={{
                      fontWeight: 600,
                      color: k === "Status" ? "var(--emerald)" : "var(--ink)",
                      fontFamily:
                        k === "Auth Code" ? "var(--font-mono)" : "inherit",
                      fontSize: k === "Auth Code" ? 11 : 12,
                    }}
                  >
                    {v}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "host" && (
          <>
            <div
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--r-xl)",
                padding: "16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 14,
                  alignItems: "center",
                  marginBottom: 14,
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, var(--airbnb), #C2185B)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                    flexShrink: 0,
                  }}
                >
                  👩
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800 }}>Aisha M.</div>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>
                    Superhost · 4.97 ★ · 248 reviews
                  </div>
                  <span
                    className="pill"
                    style={{
                      background: "var(--airbnb-light)",
                      color: "var(--airbnb)",
                      fontSize: 10,
                      fontWeight: 700,
                      marginTop: 4,
                      display: "inline-flex",
                    }}
                  >
                    ⭐ Superhost
                  </span>
                </div>
              </div>
              <div
                style={{
                  borderTop: "1px solid var(--border)",
                  paddingTop: 12,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {[
                  {
                    icon: "💬",
                    label: "Message Aisha",
                    sub: "Usually responds within an hour",
                  },
                  {
                    icon: "📞",
                    label: "Contact via Airbnb",
                    sub: "Call or video call",
                  },
                ].map((a, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: 12,
                      alignItems: "center",
                      padding: "10px 0",
                      borderBottom:
                        i === 0 ? "1px solid var(--border)" : "none",
                    }}
                  >
                    <span style={{ fontSize: 20 }}>{a.icon}</span>
                    <div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: "var(--airbnb)",
                        }}
                      >
                        {a.label}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--muted)" }}>
                        {a.sub}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--r-lg)",
                padding: "14px 16px",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--muted)",
                  letterSpacing: 1,
                  marginBottom: 10,
                }}
              >
                HOST MESSAGE
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--ink)",
                  lineHeight: 1.7,
                  fontStyle: "italic",
                }}
              >
                "Welcome! The door code is 2847. Checkout is before 12 PM. Fresh
                towels are in the bathroom cabinet. Enjoy your stay in KL! 🌆"
              </div>
              <div
                style={{ fontSize: 10, color: "var(--muted)", marginTop: 6 }}
              >
                Received 18 Feb 2025
              </div>
            </div>
          </>
        )}
      </div>
      <div className="screen-footer">
        <button
          className="btn btn-full btn-lg"
          style={{
            background: "var(--airbnb)",
            color: "#fff",
            fontWeight: 700,
          }}
          onClick={onNext}
        >
          Check-In Information →
        </button>
      </div>
    </div>,

    // Step 2 — Check-in info
    <div className="screen">
      <ScreenHeader title="Check-In Info" onBack={onBack} step="3/4" />
      <div className="screen-body">
        {/* Check-in countdown */}
        <div
          style={{
            background:
              "linear-gradient(135deg, var(--airbnb) 0%, #C2185B 100%)",
            borderRadius: "var(--r-xl)",
            padding: "20px",
            color: "#fff",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: 160,
              height: 160,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.06)",
              top: -40,
              right: -40,
            }}
          />
          <div style={{ position: "relative" }}>
            <div
              style={{
                fontSize: 11,
                opacity: 0.7,
                letterSpacing: 1.5,
                fontWeight: 600,
              }}
            >
              CHECK-IN
            </div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 900,
                letterSpacing: -0.5,
                marginTop: 4,
              }}
            >
              20 Feb 2025
            </div>
            <div style={{ fontSize: 14, opacity: 0.8, marginTop: 2 }}>
              Thursday · 3:00 PM onwards
            </div>
            <div
              style={{
                marginTop: 12,
                background: "rgba(255,255,255,0.15)",
                borderRadius: "var(--r-lg)",
                padding: "8px 12px",
                display: "inline-block",
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 700 }}>
                ⏱ 2 days away
              </span>
            </div>
          </div>
        </div>

        {/* Access instructions */}
        <div
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--r-xl)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "12px 16px",
              borderBottom: "1px solid var(--border)",
              background: "var(--surface)",
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--ink)" }}>
              🔑 Property Access
            </div>
          </div>
          {[
            {
              icon: "🏢",
              label: "Building entrance",
              value: "Main lobby — press unit 12A on intercom",
            },
            {
              icon: "🔢",
              label: "Door lock code",
              value: "2847 (changes on checkout)",
            },
            {
              icon: "🅿️",
              label: "Parking",
              value: "Bay P-12, Level B1. Remote in unit.",
            },
            {
              icon: "🛗",
              label: "Elevator",
              value: "Use Tower A lift, turn right on L12",
            },
          ].map((item, i, a) => (
            <div
              key={i}
              style={{
                padding: "12px 16px",
                borderBottom:
                  i < a.length - 1 ? "1px solid var(--border)" : "none",
                display: "flex",
                gap: 12,
              }}
            >
              <span style={{ fontSize: 20, flexShrink: 0 }}>{item.icon}</span>
              <div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--muted)",
                    fontWeight: 600,
                  }}
                >
                  {item.label.toUpperCase()}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--ink)",
                    marginTop: 2,
                    lineHeight: 1.5,
                  }}
                >
                  {item.value}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Address & map */}
        <div
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--r-xl)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: 100,
              background: "linear-gradient(135deg, #1A1F71 0%, #2D3A8C 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
          >
            <span style={{ fontSize: 32 }}>🗺️</span>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>
                Open in Maps
              </div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>
                Tap to get directions
              </div>
            </div>
          </div>
          <div style={{ padding: "12px 16px" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)" }}>
              12A, Jalan Bukit Bintang
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
              55100 Kuala Lumpur, Malaysia
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <button className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                🗺 Google Maps
              </button>
              <button className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                🍎 Apple Maps
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="screen-footer">
        <button
          className="btn btn-full btn-lg"
          style={{
            background: "var(--airbnb)",
            color: "#fff",
            fontWeight: 700,
          }}
          onClick={onNext}
        >
          Manage Booking →
        </button>
      </div>
    </div>,

    // Step 3 — Manage booking options
    <div className="screen">
      <ScreenHeader title="Manage Booking" onBack={onBack} step="4/4" />
      <div className="screen-body">
        {/* Status summary */}
        <div
          style={{
            background: "var(--card)",
            border: "1.5px solid rgba(255,56,92,0.2)",
            borderRadius: "var(--r-xl)",
            padding: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <div
                style={{ fontSize: 15, fontWeight: 900, color: "var(--ink)" }}
              >
                KL Studio
              </div>
              <div
                style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}
              >
                20 – 23 Feb · 3 nights · RM 773
              </div>
            </div>
            <span className="pill pill-emerald">✓ Confirmed</span>
          </div>
          <div
            style={{
              marginTop: 10,
              height: 4,
              background: "var(--border)",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: "30%",
                height: "100%",
                background: "var(--airbnb)",
                borderRadius: 2,
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 10,
              color: "var(--muted)",
              marginTop: 4,
            }}
          >
            <span>Booked</span>
            <span>Check-in</span>
            <span>Check-out</span>
          </div>
        </div>

        {/* Actions */}
        <div
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--r-xl)",
            overflow: "hidden",
          }}
        >
          {[
            {
              icon: "🧾",
              label: "View Receipt",
              sub: "Full payment receipt & tax invoice",
              color: "var(--accent)",
            },
            {
              icon: "✏️",
              label: "Modify Dates",
              sub: "Change check-in / check-out",
              color: "var(--sky)",
            },
            {
              icon: "💬",
              label: "Contact Host",
              sub: "Message Aisha M.",
              color: "var(--teal)",
            },
            {
              icon: "📋",
              label: "House Rules",
              sub: "No smoking · No pets · Quiet after 10PM",
              color: "var(--amber)",
            },
            {
              icon: "🚫",
              label: "Cancel Booking",
              sub: "Free cancellation before 18 Feb",
              color: "var(--rose)",
            },
          ].map((a, i, arr) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "14px 16px",
                borderBottom:
                  i < arr.length - 1 ? "1px solid var(--border)" : "none",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "var(--r-md)",
                  background: `${a.color}18`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  flexShrink: 0,
                }}
              >
                {a.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color:
                      a.label === "Cancel Booking"
                        ? "var(--rose)"
                        : "var(--ink)",
                  }}
                >
                  {a.label}
                </div>
                <div
                  style={{ fontSize: 11, color: "var(--muted)", marginTop: 1 }}
                >
                  {a.sub}
                </div>
              </div>
              <span style={{ color: "var(--muted)", fontSize: 16 }}>›</span>
            </div>
          ))}
        </div>

        <div
          style={{
            background: "var(--airbnb-light)",
            border: "1px solid rgba(255,56,92,0.15)",
            borderRadius: "var(--r-lg)",
            padding: "12px 14px",
            fontSize: 12,
            color: "var(--airbnb)",
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          Need help? Airbnb Support is available 24/7
        </div>
      </div>
      <div className="screen-footer">
        <button
          className="btn btn-full btn-lg"
          style={{
            background: "var(--airbnb)",
            color: "#fff",
            fontWeight: 700,
          }}
          onClick={onBack}
        >
          Done
        </button>
      </div>
    </div>,
  ];

  return screens[Math.min(step, screens.length - 1)];
}

// ─── CRYPTO PAYMENT FLOW ─────────────────────────────────────────────────────

const COINS = [
  {
    id: "btc",
    symbol: "BTC",
    name: "Bitcoin",
    icon: "₿",
    color: "#F7931A",
    network: "Bitcoin Network",
    time: "~10 min",
    address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    rate: 0.00078,
  },
  {
    id: "eth",
    symbol: "ETH",
    name: "Ethereum",
    icon: "Ξ",
    color: "#627EEA",
    network: "Ethereum Mainnet",
    time: "~15 sec",
    address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    rate: 0.0123,
  },
  {
    id: "usdt",
    symbol: "USDT",
    name: "Tether USD",
    icon: "₮",
    color: "#26A17B",
    network: "Tron (TRC-20)",
    time: "~3 sec",
    address: "TLa2f6VPqDgRE67v1736s7bJ8Ray5wYjU7",
    rate: 245.0,
  },
  {
    id: "bnb",
    symbol: "BNB",
    name: "BNB Chain",
    icon: "⬡",
    color: "#F0B90B",
    network: "BNB Smart Chain",
    time: "~3 sec",
    address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    rate: 0.382,
  },
  {
    id: "sol",
    symbol: "SOL",
    name: "Solana",
    icon: "◎",
    color: "#9945FF",
    network: "Solana Mainnet",
    time: "~1 sec",
    address: "DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmkGs5GHH",
    rate: 2.18,
  },
];

// Mini crypto QR grid (different from DuitNow)
function CryptoQR({ color }) {
  const p = [
    1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1,
    0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0,
    1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0,
    1, 1, 0, 1, 0, 1,
  ];
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(9,1fr)",
        gap: 3,
        width: "100%",
        height: "100%",
        padding: 6,
      }}
    >
      {p.map((c, i) => (
        <div
          key={i}
          style={{
            borderRadius: 2,
            background: c ? color : "transparent",
            aspectRatio: "1",
          }}
        />
      ))}
    </div>
  );
}

function CryptoPayFlow({ step, onNext, onBack }) {
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [confs, setConfs] = useState(0);
  const ORDER_TOTAL = 245.0; // RM

  // Simulate confirmations ticking up
  useEffect(() => {
    if (step === 3) {
      setConfs(0);
      const t = setInterval(
        () =>
          setConfs((c) => {
            if (c >= 3) {
              clearInterval(t);
              return 3;
            }
            return c + 1;
          }),
        900,
      );
      return () => clearInterval(t);
    }
  }, [step]);

  const coin = selected ? COINS.find((c) => c.id === selected) : null;
  const cryptoAmt = coin
    ? (ORDER_TOTAL / (ORDER_TOTAL / coin.rate)).toFixed(
        coin.id === "usdt" ? 2 : coin.id === "btc" ? 6 : 4,
      )
    : "";

  const screens = [
    // ── Step 0: Select Cryptocurrency ───────────────────────────────────────
    <div className="screen crypto-bg">
      <div
        style={{
          padding: "16px 16px 10px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: 14,
            color: "rgba(255,255,255,0.6)",
          }}
          onClick={onBack}
        >
          ←
        </div>
        <span style={{ fontSize: 16, fontWeight: 700, color: "#fff", flex: 1 }}>
          Pay with Crypto
        </span>
        <span
          style={{
            background: "rgba(247,147,26,0.2)",
            color: "#F7931A",
            fontSize: 10,
            fontWeight: 700,
            padding: "3px 10px",
            borderRadius: 999,
          }}
        >
          BETA
        </span>
      </div>
      <div
        style={{
          padding: "0 16px 80px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
          overflowY: "auto",
        }}
      >
        {/* Order summary */}
        <div className="crypto-card" style={{ padding: "16px" }}>
          <div
            style={{
              fontSize: 10,
              color: "rgba(255,255,255,0.35)",
              letterSpacing: 1.5,
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            ORDER TOTAL
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 900,
                  color: "#fff",
                  letterSpacing: -1,
                }}
              >
                RM 245.00
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.4)",
                  marginTop: 2,
                }}
              >
                Shopee Official Store
              </div>
            </div>
            <div style={{ fontSize: 36 }}>🛒</div>
          </div>
        </div>

        {/* Coin selector */}
        <div
          style={{
            fontSize: 10,
            color: "rgba(255,255,255,0.35)",
            letterSpacing: 1.5,
            fontWeight: 700,
          }}
        >
          SELECT CRYPTOCURRENCY
        </div>
        {COINS.map((c) => {
          const isSelected = selected === c.id;
          const cls = isSelected
            ? `coin-pill selected${c.id === "eth" ? "-eth" : c.id === "usdt" ? "-usdt" : ""}`
            : "coin-pill";
          const cryptoVal = (ORDER_TOTAL / (ORDER_TOTAL / c.rate)).toFixed(
            c.id === "usdt" ? 2 : c.id === "btc" ? 6 : 4,
          );
          return (
            <div key={c.id} className={cls} onClick={() => setSelected(c.id)}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: `${c.color}22`,
                  border: `1.5px solid ${c.color}55`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  fontWeight: 900,
                  color: c.color,
                  flexShrink: 0,
                  fontFamily: "var(--font-mono)",
                }}
              >
                {c.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>
                  {c.name}
                </div>
                <div
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    fontSize: 10,
                    marginTop: 1,
                  }}
                >
                  {c.network}
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div
                  style={{
                    color: c.color,
                    fontWeight: 800,
                    fontSize: 13,
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {cryptoVal} {c.symbol}
                </div>
                <div
                  style={{
                    color: "rgba(255,255,255,0.3)",
                    fontSize: 10,
                    marginTop: 1,
                  }}
                >
                  ≈ {c.time}
                </div>
              </div>
              {isSelected && (
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: c.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: 11,
                    flexShrink: 0,
                  }}
                >
                  ✓
                </div>
              )}
            </div>
          );
        })}

        {/* Warning */}
        <div
          style={{
            background: "rgba(217,119,6,0.12)",
            border: "1px solid rgba(217,119,6,0.25)",
            borderRadius: "var(--r-lg)",
            padding: "10px 14px",
            fontSize: 11,
            color: "rgba(255,200,80,0.85)",
            lineHeight: 1.6,
          }}
        >
          ⚠️ Send the exact amount only. Crypto payments are irreversible.
          Double-check the wallet address before sending.
        </div>
      </div>
      <div
        style={{
          padding: "12px 16px 24px",
          background: "rgba(255,255,255,0.03)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <button
          className="btn btn-full btn-lg"
          style={{
            background: coin ? coin.color : "rgba(255,255,255,0.1)",
            color: coin ? "#fff" : "rgba(255,255,255,0.3)",
            fontWeight: 700,
            cursor: coin ? "pointer" : "not-allowed",
          }}
          onClick={() => coin && onNext()}
        >
          {coin
            ? `Continue with ${coin.symbol} →`
            : "Select a coin to continue"}
        </button>
      </div>
    </div>,

    // ── Step 1: Wallet address + QR ─────────────────────────────────────────
    <div className="screen crypto-bg">
      <div
        style={{
          padding: "16px 16px 10px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: 14,
            color: "rgba(255,255,255,0.6)",
          }}
          onClick={onBack}
        >
          ←
        </div>
        <span style={{ fontSize: 16, fontWeight: 700, color: "#fff", flex: 1 }}>
          Send {coin?.symbol}
        </span>
        <span
          className="pill"
          style={{
            background: `${coin?.color}22`,
            color: coin?.color,
            fontSize: 10,
            fontWeight: 700,
          }}
        >
          {coin?.network}
        </span>
      </div>
      <div
        style={{
          padding: "0 16px 80px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
          overflowY: "auto",
        }}
      >
        {/* Amount to send */}
        <div
          className="crypto-card"
          style={{ padding: "18px", textAlign: "center" }}
        >
          <div
            style={{
              fontSize: 10,
              color: "rgba(255,255,255,0.35)",
              letterSpacing: 1.5,
              fontWeight: 700,
              marginBottom: 6,
            }}
          >
            SEND EXACTLY
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 32,
              fontWeight: 900,
              color: coin?.color,
              letterSpacing: -0.5,
              lineHeight: 1,
            }}
          >
            {cryptoAmt} {coin?.symbol}
          </div>
          <div
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.4)",
              marginTop: 6,
            }}
          >
            ≈ RM 245.00 · Rate locked for 15:00
          </div>
          {/* Countdown */}
          <div
            style={{
              marginTop: 10,
              height: 3,
              background: "rgba(255,255,255,0.06)",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                background: coin?.color,
                width: "72%",
                borderRadius: 2,
                animation: "progressBar 15s linear forwards",
              }}
            />
          </div>
          <div
            style={{
              fontSize: 10,
              color: "rgba(255,255,255,0.3)",
              marginTop: 4,
            }}
          >
            ⏳ Rate expires in 10:48 — send before timer runs out
          </div>
        </div>

        {/* QR code */}
        <div
          style={{
            background: "#fff",
            borderRadius: "var(--r-xl)",
            padding: 16,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#111",
              letterSpacing: 1,
            }}
          >
            SCAN TO SEND
          </div>
          <div
            style={{
              width: 160,
              height: 160,
              position: "relative",
              borderRadius: 12,
              overflow: "hidden",
              border: `3px solid ${coin?.color}`,
            }}
          >
            <CryptoQR color={coin?.color || "#F7931A"} />
            {/* Center logo */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: "#fff",
                border: `2px solid ${coin?.color}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                fontWeight: 900,
                color: coin?.color,
                fontFamily: "var(--font-mono)",
              }}
            >
              {coin?.icon}
            </div>
          </div>
          <div style={{ fontSize: 10, color: "#888", textAlign: "center" }}>
            Scan with your crypto wallet app
            <br />
            Coinbase · Trust Wallet · MetaMask · Binance
          </div>
        </div>

        {/* Wallet address */}
        <div className="crypto-card" style={{ padding: "14px 16px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <div
              style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.35)",
                letterSpacing: 1.5,
                fontWeight: 700,
              }}
            >
              MERCHANT WALLET ADDRESS
            </div>
            <button
              style={{
                background: `${coin?.color}22`,
                color: coin?.color,
                border: "none",
                borderRadius: 6,
                padding: "3px 10px",
                fontSize: 10,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Copy
            </button>
          </div>
          <div className="wallet-addr">
            <span className="wallet-addr-highlight">
              {coin?.address?.slice(0, 6)}
            </span>
            {coin?.address?.slice(6, -6)}
            <span className="wallet-addr-highlight">
              {coin?.address?.slice(-6)}
            </span>
          </div>
        </div>

        {/* Network details */}
        <div className="crypto-card" style={{ padding: "14px 16px" }}>
          <div
            style={{
              fontSize: 10,
              color: "rgba(255,255,255,0.35)",
              letterSpacing: 1.5,
              fontWeight: 700,
              marginBottom: 10,
            }}
          >
            NETWORK DETAILS
          </div>
          {[
            ["Network", coin?.network],
            ["Est. Time", coin?.time],
            [
              "Gas / Fee",
              coin?.id === "btc"
                ? "~0.000010 BTC"
                : coin?.id === "eth"
                  ? "~$1.20 (Gwei 18)"
                  : coin?.id === "sol"
                    ? "~$0.00025"
                    : "~$0.10",
            ],
            [
              "Confirmations req.",
              coin?.id === "btc"
                ? "3 confirmations"
                : coin?.id === "eth"
                  ? "12 confirmations"
                  : "1 confirmation",
            ],
          ].map(([k, v]) => (
            <div
              key={k}
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 11,
                marginBottom: 7,
              }}
            >
              <span style={{ color: "rgba(255,255,255,0.4)" }}>{k}</span>
              <span
                style={{
                  color: "rgba(255,255,255,0.8)",
                  fontWeight: 600,
                  fontFamily: "var(--font-mono)",
                  fontSize: 10.5,
                }}
              >
                {v}
              </span>
            </div>
          ))}
        </div>

        <div
          style={{
            background: "rgba(225,29,72,0.1)",
            border: "1px solid rgba(225,29,72,0.25)",
            borderRadius: "var(--r-lg)",
            padding: "10px 14px",
            fontSize: 11,
            color: "rgba(255,120,140,0.9)",
            lineHeight: 1.7,
          }}
        >
          🚨 Only send <b style={{ color: "#fff" }}>{coin?.symbol}</b> on the{" "}
          <b style={{ color: "#fff" }}>{coin?.network}</b>. Sending the wrong
          coin or using a different network will result in permanent loss of
          funds.
        </div>
      </div>
      <div
        style={{
          padding: "12px 16px 24px",
          background: "rgba(255,255,255,0.03)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <button
          className="btn btn-full btn-lg"
          style={{ background: coin?.color, color: "#fff", fontWeight: 700 }}
          onClick={onNext}
        >
          I've Sent the Payment ✓
        </button>
      </div>
    </div>,

    // ── Step 2: Awaiting confirmation ────────────────────────────────────────
    <div className="screen crypto-bg">
      <div
        style={{
          padding: "16px 16px 10px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: 14,
            color: "rgba(255,255,255,0.6)",
          }}
          onClick={onBack}
        >
          ←
        </div>
        <span style={{ fontSize: 16, fontWeight: 700, color: "#fff", flex: 1 }}>
          Waiting for Network
        </span>
      </div>
      <div
        style={{
          padding: "0 16px 80px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
          overflowY: "auto",
        }}
      >
        {/* Animated pending */}
        <div
          className="crypto-card"
          style={{ padding: "28px 20px", textAlign: "center" }}
        >
          <div
            className="crypto-icon-float"
            style={{ fontSize: 56, marginBottom: 12 }}
          >
            {coin?.icon}
          </div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#fff",
              marginBottom: 4,
            }}
          >
            Waiting for Transaction
          </div>
          <div
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.4)",
              lineHeight: 1.6,
            }}
          >
            Your {coin?.symbol} transaction has been broadcast to the{" "}
            {coin?.network}.<br />
            Waiting for the first confirmation.
          </div>
          <div
            style={{
              marginTop: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <div className="network-dot" />
            <span
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.5)",
                fontFamily: "var(--font-mono)",
              }}
            >
              Mempool: scanning...
            </span>
          </div>
        </div>

        {/* TX hash (simulated) */}
        <div className="crypto-card" style={{ padding: "14px 16px" }}>
          <div
            style={{
              fontSize: 10,
              color: "rgba(255,255,255,0.35)",
              letterSpacing: 1.5,
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            TRANSACTION HASH (PENDING)
          </div>
          <div
            className="wallet-addr"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            0x3f2a9c81d4e7b6f1a0c5d8e2f9b4a3c7d6e1f0b9a8c7d6e5f4a3b2c1d0e9f8a7
          </div>
          <button
            style={{
              marginTop: 10,
              background: `${coin?.color}22`,
              color: coin?.color,
              border: `1px solid ${coin?.color}44`,
              borderRadius: 6,
              padding: "5px 12px",
              fontSize: 10,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            View on Block Explorer ↗
          </button>
        </div>

        {/* What happens next */}
        <div className="crypto-card" style={{ padding: "14px 16px" }}>
          <div
            style={{
              fontSize: 10,
              color: "rgba(255,255,255,0.35)",
              letterSpacing: 1.5,
              fontWeight: 700,
              marginBottom: 12,
            }}
          >
            WHAT HAPPENS NEXT
          </div>
          {[
            {
              icon: "📡",
              label: "Broadcast",
              desc: "Tx sent to network nodes",
              done: true,
            },
            {
              icon: "⛏️",
              label: "Mining / Validation",
              desc: "Validators include your tx in a block",
              active: true,
            },
            {
              icon: "✅",
              label: "1st Confirmation",
              desc: "Block found — payment detected",
              done: false,
            },
            {
              icon: "🔒",
              label: "Final Confirmation",
              desc: `${coin?.id === "btc" ? "3 / 3" : coin?.id === "eth" ? "12 / 12" : "1 / 1"} confirmations`,
              done: false,
            },
          ].map((t, i, a) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 12,
                paddingBottom: i < a.length - 1 ? 12 : 0,
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: 28,
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: t.done
                      ? "rgba(34,197,94,0.15)"
                      : t.active
                        ? "rgba(247,147,26,0.15)"
                        : "rgba(255,255,255,0.04)",
                    border: `1.5px solid ${t.done ? "#22c55e" : t.active ? coin?.color : "rgba(255,255,255,0.1)"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                  }}
                >
                  {t.done ? (
                    <span
                      style={{
                        color: "#22c55e",
                        fontWeight: 900,
                        fontSize: 12,
                      }}
                    >
                      ✓
                    </span>
                  ) : t.active ? (
                    <div
                      className="spinner"
                      style={{
                        width: 14,
                        height: 14,
                        borderColor: "rgba(255,255,255,0.1)",
                        borderTopColor: coin?.color,
                      }}
                    />
                  ) : (
                    <span style={{ fontSize: 12 }}>{t.icon}</span>
                  )}
                </div>
                {i < a.length - 1 && (
                  <div
                    style={{
                      width: 1.5,
                      flex: 1,
                      background: t.done
                        ? "rgba(34,197,94,0.3)"
                        : "rgba(255,255,255,0.06)",
                      minHeight: 12,
                    }}
                  />
                )}
              </div>
              <div style={{ paddingBottom: i < a.length - 1 ? 12 : 0 }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: t.done
                      ? "#22c55e"
                      : t.active
                        ? coin?.color
                        : "rgba(255,255,255,0.5)",
                  }}
                >
                  {t.label}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.3)",
                    marginTop: 2,
                  }}
                >
                  {t.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          padding: "12px 16px 24px",
          background: "rgba(255,255,255,0.03)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <button
          className="btn btn-full btn-lg"
          style={{
            background: `${coin?.color}22`,
            color: coin?.color,
            fontWeight: 700,
            border: `1px solid ${coin?.color}44`,
          }}
          onClick={onNext}
        >
          Simulate Confirmation →
        </button>
      </div>
    </div>,

    // ── Step 3: Network confirming (live counter) ────────────────────────────
    <div className="screen crypto-bg">
      <div
        style={{
          padding: "16px 16px 10px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span style={{ fontSize: 16, fontWeight: 700, color: "#fff", flex: 1 }}>
          Confirming on Chain
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div className="network-dot" />
          <span
            style={{
              fontSize: 10,
              color: "rgba(255,255,255,0.4)",
              fontFamily: "var(--font-mono)",
            }}
          >
            LIVE
          </span>
        </div>
      </div>
      <div
        style={{
          padding: "0 16px 80px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
          overflowY: "auto",
        }}
      >
        {/* Big confirmation counter */}
        <div
          className="crypto-card"
          style={{ padding: "24px 20px", textAlign: "center" }}
        >
          <div
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.35)",
              letterSpacing: 1.5,
              fontWeight: 700,
              marginBottom: 12,
            }}
          >
            CONFIRMATIONS
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 56,
              fontWeight: 900,
              color:
                confs >= (coin?.id === "btc" ? 3 : coin?.id === "eth" ? 3 : 1)
                  ? "#22c55e"
                  : coin?.color,
              lineHeight: 1,
              transition: "color 0.5s",
            }}
          >
            {confs} /{" "}
            {coin?.id === "btc" ? "3" : coin?.id === "eth" ? "3" : "1"}
          </div>
          <div
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.5)",
              marginTop: 8,
            }}
          >
            {confs === 0
              ? "Waiting for first block..."
              : confs < 3
                ? `Block #${1928441 + confs} found`
                : "✅ Fully confirmed!"}
          </div>
          {/* Confirmation bars */}
          <div
            style={{
              display: "flex",
              gap: 6,
              justifyContent: "center",
              marginTop: 16,
            }}
          >
            {Array.from({
              length:
                coin?.id === "usdt" || coin?.id === "bnb" || coin?.id === "sol"
                  ? 1
                  : 3,
            }).map((_, i) => (
              <div
                key={i}
                className="conf-bar-wrap"
                style={{ flex: 1, maxWidth: 60 }}
              >
                <div
                  className="conf-bar"
                  style={{
                    width: confs > i ? "100%" : "0%",
                    background: confs > i ? "#22c55e" : coin?.color,
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Block data */}
        <div className="crypto-card" style={{ padding: "14px 16px" }}>
          <div
            style={{
              fontSize: 10,
              color: "rgba(255,255,255,0.35)",
              letterSpacing: 1.5,
              fontWeight: 700,
              marginBottom: 10,
            }}
          >
            BLOCK DATA
          </div>
          {[
            ["Block Height", `#${1928441 + confs}`],
            ["Tx Hash", "0x3f2a...f8a7"],
            ["Amount", `${cryptoAmt} ${coin?.symbol}`],
            [
              "Network Fee",
              coin?.id === "btc"
                ? "0.000010 BTC"
                : coin?.id === "eth"
                  ? "$1.20"
                  : "$0.10",
            ],
            [
              "Status",
              confs >=
              (coin?.id === "sol" || coin?.id === "usdt" || coin?.id === "bnb"
                ? 1
                : 3)
                ? "✅ Confirmed"
                : "⏳ Pending",
            ],
          ].map(([k, v]) => (
            <div key={k} className="block-row">
              <span className="block-label">{k}</span>
              <span
                className="block-value"
                style={{
                  color:
                    k === "Status" && confs >= 3
                      ? "#22c55e"
                      : "rgba(255,255,255,0.75)",
                }}
              >
                {v}
              </span>
            </div>
          ))}
        </div>

        <div
          style={{
            background: "rgba(34,197,94,0.08)",
            border: "1px solid rgba(34,197,94,0.2)",
            borderRadius: "var(--r-lg)",
            padding: "10px 14px",
            fontSize: 11,
            color: "rgba(100,255,160,0.8)",
            lineHeight: 1.6,
          }}
        >
          {confs >=
          (coin?.id === "sol" || coin?.id === "usdt" || coin?.id === "bnb"
            ? 1
            : 3)
            ? "🎉 Payment fully confirmed on the blockchain. Your order is being processed!"
            : "⏳ Your payment is detected and being confirmed. Do not close this page."}
        </div>
      </div>
      <div
        style={{
          padding: "12px 16px 24px",
          background: "rgba(255,255,255,0.03)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <button
          className="btn btn-full btn-lg"
          style={{ background: "#22c55e", color: "#fff", fontWeight: 700 }}
          onClick={onNext}
        >
          {confs >=
          (coin?.id === "sol" || coin?.id === "usdt" || coin?.id === "bnb"
            ? 1
            : 3)
            ? "View Receipt →"
            : "Skip to Complete →"}
        </button>
      </div>
    </div>,

    // ── Step 4: Success ──────────────────────────────────────────────────────
    <div className="screen crypto-bg">
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          padding: "32px 20px",
          textAlign: "center",
        }}
      >
        {/* Animated success */}
        <div style={{ position: "relative", marginBottom: 8 }}>
          <div
            style={{
              width: 90,
              height: 90,
              borderRadius: "50%",
              background: "rgba(34,197,94,0.15)",
              border: "2px solid rgba(34,197,94,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
              position: "relative",
              zIndex: 2,
              animation: "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)",
            }}
          >
            ✅
          </div>
          <div
            style={{
              position: "absolute",
              inset: -10,
              borderRadius: "50%",
              border: "2px solid rgba(34,197,94,0.2)",
              animation: "pulseRing 1.8s ease-out infinite",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: -10,
              borderRadius: "50%",
              border: "2px solid rgba(34,197,94,0.15)",
              animation: "pulseRing 1.8s ease-out 0.6s infinite",
            }}
          />
        </div>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 24,
            fontWeight: 900,
            color: "#fff",
            letterSpacing: -0.5,
          }}
        >
          Payment Confirmed!
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 30,
              fontWeight: 900,
              color: coin?.color,
            }}
          >
            {cryptoAmt} {coin?.symbol}
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
            ≈ RM 245.00
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: 6,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              background: `${coin?.color}22`,
              color: coin?.color,
              fontSize: 10,
              fontWeight: 700,
              padding: "3px 10px",
              borderRadius: 999,
            }}
          >
            {coin?.symbol} on {coin?.network}
          </span>
          <span
            style={{
              background: "rgba(34,197,94,0.15)",
              color: "#22c55e",
              fontSize: 10,
              fontWeight: 700,
              padding: "3px 10px",
              borderRadius: 999,
            }}
          >
            On-chain Verified ✓
          </span>
        </div>
        <div
          style={{
            fontSize: 12,
            color: "rgba(255,255,255,0.4)",
            maxWidth: 260,
            lineHeight: 1.6,
          }}
        >
          Shopee Official Store · Order #2025021800552
          <br />
          Transaction permanently recorded on the blockchain
        </div>
        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "var(--r-lg)",
            padding: "12px 16px",
            width: "100%",
          }}
        >
          <div
            style={{
              fontSize: 10,
              color: "rgba(255,255,255,0.3)",
              marginBottom: 6,
              letterSpacing: 1.5,
              fontWeight: 700,
            }}
          >
            TX HASH
          </div>
          <div className="wallet-addr" style={{ fontSize: 9.5 }}>
            0x3f2a9c81d4e7b6f1a0c5d8e2f9b4a3c7d6e1f0b9a8c7d6e5f4a3b2c1d0e9f8a7
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, width: "100%" }}>
          <button
            style={{
              flex: 1,
              padding: "11px",
              borderRadius: "var(--r-md)",
              background: "rgba(255,255,255,0.06)",
              color: "rgba(255,255,255,0.7)",
              border: "1px solid rgba(255,255,255,0.1)",
              fontFamily: "var(--font-body)",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
            onClick={onBack}
          >
            Block Explorer ↗
          </button>
          <button
            style={{
              flex: 1,
              padding: "11px",
              borderRadius: "var(--r-md)",
              background: coin?.color,
              color: "#fff",
              border: "none",
              fontFamily: "var(--font-body)",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
            }}
            onClick={onBack}
          >
            Done
          </button>
        </div>
      </div>
    </div>,
  ];

  return screens[Math.min(step, screens.length - 1)];
}

// ─── CRYPTO RECEIPT FLOW (Post-Payment) ──────────────────────────────────────
function CryptoReceiptFlow({ step, onNext, onBack }) {
  const COIN = COINS[0]; // BTC for receipt demo

  const screens = [
    // ── Step 0: Receipt overview ─────────────────────────────────────────────
    <div className="screen crypto-bg">
      <div
        style={{
          padding: "16px 16px 10px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: 14,
            color: "rgba(255,255,255,0.6)",
          }}
          onClick={onBack}
        >
          ←
        </div>
        <span style={{ fontSize: 16, fontWeight: 700, color: "#fff", flex: 1 }}>
          Crypto Receipt
        </span>
        <span
          style={{
            background: "rgba(34,197,94,0.15)",
            color: "#22c55e",
            fontSize: 10,
            fontWeight: 700,
            padding: "3px 10px",
            borderRadius: 999,
          }}
        >
          CONFIRMED
        </span>
      </div>
      <div
        style={{
          padding: "0 16px 80px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
          overflowY: "auto",
        }}
      >
        {/* Hero receipt card */}
        <div
          style={{
            background: "linear-gradient(160deg, #0F1535 0%, #1a0d2e 100%)",
            borderRadius: "var(--r-xl)",
            border: "1px solid rgba(247,147,26,0.2)",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              background:
                "linear-gradient(90deg, rgba(247,147,26,0.15) 0%, rgba(247,147,26,0.05) 100%)",
              padding: "18px 20px",
              display: "flex",
              alignItems: "center",
              gap: 14,
              borderBottom: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: "rgba(247,147,26,0.2)",
                border: "1.5px solid rgba(247,147,26,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                fontWeight: 900,
                color: "#F7931A",
                fontFamily: "var(--font-mono)",
              }}
            >
              ₿
            </div>
            <div>
              <div style={{ color: "#fff", fontWeight: 900, fontSize: 15 }}>
                Bitcoin Payment
              </div>
              <div
                style={{
                  color: "rgba(255,255,255,0.4)",
                  fontSize: 11,
                  marginTop: 1,
                }}
              >
                Bitcoin Network · 3 Confirmations
              </div>
            </div>
            <div style={{ marginLeft: "auto", textAlign: "right" }}>
              <div
                style={{
                  background: "rgba(34,197,94,0.2)",
                  color: "#22c55e",
                  fontSize: 10,
                  fontWeight: 700,
                  padding: "4px 10px",
                  borderRadius: 999,
                }}
              >
                ✅ PAID
              </div>
            </div>
          </div>

          {/* Amounts */}
          <div
            style={{
              padding: "20px",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <div
              style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.3)",
                letterSpacing: 1.5,
                fontWeight: 700,
                marginBottom: 6,
              }}
            >
              AMOUNT PAID
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 36,
                fontWeight: 900,
                color: "#F7931A",
                letterSpacing: -0.5,
              }}
            >
              0.001906 BTC
            </div>
            <div
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.4)",
                marginTop: 4,
              }}
            >
              ≈ RM 245.00 · Rate: 1 BTC = RM 128,491
            </div>
          </div>

          {/* Details grid */}
          <div
            style={{
              padding: "14px 20px 18px",
              display: "flex",
              flexDirection: "column",
              gap: 0,
            }}
          >
            {[
              ["Order", "#2025021800552"],
              ["Merchant", "Shopee Official Store"],
              ["Date", "18 Feb 2025 · 12:42 PM"],
              ["Network Fee", "0.000010 BTC (~RM 1.28)"],
              ["Total Sent", "0.001916 BTC"],
              ["Confirmations", "3 / 3 ✅"],
            ].map(([k, v]) => (
              <div key={k} className="block-row">
                <span className="block-label">{k}</span>
                <span
                  className="block-value"
                  style={{
                    color:
                      k === "Confirmations"
                        ? "#22c55e"
                        : "rgba(255,255,255,0.7)",
                  }}
                >
                  {v}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction hash */}
        <div className="crypto-card" style={{ padding: "14px 16px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <div
              style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.35)",
                letterSpacing: 1.5,
                fontWeight: 700,
              }}
            >
              TRANSACTION HASH
            </div>
            <button
              style={{
                background: "rgba(247,147,26,0.2)",
                color: "#F7931A",
                border: "none",
                borderRadius: 6,
                padding: "3px 10px",
                fontSize: 10,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Copy
            </button>
          </div>
          <div className="wallet-addr">
            0x3f2a9c81d4e7b6f1a0c5d8e2f9b4a3c7d6e1f0b9a8c7d6e5f4a3b2c1d0e9f8a7
          </div>
        </div>

        {/* Wallet addresses */}
        <div className="crypto-card" style={{ padding: "14px 16px" }}>
          <div
            style={{
              fontSize: 10,
              color: "rgba(255,255,255,0.35)",
              letterSpacing: 1.5,
              fontWeight: 700,
              marginBottom: 10,
            }}
          >
            WALLET ADDRESSES
          </div>
          <div style={{ marginBottom: 10 }}>
            <div
              style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.3)",
                marginBottom: 4,
              }}
            >
              FROM (Your wallet)
            </div>
            <div className="wallet-addr">
              bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.3)",
                marginBottom: 4,
              }}
            >
              TO (Merchant wallet)
            </div>
            <div className="wallet-addr">
              <span className="wallet-addr-highlight">bc1qxy</span>
              2kgdygjrsqtzq2n0yrf2493p83kkfjhx0
              <span className="wallet-addr-highlight">wlh</span>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          padding: "12px 16px 24px",
          background: "rgba(255,255,255,0.03)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <button
          className="btn btn-full btn-lg"
          style={{ background: "#F7931A", color: "#fff", fontWeight: 700 }}
          onClick={onNext}
        >
          View on Block Explorer →
        </button>
      </div>
    </div>,

    // ── Step 1: Block explorer view ──────────────────────────────────────────
    <div className="screen crypto-bg">
      <div
        style={{
          padding: "16px 16px 10px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: 14,
            color: "rgba(255,255,255,0.6)",
          }}
          onClick={onBack}
        >
          ←
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>
            Block Explorer
          </div>
          <div
            style={{
              fontSize: 9,
              color: "rgba(255,255,255,0.35)",
              fontFamily: "var(--font-mono)",
            }}
          >
            blockstream.info / mempool.space
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div className="network-dot" />
          <span
            style={{
              fontSize: 9,
              color: "rgba(255,255,255,0.4)",
              fontFamily: "var(--font-mono)",
            }}
          >
            MAINNET
          </span>
        </div>
      </div>
      <div
        style={{
          padding: "0 16px 80px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
          overflowY: "auto",
        }}
      >
        {/* Explorer header */}
        <div
          style={{
            background: "rgba(247,147,26,0.08)",
            border: "1px solid rgba(247,147,26,0.2)",
            borderRadius: "var(--r-lg)",
            padding: "12px 14px",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span style={{ fontSize: 20 }}>₿</span>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#F7931A" }}>
              Transaction Detail
            </div>
            <div
              style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.35)",
                fontFamily: "var(--font-mono)",
                marginTop: 1,
              }}
            >
              0x3f2a...f8a7
            </div>
          </div>
          <span
            style={{
              marginLeft: "auto",
              background: "rgba(34,197,94,0.15)",
              color: "#22c55e",
              fontSize: 10,
              fontWeight: 700,
              padding: "3px 8px",
              borderRadius: 999,
            }}
          >
            Confirmed
          </span>
        </div>

        {/* Explorer data */}
        <div className="crypto-card" style={{ padding: "16px" }}>
          <div
            style={{
              fontSize: 10,
              color: "rgba(255,255,255,0.35)",
              letterSpacing: 1.5,
              fontWeight: 700,
              marginBottom: 12,
            }}
          >
            TRANSACTION DETAILS
          </div>
          {[
            ["Status", "✅ Confirmed"],
            ["Block", "#828,744"],
            ["Block Time", "18 Feb 2025 12:41:55 UTC"],
            ["Confirmations", "3"],
            ["Fee", "0.000010 BTC"],
            ["Fee Rate", "4.2 sat/vByte"],
            ["Size", "141 vBytes"],
            ["Input", "0.001916 BTC"],
            ["Output", "0.001906 BTC"],
          ].map(([k, v]) => (
            <div key={k} className="block-row">
              <span className="block-label">{k}</span>
              <span
                className="block-value"
                style={{
                  color:
                    k === "Status"
                      ? "#22c55e"
                      : k === "Block"
                        ? "#F7931A"
                        : "rgba(255,255,255,0.7)",
                }}
              >
                {v}
              </span>
            </div>
          ))}
        </div>

        {/* Input / Output UTXO */}
        <div className="crypto-card" style={{ padding: "16px" }}>
          <div
            style={{
              fontSize: 10,
              color: "rgba(255,255,255,0.35)",
              letterSpacing: 1.5,
              fontWeight: 700,
              marginBottom: 12,
            }}
          >
            INPUTS & OUTPUTS
          </div>
          {/* Input */}
          <div
            style={{
              background: "rgba(225,29,72,0.08)",
              border: "1px solid rgba(225,29,72,0.15)",
              borderRadius: "var(--r-md)",
              padding: "10px 12px",
              marginBottom: 8,
            }}
          >
            <div
              style={{
                fontSize: 9,
                color: "rgba(255,100,120,0.8)",
                fontWeight: 700,
                letterSpacing: 1,
                marginBottom: 4,
              }}
            >
              INPUT
            </div>
            <div className="wallet-addr" style={{ fontSize: 9 }}>
              bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq
            </div>
            <div
              style={{
                fontSize: 11,
                color: "#F7931A",
                fontWeight: 700,
                marginTop: 4,
                fontFamily: "var(--font-mono)",
              }}
            >
              0.001916 BTC
            </div>
          </div>
          {/* Output */}
          <div
            style={{
              background: "rgba(34,197,94,0.08)",
              border: "1px solid rgba(34,197,94,0.15)",
              borderRadius: "var(--r-md)",
              padding: "10px 12px",
            }}
          >
            <div
              style={{
                fontSize: 9,
                color: "rgba(100,255,160,0.8)",
                fontWeight: 700,
                letterSpacing: 1,
                marginBottom: 4,
              }}
            >
              OUTPUT (MERCHANT)
            </div>
            <div className="wallet-addr" style={{ fontSize: 9 }}>
              <span className="wallet-addr-highlight">bc1qxy</span>
              2kgdygjrsqtzq2n0yrf2493p83kkfjhx0
              <span className="wallet-addr-highlight">wlh</span>
            </div>
            <div
              style={{
                fontSize: 11,
                color: "#22c55e",
                fontWeight: 700,
                marginTop: 4,
                fontFamily: "var(--font-mono)",
              }}
            >
              0.001906 BTC
            </div>
          </div>
        </div>

        <div
          style={{
            background: "rgba(34,197,94,0.06)",
            border: "1px solid rgba(34,197,94,0.15)",
            borderRadius: "var(--r-lg)",
            padding: "10px 14px",
            fontSize: 11,
            color: "rgba(100,255,160,0.8)",
            lineHeight: 1.6,
          }}
        >
          🔗 This transaction is permanently immutable on the Bitcoin
          blockchain. It cannot be reversed, edited or deleted.
        </div>
      </div>
      <div
        style={{
          padding: "12px 16px 24px",
          background: "rgba(255,255,255,0.03)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <button
          className="btn btn-full btn-lg"
          style={{ background: "#F7931A", color: "#fff", fontWeight: 700 }}
          onClick={onNext}
        >
          Share Proof of Payment →
        </button>
      </div>
    </div>,

    // ── Step 2: Share proof of payment ──────────────────────────────────────
    <div className="screen crypto-bg">
      <div
        style={{
          padding: "16px 16px 10px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: 14,
            color: "rgba(255,255,255,0.6)",
          }}
          onClick={onBack}
        >
          ←
        </div>
        <span style={{ fontSize: 16, fontWeight: 700, color: "#fff", flex: 1 }}>
          Share Proof
        </span>
      </div>
      <div
        style={{
          padding: "0 16px 80px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
          overflowY: "auto",
        }}
      >
        {/* Proof card */}
        <div
          style={{
            background: "linear-gradient(160deg, #0F1535, #1a0d2e)",
            border: "1px solid rgba(247,147,26,0.25)",
            borderRadius: "var(--r-xl)",
            padding: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 16,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 10,
                  color: "rgba(255,255,255,0.3)",
                  letterSpacing: 1.5,
                  fontWeight: 700,
                }}
              >
                PROOF OF PAYMENT
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 22,
                  fontWeight: 900,
                  color: "#F7931A",
                  marginTop: 4,
                }}
              >
                0.001906 BTC
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.4)",
                  marginTop: 2,
                }}
              >
                ≈ RM 245.00
              </div>
            </div>
            <div style={{ fontSize: 38 }}>₿</div>
          </div>
          <div
            style={{
              height: 1,
              background: "rgba(255,255,255,0.06)",
              marginBottom: 14,
            }}
          />
          {[
            ["To", "Shopee Official Store"],
            ["Date", "18 Feb 2025 · 12:42 PM"],
            ["TxID", "0x3f2a...f8a7"],
            ["Block", "#828,744 · 3 Confirmations"],
          ].map(([k, v]) => (
            <div
              key={k}
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 11,
                marginBottom: 6,
              }}
            >
              <span style={{ color: "rgba(255,255,255,0.35)" }}>{k}</span>
              <span
                style={{
                  color: "rgba(255,255,255,0.7)",
                  fontFamily:
                    k === "TxID" || k === "Block"
                      ? "var(--font-mono)"
                      : "inherit",
                  fontSize: k === "TxID" ? "10px" : "11px",
                  fontWeight: 600,
                }}
              >
                {v}
              </span>
            </div>
          ))}
          <div
            style={{
              marginTop: 12,
              padding: "8px 12px",
              background: "rgba(34,197,94,0.1)",
              border: "1px solid rgba(34,197,94,0.2)",
              borderRadius: "var(--r-md)",
              textAlign: "center",
              fontSize: 11,
              color: "#22c55e",
              fontWeight: 700,
            }}
          >
            ✅ Cryptographically verified on Bitcoin Mainnet
          </div>
        </div>

        {/* Share options */}
        <div className="crypto-card" style={{ padding: "16px" }}>
          <div
            style={{
              fontSize: 10,
              color: "rgba(255,255,255,0.35)",
              letterSpacing: 1.5,
              fontWeight: 700,
              marginBottom: 12,
            }}
          >
            SHARE VIA
          </div>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
          >
            {[
              { icon: "📧", label: "Email", sub: "Send to merchant" },
              { icon: "💬", label: "WhatsApp", sub: "Share proof link" },
              { icon: "📋", label: "Copy Tx Hash", sub: "For manual verify" },
              { icon: "📥", label: "Save as PDF", sub: "Download receipt" },
            ].map((opt, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px",
                  background: "rgba(255,255,255,0.04)",
                  borderRadius: "var(--r-lg)",
                  cursor: "pointer",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <span style={{ fontSize: 20 }}>{opt.icon}</span>
                <div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "rgba(255,255,255,0.85)",
                    }}
                  >
                    {opt.label}
                  </div>
                  <div
                    style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}
                  >
                    {opt.sub}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "var(--r-lg)",
            padding: "12px 14px",
            fontSize: 11,
            color: "rgba(255,255,255,0.35)",
            lineHeight: 1.7,
            textAlign: "center",
          }}
        >
          Anyone with the Tx Hash can independently verify this payment on any
          Bitcoin block explorer. No trust required.
        </div>
      </div>
      <div
        style={{
          padding: "12px 16px 24px",
          background: "rgba(255,255,255,0.03)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <button
          className="btn btn-full btn-lg"
          style={{ background: "#F7931A", color: "#fff", fontWeight: 700 }}
          onClick={onBack}
        >
          Done
        </button>
      </div>
    </div>,
  ];

  return screens[Math.min(step, screens.length - 1)];
}

// ─── DUITNOW QR FLOW ─────────────────────────────────────────────────────────

// Generates a simple deterministic QR-like pixel grid (visual only)
function FakeQR() {
  const pattern = [
    1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1,
    0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0,
    1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1,
  ];
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(10, 1fr)",
        gap: "2.5px",
        width: "100%",
        height: "100%",
        padding: 4,
      }}
    >
      {pattern.map((cell, i) => (
        <div
          key={i}
          style={{
            borderRadius: 1.5,
            background: cell ? "#111" : "transparent",
            aspectRatio: "1",
          }}
        />
      ))}
    </div>
  );
}

function DuitNowQRFlow({ step, onNext, onBack }) {
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [pinVal, setPinVal] = useState("");

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanned(true);
      setTimeout(onNext, 700);
    }, 1600);
  };

  const screens = [
    // Step 0 — Scan QR
    <div className="screen">
      <div className="duitnow-header">
        <div className="duitnow-logo">🇲🇾</div>
        <div>
          <div className="duitnow-brand">DuitNow QR</div>
          <div className="duitnow-brand-sub">BANK NEGARA MALAYSIA</div>
        </div>
        <span
          className="pill"
          style={{
            marginLeft: "auto",
            background: "rgba(255,255,255,0.15)",
            color: "#fff",
            fontSize: 10,
          }}
        >
          ISO 20022
        </span>
      </div>
      <div className="screen-body" style={{ paddingTop: 16 }}>
        <div style={{ textAlign: "center", marginBottom: 4 }}>
          <div style={{ fontSize: 13, color: "var(--muted)", fontWeight: 500 }}>
            Scan merchant QR code to pay
          </div>
        </div>
        {/* QR Scanner viewport */}
        <div
          style={{
            position: "relative",
            width: 220,
            height: 220,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              width: 220,
              height: 220,
              borderRadius: 16,
              background: "#1A1A1A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {/* Camera feed simulation */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
                opacity: 0.9,
              }}
            />
            {/* Corner markers */}
            {["tl", "tr", "bl", "br"].map((c) => (
              <div key={c} className={`qr-corner ${c}`} />
            ))}
            {/* Scan line */}
            {!scanned && <div className="qr-scan-line" />}
            {/* Center box */}
            <div
              style={{
                position: "relative",
                width: 160,
                height: 160,
                background: "rgba(255,255,255,0.05)",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {scanned ? (
                <div
                  style={{
                    fontSize: 52,
                    animation: "popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)",
                  }}
                >
                  ✅
                </div>
              ) : (
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "rgba(226,35,26,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background: "rgba(226,35,26,0.4)",
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Merchant QR card */}
        <div
          style={{
            background: "var(--card)",
            borderRadius: "var(--r-xl)",
            border: "1px solid var(--border)",
            padding: "16px",
            display: "flex",
            gap: 14,
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 70,
              height: 70,
              borderRadius: "var(--r-md)",
              border: "1px solid var(--border)",
              padding: 5,
              background: "#fff",
              flexShrink: 0,
            }}
          >
            <FakeQR />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "var(--ink)" }}>
              Old Town White Coffee
            </div>
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>
              Merchant ID: OTWC-00218-KL
            </div>
            <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
              <span
                className="pill"
                style={{
                  background: "#FEF2F2",
                  color: "#E2231A",
                  fontSize: 10,
                  fontWeight: 700,
                }}
              >
                DuitNow QR
              </span>
              <span className="pill pill-emerald" style={{ fontSize: 10 }}>
                Verified ✓
              </span>
            </div>
          </div>
        </div>
        <div
          style={{
            background: "var(--surface)",
            borderRadius: "var(--r-lg)",
            padding: "10px 14px",
            fontSize: 11,
            color: "var(--muted)",
            textAlign: "center",
          }}
        >
          Works with Maybank, CIMB, RHB, Public Bank, AmBank + all
          DuitNow-enabled banks
        </div>
      </div>
      <div className="screen-footer">
        <button
          className="btn btn-full btn-lg"
          style={{ background: "#E2231A", color: "#fff", fontWeight: 700 }}
          onClick={handleScan}
          disabled={scanning}
        >
          {scanning ? (
            <>
              <div
                className="spinner"
                style={{
                  borderColor: "rgba(255,255,255,0.3)",
                  borderTopColor: "#fff",
                }}
              />{" "}
              {scanned ? "QR Detected!" : "Scanning..."}
            </>
          ) : (
            "📷 Scan QR Code"
          )}
        </button>
      </div>
    </div>,

    // Step 1 — Verify Amount
    <div className="screen">
      <ScreenHeader title="Verify Payment" onBack={onBack} step="2/4" />
      <div className="screen-body">
        {/* Merchant confirmation */}
        <div
          style={{
            background: "#FEF2F2",
            border: "1.5px solid rgba(226,35,26,0.2)",
            borderRadius: "var(--r-xl)",
            padding: "16px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: "#E2231A",
              fontWeight: 700,
              letterSpacing: 1,
              marginBottom: 8,
            }}
          >
            PAYING TO
          </div>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "var(--r-md)",
              background: "#E2231A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              margin: "0 auto 10px",
            }}
          >
            ☕
          </div>
          <div style={{ fontSize: 16, fontWeight: 800, color: "var(--ink)" }}>
            Old Town White Coffee
          </div>
          <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>
            Lot 12, Pavilion KL, Kuala Lumpur
          </div>
          <div
            style={{
              display: "flex",
              gap: 6,
              justifyContent: "center",
              marginTop: 8,
            }}
          >
            <span className="pill pill-emerald">✓ Verified Merchant</span>
            <span
              className="pill"
              style={{
                background: "#FEF2F2",
                color: "#E2231A",
                fontSize: 10,
                fontWeight: 700,
              }}
            >
              DuitNow QR
            </span>
          </div>
        </div>
        {/* Amount */}
        <div style={{ textAlign: "center", padding: "8px 0" }}>
          <div
            style={{
              fontSize: 12,
              color: "var(--muted)",
              fontWeight: 600,
              marginBottom: 4,
            }}
          >
            TOTAL AMOUNT
          </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 48,
              fontWeight: 900,
              color: "var(--ink)",
              letterSpacing: -2,
              lineHeight: 1,
            }}
          >
            RM 28.50
          </div>
          <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 6 }}>
            This amount was set by the merchant
          </div>
        </div>
        {/* Order breakdown */}
        <div className="order-card">
          <div className="order-rows">
            <div className="order-row">
              <span className="key">Nasi Lemak Set</span>
              <span className="val">RM 18.90</span>
            </div>
            <div className="order-row">
              <span className="key">Teh Tarik</span>
              <span className="val">RM 5.60</span>
            </div>
            <div className="order-row">
              <span className="key">Service Charge (6%)</span>
              <span className="val">RM 4.00</span>
            </div>
            <div className="order-divider" />
            <div className="order-row order-total">
              <span className="key">Total</span>
              <span className="val">RM 28.50</span>
            </div>
          </div>
        </div>
        {/* Pay from */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: "var(--card)",
            border: "1.5px solid var(--border)",
            borderRadius: "var(--r-lg)",
            padding: "12px 14px",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "var(--r-md)",
              background: "#FFF3E0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
            }}
          >
            🏦
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>
              Maybank Current Account
            </div>
            <div style={{ fontSize: 11, color: "var(--muted)" }}>
              •••• •••• 4782 · Balance: RM 1,240.00
            </div>
          </div>
          <span style={{ fontSize: 12, color: "var(--muted)" }}>Change ›</span>
        </div>
      </div>
      <div className="screen-footer">
        <button
          className="btn btn-full btn-lg"
          style={{ background: "#E2231A", color: "#fff" }}
          onClick={onNext}
        >
          Confirm & Authorise →
        </button>
        <button className="btn btn-ghost btn-full" onClick={onBack}>
          Cancel
        </button>
      </div>
    </div>,

    // Step 2 — Authorise (TAC / PIN)
    <div className="screen">
      <ScreenHeader title="Authorise Payment" onBack={onBack} step="3/4" />
      <div className="screen-body">
        <div style={{ textAlign: "center", padding: "12px 0 8px" }}>
          <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 2 }}>
            Authorising
          </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 36,
              fontWeight: 900,
              color: "#E2231A",
              letterSpacing: -1,
            }}
          >
            RM 28.50
          </div>
          <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>
            to Old Town White Coffee
          </div>
        </div>
        <div
          style={{
            background: "#FEF2F2",
            borderRadius: "var(--r-lg)",
            padding: "14px 16px",
            border: "1px solid rgba(226,35,26,0.15)",
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: "#E2231A",
              fontWeight: 700,
              letterSpacing: 1,
              marginBottom: 8,
            }}
          >
            TAC SENT TO YOUR PHONE
          </div>
          <div style={{ fontSize: 13, color: "var(--ink)" }}>
            A 6-digit Transaction Authorisation Code has been sent to{" "}
            <b>+60 12-•••-•987</b>
          </div>
          <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>
            Valid for 3 minutes · Do not share this code
          </div>
        </div>
        <div className="input-group">
          <label className="input-label" style={{ textAlign: "center" }}>
            Enter 6-digit TAC
          </label>
          <input
            className="input input-card"
            style={{
              textAlign: "center",
              fontSize: 26,
              letterSpacing: 14,
              fontFamily: "var(--font-mono)",
              padding: "14px",
            }}
            placeholder="— — — — — —"
            maxLength={6}
            value={pinVal}
            onChange={(e) =>
              setPinVal(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))
            }
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 12px",
            background: "var(--surface)",
            borderRadius: "var(--r-md)",
            fontSize: 11,
            color: "var(--muted)",
          }}
        >
          <span>🔒</span>
          <span>Secured by Bank Negara Malaysia · DuitNow Real-Time Rail</span>
        </div>
        <div style={{ textAlign: "center" }}>
          <button className="btn btn-ghost btn-sm" style={{ fontSize: 12 }}>
            Resend TAC (2:45)
          </button>
        </div>
      </div>
      <div className="screen-footer">
        <button
          className="btn btn-full btn-lg"
          style={{
            background:
              pinVal.length >= 6 || true ? "#E2231A" : "var(--border)",
            color: "#fff",
          }}
          onClick={onNext}
        >
          {pinVal.length < 6
            ? `Enter TAC (${pinVal.length}/6)`
            : "Confirm Payment"}
        </button>
      </div>
    </div>,

    // Step 3 — Success
    <div className="screen">
      <div className="status-screen">
        <div style={{ position: "relative", marginBottom: 8 }}>
          <div
            className="status-icon-wrap status-icon-success"
            style={{ position: "relative", zIndex: 2 }}
          >
            ✅
          </div>
          <div className="pulse-ring" />
          <div className="pulse-ring pulse-ring-2" />
        </div>
        <div className="status-title">Payment Successful!</div>
        <div className="status-amount">RM 28.50</div>
        <div
          style={{
            display: "flex",
            gap: 6,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <span
            className="pill"
            style={{ background: "#FEF2F2", color: "#E2231A", fontWeight: 700 }}
          >
            DuitNow QR
          </span>
          <span className="pill pill-emerald">Real-Time</span>
        </div>
        <div className="status-sub">
          Old Town White Coffee, Pavilion KL
          <br />
          Maybank •••• 4782 · Instant transfer
        </div>
        <div className="status-ref">TXN #DNQ2025021800441</div>

        {/* Receipt card */}
        <div
          style={{
            width: "100%",
            background: "#FEF2F2",
            border: "1px solid rgba(226,35,26,0.15)",
            borderRadius: "var(--r-lg)",
            padding: "14px 16px",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#E2231A",
              letterSpacing: 1,
              marginBottom: 10,
            }}
          >
            PAYMENT RECEIPT
          </div>
          {[
            ["Amount", "RM 28.50"],
            ["Merchant", "Old Town White Coffee"],
            ["Date & Time", "18 Feb 2025, 12:42 PM"],
            ["Payment Method", "DuitNow QR"],
            ["Bank", "Maybank"],
            ["Status", "✅ Successful"],
          ].map(([k, v]) => (
            <div
              key={k}
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 12,
                marginBottom: 6,
              }}
            >
              <span style={{ color: "var(--muted)" }}>{k}</span>
              <span
                style={{
                  fontWeight: 700,
                  color: v.startsWith("✅") ? "var(--emerald)" : "var(--ink)",
                }}
              >
                {v}
              </span>
            </div>
          ))}
        </div>
        <div
          style={{
            width: "100%",
            background: "var(--emerald-light)",
            borderRadius: "var(--r-lg)",
            padding: "10px 14px",
            fontSize: 12,
            color: "var(--emerald)",
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          📧 E-receipt sent · 💰 RM 28.50 debited instantly
        </div>
        <div style={{ display: "flex", gap: 8, width: "100%" }}>
          <button className="btn btn-secondary" style={{ flex: 1 }}>
            Share Receipt
          </button>
          <button
            className="btn btn-full"
            style={{
              flex: 1,
              background: "#E2231A",
              color: "#fff",
              fontWeight: 700,
            }}
            onClick={onBack}
          >
            Done
          </button>
        </div>
      </div>
    </div>,
  ];

  return screens[Math.min(step, screens.length - 1)];
}

// DuitNow — Insufficient Balance
function DuitNowInsufficientFlow({ step, onNext, onBack }) {
  const screens = [
    // Step 0 — Scan QR (same entry)
    <div className="screen">
      <div className="duitnow-header">
        <div className="duitnow-logo">🇲🇾</div>
        <div>
          <div className="duitnow-brand">DuitNow QR</div>
          <div className="duitnow-brand-sub">BANK NEGARA MALAYSIA</div>
        </div>
      </div>
      <div className="screen-body" style={{ paddingTop: 16 }}>
        <div
          style={{
            background: "var(--card)",
            borderRadius: "var(--r-xl)",
            border: "1px solid var(--border)",
            padding: "16px",
            display: "flex",
            gap: 14,
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 70,
              height: 70,
              borderRadius: "var(--r-md)",
              border: "1px solid var(--border)",
              padding: 5,
              background: "#fff",
              flexShrink: 0,
            }}
          >
            <FakeQR />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800 }}>
              Machines Clothing Store
            </div>
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>
              Merchant ID: MCH-00591-SS15
            </div>
            <span
              className="pill"
              style={{
                background: "#FEF2F2",
                color: "#E2231A",
                fontSize: 10,
                fontWeight: 700,
                marginTop: 6,
                display: "inline-flex",
              }}
            >
              DuitNow QR
            </span>
          </div>
        </div>
        {/* Low balance warning */}
        <div
          style={{
            background: "var(--amber-light)",
            border: "1.5px solid rgba(217,119,6,0.3)",
            borderRadius: "var(--r-lg)",
            padding: "12px 14px",
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "var(--amber)",
              marginBottom: 4,
            }}
          >
            ⚠️ LOW BALANCE DETECTED
          </div>
          <div style={{ fontSize: 12, color: "var(--ink)" }}>
            Your Maybank account balance is <b>RM 34.20</b>. The payment amount
            is <b>RM 189.90</b>.
          </div>
        </div>
        <div
          style={{
            background: "var(--card)",
            borderRadius: "var(--r-lg)",
            border: "1px solid var(--border)",
            padding: "14px 16px",
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: "var(--muted)",
              marginBottom: 8,
              fontWeight: 600,
            }}
          >
            PAYMENT DETAILS
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 14,
              fontWeight: 800,
              color: "var(--ink)",
            }}
          >
            <span>Amount</span>
            <span>RM 189.90</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 12,
              color: "var(--muted)",
              marginTop: 4,
            }}
          >
            <span>Your balance</span>
            <span style={{ color: "var(--amber)", fontWeight: 700 }}>
              RM 34.20
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 12,
              color: "var(--rose)",
              fontWeight: 700,
              marginTop: 4,
            }}
          >
            <span>Shortfall</span>
            <span>RM 155.70</span>
          </div>
        </div>
      </div>
      <div className="screen-footer">
        <button
          className="btn btn-full btn-lg"
          style={{ background: "#E2231A", color: "#fff" }}
          onClick={onNext}
        >
          Proceed Anyway
        </button>
        <button className="btn btn-ghost btn-full" onClick={onBack}>
          Cancel
        </button>
      </div>
    </div>,

    // Step 1 — Verify Amount
    <div className="screen">
      <ScreenHeader title="Verify Payment" onBack={onBack} step="2/5" />
      <div className="screen-body">
        <div style={{ textAlign: "center", padding: "12px 0" }}>
          <div
            style={{
              fontSize: 48,
              fontWeight: 900,
              color: "var(--ink)",
              letterSpacing: -2,
              lineHeight: 1,
            }}
          >
            RM 189.90
          </div>
          <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>
            to Machines Clothing Store
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: "var(--amber-light)",
            border: "1.5px solid rgba(217,119,6,0.3)",
            borderRadius: "var(--r-lg)",
            padding: "12px 14px",
          }}
        >
          <span style={{ fontSize: 22 }}>⚠️</span>
          <div>
            <div
              style={{ fontSize: 12, fontWeight: 700, color: "var(--amber)" }}
            >
              Possible Insufficient Funds
            </div>
            <div style={{ fontSize: 11, color: "var(--ink)", marginTop: 2 }}>
              Balance RM 34.20 may not cover RM 189.90
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: "var(--card)",
            border: "1.5px solid var(--border)",
            borderRadius: "var(--r-lg)",
            padding: "12px 14px",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "var(--r-md)",
              background: "#FFF3E0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
            }}
          >
            🏦
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>
              Maybank Current Account
            </div>
            <div
              style={{ fontSize: 11, color: "var(--amber)", fontWeight: 600 }}
            >
              Balance: RM 34.20 (Insufficient)
            </div>
          </div>
        </div>
      </div>
      <div className="screen-footer">
        <button
          className="btn btn-full btn-lg"
          style={{ background: "#E2231A", color: "#fff" }}
          onClick={onNext}
        >
          Submit Payment
        </button>
      </div>
    </div>,

    // Step 2 — Authorise
    <div className="screen">
      <ScreenHeader title="Authorise" onBack={onBack} step="3/5" />
      <div className="screen-body">
        <div style={{ textAlign: "center", padding: "16px 0 8px" }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "var(--amber-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 12px",
            }}
          >
            <div
              className="spinner"
              style={{
                width: 32,
                height: 32,
                borderColor: "rgba(217,119,6,0.3)",
                borderTopColor: "var(--amber)",
              }}
            />
          </div>
          <div style={{ fontSize: 16, fontWeight: 700 }}>
            Processing with bank...
          </div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
            Submitting RM 189.90 via DuitNow real-time rail
          </div>
        </div>
      </div>
      <div className="screen-footer">
        <button className="btn btn-secondary btn-full" onClick={onNext}>
          Simulate Response →
        </button>
      </div>
    </div>,

    // Step 3 — Insufficient Balance Error
    <div className="screen">
      <div className="status-screen">
        <div className="status-icon-wrap status-icon-failed">❌</div>
        <div className="status-title" style={{ color: "var(--rose)" }}>
          Payment Failed
        </div>
        <div
          className="status-amount"
          style={{
            fontSize: 24,
            color: "var(--muted)",
            textDecoration: "line-through",
          }}
        >
          RM 189.90
        </div>
        <div className="status-ref">ERR #DNQ-INSUF-20250218</div>
        {/* Error breakdown */}
        <div
          style={{
            width: "100%",
            background: "var(--rose-light)",
            border: "1.5px solid rgba(225,29,72,0.2)",
            borderRadius: "var(--r-lg)",
            padding: "14px 16px",
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: "var(--rose)",
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            ❌ REASON FOR FAILURE
          </div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "var(--ink)",
              marginBottom: 4,
            }}
          >
            Insufficient Account Balance
          </div>
          <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.6 }}>
            Your Maybank account does not have enough funds.
            <br />
            Required: <b style={{ color: "var(--ink)" }}>RM 189.90</b> ·
            Available: <b style={{ color: "var(--rose)" }}>RM 34.20</b>
          </div>
          <div
            style={{
              marginTop: 10,
              padding: "8px 10px",
              background: "var(--card)",
              borderRadius: "var(--r-md)",
              fontSize: 11,
              color: "var(--emerald)",
              fontWeight: 600,
            }}
          >
            ✓ You have NOT been charged. Your balance is unchanged.
          </div>
        </div>
        {/* Recovery options */}
        <div
          style={{
            width: "100%",
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--r-lg)",
            padding: "14px 16px",
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "var(--ink)",
              marginBottom: 10,
            }}
          >
            WHAT CAN YOU DO?
          </div>
          {[
            {
              icon: "🔄",
              title: "Try Another Account",
              sub: "Switch to CIMB, RHB or another bank",
              action: onNext,
            },
            {
              icon: "💳",
              title: "Pay with Card Instead",
              sub: "Use Visa or Mastercard",
              action: onNext,
            },
            {
              icon: "🏦",
              title: "Top Up & Retry",
              sub: "Transfer funds then try again",
              action: onNext,
            },
          ].map((opt, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 0",
                borderBottom: i < 2 ? "1px solid var(--border)" : "none",
                cursor: "pointer",
              }}
              onClick={opt.action}
            >
              <span style={{ fontSize: 18, flexShrink: 0 }}>{opt.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{opt.title}</div>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>
                  {opt.sub}
                </div>
              </div>
              <span style={{ color: "#E2231A", fontSize: 16 }}>›</span>
            </div>
          ))}
        </div>
      </div>
    </div>,

    // Step 4 — Retry with different account → Success
    <div className="screen">
      <ScreenHeader title="Switch Account" onBack={onBack} step="5/5" />
      <div className="screen-body">
        <div
          style={{
            background: "#FEF2F2",
            borderRadius: "var(--r-lg)",
            padding: "10px 14px",
            fontSize: 12,
            color: "#E2231A",
            fontWeight: 600,
            marginBottom: 4,
          }}
        >
          Retrying RM 189.90 with a different account
        </div>
        {[
          { bank: "CIMB Clicks", acc: "•••• 9201", bal: "RM 450.00", ok: true },
          {
            bank: "Maybank (Original)",
            acc: "•••• 4782",
            bal: "RM 34.20",
            ok: false,
          },
          { bank: "RHB Now", acc: "•••• 3310", bal: "RM 220.00", ok: false },
        ].map((b, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 14px",
              background: "var(--card)",
              border: `1.5px solid ${b.ok ? "#E2231A" : "var(--border)"}`,
              borderRadius: "var(--r-lg)",
              cursor: "pointer",
              marginBottom: 8,
            }}
            onClick={onNext}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "var(--r-md)",
                background: b.ok ? "#FEF2F2" : "var(--surface)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
              }}
            >
              🏦
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{b.bank}</div>
              <div
                style={{
                  fontSize: 11,
                  color: b.ok ? "var(--emerald)" : "var(--muted)",
                  fontWeight: b.ok ? 600 : 400,
                }}
              >
                {b.acc} · Balance: {b.bal} {b.ok ? "✓ Sufficient" : ""}
              </div>
            </div>
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: b.ok ? "#E2231A" : "var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 11,
              }}
            >
              {b.ok ? "✓" : ""}
            </div>
          </div>
        ))}
      </div>
      <div className="screen-footer">
        <button
          className="btn btn-full btn-lg"
          style={{ background: "#E2231A", color: "#fff" }}
          onClick={onNext}
        >
          Pay RM 189.90 via CIMB
        </button>
      </div>
    </div>,

    // Step 5 — Success after retry
    <div className="screen">
      <div className="status-screen">
        <div style={{ position: "relative", marginBottom: 8 }}>
          <div className="status-icon-wrap status-icon-success">✅</div>
          <div className="pulse-ring" />
          <div className="pulse-ring pulse-ring-2" />
        </div>
        <div className="status-title">Payment Successful!</div>
        <div className="status-amount">RM 189.90</div>
        <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
          <span
            className="pill"
            style={{ background: "#FEF2F2", color: "#E2231A", fontWeight: 700 }}
          >
            DuitNow QR
          </span>
          <span className="pill pill-sky">Retry Successful</span>
        </div>
        <div className="status-sub">
          Machines Clothing Store
          <br />
          CIMB •••• 9201 · Instant transfer
        </div>
        <div className="status-ref">TXN #DNQ2025021800502</div>
        <div
          style={{
            width: "100%",
            background: "var(--emerald-light)",
            borderRadius: "var(--r-lg)",
            padding: "10px 14px",
            fontSize: 12,
            color: "var(--emerald)",
            fontWeight: 600,
          }}
        >
          ✓ Previous failed attempt — you were never charged
        </div>
        <button
          className="btn btn-full"
          style={{ background: "#E2231A", color: "#fff", fontWeight: 700 }}
          onClick={onBack}
        >
          Done
        </button>
      </div>
    </div>,
  ];

  return screens[Math.min(step, screens.length - 1)];
}

// DuitNow — System / Timeout Error
function DuitNowErrorFlow({ step, onNext, onBack }) {
  const screens = [
    // Step 0 — Scan
    <div className="screen">
      <div className="duitnow-header">
        <div className="duitnow-logo">🇲🇾</div>
        <div>
          <div className="duitnow-brand">DuitNow QR</div>
          <div className="duitnow-brand-sub">BANK NEGARA MALAYSIA</div>
        </div>
      </div>
      <div className="screen-body" style={{ paddingTop: 16 }}>
        <div
          style={{
            background: "var(--card)",
            borderRadius: "var(--r-xl)",
            border: "1px solid var(--border)",
            padding: "16px",
            display: "flex",
            gap: 14,
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 70,
              height: 70,
              borderRadius: "var(--r-md)",
              border: "1px solid var(--border)",
              padding: 5,
              background: "#fff",
              flexShrink: 0,
            }}
          >
            <FakeQR />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800 }}>
              Watsons Malaysia
            </div>
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>
              Merchant ID: WTS-00377-MID
            </div>
            <span
              className="pill"
              style={{
                background: "#FEF2F2",
                color: "#E2231A",
                fontSize: 10,
                fontWeight: 700,
                marginTop: 6,
                display: "inline-flex",
              }}
            >
              DuitNow QR
            </span>
          </div>
        </div>
        <div
          style={{
            background: "var(--card)",
            borderRadius: "var(--r-lg)",
            border: "1px solid var(--border)",
            padding: "14px 16px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 14,
              fontWeight: 800,
            }}
          >
            <span>Amount</span>
            <span>RM 67.50</span>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: "var(--card)",
            border: "1.5px solid var(--border)",
            borderRadius: "var(--r-lg)",
            padding: "12px 14px",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "var(--r-md)",
              background: "#FFF3E0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
            }}
          >
            🏦
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>
              Public Bank Account
            </div>
            <div style={{ fontSize: 11, color: "var(--muted)" }}>
              •••• 2218 · Balance: RM 892.00
            </div>
          </div>
        </div>
      </div>
      <div className="screen-footer">
        <button
          className="btn btn-full btn-lg"
          style={{ background: "#E2231A", color: "#fff" }}
          onClick={onNext}
        >
          Confirm & Pay RM 67.50
        </button>
      </div>
    </div>,

    // Step 1 — Verify
    <div className="screen">
      <ScreenHeader title="Verify Payment" onBack={onBack} step="2/5" />
      <div className="screen-body">
        <div style={{ textAlign: "center", padding: "16px 0" }}>
          <div
            style={{
              fontSize: 46,
              fontWeight: 900,
              color: "var(--ink)",
              letterSpacing: -2,
            }}
          >
            RM 67.50
          </div>
          <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>
            to Watsons Malaysia · Verified Merchant ✓
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 12px",
            background: "var(--surface)",
            borderRadius: "var(--r-md)",
            fontSize: 11,
            color: "var(--muted)",
          }}
        >
          <span>🔒</span>
          <span>End-to-end encrypted · Bank Negara Malaysia regulated</span>
        </div>
        <div
          style={{
            background: "var(--amber-light)",
            borderRadius: "var(--r-md)",
            padding: "10px 12px",
            fontSize: 11,
            color: "var(--amber)",
            fontWeight: 600,
          }}
        >
          ⚠️ Note: Intermittent network slowness detected in your area
        </div>
      </div>
      <div className="screen-footer">
        <button
          className="btn btn-full btn-lg"
          style={{ background: "#E2231A", color: "#fff" }}
          onClick={onNext}
        >
          Submit Payment
        </button>
      </div>
    </div>,

    // Step 2 — Processing / Timeout
    <div className="screen">
      <div className="status-screen">
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "var(--amber-light)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="spinner"
            style={{
              width: 36,
              height: 36,
              borderColor: "rgba(217,119,6,0.3)",
              borderTopColor: "var(--amber)",
            }}
          />
        </div>
        <div className="status-title" style={{ fontSize: 18 }}>
          Connecting to Bank...
        </div>
        <div className="status-sub">
          Routing via DuitNow real-time rail. This usually takes under 5
          seconds.
        </div>
        <div
          style={{
            width: "100%",
            background: "var(--amber-light)",
            borderRadius: "var(--r-lg)",
            padding: "10px 14px",
            fontSize: 12,
            color: "var(--amber)",
            fontWeight: 600,
          }}
        >
          ⚠️ Taking longer than expected (15s). Please wait...
        </div>
        <div
          style={{
            width: "100%",
            height: 4,
            background: "var(--border)",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              background: "var(--amber)",
              animation: "progressBar 4s ease-in-out infinite",
              borderRadius: 2,
              width: "60%",
            }}
          />
        </div>
        <button className="btn btn-secondary btn-sm" onClick={onNext}>
          Simulate Timeout →
        </button>
      </div>
    </div>,

    // Step 3 — Timeout/Error
    <div className="screen">
      <div className="status-screen">
        <div className="status-icon-wrap status-icon-failed">⏱️</div>
        <div className="status-title" style={{ color: "var(--amber)" }}>
          Payment Timed Out
        </div>
        <div
          className="status-amount"
          style={{ fontSize: 22, color: "var(--muted)" }}
        >
          RM 67.50
        </div>
        <div className="status-ref">ERR #DNQ-TIMEOUT-20250218</div>
        <div
          style={{
            width: "100%",
            background: "var(--amber-light)",
            border: "1.5px solid rgba(217,119,6,0.3)",
            borderRadius: "var(--r-lg)",
            padding: "14px 16px",
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: "var(--amber)",
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            ⏱️ CONNECTION TIMED OUT
          </div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "var(--ink)",
              marginBottom: 4,
            }}
          >
            DuitNow gateway did not respond
          </div>
          <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.6 }}>
            The payment request expired after 30 seconds. This can happen due to
            poor connectivity or temporary bank gateway issues.
          </div>
          <div
            style={{
              marginTop: 10,
              padding: "8px 10px",
              background: "var(--card)",
              borderRadius: "var(--r-md)",
              fontSize: 11,
            }}
          >
            <div style={{ color: "var(--emerald)", fontWeight: 700 }}>
              ✓ Your account has NOT been debited.
            </div>
            <div style={{ color: "var(--muted)", marginTop: 2 }}>
              We are verifying with your bank — check your SMS for confirmation
              before retrying.
            </div>
          </div>
        </div>
        <div
          style={{
            width: "100%",
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--r-lg)",
            padding: "14px 16px",
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "var(--ink)",
              marginBottom: 10,
            }}
          >
            NEXT STEPS
          </div>
          {[
            {
              icon: "🔄",
              title: "Retry Payment",
              sub: "Try the same QR code again",
            },
            {
              icon: "📱",
              title: "Check SMS Alerts",
              sub: "Verify no deduction was made",
            },
            {
              icon: "💳",
              title: "Try Another Method",
              sub: "Use card or e-wallet instead",
            },
          ].map((opt, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 0",
                borderBottom: i < 2 ? "1px solid var(--border)" : "none",
                cursor: "pointer",
              }}
              onClick={onNext}
            >
              <span style={{ fontSize: 18 }}>{opt.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{opt.title}</div>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>
                  {opt.sub}
                </div>
              </div>
              <span style={{ color: "#E2231A" }}>›</span>
            </div>
          ))}
        </div>
      </div>
    </div>,

    // Step 4 — Retry
    <div className="screen">
      <ScreenHeader title="Retry Payment" onBack={onBack} step="5/5" />
      <div className="screen-body">
        <div
          style={{
            background: "#FEF2F2",
            borderRadius: "var(--r-lg)",
            padding: "10px 14px",
            fontSize: 12,
            color: "#E2231A",
            fontWeight: 600,
          }}
        >
          🔄 Retrying RM 67.50 to Watsons Malaysia
        </div>
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div
            style={{
              position: "relative",
              width: 80,
              height: 80,
              margin: "0 auto 12px",
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "#FEF2F2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 36,
              }}
            >
              🔳
            </div>
            <div
              style={{
                position: "absolute",
                inset: -4,
                borderRadius: "50%",
                border: "3px solid #E2231A",
                animation: "spinRing 1.5s linear infinite",
              }}
            />
          </div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>
            Reconnecting to DuitNow...
          </div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
            Clearer network signal detected
          </div>
        </div>
        <div
          style={{
            background: "var(--card)",
            borderRadius: "var(--r-lg)",
            border: "1px solid var(--border)",
            padding: "14px 16px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            <span>Retrying</span>
            <span>RM 67.50</span>
          </div>
          <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>
            Public Bank •••• 2218 · Balance RM 892.00 ✓
          </div>
        </div>
      </div>
      <div className="screen-footer">
        <button
          className="btn btn-full btn-lg"
          style={{ background: "#E2231A", color: "#fff" }}
          onClick={onNext}
        >
          Confirm Retry
        </button>
      </div>
    </div>,

    // Step 5 — Success
    <div className="screen">
      <div className="status-screen">
        <div style={{ position: "relative", marginBottom: 8 }}>
          <div className="status-icon-wrap status-icon-success">✅</div>
          <div className="pulse-ring" />
          <div className="pulse-ring pulse-ring-2" />
        </div>
        <div className="status-title">Payment Successful!</div>
        <div className="status-amount">RM 67.50</div>
        <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
          <span
            className="pill"
            style={{ background: "#FEF2F2", color: "#E2231A", fontWeight: 700 }}
          >
            DuitNow QR
          </span>
          <span className="pill pill-emerald">Retry Success</span>
        </div>
        <div className="status-sub">
          Watsons Malaysia
          <br />
          Public Bank •••• 2218 · Instant
        </div>
        <div className="status-ref">TXN #DNQ2025021800618</div>
        <div
          style={{
            width: "100%",
            background: "var(--amber-light)",
            borderRadius: "var(--r-lg)",
            padding: "10px 14px",
            fontSize: 12,
            color: "var(--amber)",
            fontWeight: 600,
          }}
        >
          ⏱️ Previous timeout attempt — confirmed not charged
        </div>
        <div
          style={{
            width: "100%",
            background: "var(--emerald-light)",
            borderRadius: "var(--r-lg)",
            padding: "10px 14px",
            fontSize: 12,
            color: "var(--emerald)",
            fontWeight: 600,
          }}
        >
          📧 Receipt sent · RM 67.50 debited from Public Bank
        </div>
        <button
          className="btn btn-full"
          style={{ background: "#E2231A", color: "#fff", fontWeight: 700 }}
          onClick={onBack}
        >
          Done
        </button>
      </div>
    </div>,
  ];

  return screens[Math.min(step, screens.length - 1)];
}

// ─── SHOPIFY CHECKOUT FLOW ────────────────────────────────────────────────────

const SHOPIFY_GREEN = "#96BF48";
const SHOPIFY_DARK = "#1A1A1A";

const VALID_CODES = {
  "10OFF": { type: "percent", value: 10, label: "10% off your order" },
  SAVE20: { type: "percent", value: 20, label: "20% off your order" },
  FREESHIP: { type: "shipping", value: 0, label: "Free shipping" },
  FLAT15: { type: "fixed", value: 15, label: "RM 15 off" },
};

const CART_ITEMS = [
  {
    id: 1,
    name: "Minimalist Tote Bag",
    variant: "Sage Green / Medium",
    price: 89.0,
    qty: 1,
    img: "👜",
  },
  {
    id: 2,
    name: "Linen Overshirt",
    variant: "Oatmeal / Size M",
    price: 128.0,
    qty: 1,
    img: "👔",
  },
  {
    id: 3,
    name: "Canvas Sneakers",
    variant: "Off-White / EU42",
    price: 169.0,
    qty: 1,
    img: "👟",
  },
];

function ShopifyCheckoutFlow({ step, onNext, onBack, voucherMode = "valid" }) {
  const [voucherInput, setVoucherInput] = useState("");
  const [voucherState, setVoucherState] = useState("idle"); // idle | validating | valid | invalid | expired | used
  const [appliedCode, setAppliedCode] = useState(null);
  const [cardInfo, setCardInfo] = useState({
    num: "",
    name: "",
    exp: "",
    cvv: "",
  });
  const [saveInfo, setSaveInfo] = useState(true);
  const [shippingMethod, setShippingMethod] = useState("standard");

  const subtotal = CART_ITEMS.reduce((s, i) => s + i.price * i.qty, 0); // 386.00
  const shipping =
    shippingMethod === "express"
      ? 18
      : appliedCode?.type === "shipping"
        ? 0
        : 8;
  const discount =
    appliedCode?.type === "percent"
      ? +((subtotal * appliedCode.value) / 100).toFixed(2)
      : appliedCode?.type === "fixed"
        ? appliedCode.value
        : appliedCode?.type === "shipping"
          ? 8
          : 0;
  const total = +(subtotal + shipping - discount).toFixed(2);

  const applyVoucher = () => {
    if (!voucherInput.trim()) return;
    setVoucherState("validating");
    setTimeout(() => {
      const code = voucherInput.trim().toUpperCase();
      if (voucherMode === "valid") {
        const found = VALID_CODES[code];
        if (found) {
          setAppliedCode({ ...found, code });
          setVoucherState("valid");
        } else {
          setVoucherState("invalid");
        }
      } else {
        // invalid mode: first attempt always fails
        setVoucherState(
          voucherInput.trim().toUpperCase() === "EXPIRED10"
            ? "expired"
            : "invalid",
        );
      }
    }, 1200);
  };

  const removeVoucher = () => {
    setAppliedCode(null);
    setVoucherState("idle");
    setVoucherInput("");
  };

  // Shared top nav
  const Nav = ({ title, rightLabel, onRight }) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "14px 16px 10px",
        borderBottom: "1px solid var(--border)",
        gap: 8,
        background: "#fff",
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          border: "1.5px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 13,
          cursor: "pointer",
          flexShrink: 0,
          color: "var(--muted)",
        }}
        onClick={onBack}
      >
        ←
      </div>
      <div style={{ flex: 1, textAlign: "center" }}>
        <div
          style={{
            fontWeight: 800,
            fontSize: 15,
            letterSpacing: -0.3,
            color: SHOPIFY_DARK,
          }}
        >
          {title}
        </div>
      </div>
      {rightLabel && (
        <button
          style={{
            fontSize: 12,
            color: SHOPIFY_GREEN,
            fontWeight: 700,
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
          onClick={onRight}
        >
          {rightLabel}
        </button>
      )}
    </div>
  );

  // Order summary mini
  const OrderSummaryMini = ({ showDiscount = false }) => (
    <div
      style={{
        background: "var(--surface)",
        borderRadius: "var(--r-lg)",
        border: "1px solid var(--border)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "10px 14px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          background: "#fff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14 }}>🛒</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: SHOPIFY_GREEN }}>
            Show order summary
          </span>
          <span style={{ fontSize: 12, color: "var(--muted)" }}>▾</span>
        </div>
        <span style={{ fontSize: 14, fontWeight: 800, color: SHOPIFY_DARK }}>
          RM {total.toFixed(2)}
        </span>
      </div>
    </div>
  );

  // Breadcrumb
  const Breadcrumb = ({ steps, current }) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "10px 16px 6px",
        flexWrap: "wrap",
      }}
    >
      {steps.map((s, i) => (
        <span key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: i === current ? 700 : 400,
              color:
                i === current
                  ? SHOPIFY_DARK
                  : i < current
                    ? SHOPIFY_GREEN
                    : "var(--muted)",
            }}
          >
            {i < current ? (
              <span style={{ color: SHOPIFY_GREEN }}>✓ </span>
            ) : (
              ""
            )}
            {s}
          </span>
          {i < steps.length - 1 && (
            <span style={{ color: "var(--border)", fontSize: 12 }}>›</span>
          )}
        </span>
      ))}
    </div>
  );

  const screens = [
    // ── Step 0: Cart ─────────────────────────────────────────────────────────
    <div className="screen" style={{ background: "#fff" }}>
      {/* Shopify header */}
      <div
        style={{
          padding: "16px 16px 10px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: SHOPIFY_GREEN,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: "#fff", fontSize: 14, fontWeight: 900 }}>
              ✦
            </span>
          </div>
          <div
            style={{
              fontWeight: 900,
              fontSize: 16,
              color: SHOPIFY_DARK,
              letterSpacing: -0.3,
            }}
          >
            Minimal Co.
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 11, color: "var(--muted)" }}>🔒 Secure</span>
        </div>
      </div>

      <div className="screen-body" style={{ paddingTop: 12 }}>
        <div
          style={{
            fontSize: 16,
            fontWeight: 800,
            color: SHOPIFY_DARK,
            marginBottom: 12,
          }}
        >
          Your Cart{" "}
          <span
            style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500 }}
          >
            (3 items)
          </span>
        </div>

        {CART_ITEMS.map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 12,
              padding: "12px 0",
              borderBottom:
                i < CART_ITEMS.length - 1 ? "1px solid var(--border)" : "none",
            }}
          >
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "var(--r-md)",
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 26,
                }}
              >
                {item.img}
              </div>
              <div
                style={{
                  position: "absolute",
                  top: -6,
                  right: -6,
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: SHOPIFY_DARK,
                  color: "#fff",
                  fontSize: 10,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {item.qty}
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{ fontSize: 13, fontWeight: 700, color: SHOPIFY_DARK }}
              >
                {item.name}
              </div>
              <div
                style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}
              >
                {item.variant}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginTop: 6,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    border: "1px solid var(--border)",
                    borderRadius: 6,
                    overflow: "hidden",
                  }}
                >
                  {["−", "1", "+"].map((b, j) => (
                    <div
                      key={j}
                      style={{
                        width: 24,
                        height: 22,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        color: SHOPIFY_DARK,
                        cursor: "pointer",
                        background: j === 1 ? "var(--surface)" : "#fff",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {b}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 800,
                color: SHOPIFY_DARK,
                flexShrink: 0,
              }}
            >
              RM {item.price.toFixed(2)}
            </div>
          </div>
        ))}

        {/* Subtotal */}
        <div
          style={{
            paddingTop: 14,
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 12,
            }}
          >
            <span style={{ color: "var(--muted)" }}>Subtotal</span>
            <span style={{ fontWeight: 600 }}>RM {subtotal.toFixed(2)}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 11,
              color: "var(--muted)",
            }}
          >
            <span>Shipping</span>
            <span>Calculated at next step</span>
          </div>
        </div>
      </div>
      <div className="screen-footer">
        <button
          className="btn btn-full btn-lg"
          style={{
            background: SHOPIFY_GREEN,
            color: "#fff",
            fontWeight: 700,
            borderRadius: 8,
          }}
          onClick={onNext}
        >
          Continue to Information →
        </button>
        <div
          style={{ textAlign: "center", fontSize: 10, color: "var(--muted)" }}
        >
          🔒 Secured by Shopify Payments · SSL
        </div>
      </div>
    </div>,

    // ── Step 1: Information ──────────────────────────────────────────────────
    <div className="screen" style={{ background: "#fff" }}>
      <Nav title="Contact" />
      <Breadcrumb
        steps={["Cart", "Information", "Shipping", "Payment"]}
        current={1}
      />
      <div className="screen-body" style={{ paddingTop: 8 }}>
        <OrderSummaryMini />

        <div style={{ marginTop: 4 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: SHOPIFY_DARK,
              marginBottom: 10,
            }}
          >
            Contact
          </div>
          <div className="input-group" style={{ marginBottom: 10 }}>
            <input
              className="input"
              placeholder="Email or mobile number"
              defaultValue="john@email.com"
              style={{ borderRadius: 8 }}
            />
          </div>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 12,
              color: "var(--muted)",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              defaultChecked
              style={{ accentColor: SHOPIFY_GREEN }}
            />
            Email me with news and offers
          </label>
        </div>

        <div
          style={{ height: 1, background: "var(--border)", margin: "12px 0" }}
        />

        <div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: SHOPIFY_DARK,
              marginBottom: 10,
            }}
          >
            Delivery address
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div className="input-row">
              <input
                className="input"
                placeholder="First name"
                defaultValue="John"
                style={{ borderRadius: 8 }}
              />
              <input
                className="input"
                placeholder="Last name"
                defaultValue="Smith"
                style={{ borderRadius: 8 }}
              />
            </div>
            <input
              className="input"
              placeholder="Address"
              defaultValue="12, Jalan Ampang"
              style={{ borderRadius: 8 }}
            />
            <input
              className="input"
              placeholder="Apartment, suite, etc. (optional)"
              style={{ borderRadius: 8 }}
            />
            <div className="input-row">
              <input
                className="input"
                placeholder="City"
                defaultValue="Kuala Lumpur"
                style={{ borderRadius: 8 }}
              />
              <input
                className="input"
                placeholder="Postcode"
                defaultValue="50450"
                style={{ borderRadius: 8 }}
              />
            </div>
            <div style={{ position: "relative" }}>
              <select
                className="input"
                style={{
                  borderRadius: 8,
                  appearance: "none",
                  paddingRight: 32,
                }}
              >
                <option>Malaysia</option>
                <option>Singapore</option>
                <option>Indonesia</option>
              </select>
              <span
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                  color: "var(--muted)",
                }}
              >
                ▾
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="screen-footer">
        <button
          className="btn btn-full btn-lg"
          style={{
            background: SHOPIFY_GREEN,
            color: "#fff",
            fontWeight: 700,
            borderRadius: 8,
          }}
          onClick={onNext}
        >
          Continue to Shipping →
        </button>
      </div>
    </div>,

    // ── Step 2: Shipping ─────────────────────────────────────────────────────
    <div className="screen" style={{ background: "#fff" }}>
      <Nav title="Shipping" />
      <Breadcrumb
        steps={["Cart", "Information", "Shipping", "Payment"]}
        current={2}
      />
      <div className="screen-body" style={{ paddingTop: 8 }}>
        <OrderSummaryMini />

        {/* Contact & address summary */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            overflow: "hidden",
            marginTop: 4,
          }}
        >
          {[
            { label: "Contact", value: "john@email.com" },
            {
              label: "Ship to",
              value: "12, Jalan Ampang, Kuala Lumpur 50450, MY",
            },
          ].map((r, i, a) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                padding: "9px 12px",
                borderBottom:
                  i < a.length - 1 ? "1px solid var(--border)" : "none",
                gap: 10,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  color: "var(--muted)",
                  width: 52,
                  flexShrink: 0,
                }}
              >
                {r.label}
              </span>
              <span style={{ fontSize: 12, color: SHOPIFY_DARK, flex: 1 }}>
                {r.value}
              </span>
              <button
                style={{
                  fontSize: 11,
                  color: SHOPIFY_GREEN,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  flexShrink: 0,
                  fontWeight: 600,
                }}
              >
                Change
              </button>
            </div>
          ))}
        </div>

        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: SHOPIFY_DARK,
            margin: "14px 0 10px",
          }}
        >
          Shipping method
        </div>
        {[
          {
            id: "standard",
            label: "Standard Shipping",
            sub: "5–7 business days",
            price: "RM 8.00",
          },
          {
            id: "express",
            label: "Express Shipping",
            sub: "1–2 business days",
            price: "RM 18.00",
          },
        ].map((m) => (
          <div
            key={m.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "13px 14px",
              border: `2px solid ${shippingMethod === m.id ? SHOPIFY_GREEN : "var(--border)"}`,
              borderRadius: 8,
              cursor: "pointer",
              marginBottom: 8,
              background: shippingMethod === m.id ? "#F6FBF0" : "#fff",
              transition: "all 0.15s",
            }}
            onClick={() => setShippingMethod(m.id)}
          >
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                border: `2px solid ${shippingMethod === m.id ? SHOPIFY_GREEN : "var(--border)"}`,
                background: shippingMethod === m.id ? SHOPIFY_GREEN : "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {shippingMethod === m.id && (
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#fff",
                  }}
                />
              )}
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{ fontSize: 13, fontWeight: 700, color: SHOPIFY_DARK }}
              >
                {m.label}
              </div>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>{m.sub}</div>
            </div>
            <div style={{ fontSize: 13, fontWeight: 800, color: SHOPIFY_DARK }}>
              {m.price}
            </div>
          </div>
        ))}
      </div>
      <div className="screen-footer">
        <button
          className="btn btn-full btn-lg"
          style={{
            background: SHOPIFY_GREEN,
            color: "#fff",
            fontWeight: 700,
            borderRadius: 8,
          }}
          onClick={onNext}
        >
          Continue to Payment →
        </button>
      </div>
    </div>,

    // ── Step 3: Payment + Voucher ─────────────────────────────────────────────
    <div className="screen" style={{ background: "#fff" }}>
      <Nav title="Payment" />
      <Breadcrumb
        steps={["Cart", "Information", "Shipping", "Payment"]}
        current={3}
      />
      <div className="screen-body" style={{ paddingTop: 8 }}>
        <OrderSummaryMini showDiscount />

        {/* ── Discount code section ── */}
        <div
          style={{
            background: "var(--surface)",
            borderRadius: 8,
            border: "1px solid var(--border)",
            padding: "14px",
            marginTop: 4,
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: SHOPIFY_DARK,
              marginBottom: 10,
            }}
          >
            Discount code
          </div>

          {/* Applied state */}
          {appliedCode ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                background: "#F6FBF0",
                border: `1.5px solid ${SHOPIFY_GREEN}`,
                borderRadius: 8,
                animation: "screenIn 0.25s ease",
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: SHOPIFY_GREEN,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  flexShrink: 0,
                }}
              >
                ✓
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 800,
                    color: SHOPIFY_GREEN,
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {appliedCode.code}
                </div>
                <div
                  style={{ fontSize: 11, color: "var(--muted)", marginTop: 1 }}
                >
                  {appliedCode.label}
                </div>
              </div>
              <button
                style={{
                  fontSize: 18,
                  color: "var(--muted)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  lineHeight: 1,
                }}
                onClick={removeVoucher}
              >
                ×
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ flex: 1, position: "relative" }}>
                <input
                  className="input"
                  placeholder="e.g. 10OFF"
                  value={voucherInput}
                  onChange={(e) => {
                    setVoucherInput(e.target.value.toUpperCase());
                    setVoucherState("idle");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && applyVoucher()}
                  style={{
                    borderRadius: 8,
                    borderColor:
                      voucherState === "invalid" ||
                      voucherState === "expired" ||
                      voucherState === "used"
                        ? "var(--rose)"
                        : voucherState === "valid"
                          ? SHOPIFY_GREEN
                          : "var(--border)",
                    fontFamily: "var(--font-mono)",
                    fontWeight: 600,
                    letterSpacing: 1,
                    paddingRight: 32,
                  }}
                />
                {voucherState === "validating" && (
                  <div
                    style={{
                      position: "absolute",
                      right: 10,
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                  >
                    <div
                      className="spinner spinner-accent"
                      style={{ width: 14, height: 14 }}
                    />
                  </div>
                )}
              </div>
              <button
                className="btn"
                style={{
                  background: SHOPIFY_GREEN,
                  color: "#fff",
                  fontWeight: 700,
                  borderRadius: 8,
                  fontSize: 13,
                  padding: "0 16px",
                  opacity: voucherState === "validating" ? 0.6 : 1,
                }}
                onClick={applyVoucher}
                disabled={voucherState === "validating"}
              >
                Apply
              </button>
            </div>
          )}

          {/* Validation messages */}
          {voucherState === "invalid" && (
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 8,
                marginTop: 8,
                padding: "10px 12px",
                background: "var(--rose-light)",
                border: "1px solid rgba(225,29,72,0.2)",
                borderRadius: 8,
                animation: "screenIn 0.25s ease",
              }}
            >
              <span style={{ fontSize: 14, flexShrink: 0 }}>❌</span>
              <div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "var(--rose)",
                  }}
                >
                  Invalid discount code
                </div>
                <div
                  style={{ fontSize: 11, color: "var(--muted)", marginTop: 1 }}
                >
                  "{voucherInput}" doesn't match any active promotion. Check for
                  typos.
                </div>
                <div
                  style={{
                    marginTop: 6,
                    display: "flex",
                    gap: 6,
                    flexWrap: "wrap",
                  }}
                >
                  <span style={{ fontSize: 10, color: "var(--muted)" }}>
                    Try:
                  </span>
                  {Object.keys(VALID_CODES).map((c) => (
                    <button
                      key={c}
                      style={{
                        fontSize: 10,
                        fontFamily: "var(--font-mono)",
                        background: "var(--surface)",
                        border: "1px solid var(--border)",
                        borderRadius: 4,
                        padding: "2px 7px",
                        cursor: "pointer",
                        color: "var(--ink)",
                        fontWeight: 600,
                      }}
                      onClick={() => {
                        setVoucherInput(c);
                        setVoucherState("idle");
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {voucherState === "expired" && (
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 8,
                marginTop: 8,
                padding: "10px 12px",
                background: "var(--amber-light)",
                border: "1px solid rgba(217,119,6,0.2)",
                borderRadius: 8,
                animation: "screenIn 0.25s ease",
              }}
            >
              <span style={{ fontSize: 14, flexShrink: 0 }}>⏰</span>
              <div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "var(--amber)",
                  }}
                >
                  This code has expired
                </div>
                <div
                  style={{ fontSize: 11, color: "var(--muted)", marginTop: 1 }}
                >
                  "{voucherInput}" was valid until 31 Jan 2025. Check our latest
                  promotions.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Card payment section ── */}
        <div style={{ marginTop: 4 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: SHOPIFY_DARK,
              marginBottom: 10,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            Payment
            <div style={{ display: "flex", gap: 4 }}>
              {["💳", "🍎", "🔵"].map((i, k) => (
                <span key={k} style={{ fontSize: 14 }}>
                  {i}
                </span>
              ))}
            </div>
          </div>

          {/* Express checkout */}
          <div style={{ marginBottom: 12 }}>
            <div
              style={{
                fontSize: 10,
                color: "var(--muted)",
                textAlign: "center",
                marginBottom: 8,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div
                style={{ flex: 1, height: 1, background: "var(--border)" }}
              />
              <span>Express checkout</span>
              <div
                style={{ flex: 1, height: 1, background: "var(--border)" }}
              />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
              }}
            >
              <button
                style={{
                  padding: "10px",
                  border: "1.5px solid var(--border)",
                  borderRadius: 8,
                  background: "#000",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                🍎 Pay
              </button>
              <button
                style={{
                  padding: "10px",
                  border: "1.5px solid var(--border)",
                  borderRadius: 8,
                  background: "#fff",
                  color: "#5F6368",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <span style={{ color: "#4285F4", fontWeight: 800 }}>G</span>Pay
              </button>
            </div>
            <div
              style={{
                fontSize: 10,
                color: "var(--muted)",
                textAlign: "center",
                margin: "10px 0 6px",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div
                style={{ flex: 1, height: 1, background: "var(--border)" }}
              />
              <span>Or pay with card</span>
              <div
                style={{ flex: 1, height: 1, background: "var(--border)" }}
              />
            </div>
          </div>

          {/* Card fields */}
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            <div style={{ position: "relative" }}>
              <input
                className="input"
                placeholder="Card number"
                style={{
                  borderRadius: 0,
                  borderWidth: "0 0 1px 0",
                  background: "#fff",
                  fontFamily: "var(--font-mono)",
                  letterSpacing: 1,
                  paddingRight: 80,
                }}
                value={cardInfo.num}
                onChange={(e) =>
                  setCardInfo((c) => ({
                    ...c,
                    num: e.target.value
                      .replace(/[^0-9]/g, "")
                      .replace(/(.{4})/g, "$1 ")
                      .trim()
                      .slice(0, 19),
                  }))
                }
              />
              <div
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  display: "flex",
                  gap: 3,
                }}
              >
                {["💳", "💳"].map((c, i) => (
                  <span key={i} style={{ fontSize: 16, opacity: 0.4 }}>
                    {c}
                  </span>
                ))}
              </div>
            </div>
            <input
              className="input"
              placeholder="Name on card"
              style={{
                borderRadius: 0,
                borderWidth: "0 0 1px 0",
                background: "#fff",
              }}
              value={cardInfo.name}
              onChange={(e) =>
                setCardInfo((c) => ({ ...c, name: e.target.value }))
              }
            />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
              <input
                className="input"
                placeholder="MM / YY"
                style={{
                  borderRadius: 0,
                  borderWidth: "0 1px 0 0",
                  background: "#fff",
                  fontFamily: "var(--font-mono)",
                }}
                value={cardInfo.exp}
                onChange={(e) =>
                  setCardInfo((c) => ({ ...c, exp: e.target.value }))
                }
              />
              <input
                className="input"
                placeholder="CVV"
                type="password"
                style={{
                  borderRadius: 0,
                  borderWidth: "none",
                  background: "#fff",
                  fontFamily: "var(--font-mono)",
                }}
                value={cardInfo.cvv}
                onChange={(e) =>
                  setCardInfo((c) => ({ ...c, cvv: e.target.value }))
                }
              />
            </div>
          </div>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 12,
              color: "var(--muted)",
              cursor: "pointer",
              marginTop: 8,
            }}
          >
            <input
              type="checkbox"
              checked={saveInfo}
              onChange={(e) => setSaveInfo(e.target.checked)}
              style={{ accentColor: SHOPIFY_GREEN }}
            />
            Save my information for a faster checkout
          </label>
        </div>

        {/* Order total */}
        <div
          style={{
            background: "var(--surface)",
            borderRadius: 8,
            border: "1px solid var(--border)",
            padding: "12px 14px",
            marginTop: 4,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 12,
              }}
            >
              <span style={{ color: "var(--muted)" }}>Subtotal</span>
              <span style={{ fontWeight: 600 }}>RM {subtotal.toFixed(2)}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 12,
              }}
            >
              <span style={{ color: "var(--muted)" }}>
                Shipping ({shippingMethod})
              </span>
              <span style={{ fontWeight: 600 }}>RM {shipping.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12,
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    color: SHOPIFY_GREEN,
                    fontWeight: 600,
                  }}
                >
                  🏷 {appliedCode?.code}
                  <button
                    style={{
                      fontSize: 10,
                      color: "var(--muted)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                    onClick={removeVoucher}
                  >
                    ✕
                  </button>
                </span>
                <span style={{ color: SHOPIFY_GREEN, fontWeight: 700 }}>
                  −RM {discount.toFixed(2)}
                </span>
              </div>
            )}
            <div style={{ height: 1, background: "var(--border)" }} />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span
                style={{ fontSize: 14, fontWeight: 800, color: SHOPIFY_DARK }}
              >
                Total
              </span>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{ fontSize: 14, fontWeight: 900, color: SHOPIFY_DARK }}
                >
                  RM {total.toFixed(2)}
                </div>
                {discount > 0 && (
                  <div
                    style={{
                      fontSize: 10,
                      color: SHOPIFY_GREEN,
                      fontWeight: 600,
                    }}
                  >
                    You save RM {discount.toFixed(2)} 🎉
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="screen-footer">
        <button
          className="btn btn-full btn-lg"
          style={{
            background: SHOPIFY_GREEN,
            color: "#fff",
            fontWeight: 700,
            borderRadius: 8,
          }}
          onClick={onNext}
        >
          Pay Now · RM {total.toFixed(2)}
        </button>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            fontSize: 10,
            color: "var(--muted)",
          }}
        >
          <span>🔒</span> All transactions are secure and encrypted · Shopify
          Payments
        </div>
      </div>
    </div>,

    // ── Step 4: Order confirmed ──────────────────────────────────────────────
    <div className="screen" style={{ background: "#fff" }}>
      <div
        style={{
          padding: "14px 16px 0",
          display: "flex",
          alignItems: "center",
          gap: 8,
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            background: SHOPIFY_GREEN,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ color: "#fff", fontSize: 14, fontWeight: 900 }}>
            ✦
          </span>
        </div>
        <div
          style={{
            fontWeight: 900,
            fontSize: 16,
            color: SHOPIFY_DARK,
            flex: 1,
          }}
        >
          Minimal Co.
        </div>
        <span style={{ fontSize: 10, color: "var(--muted)" }}>🔒 Shopify</span>
      </div>

      <div className="screen-body" style={{ paddingTop: 0 }}>
        {/* Success hero */}
        <div
          style={{
            textAlign: "center",
            padding: "24px 16px 16px",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "#F6FBF0",
              border: `2px solid ${SHOPIFY_GREEN}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
              margin: "0 auto 12px",
              animation: "popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)",
            }}
          >
            ✅
          </div>
          <div
            style={{
              fontSize: 10,
              color: SHOPIFY_GREEN,
              fontWeight: 700,
              letterSpacing: 1.5,
              marginBottom: 4,
            }}
          >
            ORDER CONFIRMED
          </div>
          <div
            style={{
              fontSize: 20,
              fontWeight: 900,
              color: SHOPIFY_DARK,
              letterSpacing: -0.5,
            }}
          >
            Thank you, John!
          </div>
          <div
            style={{
              fontSize: 12,
              color: "var(--muted)",
              marginTop: 6,
              lineHeight: 1.6,
            }}
          >
            Your order{" "}
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontWeight: 700,
                color: SHOPIFY_DARK,
              }}
            >
              #MIN-1042
            </span>{" "}
            has been placed.
            <br />A confirmation has been sent to <b>john@email.com</b>
          </div>
        </div>

        {/* Order summary */}
        <div style={{ padding: "14px 0" }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: SHOPIFY_DARK,
              marginBottom: 10,
            }}
          >
            Order summary
          </div>
          {CART_ITEMS.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 10,
              }}
            >
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 6,
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                  }}
                >
                  {item.img}
                </div>
                <div
                  style={{
                    position: "absolute",
                    top: -5,
                    right: -5,
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: SHOPIFY_DARK,
                    color: "#fff",
                    fontSize: 9,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {item.qty}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{ fontSize: 12, fontWeight: 700, color: SHOPIFY_DARK }}
                >
                  {item.name}
                </div>
                <div style={{ fontSize: 10, color: "var(--muted)" }}>
                  {item.variant}
                </div>
              </div>
              <div style={{ fontSize: 12, fontWeight: 700 }}>
                RM {item.price.toFixed(2)}
              </div>
            </div>
          ))}
          <div
            style={{ height: 1, background: "var(--border)", margin: "10px 0" }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 12,
              }}
            >
              <span style={{ color: "var(--muted)" }}>Subtotal</span>
              <span>RM {subtotal.toFixed(2)}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 12,
              }}
            >
              <span style={{ color: "var(--muted)" }}>
                Shipping ({shippingMethod})
              </span>
              <span>RM {shipping.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12,
                }}
              >
                <span style={{ color: SHOPIFY_GREEN, fontWeight: 600 }}>
                  🏷 {appliedCode?.code}
                </span>
                <span style={{ color: SHOPIFY_GREEN, fontWeight: 700 }}>
                  −RM {discount.toFixed(2)}
                </span>
              </div>
            )}
            <div style={{ height: 1, background: "var(--border)" }} />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontWeight: 800,
                fontSize: 14,
              }}
            >
              <span>Total</span>
              <div style={{ textAlign: "right" }}>
                <div>RM {total.toFixed(2)}</div>
                {discount > 0 && (
                  <div
                    style={{
                      fontSize: 10,
                      color: SHOPIFY_GREEN,
                      fontWeight: 600,
                    }}
                  >
                    Saved RM {discount.toFixed(2)} 🎉
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Shipping info */}
        <div
          style={{
            background: "var(--surface)",
            borderRadius: 8,
            border: "1px solid var(--border)",
            overflow: "hidden",
          }}
        >
          {[
            { label: "Ship to", value: "12, Jalan Ampang, KL 50450, Malaysia" },
            {
              label: "Method",
              value: `${shippingMethod === "express" ? "Express (1–2 days)" : "Standard (5–7 days)"}`,
            },
            { label: "Payment", value: "Visa •••• 4242" },
          ].map((r, i, a) => (
            <div
              key={i}
              style={{
                display: "flex",
                padding: "9px 12px",
                borderBottom:
                  i < a.length - 1 ? "1px solid var(--border)" : "none",
                gap: 10,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  color: "var(--muted)",
                  width: 56,
                  flexShrink: 0,
                }}
              >
                {r.label}
              </span>
              <span
                style={{ fontSize: 12, color: SHOPIFY_DARK, fontWeight: 500 }}
              >
                {r.value}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="screen-footer">
        <button
          className="btn btn-full btn-lg"
          style={{
            background: SHOPIFY_GREEN,
            color: "#fff",
            fontWeight: 700,
            borderRadius: 8,
          }}
          onClick={onBack}
        >
          Continue Shopping
        </button>
        <button
          className="btn btn-secondary btn-full"
          style={{ borderRadius: 8 }}
          onClick={onBack}
        >
          Track Order
        </button>
      </div>
    </div>,
  ];

  return screens[Math.min(step, screens.length - 1)];
}

// ─── SHOPIFY INVALID VOUCHER FLOW ─────────────────────────────────────────────
function ShopifyVoucherInvalidFlow({ step, onNext, onBack }) {
  // Renders the same checkout but in voucherMode="invalid"
  return (
    <ShopifyCheckoutFlow
      step={step}
      onNext={onNext}
      onBack={onBack}
      voucherMode="invalid"
    />
  );
}

// ─── SCENARIO ROW (compact, used in scrollable list) ─────────────────────────
function ScenarioRow({ s, active, onClick }) {
  const pillClass =
    s.type === "card"
      ? "pill-accent"
      : s.type === "biometric"
        ? "pill-sky"
        : s.type === "wallet"
          ? "pill-grab"
          : s.type === "points"
            ? "pill-amber"
            : s.type === "refund"
              ? "pill-teal"
              : s.type === "cancel" || s.type === "error" || s.type === "qr"
                ? "pill-rose"
                : s.type === "receipt"
                  ? "pill-accent"
                  : s.type === "crypto" || s.type === "booking"
                    ? "pill-amber"
                    : s.type === "checkout"
                      ? "pill-grab"
                      : "pill-muted";

  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "9px 16px",
        cursor: "pointer",
        background: active ? "var(--accent-light)" : "transparent",
        borderLeft: `3px solid ${active ? "var(--accent)" : "transparent"}`,
        transition: "all 0.13s",
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.background = "var(--surface)";
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.background = "transparent";
      }}
    >
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: 8,
          background: active ? "var(--accent)" : "var(--surface)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 15,
          flexShrink: 0,
          transition: "all 0.13s",
        }}
      >
        {s.icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: active ? "var(--accent)" : "var(--ink)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {s.name}
        </div>
        <div
          style={{
            fontSize: 10,
            color: "var(--muted)",
            marginTop: 1,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {s.desc}
        </div>
      </div>
      <span
        className={`pill ${pillClass}`}
        style={{ fontSize: 9, padding: "2px 7px", flexShrink: 0 }}
      >
        {s.type}
      </span>
    </div>
  );
}

// ─── KLOOK BOOKING FLOW ───────────────────────────────────────────────────────
function KlookBookingFlow({ step, onNext, onBack }) {
  const [payMethod, setPayMethod] = useState(null);
  const [noShowRefund, setNoShowRefund] = useState(false);
  const [klookCash, setKlookCash] = useState(false);
  const [cardNum, setCardNum] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const klookOrange = "#FF5722";
  const klookOrangeLight = "#FFF3EE";
  const total = noShowRefund ? 165.34 : 152.45;
  const totalStr = `RM ${total.toFixed(2)}`;

  // Step 0 — Activity Details + Contact Info
  if (step === 0)
    return (
      <div className="screen">
        <div
          className="screen-header"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div className="screen-back" onClick={onBack}>
            ←
          </div>
          <div className="screen-title">Complete booking</div>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              border: "2px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              color: "var(--muted)",
            }}
          >
            ?
          </div>
        </div>
        <div className="screen-body" style={{ gap: 0, padding: 0 }}>
          {/* Activity info */}
          <div
            style={{
              padding: "16px 16px 14px",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <div style={{ fontWeight: 800, fontSize: 14, lineHeight: 1.4 }}>
              The Peak Tram Ticket in Hong Kong
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--muted)",
                marginTop: 4,
                lineHeight: 1.5,
              }}
            >
              Round-trip Peak Tram + Sky Terrace 428 + Mei Lok Experience + Ruby
              Pass
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 6 }}>
              22 Feb 2026
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>Adult x 1</div>
            <div style={{ fontWeight: 800, fontSize: 16, marginTop: 8 }}>
              RM 152.45
            </div>
          </div>

          {/* Save with add-ons */}
          <div
            style={{
              padding: "14px 16px",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  width: 3,
                  height: 16,
                  background: klookOrange,
                  borderRadius: 2,
                }}
              />
              <span style={{ fontWeight: 800, fontSize: 14 }}>
                Save with add ons
              </span>
            </div>
            <div
              style={{
                border: "1px solid var(--border)",
                borderRadius: 10,
                padding: "12px 14px",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>
                  The Peak Tram Ticket in Hong Kong
                </div>
                <div
                  style={{ fontSize: 11, color: "var(--muted)", marginTop: 3 }}
                >
                  'Mickey Keep It Real' limited-edition tote bag
                </div>
                <div style={{ fontWeight: 700, fontSize: 13, marginTop: 6 }}>
                  RM 63.89
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 14, color: "var(--muted)" }}>›</span>
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 4,
                    border: "2px solid var(--border)",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Contact info */}
          <div
            style={{
              padding: "14px 16px 16px",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  width: 3,
                  height: 16,
                  background: klookOrange,
                  borderRadius: 2,
                }}
              />
              <div>
                <div style={{ fontWeight: 800, fontSize: 14 }}>
                  Contact info
                </div>
                <div
                  style={{ fontSize: 11, color: "var(--muted)", marginTop: 1 }}
                >
                  We'll contact you only if there's any updates to your booking
                </div>
              </div>
            </div>
            {/* Traveller profiles */}
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              {["Guest User", "Guest User"].map((name, i) => (
                <div
                  key={i}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 999,
                    border: `2px solid ${i === 0 ? klookOrange : "var(--border)"}`,
                    fontSize: 12,
                    fontWeight: 600,
                    color: i === 0 ? klookOrange : "var(--ink)",
                  }}
                >
                  {name}
                </div>
              ))}
              <div
                style={{
                  padding: "6px 14px",
                  borderRadius: 999,
                  border: "2px solid var(--border)",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--muted)",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <span style={{ color: klookOrange }}>+</span> Add
              </div>
            </div>
            {/* Contact fields */}
            <div
              style={{
                border: "1px solid var(--border)",
                borderRadius: 10,
                overflow: "hidden",
              }}
            >
              {[
                { label: "First name", val: "Guest" },
                { label: "Last name", val: "User" },
                { label: "Phone number", val: "+60 123456789" },
                {
                  label: "Email address",
                  val: "guest@example.com",
                  action: "Edit",
                },
              ].map((r, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 14px",
                    borderBottom: i < 3 ? "1px solid var(--border)" : "none",
                    fontSize: 12,
                  }}
                >
                  <span style={{ color: "var(--muted)", minWidth: 90 }}>
                    {r.label}
                  </span>
                  <span
                    style={{ fontWeight: 600, flex: 1, textAlign: "right" }}
                  >
                    {r.val}
                  </span>
                  {r.action && (
                    <span
                      style={{
                        color: klookOrange,
                        fontWeight: 700,
                        marginLeft: 10,
                        textDecoration: "underline",
                      }}
                    >
                      {r.action}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Sticky footer */}
        <div
          className="screen-footer"
          style={{ borderTop: "1px solid var(--border)", padding: "10px 16px" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <div>
              <span style={{ fontWeight: 800, fontSize: 16 }}>RM 152.45</span>
              <span
                style={{
                  fontSize: 11,
                  color: klookOrange,
                  marginLeft: 6,
                  textDecoration: "underline",
                }}
              >
                See details ∧
              </span>
            </div>
            <div style={{ fontSize: 11, color: klookOrange, fontWeight: 600 }}>
              KlookCash +4 ›
            </div>
          </div>
          <button
            className="btn btn-full btn-lg"
            style={{
              background: klookOrange,
              color: "#fff",
              borderRadius: 999,
              fontWeight: 700,
            }}
            onClick={onNext}
          >
            Go to payment
          </button>
        </div>
      </div>
    );

  // Step 1 — Upgrades + Discounts
  if (step === 1)
    return (
      <div className="screen">
        <div
          className="screen-header"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div className="screen-back" onClick={onBack}>
            ←
          </div>
          <div className="screen-title">Complete booking</div>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              border: "2px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              color: "var(--muted)",
            }}
          >
            ?
          </div>
        </div>
        <div className="screen-body" style={{ gap: 0, padding: 0 }}>
          {/* Upgrades */}
          <div
            style={{
              padding: "14px 16px",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  width: 3,
                  height: 16,
                  background: klookOrange,
                  borderRadius: 2,
                }}
              />
              <span style={{ fontWeight: 800, fontSize: 14 }}>Upgrades</span>
            </div>
            {/* Protection banner */}
            <div
              style={{
                background: "#F59E0B",
                borderRadius: 10,
                padding: "12px 14px",
                marginBottom: 12,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 13,
                  lineHeight: 1.4,
                }}
              >
                Get extra protection for your booking!
              </div>
              <div
                style={{
                  width: 40,
                  height: 40,
                  background: "rgba(255,255,255,0.2)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  flexShrink: 0,
                }}
              >
                🛡️
              </div>
            </div>
            {/* No-show Refund option */}
            <div
              style={{
                border: `2px solid ${noShowRefund ? klookOrange : "var(--border)"}`,
                borderRadius: 10,
                padding: "12px 14px",
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      marginBottom: 4,
                    }}
                  >
                    <span style={{ fontSize: 14 }}>🔄</span>
                    <span style={{ fontWeight: 700, fontSize: 13 }}>
                      No-show Refund
                    </span>
                    <span style={{ fontSize: 11, color: "var(--muted)" }}>
                      ⓘ
                    </span>
                  </div>
                  <div
                    style={{
                      display: "inline-block",
                      background: "var(--surface)",
                      borderRadius: 999,
                      padding: "2px 10px",
                      fontSize: 10,
                      fontWeight: 600,
                      color: "var(--muted)",
                      marginBottom: 6,
                    }}
                  >
                    Flexible cancellation
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--muted)",
                      lineHeight: 1.5,
                    }}
                  >
                    Get 60% back if you don't redeem your voucher - no questions
                    asked!
                  </div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 12,
                      color: klookOrange,
                      marginTop: 6,
                    }}
                  >
                    +RM 12.89
                  </div>
                </div>
                <div
                  onClick={() => setNoShowRefund(!noShowRefund)}
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 4,
                    border: `2px solid ${noShowRefund ? klookOrange : "var(--border)"}`,
                    background: noShowRefund ? klookOrange : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    flexShrink: 0,
                    marginLeft: 10,
                  }}
                >
                  {noShowRefund && (
                    <span style={{ color: "#fff", fontSize: 13 }}>✓</span>
                  )}
                </div>
              </div>
            </div>
            {/* I don't want protection */}
            <div
              style={{
                border: "1px solid var(--border)",
                borderRadius: 10,
                padding: "12px 14px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 14 }}>🛡️</span>
                <span style={{ fontWeight: 700, fontSize: 13 }}>
                  I don't want protection
                </span>
              </div>
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 4,
                  border: "2px solid var(--border)",
                }}
              />
            </div>
            {!noShowRefund && (
              <div
                style={{
                  fontSize: 11,
                  color: klookOrange,
                  fontWeight: 600,
                  marginTop: 8,
                }}
              >
                Select at least 1 option
              </div>
            )}
          </div>

          {/* Discounts */}
          <div
            style={{
              padding: "14px 16px",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  width: 3,
                  height: 16,
                  background: klookOrange,
                  borderRadius: 2,
                }}
              />
              <span style={{ fontWeight: 800, fontSize: 14 }}>Discounts</span>
            </div>
            {[
              { label: "Platform promo codes", val: "Not available" },
              { label: "Payment discounts", val: "Not available" },
            ].map((r, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 0",
                  borderBottom: "1px solid var(--border)",
                  fontSize: 13,
                }}
              >
                <span>{r.label}</span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    color: "var(--muted)",
                  }}
                >
                  <span style={{ fontSize: 12 }}>{r.val}</span>
                  <span>›</span>
                </div>
              </div>
            ))}
            {/* KlookCash toggle */}
            <div style={{ padding: "12px 0" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontWeight: 600, fontSize: 13 }}>
                    KlookCash
                  </span>
                  <span style={{ fontSize: 11, color: "var(--muted)" }}>ⓘ</span>
                </div>
                {/* Toggle */}
                <div
                  onClick={() => setKlookCash(!klookCash)}
                  style={{
                    width: 44,
                    height: 24,
                    borderRadius: 999,
                    background: klookCash ? klookOrange : "#CBD5E1",
                    cursor: "pointer",
                    position: "relative",
                    transition: "background 0.2s",
                  }}
                >
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: "#fff",
                      position: "absolute",
                      top: 2,
                      left: klookCash ? 22 : 2,
                      transition: "left 0.2s",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                    }}
                  />
                </div>
              </div>
              <div style={{ fontSize: 11, color: klookOrange, marginTop: 4 }}>
                Usable KlookCash: (=RM 2.57)
              </div>
            </div>
          </div>

          {/* Consent */}
          <div style={{ padding: "12px 16px", background: "var(--surface)" }}>
            <div
              style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.6 }}
            >
              By continuing, you acknowledge and agree to{" "}
              <span style={{ color: klookOrange, textDecoration: "underline" }}>
                Klook's General Terms of Use
              </span>{" "}
              and{" "}
              <span style={{ color: klookOrange, textDecoration: "underline" }}>
                Privacy Policy
              </span>
            </div>
          </div>
          <div
            style={{
              margin: "0 16px 12px",
              background: klookOrangeLight,
              borderRadius: 10,
              padding: "12px 14px",
              fontSize: 12,
              color: "#92400E",
              lineHeight: 1.5,
            }}
          >
            Once your info is submitted, it cannot be changed. Please
            double-check before proceeding.
          </div>
        </div>
        <div
          className="screen-footer"
          style={{ borderTop: "1px solid var(--border)", padding: "10px 16px" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <div>
              <span style={{ fontWeight: 800, fontSize: 16 }}>{totalStr}</span>
              <span
                style={{
                  fontSize: 11,
                  color: klookOrange,
                  marginLeft: 6,
                  textDecoration: "underline",
                }}
              >
                See details ∧
              </span>
            </div>
            <div style={{ fontSize: 11, color: klookOrange, fontWeight: 600 }}>
              KlookCash +4 ›
            </div>
          </div>
          <button
            className="btn btn-full btn-lg"
            style={{
              background: klookOrange,
              color: "#fff",
              borderRadius: 999,
              fontWeight: 700,
            }}
            onClick={onNext}
          >
            Go to payment
          </button>
        </div>
      </div>
    );

  // Step 2 — Payment Method
  if (step === 2)
    return (
      <div className="screen">
        <div
          className="screen-header"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div className="screen-back" onClick={onBack}>
            ←
          </div>
          <div className="screen-title">Payment method</div>
        </div>
        <div className="screen-body" style={{ gap: 0, padding: 0 }}>
          {/* Order summary */}
          <div
            style={{
              padding: "12px 16px",
              background: "var(--surface)",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <div style={{ fontSize: 12, color: "var(--muted)" }}>
              The Peak Tram Ticket in Hong Kong
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 4,
              }}
            >
              <span style={{ fontSize: 12, color: "var(--muted)" }}>
                22 Feb 2026 · Adult x 1
              </span>
              <span style={{ fontWeight: 700, fontSize: 13 }}>{totalStr}</span>
            </div>
          </div>

          <div style={{ padding: "14px 16px 8px" }}>
            <div
              style={{
                fontWeight: 700,
                fontSize: 12,
                color: "var(--muted)",
                letterSpacing: 1,
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Select Payment
            </div>

            {/* Credit Card option */}
            <div
              onClick={() => setPayMethod("card")}
              style={{
                border: `2px solid ${payMethod === "card" ? klookOrange : "var(--border)"}`,
                borderRadius: 12,
                padding: "14px",
                marginBottom: 10,
                cursor: "pointer",
                background: payMethod === "card" ? klookOrangeLight : "#fff",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    border: `2px solid ${payMethod === "card" ? klookOrange : "var(--border)"}`,
                    background:
                      payMethod === "card" ? klookOrange : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {payMethod === "card" && (
                    <span style={{ color: "#fff", fontSize: 12 }}>✓</span>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>
                    Credit / Debit Card
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--muted)",
                      marginTop: 2,
                    }}
                  >
                    Visa, Mastercard, Amex · Secured by 3DS
                  </div>
                </div>
                <span style={{ fontSize: 22 }}>💳</span>
              </div>
              {payMethod === "card" && (
                <div
                  style={{
                    marginTop: 14,
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  <input
                    className="input"
                    placeholder="Card number"
                    value={cardNum}
                    onChange={(e) => setCardNum(e.target.value)}
                    style={{ fontSize: 13 }}
                  />
                  <div style={{ display: "flex", gap: 10 }}>
                    <input
                      className="input"
                      placeholder="MM / YY"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      style={{ flex: 1, fontSize: 13 }}
                    />
                    <input
                      className="input"
                      placeholder="CVV"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      style={{ flex: 1, fontSize: 13 }}
                    />
                  </div>
                  <div
                    style={{ display: "flex", gap: 6, alignItems: "center" }}
                  >
                    <span style={{ fontSize: 12 }}>🔒</span>
                    <span style={{ fontSize: 11, color: "var(--muted)" }}>
                      Your card details are encrypted and secure
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Atome PayLater option */}
            <div
              onClick={() => setPayMethod("atome")}
              style={{
                border: `2px solid ${payMethod === "atome" ? klookOrange : "var(--border)"}`,
                borderRadius: 12,
                padding: "14px",
                cursor: "pointer",
                background: payMethod === "atome" ? klookOrangeLight : "#fff",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    border: `2px solid ${payMethod === "atome" ? klookOrange : "var(--border)"}`,
                    background:
                      payMethod === "atome" ? klookOrange : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {payMethod === "atome" && (
                    <span style={{ color: "#fff", fontSize: 12 }}>✓</span>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 14,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    Atome
                    <span
                      style={{
                        background: "#E0F2FE",
                        color: "#0284C7",
                        fontSize: 9,
                        fontWeight: 800,
                        padding: "2px 6px",
                        borderRadius: 999,
                      }}
                    >
                      PAY LATER
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--muted)",
                      marginTop: 2,
                    }}
                  >
                    Split into 3 interest-free payments
                  </div>
                </div>
                <span style={{ fontSize: 22 }}>⏰</span>
              </div>
              {payMethod === "atome" && (
                <div
                  style={{
                    marginTop: 12,
                    background: "var(--surface)",
                    borderRadius: 8,
                    padding: "12px",
                  }}
                >
                  <div
                    style={{ fontWeight: 700, fontSize: 12, marginBottom: 10 }}
                  >
                    Payment schedule
                  </div>
                  {[
                    {
                      label: "Today",
                      val: `RM ${(total / 3).toFixed(2)}`,
                      highlight: true,
                    },
                    {
                      label: "In 30 days",
                      val: `RM ${(total / 3).toFixed(2)}`,
                    },
                    {
                      label: "In 60 days",
                      val: `RM ${(total / 3).toFixed(2)}`,
                    },
                  ].map((r, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "6px 0",
                        borderBottom:
                          i < 2 ? "1px solid var(--border)" : "none",
                        fontSize: 12,
                      }}
                    >
                      <span
                        style={{
                          color: r.highlight ? "var(--ink)" : "var(--muted)",
                          fontWeight: r.highlight ? 700 : 400,
                        }}
                      >
                        {r.label}
                      </span>
                      <span
                        style={{
                          fontWeight: 700,
                          color: r.highlight ? klookOrange : "var(--ink)",
                        }}
                      >
                        {r.val}
                      </span>
                    </div>
                  ))}
                  <div
                    style={{
                      fontSize: 10,
                      color: "var(--muted)",
                      marginTop: 8,
                    }}
                  >
                    0% interest · No hidden fees · Powered by Atome
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div
          className="screen-footer"
          style={{ borderTop: "1px solid var(--border)", padding: "10px 16px" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <span style={{ fontWeight: 800, fontSize: 16 }}>{totalStr}</span>
            <div style={{ fontSize: 11, color: klookOrange, fontWeight: 600 }}>
              KlookCash +4 ›
            </div>
          </div>
          <button
            className="btn btn-full btn-lg"
            style={{
              background: payMethod ? klookOrange : "var(--border)",
              color: payMethod ? "#fff" : "var(--muted)",
              borderRadius: 999,
              fontWeight: 700,
            }}
            onClick={() => {
              if (payMethod) onNext();
            }}
          >
            {payMethod === "atome"
              ? "Pay RM " + (total / 3).toFixed(2) + " now with Atome"
              : "Pay Now"}
          </button>
        </div>
      </div>
    );

  // Step 3 — Processing
  if (step === 3)
    return (
      <div className="screen">
        <div
          className="screen-body"
          style={{
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: klookOrangeLight,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              margin: "32px auto 0",
            }}
          >
            {payMethod === "atome" ? "⏰" : "💳"}
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16 }}>
              Processing Payment
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
              {payMethod === "atome"
                ? "Authorising with Atome..."
                : "Verifying your card..."}
            </div>
          </div>
          <div
            style={{
              background: "#fff",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: "16px",
              width: "100%",
              textAlign: "left",
            }}
          >
            {[
              { label: "Activity", val: "Peak Tram HK" },
              { label: "Date", val: "22 Feb 2026" },
              { label: "Amount", val: totalStr, bold: true },
              {
                label: "Method",
                val: payMethod === "atome" ? "Atome (3×)" : "Credit Card",
              },
            ].map((r, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "6px 0",
                  borderBottom: i < 3 ? "1px solid var(--border)" : "none",
                  fontSize: 13,
                }}
              >
                <span style={{ color: "var(--muted)" }}>{r.label}</span>
                <span
                  style={{
                    fontWeight: r.bold ? 800 : 600,
                    color: r.bold ? klookOrange : "var(--ink)",
                  }}
                >
                  {r.val}
                </span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, width: "100%" }}>
            <div
              style={{
                flex: 1,
                padding: "8px",
                background: klookOrangeLight,
                borderRadius: 8,
                fontSize: 11,
                color: klookOrange,
                fontWeight: 600,
                textAlign: "center",
              }}
            >
              ⏳ Processing...
            </div>
            <div
              style={{
                flex: 1,
                padding: "8px",
                background: "var(--surface)",
                borderRadius: 8,
                fontSize: 11,
                color: "var(--muted)",
                fontWeight: 600,
                textAlign: "center",
              }}
            >
              🔒 Secured
            </div>
          </div>
        </div>
        <div className="screen-footer">
          <button
            className="btn btn-primary btn-full"
            style={{ background: klookOrange }}
            onClick={onNext}
          >
            Simulate Success →
          </button>
        </div>
      </div>
    );

  // Step 4 — Booking Confirmed
  return (
    <div className="screen">
      <div
        className="screen-body"
        style={{
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          gap: 16,
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "#D1FAE5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 40,
            margin: "24px auto 0",
          }}
        >
          🎟️
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 20, color: "var(--ink)" }}>
            Booking Confirmed!
          </div>
          <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 6 }}>
            Your e-voucher is ready. Check your email!
          </div>
        </div>
        <div
          style={{
            background: "#fff",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: "16px",
            width: "100%",
            textAlign: "left",
          }}
        >
          <div
            style={{
              fontWeight: 700,
              fontSize: 13,
              marginBottom: 10,
              color: "var(--ink)",
            }}
          >
            🎫 Booking Summary
          </div>
          {[
            { label: "Activity", val: "Peak Tram HK" },
            { label: "Date", val: "22 Feb 2026" },
            { label: "Traveller", val: "Tracey Wong" },
            { label: "Total Paid", val: totalStr, bold: true },
            ...(payMethod === "atome"
              ? [
                  {
                    label: "Next payment",
                    val: `RM ${(total / 3).toFixed(2)} in 30 days`,
                  },
                ]
              : []),
          ].map((r, i, arr) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "6px 0",
                borderBottom:
                  i < arr.length - 1 ? "1px solid var(--border)" : "none",
                fontSize: 13,
              }}
            >
              <span style={{ color: "var(--muted)" }}>{r.label}</span>
              <span
                style={{
                  fontWeight: r.bold ? 800 : 600,
                  color: r.bold ? klookOrange : "var(--ink)",
                }}
              >
                {r.val}
              </span>
            </div>
          ))}
        </div>
        {payMethod === "atome" && (
          <div
            style={{
              background: "#E0F2FE",
              border: "1px solid #0284C7",
              borderRadius: 10,
              padding: "10px 14px",
              fontSize: 12,
              color: "#0284C7",
              fontWeight: 600,
              width: "100%",
            }}
          >
            ⏰ Atome: 2 more payments of RM {(total / 3).toFixed(2)} scheduled
          </div>
        )}
        <div
          style={{
            background: klookOrangeLight,
            border: `1px solid ${klookOrange}`,
            borderRadius: 10,
            padding: "10px 14px",
            fontSize: 12,
            color: klookOrange,
            fontWeight: 600,
            width: "100%",
          }}
        >
          🎁 KlookCash +4 earned on this booking!
        </div>
        <div style={{ fontSize: 11, color: "var(--muted)" }}>
          Booking Ref: KLK20260222001
        </div>
      </div>
      <div className="screen-footer">
        <button
          className="btn btn-full btn-lg"
          style={{ background: klookOrange, color: "#fff", borderRadius: 999 }}
        >
          View E-Voucher
        </button>
        <button className="btn btn-secondary btn-full">Download Receipt</button>
      </div>
    </div>
  );
}

// ─── AGODA BOOKING FLOW ───────────────────────────────────────────────────────
function AgodaBookingFlow({ step, onNext, onBack }) {
  const [selectedBank, setSelectedBank] = useState(null);
  const [payMethod, setPayMethod] = useState(null);
  const agodaRed = "#E31837";
  const agodaRedLight = "#FEE2E2";
  const banks = [
    { id: "maybank", name: "Maybank2u" },
    { id: "cimb", name: "CIMB Clicks" },
    { id: "rhb", name: "RHB Now" },
    { id: "public", name: "Public Bank" },
    { id: "hongleong", name: "Hong Leong" },
    { id: "ambank", name: "AmBank" },
  ];
  const payMethods = [
    {
      id: "online-banking",
      label: "Online Banking",
      sub: "Maybank2u, CIMB, RHB +13",
      icon: "🏦",
    },
    {
      id: "ewallet",
      label: "E-Wallet",
      sub: "Boost, GrabPay, Touch 'n Go",
      icon: "👛",
    },
    {
      id: "card",
      label: "Credit / Debit Card",
      sub: "Visa, Mastercard, Amex",
      icon: "💳",
    },
    { id: "paylater", label: "PayLater", sub: "Atome", icon: "⏰" },
  ];

  if (step === 0)
    return (
      <div className="screen">
        <div className="screen-header">
          <div className="screen-back" onClick={onBack}>
            ←
          </div>
          <div className="screen-title">Payment details</div>
        </div>
        <div
          style={{
            margin: "0 16px 12px",
            background: "#FFF3E0",
            borderRadius: 8,
            padding: "8px 12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 12,
          }}
        >
          <span style={{ color: "#555" }}>This price is guaranteed for...</span>
          <span
            style={{
              color: agodaRed,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            ⏱ 00:19:50
          </span>
        </div>
        <div className="screen-body" style={{ gap: 12 }}>
          <div
            style={{
              background: "#fff",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: "14px 16px",
            }}
          >
            <div style={{ fontWeight: 800, fontSize: 15, color: "var(--ink)" }}>
              88 Armenian
            </div>
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 3 }}>
              Fri, Aug 21 – Sun, Aug 23 · 2 nights · 1× Superior King
            </div>
          </div>
          <div
            style={{
              background: "#fff",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: "12px 16px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 10,
              }}
            >
              <span>🏷️</span>
              <span style={{ fontWeight: 700, fontSize: 13, color: "#059669" }}>
                Savings Corner
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 8,
                    background: "#FFF3E0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                  }}
                >
                  🎫
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>RM229 off</div>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>
                    Instant discount
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <span style={{ fontSize: 18 }}>🎁</span>
                <span
                  style={{ fontSize: 11, fontWeight: 700, color: "#059669" }}
                >
                  Applied
                </span>
              </div>
            </div>
          </div>
          <div
            style={{
              background: "#fff",
              border: "1px solid var(--border)",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                background: agodaRed,
                color: "#fff",
                fontSize: 10,
                fontWeight: 800,
                padding: "4px 12px",
                textAlign: "right",
                letterSpacing: 0.5,
              }}
            >
              10% OFF TODAY
            </div>
            <div
              style={{
                padding: "14px 16px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {[
                {
                  label: "Original price (1 room × 2 nights)",
                  val: "RM 2,400.00",
                  strike: true,
                },
                { label: "Our price", val: "RM 2,420.42", strike: true },
                { label: "Instant discount", val: "−RM 228.58", green: true },
                { label: "Room price (1 room × 2 nights)", val: "RM 2,191.84" },
                { label: "Taxes and fees", val: "RM 175.34" },
              ].map((r, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 13,
                  }}
                >
                  <span style={{ color: "var(--muted)" }}>{r.label}</span>
                  <span
                    style={{
                      fontWeight: 600,
                      color: r.green ? "#059669" : "var(--ink)",
                      textDecoration: r.strike ? "line-through" : "none",
                      opacity: r.strike ? 0.5 : 1,
                    }}
                  >
                    {r.val}
                  </span>
                </div>
              ))}
              <div
                style={{
                  borderTop: "1px solid var(--border)",
                  paddingTop: 10,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ fontWeight: 700, fontSize: 14 }}>Price ⓘ</span>
                <span style={{ fontWeight: 800, fontSize: 14 }}>
                  RM 2,367.18
                </span>
              </div>
              <div
                style={{
                  background: "#EEF2FF",
                  borderRadius: 8,
                  padding: "10px 12px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 4,
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: 13 }}>
                    Subject to Cashback Terms ⓘ
                  </span>
                  <span
                    style={{
                      fontWeight: 800,
                      fontSize: 13,
                      color: "var(--accent)",
                    }}
                  >
                    RM 2,334.22
                  </span>
                </div>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>
                  Pay RM 2,367.18 now and get RM 38.96 back to your card
                  afterwards
                </div>
              </div>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>
                Included in price: Tax 8%
              </div>
            </div>
          </div>
        </div>
        <div className="screen-footer">
          <button
            className="btn btn-primary btn-full btn-lg"
            style={{
              background: `linear-gradient(135deg, ${agodaRed}, #B91C1C)`,
              borderRadius: 999,
            }}
            onClick={onNext}
          >
            🔒 BOOK NOW!
          </button>
        </div>
      </div>
    );

  if (step === 1)
    return (
      <div className="screen">
        <div className="screen-header">
          <div className="screen-back" onClick={onBack}>
            ←
          </div>
          <div className="screen-title">Select Payment</div>
        </div>
        <div
          style={{
            margin: "0 16px 12px",
            background: "#FFF3E0",
            borderRadius: 8,
            padding: "8px 12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 12,
          }}
        >
          <span style={{ color: "#555" }}>This price is guaranteed for...</span>
          <span
            style={{
              color: agodaRed,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            ⏱ 00:19:35
          </span>
        </div>
        <div className="screen-body" style={{ gap: 0, padding: "0 0 80px" }}>
          {payMethods.map((m) => (
            <div
              key={m.id}
              onClick={() => setPayMethod(m.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "16px 16px",
                borderBottom: "1px solid var(--border)",
                cursor: "pointer",
                background: payMethod === m.id ? "#EEF2FF" : "#fff",
              }}
            >
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  border: `2px solid ${payMethod === m.id ? "var(--accent)" : "var(--border)"}`,
                  background:
                    payMethod === m.id ? "var(--accent)" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {payMethod === m.id && (
                  <span style={{ color: "#fff", fontSize: 12 }}>✓</span>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{m.label}</div>
                <div
                  style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}
                >
                  {m.sub}
                </div>
              </div>
              <span style={{ fontSize: 20 }}>{m.icon}</span>
            </div>
          ))}
          <div style={{ padding: "12px 16px", textAlign: "center" }}>
            <div style={{ color: agodaRed, fontWeight: 700, fontSize: 12 }}>
              Hurry! Our last room for your dates at this price
            </div>
          </div>
          <div
            style={{
              padding: "0 16px 12px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {[
              "I agree to receive updates and promotions about Agoda via WhatsApp.",
              "I agree to Agoda's Cancellation Policy, Terms of Use and Privacy Policy",
            ].map((t, i) => (
              <div
                key={i}
                style={{ display: "flex", gap: 10, alignItems: "flex-start" }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 3,
                    background: "var(--accent)",
                    border: "2px solid var(--accent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: 1,
                  }}
                >
                  <span style={{ color: "#fff", fontSize: 11 }}>✓</span>
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--muted)",
                    lineHeight: 1.5,
                  }}
                >
                  {t}
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              padding: "0 16px 12px",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ fontSize: 16 }}>✉️</span>
            <div style={{ fontSize: 11, color: "var(--muted)" }}>
              We'll send confirmation to <strong>guest@email.com</strong>
            </div>
          </div>
        </div>
        <div className="screen-footer">
          <button
            className="btn btn-primary btn-full btn-lg"
            style={{
              background: payMethod
                ? `linear-gradient(135deg, ${agodaRed}, #B91C1C)`
                : "var(--border)",
              borderRadius: 999,
              color: payMethod ? "#fff" : "var(--muted)",
            }}
            onClick={() => {
              if (payMethod) onNext();
            }}
          >
            🔒 BOOK NOW!
          </button>
        </div>
      </div>
    );

  if (step === 2)
    return (
      <div className="screen">
        <div className="screen-header">
          <div className="screen-back" onClick={onBack}>
            ←
          </div>
          <div className="screen-title">Online Banking</div>
        </div>
        <div className="screen-body" style={{ gap: 12 }}>
          <div
            style={{
              background: "#EEF2FF",
              borderRadius: 10,
              padding: "10px 14px",
              fontSize: 12,
              color: "var(--accent)",
              fontWeight: 600,
              textAlign: "center",
            }}
          >
            Select your bank to pay <strong>RM 2,367.18</strong>
          </div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "var(--muted)",
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            Choose Bank
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 0,
              background: "#fff",
              borderRadius: 12,
              border: "1px solid var(--border)",
              overflow: "hidden",
            }}
          >
            {banks.map((b, i) => (
              <div
                key={b.id}
                onClick={() => setSelectedBank(b.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 16px",
                  borderBottom:
                    i < banks.length - 1 ? "1px solid var(--border)" : "none",
                  cursor: "pointer",
                  background: selectedBank === b.id ? "#EEF2FF" : "#fff",
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    border: `2px solid ${selectedBank === b.id ? "var(--accent)" : "var(--border)"}`,
                    background:
                      selectedBank === b.id ? "var(--accent)" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {selectedBank === b.id && (
                    <span style={{ color: "#fff", fontSize: 12 }}>✓</span>
                  )}
                </div>
                <div style={{ flex: 1, fontWeight: 600, fontSize: 14 }}>
                  {b.name}
                </div>
                <span style={{ fontSize: 18 }}>🏦</span>
              </div>
            ))}
          </div>
          <div
            style={{ fontSize: 11, color: "var(--muted)", textAlign: "center" }}
          >
            You will be redirected to your bank's secure portal
          </div>
        </div>
        <div className="screen-footer">
          <button
            className="btn btn-primary btn-full"
            style={{
              background: selectedBank ? "var(--accent)" : "var(--border)",
              color: selectedBank ? "#fff" : "var(--muted)",
            }}
            onClick={() => {
              if (selectedBank) onNext();
            }}
          >
            Proceed to Bank →
          </button>
        </div>
      </div>
    );

  if (step === 3)
    return (
      <div className="screen">
        <div
          style={{
            background: "linear-gradient(135deg, #1e3a5f 0%, #0f2340 100%)",
            padding: "16px",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            className="screen-back"
            style={{
              background: "rgba(255,255,255,0.1)",
              color: "#fff",
              border: "none",
            }}
            onClick={onBack}
          >
            ←
          </div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>
            Maybank2u
          </div>
          <div
            style={{
              marginLeft: "auto",
              fontSize: 10,
              color: "rgba(255,255,255,0.5)",
            }}
          >
            🔒 Secure
          </div>
        </div>
        <div
          className="screen-body"
          style={{
            gap: 16,
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "#EEF2FF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              margin: "20px auto 0",
            }}
          >
            🏦
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16 }}>
              Authorising Payment
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
              Please complete authentication in your bank app
            </div>
          </div>
          <div
            style={{
              background: "#fff",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: "16px",
              width: "100%",
              textAlign: "left",
            }}
          >
            {[
              { label: "Merchant", val: "Agoda" },
              { label: "Hotel", val: "88 Armenian" },
              { label: "Amount", val: "RM 2,367.18", bold: true },
              { label: "Reference", val: "AGD20250818001" },
            ].map((r, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "6px 0",
                  borderBottom: i < 3 ? "1px solid var(--border)" : "none",
                  fontSize: 13,
                }}
              >
                <span style={{ color: "var(--muted)" }}>{r.label}</span>
                <span style={{ fontWeight: r.bold ? 800 : 600 }}>{r.val}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, width: "100%" }}>
            <div
              style={{
                flex: 1,
                padding: "8px",
                background: "#EEF2FF",
                borderRadius: 8,
                fontSize: 11,
                color: "var(--accent)",
                fontWeight: 600,
                textAlign: "center",
              }}
            >
              ⏳ Awaiting approval...
            </div>
            <div
              style={{
                flex: 1,
                padding: "8px",
                background: "var(--surface)",
                borderRadius: 8,
                fontSize: 11,
                color: "var(--muted)",
                fontWeight: 600,
                textAlign: "center",
              }}
            >
              🔄 Connecting...
            </div>
          </div>
          <div style={{ fontSize: 11, color: "var(--muted)" }}>
            Do not close this page. This may take up to 30 seconds.
          </div>
        </div>
        <div className="screen-footer">
          <button className="btn btn-primary btn-full" onClick={onNext}>
            Simulate Approval →
          </button>
        </div>
      </div>
    );

  return (
    <div className="screen">
      <div
        className="screen-body"
        style={{
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          gap: 16,
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "#D1FAE5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 40,
            margin: "24px auto 0",
          }}
        >
          ✅
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 20, color: "var(--ink)" }}>
            Booking Confirmed!
          </div>
          <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 6 }}>
            Your room has been reserved. Check your email for details.
          </div>
        </div>
        <div
          style={{
            background: "#fff",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: "16px",
            width: "100%",
            textAlign: "left",
          }}
        >
          <div
            style={{
              fontWeight: 700,
              fontSize: 13,
              marginBottom: 10,
              color: "var(--ink)",
            }}
          >
            🏨 Booking Summary
          </div>
          {[
            { label: "Hotel", val: "88 Armenian" },
            { label: "Check-in", val: "Fri, 21 Aug 2025" },
            { label: "Check-out", val: "Sun, 23 Aug 2025" },
            { label: "Room", val: "Superior King" },
            { label: "Total Paid", val: "RM 2,367.18", bold: true },
          ].map((r, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "6px 0",
                borderBottom: i < 4 ? "1px solid var(--border)" : "none",
                fontSize: 13,
              }}
            >
              <span style={{ color: "var(--muted)" }}>{r.label}</span>
              <span
                style={{
                  fontWeight: r.bold ? 800 : 600,
                  color: r.bold ? agodaRed : "var(--ink)",
                }}
              >
                {r.val}
              </span>
            </div>
          ))}
        </div>
        <div
          style={{
            background: agodaRedLight,
            border: `1px solid ${agodaRed}`,
            borderRadius: 10,
            padding: "10px 14px",
            fontSize: 12,
            color: agodaRed,
            fontWeight: 600,
            width: "100%",
          }}
        >
          💰 Cashback of RM 38.96 will be credited within 30 days
        </div>
        <div style={{ fontSize: 11, color: "var(--muted)" }}>
          Booking Ref: AGD20250818001
        </div>
      </div>
      <div className="screen-footer">
        <button
          className="btn btn-primary btn-full"
          style={{
            background: `linear-gradient(135deg, ${agodaRed}, #B91C1C)`,
          }}
        >
          View My Booking
        </button>
        <button className="btn btn-secondary btn-full">Download Receipt</button>
      </div>
    </div>
  );
}

// ─── AGODA SOLD OUT FLOW ──────────────────────────────────────────────────────
function AgodaSoldOutFlow({ step, onNext, onBack }) {
  const agodaRed = "#E31837";

  if (step === 0)
    return (
      <div className="screen">
        <div className="screen-header">
          <div className="screen-back" onClick={onBack}>
            ←
          </div>
          <div className="screen-title">Payment details</div>
        </div>
        <div
          style={{
            margin: "0 16px 12px",
            background: "#FFF3E0",
            borderRadius: 8,
            padding: "8px 12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 12,
          }}
        >
          <span style={{ color: "#555" }}>This price is guaranteed for...</span>
          <span
            style={{
              color: agodaRed,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            ⏱ 00:00:03
          </span>
        </div>
        <div className="screen-body" style={{ gap: 12 }}>
          <div
            style={{
              background: "#fff",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: "14px 16px",
            }}
          >
            <div style={{ fontWeight: 800, fontSize: 15 }}>88 Armenian</div>
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 3 }}>
              Fri, Aug 21 – Sun, Aug 23 · 2 nights · 1× Superior King
            </div>
          </div>
          <div
            style={{
              background: "#fff",
              border: "1px solid var(--border)",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                background: agodaRed,
                color: "#fff",
                fontSize: 10,
                fontWeight: 800,
                padding: "4px 12px",
                textAlign: "right",
              }}
            >
              10% OFF TODAY
            </div>
            <div
              style={{
                padding: "14px 16px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 13,
                }}
              >
                <span style={{ color: "var(--muted)" }}>
                  Room price (1 room × 2 nights)
                </span>
                <span style={{ fontWeight: 600 }}>RM 2,191.84</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 13,
                }}
              >
                <span style={{ color: "var(--muted)" }}>Taxes and fees</span>
                <span style={{ fontWeight: 600 }}>RM 175.34</span>
              </div>
              <div
                style={{
                  borderTop: "1px solid var(--border)",
                  paddingTop: 10,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ fontWeight: 700, fontSize: 14 }}>Total</span>
                <span style={{ fontWeight: 800, fontSize: 14 }}>
                  RM 2,367.18
                </span>
              </div>
            </div>
          </div>
          <div
            style={{
              background: "#FEF2F2",
              border: `1px solid ${agodaRed}`,
              borderRadius: 10,
              padding: "10px 14px",
              fontSize: 12,
              color: agodaRed,
              fontWeight: 600,
              textAlign: "center",
            }}
          >
            ⚠️ Timer expiring — complete your booking now!
          </div>
        </div>
        <div className="screen-footer">
          <button
            className="btn btn-primary btn-full btn-lg"
            style={{
              background: `linear-gradient(135deg, ${agodaRed}, #B91C1C)`,
              borderRadius: 999,
            }}
            onClick={onNext}
          >
            🔒 BOOK NOW!
          </button>
        </div>
      </div>
    );

  if (step === 1)
    return (
      <div className="screen">
        <div className="screen-header">
          <div className="screen-back" onClick={onBack}>
            ←
          </div>
          <div className="screen-title">Booking Failed</div>
        </div>
        <div
          className="screen-body"
          style={{
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "#FEE2E2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
              margin: "24px auto 0",
            }}
          >
            🚫
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 20, color: agodaRed }}>
              Room No Longer Available
            </div>
            <div
              style={{
                fontSize: 13,
                color: "var(--muted)",
                marginTop: 6,
                lineHeight: 1.6,
              }}
            >
              Sorry, the Superior King room at 88 Armenian has just been booked
              by another guest. This happens when multiple guests view the same
              room simultaneously.
            </div>
          </div>
          <div
            style={{
              background: "#FEF2F2",
              border: `1px solid ${agodaRed}`,
              borderRadius: 12,
              padding: "14px 16px",
              width: "100%",
              textAlign: "left",
            }}
          >
            <div
              style={{
                fontWeight: 700,
                fontSize: 13,
                color: agodaRed,
                marginBottom: 8,
              }}
            >
              What happened?
            </div>
            {[
              "⏱ Price guarantee timer expired",
              "🏨 Room was booked by another guest",
              "💳 No charges were made to your account",
            ].map((t, i) => (
              <div
                key={i}
                style={{
                  fontSize: 12,
                  color: "var(--muted)",
                  padding: "4px 0",
                }}
              >
                {t}
              </div>
            ))}
          </div>
        </div>
        <div className="screen-footer">
          <button
            className="btn btn-primary btn-full"
            style={{
              background: `linear-gradient(135deg, ${agodaRed}, #B91C1C)`,
            }}
            onClick={onNext}
          >
            Find Similar Rooms →
          </button>
          <button className="btn btn-secondary btn-full" onClick={onBack}>
            ← Go Back
          </button>
        </div>
      </div>
    );

  return (
    <div className="screen">
      <div className="screen-header">
        <div className="screen-back" onClick={onBack}>
          ←
        </div>
        <div className="screen-title">Similar Rooms</div>
      </div>
      <div className="screen-body" style={{ gap: 12 }}>
        <div
          style={{ fontSize: 13, color: "var(--muted)", textAlign: "center" }}
        >
          We found{" "}
          <strong style={{ color: "var(--ink)" }}>3 similar rooms</strong>{" "}
          available for your dates
        </div>
        {[
          {
            name: "Deluxe Double Room",
            hotel: "88 Armenian",
            price: "RM 2,450.00",
            badge: "Last 2 rooms!",
            badgeColor: agodaRed,
            discount: "8% OFF",
          },
          {
            name: "Superior Twin Room",
            hotel: "88 Armenian",
            price: "RM 2,280.00",
            badge: "Great value",
            badgeColor: "#059669",
            discount: "12% OFF",
          },
          {
            name: "Superior King",
            hotel: "The Yard Hotel",
            price: "RM 1,980.00",
            badge: "Free cancellation",
            badgeColor: "#0284C7",
            discount: "15% OFF",
          },
        ].map((r, i) => (
          <div
            key={i}
            style={{
              background: "#fff",
              border: "1px solid var(--border)",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                background: r.badgeColor,
                color: "#fff",
                fontSize: 10,
                fontWeight: 800,
                padding: "4px 12px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>{r.badge}</span>
              <span>{r.discount}</span>
            </div>
            <div style={{ padding: "12px 14px" }}>
              <div style={{ fontWeight: 700, fontSize: 13 }}>{r.name}</div>
              <div
                style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}
              >
                {r.hotel}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 10,
                }}
              >
                <span style={{ fontWeight: 800, fontSize: 15 }}>{r.price}</span>
                <button
                  className="btn btn-primary btn-sm"
                  style={{ background: agodaRed, borderRadius: 999 }}
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── FLOW RENDERER ────────────────────────────────────────────────────────────
function FlowRenderer({ scenario, step, onNext, onBack }) {
  if (!scenario) return null;
  const props = { step, onNext, onBack };
  switch (scenario.id) {
    case "grabpay-wallet":
      return <GrabPayFlow {...props} />;
    case "apple-pay-bio":
    case "airbnb-booking":
      return <ApplePayFlow {...props} />;
    case "agoda-booking":
      return <AgodaBookingFlow {...props} />;
    case "agoda-soldout":
      return <AgodaSoldOutFlow {...props} />;
    case "klook-booking":
      return <KlookBookingFlow {...props} />;
    case "visa-card":
    case "google-pay-card":
      return <VisaCardFlow {...props} />;
    case "grabpoints":
      return <GrabPointsFlow {...props} />;
    case "shopee-coupon":
      return <ShopeeCouponFlow {...props} />;
    case "amazon-1click":
      return <AmazonFlow {...props} />;
    case "pending-bank":
      return <PendingFlow {...props} />;
    case "failed-decline":
      return <FailedFlow {...props} />;
    case "offline-error":
      return <OfflineFlow {...props} />;
    case "refund-flow":
      return <RefundFlow {...props} />;
    case "cancel-booking":
      return <CancelBookingFlow {...props} />;
    case "show-receipt":
      return <ShowReceiptFlow {...props} />;
    case "view-booking":
      return <ViewBookingFlow {...props} />;
    case "duitnow-qr":
      return <DuitNowQRFlow {...props} />;
    case "duitnow-insufficient":
      return <DuitNowInsufficientFlow {...props} />;
    case "duitnow-error":
      return <DuitNowErrorFlow {...props} />;
    case "crypto-pay":
      return <CryptoPayFlow {...props} />;
    case "crypto-receipt":
      return <CryptoReceiptFlow {...props} />;
    case "shopify-checkout":
      return <ShopifyCheckoutFlow {...props} voucherMode="valid" />;
    case "shopify-voucher-invalid":
      return <ShopifyVoucherInvalidFlow {...props} />;
    default:
      return <GrabPayFlow {...props} />;
  }
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeScenario, setActiveScenario] = useState(SCENARIOS[0]);
  const [step, setStep] = useState(0);
  const [toast, setToast] = useState(null);

  const filtered =
    activeCategory === "all"
      ? SCENARIOS
      : SCENARIOS.filter((s) => s.category === activeCategory);
  const flowSteps = FLOW_STEPS[activeScenario?.id] || [];

  const showToast = (msg, icon = "✓") => {
    setToast({ msg, icon });
    setTimeout(() => setToast(null), 3000);
  };

  const selectScenario = (s) => {
    setActiveScenario(s);
    setStep(0);
    showToast(`Loading: ${s.name}`, s.icon);
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, flowSteps.length - 1));
  const prevStep = () => {
    if (step === 0) {
      showToast("Back to flow selection", "←");
    } else setStep((s) => Math.max(s - 1, 0));
  };

  const catCounts = {};
  SCENARIOS.forEach((s) => {
    catCounts[s.category] = (catCounts[s.category] || 0) + 1;
  });

  return (
    <>
      {toast && (
        <div className="toast">
          <span>{toast.icon}</span>
          <span>{toast.msg}</span>
        </div>
      )}
      <div className="app">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sb-logo">
            <div className="sb-logo-mark">PayFlow Lab</div>
            <div className="sb-logo-sub">Payment UX Simulator</div>
          </div>
          <div className="sb-section">Categories</div>
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className={`sb-item ${activeCategory === cat.id ? "active" : ""}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <span className="sb-icon">{cat.icon}</span>
              <span>{cat.label}</span>
              {cat.id !== "all" && catCounts[cat.id] && (
                <span className="sb-badge">{catCounts[cat.id]}</span>
              )}
              {cat.id === "all" && (
                <span className="sb-badge">{SCENARIOS.length}</span>
              )}
            </div>
          ))}
          <div style={{ flex: 1 }} />
          <div style={{ padding: "12px 20px 20px" }}>
            <div
              style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.2)",
                lineHeight: 1.6,
              }}
            >
              Based on case studies from
              <br />
              <span style={{ color: "rgba(255,255,255,0.4)" }}>
                GrabPay · Apple Pay · Google · Airbnb · Shopee · Amazon · Visa ·
                DuitNow · BTC · ETH · USDT · Shopify
              </span>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="main">
          {/* Header */}
          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div>
                <div className="page-title">Payment UX Flows</div>
                <div className="page-sub">
                  Interactive simulator · {filtered.length} flows · Click any
                  scenario to explore
                </div>
              </div>
            </div>
          </div>

          <div className="flow-container">
            {/* ── LEFT PANEL ────────────────────────────────── */}
            <div className="panel">
              {/* Active scenario hero */}
              {activeScenario && (
                <div
                  style={{
                    background:
                      "linear-gradient(135deg, var(--ink) 0%, #1e1b4b 100%)",
                    borderRadius: "var(--r-xl)",
                    padding: "18px 20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: "var(--r-md)",
                        background: "rgba(255,255,255,0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 22,
                        flexShrink: 0,
                      }}
                    >
                      {activeScenario.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          color: "#fff",
                          fontWeight: 800,
                          fontSize: 14,
                          letterSpacing: -0.3,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {activeScenario.name}
                      </div>
                      <div
                        style={{
                          color: "rgba(255,255,255,0.45)",
                          fontSize: 11,
                          marginTop: 1,
                        }}
                      >
                        {activeScenario.desc}
                      </div>
                    </div>
                    <span
                      className={`pill ${
                        activeScenario.type === "card"
                          ? "pill-accent"
                          : activeScenario.type === "biometric"
                            ? "pill-sky"
                            : activeScenario.type === "wallet"
                              ? "pill-grab"
                              : activeScenario.type === "points"
                                ? "pill-amber"
                                : activeScenario.type === "qr" ||
                                    activeScenario.type === "cancel" ||
                                    activeScenario.type === "error"
                                  ? "pill-rose"
                                  : activeScenario.type === "refund"
                                    ? "pill-teal"
                                    : activeScenario.type === "crypto" ||
                                        activeScenario.type === "booking"
                                      ? "pill-amber"
                                      : activeScenario.type === "receipt"
                                        ? "pill-accent"
                                        : "pill-muted"
                      }`}
                      style={{ flexShrink: 0 }}
                    >
                      {activeScenario.type}
                    </span>
                  </div>

                  {/* Mini flow progress inline */}
                  <div>
                    <div
                      style={{
                        display: "flex",
                        gap: 6,
                        flexWrap: "wrap",
                        marginBottom: 8,
                      }}
                    >
                      {flowSteps.map((s, i) => (
                        <div
                          key={i}
                          style={{
                            flex: "1 1 auto",
                            minWidth: 0,
                            padding: "5px 8px",
                            borderRadius: 6,
                            background:
                              i < step
                                ? "rgba(5,150,105,0.25)"
                                : i === step
                                  ? "rgba(91,75,245,0.35)"
                                  : "rgba(255,255,255,0.06)",
                            border: `1px solid ${i < step ? "rgba(5,150,105,0.4)" : i === step ? "rgba(91,75,245,0.5)" : "rgba(255,255,255,0.06)"}`,
                            fontSize: 10,
                            fontWeight: 700,
                            color:
                              i < step
                                ? "#6ee7b7"
                                : i === step
                                  ? "#c4b5fd"
                                  : "rgba(255,255,255,0.35)",
                            textAlign: "center",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {i < step ? "✓" : `${i + 1}.`} {s}
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        className="btn btn-sm"
                        style={{
                          flex: 1,
                          background: "rgba(255,255,255,0.08)",
                          color: "rgba(255,255,255,0.6)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          fontSize: 11,
                        }}
                        onClick={() => setStep(0)}
                      >
                        ↺ Reset
                      </button>
                      <button
                        className="btn btn-sm"
                        style={{
                          flex: 1,
                          background: "rgba(255,255,255,0.08)",
                          color: "rgba(255,255,255,0.6)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          fontSize: 11,
                        }}
                        onClick={prevStep}
                        disabled={step === 0}
                      >
                        ← Back
                      </button>
                      <button
                        className="btn btn-sm"
                        style={{
                          flex: 1,
                          background: "var(--accent)",
                          color: "#fff",
                          border: "none",
                          fontSize: 11,
                          opacity: step >= flowSteps.length - 1 ? 0.4 : 1,
                        }}
                        onClick={nextStep}
                        disabled={step >= flowSteps.length - 1}
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Scenario browser — fixed height, scrollable */}
              <div
                className="panel-card"
                style={{ padding: 0, overflow: "hidden" }}
              >
                {/* Search + count header */}
                <div
                  style={{
                    padding: "14px 16px 10px",
                    borderBottom: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <span style={{ fontSize: 14 }}>📱</span>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "var(--ink)",
                      flex: 1,
                    }}
                  >
                    Scenarios
                  </span>
                  <span className="pill pill-muted">
                    {filtered.length} flows
                  </span>
                </div>

                {/* Scrollable list — fixed height */}
                <div
                  style={{
                    height: 340,
                    overflowY: "auto",
                    overflowX: "hidden",
                  }}
                >
                  {(() => {
                    // Group by category when showing "all", otherwise flat list
                    if (activeCategory !== "all") {
                      return filtered.map((s) => (
                        <ScenarioRow
                          key={s.id}
                          s={s}
                          active={activeScenario?.id === s.id}
                          onClick={() => selectScenario(s)}
                        />
                      ));
                    }
                    // Group by category
                    const groups = {};
                    filtered.forEach((s) => {
                      if (!groups[s.category]) groups[s.category] = [];
                      groups[s.category].push(s);
                    });
                    const catMeta = {
                      digital: "📱 Digital",
                      card: "💳 Card",
                      ecommerce: "🛒 E-Commerce",
                      booking: "🏡 Bookings",
                      points: "⭐ Points",
                      rewards: "🎁 Rewards",
                      qr: "🔳 QR",
                      crypto: "₿ Crypto",
                      edge: "⚠️ Edge Cases",
                      post: "📋 Post-Payment",
                    };
                    return Object.entries(groups).map(([cat, items]) => (
                      <div key={cat}>
                        <div
                          style={{
                            padding: "8px 16px 4px",
                            fontSize: 9.5,
                            fontWeight: 700,
                            color: "var(--muted)",
                            letterSpacing: 1.2,
                            textTransform: "uppercase",
                            background: "var(--surface)",
                            borderBottom: "1px solid var(--border)",
                            position: "sticky",
                            top: 0,
                            zIndex: 1,
                          }}
                        >
                          {catMeta[cat] || cat}
                        </div>
                        {items.map((s) => (
                          <ScenarioRow
                            key={s.id}
                            s={s}
                            active={activeScenario?.id === s.id}
                            onClick={() => selectScenario(s)}
                          />
                        ))}
                      </div>
                    ));
                  })()}
                </div>
              </div>

              {/* Stats row — compact 2×2 */}
              <div className="grid-2">
                {[
                  { val: "25", label: "Scenarios", sub: "All categories" },
                  { val: "≤3", label: "Taps to Pay", sub: "Best practice" },
                  { val: "70%+", label: "Conversion", sub: "Industry target" },
                  { val: "<2%", label: "Error Rate", sub: "Baymard std." },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="stat-card"
                    style={{ padding: "12px 14px" }}
                  >
                    <div className="stat-value" style={{ fontSize: 22 }}>
                      {s.val}
                    </div>
                    <div className="stat-label">{s.label}</div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "var(--muted)",
                        marginTop: 4,
                      }}
                    >
                      {s.sub}
                    </div>
                  </div>
                ))}
              </div>

              {/* UX Principles — collapsed to compact chips */}
              <div className="panel-card" style={{ padding: "14px 16px" }}>
                <div className="panel-title" style={{ marginBottom: 10 }}>
                  <span>💡</span> UX Principles
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {[
                    { icon: "🔐", label: "Trust Signals" },
                    { icon: "📱", label: "Progressive Disclosure" },
                    { icon: "⚡", label: "Minimal Taps" },
                    { icon: "🧯", label: "Safe Failures" },
                    { icon: "♻️", label: "Cart Preservation" },
                    { icon: "🔔", label: "Clear Feedback" },
                  ].map((p) => (
                    <div
                      key={p.label}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        padding: "5px 10px",
                        background: "var(--surface)",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--r-full)",
                        fontSize: 11,
                        fontWeight: 600,
                        color: "var(--ink)",
                      }}
                    >
                      <span>{p.icon}</span> {p.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── RIGHT: Phone ────────────────────────────── */}
            <div>
              <div className="phone-shell">
                <div className="phone-notch">
                  <div className="notch-dot" />
                  <div className="notch-bar" />
                  <div className="notch-dot" />
                </div>
                <div className="phone-screen">
                  <ProgressBar steps={flowSteps} current={step} />
                  <FlowRenderer
                    scenario={activeScenario}
                    step={step}
                    onNext={nextStep}
                    onBack={prevStep}
                  />
                  <div className="phone-home-bar" />
                </div>
              </div>
              <div
                style={{
                  textAlign: "center",
                  marginTop: 12,
                  fontSize: 11,
                  color: "var(--muted)",
                }}
              >
                Step {step + 1} of {flowSteps.length} · {activeScenario?.name}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
