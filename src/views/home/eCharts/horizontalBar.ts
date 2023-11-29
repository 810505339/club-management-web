import { EChartsOption } from "echarts";
import * as echarts from 'echarts';


const usehorizontalBarOptions = (chartDom: HTMLElement) => {

  const myChart = echarts.init(chartDom)
  const COLORS = ['#91CC75FF', '#FAC758FF', '#EE6667FF',];
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
      bottom: '3%',
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
    series: [
      {
        name: '男',
        type: 'bar',
        stack: 'total',
        label: {
          show: true
        },
        emphasis: {
          focus: 'series'
        },
        data: [320]
      },
      {
        name: '女',
        type: 'bar',
        stack: 'total',
        label: {
          show: true
        },
        emphasis: {
          focus: 'series'
        },
        data: [120]
      },
      {
        name: '未知',
        type: 'bar',
        stack: 'total',
        label: {
          show: true
        },
        emphasis: {
          focus: 'series'
        },
        data: [220]
      },

    ]
  };



  options && myChart.setOption(options)
}


export default usehorizontalBarOptions
