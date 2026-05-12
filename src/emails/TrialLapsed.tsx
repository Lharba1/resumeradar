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
  Link,
} from "@react-email/components";

interface TrialLapsedProps {
  userName: string;
  upgradeUrl: string;
}

export function TrialLapsed({ userName, upgradeUrl }: TrialLapsedProps) {
  return (
    <Html lang="en">
      <Head />
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>ResumeRadar</Text>
          </Section>

          <Section style={content}>
            <Text style={heading}>Your ResumeRadar trial has ended</Text>
            <Text style={paragraph}>Hi {userName},</Text>
            <Text style={paragraph}>
              Your Pro trial has ended. You're now back on the free plan.
            </Text>
            <Text style={paragraph}>
              You can still use ResumeRadar — free plan includes a limited number of
              optimizations per month. Upgrade anytime to get back to unlimited
              optimizations and all Pro features.
            </Text>

            <Section style={buttonSection}>
              <Button href={upgradeUrl} style={button}>
                See Pro plans →
              </Button>
            </Section>

            <Text style={paragraph}>
              No pressure. We'll be here when you're ready.
            </Text>
          </Section>

          <Hr style={divider} />

          <Section style={footer}>
            <Text style={footerText}>
              ResumeRadar · Canada
            </Text>
            <Text style={footerText}>
              You're receiving this because your Pro trial ended.{" "}
              <Link href={`${upgradeUrl}?unsubscribe=1`} style={footerLink}>
                Unsubscribe
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default TrialLapsed;

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
  backgroundColor: "#006EDC",
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

const footerLink: React.CSSProperties = {
  color: "#9ca3af",
  textDecoration: "underline",
};
