import { EChartsOption } from "echarts";
import * as echarts from 'echarts';




const useBarOptions = (chartDom: HTMLElement) => {

  const myChart = echarts.init(chartDom)
  const options: EChartsOption = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center',
      textStyle: {
        color: '#fff'
      }
    },
    series: [
      {

        type: 'pie',
        radius: ['50%', '10%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 5,
          borderColor: '#fff',
          borderWidth: 1
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
        data: [
          { value: 1048, name: '预定门票' },
          { value: 735, name: '预定卡座' },
          { value: 580, name: '拼酒局' },
        ]
      }
    ],
    grid: {
      bottom: '10%'
    }
  };



  options && myChart.setOption(options)
}


export default useBarOptions
