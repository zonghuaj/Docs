import {CdsAppMenuItem} from '@cds/framework/lib/types/app-menu';

export const serviceMenu: Array<CdsAppMenuItem> = [
  {
    id: 'project-console',
    title: '',
    type: 'group',
    i18n: '运维控制台',
    children: [
      {
        id: 'service-dashboard',
        title: '',
        i18n: '仪表盘',
        type: 'item',
        icon: 'dashboard',
        url: ['/service-dashboard'],
      },
      {
        id: 'service-management',
        title: '',
        i18n: '服务管理',
        type: 'item',
        icon: 'storage',
        url: ['/service/all'],
      },
      {
        id: 'deploy-management',
        title: '',
        i18n: '运维中心',
        type: 'collapse',
        icon: 'select_all',
        children: [
          {
            id: 'log-summary',
            type: 'item',
            title: '',
            i18n: '日志查询',
            url: ['/service/log-summary'],
          },
          {
            id: 'service-trace',
            type: 'item',
            title: '',
            i18n: '链路追踪',
            url: ['/service/trace'],
          },
          {
            id: 'service-traffic',
            type: 'item',
            title: '',
            i18n: '流量路由',
            url: ['/service/traffic'],
          },
          {
            id: 'service-auto-scale',
            type: 'item',
            title: '',
            i18n: '自动伸缩',
            url: ['/service/autoscaler'],
          },
          {
            id: 'service-config-center',
            type: 'item',
            title: '',
            i18n: '配置中心',
            url: ['/service/configCenter'],
          },
        ],
      },
      {
        id: 'monitor-alert',
        title: '',
        i18n: '监控告警',
        type: 'collapse',
        icon: 'warning',
        children: [
          {
            id: 'resource-monitor',
            type: 'item',
            title: '',
            i18n: '资源监控',
            url: ['/monitor/all'],
          },
          {
            id: 'alert-rules',
            type: 'item',
            title: '',
            i18n: '告警规则',
            url: ['/alert/rule/all'],
          },
          {
            id: 'alert-list',
            type: 'item',
            title: '',
            i18n: '告警记录',
            url: ['/alert/all'],
          },
          {
            id: 'notice-way',
            type: 'item',
            title: '',
            i18n: '通知方式',
            url: ['/alert/notice-way'],
          },
        ],
      },
      {
        id: 'project-configuration',
        title: '',
        i18n: '项目配置',
        type: 'collapse',
        icon: 'sort',
        children: [
          {
            id: 'usergroup-management',
            type: 'item',
            title: '',
            i18n: '用户组管理',
            url: ['/team/group'],
          },
        ],
      },
    ],
  },
  {
    id: 'develop-console',
    title: '',
    type: 'group',
    i18n: '开发控制台',
    children: [
      {
        id: 'pipeline-list-management',
        type: 'item',
        title: '',
        i18n: '流水线管理',
        icon: 'apps',
        url: ['/devops/pipeline/list'],
      },
      // {
      //   id: 'pipeline-template',
      //   type: 'item',
      //   title: '',
      //   i18n: '流水线模板',
      //   icon: 'table_chart',
      //   hidden: true,
      //   url: ['/devops/pipeline/template'],
      // },
      {
        id: 'artifactory-list',
        type: 'item',
        title: '',
        i18n: '制品管理',
        icon: 'touch_app',
        url: ['/artifactory/list'],
      },
      {
        id: 'artifactory-template',
        type: 'item',
        title: '',
        i18n: '交付流程管理',
        icon: 'touch_app',
        url: ['/artifactory/template'],
      },
      {
        id: 'image-template',
        type: 'item',
        title: '',
        i18n: '镜像模板',
        icon: 'table_chart',
        url: ['/image-template'],
      },
      {
        id: 'quality-gate',
        type: 'collapse',
        title: '',
        i18n: '代码质量',
        icon: 'straighten',
        children: [
          {
            id: 'quality-gate-projects',
            title: '',
            i18n: '代码质量工程',
            type: 'item',
            url: ['/quality-gate/projects'],
          },
          {
            id: 'quality-gate-rules',
            title: '',
            i18n: '代码质量门禁',
            type: 'item',
            url: ['/quality-gate/rules'],
          }
        ]
      },
      {
        id: 'itest-platform',
        type: 'item',
        title: '',
        i18n: '自动化测试',
        icon: 'bug_report',
        url: ['/itest'],
      },
    ],
  },
  {
    id: 'tenant-console',
    title: '',
    type: 'group',
    i18n: '管理控制台',
    children: [
      {
        id: 'project-dashboard',
        title: '',
        i18n: '项目监控',
        type: 'item',
        icon: 'dashboard',
        url: ['/project/dashboard'],
      },
      {
        id: 'project-managment',
        title: '',
        i18n: '项目管理',
        type: 'item',
        icon: 'cloud_circle',
        url: ['/project/all'],
      },
      {
        id: 'team-management',
        title: '',
        i18n: '团队管理',
        type: 'collapse',
        icon: 'people',
        children: [
          {
            id: 'user-management',
            type: 'item',
            title: '',
            i18n: '用户管理',
            url: ['/team/user'],
          },
          {
            id: 'role-management',
            type: 'item',
            title: '',
            i18n: '角色管理',
            url: ['/project/role'],
          },
        ],
      },
      {
        id: 'platform-center',
        title: '',
        i18n: '集成中心',
        type: 'item',
        icon: 'dashboard',
        url: ['/project/platform-center'],
      },
    ],
  },
  {
    id: 'platform-console',
    title: '',
    type: 'group',
    i18n: '平台控制台',
    children: [
      {
        id: 'platform-dashboard',
        type: 'item',
        title: '',
        i18n: '平台监控',
        icon: 'dashboard',
        url: ['platform/dashboard'],
      },
      {
        id: 'platform-node',
        type: 'item',
        title: '',
        i18n: '节点管理',
        icon: 'device_hub',
        url: ['platform/node'],
      },
      {
        id: 'tenant-management',
        title: '',
        i18n: '租户管理',
        type: 'item',
        icon: 'people',
        url: ['platform/tenant'],
      },
      {
        id: 'tenant-users',
        type: 'item',
        icon: 'person',
        title: '',
        i18n: '平台管理员',
        url: ['team/users'],
      },
    ],
  },
];

export function getMenuPairs(menu) {
  return menu.map(m => {
    const res = {id: m.id, name: m.i18n};
    if (m.children) {
      res['children'] = getMenuPairs(m.children);
    }
    return res;
  })
  // .reduce((c, p) => [...c, ...p], []);
}
