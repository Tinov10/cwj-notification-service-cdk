import { IsString } from 'class-validator';

// we receive strings from other MS
export class EmailInput {
  @IsString()
  to: string;

  @IsString()
  name: string;

  @IsString()
  order_number: string;
}
