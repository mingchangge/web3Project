<template>
  <div>
    <el-tabs v-model="activeName" type="border-card" stretch :lazy="true" @tab-click="handleClick">
      <el-tab-pane v-for="item in sheets" :key="item.tid" :label="item.label" :name="item.tid">
        <h2 class="title">{{ item.label }}</h2>
        <table v-if="content" border="1px solid #bcbdc1" id="table"></table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
/**
 * 失败尝试------》读取excel表格并渲染
 * 失败原因------》行合并无法判断
 */
import * as XLSX from 'xlsx'
import axios from 'axios'

export default {
  name: 'ExcelTable',
  data() {
    return {
      url: '/balance_2024.xlsx',
      contentArray: [],
      content: undefined,
      sheets: [],
      activeName: 0
    }
  },
  created() {
    axios
      .get(this.url, { responseType: 'arraybuffer' })
      .then((res) => {
        var data = new Uint8Array(res.data)
        var wb = XLSX.read(data, { type: 'array' })
        var sheets = wb.Sheets
        this.transformSheets(sheets)
      })
      .catch((err) => {
        console.log(err)
      })
  },
  methods: {
    handleClick(tab) {
      let index = this.sheets.findIndex((item) => item.label === tab.props.label)
      this.formateExcel(index)
    },
    //转换表格数据
    transformSheets(sheets) {
      var count = 0
      for (let key in sheets) {
        //读出来的workbook数据很难读,转换为json格式,参考https://github.com/SheetJS/js-xlsx#utility-functions
        this.sheets.push({ tid: (count++).toString(), label: key })
        this.contentArray.push(XLSX.utils.sheet_to_json(sheets[key], { header: 1 }))
      }
      this.activeName = this.sheets[0].tid
      this.formateExcel(parseInt(this.activeName) || 0)
    },
    formateExcel(index) {
      var content = []
      //table过滤掉空行
      let table = this.contentArray[index].filter((row) => row.length > 0)
      //循环表格数据
      table.forEach((row) => {
        this.mergeCells(row)
        content.push(row)
      })
      this.content = content
    },
    //合并单元格
    mergeCells(row) {
      let td = ''
      let mergeCells = []
      row.forEach((cell, index) => {
        if (cell) {
          mergeCells.push(index)
        } else {
          //如果是空单元格,则合并到上一个单元格
          mergeCells.push(index - 1)
        }
      })
      //表格列合并
      for (let i = 1; i <= mergeCells.length; i++) {
        if (mergeCells[i] - mergeCells[i - 1] === 1) {
          td += `<td colspan="1" rowSpan="1">${row[mergeCells[i - 1]]}</td>`
        } else {
          td += `<td colspan="${mergeCells[i] - mergeCells[i - 1]}" rowSpan="1">${row[mergeCells[i - 1]]}</td>`
        }
      }
      let tr = `<tr>${td}</tr>`
      //渲染表格
      this.$nextTick(() => {
        document.getElementById('table').innerHTML += tr
      })
    }
  }
}
</script>
