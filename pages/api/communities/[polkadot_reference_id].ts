import { NextApiRequest, NextApiResponse } from 'next';
import CommunityService from '../../../lib/services/communityService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  switch (req.method) {
    case 'GET':
      const community = await CommunityService.getByPolkadotReferenceId(id as string);
      if (community) {
        res.status(200).json(community);
      } else {
        res.status(404).json({ error: 'Community not found' });
      }
      break;

    case 'PUT':
      const updateData = req.body;
      const updatedCommunity = await CommunityService.updateByPolkadotReferenceId(id as string, updateData);
      if (updatedCommunity) {
        res.status(200).json(updatedCommunity);
      } else {
        res.status(404).json({ error: 'Community not found' });
      }
      break;

    case 'DELETE':
      const deleted = await CommunityService.deleteByPolkadotReferenceId(id as string);
      if (deleted) {
        res.status(204).end();
      } else {
        res.status(404).json({ error: 'Community not found' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
