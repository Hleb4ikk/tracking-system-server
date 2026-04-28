import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

import z from 'zod';

@Injectable()
export class ZodValidationPipe<S extends z.ZodTypeAny>
  implements PipeTransform
{
  constructor(private schema: S) {}

  transform(value: any, _: ArgumentMetadata) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (e) {
      console.log(e);
      throw new BadRequestException('Validation failed');
    }
  }
}
