import Community from '../models/Community';

class CommunityService {
  static async getAll() {
    return await Community.findAll();
  }

  static async getByPolkadotReferenceId(polkadotReferenceId: string) {
    return await Community.findOne({ where: { polkadot_reference_id: polkadotReferenceId } });
  }

  static async create(data: Partial<Community>) {
    return await Community.create(data);
  }

  static async updateByPolkadotReferenceId(polkadotReferenceId: string, updateData: Partial<Community>) {
    const community = await Community.findOne({ where: { polkadot_reference_id: polkadotReferenceId } });
    if (community) {
      return await community.update(updateData);
    }
    return null;
  }

  static async deleteByPolkadotReferenceId(polkadotReferenceId: string) {
    const community = await Community.findOne({ where: { polkadot_reference_id: polkadotReferenceId } });
    if (community) {
      await community.destroy();
      return true;
    }
    return false;
  }
}

export default CommunityService;
