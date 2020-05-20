export interface RoleListEntity {
  rows: RoleEntity[];
  count: number;
}

export interface RoleEntity {
  id?: string;
  name: string;
  desc?: string;
  type: string;
  tenantCode: string;
  menus: string[];
}

export interface MenuItem {
  id: string;
  name: string;
  children?: MenuItem[];
}
