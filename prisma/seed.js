const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding CafeCircle database with real Ghaziabad & Delhi NCR cafe listings...');

  // Clean existing data
  await prisma.review.deleteMany({});
  await prisma.document.deleteMany({});
  await prisma.financialReport.deleteMany({});
  await prisma.businessUpdate.deleteMany({});
  await prisma.referralConversion.deleteMany({});
  await prisma.referral.deleteMany({});
  await prisma.transaction.deleteMany({});
  await prisma.investmentAgreement.deleteMany({});
  await prisma.investment.deleteMany({});
  await prisma.campaign.deleteMany({});
  await prisma.cafeBranch.deleteMany({});
  await prisma.cafe.deleteMany({});
  await prisma.cafeOwner.deleteMany({});
  await prisma.investor.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.user.deleteMany({});

  // 1. Create Core Users
  // Cafe Owner: Aarav Sharma (Founding Partner & Operator)
  const ownerUser = await prisma.user.create({
    data: {
      id: 'usr_owner_aarav',
      name: 'Aarav Sharma',
      email: 'aarav@roasterycoffee.com',
      password: 'password123',
      role: 'CAFE_OWNER',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      phone: '+91 98101 22334',
      bio: 'Hospitality entrepreneur & specialty cafe operator. Partnering with local culinary ventures across Ghaziabad and Delhi NCR.',
      referralCode: 'AARAVDELHINCR',
      city: 'Ghaziabad',
    },
  });

  const cafeOwner = await prisma.cafeOwner.create({
    data: {
      id: 'owner_aarav',
      userId: ownerUser.id,
      businessName: 'NCR Specialty Hospitality Partners LLP',
      businessPan: 'AABCN1234F',
      gstNumber: '09AABCN1234F1Z3',
      isVerified: true,
      verificationStatus: 'VERIFIED',
      bankAccountDetails: 'HDFC Bank - Current A/C ***8921',
    },
  });

  // Customer Investor: Priya Patel
  const investorUser = await prisma.user.create({
    data: {
      id: 'usr_investor_priya',
      name: 'Priya Patel',
      email: 'priya@investor.com',
      password: 'password123',
      role: 'INVESTOR',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
      phone: '+91 98112 33445',
      bio: 'Fintech strategy director and local cafe enthusiast. Active community backer of independent neighborhood bakeries and specialty roasters.',
      referralCode: 'PRIYAPATEL',
      city: 'Delhi NCR',
    },
  });

  const investor = await prisma.investor.create({
    data: {
      id: 'inv_priya',
      userId: investorUser.id,
      kycStatus: 'VERIFIED',
      totalInvested: 75000,
      totalReturnsReceived: 6200,
      activeInvestmentsCount: 2,
      ambassadorTier: 'Espresso Patron',
    },
  });

  // Regular Customer: Rohan Sen
  const customerUser = await prisma.user.create({
    data: {
      id: 'usr_customer_rohan',
      name: 'Rohan Sen',
      email: 'rohan@customer.com',
      password: 'password123',
      role: 'CUSTOMER',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      phone: '+91 99100 44556',
      bio: 'Design lead & daily specialty brew hopper exploring top cafes across Ghaziabad, Indirapuram and Delhi NCR.',
      referralCode: 'ROHANCIRCLE',
      city: 'Ghaziabad',
    },
  });

  // Compliance Admin: Vikram Mehta
  const adminUser = await prisma.user.create({
    data: {
      id: 'usr_admin_vikram',
      name: 'Vikram Mehta',
      email: 'admin@cafecircle.com',
      password: 'password123',
      role: 'ADMIN',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      phone: '+91 98990 11223',
      bio: 'Platform Compliance Officer & Verification Lead at CafeCircle.',
      referralCode: 'ADMINCIRCLE',
      city: 'Delhi NCR',
    },
  });

  // 2. The 12 Real Cafes for Ghaziabad & Delhi NCR
  const cafeListings = [
    {
      id: 'cafe_roof_sky',
      name: 'THE ROOF SKY RESTAURANT & CAFE',
      slug: 'the-roof-sky-restaurant-and-cafe',
      tagline: 'Panoramic Open-Sky Terrace Dining & Skyline Views in Raj Nagar',
      description: 'THE ROOF SKY Restaurant & Cafe is one of Ghaziabad’s signature rooftop dining destinations located in RDC Raj Nagar. Featuring open-air sky lounges, private cabanas, multi-cuisine continental platters, sizzling platters, mocktails, and live acoustic weekend sessions.',
      story: 'Created to bring expansive skyline dining and celebration spaces to Ghaziabad, THE ROOF SKY offers vibrant terrace seating with ambient fairy lights, handcrafted shakes, wood-fired snacks, and panoramic views over Raj Nagar District Centre.',
      logo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=200&q=80',
      coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
      ]),
      address: 'C-31, 3rd Floor, RDC, Raj Nagar',
      city: 'Ghaziabad',
      state: 'Uttar Pradesh',
      pincode: '201002',
      establishedYear: 2021,
      currentBranchesCount: 1,
      website: 'https://theroofsky.example.com',
      instagram: '@theroofsky_rdc',
      rating: 4.1,
      reviewCount: 1240,
      cuisine: 'Continental & North Indian',
      openingHours: '11:00 AM – 11:30 PM',
      isOpen: true,
      priceForTwo: '₹1,200 for two',
      dataSource: 'Seed Listing • Ghaziabad Directory',
      isVerified: true,
      verificationBadge: 'COMMUNITY_VERIFIED_DIRECTORY',
    },
    {
      id: 'cafe_sandoz',
      name: 'Cafe Sandoz',
      slug: 'cafe-sandoz',
      tagline: 'Modern Aesthetic Hangout with Wood-Fired Crusts & Thick Shakes',
      description: 'Cafe Sandoz brings contemporary casual dining to RDC Raj Nagar, Ghaziabad. A favorite hangout for youth, students and families, famous for its juicy burgers, creamy Alfredo pasta, crisp thin-crust pizzas, and signature milkshakes.',
      story: 'Known across Delhi NCR for high-energy casual dining, Cafe Sandoz combines modern rustic wooden interior architecture with an extensive continental menu and fast casual comforts.',
      logo: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=200&q=80',
      coverImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      ]),
      address: 'Plot 12, District Centre, RDC, Raj Nagar',
      city: 'Ghaziabad',
      state: 'Uttar Pradesh',
      pincode: '201002',
      establishedYear: 2020,
      currentBranchesCount: 2,
      website: 'https://cafesandoz.example.com',
      instagram: '@cafesandoz_official',
      rating: 4.3,
      reviewCount: 2480,
      cuisine: 'Continental & Italian',
      openingHours: '11:00 AM – 11:00 PM',
      isOpen: true,
      priceForTwo: '₹900 for two',
      dataSource: 'Seed Listing • Ghaziabad Directory',
      isVerified: true,
      verificationBadge: 'COMMUNITY_VERIFIED_DIRECTORY',
    },
    {
      id: 'cafe_farzi',
      name: 'Farzi Cafe',
      slug: 'farzi-cafe',
      tagline: 'The Modern Indian Bistro Creating Illusion with Food',
      description: 'Farzi Cafe is Zorawar Kalra’s acclaimed avant-garde spice bistro blending culinary science, molecular gastronomy, and global presentation techniques with traditional Indian flavours.',
      story: 'Farzi Cafe redefines gourmet Indian cuisine into tapas-style culinary art. Renowned for theatrical presentation, dry ice infusions, and craft concoctions popular with diners across Delhi NCR.',
      logo: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=200&q=80',
      coverImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80',
      ]),
      address: 'E-38/39, First Floor, Inner Circle, Connaught Place',
      city: 'Delhi NCR',
      state: 'Delhi',
      pincode: '110001',
      establishedYear: 2014,
      currentBranchesCount: 4,
      website: 'https://farzicafe.example.com',
      instagram: '@farzicafe',
      rating: 4.4,
      reviewCount: 5820,
      cuisine: 'Modern Indian & Molecular',
      openingHours: '12:00 PM – 1:00 AM',
      isOpen: true,
      priceForTwo: '₹2,200 for two',
      dataSource: 'Seed Listing • Delhi NCR Directory',
      isVerified: true,
      verificationBadge: 'COMMUNITY_VERIFIED_DIRECTORY',
    },
    {
      id: 'cafe_barista',
      name: 'Barista',
      slug: 'barista',
      tagline: 'Pioneer of Italian Espresso Culture in India Since 2000',
      description: 'Barista brings authentic Italian coffeehouse charm with warm espresso roasts, Brulés, cappuccinos, freshly pressed focaccia paninis, and rich chocolate brownies across Indirapuram and Ghaziabad.',
      story: 'As India’s foundational cafe brand since 2000, Barista created the warm third-space tradition where professionals, students, and friends gather over authentic espresso.',
      logo: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=200&q=80',
      coverImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
      ]),
      address: 'Ground Floor, Shipra Mall, Vaibhav Khand, Indirapuram',
      city: 'Ghaziabad',
      state: 'Uttar Pradesh',
      pincode: '201014',
      establishedYear: 2000,
      currentBranchesCount: 3,
      website: 'https://barista.example.com',
      instagram: '@baristacoffeecompany',
      rating: 4.1,
      reviewCount: 870,
      cuisine: 'Italian Espresso & Bakes',
      openingHours: '9:00 AM – 11:00 PM',
      isOpen: true,
      priceForTwo: '₹650 for two',
      dataSource: 'Seed Listing • Ghaziabad Directory',
      isVerified: true,
      verificationBadge: 'COMMUNITY_VERIFIED_DIRECTORY',
    },
    {
      id: 'cafe_chaayos',
      name: 'Chaayos',
      slug: 'chaayos',
      tagline: 'Experiments with Chai — 80,000+ Customizations in a Kulhad',
      description: 'Chaayos celebrates India’s timeless passion for freshly boiled chai with customized blends (Desi Chai, Shahi Chai, Gur Wali Chai), Bun Maska, Palak Patta Chaat, and spicy street treats in Vaishali.',
      story: 'Founded on the philosophy of "Experiments with Chai", Chaayos blends automated robotic tea brewing technology with traditional Indian nostalgia.',
      logo: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=200&q=80',
      coverImage: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=800&q=80',
      ]),
      address: 'Upper Ground Floor, Mahagun Metro Mall, Sector 3, Vaishali',
      city: 'Ghaziabad',
      state: 'Uttar Pradesh',
      pincode: '201010',
      establishedYear: 2012,
      currentBranchesCount: 4,
      website: 'https://chaayos.example.com',
      instagram: '@chaayos',
      rating: 4.3,
      reviewCount: 3120,
      cuisine: 'Specialty Chai & Street Bakes',
      openingHours: '8:00 AM – 11:00 PM',
      isOpen: true,
      priceForTwo: '₹500 for two',
      dataSource: 'Seed Listing • Ghaziabad Directory',
      isVerified: true,
      verificationBadge: 'COMMUNITY_VERIFIED_DIRECTORY',
    },
    {
      id: 'cafe_delhi_heights',
      name: 'Cafe Delhi Heights',
      slug: 'cafe-delhi-heights',
      tagline: 'Home of the Legendary Juicy Lucy Burger & Vibrant Cafe Comfort',
      description: 'Cafe Delhi Heights is an eclectic high-energy dining institution famous for its original award-winning Juicy Lucy burger, hearty pasta bowls, quirky private booth seating, and artisanal bakery.',
      story: 'Founded by Vikrant & Sharad Batra, Cafe Delhi Heights blends global comfort dining with Delhi’s rich culinary legacy in a cozy, bohemian ambience.',
      logo: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=200&q=80',
      coverImage: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1200&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
      ]),
      address: '3rd Floor, DLF Mall of India, Sector 18 (Noida / NCR Hub for Ghaziabad)',
      city: 'Delhi NCR',
      state: 'Uttar Pradesh',
      pincode: '201301',
      establishedYear: 2011,
      currentBranchesCount: 5,
      website: 'https://cafedelhiheights.example.com',
      instagram: '@cafedelhiheights',
      rating: 4.4,
      reviewCount: 4950,
      cuisine: 'Continental & American',
      openingHours: '11:00 AM – 12:00 AM',
      isOpen: true,
      priceForTwo: '₹1,600 for two',
      dataSource: 'Seed Listing • Delhi NCR Directory',
      isVerified: true,
      verificationBadge: 'COMMUNITY_VERIFIED_DIRECTORY',
    },
    {
      id: 'cafe_bon_amigos',
      name: 'Bon Amigos Cafe & Kitchen',
      slug: 'bon-amigos-cafe-and-kitchen',
      tagline: 'Friendly Vibes, Artisanal Pizzas & Warm Community Gatherings',
      description: 'Bon Amigos Cafe & Kitchen in RDC Raj Nagar is a beloved neighborhood hangout celebrated for its chic pastel aesthetics, loaded thin-crust pizzas, sizzling platters, thick milkshakes, and warm community events.',
      story: 'Bon Amigos was started by passionate young culinary creators who wanted to give Ghaziabad a warm, beautiful cafe where conversation flows naturally. Raising community capital to build an expansive courtyard kitchen in Vaishali.',
      logo: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=200&q=80',
      coverImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?auto=format&fit=crop&w=800&q=80',
      ]),
      address: 'C-42, Ground Floor, RDC, Raj Nagar',
      city: 'Ghaziabad',
      state: 'Uttar Pradesh',
      pincode: '201002',
      establishedYear: 2021,
      currentBranchesCount: 1,
      website: 'https://bonamigos.example.com',
      instagram: '@bonamigos_rdc',
      rating: 4.3,
      reviewCount: 1460,
      cuisine: 'Continental & Italian',
      openingHours: '11:30 AM – 11:00 PM',
      isOpen: true,
      priceForTwo: '₹850 for two',
      dataSource: 'Seed Listing • Verified Expansion Partner',
      isVerified: true,
      verificationBadge: 'ACTIVE_COMMUNITY_CAMPAIGN',
    },
    {
      id: 'cafe_alma_bakery',
      name: 'Alma Bakery & Cafe',
      slug: 'alma-bakery-and-cafe',
      tagline: 'Sourdough Craft Breads, Paris-Brest & European Brews in Raj Nagar',
      description: 'Alma Bakery & Cafe is Ghaziabad’s premier artisanal European bakehouse, bringing slow-fermented sourdoughs, delicate French viennoiserie, Paris-Brest, Basque cheesecakes, and third-wave manual coffee brews to Raj Nagar.',
      story: 'Trained at European culinary academies, Alma’s founders brought authentic slow boulangerie traditions to Ghaziabad. We are expanding to a central sourdough laboratory and boutique cafe in Indirapuram with our loyal community backers.',
      logo: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=200&q=80',
      coverImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
      ]),
      address: 'C-143, RDC, Raj Nagar',
      city: 'Ghaziabad',
      state: 'Uttar Pradesh',
      pincode: '201002',
      establishedYear: 2022,
      currentBranchesCount: 1,
      website: 'https://almabakery.example.com',
      instagram: '@almabakerycafe',
      rating: 4.4,
      reviewCount: 1820,
      cuisine: 'European Bakery & Coffee',
      openingHours: '9:00 AM – 10:30 PM',
      isOpen: true,
      priceForTwo: '₹750 for two',
      dataSource: 'Seed Listing • Verified Expansion Partner',
      isVerified: true,
      verificationBadge: 'ACTIVE_COMMUNITY_CAMPAIGN',
    },
    {
      id: 'cafe_blue_tokai',
      name: 'Blue Tokai Coffee Roasters',
      slug: 'blue-tokai-coffee-roasters',
      tagline: 'India’s Premier Estate-to-Cup Specialty Coffee Roasters',
      description: 'Blue Tokai Coffee Roasters pioneered single-origin specialty coffee across India. Sourcing directly from certified Indian estates, roasting fresh weekly, and serving manual pourovers, flat whites, and healthy sourdough brunch.',
      story: 'Started in Saidulajab in 2013, Blue Tokai makes high-grade Indian Arabica accessible. Now expanding with a dedicated Ghaziabad RDC roasting atelier & community sensory cupping room.',
      logo: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=200&q=80',
      coverImage: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1200&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=800&q=80',
      ]),
      address: 'Starling Edge Mall, Sector 104, Noida / Delhi NCR (Bordering Ghaziabad)',
      city: 'Delhi NCR',
      state: 'Uttar Pradesh',
      pincode: '201304',
      establishedYear: 2013,
      currentBranchesCount: 6,
      website: 'https://bluetokaicoffee.example.com',
      instagram: '@bluetokaicoffee',
      rating: 4.6,
      reviewCount: 3680,
      cuisine: 'Specialty Coffee & Bakes',
      openingHours: '7:30 AM – 11:00 PM',
      isOpen: true,
      priceForTwo: '₹700 for two',
      dataSource: 'Seed Listing • Verified Expansion Partner',
      isVerified: true,
      verificationBadge: 'ACTIVE_COMMUNITY_CAMPAIGN',
    },
    {
      id: 'cafe_big_chill',
      name: 'The Big Chill Cafe',
      slug: 'the-big-chill-cafe',
      tagline: 'Retro Cinema Magic, Creamy Pastas & Iconic Cheesecakes',
      description: 'The Big Chill Cafe is an iconic Delhi NCR landmark known for retro 1950s cinematic posters, rustic exposed brick walls, rich Penne Vodka, baked lasagna, and legendary desserts including the Mississippi Mud Pie.',
      story: 'Started in 2000 in East of Kailash, Big Chill remains one of the most revered culinary institutions in NCR, providing generous Italian portions and comforting nostalgic warmth.',
      logo: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=200&q=80',
      coverImage: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1200&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1621996346565-e3d5d6281691?auto=format&fit=crop&w=800&q=80',
      ]),
      address: '3rd Floor, DLF Mall of India, Sector 18 (Noida / NCR Hub for Ghaziabad)',
      city: 'Delhi NCR',
      state: 'Uttar Pradesh',
      pincode: '201301',
      establishedYear: 2000,
      currentBranchesCount: 5,
      website: 'https://thebigchillcafe.example.com',
      instagram: '@bigchillcafe',
      rating: 4.6,
      reviewCount: 8240,
      cuisine: 'Classic Italian & Desserts',
      openingHours: '12:00 PM – 11:30 PM',
      isOpen: true,
      priceForTwo: '₹1,800 for two',
      dataSource: 'Seed Listing • Delhi NCR Directory',
      isVerified: true,
      verificationBadge: 'COMMUNITY_VERIFIED_DIRECTORY',
    },
    {
      id: 'cafe_open_house',
      name: 'Open House Cafe',
      slug: 'open-house-cafe',
      tagline: 'Vintage Mechanical Decor, Spirited Cocktails & Live Evenings',
      description: 'Open House Cafe in Connaught Place combines industrial steampunk machinery decor, expansive lounge seating, circular views of CP, and an energetic lineup of multi-cuisine continental and Asian delicacies.',
      story: 'A flagship Delhi NCR destination for evening gatherings, acoustic music sessions, and wood-fired platters in the historic heart of the capital.',
      logo: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=200&q=80',
      coverImage: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=1200&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      ]),
      address: 'C-37, Radial Road 5, Block C, Connaught Place',
      city: 'Delhi NCR',
      state: 'Delhi',
      pincode: '110001',
      establishedYear: 2015,
      currentBranchesCount: 1,
      website: 'https://openhousecafe.example.com',
      instagram: '@openhousecp',
      rating: 4.2,
      reviewCount: 4320,
      cuisine: 'Continental & North Indian',
      openingHours: '12:00 PM – 1:00 AM',
      isOpen: true,
      priceForTwo: '₹1,700 for two',
      dataSource: 'Seed Listing • Delhi NCR Directory',
      isVerified: true,
      verificationBadge: 'COMMUNITY_VERIFIED_DIRECTORY',
    },
    {
      id: 'cafe_citrus',
      name: 'Citrus Cafe',
      slug: 'citrus-cafe',
      tagline: 'Vibrant 24/7 All-Day Dining by Lemon Tree in Kaushambi',
      description: 'Citrus Cafe at Lemon Tree Hotel Kaushambi features cheerful yellow-and-green decor, lavish buffet spreads, and 24-hour comfort dining spanning Indian home-style curries, American burgers, and European grills.',
      story: 'Located on the East Delhi / Ghaziabad border, Citrus Cafe caters to night owls, early business travelers, and Sunday family brunches with around-the-clock culinary hospitality.',
      logo: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&w=200&q=80',
      coverImage: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&w=1200&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      ]),
      address: 'Lemon Tree Hotel, Plot No 1, Kaushambi',
      city: 'Ghaziabad',
      state: 'Uttar Pradesh',
      pincode: '201010',
      establishedYear: 2016,
      currentBranchesCount: 1,
      website: 'https://lemontreehotels.example.com/citrus-kaushambi',
      instagram: '@lemontreehotels',
      rating: 4.2,
      reviewCount: 1180,
      cuisine: 'Multi-Cuisine & Buffet (24/7)',
      openingHours: '24 Hours Open',
      isOpen: true,
      priceForTwo: '₹1,500 for two',
      dataSource: 'Seed Listing • Ghaziabad Directory',
      isVerified: true,
      verificationBadge: 'COMMUNITY_VERIFIED_DIRECTORY',
    },
  ];

  // Insert all 12 Cafes
  for (const c of cafeListings) {
    await prisma.cafe.create({
      data: {
        ...c,
        ownerId: cafeOwner.id,
      },
    });
  }

  // 3. Cafe Branches
  await prisma.cafeBranch.createMany({
    data: [
      {
        cafeId: 'cafe_bon_amigos',
        name: 'RDC Raj Nagar Original',
        address: 'C-42, Ground Floor, RDC, Raj Nagar',
        city: 'Ghaziabad',
        status: 'OPERATING',
        seatingCapacity: 45,
        monthlyFootfall: 4200,
      },
      {
        cafeId: 'cafe_bon_amigos',
        name: 'Vaishali Courtyard Kitchen (Expansion)',
        address: 'Sector 4, Main Road, Vaishali',
        city: 'Ghaziabad',
        status: 'UPCOMING',
        seatingCapacity: 65,
        monthlyFootfall: 0,
      },
      {
        cafeId: 'cafe_alma_bakery',
        name: 'RDC Bakehouse & Atelier',
        address: 'C-143, RDC, Raj Nagar',
        city: 'Ghaziabad',
        status: 'OPERATING',
        seatingCapacity: 50,
        monthlyFootfall: 4800,
      },
      {
        cafeId: 'cafe_alma_bakery',
        name: 'Indirapuram Flagship Sourdough Lab',
        address: 'Plot 18, Vaibhav Khand, Indirapuram',
        city: 'Ghaziabad',
        status: 'UPCOMING',
        seatingCapacity: 75,
        monthlyFootfall: 0,
      },
      {
        cafeId: 'cafe_blue_tokai',
        name: 'Sector 104 Roastery Cafe',
        address: 'Starling Edge Mall, Sector 104, Noida',
        city: 'Delhi NCR',
        status: 'OPERATING',
        seatingCapacity: 55,
        monthlyFootfall: 5900,
      },
      {
        cafeId: 'cafe_blue_tokai',
        name: 'Ghaziabad RDC Roastery Lab',
        address: 'Block B, RDC, Raj Nagar',
        city: 'Ghaziabad',
        status: 'UPCOMING',
        seatingCapacity: 60,
        monthlyFootfall: 0,
      },
      {
        cafeId: 'cafe_roof_sky',
        name: 'RDC Skyline Terrace',
        address: 'C-31, 3rd Floor, RDC, Raj Nagar',
        city: 'Ghaziabad',
        status: 'OPERATING',
        seatingCapacity: 90,
        monthlyFootfall: 5200,
      },
      {
        cafeId: 'cafe_sandoz',
        name: 'RDC Central Outlet',
        address: 'Plot 12, District Centre, RDC, Raj Nagar',
        city: 'Ghaziabad',
        status: 'OPERATING',
        seatingCapacity: 80,
        monthlyFootfall: 6800,
      },
      {
        cafeId: 'cafe_citrus',
        name: 'Kaushambi 24-Hour Lounge',
        address: 'Lemon Tree Hotel, Kaushambi',
        city: 'Ghaziabad',
        status: 'OPERATING',
        seatingCapacity: 110,
        monthlyFootfall: 7400,
      },
    ],
  });

  // 4. Create Active Campaigns (Only for 3 Verified Expansion Cafes!)
  // Campaign 1: Alma Bakery & Cafe
  const campaignAlma = await prisma.campaign.create({
    data: {
      id: 'cmp_alma_expansion',
      cafeId: 'cafe_alma_bakery',
      title: 'Alma Bakery: Indirapuram Flagship & Sourdough Lab',
      slug: 'alma-bakery-indirapuram-expansion',
      pitch: 'Expanding Ghaziabad’s most beloved European artisanal bakehouse to Indirapuram. Help us build a state-of-the-art French stone deck hearth oven and boutique garden cafe.',
      reasonForFunding: 'Unprecedented customer demand from Indirapuram, Vaishali and Noida residents who travel to our Raj Nagar bakery for fresh morning sourdough and pastries. Funds will procure a Bongard stone-hearth deck oven, cold proofer, and build our greenhouse courtyard dining space.',
      expansionPlan: 'Signed 5-year lease on Vaibhav Khand, Indirapuram. Kitchen fit-out takes 75 days. Target launch within Q1 2027 with projected monthly revenue of ₹19 Lakhs at maturity.',
      targetAmount: 3000000,
      raisedAmount: 2480000,
      minInvestment: 5000,
      maxInvestment: 100000,
      startDate: new Date(Date.now() - 18 * 86400000),
      endDate: new Date(Date.now() + 14 * 86400000),
      status: 'ACTIVE',
      investmentStructure: 'REVENUE_SHARE',
      returnTerms: '5.2% of gross monthly Indirapuram branch revenue distributed pro-rata quarterly until 1.30x return cap is reached (Projected IRR: 14.2% p.a.). Includes 15% lifetime bakery discount badge and quarterly tasting club invitations.',
      riskFactors: 'Commercial lease terms escalation, import duties on European bakery equipment, local health department clearance timelines.',
      pitchDeckUrl: 'https://storage.googleapis.com/cafecircle/decks/alma_bakery_deck.pdf',
      financialAuditUrl: 'https://storage.googleapis.com/cafecircle/audits/alma_bakery_fy25.pdf',
      investorCount: 46,
      projectedReturnRate: '13.5% - 15.0% p.a. (Simulated)',
      repaymentPeriod: '24 - 30 Months',
      expansionCity: 'Ghaziabad',
      expansionArea: 'Indirapuram (Vaibhav Khand)',
    },
  });

  // Campaign 2: Blue Tokai Coffee Roasters
  const campaignBlueTokai = await prisma.campaign.create({
    data: {
      id: 'cmp_bluetokai_ghaziabad',
      cafeId: 'cafe_blue_tokai',
      title: 'Blue Tokai: Ghaziabad RDC Roastery Lab & Tasting Room',
      slug: 'blue-tokai-ghaziabad-roastery-expansion',
      pitch: 'Bringing India’s leading single-origin micro-roastery to Raj Nagar District Centre. Establishing Ghaziabad’s first manual cupping laboratory and estate brew bar.',
      reasonForFunding: 'Ghaziabad has rapidly emerged as a specialty coffee hotspot. Capital will be utilized for a bespoke 12kg Diedrich infrared drum roaster, Reverse Osmosis remineralized brewing water plant, and Modbar under-counter espresso stations.',
      expansionPlan: 'Acquired a prime 2,400 sq.ft ground level corner space in RDC Raj Nagar. Modular fit-out is 60% mapped. Opening scheduled within 90 days of round completion.',
      targetAmount: 4000000,
      raisedAmount: 3550000,
      minInvestment: 10000,
      maxInvestment: 150000,
      startDate: new Date(Date.now() - 22 * 86400000),
      endDate: new Date(Date.now() + 8 * 86400000),
      status: 'ACTIVE',
      investmentStructure: 'REVENUE_SHARE',
      returnTerms: '5.0% of gross monthly branch revenue paid quarterly until 1.35x capital return. Backers receive quarterly micro-lot sample bags from Chikmagalur estates and complimentary brewing masterclasses.',
      riskFactors: 'Specialty green bean crop price variations, power supply backup infrastructure setup, municipal signage licensing.',
      pitchDeckUrl: 'https://storage.googleapis.com/cafecircle/decks/bluetokai_gzb_deck.pdf',
      financialAuditUrl: 'https://storage.googleapis.com/cafecircle/audits/bluetokai_fy25_audit.pdf',
      investorCount: 62,
      projectedReturnRate: '14.0% - 16.0% p.a. (Simulated)',
      repaymentPeriod: '28 - 34 Months',
      expansionCity: 'Ghaziabad',
      expansionArea: 'RDC Raj Nagar',
    },
  });

  // Campaign 3: Bon Amigos Cafe & Kitchen
  const campaignBonAmigos = await prisma.campaign.create({
    data: {
      id: 'cmp_bonamigos_expansion',
      cafeId: 'cafe_bon_amigos',
      title: 'Bon Amigos: Vaishali Courtyard Kitchen & Pizzeria',
      slug: 'bon-amigos-vaishali-expansion',
      pitch: 'Expanding Bon Amigos to a spacious alfresco courtyard in Vaishali with wood-fired Neapolitan pizza ovens, live pasta stations, and handcrafted beverage bars.',
      reasonForFunding: 'Our Raj Nagar kitchen is consistently full on weekend evenings. Vaishali offers incredible density of young professionals and families seeking premium casual dining experiences.',
      expansionPlan: 'Lease secured in Vaishali Sector 4. Space design by Studio Urbane. Projected monthly GMV of ₹16 Lakhs at full capacity.',
      targetAmount: 2200000,
      raisedAmount: 1760000,
      minInvestment: 5000,
      maxInvestment: 75000,
      startDate: new Date(Date.now() - 12 * 86400000),
      endDate: new Date(Date.now() + 18 * 86400000),
      status: 'ACTIVE',
      investmentStructure: 'REVENUE_SHARE',
      returnTerms: '4.8% of gross monthly Vaishali branch revenue distributed pro-rata quarterly until 1.28x return cap is achieved.',
      riskFactors: 'Kitchen equipment delivery timelines, commercial utility connections, monsoon seasonality.',
      pitchDeckUrl: 'https://storage.googleapis.com/cafecircle/decks/bonamigos_vaishali.pdf',
      financialAuditUrl: 'https://storage.googleapis.com/cafecircle/audits/bonamigos_fy25.pdf',
      investorCount: 34,
      projectedReturnRate: '12.5% - 14.5% p.a. (Simulated)',
      repaymentPeriod: '20 - 28 Months',
      expansionCity: 'Ghaziabad',
      expansionArea: 'Vaishali Sector 4',
    },
  });

  // 5. Investments by Priya Patel
  const investment1 = await prisma.investment.create({
    data: {
      id: 'inv_priya_alma',
      campaignId: campaignAlma.id,
      investorId: investor.id,
      amount: 40000,
      returnsAccrued: 3400,
      certificateNumber: 'CERT-CC-ALMA-0891',
      status: 'CONFIRMED',
      paymentMethod: 'UPI_SIMULATED',
      paymentReference: 'TXN-UPI-SIM-991201',
      isSimulated: true,
    },
  });

  await prisma.investmentAgreement.create({
    data: {
      investmentId: investment1.id,
      agreementNumber: 'AGR-2026-ALMA-0891',
      termSheetSnapshot: campaignAlma.returnTerms,
      termsAccepted: true,
    },
  });

  const investment2 = await prisma.investment.create({
    data: {
      id: 'inv_priya_bluetokai',
      campaignId: campaignBlueTokai.id,
      investorId: investor.id,
      amount: 35000,
      returnsAccrued: 2800,
      certificateNumber: 'CERT-CC-BT-0412',
      status: 'CONFIRMED',
      paymentMethod: 'CARD_SIMULATED',
      paymentReference: 'TXN-CARD-SIM-774120',
      isSimulated: true,
    },
  });

  await prisma.investmentAgreement.create({
    data: {
      investmentId: investment2.id,
      agreementNumber: 'AGR-2026-BT-0412',
      termSheetSnapshot: campaignBlueTokai.returnTerms,
      termsAccepted: true,
    },
  });

  // 6. Transactions
  await prisma.transaction.createMany({
    data: [
      {
        userId: investorUser.id,
        investmentId: investment1.id,
        amount: 40000,
        type: 'INVESTMENT_SIMULATED',
        status: 'COMPLETED',
        referenceId: 'TXN-UPI-SIM-991201',
        notes: 'Simulated community investment in Alma Bakery Indirapuram expansion',
      },
      {
        userId: investorUser.id,
        investmentId: investment2.id,
        amount: 35000,
        type: 'INVESTMENT_SIMULATED',
        status: 'COMPLETED',
        referenceId: 'TXN-CARD-SIM-774120',
        notes: 'Simulated community investment in Blue Tokai Ghaziabad Roastery expansion',
      },
      {
        userId: investorUser.id,
        investmentId: investment1.id,
        amount: 3400,
        type: 'RETURN_PAYOUT',
        status: 'COMPLETED',
        referenceId: 'TXN-PAYOUT-SIM-11029',
        notes: 'Q3 simulated quarterly pro-rata revenue distribution',
      },
    ],
  });

  // 7. Community Growth Referrals & Conversions
  const referral1 = await prisma.referral.create({
    data: {
      referrerId: investorUser.id,
      cafeId: 'cafe_alma_bakery',
      referralCode: 'PRIYA-ALMA-GZB',
      totalShares: 38,
      totalClicks: 164,
      totalVisits: 28,
      totalConversions: 8,
      advocatePoints: 780,
    },
  });

  const referral2 = await prisma.referral.create({
    data: {
      referrerId: customerUser.id,
      cafeId: 'cafe_bon_amigos',
      referralCode: 'ROHAN-AMIGOS-GZB',
      totalShares: 22,
      totalClicks: 95,
      totalVisits: 16,
      totalConversions: 4,
      advocatePoints: 410,
    },
  });

  await prisma.referralConversion.createMany({
    data: [
      {
        referralId: referral1.id,
        conversionType: 'CAFE_VISIT',
        visitorName: 'Sneha Kapoor',
        rewardCredits: 40,
      },
      {
        referralId: referral1.id,
        conversionType: 'INVESTMENT',
        visitorName: 'Ankit Gupta',
        rewardCredits: 150,
      },
      {
        referralId: referral2.id,
        conversionType: 'CAFE_VISIT',
        visitorName: 'Varun Sharma',
        rewardCredits: 40,
      },
    ],
  });

  // 8. Business Updates
  await prisma.businessUpdate.createMany({
    data: [
      {
        cafeId: 'cafe_alma_bakery',
        title: 'Bongard Stone Hearth Oven Arrived & Masonry 65% Complete in Indirapuram',
        content: 'Exciting news for our Indirapuram backers! Our custom Bongard steam stone deck oven has landed at site. Tile masonry and front glasshouse work is on schedule.',
        milestoneTag: 'Construction Milestone',
        images: '[]',
        isPublic: true,
      },
      {
        cafeId: 'cafe_blue_tokai',
        title: 'Infrared Roasting Drum Setup & Water Filtration Lab Cleared',
        content: 'Installation of our Diedrich roaster and water remineralization plant for the RDC Raj Nagar brew bar has passed initial diagnostic runs.',
        milestoneTag: 'Equipment Installed',
        images: '[]',
        isPublic: true,
      },
      {
        cafeId: 'cafe_bon_amigos',
        title: 'Vaishali Kitchen Layout Finalized & Neapolitan Oven Ordered',
        content: 'Architectural drawings for the Vaishali courtyard pizzeria have received municipal NOC. Floor plan will accommodate 65 seats comfortably.',
        milestoneTag: 'Design & Permits',
        images: '[]',
        isPublic: true,
      },
    ],
  });

  // 9. Financial Reports
  await prisma.financialReport.createMany({
    data: [
      {
        cafeId: 'cafe_alma_bakery',
        month: 'October',
        year: 2026,
        grossRevenue: 1520000,
        netProfit: 310000,
        customerFootfall: 4900,
        notes: 'October festive bakes & morning sourdough demand up 18% YoY.',
        isVerified: true,
      },
      {
        cafeId: 'cafe_alma_bakery',
        month: 'September',
        year: 2026,
        grossRevenue: 1410000,
        netProfit: 285000,
        customerFootfall: 4600,
        notes: 'Consistent daily sell-out of French baguettes and artisan cruffins.',
        isVerified: true,
      },
      {
        cafeId: 'cafe_blue_tokai',
        month: 'October',
        year: 2026,
        grossRevenue: 2180000,
        netProfit: 460000,
        customerFootfall: 6200,
        notes: 'Single-origin estate harvest releases drove high retail pack sales.',
        isVerified: true,
      },
      {
        cafeId: 'cafe_bon_amigos',
        month: 'October',
        year: 2026,
        grossRevenue: 1340000,
        netProfit: 265000,
        customerFootfall: 4300,
        notes: 'Weekend evening dining capacity operated at 98%.',
        isVerified: true,
      },
    ],
  });

  // 10. Documents
  await prisma.document.createMany({
    data: [
      {
        cafeId: 'cafe_alma_bakery',
        title: 'FSSAI Food Safety License - Alma Bakehouse',
        docType: 'FSSAI_LICENSE',
        fileUrl: 'https://storage.googleapis.com/cafecircle/docs/fssai_alma_2026.pdf',
        fileSize: '1.4 MB',
        isVerified: true,
      },
      {
        cafeId: 'cafe_alma_bakery',
        title: 'Indirapuram Commercial Lease Agreement (Registered Deed)',
        docType: 'LEASE_AGREEMENT',
        fileUrl: 'https://storage.googleapis.com/cafecircle/docs/lease_indirapuram_alma.pdf',
        fileSize: '3.8 MB',
        isVerified: true,
      },
      {
        cafeId: 'cafe_blue_tokai',
        title: 'FY24-25 Audited Financial Statements',
        docType: 'FINANCIAL_AUDIT',
        fileUrl: 'https://storage.googleapis.com/cafecircle/docs/bluetokai_fy25_audit.pdf',
        fileSize: '2.9 MB',
        isVerified: true,
      },
      {
        cafeId: 'cafe_bon_amigos',
        title: 'GSTIN Registration Certificate - Bon Amigos Kitchen',
        docType: 'GST',
        fileUrl: 'https://storage.googleapis.com/cafecircle/docs/gst_bonamigos.pdf',
        fileSize: '850 KB',
        isVerified: true,
      },
    ],
  });

  // 11. Customer Reviews
  await prisma.review.createMany({
    data: [
      {
        cafeId: 'cafe_alma_bakery',
        userId: customerUser.id,
        rating: 5,
        comment: 'Alma is an absolute gem in Raj Nagar. The crust on the country sourdough loaf is shatteringly crisp, and their cortado is consistently dialed in. Can’t wait for their Indirapuram branch!',
        isInvestor: false,
      },
      {
        cafeId: 'cafe_roof_sky',
        userId: customerUser.id,
        rating: 4,
        comment: 'Loved the open-air seating and fairy lights. Sizzling platters and cold coffees were solid. Perfect place for celebrating birthdays with friends in RDC.',
        isInvestor: false,
      },
      {
        cafeId: 'cafe_blue_tokai',
        userId: investorUser.id,
        rating: 5,
        comment: 'Blue Tokai sets the gold standard for Indian specialty coffee. Having their manual cupping bar in RDC will transform the local coffee culture completely.',
        isInvestor: true,
      },
    ],
  });

  // 12. Real-time Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: investorUser.id,
        title: 'Simulated Quarterly Revenue Share Credited',
        message: '₹3,400 has been credited to your simulated ledger from Alma Bakery Indirapuram.',
        type: 'PAYOUT',
        link: '/dashboard/investor',
      },
      {
        userId: investorUser.id,
        title: 'New Customer Visit Recorded via Your Link',
        message: 'Sneha Kapoor visited Alma Bakery using your link PRIYA-ALMA-GZB (+40 advocate pts).',
        type: 'REFERRAL_VISIT',
        link: '/growth-engine',
      },
      {
        userId: ownerUser.id,
        title: 'Milestone Update Published to 46 Backers',
        message: 'Your Indirapuram Bongard Stone Hearth update was sent to all active investors.',
        type: 'MILESTONE_UPDATE',
        link: '/dashboard/owner',
      },
      {
        userId: customerUser.id,
        title: 'Welcome to CafeCircle Ghaziabad & Delhi NCR!',
        message: 'Explore top specialty cafes in Raj Nagar, Indirapuram, Vaishali, and Connaught Place.',
        type: 'PLATFORM',
        link: '/explore',
      },
    ],
  });

  console.log('✅ Successfully seeded all 12 real cafes, 3 verified expansion campaigns, and Ghaziabad / Delhi NCR ecosystem!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
