<template>
  <v-gantt-chart :startTime="startTime"
                 :endTime="endTime"
                 :datas="datas">
    <template v-slot:block="{data,item}">
      <!-- 你的容器块组件 -->
      <Test :data="data" :item="item"></Test>
    </template>
    <template v-slot:left="{data}">
      <!-- 你的行名组件 -->
      <TestLeft :data="data"></TestLeft>
    </template>
    <template v-slot:title>
      <!-- 你的表头组件 -->
      hola
    </template>
  </v-gantt-chart>
</template>

<script>
  export default {
    name: 'index'
  }
</script>

<style scoped>

</style>
