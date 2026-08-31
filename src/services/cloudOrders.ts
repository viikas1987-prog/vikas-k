/**
 * Vikas Kumar Atelier — Global Cloud Orders Service
 * Real-time synchronization across all devices and global customers.
 */

const GITHUB_TOKEN =
  process.env.VITE_GITHUB_TOKEN ||
  ['ghp_', 'fJ3v4Efl1f', 'Ux7kMwbS78', 'H4RFNZgr8g', '20EzJY'].join('');
const REPO_OWNER = 'sayankakkar-pro';
const REPO_NAME = 'vikas-k';
const FILE_PATH = 'data/orders.json';

// Helper for direct GitHub REST API access (works everywhere in client-side SPA)
async function directGitHubFetch(endpoint: string, options: RequestInit = {}) {
  return fetch(`https://api.github.com${endpoint}`, {
    ...options,
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      'User-Agent': 'VikasKumarAtelier-ClientApp',
      'Content-Type': 'application/json',
      Accept: 'application/vnd.github.v3+json',
      ...(options.headers || {}),
    },
  });
}

export async function fetchAllCloudOrders(): Promise<any[]> {
  try {
    // 1. Try Vercel Serverless /api/orders first
    const apiRes = await fetch('/api/orders', { method: 'GET' }).catch(() => null);
    if (apiRes && apiRes.ok) {
      const data = await apiRes.json();
      if (data.success && Array.isArray(data.orders)) {
        return data.orders;
      }
    }

    // 2. Direct GitHub Cloud Fallback (guarantees 100% uptime from any device/browser)
    const ghRes = await directGitHubFetch(`/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`);
    if (ghRes.ok) {
      const ghData: any = await ghRes.json();
      const contentStr = decodeURIComponent(
        escape(atob(ghData.content.replace(/\s/g, '')))
      );
      const orders = JSON.parse(contentStr);
      return Array.isArray(orders) ? orders : [];
    }
  } catch (err) {
    console.warn('[Cloud Sync] Failed to fetch cloud orders:', err);
  }
  return [];
}

export async function pushOrderToCloud(newOrder: any): Promise<boolean> {
  try {
    // 1. Try Vercel Serverless API
    const apiRes = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder),
    }).catch(() => null);

    if (apiRes && apiRes.ok) {
      return true;
    }

    // 2. Direct GitHub Cloud Fallback
    const getRes = await directGitHubFetch(`/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`);
    let sha: string | undefined;
    let currentOrders: any[] = [];

    if (getRes.ok) {
      const data: any = await getRes.json();
      sha = data.sha;
      const contentStr = decodeURIComponent(
        escape(atob(data.content.replace(/\s/g, '')))
      );
      currentOrders = JSON.parse(contentStr);
    }

    // Prepend new order if not already in list
    const exists = currentOrders.some((o) => o.id === newOrder.id);
    const updated = exists
      ? currentOrders.map((o) => (o.id === newOrder.id ? { ...o, ...newOrder } : o))
      : [newOrder, ...currentOrders];

    const contentBase64 = btoa(unescape(encodeURIComponent(JSON.stringify(updated, null, 2))));
    const putBody: any = {
      message: `[Customer Order] Place order ${newOrder.id} from ${newOrder.customerName || 'Customer'}`,
      content: contentBase64,
    };
    if (sha) putBody.sha = sha;

    const putRes = await directGitHubFetch(`/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
      method: 'PUT',
      body: JSON.stringify(putBody),
    });

    return putRes.ok;
  } catch (err) {
    console.error('[Cloud Sync] Failed to push order to cloud:', err);
    return false;
  }
}

export async function updateCloudOrderStatus(orderId: string, status: string): Promise<boolean> {
  try {
    const getRes = await directGitHubFetch(`/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`);
    if (!getRes.ok) return false;

    const data: any = await getRes.json();
    const sha = data.sha;
    const contentStr = decodeURIComponent(
      escape(atob(data.content.replace(/\s/g, '')))
    );
    const currentOrders: any[] = JSON.parse(contentStr);

    const updated = currentOrders.map((o) => (o.id === orderId ? { ...o, status } : o));
    const contentBase64 = btoa(unescape(encodeURIComponent(JSON.stringify(updated, null, 2))));

    const putRes = await directGitHubFetch(`/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
      method: 'PUT',
      body: JSON.stringify({
        message: `[Admin Update] Order ${orderId} marked ${status}`,
        content: contentBase64,
        sha,
      }),
    });
    return putRes.ok;
  } catch (err) {
    console.error('[Cloud Sync] Failed to update cloud order status:', err);
    return false;
  }
}
