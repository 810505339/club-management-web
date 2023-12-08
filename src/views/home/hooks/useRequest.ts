import { Ref } from "vue";
import { IParams, wineParty, orderSale, enterStore, drinkMealRanking, customerAgeGender, areaPreference } from '/@/api/admin/dataBoard'



export default (parmas: Ref<IParams>) => {
  const parmasRequest = parmas.value
  const resList = ref<any[]>([])
  watchEffect(async () => {
    resList.value = await Promise.all([orderSale(parmasRequest), drinkMealRanking(parmasRequest), areaPreference(parmasRequest), customerAgeGender(parmasRequest), enterStore(parmasRequest), wineParty(parmasRequest)])

    console.log(resList.value);
    console.log(parmas.value);

  })
  return {
    resList
  }
}


