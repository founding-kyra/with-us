"use client";
import "./client-services.css";
import Copy from "@/components/Copy/Copy";
import Accordion from "@/components/Accordion/Accordion";

const faqData = [
  {
    category: "01 — ORDERS",
    items: [
      {
        question: "Where's my order?",
        answer: <p>A shipping confirmation with tracking arrives the moment your order leaves our Los Angeles facility. For any order questions, please email hello@withus.world.</p>
      },
      {
        question: "Can I combine items into one shipment?",
        answer: <p>Multiple items in one order ship together when possible, in the smallest box that protects them. Two separate orders generally cannot be combined after placement to ensure processing speed.</p>
      },
      {
        question: "Can I change or cancel my order?",
        answer: <p>Processing runs up to 4 business days, so there is a short window. Orders can be changed or canceled within 1 hour of placement. Please email us immediately at hello@withus.world.</p>
      }
    ]
  },
  {
    category: "02 — PAYMENTS",
    items: [
      {
        question: "What payment methods do you accept?",
        answer: <p>We accept all major credit cards (Visa, Mastercard, American Express), as well as Apple Pay, Google Pay, and Shop Pay.</p>
      },
      {
        question: "When is my card charged?",
        answer: <p>Your card is charged immediately upon order placement.</p>
      }
    ]
  },
  {
    category: "03 — SHIPPING",
    items: [
      {
        question: "When will my order ship?",
        answer: <p>Orders are processed within 4 business days. Orders placed before 2:00 PM PT may ship same day when stock allows. We ship Monday–Friday, holidays excluded; please add 1–2 days during launches and peak seasons.</p>
      },
      {
        question: "How long until it arrives?",
        answer: <p>Allow the 4-day processing window, then UPS Ground transit on top — transit depends on your distance from Los Angeles.</p>
      },
      {
        question: "How much is shipping?",
        answer: <p>Live UPS rates are calculated at checkout from your address, so you see the real cost before paying.</p>
      },
      {
        question: "Where do you ship?",
        answer: <p>Across the US and internationally — including Canada, the UK, the EU, Australia, and select Asia-Pacific countries. Some destinations are limited by carrier, customs, or sanctions; checkout will notify you.</p>
      },
      {
        question: "Who carries my order?",
        answer: <p>UPS Ground, shipped from Los Angeles. Tracking is emailed the moment it leaves.</p>
      },
      {
        question: "Do high-value orders need a signature?",
        answer: <p>Orders of $500 or more may require a signature on delivery.</p>
      },
      {
        question: "Can you ship to a PO Box or APO/FPO?",
        answer: <p>UPS Ground generally cannot deliver to PO Boxes. A physical address is required at checkout.</p>
      }
    ]
  },
  {
    category: "04 — RETURNS",
    items: [
      {
        question: "Do you accept returns?",
        answer: <p>Yes. Returns are received and processed at our Los Angeles facility.</p>
      },
      {
        question: "What's the return window?",
        answer: <p>Returns are accepted within 14 days of delivery, provided the items are unworn and have the original tags attached.</p>
      },
      {
        question: "Is there a restocking fee?",
        answer: <p>There is no restocking fee, however the return shipping cost will be deducted from your refund.</p>
      },
      {
        question: "How do I start a return?",
        answer: <p>Please email hello@withus.world with your order number to receive a Return Merchandise Authorization (RMA) and our LA return address.</p>
      },
      {
        question: "Which items are final sale?",
        answer: <p>All discounted items and accessories are considered final sale and cannot be returned.</p>
      },
      {
        question: "How long does a refund take?",
        answer: <p>Refunds typically take 5–10 business days to appear on your original payment method after the return is processed at our facility.</p>
      }
    ]
  },
  {
    category: "05 — CONTACT",
    items: [
      {
        question: "How do I reach you?",
        answer: <p>You can reach us through our <a href="/touchpoint">Contact Us</a> page or by emailing hello@withus.world directly for everything from sizing to shipping.</p>
      }
    ]
  }
];

export default function ClientServices() {
  return (
    <main className="client-services-page">
      <div className="container">
        <div className="cs-header">
          <Copy animateOnScroll={false} delay={0.2}>
            <p className="cs-label">WITHUS — CLIENT SERVICES</p>
          </Copy>
          <Copy animateOnScroll={false} delay={0.4}>
            <h1>QUESTIONS,<br/>ANSWERED.</h1>
          </Copy>
        </div>

        <div className="cs-content">
          {faqData.map((section, index) => (
            <div className="cs-section" key={index}>
              <Copy>
                <h3 className="cs-category-title">{section.category}</h3>
              </Copy>
              <div className="cs-accordion-wrapper">
                <Accordion items={section.items} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
