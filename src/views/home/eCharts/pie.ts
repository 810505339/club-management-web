import { EChartsOption } from "echarts";
import * as echarts from 'echarts';
import { Ref } from "vue";

type IData = Array<{ name: string, value: string }>




const useBarOptions = (chartDom: Ref<HTMLElement | undefined>, opt: any) => {
  let myChart: unknown = null
  const data = ref<IData>([])
  const { radius = ['50%', '10%'], legend = {
    top: '5%',
    left: 'center',
    textStyle: {
      color: '#fff'
    },
  }, grid = {
    bottom: '10%'
  }, center = ['50%', '50%'] } = opt



  onMounted(() => {
    if (chartDom.value) {
      myChart = echarts.init(chartDom.value)
    }
  })

  const setOption = (parmams: IData) => {

    data.value = parmams
    const options: EChartsOption = {
      tooltip: {
        trigger: 'item',
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: '{b} : {c} <br/>百分比 : {d}%' //{a}（系列名称），{b}（数据项名称），{c}（数值）, {d}（百分比）
      },
      legend: legend,
      series: [
        {

          type: 'pie',
          radius: radius,
          center: center,
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 5,
            borderColor: '#fff',
            borderWidth: 0
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 10,
              fontWeight: 'bold',
              color: '#fff'
            }
          },
          labelLine: {
            show: false
          },
          data: data.value
        }
      ],
      grid: grid
    };

    myChart.setOption(options)
  }

  return {
    setOption
  }
}


export default useBarOptions
