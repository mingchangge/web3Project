<template>
  <div>
    <el-tabs v-model="activeName" type="border-card" stretch :lazy="true" @tab-click="handleClick">
      <el-tab-pane v-for="item in sheets" :key="item.tid" :label="item.label" :name="item.tid">
        <h2 class="title">{{ item.label }}</h2>
        <table v-if="tableData" border="1px solid #bcbdc1" id="table"></table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import * as XLSX from 'xlsx'
import axios from 'axios'

export default {
  name: 'ExcelTable',
  data() {
    return {
      url: '/balance_2024.xlsx',
      contentArray: [], //excel表格数据,Excel文件中的每个sheet对应contentArray数组中的一个元素
      data: undefined,
      sheets: [],
      mergeArray: [],
      fromTo: undefined,
      tableData: undefined,
      activeName: 0
    }
  },
  created() {
    axios
      .get(this.url, { responseType: 'arraybuffer' })
      .then((res) => {
        let data = new Uint8Array(res.data)
        let wb = XLSX.read(data, { type: 'array' })
        let sheets = wb.Sheets
        this.transformSheet(sheets)
      })
      .catch((err) => {
        console.log(err)
      })
  },
  methods: {
    handleClick(tab) {
      let index = this.sheets.findIndex((item) => item.label === tab.props.label)
      this.renderTable(index)
    },
    //转换表格数据
    transformSheet(sheets) {
      let count = 0
      for (let key in sheets) {
        //生成tabs
        this.sheets.push({ tid: (count++).toString(), label: key })
        //生成表格数据
        this.contentArray.push(sheets[key])
      }
      this.activeName = this.sheets[0].tid
      this.renderTable(parseInt(this.activeName) || 0)
    },
    //格式化表格数据
    renderTable(index) {
      // 表格的表格范围，可用于判断表头是否数量是否正确
      this.fromTo = this.contentArray[index]['!ref']
      let array = [this.contentArray[index]]
      array = array
        .filter((item) => {
          for (let k in item) {
            if (k.indexOf('!') > -1) {
              return item
            }
          }
        })
        .map((item) => {
          console.log(item, 'item')
        })
      console.log(this.contentArray[index], array)
      // this.tableData = XLSX.utils.sheet_to_json(this.contentArray[index], { raw: true })
    },
    /** 合并单元格
     *  this.mergeArray = this.contentArray[index]['!merges']
      console.log(this.mergeArray, 'this.mergeArray')
      //单元格合并数据
      let merges = this.mergeCells(this.mergeArray)
      console.log(merges)
    */
    mergeCells(merges) {
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
            colStart: start.c,
            colEnd: end.c
          }
          result.push(range)
        }
      }
      return result
    }
  }
}
</script>
