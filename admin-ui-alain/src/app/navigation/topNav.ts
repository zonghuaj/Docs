import { CdsTopNavMenu } from '@cds/framework/lib/types';

export const primaryConfig: CdsTopNavMenu = [];

export const secondaryConfig: CdsTopNavMenu = [
  {
    id: 'project',
    title: '项目管理',
    url: ['/project/all'],
  },
  {
    id: 'service',
    title: '服务管理',
    url: ['/service/all'],
  },
  {
    id: 'Env',
    title: '环境切换',
    tr: true,
    children: [
      {
        id: 'dev',
        title: '开发环境',
        url: ['/dev'],
      },
      {
        id: 'Prod',
        title: '生产环境',
        url: ['/production'],
      },
    ],
  },
];
