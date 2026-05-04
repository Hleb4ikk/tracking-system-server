import { Controller, UseGuards } from '@nestjs/common';

@Controller('/supply-chains')
@UseGuards()
export class SupplyChainController {
  constructor() {}
}
