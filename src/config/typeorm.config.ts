import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'jewel',
  password: 'habijabi',
  database: 'ideas',
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: true,
};
