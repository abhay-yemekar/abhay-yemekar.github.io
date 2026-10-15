import type { Todo } from '../lib/todo'

/**
 * Bio. Abhay's own sentences, condensed (docs/AUDIT.md P1-3: the earlier
 * version made the same "messy to clean" point four times). The middle
 * paragraph ties the voice to the projects; every claim in it is visible in a
 * case study.
 */
export const about: { lede: string; paragraphs: string[]; personal: string | Todo } = {
  lede: 'I like building things that actually work.',

  paragraphs: [
    'Tools, workflows, AI systems, and small utilities that make someone’s day easier. I start from the root of a problem, simplify it, and shape it into something structured and dependable.',
    'Most of what I build now follows one rule: the model proposes, and code checks. HireLens won’t count a score whose quote isn’t in the resume. SearchScribe never lets a model write HTML.',
    'Good engineering is clarity, not complexity: predictable behaviour, and decisions I can explain.',
  ],

  // From the education record already on this site.
  personal:
    'At college I coordinated Team Pragyaa, one of the institute’s largest national socio-technical fests, and volunteered at Smart India Hackathon 2020.',
}
