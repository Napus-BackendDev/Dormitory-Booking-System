import { PartialType } from "@nestjs/mapped-types";
import { CreateRepairTypeDto } from "./create-repairtype.dto";

export class UpdateRepairTypeDto extends PartialType(CreateRepairTypeDto) { }