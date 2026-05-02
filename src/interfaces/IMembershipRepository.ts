import { Membership } from 'src/types/Membership';

export interface IMembershipRepository {
  deleteMembership(userId: string, companyId: string): Promise<void>;
  findMembership(userId: string, companyId: string): Promise<Membership>;
}
