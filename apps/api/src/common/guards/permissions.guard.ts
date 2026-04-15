import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator.js';
import { IS_PUBLIC_KEY } from '../../auth/decorators/public.decorator.js';
import { Role } from '../../auth/entities/role.entity.js';
import { UserRole } from '../../auth/entities/user-role.entity.js';
import { JwtPayload } from '../../auth/interfaces/jwt-payload.interface.js';
import { User } from '../../users/entities/user.entity.js';

@Injectable()
export class PermissionsGuard implements CanActivate {
  private readonly roleRepository: Repository<Role>;
  private readonly userRoleRepository: Repository<UserRole>;

  constructor(
    private reflector: Reflector,
    @InjectDataSource()
    dataSource: DataSource,
  ) {
    this.roleRepository = dataSource.getRepository(Role);
    this.userRoleRepository = dataSource.getRepository(UserRole);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true; // Skip permission check for public routes
    }

    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true; // No permissions required
    }

    const request = context.switchToHttp().getRequest<{ user: User | JwtPayload }>();
    const user = request.user;

    const userId = (user as any)?.id || (user as any)?.sub;

    if (!userId) {
      throw new ForbiddenException('User not authenticated');
    }

    // Get user roles with permissions
    const userRoles = await this.userRoleRepository.find({
      where: { user_id: userId },
      relations: ['role'],
    });

    if (!userRoles || userRoles.length === 0) {
      throw new ForbiddenException('User has no roles assigned');
    }

    // Collect all permissions from user's roles (including parent roles)
    const userPermissions = new Set<string>();

    for (const userRole of userRoles) {
      const role = userRole.role;
      if (role) {
        await this.collectPermissions(role, userPermissions);
      }
    }

    // Check if user has all required permissions
    const hasAllPermissions = requiredPermissions.every((permission) =>
      userPermissions.has(permission),
    );

    if (!hasAllPermissions) {
      throw new ForbiddenException(
        `Missing required permission(s): ${requiredPermissions.join(', ')}`,
      );
    }

    return true;
  }

  /**
   * Recursively collect permissions from role and its parents
   */
  private async collectPermissions(
    role: Role,
    permissions: Set<string>,
  ): Promise<void> {
    // Add current role's permissions
    if (role.permissions) {
      Object.entries(role.permissions).forEach(([key, value]) => {
        if (value === true) {
          permissions.add(key);
        }
      });
    }

    // If role has parent, collect parent permissions (inheritance)
    if (role.parent_id) {
      const parentRole = await this.roleRepository.findOne({
        where: { id: role.parent_id },
      });

      if (parentRole) {
        await this.collectPermissions(parentRole, permissions);
      }
    }
  }
}
