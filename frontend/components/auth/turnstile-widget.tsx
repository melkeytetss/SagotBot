"use client";

import React from "react";
import { RecaptchaWidget } from "./recaptcha-widget";

interface TurnstileWidgetProps {
  onVerify?: (token: string) => void;
  className?: string;
}

export function TurnstileWidget(props: TurnstileWidgetProps) {
  return <RecaptchaWidget {...props} action="auth" />;
}

export default TurnstileWidget;
