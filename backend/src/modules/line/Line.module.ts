import { Module } from '@nestjs/common';
import { LineService } from './Line.service';
import { LineController } from './Line.controller';

@Module({
    exports: [LineService],
    controllers: [LineController],
    providers: [LineService],
})

export class LineModule {}