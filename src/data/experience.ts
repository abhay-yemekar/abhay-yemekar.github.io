import type { Todo } from '../lib/todo'

export type Experience = {
  company: string
  role: string
  start: string
  end: string
  location: string
  arrangement: 'On-site' | 'Remote' | 'Hybrid'
  /** One line on what the role was for. */
  summary: string
  /** Outcomes, not duties: what got built or changed. */
  bullets: (string | Todo)[]
  /** Nested client engagement, rendered as an indented sub-block. */
  client?: {
    name: string
    period: string
    note: string
    bullets: string[]
  }
}

/**
 * Employer work is proprietary: high level only, no internal numbers.
 * Exception approved 2026-10-14: the Mahindra & Mahindra engagement may be
 * named. Translytics stays generic.
 */
export const experience: Experience[] = [
  {
    company: 'Translytics',
    role: 'Software Engineer',
    start: 'Mar 2026',
    end: 'Present',
    location: 'Pune',
    arrangement: 'On-site',
    summary: 'AI and backend engineering on a multi-tenant supply-chain planning SaaS.',
    bullets: [
      'Ship LLM-backed features and Python backend services, from design through QA and release.',
      // From Abhay's published resume (2026-10-15): high level, no internal detail.
      'Design REST APIs and background jobs for data-heavy planning workflows, and improve how data moves in and out of the platform: imports, validation and exports.',
    ],
  },
  {
    company: 'Tata Elxsi',
    role: 'Software Engineer',
    start: 'Dec 2023',
    end: 'Feb 2026',
    location: 'Pune',
    arrangement: 'On-site',
    summary: 'Two years of production Python, then a deliberate move into generative AI.',
    bullets: [
      'Built a tool that turns legacy test cases into Gherkin feature files, with a web UI to review and export, cutting the manual hand-off between QA and development.',
      'Built FastAPI apps on LLMs and RAG (LangChain, LlamaIndex, Chroma) in the Generative AI bootcamp.',
    ],
    client: {
      name: 'Mahindra & Mahindra · BE 6 and XEV 9E',
      period: 'Mar – Jun 2025',
      note: 'Proprietary client work: no public repository.',
      bullets: [
        'Wrote Python that turns OBD diagnostic data and trouble codes into reports with automatic OK / Not-OK status.',
        'Validated ECU configurations over UDS and traced faults to root cause with Center of Excellence engineers.',
      ],
    },
  },
  {
    company: 'PHN Technology',
    role: 'Intern',
    start: 'Jul 2023',
    end: 'Oct 2023',
    location: 'Pune',
    arrangement: 'Remote',
    summary: 'An end-to-end sports analytics pipeline for the T20 World Cup.',
    bullets: [
      'Scraped ESPN Cricinfo, cleaned it in pandas and modelled a star schema in Power BI.',
      'Shipped a selection dashboard with role filters, drill-downs and head-to-head comparison.',
    ],
  },
  {
    company: 'BitMap Technology',
    role: 'SDE Intern',
    start: 'Jan 2023',
    end: 'May 2023',
    location: 'Pune',
    arrangement: 'Hybrid',
    summary: 'A three-factor login for online banking: face, then email OTP, then a voice phrase.',
    bullets: [
      'OpenCV detection and an LBPH recogniser, with a calibration tool for thresholds.',
      // Measured by Abhay in testing; published in the project's repo README.
      'In testing: about 95% correct identification, and 88% of spoof attempts blocked.',
    ],
  },
]
