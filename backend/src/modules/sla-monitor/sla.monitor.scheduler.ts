import { InjectQueue } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { Queue } from "bull";


@Injectable()
export class SlaMonitorScheduler{
    constructor(@InjectQueue('sla-monitor') private q: Queue) {}

    async onModuleInit() {
        await this.q.add('tick',{},{repeat: { every: 300000 }});
    }
}