import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updatePhotos() {
  console.log('🔄 Updating photo URLs from via.placeholder.com to SVG data URIs...\n')

  // Get all photos with via.placeholder.com URLs
  const photos = await prisma.photo.findMany({
    where: {
      url: {
        contains: 'via.placeholder.com'
      }
    },
    include: {
      species: {
        select: {
          scientificName: true
        }
      }
    }
  })

  console.log(`Found ${photos.length} photos to update\n`)

  for (const photo of photos) {
    const scientificName = photo.species?.scientificName || 'No Image'
    // SVG placeholder - no external network call needed
    const photoUrl = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect width='800' height='600' fill='%234ade80'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='white'%3E${encodeURIComponent(scientificName)}%3C/text%3E%3C/svg%3E`

    await prisma.photo.update({
      where: { id: photo.id },
      data: { url: photoUrl }
    })

    console.log(`  ✅ Updated photo for ${scientificName}`)
  }

  console.log('\n🎉 All photos updated successfully!')
}

updatePhotos()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
