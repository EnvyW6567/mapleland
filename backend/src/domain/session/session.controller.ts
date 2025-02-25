import { Controller, Sse, Param, Req, Post, Body } from '@nestjs/common';
import { Request } from 'express';
import { Observable, Subject } from 'rxjs';
import { SessionService } from './session.service';
import { AddUserReqDto } from './dto/add-user.req.dto';
import { MoveUserReqDto } from './dto/move-user.req.dto';
import { RemoveUserReqDto } from './dto/remove-user.req.dto';

@Controller('session')
export class SessionController {
    constructor(private readonly sessionService: SessionService) {}

    @Post('create')
    async createSession() {
        return await this.sessionService.createSession();
    }

    @Sse('connect/:sessionId')
    async connectToSession(
        @Param('sessionId') sessionId: string,
        @Req() req: Request,
    ): Promise<Observable<any>> {
        const events$ = new Subject();

        req.on('close', () => {
            console.log(`Client disconnected from session ${sessionId}`);
            events$.complete();
        });

        await this.sessionService.subscribeToSessionEvents((event) => {
            if (event.sessionId === sessionId) {
                events$.next({ data: event });
            }
        });

        return events$.asObservable();
    }

    @Post('add')
    async addUser(@Body() addUserReqDto: AddUserReqDto) {
        return this.sessionService.addUser(addUserReqDto);
    }

    @Post('move')
    async moveUser(@Body() moveUserReqDto: MoveUserReqDto) {
        return this.sessionService.moveUser(moveUserReqDto);
    }

    @Post('remove')
    async removeUser(@Body() removeUserReqDto: RemoveUserReqDto) {
        return this.sessionService.removeUser(removeUserReqDto);
    }
}
