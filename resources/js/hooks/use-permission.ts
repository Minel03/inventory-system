import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types';

export function usePermission() {
  const { auth } = usePage<SharedData>().props;
  const permissions: string[] = (auth as SharedData['auth'] & { permissions?: string[] }).permissions ?? [];

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
