import { IsString } from 'class-validator';

// we receive strings from other MS
export class SMSInput {
  @IsString()
  phone: string;

  @IsString()
  code: string;
}
