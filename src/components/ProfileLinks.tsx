import { profile } from '../data/profile'
import { ExternalArrow, GitHubIcon, LinkedInIcon } from './Icons'

/**
 * GitHub and LinkedIn as round icon buttons, then the resume as an outlined
 * pill: the one link here a recruiter is most likely to want. They sit in the
 * sticky header on every page. Every link opens in a new tab, so the visitor
 * keeps their place.
 */
export function ProfileLinks() {
  return (
    <ul className="m-0 flex list-none items-center p-0">
      <li>
        <a href={profile.links.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" title="GitHub" className="u-icon-btn">
          <GitHubIcon />
        </a>
      </li>
      <li>
        <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="LinkedIn" className="u-icon-btn">
          <LinkedInIcon />
        </a>
      </li>
      {/* Only once public/resume.pdf exists and resumeUrl points at it. */}
      {profile.resumeUrl && (
        <li className="ml-1">
          <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" aria-label="Resume (PDF)" className="u-pill-link">
            <span className="u-pill">
              Resume
              {/* Phones need the room: the header has to fit in 320px. */}
              <span className="hidden sm:contents">
                <ExternalArrow />
              </span>
            </span>
          </a>
        </li>
      )}
    </ul>
  )
}
