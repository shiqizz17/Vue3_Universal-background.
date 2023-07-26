<script>
import { getCurrentInstance, onMounted, ref, reactive } from 'vue'
import * as echarts from 'echarts';

export default {
  setup() {
    // const tableData = [
    //   {
    //     name: '华为',
    //     todayBuy: 5000,
    //     monthBuy: 3500,
    //     totalBuy: 22000
    //   },
    //   {
    //     name: 'VIVO',
    //     todayBuy: 3000,
    //     monthBuy: 5000,
    //     totalBuy: 29000
    //   },
    //   {
    //     name: '荣耀',
    //     todayBuy: 2000,
    //     monthBuy: 4500,
    //     totalBuy: 30000
    //   },
    //   {
    //     name: 'OPPO',
    //     todayBuy: 2000,
    //     monthBuy: 3000,
    //     totalBuy: 20000
    //   },
    //   {
    //     name: '一加',
    //     todayBuy: 2300,
    //     monthBuy: 2200,
    //     totalBuy: 19000
    //   }
    // ]
    const { proxy } = getCurrentInstance()

    const tableData = ref([])
    const countData = ref([])

    const tableLabel = {
      name: '手机型号',
      todayBuy: '今日购买',
      monthBuy: '本月购买',
      totalBuy: '总购买'
    }

    // 使用mockjs模拟首页表格数据并获取
    const getTableList = async () => {
      //线上fastmock的使用 
      // await axios.get('https://www.fastmock.site/mock/d06886e1b4007c4cf9793e24aa215d5c/api/home/getTableData').then((res) => {
      //   console.log(res)
      //   if(res.data.code == 200) {
      //     tableData.value = res.data.data.tableData
      //   }
      // })
      const res = await proxy.$api.getTableData()
      console.log(res)
      tableData.value = res.tableData
    }

    // 获取首页右上方count数据
    const getCountData = async () => {
      const res = await proxy.$api.getCountData()
      console.log(res)
      countData.value = res
    }

    onMounted(() => {
      // 获取首页表格数据
      getTableList(),
        // 获取右上角count数据
        getCountData(),
        // 获取Echarts数据
        getChartData()
    })

    // 关于echarts表格的渲染部分
    let xOptions = reactive({
      // 图例文字颜色
      textStyle: {
        color: '#333'
      },
      grid: {
        left: '20%'
      },
      // 提示框
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: [],
        axisLine: {
          lineStyle: {
            color: '#17b3a3'
          }
        },
        axisLable: {
          interval: 0,
          color: '#333'
        }
      },
      yAxis: [
        {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#17b3a3'
            }
          }
        }
      ],
      color: ['#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80', '#8d98b3'],
      seri: []
    })

    let orderData = reactive({
      xData: [],
      series: [],
    })

    let pieOptions = reactive({
      tooltip: {
        trigger: 'item'
      },
      color: [
        '#0f78f4', '#dd536b', '#9e62e5', '#a6a6a6', '#e1bb22', '#39c362', '#3ed1cf'
      ],
      series: []
    })

    let userData = reactive({
      xData: [],
      series: []
    })

    let videoData = reactive({
      series: []
    })

    // 获取数据
    const getChartData = async () => {
      let result = await proxy.$api.getChartData()
      console.log(result)
      let res = result.orderData
      let userRes = result.userData
      let videoRes = result.videoData

      // 折线图渲染过程
      orderData.xData = res.date
      const keyArray = Object.keys(res.data[0])
      console.log(keyArray)  // ['华为', 'VIVO', '荣耀', 'OPPO', '一加']
      const series = []
      keyArray.forEach((key) => {
        series.push({
          name: key,
          data: res.data.map((item) => item[key]),
          type: 'line'
        })
      })

      orderData.series = series
      xOptions.xAxis.data = orderData.xData
      xOptions.series = orderData.series

      // orderData进行渲染
      let hEcharts = echarts.init(proxy.$refs['echart'])
      hEcharts.setOption(xOptions)

      // 柱状图进行渲染过程
      userData.xData = userRes.map((item) => item.date)
      userData.series = [
        {
          name: '新增用户',
          data: userRes.map((item) => item.new),
          type: 'bar'
        },
        {
          name: '活跃用户',
          data: userRes.map((item) => item.active),
          type: 'bar'
        }
      ]
      xOptions.xAxis.data = userData.xData
      xOptions.series = userData.series

      // userData进行渲染
      let uEcharts = echarts.init(proxy.$refs['userechart'])
      uEcharts.setOption(xOptions)

      // 饼状图渲染
      videoData.series = [
        {
          data: videoRes,
          type: 'pie'
        }
      ]
      pieOptions.series = videoData.series
      let vEcharts = echarts.init(proxy.$refs['videoechart'])
      vEcharts.setOption(pieOptions)
    }

    return {
      tableData,
      tableLabel,
      countData
    }
  }
}
</script>

<template>
  <el-row class="home" :gutter="20">
    <!-- home组件左侧个人信息、表格的实现 -->
    <el-col :span="8">
      <el-card shadow="hover">
        <div class="user">
          <img src="../../assets/萌猫.jpg" alt="">
          <div class="user-info">
            <p class="name">Admin</p>
            <p class="role"> 超级管理员</p>
          </div>
        </div>
        <div class="login-info">
          <p>上次登陆时间：<span>2022-11-17</span></p>
          <p>上次登陆地点：<span>河北唐山</span></p>
        </div>
      </el-card>
      <el-card shadow="hover" style="margin-top: 20px">
        <el-table :data="tableData">
          <el-table-column v-for="(val, key) in tableLabel" :key="key" :prop="key" :label="val">
          </el-table-column>
        </el-table>
      </el-card>
    </el-col>

    <!-- 右侧订单统计、图表的实现 -->
    <el-col :span="16">
      <div class="num">
        <el-card :body-style="{ display: 'flex', padding: 0 }" v-for="item in countData" :key="item.name">
          <component class="icon" :is="item.icon" :style="{ background: item.color }">
          </component>
          <div class="details">
            <p class="money">￥{{ item.value }}</p>
            <p class="txt">{{ item.name }}</p>
          </div>
        </el-card>
      </div>
      <el-card style="height: 240px">
        <div ref="echart" style="height: 240px"></div>
      </el-card>
      <div class="graph">
        <el-card style="height:200px">
          <div ref="userechart" style="height: 200px" class="hh"></div>
        </el-card>
        <el-card style="height: 200px">
          <div ref="videoechart" style="height: 200px"></div>
        </el-card>
      </div>
    </el-col>
  </el-row>
</template>

<style lang="less" scoped>
.home {
  .user {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 1px solid #ccc;
    margin-bottom: 20px;

    img {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      margin-right: 35px;
    }

    .user-info {
      .role {
        display: block;
        margin-top: 10px;
        color: #999;
      }
    }
  }

  .login-info {
    p {
      line-height: 30px;
      font-size: 14px;
      font-weight: 600;

      span {
        color: #888;
        margin-left: 20px;
      }
    }
  }
}

.num {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  .el-card {
    width: 32%;
    margin-bottom: 10px;
  }

  .icon {
    width: 65px;
    height: 65px;
    line-height: 65px;
    color: #fff;
  }

  .details {
    margin-left: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .money {
      font-size: 20px;
      font-weight: 500;
      margin-bottom: 5px;
    }

    .txt {
      font-size: 12px;
      color: #999;
    }
  }
}

.graph {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;

  .el-card {
    width: 48%;
  }
}
</style>