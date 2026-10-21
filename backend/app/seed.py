import json
from datetime import datetime, timezone
from sqlalchemy import select
from app.core.database import AsyncSessionLocal
from app.core.security import get_password_hash
from app.models.organization import Organization
from app.models.user import User
from app.models.offering import Offering
from app.models.blog import BlogPost
from app.models.team import TeamMember
from app.models.partner import Partner
from app.models.booking import TourBooking
from app.models.rebac import RebacTuple

async def seed_initial_data():
    async with AsyncSessionLocal() as db:
        # 1. Organization
        org_stmt = select(Organization).where(Organization.slug == "roarworks-islamabad")
        res = await db.execute(org_stmt)
        org = res.scalar_one_or_none()
        if not org:
            org = Organization(
                name="The Roarworks Islamabad",
                slug="roarworks-islamabad",
                description="Flagship coworking, podcast studio, and managed workspace in Blue Area, Islamabad."
            )
            db.add(org)
            await db.commit()
            await db.refresh(org)

        # 2. Users
        admin_stmt = select(User).where(User.email == "admin@roarworks.com")
        if not (await db.execute(admin_stmt)).scalar_one_or_none():
            admin = User(
                email="admin@roarworks.com",
                hashed_password=get_password_hash("Admin@Roarworks2026!"),
                full_name="Afnan Ul Haq",
                phone="+923335557627",
                role="super_admin",
                is_active=True,
                organization_id=org.id
            )
            manager = User(
                email="manager@roarworks.com",
                hashed_password=get_password_hash("Manager@Roarworks2026!"),
                full_name="Sarah Khan",
                phone="+923331112233",
                role="workspace_manager",
                is_active=True,
                organization_id=org.id
            )
            staff = User(
                email="staff@roarworks.com",
                hashed_password=get_password_hash("Staff@Roarworks2026!"),
                full_name="Hamza Ali",
                phone="+923334445566",
                role="staff",
                is_active=True,
                organization_id=org.id
            )
            db.add_all([admin, manager, staff])
            await db.commit()
            await db.refresh(admin)
            await db.refresh(manager)
            await db.refresh(staff)

            # ReBAC seeds
            tuples = [
                RebacTuple(entity_type="user", entity_id=admin.id, relation="admin", object_type="organization", object_id=org.id),
                RebacTuple(entity_type="user", entity_id=manager.id, relation="manager", object_type="organization", object_id=org.id),
                RebacTuple(entity_type="user", entity_id=staff.id, relation="viewer", object_type="organization", object_id=org.id),
            ]
            db.add_all(tuples)
            await db.commit()

        # 3. Offerings
        off_count = (await db.execute(select(Offering))).scalars().all()
        if not off_count:
            offerings = [
                Offering(
                    name="Hot Desk",
                    slug="hot-desk",
                    tag="Flexible Seating",
                    description="Drop in and choose any open workspace. Ideal for freelancers, remote techies, and mobile professionals in Blue Area.",
                    price_pkr=18000,
                    billing_period="/month",
                    capacity="1 Person",
                    shift_type="Day or Night",
                    features_json=json.dumps([
                        "High-speed dual fiber internet",
                        "Unlimited artisan tea & green tea",
                        "Uninterrupted generator backup",
                        "Female-friendly secure access",
                        "Access to community events & lounge",
                        "No lock-in contract"
                    ]),
                    is_popular=False,
                    is_active=True,
                    display_order=1
                ),
                Offering(
                    name="Dedicated Desk",
                    slug="dedicated-desk",
                    tag="Most Popular",
                    description="Your own permanent desk reserved 24/7 with ergonomic chair, lockable pedestal, and meeting room credits.",
                    price_pkr=28000,
                    billing_period="/month",
                    capacity="1 Person",
                    shift_type="24/7 Access",
                    features_json=json.dumps([
                        "Permanent reserved desk & locker",
                        "24/7 access (Day & Night shifts)",
                        "5 hours free meeting room credits",
                        "Mailing address & courier handling",
                        "Dedicated power strip with UPS backup",
                        "Discounted podcast studio rates"
                    ]),
                    is_popular=True,
                    is_active=True,
                    display_order=2
                ),
                Offering(
                    name="Private Office",
                    slug="private-office",
                    tag="For Growing Teams",
                    description="Fully serviced, lockable private cabins for 2 to 20 people with custom acoustic glass partitions and executive desks.",
                    price_pkr=75000,
                    billing_period="/month",
                    capacity="2 - 20 People",
                    shift_type="24/7 Access",
                    features_json=json.dumps([
                        "Private sound-insulated office suite",
                        "Company branding on cabin door",
                        "15 hours monthly boardroom credits",
                        "24/7 biometric keyless entry",
                        "Complimentary executive coffee bar",
                        "Daily housekeeping and sanitization"
                    ]),
                    is_popular=False,
                    is_active=True,
                    display_order=3
                ),
                Offering(
                    name="Podcast Studio",
                    slug="podcast-studio",
                    tag="Unique Differentiator",
                    description="Islamabad's premier acoustically treated creator studio equipped with Shure SM7B mics, 4K multi-cam switcher, and broadcast lighting.",
                    price_pkr=4000,
                    billing_period="/hour",
                    capacity="Up to 4 Hosts",
                    shift_type="Flexible Booking",
                    features_json=json.dumps([
                        "4x Shure SM7B broadcast microphones",
                        "RODECaster Pro II audio console",
                        "2x Sony 4K mirrorless cinema cameras",
                        "Aputure studio softbox lighting grid",
                        "Soundproof acoustic paneling",
                        "On-site sound technician available"
                    ]),
                    is_popular=True,
                    is_active=True,
                    display_order=4
                ),
                Offering(
                    name="Meeting & Boardroom",
                    slug="meeting-room",
                    tag="Hourly / Daily",
                    description="Modern presentation space with 65-inch 4K screen, wireless screen casting, conference soundbar, and whiteboard.",
                    price_pkr=2500,
                    billing_period="/hour",
                    capacity="Up to 12 People",
                    shift_type="Flexible Booking",
                    features_json=json.dumps([
                        "65-inch 4K wireless presentation display",
                        "Logitech Rally 4K conference camera",
                        "Ergonomic mesh boardroom chairs",
                        "Magnetic glass whiteboards & markers",
                        "High-speed dedicated meeting WiFi",
                        "Refreshment catering upon request"
                    ]),
                    is_popular=False,
                    is_active=True,
                    display_order=5
                ),
                Offering(
                    name="Night Shift Pass",
                    slug="night-shift-pass",
                    tag="US/UK Shift Workers",
                    description="Tailored for remote software engineers and agency teams working international hours from 8:00 PM to 8:00 AM.",
                    price_pkr=22000,
                    billing_period="/month",
                    capacity="1 Person",
                    shift_type="Night Shift (8PM - 8AM)",
                    features_json=json.dumps([
                        "Silent night work environment",
                        "Dedicated security guard on duty",
                        "24/7 coffee & midnight snacks pantry",
                        "100% power uptime with heavy generators",
                        "Comfortable nap pod and lounge area",
                        "High-speed fiber with zero downtime"
                    ]),
                    is_popular=False,
                    is_active=True,
                    display_order=6
                )
            ]
            db.add_all(offerings)
            await db.commit()

        # 4. Blog Posts
        blog_count = (await db.execute(select(BlogPost))).scalars().all()
        if not blog_count:
            posts = [
                BlogPost(
                    title="Why your business absolutely needs a virtual office",
                    slug="why-your-business-needs-a-virtual-office",
                    excerpt="Establish prestige on Jinnah Avenue, Blue Area Islamabad without the overhead of long-term commercial leases.",
                    content="""### Establishing a Strong Corporate Identity in the Capital

In today's digital-first economy, location continues to signal credibility. Having a registered corporate address in Islamabad's commercial core—**Blue Area**—immediately differentiates your startup or agency from competitors operating from residential sectors.

#### 1. Prestigious Business Address on Jinnah Avenue
A Blue Area address on your company letterhead, tax filings, and client invoices immediately conveys stability and professionalism to international clients and Pakistani institutions alike.

#### 2. Mail Handling and Executive Reception
With The Roarworks virtual office package, our professional front desk team receives your registered mail, parcels, and executive guests, notifying you instantly via WhatsApp and digital mail scanning.

#### 3. Meeting Room Credits on Demand
When you need to sign a high-value contract or meet investors, book our modern boardroom with 4K video conferencing and executive hospitality, paying only for the hours you actually use.""",
                    cover_image="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80",
                    category="INTERIOR",
                    read_time="5 mins read",
                    published=True
                ),
                BlogPost(
                    title="How to Run Your Freelance Design Business on the Cheap",
                    slug="how-to-run-your-freelance-design-business-on-the-cheap",
                    excerpt="Smart tips on equipment, software, workspace efficiency, and international invoicing for Pakistani creatives.",
                    content="""### Scaling Your Design Career Without Breaking the Bank

Freelance designers often face a dilemma: working from home can lead to isolation and power cuts, while renting a traditional private office requires heavy security deposits and furniture costs.

#### Coworking: The Ultimate Cost Hack
By choosing a flexible hot desk at The Roarworks, you eliminate utility bills, internet downtime, and generator fuel costs into a single predictable monthly payment.

- **High-Speed Fiber with Backup**: Never drop a Figma live session or large file upload.
- **Client Presentation Spaces**: Impress your overseas design clients on video calls with acoustic booths.
- **Collaborative Community**: Find fellow copywriters, frontend developers, and animators right across your desk.""",
                    cover_image="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
                    category="TIPS_TRICK",
                    read_time="5 mins read",
                    published=True
                ),
                BlogPost(
                    title="Getting Clients to Care About Their Website Long Term",
                    slug="getting-clients-to-care-about-their-website-long-term",
                    excerpt="Proven strategies for web agencies and developers to turn one-time builds into recurring maintenance contracts.",
                    content="""### From One-Off Project to Long-Term Retainers

Most web developers deliver a website, hand over the credentials, and never hear from the client again until something breaks. Here is how modern agencies build profitable, long-lasting client relationships.

#### Shift the Conversation from Code to Conversion
Clients do not buy code; they buy leads, brand credibility, and search visibility. Position your website as an evolving digital storefront that needs continuous optimization:

1. **Monthly Security and Plugin Updates**
2. **Speed and Core Web Vitals Audits**
3. **Conversion Rate Experiments**
4. **Content and SEO Expansion**

At The Roarworks, many of our resident agency teams host monthly client reviews right inside our conference facilities.""",
                    cover_image="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
                    category="FREELANCE",
                    read_time="5 mins read",
                    published=True
                )
            ]
            db.add_all(posts)
            await db.commit()

        # 5. Team Members
        team_count = (await db.execute(select(TeamMember))).scalars().all()
        if not team_count:
            members = [
                TeamMember(
                    name="Afnan Ul Haq",
                    role="Managing Director & Founder",
                    bio="Serial entrepreneur passionate about building Islamabad's most vibrant creator and tech ecosystem in Blue Area.",
                    photo_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
                    email="afnan@roarworks.com",
                    linkedin_url="https://linkedin.com",
                    display_order=1
                ),
                TeamMember(
                    name="Sarah Khan",
                    role="Community & Operations Lead",
                    bio="Ensuring seamless day and night operations, female-friendly security, and welcoming community vibes for all members.",
                    photo_url="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
                    email="sarah@roarworks.com",
                    linkedin_url="https://linkedin.com",
                    display_order=2
                ),
                TeamMember(
                    name="Hamza Ali",
                    role="Studio & Media Producer",
                    bio="Audiophile and media engineer managing The Roarworks Podcast Studio, multi-cam switching, and audio mastering.",
                    photo_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
                    email="hamza@roarworks.com",
                    linkedin_url="https://linkedin.com",
                    display_order=3
                ),
                TeamMember(
                    name="Zoya Malik",
                    role="Member Experience Coordinator",
                    bio="Dedicated to tour bookings, shift scheduling, and ensuring rapid one-hour follow-ups on all visitor inquiries.",
                    photo_url="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80",
                    email="zoya@roarworks.com",
                    linkedin_url="https://linkedin.com",
                    display_order=4
                )
            ]
            db.add_all(members)
            await db.commit()

        # 6. Partners
        partner_count = (await db.execute(select(Partner))).scalars().all()
        if not partner_count:
            partners = [
                Partner(name="Nayatel Fiber", logo_url="https://upload.wikimedia.org/wikipedia/commons/e/ec/Nayatel_logo.png", category="Infrastructure Partner", display_order=1),
                Partner(name="Techlogix", logo_url="https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=200&q=80", category="Tech Enterprise", display_order=2),
                Partner(name="Devsinc", logo_url="https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=200&q=80", category="Software House", display_order=3),
                Partner(name="Careem", logo_url="https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=200&q=80", category="Corporate Member", display_order=4),
                Partner(name="Jazz xlr8", logo_url="https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=200&q=80", category="Accelerator", display_order=5),
            ]
            db.add_all(partners)
            await db.commit()

        # 7. Sample Bookings
        booking_count = (await db.execute(select(TourBooking))).scalars().all()
        if not booking_count:
            bookings = [
                TourBooking(
                    email="celine.dion@cafeworld.com",
                    full_name="Celine Dion",
                    phone="+92 300 1234567",
                    booking_type="Personal",
                    plan_interest="Hot Desk",
                    start_date="2026-10-25",
                    preferred_time="Morning Shift",
                    notes="Looking for a quiet spot for cafe business operations and laptop work.",
                    status="TOUR_SCHEDULED",
                    terms_agreed=True
                ),
                TourBooking(
                    email="riana.madiva@digitallead.pk",
                    full_name="Riana Madiva",
                    phone="+92 321 9876543",
                    booking_type="Personal",
                    plan_interest="Dedicated Desk",
                    start_date="2026-10-28",
                    preferred_time="Morning Shift",
                    notes="Digital marketer needing permanent desk and fast internet for video uploads.",
                    status="CONTACTED",
                    terms_agreed=True
                ),
                TourBooking(
                    email="john.melon@creators.co",
                    full_name="John Melon",
                    phone="+92 333 5558899",
                    booking_type="Podcast",
                    plan_interest="Podcast Studio",
                    start_date="2026-10-22",
                    preferred_time="Evening Shift",
                    notes="Recording a 4-episode tech podcast series. Interested in 4K cameras.",
                    status="COMPLETED",
                    terms_agreed=True
                ),
                TourBooking(
                    email="ayesha.siddiqui@finflow.io",
                    full_name="Ayesha Siddiqui",
                    phone="+92 312 4455667",
                    booking_type="Team",
                    plan_interest="Private Office",
                    start_date="2026-11-01",
                    preferred_time="Day Shift",
                    notes="Fintech startup team of 6 engineers moving to Blue Area.",
                    status="NEW",
                    terms_agreed=True
                )
            ]
            db.add_all(bookings)
            await db.commit()
