import Link from "next/link";
import "./order-confirmation.css";
import { Suspense } from "react";

// Fetch order details securely on the server
async function getOrderDetails(orderId) {
  if (!orderId) return null;

  // Ensure it's a valid GraphQL ID
  let formattedOrderId = orderId;
  if (!formattedOrderId.startsWith('gid://shopify/Order/')) {
    formattedOrderId = `gid://shopify/Order/${orderId}`;
  }

  const SHOPIFY_ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  const SHOPIFY_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;

  if (!SHOPIFY_ADMIN_ACCESS_TOKEN || !SHOPIFY_STORE_DOMAIN) {
    console.warn("SHOPIFY_ADMIN_ACCESS_TOKEN is missing. Returning mock order data.");
    return {
      name: "WU24 0871",
      displayFinancialStatus: "PAID",
      displayFulfillmentStatus: "PREPARING",
      lineItems: {
        edges: [
          {
            node: {
              title: "Mock Item",
              quantity: 1
            }
          }
        ]
      }
    };
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
      body: JSON.stringify({ query, variables: { id: formattedOrderId } }),
      // Don't cache this page so we always see the latest status
      cache: 'no-store',
    });

    const data = await response.json();
    return data?.data?.order || null;
  } catch (error) {
    console.error('Error fetching Shopify order:', error);
    return null;
  }
}

export default async function OrderConfirmationPage(props) {
  // In Next.js 15, searchParams is a Promise
  const searchParams = await props.searchParams;
  const orderId = searchParams?.order_id || searchParams?.order;
  const order = await getOrderDetails(orderId);

  // If no order is found or no ID provided, we can either show an error state or mock data.or or a generic success
  const displayOrderName = order?.name || "CONFIRMED";
  const displayStatus = "CONFIRMED"; // As per reference: ORDER STATUS CONFIRMED
  const paymentStatus = order?.displayFinancialStatus || "PAID";
  const fulfillmentStatus = order?.displayFulfillmentStatus || "PREPARING";

  return (
    <div className="order-confirmation-page">
      <div className="order-confirmation-screen">
        {/* Floating Background Layout Structure */}
        <div className="confirmation-content-wrapper">
          <div className="order-received-badge">
            <span className="mono">ORDER CONFIRMED</span>
            <span className="marker-line" />
          </div>

          <div className="confirmation-heading-group">
            <h1 className="editorial-main-title">
              <span className="title-row-1">Thank You.</span>
              <span className="title-row-2">
                Your order is confirmed.
              </span>
            </h1>
            <p className="confirmation-description">
              Your order has been received and is now being prepared.<br />
              We&apos;ll send you tracking details as soon as your order ships.
            </p>
          </div>

          {/* Elevated Roster Card with Soft Realistic Multi-Layer Shadows */}
          <div className="roster-card-container">
            <div className="roster-card">
              {/* Left Data Column */}
              <div className="card-data-col">
                <div className="card-header-row">
                  <span className="mono card-sublabel">WITH US — ORDER CONFIRMATION</span>
                  <span className="mono card-id-tag">#01</span>
                </div>

                <div className="card-digits-row">
                  <span className="card-serial-number" style={{ fontSize: '1.4rem' }}>
                    {displayOrderName}
                  </span>
                </div>

                <div className="card-divider-line" />

                <div className="card-details-grid">
                  <div className="detail-item">
                    <span className="detail-label mono">ORDER STATUS</span>
                    <span className="detail-value status-val">
                      <span className="status-amber-dot" /> {displayStatus}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label mono">PAYMENT</span>
                    <span className="detail-value mono">{paymentStatus}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label mono">FULFILLMENT</span>
                    <span className="detail-value mono">{fulfillmentStatus}</span>
                  </div>
                </div>
              </div>

              {/* Right Packaging Photography Column */}
              <div className="card-photo-col">
                <div className="card-brand-quote mono">
                  <span>MORE</span>
                  <span>THAN</span>
                  <span>A BRAND.</span>
                </div>
                <div className="card-photo-wrapper">
                  {/* Replaced with the new requested logo image per user instruction */}
                  <img 
                    src="/logo/Codex Image 19 Sept 2026, 06_08_00.png" 
                    alt="With Us Logo Box" 
                    className="card-box-image"
                  />
                  <div className="card-photo-edge-vignette" />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action Pill Buttons */}
          <div className="confirmation-action-buttons">
            <Link href="/" className="btn-action-pill btn-pill-light">
              VIEW YOUR ORDER <span className="btn-arrow-icon">→</span>
            </Link>
            <Link href="/wardrobe" className="btn-action-pill btn-pill-outline-light">
              CONTINUE SHOPPING
            </Link>
          </div>
        </div>

        {/* Minimal Corner Branding / Markers */}
        <div className="editorial-marker marker-top-left">
          <p className="mono">CLOTHING</p>
          <p className="mono">IDEAS</p>
          <p className="mono">FOR A MORE</p>
          <p className="mono">INTENTIONAL</p>
          <p className="mono">TOMORROW.</p>
        </div>

        <div className="editorial-marker marker-bottom-left">
          <div className="intersect-rings">
            <div className="ring" />
            <div className="ring" />
          </div>
          <span className="mono">EST. 2024</span>
          <span className="marker-line" />
        </div>

        <div className="editorial-marker marker-bottom-right">
          <span className="mono">WITH US</span>
          <span className="marker-line" />
        </div>
      </div>
    </div>
  );
}
