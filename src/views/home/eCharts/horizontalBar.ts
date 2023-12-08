import { EChartsOption } from "echarts";
import * as echarts from 'echarts';
import { Ref } from "vue";

type Data = Array<{ name: string, data: any[] }>




const usehorizontalBarOptions = (chartDom: Ref<HTMLElement | undefined>) => {

  let myChart: unknown = null
  const data = ref<Data>([])

  const series = computed(() => data.value.map(item => ({
    ...item,
    type: 'bar',
    stack: 'total',
    barWidth: 20,
    borderRadius: 10,
    label: {
      show: true
    },
    emphasis: {
      focus: 'series'
    },
  })))



  onMounted(() => {
    if (chartDom.value)
      myChart = echarts.init(chartDom.value)
  })

  const setOption = (parmas: Data) => {
    data.value = parmas
    const options: EChartsOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          // Use axis to trigger tooltip
          type: 'line' // 'shadow' as default; can also be 'line' or 'shadow'
        }
      },
      legend: {
        textStyle: {
          color: '#fff'
        }
      },
      grid: {
        left: '3%',
        right: '4%',

        top: '100%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        splitLine: {
          show: false
        },
        axisLabel: {
          show: false
        },
      },
      yAxis: {
        type: 'category',
        data: [''],
        splitLine: {
          show: false
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
      },
      series: series.value

    };

    myChart.setOption(options)
  }

  return {
    setOption
  }




}


export default usehorizontalBarOptions
