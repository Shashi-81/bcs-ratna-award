export interface CategoryItem {
  id: string;
  label: string;
}

export interface SubSector {
  id: string;
  label: string;
  categories: CategoryItem[];
}

export interface Sector {
  id: string;
  label: string;
  subSectors?: SubSector[];
  categories?: CategoryItem[];
}

export const SECTORS: Sector[] = [
  {
    id: "content",
    label: "A. Content Sector",
    categories: [
      { id: "best_gec", label: "Best GEC Channel of the Year (2025-26)" },
      { id: "best_fta", label: "Best FTA Channel of the Year (2025-26)" },
      { id: "best_hindi_news", label: "Best HINDI News Channel of The Year (2025-26)" },
      { id: "best_fta_movie", label: "Best FTA Movie Channel of the Year" },
      { id: "best_english_news", label: "Best ENGLISH News Channel of The Year (2025-26)" },
      { id: "best_sports", label: "Best Sports Channel of The Year (2025-26)" },
      { id: "best_business", label: "Best Business Channel of The Year (2025-26)" },
      { id: "best_story_coverage", label: "Best STORY Coverage (International/Political/Entertainment/Elections)" },
      { id: "best_major_events", label: "Best Coverage of Major Events/Crises" },
      { id: "best_anchor_male", label: "Best ANCHOR Male (News/Sports/Regional/Entertainment)" },
      { id: "best_anchor_female", label: "Best ANCHOR Female (News/Sports/Regional/Entertainment)" },
      { id: "best_debut_channel", label: "Best DEBUT Channel (News/GEC/Regional)" },
      { id: "most_iconic_show", label: "Most Iconic Show With The Most Iconic Star" },
      { id: "first_linear_tv_app", label: "First Linear TV Distribution App" },
      { id: "most_popular_news", label: "Most Popular News Channel" },
      { id: "best_north_east", label: "Best No.1 North East Regional News Channel" },
      { id: "best_debut_regional", label: "Best Debut Regional Channel (News/GEC)" },
      { id: "best_religious", label: "Best Religious Channel" },
      { id: "hall_of_fame", label: "Hall of Fame" },
      { id: "max_subscribers_digital", label: "Maximum No. of Subscribers on Digital" },
      { id: "most_visible_ctv", label: "Most Visible Channel across CTV Platform" },
      { id: "best_connected_tv", label: "Best Connected Device TV Feed" },
      { id: "best_podcast", label: "Best Podcast On Digital" },
      { id: "lead_brand", label: "The Lead Brand, People's Choice" },
    ],
  },
  {
    id: "distribution",
    label: "B. Distribution Sector",
    subSectors: [
      {
        id: "cable_isp",
        label: "Cable TV / ISP",
        categories: [
          { id: "most_outstanding_mso", label: "Most Outstanding MSO (National/Regional)" },
          { id: "outstanding_mso_tech", label: "Outstanding MSO Providing Technology & Services" },
          { id: "best_distribution_strategy", label: "Best Broadcasting Distribution Strategy" },
          { id: "best_distribution_legal", label: "Best Broadcasting Distribution Legal" },
          { id: "best_distribution_sales", label: "Best Broadcasting Distribution Sales" },
          { id: "best_performing_mso", label: "Best Performing MSO Regional (North/East/West/North-East/South)" },
          { id: "best_original_cable", label: "Best Original Cable Programming" },
          { id: "fastest_growing_isp", label: "Fastest Growing ISP" },
          { id: "excellence_cable_digital", label: "Excellence in Cable Based Digital Original Programming" },
          { id: "best_future_ready", label: "Best Future Ready Network" },
          { id: "best_network_vas", label: "Best Network Introducing VAS & E-Commerce" },
          { id: "best_network_mobile", label: "Best Network Introducing Mobile App for Subscribers" },
          { id: "best_network_ott", label: "Best Network with Edge Centers Supporting OTT" },
          { id: "mso_max_presence", label: "MSO with Maximum Presence" },
        ],
      },
      {
        id: "dth",
        label: "DTH",
        categories: [
          { id: "best_dth_provider", label: "Best DTH Service Provider of the Year" },
          { id: "outstanding_dth_tech", label: "Outstanding DTH Technology Provider" },
          { id: "best_interactive_dth", label: "Best Interactive DTH Service Provider" },
          { id: "most_outstanding_dth_aggregator", label: "Most Outstanding DTH Aggregator" },
          { id: "largest_dth_subscriber", label: "Largest DTH Player for Active Subscriber Base" },
          { id: "dth_localized_wifi", label: "DTH Introducing Localized WIFI Service" },
        ],
      },
    ],
  },
  {
    id: "technology",
    label: "C. Technology & Innovation Sector",
    categories: [
      { id: "best_teleport", label: "Best Teleport Service Provider" },
      { id: "most_innovative_tech", label: "Most Innovative Technology Provider" },
      { id: "best_cloud_tech", label: "Best Cloud Technology Leader (OTT/FAST TV/Linear/Cable)" },
      { id: "emerging_satcom", label: "Emerging Satcom Company" },
      { id: "best_satellite_operator", label: "Best Satellite Operator" },
    ],
  },
  {
    id: "digital",
    label: "D. Digital Platform Sector",
    categories: [
      { id: "best_ott_platform", label: "Best OTT Platform Of The Year" },
      { id: "best_ott_regional", label: "Best OTT Platform Regional" },
      { id: "most_popular_ott_content", label: "Most Popular Content on OTT Platform" },
      { id: "best_marketing_strategy", label: "Best Marketing Strategy" },
      { id: "best_debut_ott", label: "Best Debut OTT Platform" },
      { id: "most_subscribed_ott", label: "Most Subscribed OTT Platform" },
      { id: "best_interactive_ott", label: "Best Interactive OTT Platform" },
      { id: "best_web_series", label: "Best Web Series" },
      { id: "most_viewed_series", label: "Most Viewed Series" },
      { id: "largest_subscriber_ott", label: "Largest Subscriber Base on OTT" },
      { id: "best_ceo_ott", label: "Best CEO – OTT" },
      { id: "best_ott_aggregator", label: "Best OTT Aggregator" },
      { id: "best_entertainment_series", label: "Best Entertainment Series (Comedy/Drama/Reality)" },
      { id: "best_original_web", label: "Best Original Web Series" },
    ],
  },
  {
    id: "creator",
    label: "E. Digital Creator Sector",
    categories: [
      { id: "best_content_creator", label: "Best Content Creator (YouTube/Facebook/Instagram)" },
      { id: "most_watched_content", label: "Most Watched Content (Food/Travel/Gaming/Entertainment)" },
      { id: "most_popular_personality", label: "Most Popular Personality/Channel" },
      { id: "best_entertainer", label: "Best Entertainer of the Year" },
      { id: "most_popular_digital", label: "Most Popular Digital Content" },
      { id: "newcomer_influencer", label: "Newcomer Influencer of the Year" },
      { id: "best_influencer_backup", label: "Best Influencers Backup Support" },
    ],
  },
  {
    id: "individual",
    label: "F. Individual Sector",
    categories: [
      { id: "lifetime_achievement", label: "Lifetime Achievement Award" },
      { id: "most_versatile", label: "Most Versatile Personality of the Industry" },
      { id: "legends_journalism", label: "Legends of Journalism" },
      { id: "global_leader", label: "Global Leader and Facilitator of Broadcast Innovation" },
      { id: "best_ceo_cmo", label: "Best CEO & CMO Award" },
      { id: "entrepreneur_year", label: "Entrepreneur of the Year" },
      { id: "women_business_leader", label: "Women Business Leader of the Year" },
      { id: "young_champions", label: "Young Champions of the Year" },
      { id: "statesman", label: "Statesman of the Television Media Industry" },
    ],
  },
];

export const PRICE_PER_CATEGORY = 11800;

export function calcTotal(count: number) {
  return count * PRICE_PER_CATEGORY;
}

export function getSectorById(id: string): Sector | undefined {
  return SECTORS.find((s) => s.id === id);
}

export function getCategoriesForSector(sectorId: string, subSectorId?: string): CategoryItem[] {
  const sector = getSectorById(sectorId);
  if (!sector) return [];
  if (sector.subSectors) {
    if (subSectorId) {
      const sub = sector.subSectors.find((ss) => ss.id === subSectorId);
      return sub?.categories ?? [];
    }
    return sector.subSectors.flatMap((ss) => ss.categories);
  }
  return sector.categories ?? [];
}

export const SOURCE_OPTIONS = [
  "Google",
  "Facebook",
  "Instagram",
  "LinkedIn",
  "WhatsApp",
  "Email",
  "Industry Reference",
  "Event",
  "Other",
];

export const SALUTATIONS = ["Mr.", "Mrs.", "Ms.", "Dr.", "Prof."];
