import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { isUUID } from 'class-validator';

@Injectable()
export class UUIDValidation implements PipeTransform {
  transform(value: any) {
    if (isUUID(value, 5)) {
      throw new BadRequestException(`Value ${value} is not Valid UUID`);
    } else if (value.length !== 36) {
      throw new BadRequestException(`Value ${value} is not Valid UUID`);
    }

    return value;
  }
}
