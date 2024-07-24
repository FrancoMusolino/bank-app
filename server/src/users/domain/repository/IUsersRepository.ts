import { Repository } from '@/shared/db/repository';
import { User } from '../entities/User';
import { Result } from '@/shared/core/Result';

export interface IUsersRepository extends Repository<User> {
  exists(email: string): boolean;
  findOneByEmail(email: string): Result<User>;
}
