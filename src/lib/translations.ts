import { useTranslations } from '@/lib/IntlProvider'
import type { Stratum, SuccessionalStage, LifeCycle } from '@/types/species'

export function useStratumLabel(stratum: Stratum): string {
  const t = useTranslations('stratum')
  return t(stratum)
}

export function useSuccessionalStageLabel(stage: SuccessionalStage): string {
  const t = useTranslations('successionalStage')
  return t(stage)
}

export function useLifeCycleLabel(lifeCycle: LifeCycle): string {
  const t = useTranslations('lifeCycle')
  return t(lifeCycle)
}

// For use in components
export function useSpeciesTranslations() {
  const tStratum = useTranslations('stratum')
  const tStage = useTranslations('successionalStage')
  const tLifeCycle = useTranslations('lifeCycle')

  return {
    getStratumLabel: (stratum: Stratum) => tStratum(stratum),
    getStageLabel: (stage: SuccessionalStage) => tStage(stage),
    getLifeCycleLabel: (lifeCycle: LifeCycle) => tLifeCycle(lifeCycle),
  }
}
