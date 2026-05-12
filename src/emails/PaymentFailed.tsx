import React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
} from "@react-email/components";

interface PaymentFailedProps {
  userName: string;
  updateUrl: string;
}

export function PaymentFailed({ userName, updateUrl }: PaymentFailedProps) {
  return (
    <Html lang="en">
      <Head />
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>ResumeRadar</Text>
          </Section>

          <Section style={content}>
            <Text style={heading}>Action required: payment failed</Text>
            <Text style={paragraph}>Hi {userName},</Text>
            <Text style={paragraph}>
              We couldn't process your last payment for ResumeRadar Pro.
            </Text>
            <Text style={paragraph}>
              Please update your payment method within <strong>7 days</strong> to avoid
              interruption to your service. If we can't collect payment, your subscription
              will be paused automatically.
            </Text>

            <Section style={buttonSection}>
              <Button href={updateUrl} style={button}>
                Update payment method →
              </Button>
            </Section>

            <Text style={paragraph}>
              If you have questions, reply to this email — we're happy to help.
            </Text>
          </Section>

          <Hr style={divider} />

          <Section style={footer}>
            <Text style={footerText}>
              ResumeRadar · Canada
            </Text>
            <Text style={footerText}>
              This is a transactional message regarding your ResumeRadar subscription.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default PaymentFailed;

// Styles
const body: React.CSSProperties = {
  backgroundColor: "#f6f9fc",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  margin: 0,
  padding: 0,
};

const container: React.CSSProperties = {
  maxWidth: "580px",
  margin: "0 auto",
  padding: "40px 20px",
};

const header: React.CSSProperties = {
  marginBottom: "32px",
};

const logo: React.CSSProperties = {
  color: "#006EDC",
  fontSize: "22px",
  fontWeight: "700",
  margin: 0,
};

const content: React.CSSProperties = {
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  padding: "40px",
  border: "1px solid #e6ebf1",
};

const heading: React.CSSProperties = {
  color: "#131f2f",
  fontSize: "24px",
  fontWeight: "700",
  margin: "0 0 24px",
};

const paragraph: React.CSSProperties = {
  color: "#4a5568",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0 0 16px",
};

const buttonSection: React.CSSProperties = {
  margin: "32px 0",
  textAlign: "center",
};

const button: React.CSSProperties = {
  backgroundColor: "#131f2f",
  borderRadius: "6px",
  color: "#ffffff",
  display: "inline-block",
  fontSize: "16px",
  fontWeight: "600",
  padding: "14px 28px",
  textDecoration: "none",
};

const divider: React.CSSProperties = {
  borderColor: "#e6ebf1",
  margin: "32px 0 24px",
};

const footer: React.CSSProperties = {
  textAlign: "center",
};

const footerText: React.CSSProperties = {
  color: "#9ca3af",
  fontSize: "13px",
  lineHeight: "1.5",
  margin: "0 0 8px",
};
