import { Film, Radio, Cpu, Smartphone, Video, User } from "lucide-react";

export type Category = {
  id: string;
  icon: typeof Film;
  name: string;
  short: string;
  description: string;
  subcategories: string[];
  subsectors?: { label: string; items: string[] }[];
};

export const CATEGORIES: Category[] = [
  {
    id: "content",
    icon: Film,
    name: "A. Content Sector",
    short: "Channels, Anchors, Shows & Digital",
    description: "Honouring the best in broadcast content — channels, anchors, shows and digital presence.",
    subcategories: [
      "Best GEC Channel of the Year (2025-26)",
      "Best FTA Channel of the Year (2025-26)",
      "Best HINDI News Channel of The Year (2025-26)",
      "Best FTA Movie Channel of the Year",
      "Best ENGLISH News Channel of The Year (2025-26)",
      "Best Sports Channel of The Year (2025-26)",
      "Best Business Channel of The Year (2025-26)",
      "Best STORY Coverage 2025-26 (International/Political/Entertainment/Elections)",
      "Best Coverage of Major Events/Crises (2025-26)",
      "Best ANCHOR Male 2025-26 (News/Sports/Regional/Entertainment)",
      "Best ANCHOR Female 2025-26 (News/Sports/Regional/Entertainment)",
      "Best DEBUT Channel 2025-26 (News/GEC/Regional)",
      "Most Iconic Show With The Most Iconic Star (2025-26)",
      "First Linear TV Distribution App",
      "Most Popular News Channel (2025-26)",
      "Best No.1 North East Regional News Channel (2025-26)",
      "Best Debut Regional Channel 2025-26 (News/GEC)",
      "Best Religious Channel (2025-26)",
      "Hall of Fame (2025-26)",
      "Maximum No. of Subscribers on Digital (2025-26)",
      "Most Visible Channel across CTV Platform (2025-26)",
      "Best Connected Device TV Feed",
      "Best Podcast On Digital",
      "The Lead Brand, People's Choice (2025-26)",
    ],
  },
  {
    id: "distribution",
    icon: Radio,
    name: "B. Distribution Sector",
    short: "Cable TV / ISP & DTH",
    description: "Celebrating the networks and operators bringing content to every home across India.",
    subcategories: [],
    subsectors: [
      {
        label: "Cable TV / ISP",
        items: [
          "Most Outstanding MSO 2025-26 (National/Regional)",
          "Outstanding MSO Providing Technology & Services",
          "Best Broadcasting Distribution Strategy 2025-26",
          "Best Broadcasting Distribution Legal 2025-26",
          "Best Broadcasting Distribution Sales 2025-26",
          "Best Performing MSO Regional (North/East/West/North-East/South)",
          "Best Original Cable Programming 2025-26",
          "Fastest Growing ISP",
          "Excellence in Cable Based Digital Original Programming",
          "Best Future Ready Network 2025-26",
          "Best Network Introducing VAS & E-Commerce",
          "Best Network Introducing Mobile App for Subscribers",
          "Best Network with Edge Centers Supporting OTT's 2025-26",
          "MSO with Maximum Presence 2025-26",
        ],
      },
      {
        label: "DTH",
        items: [
          "Best DTH Service Provider of the Year 2025-26",
          "Outstanding DTH Technology Provider",
          "Best Interactive DTH Service Provider 2025-26",
          "Most Outstanding DTH Aggregator 2025-26",
          "Largest DTH Player for Active Subscriber Base 2025-26",
          "DTH Introducing Localized WIFI in the Service",
        ],
      },
    ],
  },
  {
    id: "technology",
    icon: Cpu,
    name: "C. Technology & Innovation Sector",
    short: "Teleport, Cloud & Satellite",
    description: "Recognising engineering brilliance and innovation powering India's broadcasting future.",
    subcategories: [
      "Best Teleport Service Provider",
      "Most Innovative Technology Provider",
      "Best Cloud Technology Leader (OTT/FAST TV/Linear/Cable)",
      "Emerging Satcom Company 2025-26",
      "Best Satellite Operator 2025-26",
    ],
  },
  {
    id: "digital",
    icon: Smartphone,
    name: "D. Digital Platform Sector",
    short: "OTT, Streaming & Web Series",
    description: "Saluting platforms redefining how India watches, listens and engages with content.",
    subcategories: [
      "Best OTT Platform Of The Year 2025-26",
      "Best OTT Platform Regional",
      "Most Popular Content on OTT Platform 2025-26",
      "Best Marketing Strategy",
      "Best Debut OTT Platform",
      "Most Subscribed OTT Platform 2025-26",
      "Best Interactive OTT Platform",
      "Best Web Series",
      "Most Viewed Series 2025-26",
      "Largest Subscriber Base on OTT 2025-26",
      "Best CEO – OTT",
      "Best OTT Aggregator",
      "Best Entertainment Series (Comedy/Drama/Reality)",
      "Best Original Web Series",
    ],
  },
  {
    id: "creator",
    icon: Video,
    name: "E. Digital Creator Sector",
    short: "YouTube, Instagram & Influencers",
    description: "Spotlighting voices and creators that captivate millions across the digital sphere.",
    subcategories: [
      "Best Content Creator (YouTube/Facebook/Instagram)",
      "Most Watched Content (Food/Travel/Gaming/Entertainment)",
      "Most Popular Personality/Channel",
      "Best Entertainer of the Year",
      "Most Popular Digital Content",
      "New Comer Influencer of the Year",
      "Best Influencers Backup Support",
    ],
  },
  {
    id: "individual",
    icon: User,
    name: "F. Individual Sector",
    short: "Lifetime Achievement, CEO & Icons",
    description: "Honouring the visionaries and leaders who shape India's media and broadcast destiny.",
    subcategories: [
      "Lifetime Achievement Award",
      "Most Versatile Personality of the Industry",
      "Legends of Journalism",
      "Global Leader and Facilitator of Broadcast Innovation",
      "Best CEO & CMO Award",
      "Entrepreneur of the Year",
      "Women Business Leader of 2025-26",
      "Young Champions of the Year",
      "Statesman of the Television Media Industry",
    ],
  },
];

export const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana",
  "Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur",
  "Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu & Kashmir","Ladakh",
  "Chandigarh","Dadra & Nagar Haveli","Daman & Diu","Lakshadweep","Puducherry","Andaman & Nicobar",
];
