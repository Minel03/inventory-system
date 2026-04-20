import { usePage } from '@inertiajs/react';

interface SharedData {
  auth: {
    user: any;
    permissions: string[];
  };
}

export function usePermission() {
  const { auth } = usePage<any>().props;
  const permissions = auth.permissions || [];

  const can = (permission: string) => {
    return permissions.includes(permission);
  };

  const hasAnyPermission = (perms: string[]) => {
    return perms.some(p => permissions.includes(p));
  };

  const hasAllPermissions = (perms: string[]) => {
    return perms.every(p => permissions.includes(p));
  };

  return { can, hasAnyPermission, hasAllPermissions, permissions };
}
