import { EChartsOption } from "echarts";
import * as echarts from 'echarts';
import { Ref } from "vue";
type YData = Array<string>
type XData = Array<string>

type IParams = {
  xData: XData
  yData: YData
}


const useBarOptions = (chartDom: Ref<HTMLElement | undefined>) => {

  let myEcharts: unknown = null;
  const yData = ref<YData>([])
  const xData = ref<XData>([])
  const COLORS = ['#91CC75FF', '#FAC758FF', '#EE6667FF', '#711DB0', '#C21292', '#EF4040', '#FFA732', '#22092C', '#872341', '#BE3144',
    '#F05941', '#371B58', '#4C3575', '#5B4B8A', '#7858A6', '#FED9ED', '#E7BCDE', '#67729D'];


  onMounted(() => {
    if (chartDom.value) {
      myEcharts = echarts.init(chartDom.value)
    }

  })

  const setOption = (params: IParams) => {
    xData.value = params.xData
    yData.value = params.yData
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
        data: xData.value,
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
          data: yData.value,

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
          bottom: '20%',

        }
      ],
      dataZoom: [
        {
          // 设置滚动条的隐藏与显示
          show: true,
          // 设置滚动条类型
          type: "inside",
          // 设置背景颜色


          // 是否显示detail，即拖拽时候显示详细数值信息
          showDetail: false,
          // 数据窗口范围的起始数值
          startValue: 0,
          // 数据窗口范围的结束数值（一页显示多少条数据）
          endValue: 5,
          // empty：当前数据窗口外的数据，被设置为空。
          // 即不会影响其他轴的数据范围
          filterMode: "empty",
          // 设置滚动条宽度，相对于盒子宽度
          width: "100%",
          // 设置滚动条高度
          height: 8,
          // 设置滚动条显示位置
          left: "center",
          // 是否锁定选择区域（或叫做数据窗口）的大小
          zoomLoxk: true,
          // 控制手柄的尺寸
          handleSize: 0,
          // dataZoom-slider组件离容器下侧的距离
          bottom: 3,
        },
        {
          // 没有下面这块的话，只能拖动滚动条，
          // 鼠标滚轮在区域内不能控制外部滚动条
          type: "inside",
          // 滚轮是否触发缩放
          zoomOnMouseWheel: false,
          // 鼠标滚轮触发滚动
          moveOnMouseMove: true,
          moveOnMouseWheel: true,
        },

      ]//滚动条
    };
    myEcharts.setOption(options, true)
  }



  return {
    setOption
  }
}


export default useBarOptions
