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
      console.log('rect', rect.attr('width'), rect.attr('height'))
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
    afterDraw: (cfg, group) => {
      console.log('cfg:', cfg, group)
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
    // draw(cfg, group) {
    //   const { startPoint, endPoint } = cfg
    //   const b = this.getControlPoints(cfg)
    //   console.log('b:', b, startPoint, endPoint)
    //   const path = [
    //     ['M', startPoint.x, startPoint.y],
    //     ['Q', b[0].x, b[0].y, endPoint.x, endPoint.y]
    //   ]
    //   const shape = group.addShape('path', {
    //     attrs: {
    //       path: path,
    //       stroke: '#A3B1BF',
    //       lineWidth: 1,
    //       endArrow: {
    //         path: 'M 0,0 L 6,3 L 6,-3 Z',
    //         fill: '#A3B1BF'
    //       }
    //     }
    //   })
    //   return shape
    // },
    // getControlPoints: cfg => {
    //   // 指定controlPoints
    //   let controlPoints = cfg.controlPoints
    //   if (!controlPoints || !controlPoints.length) {
    //     const { startPoint, endPoint } = cfg
    //     const innerPoint = this.$G6.Util.getControlPoint(
    //       startPoint,
    //       endPoint,
    //       0.5,
    //       cfg.edgeOffset || 30
    //     )
    //     controlPoints = [innerPoint]
    //   }
    //   return controlPoints
    // },
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
