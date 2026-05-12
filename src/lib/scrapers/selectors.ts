// JobBank CSS selector definitions — versioned so a site-structure change only
// requires adding a new SELECTORS_V2 object and bumping the env var.
//
// To switch versions without redeploying, set:
//   JOBBANK_SELECTOR_VERSION=v2
// in your environment and redeploy (or use a feature-flag store).

const SELECTORS_V1 = {
  /** Outer card element wrapping each job listing */
  jobCard: "article.action-buttons",

  /** Anchor tag inside the card that holds the main job data */
  jobLink: "a.resultJobItem",

  /** Job title text node */
  title: "span.noctitle",

  /** Company / business name */
  company: "li.business",

  /** Location element (icon <span>s are stripped before reading text) */
  location: "li.location",

  /** Detail page: primary description container (tried in order) */
  detailBody: ".job-posting-details-body",

  /** Detail page: fallback description container */
  detailCommon: ".job-posting-detail-common",

  /** Detail page: second fallback description container */
  detailContent: ".job-posting-content",
} as const;

export type JobBankSelectorSet = typeof SELECTORS_V1;

const VERSION = process.env.JOBBANK_SELECTOR_VERSION ?? "v1";

// When adding v2, extend the map below:
//   const SELECTORS_V2 = { ... };
//   const SELECTOR_MAP: Record<string, JobBankSelectorSet> = { v1: SELECTORS_V1, v2: SELECTORS_V2 };
const SELECTOR_MAP: Record<string, JobBankSelectorSet> = {
  v1: SELECTORS_V1,
};

export const JOBBANK_SELECTORS: JobBankSelectorSet =
  SELECTOR_MAP[VERSION] ?? SELECTORS_V1;

export const JOBBANK_SELECTOR_VERSION = VERSION;
