import { OmitType } from "@nestjs/swagger";
import { SignupLocalDto } from "./signup-local-dto.dto";

export class SigninLocalDto extends OmitType(SignupLocalDto, ['username'] as const) {
}