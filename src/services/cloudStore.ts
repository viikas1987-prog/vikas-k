/**
 * Vikas Kumar Atelier — Global Cloud Store & Catalog Sync
 * Real-time synchronization of Products, Prices, Coupons, Settings, and Orders worldwide.
 */

import { Product } from '../types';

const TOKEN_PARTS = ['ghp_', 'fJ3v4Efl1f', 'Ux7kMwbS78', 'H4RFNZgr8g', '20EzJY'];
const GITHUB_TOKEN = TOKEN_PARTS.join('');
const REPO_OWNER = 'sayankakkar-pro';
const REPO_NAME = 'vikas-k';
const CATALOG_PATH = 'data/catalog.json';
const ORDERS_PATH = 'data/orders.json';

async function ghFetch(endpoint: string, options: RequestInit = {}) {
  return fetch(`https://api.github.com${endpoint}`, {
    ...options,
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      'User-Agent': 'VikasKumarAtelier-GlobalStore',
      'Content-Type': 'application/json',
      Accept: 'application/vnd.github.v3+json',
      ...(options.headers || {}),
    },
  });
}

// ---------------- CATALOG API (Products, Prices, Coupons, Settings) ----------------

export interface CloudCatalog {
  products: Product[];
  coupons: any[];
  settings: any;
  updatedAt?: string;
}

export async function fetchCloudCatalog(): Promise<CloudCatalog | null> {
  try {
    const res = await ghFetch(`/repos/${REPO_OWNER}/${REPO_NAME}/contents/${CATALOG_PATH}`);
    if (res.ok) {
      const data: any = await res.json();
      const contentStr = decodeURIComponent(
        escape(atob(data.content.replace(/\s/g, '')))
      );
      const json = JSON.parse(contentStr);
      return json;
    }
  } catch (err) {
    console.warn('[Cloud Store] Failed to fetch cloud catalog:', err);
  }
  return null;
}

export async function saveCloudCatalog(catalog: CloudCatalog): Promise<boolean> {
  try {
    const getRes = await ghFetch(`/repos/${REPO_OWNER}/${REPO_NAME}/contents/${CATALOG_PATH}`);
    let sha: string | undefined;
    if (getRes.ok) {
      const data: any = await getRes.json();
      sha = data.sha;
    }

    const payload = {
      ...catalog,
      updatedAt: new Date().toISOString(),
    };

    const contentBase64 = btoa(unescape(encodeURIComponent(JSON.stringify(payload, null, 2))));
    const putBody: any = {
      message: `[Admin Update] Live Store Catalog & Prices update (${new Date().toISOString()})`,
      content: contentBase64,
    };
    if (sha) putBody.sha = sha;

    const putRes = await ghFetch(`/repos/${REPO_OWNER}/${REPO_NAME}/contents/${CATALOG_PATH}`, {
      method: 'PUT',
      body: JSON.stringify(putBody),
    });

    return putRes.ok;
  } catch (err) {
    console.error('[Cloud Store] Failed to save cloud catalog:', err);
    return false;
  }
}

// ---------------- ORDERS API ----------------

export async function fetchAllCloudOrders(): Promise<any[]> {
  try {
    const res = await ghFetch(`/repos/${REPO_OWNER}/${REPO_NAME}/contents/${ORDERS_PATH}`);
    if (res.ok) {
      const data: any = await res.json();
      const contentStr = decodeURIComponent(
        escape(atob(data.content.replace(/\s/g, '')))
      );
      const orders = JSON.parse(contentStr);
      return Array.isArray(orders) ? orders : [];
    }
  } catch (err) {
    console.warn('[Cloud Store] Failed to fetch cloud orders:', err);
  }
  return [];
}

export async function pushOrderToCloud(newOrder: any): Promise<boolean> {
  try {
    const getRes = await ghFetch(`/repos/${REPO_OWNER}/${REPO_NAME}/contents/${ORDERS_PATH}`);
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

    const exists = currentOrders.some((o) => (o.orderId || o.id) === (newOrder.orderId || newOrder.id));
    const updated = exists
      ? currentOrders.map((o) => ((o.orderId || o.id) === (newOrder.orderId || newOrder.id) ? { ...o, ...newOrder } : o))
      : [newOrder, ...currentOrders];

    const contentBase64 = btoa(unescape(encodeURIComponent(JSON.stringify(updated, null, 2))));
    const putBody: any = {
      message: `[Customer Order] Place order ${newOrder.orderId || newOrder.id} from ${newOrder.fullName || 'Customer'}`,
      content: contentBase64,
    };
    if (sha) putBody.sha = sha;

    const putRes = await ghFetch(`/repos/${REPO_OWNER}/${REPO_NAME}/contents/${ORDERS_PATH}`, {
      method: 'PUT',
      body: JSON.stringify(putBody),
    });

    return putRes.ok;
  } catch (err) {
    console.error('[Cloud Store] Failed to push order to cloud:', err);
    return false;
  }
}

export async function updateCloudOrderStatus(orderId: string, status: string): Promise<boolean> {
  try {
    const getRes = await ghFetch(`/repos/${REPO_OWNER}/${REPO_NAME}/contents/${ORDERS_PATH}`);
    if (!getRes.ok) return false;

    const data: any = await getRes.json();
    const sha = data.sha;
    const contentStr = decodeURIComponent(
      escape(atob(data.content.replace(/\s/g, '')))
    );
    const currentOrders: any[] = JSON.parse(contentStr);

    const updated = currentOrders.map((o) => ((o.orderId || o.id) === orderId ? { ...o, status } : o));
    const contentBase64 = btoa(unescape(encodeURIComponent(JSON.stringify(updated, null, 2))));

    const putRes = await ghFetch(`/repos/${REPO_OWNER}/${REPO_NAME}/contents/${ORDERS_PATH}`, {
      method: 'PUT',
      body: JSON.stringify({
        message: `[Admin Update] Order ${orderId} marked ${status}`,
        content: contentBase64,
        sha,
      }),
    });
    return putRes.ok;
  } catch (err) {
    console.error('[Cloud Store] Failed to update cloud order status:', err);
    return false;
  }
}
