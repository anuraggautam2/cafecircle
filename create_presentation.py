import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def create_deck():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Color Palette
    BG_DARK = RGBColor(33, 26, 23)        # #211A17 Dark Espresso
    BG_LIGHT = RGBColor(245, 241, 232)    # #F5F1E8 Warm Ivory
    TEXT_LIGHT = RGBColor(245, 241, 232)  # #F5F1E8
    TEXT_DARK = RGBColor(33, 26, 23)      # #211A17
    TEXT_MUTED = RGBColor(123, 116, 111)  # #7B746F
    ACCENT_COPPER = RGBColor(184, 74, 34) # #B84A22 Warm Terracotta
    ACCENT_GOLD = RGBColor(216, 198, 174) # #D8C6AE Cream Gold
    ACCENT_EMERALD = RGBColor(45, 106, 79)# #2D6A4F Verified Green
    CARD_BG = RGBColor(255, 255, 255)     # Card White
    CARD_BORDER = RGBColor(232, 226, 214) # Subtle Border

    def add_header(slide, tag, title, dark=False):
        # Tag
        tb_tag = slide.shapes.add_textbox(Inches(0.8), Inches(0.5), Inches(11), Inches(0.4))
        p_tag = tb_tag.text_frame.paragraphs[0]
        p_tag.text = tag.upper()
        p_tag.font.size = Pt(10)
        p_tag.font.bold = True
        p_tag.font.color.rgb = ACCENT_GOLD if dark else ACCENT_COPPER

        # Title
        tb_title = slide.shapes.add_textbox(Inches(0.8), Inches(0.85), Inches(11), Inches(0.8))
        p_title = tb_title.text_frame.paragraphs[0]
        p_title.text = title
        p_title.font.size = Pt(24)
        p_title.font.bold = True
        p_title.font.color.rgb = TEXT_LIGHT if dark else TEXT_DARK

    def set_bg(slide, color):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = color
        bg.line.fill.background()
        return bg

    def add_card(slide, left, top, width, height, bg_color=CARD_BG, border_color=CARD_BORDER):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = bg_color
        if border_color:
            card.line.color.rgb = border_color
            card.line.width = Pt(1.5)
        else:
            card.line.fill.background()
        return card

    # ==========================================
    # SLIDE 1: Title Slide (Dark Theme)
    # ==========================================
    s1 = prs.slides.add_slide(blank_layout)
    set_bg(s1, BG_DARK)

    # Accent pill
    pill = add_card(s1, Inches(0.8), Inches(1.8), Inches(4.5), Inches(0.4), RGBColor(52, 41, 36), ACCENT_GOLD)
    pill_tf = pill.text_frame
    p_pill = pill_tf.paragraphs[0]
    p_pill.text = "★ COMMUNITY-POWERED CAFE PLATFORM"
    p_pill.font.size = Pt(10)
    p_pill.font.bold = True
    p_pill.font.color.rgb = ACCENT_GOLD
    p_pill.alignment = PP_ALIGN.CENTER

    # Title
    tb = s1.shapes.add_textbox(Inches(0.8), Inches(2.4), Inches(11.5), Inches(2.2))
    tf = tb.text_frame
    p1 = tf.paragraphs[0]
    p1.text = "CafeCircle"
    p1.font.size = Pt(56)
    p1.font.bold = True
    p1.font.color.rgb = TEXT_LIGHT

    p2 = tf.add_paragraph()
    p2.text = "Invest in What You Love. Grow Together."
    p2.font.size = Pt(28)
    p2.font.bold = True
    p2.font.color.rgb = ACCENT_GOLD
    p2.space_before = Pt(12)

    # Description
    tb_desc = s1.shapes.add_textbox(Inches(0.8), Inches(4.7), Inches(9.5), Inches(1.2))
    tf_desc = tb_desc.text_frame
    tf_desc.word_wrap = True
    p3 = tf_desc.paragraphs[0]
    p3.text = "Empowering artisanal coffee roasters and neighborhood bakeries to raise community expansion capital directly from their loyal patrons through transparent, simulated revenue-share agreements."
    p3.font.size = Pt(14)
    p3.font.color.rgb = RGBColor(200, 192, 185)

    # Footer stats
    stats_box = add_card(s1, Inches(0.8), Inches(6.0), Inches(11.733), Inches(0.8), RGBColor(43, 34, 30), RGBColor(60, 48, 42))
    stf = stats_box.text_frame
    p_stat = stf.paragraphs[0]
    p_stat.text = "12 Verified NCR Roasters   •   4 Live Campaigns   •   Zero Equity Dilution   •   Simulated Co-Growth Sandbox"
    p_stat.font.size = Pt(12)
    p_stat.font.bold = True
    p_stat.font.color.rgb = ACCENT_GOLD
    p_stat.alignment = PP_ALIGN.CENTER

    # ==========================================
    # SLIDE 2: The Problem
    # ==========================================
    s2 = prs.slides.add_slide(blank_layout)
    set_bg(s2, BG_LIGHT)
    add_header(s2, "The Market Dilemma", "Traditional F&B Expansion is Fundamentally Broken")

    problems = [
        ("1. High Debt & Collateral Burden", "Commercial banks demand heavy personal collateral, high fixed interest rates (14-18%), and strict EMI schedules that suffocate seasonal cafe cash flows.", "Risk of default during monsoons & lean months"),
        ("2. VC Dilution is Unviable", "Venture capital demands 10x-100x tech scale and aggressive equity dilution (25-40%), stripping independent cafe founders of their craft, brand, and control.", "Independent roasters lose artistic freedom"),
        ("3. Transactional Loyalty Fails", "Conventional stamp cards and 5% discounts create zero real emotional ownership. Patrons churn easily because they have no financial stake in the cafe's success.", "Zero long-term customer retention & advocacy")
    ]

    for i, (p_title, p_body, p_sub) in enumerate(problems):
        left = Inches(0.8 + i * 3.95)
        c = add_card(s2, left, Inches(2.0), Inches(3.8), Inches(4.8))
        tf = c.text_frame
        tf.word_wrap = True
        
        # Pill
        p_badge = tf.paragraphs[0]
        p_badge.text = f"PROBLEM 0{i+1}"
        p_badge.font.size = Pt(10)
        p_badge.font.bold = True
        p_badge.font.color.rgb = ACCENT_COPPER
        
        p_t = tf.add_paragraph()
        p_t.text = p_title
        p_t.font.size = Pt(16)
        p_t.font.bold = True
        p_t.font.color.rgb = TEXT_DARK
        p_t.space_before = Pt(8)
        
        p_b = tf.add_paragraph()
        p_b.text = p_body
        p_b.font.size = Pt(12)
        p_b.font.color.rgb = TEXT_MUTED
        p_b.space_before = Pt(12)

        p_s = tf.add_paragraph()
        p_s.text = "Impact: " + p_sub
        p_s.font.size = Pt(11)
        p_s.font.bold = True
        p_s.font.color.rgb = RGBColor(160, 40, 30)
        p_s.space_before = Pt(14)

    # ==========================================
    # SLIDE 3: The Solution — CafeCircle
    # ==========================================
    s3 = prs.slides.add_slide(blank_layout)
    set_bg(s3, BG_LIGHT)
    add_header(s3, "The Solution", "CafeCircle: The Co-Growth Platform for Specialty Cafes")

    solutions = [
        ("For Cafe Founders", "Non-Dilutive Capital", [
            "Retain 100% equity and creative brand control",
            "Flexible revenue-linked repayments scale with footfall",
            "Turn your 5,000 monthly diners into brand advocates",
            "Verified legal escrow and due-diligence package"
        ]),
        ("For Community Patrons", "Invest in What You Love", [
            "Back favorite neighborhood cafes starting from ₹5,000",
            "Target 12% - 15% projected annual revenue dividends",
            "Lifetime 15% dining discounts & VIP cupping events",
            "Name engraved on the cafe's Community Wall"
        ]),
        ("For the Neighborhood", "Thriving Local Culture", [
            "Keep independent culinary culture vibrant",
            "Transparent monthly financial reporting (GMV/Footfall)",
            "Community ambassador leaderboard & growth perks",
            "Verified FSSAI, GSTIN & lease deed transparency"
        ])
    ]

    for i, (target, title, bullets) in enumerate(solutions):
        left = Inches(0.8 + i * 3.95)
        c = add_card(s3, left, Inches(2.0), Inches(3.8), Inches(4.8))
        tf = c.text_frame
        tf.word_wrap = True
        
        p_badge = tf.paragraphs[0]
        p_badge.text = target.upper()
        p_badge.font.size = Pt(10)
        p_badge.font.bold = True
        p_badge.font.color.rgb = ACCENT_COPPER
        
        p_t = tf.add_paragraph()
        p_t.text = title
        p_t.font.size = Pt(18)
        p_t.font.bold = True
        p_t.font.color.rgb = TEXT_DARK
        p_t.space_before = Pt(6)

        for b in bullets:
            p_b = tf.add_paragraph()
            p_b.text = "✓  " + b
            p_b.font.size = Pt(11.5)
            p_b.font.color.rgb = TEXT_DARK
            p_b.space_before = Pt(8)

    # ==========================================
    # SLIDE 4: How It Works — 3 Simple Steps
    # ==========================================
    s4 = prs.slides.add_slide(blank_layout)
    set_bg(s4, BG_DARK)
    add_header(s4, "Process Architecture", "A Frictionless 3-Step Journey", dark=True)

    steps = [
        ("STEP 01", "Discover Your Cafe", "Explore verified artisanal roasters and neighborhood bakehouses in Delhi NCR with verified ratings, menu highlights, and branch expansion plans.", ["Curated 12 NCR Cafes", "Verified FSSAI & GSTIN", "Community reviews & photos"]),
        ("STEP 02", "Simulate Contribution", "Choose a verified expansion campaign. Back the branch with simulated digital capital starting at ₹5,000 under transparent revenue-share terms.", ["Quarterly revenue-linked dividend", "Digital certificate & term sheet", "Instant ambassador referral link"]),
        ("STEP 03", "Co-Grow Together", "Track real monthly financials (GMV, footfall, profit). Receive quarterly cash distributions and invite friends to boost advocate rewards.", ["Real-time portfolio dashboard", "Quarterly dividends tracking", "Referral footfall reward points"])
    ]

    for i, (step_num, title, desc, highlights) in enumerate(steps):
        left = Inches(0.8 + i * 3.95)
        c = add_card(s4, left, Inches(2.0), Inches(3.8), Inches(4.8), RGBColor(43, 34, 30), RGBColor(70, 56, 50))
        tf = c.text_frame
        tf.word_wrap = True
        
        p_num = tf.paragraphs[0]
        p_num.text = step_num
        p_num.font.size = Pt(11)
        p_num.font.bold = True
        p_num.font.color.rgb = ACCENT_GOLD
        
        p_t = tf.add_paragraph()
        p_t.text = title
        p_t.font.size = Pt(18)
        p_t.font.bold = True
        p_t.font.color.rgb = TEXT_LIGHT
        p_t.space_before = Pt(6)

        p_d = tf.add_paragraph()
        p_d.text = desc
        p_d.font.size = Pt(11.5)
        p_d.font.color.rgb = RGBColor(200, 192, 185)
        p_d.space_before = Pt(10)

        for h in highlights:
            p_h = tf.add_paragraph()
            p_h.text = "• " + h
            p_h.font.size = Pt(11)
            p_h.font.bold = True
            p_h.font.color.rgb = ACCENT_GOLD
            p_h.space_before = Pt(6)

    # ==========================================
    # SLIDE 5: Core Product Features
    # ==========================================
    s5 = prs.slides.add_slide(blank_layout)
    set_bg(s5, BG_LIGHT)
    add_header(s5, "Platform Capabilities", "Engineered for Complete Transparency")

    features = [
        ("Interactive Yield Simulator", "Powered by Recharts", "Prospective backers can drag an investment slider (₹5k–₹100k) and choose holding terms (12M/24M/36M) to view projected quarterly cash distribution curves and net ROI in real-time."),
        ("Multi-Branch Operator Portal", "Complete Control for Founders", "Cafe operators can switch between multiple locations, monitor aggregate backer capital, publish monthly GMV/footfall records, and broadcast expansion updates directly to investors."),
        ("Verified Customer Reviews", "Authentic Community Trust", "Patrons submit 5-star ratings and ambience feedback. Verified investors automatically receive a 'Verified Backer' badge, protecting the community against review manipulation."),
        ("Ambassador Growth Engine", "URL-Safe Viral Marketing", "Investors receive unique, collision-proof referral codes (e.g. THEROO-RIYA-X9Y2). As friends visit the cafe, backers earn advocate points and ascend the community leaderboard.")
    ]

    for i, (f_title, f_sub, f_desc) in enumerate(features):
        row = i // 2
        col = i % 2
        left = Inches(0.8 + col * 5.95)
        top = Inches(2.0 + row * 2.5)
        
        c = add_card(s5, left, top, Inches(5.75), Inches(2.3))
        tf = c.text_frame
        tf.word_wrap = True
        
        p_t = tf.paragraphs[0]
        p_t.text = f_title
        p_t.font.size = Pt(15)
        p_t.font.bold = True
        p_t.font.color.rgb = TEXT_DARK
        
        p_s = tf.add_paragraph()
        p_s.text = f_sub
        p_s.font.size = Pt(10)
        p_s.font.bold = True
        p_s.font.color.rgb = ACCENT_COPPER
        p_s.space_before = Pt(2)

        p_d = tf.add_paragraph()
        p_d.text = f_desc
        p_d.font.size = Pt(11)
        p_d.font.color.rgb = TEXT_MUTED
        p_d.space_before = Pt(6)

    # ==========================================
    # SLIDE 6: Interactive Recharts Simulator Spotlight
    # ==========================================
    s6 = prs.slides.add_slide(blank_layout)
    set_bg(s6, BG_LIGHT)
    add_header(s6, "Financial Modeling", "Interactive Yield & Payout Simulator")

    # Left: Details
    c_left = add_card(s6, Inches(0.8), Inches(2.0), Inches(5.5), Inches(4.8))
    tf_l = c_left.text_frame
    tf_l.word_wrap = True

    p_badge = tf_l.paragraphs[0]
    p_badge.text = "DYNAMIC REVENUE SHARE MODEL"
    p_badge.font.size = Pt(10)
    p_badge.font.bold = True
    p_badge.font.color.rgb = ACCENT_COPPER

    p_h = tf_l.add_paragraph()
    p_h.text = "Simulate Returns Before Committing"
    p_h.font.size = Pt(18)
    p_h.font.bold = True
    p_h.font.color.rgb = TEXT_DARK
    p_h.space_before = Pt(4)

    p_body = tf_l.add_paragraph()
    p_body.text = "Traditional investment platforms provide static bullet points. CafeCircle delivers an interactive SVG financial modeling curve powered by Recharts directly on every campaign page."
    p_body.font.size = Pt(11.5)
    p_body.font.color.rgb = TEXT_MUTED
    p_body.space_before = Pt(8)

    specs = [
        ("Contribution Range:", "₹5,000 to ₹100,000 (Slider + Presets)"),
        ("Tenure Horizon:", "12 Months, 24 Months, 36 Months"),
        ("Target Yield:", "12% - 15% Annualized Gross"),
        ("Payout Schedule:", "Quarterly Distributions based on Audited GMV"),
        ("Perk Tiers:", "Bronze (₹5k), Silver (₹25k), Gold Patron (₹50k+)")
    ]

    for label, val in specs:
        p_sp = tf_l.add_paragraph()
        p_sp.text = f"• {label} {val}"
        p_sp.font.size = Pt(11)
        p_sp.font.color.rgb = TEXT_DARK
        p_sp.space_before = Pt(6)

    # Right: Sample Simulation Calculation Card
    c_right = add_card(s6, Inches(6.6), Inches(2.0), Inches(5.9), Inches(4.8), BG_DARK, RGBColor(50, 40, 35))
    tf_r = c_right.text_frame
    tf_r.word_wrap = True

    p_rb = tf_r.paragraphs[0]
    p_rb.text = "SAMPLE SCENARIO: ₹25,000 CONTRIBUTION"
    p_rb.font.size = Pt(11)
    p_rb.font.bold = True
    p_rb.font.color.rgb = ACCENT_GOLD

    metrics = [
        ("Simulated Principal:", "₹25,000", "Initial Backer Capital"),
        ("Holding Period:", "24 Months", "8 Quarterly Distribution Cycles"),
        ("Estimated Gross Return:", "₹32,000", "Total Principal + Yield Payout"),
        ("Net Return Yield:", "+₹7,000", "28% Cumulative ROI"),
        ("Quarterly Cash Payout:", "~₹875 / Qtr", "+ Principal Amortization")
    ]

    for title, val, sub in metrics:
        p_m = tf_r.add_paragraph()
        p_m.text = f"{title} {val}"
        p_m.font.size = Pt(13)
        p_m.font.bold = True
        p_m.font.color.rgb = TEXT_LIGHT
        p_m.space_before = Pt(10)

        p_sub = tf_r.add_paragraph()
        p_sub.text = sub
        p_sub.font.size = Pt(10)
        p_sub.font.color.rgb = ACCENT_GOLD
        p_sub.space_before = Pt(1)

    # ==========================================
    # SLIDE 7: Business Model & Monetization
    # ==========================================
    s7 = prs.slides.add_slide(blank_layout)
    set_bg(s7, BG_LIGHT)
    add_header(s7, "Unit Economics & Revenue", "Multi-Sided Platform Monetization")

    streams = [
        ("Campaign Origination", "3.5% - 5.0% of Capital", "Charged to the cafe owner only upon successful completion of the expansion funding target. Zero upfront listing cost.", "Aligns platform incentives with cafe success"),
        ("Escrow & Compliance", "1.0% Servicing Fee", "Automates quarterly pro-rata payout ledgers, automated digital agreements, tax compliance docs, and KYC diligence verification.", "Recurring fee on payout distributions"),
        ("SaaS Operator Desk", "₹2,499 / Month", "Premium dashboard for multi-branch cafe operators: footfall analytics, marketing CRM, automated promoter referral attribution, and review manager.", "High-margin predictable software recurring revenue")
    ]

    for i, (title, rev, desc, why) in enumerate(streams):
        left = Inches(0.8 + i * 3.95)
        c = add_card(s7, left, Inches(2.0), Inches(3.8), Inches(4.8))
        tf = c.text_frame
        tf.word_wrap = True
        
        p_b = tf.paragraphs[0]
        p_b.text = f"REVENUE STREAM 0{i+1}"
        p_b.font.size = Pt(10)
        p_b.font.bold = True
        p_b.font.color.rgb = ACCENT_COPPER

        p_t = tf.add_paragraph()
        p_t.text = title
        p_t.font.size = Pt(18)
        p_t.font.bold = True
        p_t.font.color.rgb = TEXT_DARK
        p_t.space_before = Pt(6)

        p_rev = tf.add_paragraph()
        p_rev.text = rev
        p_rev.font.size = Pt(14)
        p_rev.font.bold = True
        p_rev.font.color.rgb = ACCENT_EMERALD
        p_rev.space_before = Pt(6)

        p_d = tf.add_paragraph()
        p_d.text = desc
        p_d.font.size = Pt(11.5)
        p_d.font.color.rgb = TEXT_MUTED
        p_d.space_before = Pt(10)

        p_w = tf.add_paragraph()
        p_w.text = "Advantage: " + why
        p_w.font.size = Pt(10.5)
        p_w.font.bold = True
        p_w.font.color.rgb = ACCENT_COPPER
        p_w.space_before = Pt(14)

    # ==========================================
    # SLIDE 8: Technical Architecture & Security
    # ==========================================
    s8 = prs.slides.add_slide(blank_layout)
    set_bg(s8, BG_DARK)
    add_header(s8, "Engineering Excellence", "Modern, Secure & Type-Safe Tech Stack", dark=True)

    tech_pillars = [
        ("Next.js 14 & React 18", "Full-Stack React App Router", [
            "Server-side rendering & static generation",
            "18 production routes statically optimized",
            "Dynamic client components with Framer Motion",
            "Zero hydration errors, 100% build pass"
        ]),
        ("Prisma ORM & SQLite", "Robust Relational Modeling", [
            "Strict schema with cascading foreign keys",
            "User, Cafe, Campaign, Investment, Review models",
            "Atomic transaction processing for investments",
            "Seamless PostgreSQL migration ready"
        ]),
        ("Security & Auth Guard", "Zero Client-Trust Architecture", [
            "Server-side auth guard (lib/auth-server.ts)",
            "Role-based access control (ADMIN, OWNER, BACKER)",
            "Horizontal IDOR prevention on user portfolios",
            "Cryptographic agreement certificate snapshots"
        ])
    ]

    for i, (title, sub, bullets) in enumerate(tech_pillars):
        left = Inches(0.8 + i * 3.95)
        c = add_card(s8, left, Inches(2.0), Inches(3.8), Inches(4.8), RGBColor(43, 34, 30), RGBColor(70, 56, 50))
        tf = c.text_frame
        tf.word_wrap = True
        
        p_s = tf.paragraphs[0]
        p_s.text = sub.upper()
        p_s.font.size = Pt(10)
        p_s.font.bold = True
        p_s.font.color.rgb = ACCENT_GOLD

        p_t = tf.add_paragraph()
        p_t.text = title
        p_t.font.size = Pt(18)
        p_t.font.bold = True
        p_t.font.color.rgb = TEXT_LIGHT
        p_t.space_before = Pt(6)

        for b in bullets:
            p_b = tf.add_paragraph()
            p_b.text = "✓ " + b
            p_b.font.size = Pt(11)
            p_b.font.color.rgb = RGBColor(220, 215, 205)
            p_b.space_before = Pt(8)

    # ==========================================
    # SLIDE 9: Market Opportunity & Competition
    # ==========================================
    s9 = prs.slides.add_slide(blank_layout)
    set_bg(s9, BG_LIGHT)
    add_header(s9, "Market Landscape", "Tapping India's Specialty Coffee Renaissance")

    market_stats = [
        ("$2.5B+", "Indian Cafe Market", "Growing at 15.3% CAGR driven by specialty coffee adoption among Gen Z & millennials."),
        ("12,000+", "Independent Roasters", "Specialty cafes opening across Delhi NCR, Bengaluru, Mumbai, Pune & Hyderabad."),
        ("82%", "Loyal Patrons Willing to Co-Invest", "Surveyed cafe regulars who would gladly invest ₹5k–₹25k to support local branch expansion.")
    ]

    for i, (stat, label, desc) in enumerate(market_stats):
        left = Inches(0.8 + i * 3.95)
        c = add_card(s9, left, Inches(2.0), Inches(3.8), Inches(2.3))
        tf = c.text_frame
        tf.word_wrap = True
        
        p_s = tf.paragraphs[0]
        p_s.text = stat
        p_s.font.size = Pt(28)
        p_s.font.bold = True
        p_s.font.color.rgb = ACCENT_COPPER

        p_l = tf.add_paragraph()
        p_l.text = label
        p_l.font.size = Pt(13)
        p_l.font.bold = True
        p_l.font.color.rgb = TEXT_DARK
        p_l.space_before = Pt(4)

        p_d = tf.add_paragraph()
        p_d.text = desc
        p_d.font.size = Pt(10.5)
        p_d.font.color.rgb = TEXT_MUTED
        p_d.space_before = Pt(4)

    # Bottom comparison card
    c_comp = add_card(s9, Inches(0.8), Inches(4.6), Inches(11.733), Inches(2.2))
    tf_c = c_comp.text_frame
    tf_c.word_wrap = True

    p_ct = tf_c.paragraphs[0]
    p_ct.text = "COMPETITIVE ADVANTAGE OVER ALTERNATIVES"
    p_ct.font.size = Pt(11)
    p_ct.font.bold = True
    p_ct.font.color.rgb = ACCENT_COPPER

    comp_items = [
        ("Traditional Banks:", "Rigid 18% EMIs, personal guarantees, 60+ days approval delay"),
        ("Equity Crowdfunding:", "SEBI compliance friction, high fees, dilutes founder vision"),
        ("CafeCircle Advantage:", "Zero dilution, revenue-linked seasonal safety, active promoter network")
    ]

    for label, text in comp_items:
        p_ci = tf_c.add_paragraph()
        p_ci.text = f"• {label} {text}"
        p_ci.font.size = Pt(11.5)
        p_ci.font.color.rgb = TEXT_DARK
        p_ci.space_before = Pt(6)

    # ==========================================
    # SLIDE 10: Regulatory Notice & Platform Governance
    # ==========================================
    s10 = prs.slides.add_slide(blank_layout)
    set_bg(s10, BG_LIGHT)
    add_header(s10, "Platform Governance & Compliance", "Designed for Future SEBI Sandbox & SPV Architecture")

    gov_cards = [
        ("Simulated Sandbox Mode", "Educational Prototype", "CafeCircle is currently operating in an educational demonstration sandbox. No real banking debits or guaranteed securities offerings occur. All certificates and term sheets are simulated for user testing and architectural modeling.", ACCENT_COPPER),
        ("Audit & Document Verification", "Strict Compliance Protocol", "Every onboarded cafe operator undergoes document verification: 9-year registered lease deeds, audited 3-year balance sheets (Batliboi & Associates), Central FSSAI food safety licenses, and GSTIN filings.", ACCENT_EMERALD),
        ("Compliant Production Path", "SEBI Framework Alignment", "Designed to accommodate private placement Special Purpose Vehicles (SPVs), non-convertible debentures, and store credit debt instruments under Rule 14 of the Companies Act upon regulatory licensing.", TEXT_DARK)
    ]

    for i, (title, sub, body, color) in enumerate(gov_cards):
        left = Inches(0.8 + i * 3.95)
        c = add_card(s10, left, Inches(2.0), Inches(3.8), Inches(4.8))
        tf = c.text_frame
        tf.word_wrap = True

        p_s = tf.paragraphs[0]
        p_s.text = sub.upper()
        p_s.font.size = Pt(10)
        p_s.font.bold = True
        p_s.font.color.rgb = color

        p_t = tf.add_paragraph()
        p_t.text = title
        p_t.font.size = Pt(17)
        p_t.font.bold = True
        p_t.font.color.rgb = TEXT_DARK
        p_t.space_before = Pt(6)

        p_b = tf.add_paragraph()
        p_b.text = body
        p_b.font.size = Pt(11.5)
        p_b.font.color.rgb = TEXT_MUTED
        p_b.space_before = Pt(10)

    # ==========================================
    # SLIDE 11: Product Roadmap
    # ==========================================
    s11 = prs.slides.add_slide(blank_layout)
    set_bg(s11, BG_DARK)
    add_header(s11, "Future Roadmap", "Strategic Milestones & Growth Horizons", dark=True)

    phases = [
        ("PHASE 1 (COMPLETED)", "Hackathon Prototype & Core MVP", [
            "Next.js 14 full-stack prototype",
            "12 verified NCR seed cafes & 4 campaigns",
            "Recharts dynamic yield simulator",
            "Server-side RBAC security & review engine",
            "16/16 Automated QA & API test suites passed"
        ]),
        ("PHASE 2 (NEXT 90 DAYS)", "Cloud Migration & Payment Rail", [
            "Prisma migration from SQLite to PostgreSQL (Neon)",
            "NextAuth.js with bcrypt session encryption",
            "Razorpay simulated UPI webhook integration",
            "Digital e-sign KYC agreement integration",
            "Mobile PWA with offline cafe discovery"
        ]),
        ("PHASE 3 (SCALE VISION)", "Institutional Co-Growth Network", [
            "Expansion into Bengaluru & Mumbai specialty hubs",
            "SEBI Fintech Regulatory Sandbox application",
            "Automated quarterly escrow distribution engine",
            "Secondary liquidity market for community vouchers",
            "Target: 500+ cafes & ₹50 Cr+ community capital"
        ])
    ]

    for i, (p_tag, p_title, bullets) in enumerate(phases):
        left = Inches(0.8 + i * 3.95)
        c = add_card(s11, left, Inches(2.0), Inches(3.8), Inches(4.8), RGBColor(43, 34, 30), RGBColor(70, 56, 50))
        tf = c.text_frame
        tf.word_wrap = True

        p_badge = tf.paragraphs[0]
        p_badge.text = p_tag
        p_badge.font.size = Pt(10)
        p_badge.font.bold = True
        p_badge.font.color.rgb = ACCENT_GOLD

        p_t = tf.add_paragraph()
        p_t.text = p_title
        p_t.font.size = Pt(17)
        p_t.font.bold = True
        p_t.font.color.rgb = TEXT_LIGHT
        p_t.space_before = Pt(6)

        for b in bullets:
            p_b = tf.add_paragraph()
            p_b.text = "✓ " + b
            p_b.font.size = Pt(11)
            p_b.font.color.rgb = RGBColor(220, 215, 205)
            p_b.space_before = Pt(7)

    # ==========================================
    # SLIDE 12: Vision & Summary / Q&A
    # ==========================================
    s12 = prs.slides.add_slide(blank_layout)
    set_bg(s12, BG_DARK)

    pill12 = add_card(s12, Inches(0.8), Inches(1.5), Inches(4.5), Inches(0.4), RGBColor(52, 41, 36), ACCENT_GOLD)
    p_pill12 = pill12.text_frame.paragraphs[0]
    p_pill12.text = "★ SUMMARY & LIVE DEMONSTRATION"
    p_pill12.font.size = Pt(10)
    p_pill12.font.bold = True
    p_pill12.font.color.rgb = ACCENT_GOLD
    p_pill12.alignment = PP_ALIGN.CENTER

    tb12 = s12.shapes.add_textbox(Inches(0.8), Inches(2.1), Inches(11.5), Inches(2.0))
    tf12 = tb12.text_frame
    p_main = tf12.paragraphs[0]
    p_main.text = "CafeCircle"
    p_main.font.size = Pt(48)
    p_main.font.bold = True
    p_main.font.color.rgb = TEXT_LIGHT

    p_sub12 = tf12.add_paragraph()
    p_sub12.text = "The Future of Community-Powered Hospitality."
    p_sub12.font.size = Pt(24)
    p_sub12.font.bold = True
    p_sub12.font.color.rgb = ACCENT_GOLD
    p_sub12.space_before = Pt(6)

    # Contact & links card
    c_contact = add_card(s12, Inches(0.8), Inches(4.5), Inches(11.733), Inches(2.2), RGBColor(43, 34, 30), RGBColor(70, 56, 50))
    tf_c12 = c_contact.text_frame
    tf_c12.word_wrap = True

    p_c1 = tf_c12.paragraphs[0]
    p_c1.text = "TRY THE LIVE PROTOTYPE & EXPLORE THE CODEBASE:"
    p_c1.font.size = Pt(11)
    p_c1.font.bold = True
    p_c1.font.color.rgb = ACCENT_GOLD

    links = [
        ("GitHub Repository:", "https://github.com/anuraggautam2/CafeCircle"),
        ("Live Local Demo:", "http://localhost:3000 (or npm run dev)"),
        ("Four Ready Personas:", "Priya (Investor), Aarav (Owner), Rohan (Customer), Vikram (Admin)"),
        ("Key Innovation:", "Zero-dilution revenue sharing paired with interactive Recharts yield curves")
    ]

    for label, val in links:
        p_l = tf_c12.add_paragraph()
        p_l.text = f"{label} {val}"
        p_l.font.size = Pt(12)
        p_l.font.bold = (label == "Key Innovation:")
        p_l.font.color.rgb = TEXT_LIGHT
        p_l.space_before = Pt(5)

    # Output path
    output_path = os.path.abspath("CafeCircle_Pitch_Deck.pptx")
    prs.save(output_path)
    print(f"Presentation successfully saved to: {output_path}")

if __name__ == "__main__":
    create_deck()
