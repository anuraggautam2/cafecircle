export type UserRole = 'INVESTOR' | 'CAFE_OWNER' | 'CUSTOMER' | 'ADMIN';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  referralCode: string;
  bio?: string;
  city?: string;
  cafeOwner?: {
    id: string;
    businessName: string;
    isVerified: boolean;
    verificationStatus: string;
  };
  investor?: {
    id: string;
    kycStatus: string;
    totalInvested: number;
    totalReturnsReceived: number;
    activeInvestmentsCount: number;
    ambassadorTier: string;
  };
}

export interface CafeBranch {
  id: string;
  cafeId: string;
  name: string;
  address: string;
  city: string;
  status: 'OPERATING' | 'UPCOMING' | 'PLANNED';
  openingDate?: string;
  seatingCapacity: number;
  monthlyFootfall: number;
}

export interface BusinessUpdate {
  id: string;
  cafeId: string;
  title: string;
  content: string;
  images: string[];
  milestoneTag: string;
  isPublic: boolean;
  authorRole: string;
  createdAt: string;
}

export interface FinancialReport {
  id: string;
  cafeId: string;
  month: string;
  year: number;
  grossRevenue: number;
  netProfit: number;
  customerFootfall: number;
  reportPdfUrl?: string;
  notes?: string;
  isVerified: boolean;
  createdAt: string;
}

export interface DocumentItem {
  id: string;
  cafeId: string;
  title: string;
  docType: 'PAN' | 'GST' | 'FSSAI_LICENSE' | 'FINANCIAL_AUDIT' | 'PITCH_DECK' | 'LEASE_AGREEMENT';
  fileUrl: string;
  fileSize: string;
  isVerified: boolean;
  uploadedAt: string;
}

export interface Cafe {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  story?: string;
  logo: string;
  coverImage: string;
  images: string[];
  address: string;
  city: string;
  state: string;
  establishedYear: number;
  currentBranchesCount: number;
  website?: string;
  instagram?: string;
  rating: number;
  reviewCount: number;
  cuisine?: string;
  openingHours?: string;
  isOpen?: boolean;
  priceForTwo?: string;
  dataSource?: string;
  isVerified: boolean;
  verificationBadge: string;
  branches?: CafeBranch[];
  campaigns?: Campaign[];
  businessUpdates?: BusinessUpdate[];
  financialReports?: FinancialReport[];
  documents?: DocumentItem[];
  reviews?: Review[];
}

export interface Campaign {
  id: string;
  cafeId: string;
  cafe?: Cafe;
  title: string;
  slug: string;
  pitch: string;
  reasonForFunding: string;
  expansionPlan: string;
  targetAmount: number;
  raisedAmount: number;
  minInvestment: number;
  maxInvestment: number;
  startDate: string;
  endDate: string;
  status: 'DRAFT' | 'ACTIVE' | 'FUNDED' | 'COMPLETED';
  investmentStructure: 'REVENUE_SHARE' | 'STORE_CREDIT_PERKS' | 'HYBRID_GROWTH';
  returnTerms: string;
  riskFactors: string;
  pitchDeckUrl?: string;
  financialAuditUrl?: string;
  investorCount: number;
  projectedReturnRate: string;
  repaymentPeriod: string;
  expansionCity: string;
  expansionArea: string;
  createdAt: string;
}

export interface Investment {
  id: string;
  campaignId: string;
  campaign?: Campaign;
  investorId: string;
  amount: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  certificateNumber: string;
  paymentMethod: string;
  paymentReference: string;
  returnsAccrued: number;
  isSimulated: boolean;
  createdAt: string;
  agreement?: {
    id: string;
    agreementNumber: string;
    termSheetSnapshot: string;
    signedAt: string;
    pdfUrl?: string;
    status: string;
  };
}

export interface ReferralStat {
  id: string;
  referrerId: string;
  cafeId: string;
  cafeName: string;
  referralCode: string;
  totalClicks: number;
  totalVisits: number;
  totalConversions: number;
  totalShares: number;
  advocatePoints: number;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  tier: string;
  cafeSupported: string;
  visitsDriven: number;
  advocateScore: number;
  totalInvested: number;
}

export interface Review {
  id: string;
  cafeId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  isInvestor: boolean;
  createdAt: string;
}
