import Link from 'next/link'
import Image from 'next/image'

export interface FooterProps {
  labels?: {
    description?: string
    project?: string
    about?: string
    catalog?: string
    contribute?: string
    community?: string
    forum?: string
    github?: string
    discussions?: string
    legal?: string
    mitLicense?: string
    ccLicense?: string
    privacy?: string
    copyright?: string
  }
}

const defaultLabels = {
  description: 'Open source encyclopedia of plant species for syntropic agriculture',
  project: 'Project',
  about: 'About',
  catalog: 'Catalog',
  contribute: 'Contribute',
  community: 'Community',
  forum: 'Forum',
  github: 'GitHub',
  discussions: 'Discussions',
  legal: 'Legal',
  mitLicense: 'MIT License',
  ccLicense: 'CC BY-SA 4.0',
  privacy: 'Privacy',
  copyright: 'Made with love by the community',
}

export function Footer({ labels = {} }: FooterProps) {
  const l = { ...defaultLabels, ...labels }
  return (
    <footer className="border-t border-primary-600 bg-gradient-to-br from-primary-700 to-primary-900 py-12 text-primary-100 sm:py-16">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Logo and Description */}
        <div className="mb-10">
          <div className="mb-4">
            <Image
              src="/logo.svg"
              alt="Syntropedia"
              width={180}
              height={40}
              className="h-8 w-auto brightness-0 invert"
            />
          </div>
          <p className="max-w-md text-sm text-primary-200">
            {l.description}
          </p>
        </div>

        {/* Links Grid */}
        <div className="mb-10 grid gap-8 sm:grid-cols-3">
          {/* Project */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-primary-300">
              {l.project}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm transition-colors hover:text-white hover:underline">
                  {l.about}
                </Link>
              </li>
              <li>
                <Link href="/catalog" className="text-sm transition-colors hover:text-white hover:underline">
                  {l.catalog}
                </Link>
              </li>
              <li>
                <Link href="/about#contribute" className="text-sm transition-colors hover:text-white hover:underline">
                  {l.contribute}
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-primary-300">
              {l.community}
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://placenta.opensyntropy.earth"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm transition-colors hover:text-white hover:underline"
                >
                  {l.forum}
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/opensyntropy/syntropedia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm transition-colors hover:text-white hover:underline"
                >
                  {l.github}
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/opensyntropy/syntropedia/discussions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm transition-colors hover:text-white hover:underline"
                >
                  {l.discussions}
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-primary-300">
              {l.legal}
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://opensource.org/licenses/MIT"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm transition-colors hover:text-white hover:underline"
                >
                  {l.mitLicense}
                </a>
              </li>
              <li>
                <a
                  href="https://creativecommons.org/licenses/by-sa/4.0/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm transition-colors hover:text-white hover:underline"
                >
                  {l.ccLicense}
                </a>
              </li>
              <li>
                <Link href="/privacy" className="text-sm transition-colors hover:text-white hover:underline">
                  {l.privacy}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-primary-600 pt-8 text-center">
          <p className="text-xs text-primary-300">
            © {new Date().getFullYear()} OpenSyntropy • {l.copyright}
          </p>
        </div>
      </div>
    </footer>
  )
}
