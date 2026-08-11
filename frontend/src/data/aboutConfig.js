import Amit from '../assets/images/team/Amit-Agrawal.jpeg';
import Sanjay from '../assets/images/team/Sanjay.jpg';
import Siddarth from '../assets/images/team/Siddarth.jpg';
import nirav from '../assets/images/team/Sanjay.jpg';

const BASE_URL = import.meta.env.VITE_BASE_URL;


export const TEAM_MEMBERS = [
  {
    name: "Mr Amit Agrawal",
    title: "Director of Operations",
    bio: "Mr Amit Agrawal is an MBA graduate in Marketing from IMT, Ghaziabad, India. He had vast experience of 14 years in Animal feed industry.",
    image: BASE_URL + Amit,
  },
  {
    name: "Mr. Sanjay Maheshwari",
    title: "Chairman",
    bio: "Mr. Maheshwari leveraged his strategic expertise in shipping & procurement backed with his financial knowledege to establish import-export ventures for the company.",
    image: BASE_URL + Sanjay,
  },
  {
    name: "Mr. Siddarth Bhutra",
    title: "Founder",
    bio: "Striving for continuous growth, Mr. Bhutra leads the expansion of the business to newer regions, while heading the Finance & Accounting for the firm.",
    image: BASE_URL + Siddarth,
  },
  {
    name: "Mr. Nirav Shroff",
    title: "Founder",
    bio: "With his deep experience of imports and long found network of industry leaders, Mr. Shroff was able to create a value chain of growth that built the foundation of interocean's success.",
    image: BASE_URL + nirav,
  }
];

export const TIMELINE_EVENTS = [
  {
    date: "2014",
    title: "Founded PT ATLAS GLOBAL VENTURES",
    description:
      "Started as a focused trading house connecting trusted farmers and local suppliers of Indian and Indonesian spices to regional buyers.",
  },
  {
    date: "2017",
    title: "First Major International Shipment",
    description:
      "Successfully completed our first full-container exports of premium spices to clients in the Middle East and Southeast Asia, establishing our global footprint.",
  },
  {
    date: "2019",
    title: "Expanded Portfolio: Dry Fruits & Herbs",
    description:
      "Added high-quality dry fruits and medicinal herbs to our product range, partnering with certified growers and processors to ensure consistency and traceability.",
  },
  {
    date: "2022",
    title: "Quality & Compliance Milestones",
    badge: "Quality First",
    description:
      "Implemented stringent quality control processes and food safety standards across sourcing, cleaning, grading, and packaging to meet demanding international regulations.",
    ctaLabel: "View Quality Standards",
    ctaHref: "/quality",
  },
  {
    date: "2024",
    title: "Strengthening Global Partnerships",
    description:
      "Served customers across multiple continents with reliable shipments, customized blends, and flexible packaging solutions, becoming a long-term partner of choice for importers and brands.",
  },
];

export const HERO_CONTENT = {
  title: "WHO ARE WE ?",
  intro:
    "We are proud suppliers of premium Indonesian Spices, Nuts, Gum Resins, Herbs and Natural Oils catering to the various parts of the world.",
};

export const HERO_MISSION_VISION = [
  {
    key: "mission",
    label: "🎯 Our Mission",
    // tag: "Quality First"
    text:
      "To deliver Indonesia’s natural excellence to the world by combining deep consumer understanding, scientific innovation, and a world-class supply chain that ensures purity, consistency, and complete customer satisfaction.",
    // highlight: "Consistent Quality",
  },
  {
    key: "vision",
    label: "✨ Our Vision",
    // tag: "Global Reach",
    text:
      "To be the global leader in supplying premium Indonesian spices recognized for unmatched quality, authenticity, and reliability.",
    // highlight: "Partner of Choice",
  },
];

export const CORE_VALUES = [
  {
    title: "Quality",
    desc: "Exceptional quality standards designed to meet the diverse requirements of all quantities.",
  },
  {
    title: "Reliability",
    desc: "A reliable, loyal, and high-quality supply chain catering to clients across the globe.",
  },
  {
    title: "Consumer Satisfaction",
    desc: "Every product is processed to ensure complete consumer satisfaction while maintaining original taste preferences.",
  },
  {
    title: "Market Understanding",
    desc: "Our success begins with a simple yet powerful principle - understanding our consumers deeply.",
  },
  {
    title: "Scientific Innovation",
    desc: "Combining scientific innovation with market understanding to create and deliver products suitable to customer demands.",
  },
  {
    title: "Authenticity",
    desc: "Fulfilling both expressed and unexpressed needs for purity, quality, and authenticity in agro commodities.",
  },
];

export const WHY_US_SECTION = {
  id: "why-us",
  eyebrow: "Why Choose PT ATLAS GLOBAL VENTURES",
  title: "Reliable Partner for Indonesia’s Natural Excellence",
};

export const WHY_US_FEATURES = [
  {
    key: "sourcing",
    label: "Direct Sourcing Network",
    description:
      "Trusted partnerships with Indonesian farmers and processors to secure premium-quality Agro commodities at their authentic origin.",
    tag: "Traceable Origin",
  },
  {
    key: "quality",
    label: "High-Quality Supply Chain",
    description:
      "A reliable, loyal and quality-driven supply chain built over the years to consistently meet global standards and diverse quantity demands.",
    tag: "Premium Standards",
  },
  {
    key: "logistics",
    label: "Export Excellence & Reliability",
    description:
      "Expertise in export processes and compliance to ensure smooth global deliveries backed by professional documentation and timely dispatch.",
    tag: "On-Time Delivery",
  },
  {
    key: "flexibility",
    label: "Customer-Centric Innovation",
    description:
      "Products and offerings designed through deep consumer understanding to fulfill both expressed and unexpressed needs for purity, authenticity and taste.",
    tag: "Partner-Focused",
  },
];

export const WHY_US_STATS = [
  {
    value: "Reliable",
    label: "High-quality and loyal supply chain",
  },
  {
    value: "Global",
    label: "Serving clients across Asia and worldwide",
  },
  {
    value: "All Scales",
    label: "Supplying medium industries to multinationals",
  },
];