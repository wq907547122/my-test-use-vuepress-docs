module.exports = {
  title: '搭建学习K8S的文档',
  description: '记录学习的信息',
  base: '/ims/',
  dest: './dist',
  port: '8888',
  head: [
      ['link', {rel: 'icon', href: '/logo.png'}]
  ],
  markdown: {
      lineNumbers: true
  },
  themeConfig: {
    // 右上角的导航栏
    nav: [
      {
        text: '指南',
        link: '/zh/guide/'
      },
      {
        text: 'Docker',
        link: '/zh/docker/'
      },
      {
        text: '区块链',
        link: '/zh/block/'
      },
      {
          text: 'Java',
          items: [
              {
                text: 'Netty',
                link: '/zh/java/netty'
              },
              {
                text: 'Java基础',
                link: '/zh/java/normal'
              },
              {
                  text: 'Websocket',
                  link: '/zh/java/websocket'
              },
              {
                  text: 'Kafka',
                  link: '/zh/java/kafka'
              },
              {
                text: 'Vue技巧',
                link: '/zh/java/vue'
              }
          ]
      }
    ],
    sidebar: {
      '/zh/guide/': [
        {
          title: '网格',
          collapsable: false,
          children: genMeshSidebar('/zh')
        }
      ],
      '/zh/docker/': [
          {
              title: 'Docker',
              collapsable: false,
              children: getDockerSidebar('/zh')
          }
      ],
      '/zh/block/': [
          {
              title: '区块链',
              collapsable: false,
              children: getBlockChain('/zh')
          }
      ],
      '/zh/java/netty': [
          {
              title: 'Netty',
              collapsable: false,
              children: [
                  '/zh/java/netty/en-decode.md',
              ]
          }
      ],
      '/zh/java/normal': [
          {
              title: '基础',
              collapsable: false,
              children: [
                  '/zh/java/normal/java.md',
              ]
          }
      ],
      '/zh/java/websocket': [
          {
              title: 'Websocket',
              collapsable: false,
              children: [
                  '/zh/java/websocket/mysocket.md',
                  '/zh/java/websocket/mysocket-auth.md',
              ]
          }
      ],
      '/zh/java/kafka': [
          {
              title: 'kafka',
              collapsable: false,
              children: [
                  '/zh/java/kafka/kafka.md',
              ]
          }
      ],
      '/zh/java/vue': [
          {
              title: 'Vue',
              collapsable: false,
              children: [
                  '/zh/java/vue/js-skils.md',
              ]
          }
      ]
    },
    sidebarDepth: 2,
  }
}
// 获取网格的侧边导航栏
function genMeshSidebar(type) {
    const mapArr = [
        '/guide/',
        '/guide/k8s/k8s-start.md',
        '/guide/k8s/k8s-summary.md',
        '/guide/k8s/k8s-construct.md',
        '/guide/k8s/k8s-cal-volume.md',
        '/guide/k8s/k8s-extend.md',
        '/guide/k8s/k8s-container.md',
        '/guide/k8s/k8s-workload.md',
        '/guide/k8s/k8s-storage.md',
        '/guide/k8s/k8s-config.md',
        '/guide/k8s/k8s-service-network-load.md',
        '/guide/k8s/k8s-security.md',
        '/guide/k8s/k8s-scheduling.md',
        '/guide/k8s/k8s-strategy.md',
        '/guide/k8s/k8s-install-minikube.md',
        '/guide/k8s/k8s-f.md'
    ]
    return mapArr.map(item => {
        return type + item
    })
}
// 获取docker栏的信息
function getDockerSidebar(type) {
    const mapArr = [
        '/docker/',
        '/docker/info/build-docker-image.md'
    ]
    return mapArr.map(item => {
        return type + item
    })
}
// 获取区块链的文章
function getBlockChain(type) {
    const mapArr = [
        '/block/',
        '/block/info/wath-is-block-chain.md',
        '/block/info/coin-encry.md',
        '/block/info/no-center.md',
        '/block/info/how-bitcoin-transfer.md',
        '/block/info/distrubute-account-no-center-network.md',
        '/block/info/bitcoin-data-struct.md',
        '/block/info/workload-proof.md',
    ]
    return mapArr.map(item => {
        return type + item
    })
}