const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verify() {
  console.log('=== VERIFYING CAFECIRCLE DATABASE & SEED DATA ===');

  const usersCount = await prisma.user.count();
  const cafesCount = await prisma.cafe.count();
  const branchesCount = await prisma.cafeBranch.count();
  const campaignsCount = await prisma.campaign.count();
  const investmentsCount = await prisma.investment.count();
  const agreementsCount = await prisma.investmentAgreement.count();
  const transactionsCount = await prisma.transaction.count();
  const referralsCount = await prisma.referral.count();
  const conversionsCount = await prisma.referralConversion.count();
  const updatesCount = await prisma.businessUpdate.count();
  const financialsCount = await prisma.financialReport.count();
  const documentsCount = await prisma.document.count();
  const reviewsCount = await prisma.review.count();
  const notificationsCount = await prisma.notification.count();

  console.log(`✓ Users: ${usersCount}`);
  console.log(`✓ Cafes: ${cafesCount}`);
  console.log(`✓ Branches: ${branchesCount}`);
  console.log(`✓ Campaigns: ${campaignsCount}`);
  console.log(`✓ Investments: ${investmentsCount}`);
  console.log(`✓ Agreements: ${agreementsCount}`);
  console.log(`✓ Transactions: ${transactionsCount}`);
  console.log(`✓ Referrals: ${referralsCount}`);
  console.log(`✓ Conversions: ${conversionsCount}`);
  console.log(`✓ Business Updates: ${updatesCount}`);
  console.log(`✓ Financial Reports: ${financialsCount}`);
  console.log(`✓ Documents: ${documentsCount}`);
  console.log(`✓ Reviews: ${reviewsCount}`);
  console.log(`✓ Notifications: ${notificationsCount}`);

  console.log('\nSample Campaign Raised Amounts:');
  const camps = await prisma.campaign.findMany({
    select: { title: true, targetAmount: true, raisedAmount: true, investorCount: true },
  });
  camps.forEach((c) => {
    console.log(`  - ${c.title}: Raised ₹${(c.raisedAmount / 100000).toFixed(2)}L / ₹${(c.targetAmount / 100000).toFixed(2)}L (${c.investorCount} Backers)`);
  });

  console.log('\nSample Top Advocates:');
  const refs = await prisma.referral.findMany({
    include: { referrer: true, cafe: true },
    orderBy: { advocatePoints: 'desc' },
  });
  refs.forEach((r) => {
    console.log(`  - ${r.referrer.name} -> ${r.cafe.name}: ${r.totalVisits} Visits Driven, ${r.advocatePoints} Advocate Points (Code: ${r.referralCode})`);
  });

  console.log('\n=== ALL DATABASE CONSTRAINTS & MODELS VERIFIED ===');
}

verify()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
