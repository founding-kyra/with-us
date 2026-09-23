import { NextResponse } from 'next/server';

const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS = 10;
const ipRequests = new Map();

export async function GET(request) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  
  // In-memory rate limiting
  const now = Date.now();
  const requestData = ipRequests.get(ip) || { count: 0, startTime: now };
  
  if (now - requestData.startTime > RATE_LIMIT_WINDOW) {
    requestData.count = 1;
    requestData.startTime = now;
  } else {
    requestData.count++;
  }
  
  ipRequests.set(ip, requestData);

  if (requestData.count > MAX_REQUESTS) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  let orderId = searchParams.get('id');

  if (!orderId) {
    return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
  }

  // Validate that the provided order ID is safe and purely alphanumeric/numeric
  // It shouldn't contain weird characters or inject GraphQL.
  if (!/^[a-zA-Z0-9_-]+$/.test(orderId) && !orderId.startsWith('gid://')) {
    return NextResponse.json({ error: 'Invalid Order ID format' }, { status: 400 });
  }

  // Ensure it's a valid GraphQL ID
  if (!orderId.startsWith('gid://shopify/Order/')) {
    orderId = `gid://shopify/Order/${orderId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
  }

  const SHOPIFY_ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  const SHOPIFY_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;

  if (!SHOPIFY_ADMIN_ACCESS_TOKEN || !SHOPIFY_STORE_DOMAIN) {
    console.error("SHOPIFY_ADMIN_ACCESS_TOKEN is missing. Cannot fetch order.");
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
  }

  const query = `
    query getOrder($id: ID!) {
      order(id: $id) {
        id
        name
        displayFinancialStatus
        displayFulfillmentStatus
        totalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        lineItems(first: 5) {
          edges {
            node {
              title
              quantity
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(`https://${SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ADMIN_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query, variables: { id: orderId } }),
    });

    const data = await response.json();

    if (data.errors) {
      console.error('Shopify Admin API error:', data.errors);
      return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
    }

    if (!data.data || !data.data.order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(data.data.order);
  } catch (error) {
    console.error('Error fetching Shopify order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
