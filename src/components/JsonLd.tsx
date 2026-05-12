function safeJsonSerialize(data: Record<string, unknown>): string {
  return JSON.stringify(data, (_key, value) => {
    if (typeof value === "string") {
      return value
        .replace(/&/g, "\\u0026")
        .replace(/</g, "\\u003c")
        .replace(/>/g, "\\u003e");
    }
    return value;
  });
}

export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonSerialize(data) }}
    />
  );
}
