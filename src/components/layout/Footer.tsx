import Link from 'next/link'
import { Sprout } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-900 py-12 text-gray-300 sm:py-16">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Logo and Description */}
        <div className="mb-10">
          <div className="mb-4 flex items-center gap-2">
            <Sprout className="h-5 w-5 text-primary-500" />
            <span className="text-lg font-semibold text-white">Syntropedia</span>
          </div>
          <p className="max-w-md text-sm text-gray-400">
            Sistema open-source para agricultura sintrópica e agrofloresta
          </p>
        </div>

        {/* Links Grid */}
        <div className="mb-10 grid gap-8 sm:grid-cols-3">
          {/* Projeto */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
              Projeto
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/sobre" className="text-sm transition-colors hover:text-white hover:underline">
                  Sobre
                </Link>
              </li>
              <li>
                <Link href="/catalogo" className="text-sm transition-colors hover:text-white hover:underline">
                  Catálogo
                </Link>
              </li>
              <li>
                <Link href="/sobre#contribuir" className="text-sm transition-colors hover:text-white hover:underline">
                  Contribuir
                </Link>
              </li>
            </ul>
          </div>

          {/* Comunidade */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
              Comunidade
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://placenta.opensyntropy.earth"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm transition-colors hover:text-white hover:underline"
                >
                  Fórum
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/opensyntropy/syntropedia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm transition-colors hover:text-white hover:underline"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/opensyntropy/syntropedia/discussions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm transition-colors hover:text-white hover:underline"
                >
                  Discussões
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://opensource.org/licenses/MIT"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm transition-colors hover:text-white hover:underline"
                >
                  Licença MIT
                </a>
              </li>
              <li>
                <a
                  href="https://creativecommons.org/licenses/by-sa/4.0/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm transition-colors hover:text-white hover:underline"
                >
                  CC BY-SA 4.0
                </a>
              </li>
              <li>
                <Link href="/privacidade" className="text-sm transition-colors hover:text-white hover:underline">
                  Privacidade
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} OpenSyntropy • Feito com ❤️ pela comunidade
          </p>
        </div>
      </div>
    </footer>
  )
}
