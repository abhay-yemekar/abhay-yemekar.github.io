export type Experience = {
  company: string
  role: string
  start: string
  end: string
  location: string
  arrangement: 'On-site' | 'Remote' | 'Hybrid'
  /** Short framing line shown above the bullets. */
  summary: string
  bullets: string[]
  /** Nested client engagement, rendered as an indented sub-block. */
  client?: {
    name: string
    period: string
    note: string
    bullets: string[]
  }
}

export const experience: Experience[] = [
  {
    company: 'Translytics',
    role: 'Software Engineer',
    start: 'Mar 2026',
    end: 'Present',
    location: 'Pune City, Maharashtra',
    arrangement: 'On-site',
    summary:
      'Python, AI/ML and LLM engineering in a supply-chain-adjacent product context.',
    bullets: [
      'Building backend services and AI-enabled workflows in Python.',
      'Working across LLM integration, API design and data-heavy processing.',
    ],
  },
  {
    company: 'Tata Elxsi',
    role: 'Software Engineer',
    start: 'Dec 2023',
    end: 'Feb 2026',
    location: 'Pune',
    arrangement: 'On-site',
    summary:
      'Two years across the SDLC, then a deliberate pivot into generative AI engineering.',
    bullets: [
      'Applied SDLC practice end to end: Python development, Git, Jira, and unit and integration testing on collaborative production projects.',
      'Generative AI Bootcamp — built Python and FastAPI AI applications using LLMs, RAG, LangChain and LlamaIndex, with Chroma and Postgres as vector stores.',
      'Built a Python tool converting legacy test cases from Excel, CSV, Word and plain text into Gherkin .feature files for BDD, with a web UI to upload, preview, edit and export — cutting manual QA-to-Dev handoff effort.',
      'Completed a Kafka Bootcamp alongside continuing work in advanced Python, data analytics and cloud.',
    ],
    client: {
      name: 'Mahindra & Mahindra — BE 6 & XEV 9E',
      period: 'Mar – Jun 2025',
      note: 'Proprietary automotive client work — no public repository.',
      bullets: [
        'Wrote Python scripts to parse and analyse OBD diagnostic data and Diagnostic Trouble Codes (DTCs).',
        'Ran ECU diagnostics with the MDLR tool over UDS interfaces to validate software configurations.',
        'Built structured Excel reporting with automated OK/Not-OK status and OTA-impact tracking.',
        'Performed root-cause analysis, validated fixes with Center of Excellence engineers, and explored ML for predictive fault detection.',
      ],
    },
  },
  {
    company: 'PHN Technology Pvt Ltd',
    role: 'Intern',
    start: 'Jul 2023',
    end: 'Oct 2023',
    location: 'Pune District, Maharashtra',
    arrangement: 'Remote',
    summary:
      'Built an end-to-end sports analytics pipeline for the T20 World Cup.',
    bullets: [
      'Owned the full workflow: Bright Data scraping of ESPN Cricinfo, pandas cleaning, Power Query shaping, and a star-schema model in Power BI.',
      'Delivered an interactive dashboard with role filters, player drill-downs and head-to-head comparison to support Playing XI selection.',
      'Shipped as CricketStat Pro — see Projects.',
    ],
  },
  {
    company: 'BitMap Technology Pvt Ltd',
    role: 'SDE Intern',
    start: 'Jan 2023',
    end: 'May 2023',
    location: 'Pune District, Maharashtra',
    arrangement: 'Hybrid',
    summary:
      'Built a facial-recognition authentication system for online banking.',
    bullets: [
      'Designed and shipped a three-factor authentication flow combining face recognition, email OTP and voice phrase verification.',
      'Integrated OpenCV for detection and an LBPH model for recognition, with a calibration tool for threshold tuning.',
      'Shipped as AI-Powered 3-Factor Login — see Projects for measured results.',
    ],
  },
]
