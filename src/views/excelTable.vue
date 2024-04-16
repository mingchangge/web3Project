<template>
  <div>
    <el-tabs v-model="activeName" type="border-card" stretch :lazy="true" @tab-click="handleClick">
      <el-tab-pane v-for="item in sheets" :key="item.tid" :label="item.label" :name="item.tid">
        <h2 class="title">{{ item.label }}</h2>
        <table border="1px solid #bcbdc1" id="table"></table>
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
      mergeArray: [],
      refArray: [],
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
        this.mergeArray.push(sheets[key]['!merges'])
        this.refArray.push(sheets[key]['!ref'])
        this.contentArray.push(XLSX.utils.sheet_to_json(sheets[key], { header: 1 }))
      }
      this.activeName = this.sheets[0].tid
      this.formateExcel(parseInt(this.activeName) || 0)
    },
    formateExcel(index) {
      let merges = this.mergeCells(this.mergeArray[index])
      console.log(merges, 'merges', this.refArray[index])
      //table过滤掉空行
      let table = this.contentArray[index].filter((row) => row.length > 0)
      let tr = ''
      //循环表格数据
      table.forEach((row, r) => {
        for (let j = 0; j < merges.length; j++) {
          let merge = merges[j]
          if (r === merge.rowStart) {
            tr += `<tr rowSpan="${merge.rowSpan}">${td}</tr>`
          }
        }
        let td = ''
        for (let i = 0; i < row.length; i++) {
          td += `<td>${row[i]}</td>`
        }
        tr += `<tr>${td}</tr>`
      })
      //渲染表格
      this.$nextTick(() => {
        document.getElementById('table').innerHTML += tr
      })
    },
    //合并单元格
    mergeCells(merges) {
      console.log(merges, 'merges')
      const result = []
      // [A-Z] -> 65-90
      if (merges) {
        for (let i = 0; i < merges.length; i++) {
          const merge = merges[i]
          const start = merge.s
          const end = merge.e
          const range = {
            rowStart: start.r,
            rowEnd: end.r,
            rowSpan: end.r - start.r + 1,
            colStart: start.c,
            colEnd: end.c,
            colSpan: end.c - start.c + 1
          }
          result.push(range)
        }
      }
      return result
    }
  }
}
</script>
