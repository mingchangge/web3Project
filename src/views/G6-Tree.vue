<template>
  <div class="tree" ref="container" style="width: 1000px; height: 1000px"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import G6 from '@antv/g6'

const rectStyle = [
  {
    fill: '#eff4ff',
    stroke: '#5f95ff'
  },
  {
    fill: '#eff5ec',
    stroke: '#91cd75'
  },
  {
    fill: '#f5e8d8',
    stroke: '#FF8C00'
  },
  {
    fill: '#f0d7df',
    stroke: '#DB7093'
  },
  {
    fill: '#eefffd',
    stroke: '#40E0D0'
  }
]
G6.registerNode(
  'tree-node',
  {
    drawShape: function drawShape(cfg, group) {
      const rect = group.addShape('rect', {
        attrs: {
          fill: rectStyle[cfg.depth % 5].fill,
          stroke: rectStyle[cfg.depth % 5].stroke,
          x: 0,
          y: 0,
          width: 1,
          height: 1
        },
        name: 'rect-shape'
      })
      const text = group.addShape('text', {
        attrs: {
          text: cfg.id,
          x: 0,
          y: 0,
          fontSize: 14,
          textAlign: 'left',
          lineHeight: 20,
          textBaseline: 'middle',
          fill: '#666'
        },
        name: 'text-shape'
      })
      const bbox = text.getBBox()
      const hasChildren = cfg.children && cfg.children.length > 0
      rect.attr({
        x: -bbox.width / 2 - 4,
        y: -bbox.height / 2 - 6,
        width: bbox.width + (hasChildren ? 26 : 12),
        height: bbox.height + 12
      })
      text.attr({
        x: -bbox.width / 2,
        y: 0
      })
      if (hasChildren) {
        group.addShape('marker', {
          attrs: {
            x: bbox.width / 2 + 12,
            y: 0,
            r: 6,
            symbol: cfg.collapsed ? G6.Marker.expand : G6.Marker.collapse,
            stroke: '#666',
            lineWidth: 2
          },
          name: 'collapse-icon'
        })
      }
      return rect
    },
    update: undefined
  },
  'single-shape'
)
// tooltip 配置
const tooltip = new G6.Tooltip({
  offsetX: 10,
  offsetY: 10,
  getContent(e) {
    const outDiv = document.createElement('div')
    outDiv.className = 'g6-tooltip'
    let name = e.item.getModel().name
    if (name.includes('\n')) {
      let text = ''
      let nameArr = name.split('\n')
      nameArr.forEach((item) => {
        text += `<p>${item}</p>`
      })
      outDiv.innerHTML = text
    } else {
      outDiv.innerHTML = name
    }
    return outDiv
  },
  itemTypes: ['node']
})
// 自定义边
G6.registerEdge(
  'cubic-horizontal-edge',
  {
    afterDraw: (cfg) => {
      cfg.style = {
        stroke: '#A3B1BF',
        lineWidth: 1,
        endArrow: {
          path: 'M 0,0 L 6,3 L 6,-3 Z',
          d: 0,
          fill: '#A3B1BF'
        }
      }
    },
    update: undefined
  },
  'cubic-horizontal'
)
// 数据
let data = {
  value: 50,
  id: '20240407GP180630',
  name: '20240407GP180630\n 时间：2024-04-08\n 价格：600\n 数量：500\n 持有者：XXXXXX\n 品种：原煤\n 原始发售方：XXXXXXXXXXXXX',
  depth: 0,
  children: [
    {
      id: '2024040736644083184',
      value: 30,
      name: '2024040736644083184\n 时间：2024-04-18\n 价格：600\n 数量：500\n 持有者：XXXXXX\n 品种：原煤\n',
      depth: 1,
      children: [
        {
          id: '2024040736672600661',
          value: 10,
          name: '2024040736672600661\n 时间：2024-04-28\n 价格：600\n 数量：500\n 持有者：XXXXXX\n 品种：原煤\n',
          depth: 2,
          children: [
            {
              id: '2024040736672600679',
              value: 5,
              name: '2024040736672600679\n 时间：2024-04-28\n 价格：600\n 数量：500\n 持有者：XXXXXX\n 品种：原煤\n',
              depth: 3,
              children: [
                {
                  id: '2024040736672600677',
                  value: 5,
                  name: '2024040736672600677\n 时间：2024-04-28\n 价格：600\n 数量：500\n 持有者：XXXXXX\n 品种：原煤\n',
                  depth: 4
                }
              ]
            }
          ]
        },
        {
          id: '2024040736672600670',
          value: 5,
          name: '2024040736672600670\n 时间：2024-04-28\n 价格：600\n 数量：500\n 持有者：XXXXXX\n 品种：原煤\n',
          depth: 2
        },
        {
          id: '2024040736672600671',
          value: 10,
          name: '2024040736672600699\n 时间：2024-04-28\n 价格：600\n 数量：500\n 持有者：XXXXXX\n 品种：原煤\n',
          depth: 2
        }
      ]
    },
    {
      id: '2024040736644083185',
      value: 5,
      name: '2024040736644083185\n 时间：2024-04-09\n 价格：600\n 数量：500\n 持有者：XXXXXX\n 品种：原煤\n',
      depth: 1,
      children: [
        {
          id: '2024040736672600665',
          value: 2,
          name: '2024040736672600665\n 时间：2024-04-19\n 价格：600\n 数量：500\n 持有者：XXXXXX\n 品种：原煤\n',
          depth: 2
        }
      ]
    },
    {
      id: '2024040736644083186',
      value: 5,
      name: '2024040736644083186\n 时间：2024-04-7\n 价格：600\n 数量：500\n 持有者：XXXXXX\n 品种：原煤\n',
      depth: 1,
      children: [
        {
          id: '2024040736672600666',
          value: 2,
          name: '2024040736672600666\n 时间：2024-04-18\n 价格：600\n 数量：500\n 持有者：XXXXXX\n 品种：原煤\n',
          depth: 2
        }
      ]
    }
  ]
}
const container = ref(null)
onMounted(() => {
  //   const descriptionDiv = document.createElement('div')
  //   descriptionDiv.innerHTML = 'The nodes of a subtree is aligned to the left.'
  //   container.value.appendChild(descriptionDiv)

  const width = container.value.scrollWidth || 1500
  const height = container.value.scrollHeight || 1500
  const graph = new G6.TreeGraph({
    container: container.value,
    width,
    height,
    fitView: true,
    linkCenter: false,
    plugins: [tooltip],
    modes: {
      default: [
        // 缩放
        {
          type: 'collapse-expand',
          onChange: function onChange(item, collapsed) {
            const data = item.get('model')
            graph.updateItem(item, {
              collapsed
            })
            data.collapsed = collapsed
            return true
          }
        },
        'drag-canvas',
        'zoom-canvas'
      ]
    },
    defaultNode: {
      type: 'tree-node',
      anchorPoints: [
        [0, 0.5],
        [1, 0.5]
      ]
    },
    defaultEdge: {
      type: 'cubic-horizontal-edge',
      style: {
        stroke: '#A3B1BF' //线条颜色
      }
      //   label: 'test', //文本文字，如果没有则不会显示
      //   labelCfg: { // 文本样式配置
      //     autoRotate: true,
      //     style: {
      //       fill: '#595959',
      //       fontSize: 12
      //     }
      //   }
    },
    layout: {
      type: 'compactBox',
      direction: 'LR',
      getId: function getId(d) {
        return d.id
      },
      getHeight: function getHeight() {
        return 100
      },
      getWidth: function getWidth() {
        return 300
      },
      getVGap: function getVGap() {
        return 40
      },
      getHGap: function getHGap() {
        return 40
      }
    }
  })

  graph.data(data)
  graph.on('afterlayout', () => {
    console.log('afterlayout')
  })
  graph.render()
  graph.fitView()

  if (typeof window !== 'undefined')
    window.onresize = () => {
      if (!graph || graph.get('destroyed')) return
      if (!container.value || !container.value.scrollWidth || !container.value.scrollHeight) return
      graph.changeSize(container.value.scrollWidth, container.value.scrollHeight)
    }
})

let obj = {
  orderId: '2024041631920203289',
  parent: '2024041631920203289',
  owner: '0xb5975e8294cc49347669dcea994293a37705f22f',
  portion: 50,
  residue: 0,
  unitPrice: '100',
  listing: false,
  childNum: 2,
  depth: 0,
  children: [
    {
      orderId: '2024041632106030793',
      parent: '2024041631920203289',
      owner: '0xFede7A00501B5fD1445c9a08Df8B6dB7C6Fb41a7',
      portion: 30,
      residue: 20,
      unitPrice: 0,
      listing: false,
      childNum: 1,
      depth: 0,
      timestamp: 1713229767,
      children: [
        {
          orderId: '2024041632954533412',
          parent: '2024041632106030793',
          owner: '0xf99b57EfcC50D5A12D53a56Be873D0c94911b1Cb',
          portion: 10,
          residue: 3,
          unitPrice: 100,
          listing: true,
          childNum: 6,
          depth: 1,
          timestamp: 1713229767,
          children: [
            {
              orderId: '2024041632998911076',
              parent: '2024041632954533412',
              owner: '0x61e09D7dB77066958f52F618cd229B97DD1B33b9',
              portion: 2,
              residue: 2,
              unitPrice: 100,
              listing: false,
              childNum: 0,
              depth: 2,
              timestamp: 1713229812
            },
            {
              orderId: '2024041642003351081',
              parent: '2024041632954533412',
              owner: '0xB5975e8294Cc49347669dcEa994293a37705F22f',
              portion: 1,
              residue: 1,
              unitPrice: 100,
              listing: false,
              childNum: 0,
              depth: 2,
              timestamp: 1713238816
            },
            {
              orderId: '2024041642097875792',
              parent: '2024041632954533412',
              owner: '0xB5975e8294Cc49347669dcEa994293a37705F22f',
              portion: 1,
              residue: 1,
              unitPrice: 100,
              listing: false,
              childNum: 0,
              depth: 2,
              timestamp: 1713238917
            },
            {
              orderId: '2024041642186824473',
              parent: '2024041632954533412',
              owner: '0xB5975e8294Cc49347669dcEa994293a37705F22f',
              portion: 1,
              residue: 1,
              unitPrice: 100,
              listing: false,
              childNum: 0,
              depth: 2,
              timestamp: 1713239002
            },
            {
              orderId: '2024041642231228808',
              parent: '2024041632954533412',
              owner: '0xB5975e8294Cc49347669dcEa994293a37705F22f',
              portion: 1,
              residue: 1,
              unitPrice: 100,
              listing: false,
              childNum: 0,
              depth: 2,
              timestamp: 1713239047
            },
            {
              orderId: '2024041643141808159',
              parent: '2024041632954533412',
              owner: '0xB5975e8294Cc49347669dcEa994293a37705F22f',
              portion: 1,
              residue: 0,
              unitPrice: 100,
              listing: false,
              childNum: 1,
              depth: 2,
              timestamp: 1713239959,
              children: [
                {
                  orderId: '2024041643186781712',
                  parent: '2024041643141808159',
                  owner: '0xB5975e8294Cc49347669dcEa994293a37705F22f',
                  portion: 1,
                  residue: 1,
                  unitPrice: 100,
                  listing: true,
                  childNum: 0,
                  depth: 3,
                  timestamp: 1713239999
                }
              ]
            }
          ]
        }
      ]
    },
    {
      orderId: '2024041632159574669',
      parent: '2024041631920203289',
      owner: '0x3A5afa537379e1556734b15B10DF0f0abeD29bab',
      portion: 20,
      residue: 10,
      unitPrice: 0,
      listing: false,
      childNum: 3,
      depth: 0,
      timestamp: 1713229646,
      children: [
        {
          orderId: '2024041632833411912',
          parent: '2024041632159574669',
          owner: '0xf99b57EfcC50D5A12D53a56Be873D0c94911b1Cb',
          portion: 2,
          residue: 2,
          unitPrice: 100,
          listing: true,
          childNum: 0,
          depth: 1,
          timestamp: 1713229646
        },
        {
          orderId: '2024041632863327621',
          parent: '2024041632159574669',
          owner: '0xf99b57EfcC50D5A12D53a56Be873D0c94911b1Cb',
          portion: 3,
          residue: 2,
          unitPrice: 100,
          listing: true,
          childNum: 1,
          depth: 1,
          timestamp: 1713229676,
          children: [
            {
              orderId: '2024041633039690860',
              parent: '2024041632863327621',
              owner: '0x61e09D7dB77066958f52F618cd229B97DD1B33b9',
              portion: 1,
              residue: 0,
              unitPrice: 100,
              listing: false,
              childNum: 1,
              depth: 2,
              timestamp: 1713229852,
              children: [
                {
                  orderId: '2024041633112096527',
                  parent: '2024041633039690860',
                  owner: '0x61e09D7dB77066958f52F618cd229B97DD1B33b9',
                  portion: 1,
                  residue: 0,
                  unitPrice: 100,
                  listing: true,
                  childNum: 1,
                  depth: 3,
                  timestamp: 1713229927,
                  children: [
                    {
                      orderId: '2024041641931878699',
                      parent: '2024041633112096527',
                      owner: '0xB5975e8294Cc49347669dcEa994293a37705F22f',
                      portion: 1,
                      residue: 1,
                      unitPrice: 100,
                      listing: false,
                      childNum: 0,
                      depth: 4,
                      timestamp: 1713238746
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          orderId: '2024041633249929378',
          parent: '2024041632159574669',
          owner: '0xf99b57EfcC50D5A12D53a56Be873D0c94911b1Cb',
          portion: 5,
          residue: 0,
          unitPrice: 100,
          listing: true,
          childNum: 4,
          depth: 1,
          timestamp: 1713230062,
          children: [
            {
              orderId: '2024041633322391267',
              parent: '2024041633249929378',
              owner: '0xFede7A00501B5fD1445c9a08Df8B6dB7C6Fb41a7',
              portion: 1,
              residue: 1,
              unitPrice: 100,
              listing: false,
              childNum: 0,
              depth: 2,
              timestamp: 1713230137
            },
            {
              orderId: '2024041633378757594',
              parent: '2024041633249929378',
              owner: '0xB5975e8294Cc49347669dcEa994293a37705F22f',
              portion: 2,
              residue: 2,
              unitPrice: 100,
              listing: false,
              childNum: 0,
              depth: 2,
              timestamp: 1713230192
            },
            {
              orderId: '2024041638610287790',
              parent: '2024041633249929378',
              owner: '0xB5975e8294Cc49347669dcEa994293a37705F22f',
              portion: 1,
              residue: 1,
              unitPrice: 100,
              listing: false,
              childNum: 0,
              depth: 2,
              timestamp: 1713235425
            },
            {
              orderId: '2024041641743315907',
              parent: '2024041633249929378',
              owner: '0xB5975e8294Cc49347669dcEa994293a37705F22f',
              portion: 1,
              residue: 1,
              unitPrice: 100,
              listing: false,
              childNum: 0,
              depth: 2,
              timestamp: 1713238561
            }
          ]
        }
      ]
    }
  ],
  orderType: 1
}
/**
 * 获取每一层（相同depth）的子节点数，找出最大的子节点数
 * 方便计算树图的高度
 * @param {Object} obj---树形结构对象
 * @returns {Object} {depth: 0, num: 2}---depth: 0表示第0层，num: 2表示第0层的最大子节点数为2
 */
function getMaxChildrenNum(obj) {
  let array = []
  //获取相同每一层的子节点数，组合成一个对象
  function getLevelNodeNum(obj) {
    if (obj.children && obj.children.length > 0) {
      for (let i = 0; i < obj.children.length; i++) {
        getLevelNodeNum(obj.children[i])
      }
    }
    //找出每一层的最大子节点数
    if (array.filter((item) => item.depth === obj.depth).length === 0) {
      array.push({ depth: obj.depth, num: 1 })
    } else {
      array.forEach((item) => {
        if (item.depth === obj.depth) {
          item.num += 1
        }
      })
    }
    return array
  }
  //给新对象赋值
  let newArray = getLevelNodeNum(obj)
  //数组排序---找出最大的子节点数
  newArray.sort((a, b) => {
    return b.num - a.num
  })
  //返回最大的子节点数对象---最大的子节点数为数组的第一个元素
  return newArray[0]
}
let maxObj = getMaxChildrenNum(obj)
console.log('maxObj:', maxObj, 'num:', maxObj.num)
</script>

<style>
/* 提示框的样式 */
.g6-tooltip {
  /* border: 1px solid #e2e2e2; */
  /* border-radius: 4px; */
  font-size: 12px;
  color: #545454;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 10px 8px;
  /* box-shadow: rgb(174, 174, 174) 0px 0px 10px; */
}
</style>
