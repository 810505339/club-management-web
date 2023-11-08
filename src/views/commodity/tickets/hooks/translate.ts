
export function useTranslateText(t: any) {

  const name = computed(() => t('tickets.tickets') + t('common.name'))
  const areaName = computed(() => `${t('shopList.name')}-${t('area.name')}`)
  const time = computed(() => t('tickets.tickets') + t('common.time'))
  const state = computed(() => t('common.state'))
  const sum = computed(() => t('tickets.tickets') + t('common.sum'))
  const duration = computed(() => t('common.shelves') + t('common.duration'))
  const price = computed(() => t('common.shelves') + t('common.price'))
  const detail = computed(() => t('tickets.tickets') + t('common.detail'))
  const image = computed(() => t('tickets.tickets') + t('common.image'))
  const beginTime = computed(() => t('common.inputTimeTip1'))
  const endTime = computed(() => t('common.inputTimeTip2'))
  const shelvesTime = computed(() => t('common.shelves') + t('common.time'))
  const takedownTime = computed(() => t('common.takedown') + t('common.time'))
  const ticketsDemo = computed(() => t('tickets.ticketsdemo') + t('common.name'))

  return {
    name,
    areaName,
    time,
    state,
    sum,
    duration,
    price,
    detail,
    image,
    beginTime,
    endTime,
    shelvesTime,
    takedownTime,
    ticketsDemo
  }

}
