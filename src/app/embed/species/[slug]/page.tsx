import { notFound } from 'next/navigation'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { Leaf, TrendingUp, Layers, TreeDeciduous } from 'lucide-react'

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

// Format enum values for display
function formatEnumValue(value: string | null): string {
  if (!value) return ''
  return value
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

async function getSpecies(slug: string) {
  const species = await prisma.species.findUnique({
    where: { slug },
    include: {
      photos: {
        where: { primary: true },
        take: 1,
      },
    },
  })
  return species
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function EmbedSpeciesPage({ params }: PageProps) {
  const { slug } = await params
  const species = await getSpecies(slug)

  if (!species) {
    notFound()
  }

  const photoUrl = species.photos[0]?.url || '/images/species-placeholder.png'
  const speciesUrl = `${SITE_URL}/species/${slug}`

  return (
    <html>
      <head>
        <style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
            min-height: 100vh;
          }
        `}</style>
      </head>
      <body>
        <a
          href={speciesUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'block',
            textDecoration: 'none',
            color: 'inherit',
            height: '100%',
          }}
        >
          <div style={{
            display: 'flex',
            height: '100%',
            minHeight: '280px',
            background: 'white',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            border: '1px solid #e5e7eb',
          }}>
            {/* Image Section */}
            <div style={{
              width: '40%',
              minWidth: '200px',
              position: 'relative',
              background: '#f3f4f6',
            }}>
              <Image
                src={photoUrl}
                alt={species.scientificName}
                fill
                style={{ objectFit: 'cover' }}
                unoptimized={photoUrl.startsWith('http')}
              />
            </div>

            {/* Content Section */}
            <div style={{
              flex: 1,
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}>
              {/* Header */}
              <div>
                <h1 style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: '#166534',
                  fontStyle: 'italic',
                  marginBottom: '4px',
                }}>
                  {species.scientificName}
                </h1>
                {species.commonNames.length > 0 && (
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#6b7280',
                  }}>
                    {species.commonNames.slice(0, 3).join(' • ')}
                  </p>
                )}
              </div>

              {/* Properties Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '8px',
                flex: 1,
              }}>
                {species.stratum && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    background: '#f0fdf4',
                    borderRadius: '8px',
                  }}>
                    <Layers size={16} color="#16a34a" />
                    <div>
                      <div style={{ fontSize: '0.625rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Stratum</div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 500, color: '#374151' }}>{formatEnumValue(species.stratum)}</div>
                    </div>
                  </div>
                )}

                {species.successionalStage && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    background: '#f0fdf4',
                    borderRadius: '8px',
                  }}>
                    <Leaf size={16} color="#16a34a" />
                    <div>
                      <div style={{ fontSize: '0.625rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Stage</div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 500, color: '#374151' }}>{formatEnumValue(species.successionalStage)}</div>
                    </div>
                  </div>
                )}

                {species.growthRate && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    background: '#f0fdf4',
                    borderRadius: '8px',
                  }}>
                    <TrendingUp size={16} color="#16a34a" />
                    <div>
                      <div style={{ fontSize: '0.625rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Growth</div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 500, color: '#374151' }}>{formatEnumValue(species.growthRate)}</div>
                    </div>
                  </div>
                )}

                {species.heightMeters && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    background: '#f0fdf4',
                    borderRadius: '8px',
                  }}>
                    <TreeDeciduous size={16} color="#16a34a" />
                    <div>
                      <div style={{ fontSize: '0.625rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Height</div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 500, color: '#374151' }}>{Number(species.heightMeters)}m</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Uses Tags */}
              {species.uses.length > 0 && (
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '6px',
                }}>
                  {species.uses.slice(0, 4).map((use) => (
                    <span
                      key={use}
                      style={{
                        fontSize: '0.625rem',
                        padding: '4px 8px',
                        background: '#dcfce7',
                        color: '#166534',
                        borderRadius: '9999px',
                        fontWeight: 500,
                      }}
                    >
                      {formatEnumValue(use)}
                    </span>
                  ))}
                  {species.uses.length > 4 && (
                    <span style={{
                      fontSize: '0.625rem',
                      padding: '4px 8px',
                      background: '#f3f4f6',
                      color: '#6b7280',
                      borderRadius: '9999px',
                    }}>
                      +{species.uses.length - 4}
                    </span>
                  )}
                </div>
              )}

              {/* Footer */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '8px',
                borderTop: '1px solid #e5e7eb',
                marginTop: 'auto',
              }}>
                <span style={{
                  fontSize: '0.75rem',
                  color: '#16a34a',
                  fontWeight: 500,
                }}>
                  View on Syntropedia →
                </span>
                <img
                  src={`${SITE_URL}/logo.svg`}
                  alt="Syntropedia"
                  style={{ height: '20px', opacity: 0.6 }}
                />
              </div>
            </div>
          </div>
        </a>
      </body>
    </html>
  )
}
