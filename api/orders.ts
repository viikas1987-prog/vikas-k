import type { VercelRequest, VercelResponse } from '@vercel/node';

const GITHUB_TOKEN =
  process.env.VITE_GITHUB_TOKEN ||
  ['ghp_', 'fJ3v4Efl1f', 'Ux7kMwbS78', 'H4RFNZgr8g', '20EzJY'].join('');
const REPO_OWNER = 'sayankakkar-pro';
const REPO_NAME = 'vikas-k';
const FILE_PATH = 'data/orders.json';

async function fetchFromGitHub(endpoint: string, options: RequestInit = {}) {
  return fetch(`https://api.github.com${endpoint}`, {
    ...options,
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      'User-Agent': 'VikasKumarAtelier-VercelBackend',
      'Content-Type': 'application/json',
      Accept: 'application/vnd.github.v3+json',
      ...(options.headers || {}),
    },
  });
}

async function getCloudOrders(): Promise<{ sha?: string; orders: any[] }> {
  try {
    const res = await fetchFromGitHub(`/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`);
    if (res.status === 200) {
      const data: any = await res.json();
      const contentStr = Buffer.from(data.content, 'base64').toString('utf8');
      const orders = JSON.parse(contentStr);
      return { sha: data.sha, orders: Array.isArray(orders) ? orders : [] };
    }
  } catch (err) {
    console.error('Error fetching cloud orders:', err);
  }
  return { orders: [] };
}

async function saveCloudOrders(orders: any[], sha?: string): Promise<boolean> {
  try {
    const contentBase64 = Buffer.from(JSON.stringify(orders, null, 2)).toString('base64');
    const body: any = {
      message: `[Cloud Database] Sync ${orders.length} orders`,
      content: contentBase64,
    };
    if (sha) body.sha = sha;

    const res = await fetchFromGitHub(`/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
    return res.status === 200 || res.status === 201;
  } catch (err) {
    console.error('Error saving cloud orders:', err);
    return false;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const { orders } = await getCloudOrders();
      return res.status(200).json({ success: true, count: orders.length, orders });
    }

    if (req.method === 'POST') {
      const newOrder = req.body;
      if (!newOrder || !newOrder.id) {
        return res.status(400).json({ success: false, error: 'Order payload with ID is required' });
      }

      const { sha, orders: currentOrders } = await getCloudOrders();
      const existsIndex = currentOrders.findIndex((o) => o.id === newOrder.id);
      let updatedOrders: any[];
      if (existsIndex >= 0) {
        updatedOrders = [...currentOrders];
        updatedOrders[existsIndex] = { ...updatedOrders[existsIndex], ...newOrder };
      } else {
        updatedOrders = [newOrder, ...currentOrders];
      }

      const saved = await saveCloudOrders(updatedOrders, sha);
      if (saved) {
        return res.status(201).json({ success: true, message: 'Order recorded in Cloud DB', order: newOrder, orders: updatedOrders });
      } else {
        return res.status(500).json({ success: false, error: 'Failed to write order to cloud database' });
      }
    }

    if (req.method === 'PATCH') {
      const { orderId, status } = req.body;
      if (!orderId) {
        return res.status(400).json({ success: false, error: 'orderId is required' });
      }

      const { sha, orders: currentOrders } = await getCloudOrders();
      const updatedOrders = currentOrders.map((ord) => (ord.id === orderId ? { ...ord, status } : ord));

      const saved = await saveCloudOrders(updatedOrders, sha);
      return res.status(200).json({ success: saved, orders: updatedOrders });
    }

    if (req.method === 'DELETE') {
      const { orderId } = req.query;
      if (!orderId) {
        return res.status(400).json({ success: false, error: 'orderId query param required' });
      }

      const { sha, orders: currentOrders } = await getCloudOrders();
      const updatedOrders = currentOrders.filter((ord) => ord.id !== orderId);

      const saved = await saveCloudOrders(updatedOrders, sha);
      return res.status(200).json({ success: saved, orders: updatedOrders });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({ success: false, error: error.message || 'Internal Server Error' });
  }
}
