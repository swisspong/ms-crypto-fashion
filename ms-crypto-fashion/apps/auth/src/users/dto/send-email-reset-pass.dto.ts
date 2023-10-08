import { PartialType } from "@nestjs/swagger";
import { UpdateEmailDto } from "./update-email.dtp";

export class SendEmailResetDto extends PartialType(UpdateEmailDto) {}