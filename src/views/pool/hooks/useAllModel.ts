import { allMode } from "/@/api/admin/pool"

type IModelItem = {
  winePartyMode: string
  modeName: string
}
export default () => {
  const modeList = ref<IModelItem[]>([])

  onMounted(async () => {
    const { data } = await allMode()
    modeList.value = data
  })

  return {
    modeList
  }
}
