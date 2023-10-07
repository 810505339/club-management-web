
export function useTranslateText(t: any) {
  const title = computed(() => t('dynamic.dynamic') + t('dynamic.title'))
  const titlePlaceholder = computed(() => `${t('common.please')}${title.value}`)
  const titleChinese = computed(() => title.value + t('dynamic.chinese'))
  const titleEnglish = computed(() => title.value + t('dynamic.english'))
  const type = computed(() => t('dynamic.dynamic') + t('dynamic.type'))
  const typePlaceholder = computed(() => `${t('common.please')}${type.value}`)
  const status = computed(() => t('dynamic.dynamic') + t('dynamic.status'))
  const statusPlaceholder = computed(() => `${t('common.please')}${status.value}`)
  const context = computed(() => t('dynamic.dynamic') + t('dynamic.context'))
  const contextChinese = computed(() => context.value + t('dynamic.chinese'))
  const contextEnglish = computed(() => context.value + t('dynamic.english'))

  return {
    title,
    titlePlaceholder,
    titleChinese,
    titleEnglish,
    type,
    typePlaceholder,
    status,
    statusPlaceholder,
    context,
    contextChinese,
    contextEnglish,
  }

}
