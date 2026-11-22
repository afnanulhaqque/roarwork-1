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
from app.models.testimonial import Testimonial
from app.core.redis import delete_cache

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
        offering_specs = [
            ("Hot Desk", "hot-desk", "Flexible Seating", "Drop in and choose any open workspace.", 25000, "/month", "1 Person", "Day or Night", ["High-speed dual fiber internet", "Generator backup", "Tea and coffee", "Community lounge"], False, 1),
            ("Dedicated Desk", "dedicated-desk", "Most Popular", "Your own permanent desk reserved 24/7.", 38000, "/month", "1 Person", "24/7 Access", ["Permanent desk and locker", "24/7 access", "Meeting room credits", "Dedicated power backup"], True, 2),
            ("Private Office", "private-office", "For Growing Teams", "Private office suites from PKR 120,000 to PKR 230,000 per month.", 120000, "/month", "Flexible Capacity", "24/7 Access", ["Private lockable office", "24/7 access", "Utilities included", "Office size and rate vary from PKR 120,000 to PKR 230,000 per month"], False, 3),
            ("Meeting Room Only", "meeting-room", "Hourly", "Modern meeting space available by the hour.", 2500, "/hour", "Up to 12 People", "Flexible Booking", ["4K presentation display", "Wireless screen casting", "Conference camera and audio", "Whiteboard"], False, 4),
            ("Shared Hall Day Pass", "shared-hall-day-pass", "Day Pass", "A flexible day pass in the shared hall.", 2500, "/day", "1 Person", "Day Shift", ["Shared hall seating", "High-speed internet", "Tea and coffee", "Generator backup"], False, 5),
            ("Private Hall - Hourly", "private-hall-hourly", "Hourly", "Private hall access for meetings or events.", 4500, "/hour", "Flexible Capacity", "Flexible Booking", ["Private hall access", "Presentation setup", "High-speed internet"], False, 6),
            ("Private Hall - Day Pass", "private-hall-day-pass", "Day Pass", "Private hall access for a full day.", 10000, "/day", "Flexible Capacity", "Day Shift", ["Private hall access", "Presentation setup", "High-speed internet"], False, 7),
            ("Podcast Studio - No Equipment", "podcast-studio", "Studio Rental", "Podcast studio access without equipment.", 9000, "/session", "Up to 4 Hosts", "Flexible Booking", ["Acoustically treated studio", "Studio space only", "No recording equipment included"], False, 8),
            ("Podcast Studio - Equipment", "podcast-studio-equipment", "Audio + Video", "Studio with equipment and audio/video recording.", 16000, "/session", "Up to 4 Hosts", "Flexible Booking", ["Recording equipment", "Audio recording", "Video recording", "Acoustically treated studio"], True, 9),
            ("Podcast Studio - Full Package", "podcast-studio-full-package", "Best Package", "Full package with basic editing.", 21000, "/session", "Up to 4 Hosts", "Flexible Booking", ["Recording equipment", "Audio/video recording", "Basic editing", "Acoustically treated studio"], True, 10),
        ]
        existing_offerings = (await db.execute(select(Offering))).scalars().all()
        by_slug = {offering.slug: offering for offering in existing_offerings}
        wanted_slugs = set()
        for name, slug, tag, description, price, period, capacity, shift, features, popular, order in offering_specs:
            wanted_slugs.add(slug)
            offering = by_slug.get(slug)
            if offering is None:
                offering = Offering(slug=slug)
                db.add(offering)
            offering.name = name
            offering.tag = tag
            offering.description = description
            offering.price_pkr = price
            offering.billing_period = period
            offering.capacity = capacity
            offering.shift_type = shift
            offering.features_json = json.dumps(features)
            offering.is_popular = popular
            offering.is_active = True
            offering.display_order = order
        for offering in existing_offerings:
            if offering.slug not in wanted_slugs:
                offering.is_active = False
        await db.commit()
        await delete_cache("offerings:list:None:False")

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
        team_specs = [
            ("Tatheer Fatemah", "CEO", "Leading the vision and growth of The Roarworks.", "/team-member-female.png", 1),
            ("Tayyiba Mustafa", "General Manager", "Overseeing daily operations and delivering a seamless member experience.", "/team-member-female.png", 2),
            ("Nabeel Sadique", "Office Administrator", "Supporting the team and keeping office operations organized.", "/team-member-male.png", 3),
            ("Abdul Basit", "IT Executive", "Supporting reliable technology and IT services across the workspace.", "/team-member-male.png", 4),
            ("Rijah Nisar", "Sales Executive", "Helping prospective members find the right workspace solution.", "/team-member-female.png", 5),
            ("Fatima Iftikhar", "Social Media Manager", "Sharing The Roarworks community and updates across social platforms.", "/team-member-female.png", 6),
        ]
        existing_team = (await db.execute(select(TeamMember))).scalars().all()
        members_by_name = {member.name: member for member in existing_team}
        legacy_names = ("Afnan Ul Haq", "Sarah Khan", "Hamza Ali", "Zoya Malik")
        legacy_members = {name: members_by_name.get(name) for name in legacy_names}

        for name, role, bio, photo_url, display_order in team_specs:
            member = members_by_name.get(name)
            if member is None and display_order <= len(legacy_names):
                member = legacy_members.get(legacy_names[display_order - 1])
            if member is None:
                member = TeamMember()
                db.add(member)

            member.name = name
            member.role = role
            member.bio = bio
            member.photo_url = photo_url
            member.email = None
            member.linkedin_url = None
            member.display_order = display_order
            member.is_active = True
            members_by_name[name] = member

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

        # 7. Testimonials
        testimonial_count = (await db.execute(select(Testimonial))).scalars().all()
        if not testimonial_count:
            db.add_all([
                Testimonial(
                    name="Celine Dion",
                    role="Cafe Owner & Founder",
                    avatar="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
                    stars=5,
                    content="The Roarworks gave our administrative team the focus and executive presence we needed in Islamabad. Clean spaces, great coffee, and professional conference rooms.",
                    display_order=1
                ),
                Testimonial(
                    name="Riana Madiva",
                    role="Digital Marketer & Agency Lead",
                    avatar="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
                    stars=5,
                    content="Working night shifts for overseas US clients used to mean constant power and internet anxiety. At Roarworks Blue Area, zero downtime and round-the-clock female-friendly security.",
                    display_order=2
                ),
                Testimonial(
                    name="John Melon",
                    role="Freelancer & Content Creator",
                    avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
                    stars=5,
                    content="The acoustic podcast studio with Shure SM7B mics and 4K cameras is easily the best creator setup in Islamabad. High-speed fiber makes uploading 4K video instantaneous.",
                    display_order=3
                )
            ])
            await db.commit()

        # 8. Sample Bookings
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
