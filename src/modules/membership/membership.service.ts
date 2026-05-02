import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { MembershipRepository } from './membership.repository';
import { CompanyService } from '../company/company.service';

@Injectable()
export class MembershipService {
  constructor(
    private readonly memberRepository: MembershipRepository,
    private readonly companyService: CompanyService,
  ) {}

  async deleteMembership(userId: string, companyId: string) {
    const membership = await this.memberRepository.findMembership(
      userId,
      companyId,
    );

    if (!membership) {
      throw new NotFoundException(`User membership wasn't found`);
    }
    const company = await this.companyService.getCompanyById(companyId);

    if (company.owner_id === userId) {
      throw new UnprocessableEntityException(
        "Owner can't leave the company. Change the owner before this action",
      );
    }
    return this.memberRepository.deleteMembership(userId, companyId);
  }
}
