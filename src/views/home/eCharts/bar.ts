import { EChartsOption } from "echarts";
import * as echarts from 'echarts';


const useBarOptions = (chartDom: HTMLElement) => {

  const myChart = echarts.init(chartDom)
  const COLORS = ['#91CC75FF', '#FAC758FF', '#EE6667FF',];
  const options: EChartsOption = {
    xAxis: {
      type: 'category',
      splitLine: {
        show: false
      },
      axisTick: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      data: ['区域1', '区域2', '区域3'],
      axisLabel: {
        color: '#D5DFFFFF'
      }
    },
    yAxis: {
      type: 'value',
      splitLine: {
        show: false
      },
      axisLabel: {
        show: false
      },

    },
    series: [
      {
        data: [120, 200, 150],

        type: 'bar',
        itemStyle: {
          color: (item) => COLORS[item.dataIndex % (COLORS.length)],
          borderRadius: 10
        },
        label: {
          show: true,
          position: 'top', //在上方显示
          color: '#fff',
          fontSize: 10
        }
      }
    ],
    grid: [
      {
        bottom: '10%',

      }
    ]
  };



  options && myChart.setOption(options)
}


export default useBarOptions
