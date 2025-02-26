import { Module } from '@nestjs/common';
import { SessionModule } from './domain/session/session.module';

@Module({
    imports: [SessionModule],
})
export class AppModule {}
