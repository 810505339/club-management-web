
export function useTranslateText(t: any) {

  const name = computed(() => `${t('shopList.name')}`)
  const areaName = computed(() => `${t('area.name')}`)
  const time = computed(() => t('tickets.tickets') + t('common.time'))
  const state = computed(() => t('common.state'))
  const sum = computed(() => t('tickets.tickets') + t('common.sum'))
  const duration = computed(() => t('common.shelves') + t('common.duration'))
  const price = computed(() => t('common.shelves') + t('common.price'))

  return {
    name,
    areaName,
    time,
    state,
    sum,
    duration,
    price
  }

}
