export interface PMember {
  id: string;
  username: string;
  roles: RoleColumn[];
}

export interface Role {
  id: string;
  name: string;
}

export interface RoleColumn {
  roleId: string;
  roleName: string;
  userId: string;
}
