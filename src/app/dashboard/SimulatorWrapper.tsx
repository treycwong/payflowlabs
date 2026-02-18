"use client";

import dynamic from "next/dynamic";

const PaymentFlowsApp = dynamic(
  () => import("@/components/simulator/PaymentFlowsApp"),
  { ssr: false },
);

export default function SimulatorWrapper() {
  return <PaymentFlowsApp />;
}
