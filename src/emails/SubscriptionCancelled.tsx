import React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Hr,
  Link,
} from "@react-email/components";

interface SubscriptionCancelledProps {
  userName: string;
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://resumeradar.io";

export function SubscriptionCancelled({ userName }: SubscriptionCancelledProps) {
  return (
    <Html lang="en">
      <Head />
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>ResumeRadar</Text>
          </Section>

          <Section style={content}>
            <Text style={heading}>Your subscription has been cancelled</Text>
            <Text style={paragraph}>Hi {userName},</Text>
            <Text style={paragraph}>
              Your ResumeRadar subscription has been cancelled as requested.
            </Text>
            <Text style={paragraph}>
              You'll keep Pro access until the end of your current billing period. After that,
              your account will move to the free plan automatically.
            </Text>
            <Text style={paragraph}>
              Changed your mind? You can resubscribe anytime from your{" "}
              <Link href={`${APP_URL}/settings`} style={link}>
                account settings
              </Link>
              .
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

export default SubscriptionCancelled;

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

const link: React.CSSProperties = {
  color: "#006EDC",
  textDecoration: "underline",
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
