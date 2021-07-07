import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import {User} from './user.entity'

export const connectDb: TypeOrmModuleOptions = {
  type: 'postgres',
  username: 'postgres',
  password: 'Postgresql1997',
  port: 1997,
  host: '127.0.0.1',
  database: 'mydb',
  synchronize: true,
  entities: [User]
}
