import { SetMetadata } from '@nestjs/common';

export const Role = (role: 'admin' | 'user') => SetMetadata('role', role);
