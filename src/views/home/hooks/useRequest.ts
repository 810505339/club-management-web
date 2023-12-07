import { Ref } from "vue";

export type IParmas = {
  storeId: string;
  beginDate: string,
  endDate: string,
}
export default (parmas: Ref<IParmas>) => {


  watchEffect(async () => {
    await Promise.all()
  })
}


