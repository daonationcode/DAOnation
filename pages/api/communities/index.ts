import { NextApiRequest, NextApiResponse } from 'next';
import CommunityService from '../../../lib/services/communityService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      try {
        const communities = await CommunityService.getAll();
        res.status(200).json(communities);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch communities' });
      }
      break;

    case 'POST':
      try {
        const { subdomain, template, polkadot_reference_id } = req.body;

        if (!subdomain || !polkadot_reference_id) {
          return res.status(400).json({ error: 'subdomain and polkadot_reference_id are required' });
        }

        const newCommunity = await CommunityService.create({
          subdomain,
          template,
          polkadot_reference_id
        });

        res.status(201).json(newCommunity);
      } catch (error) {
        res.status(500).json({ error: 'Failed to create community' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
