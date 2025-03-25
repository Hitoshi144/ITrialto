import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamsModule } from './teams/teams.module';
import { TeamRequestModule } from './team-request/team-request.module';
import { CreateTeamRequestModule } from './create-team-request/create-team-request.module';
import { ProjectModule } from './project/project.module';
import { ProjectRequestModule } from './project-request/project-request.module';

@Module({
  imports: [UserModule, AuthModule, ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        synchronize: true,
        entities: [__dirname + '/**/*.entity{.js, .ts}'],
        migrations: [__dirname + '/migrations/*{.js, .ts}'],
      }),
      inject: [ConfigService, ],
    }),
    TeamsModule,
    TeamRequestModule,
    CreateTeamRequestModule,
    ProjectModule,
    ProjectRequestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
