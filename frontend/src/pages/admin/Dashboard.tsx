import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  bookingsApi,
  blogApi,
  offeringsApi,
  teamApi,
  partnersApi,
  testimonialsApi,
  statsApi,
  rebacApi,
  BookingRecord,
  BlogPostRecord,
  OfferingRecord,
  TeamMemberRecord,
  PartnerRecord,
  TestimonialRecord,
  TourBookingPayload
} from '../../services/api';
import { AdminField, AdminRecordModal } from './AdminRecordModal';
import {
  Users,
  FileText,
  DollarSign,
  ShieldCheck,
  Phone,
  MessageSquare,
  Search,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  LogOut,
  RefreshCw,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'bookings' | 'blogs' | 'offerings' | 'team' | 'testimonials' | 'rebac'>('bookings');
  const canManageContent = user?.role === 'super_admin' || user?.role === 'workspace_manager';

  // Stats
  const [stats, setStats] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Bookings state
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [bookingStatusFilter, setBookingStatusFilter] = useState<string>('ALL');
  const [bookingSearch, setBookingSearch] = useState<string>('');

  // Blog state
  const [blogs, setBlogs] = useState<BlogPostRecord[]>([]);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);

  // Offerings state
  const [offerings, setOfferings] = useState<OfferingRecord[]>([]);

  // Team & Partners state
  const [teamMembers, setTeamMembers] = useState<TeamMemberRecord[]>([]);
  const [partners, setPartners] = useState<PartnerRecord[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialRecord[]>([]);
  const [managedEntity, setManagedEntity] = useState<'booking' | 'offering' | 'team' | 'partner' | 'testimonial' | null>(null);
  const [managedRecord, setManagedRecord] = useState<Record<string, unknown> | null>(null);

  // ReBAC State
  const [rebacTuples, setRebacTuples] = useState<any[]>([]);
  const [rebacCheckUser, setRebacCheckUser] = useState(user?.id || '');
  const [rebacCheckAction, setRebacCheckAction] = useState('edit');
  const [rebacCheckType, setRebacCheckType] = useState('blog_post');
  const [rebacCheckId, setRebacCheckId] = useState('1');
  const [rebacCheckResult, setRebacCheckResult] = useState<any>(null);

  // Grant tuple state
  const [grantEntityId, setGrantEntityId] = useState('');
  const [grantRelation, setGrantRelation] = useState('editor');
  const [grantObjectType, setGrantObjectType] = useState('blog_post');
  const [grantObjectId, setGrantObjectId] = useState('');

  const loadData = useCallback(async () => {
    setRefreshing(true);
    try {
      const [sRes, bRes, blRes, offRes, tmRes, pRes, testimonialRes] = await Promise.all([
        statsApi.getDashboard().catch(() => ({ data: null })),
        bookingsApi.list({
          status: bookingStatusFilter === 'ALL' ? undefined : bookingStatusFilter,
          search: bookingSearch || undefined
        }),
        blogApi.list({ all_posts: true }),
        offeringsApi.list({ include_inactive: canManageContent }),
        teamApi.list({ include_inactive: canManageContent }),
        partnersApi.list(),
        testimonialsApi.list({ include_inactive: canManageContent }),
      ]);

      setStats(sRes.data);
      setBookings(bRes.data);
      setBlogs(blRes.data);
      setOfferings(offRes.data);
      setTeamMembers(tmRes.data);
      setPartners(pRes.data);
      setTestimonials(testimonialRes.data);

      if (user?.role === 'super_admin' || user?.role === 'workspace_manager') {
        const tRes = await rebacApi.listTuples();
        setRebacTuples(tRes.data);
      }
    } catch {
      showToast('Error refreshing dashboard data', 'error');
    } finally {
      setRefreshing(false);
    }
  }, [bookingSearch, bookingStatusFilter, canManageContent, showToast, user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const managedFields: AdminField[] = (() => {
    if (managedEntity === 'booking') {
      return [
        { name: 'full_name', label: 'Full name', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
        { name: 'phone', label: 'Phone' },
        { name: 'booking_type', label: 'Booking type', type: 'select', options: ['Personal', 'Team', 'Enterprise', 'Podcast'] },
        { name: 'plan_interest', label: 'Plan interest', required: true },
        { name: 'start_date', label: 'Start date' },
        { name: 'end_date', label: 'End date' },
        { name: 'preferred_time', label: 'Preferred time' },
        ...(managedRecord?.id ? [{ name: 'status', label: 'Status', type: 'select' as const, options: ['NEW', 'CONTACTED', 'TOUR_SCHEDULED', 'COMPLETED', 'CANCELLED'] }] : []),
        { name: 'notes', label: 'Notes', type: 'textarea' },
        { name: 'terms_agreed', label: 'Terms agreed', type: 'checkbox' },
      ];
    }
    if (managedEntity === 'offering') {
      return [
        { name: 'name', label: 'Name', required: true },
        { name: 'slug', label: 'Slug', required: true },
        { name: 'tag', label: 'Tag' },
        { name: 'price_pkr', label: 'Price (PKR)', type: 'number', required: true },
        { name: 'billing_period', label: 'Billing period', required: true },
        { name: 'capacity', label: 'Capacity', required: true },
        { name: 'shift_type', label: 'Shift type', required: true },
        { name: 'display_order', label: 'Display order', type: 'number' },
        { name: 'description', label: 'Description', type: 'textarea', required: true },
        { name: 'features', label: 'Features', type: 'list' },
        { name: 'is_popular', label: 'Popular offering', type: 'checkbox' },
        { name: 'is_active', label: 'Active', type: 'checkbox' },
      ];
    }
    if (managedEntity === 'team') {
      return [
        { name: 'name', label: 'Name', required: true },
        { name: 'role', label: 'Role', required: true },
        { name: 'photo_url', label: 'Photo URL', type: 'url', required: true },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'linkedin_url', label: 'LinkedIn URL', type: 'url' },
        { name: 'twitter_url', label: 'Twitter URL', type: 'url' },
        { name: 'display_order', label: 'Display order', type: 'number' },
        { name: 'bio', label: 'Bio', type: 'textarea', required: true },
        { name: 'is_active', label: 'Active', type: 'checkbox' },
      ];
    }
    if (managedEntity === 'partner') {
      return [
        { name: 'name', label: 'Name', required: true },
        { name: 'category', label: 'Category', required: true },
        { name: 'logo_url', label: 'Logo URL', type: 'url', required: true },
        { name: 'website_url', label: 'Website URL', type: 'url' },
        { name: 'display_order', label: 'Display order', type: 'number' },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'is_featured', label: 'Featured partner', type: 'checkbox' },
      ];
    }
    if (managedEntity === 'testimonial') {
      return [
        { name: 'name', label: 'Name', required: true },
        { name: 'role', label: 'Role', required: true },
        { name: 'avatar', label: 'Avatar URL', type: 'url', required: true },
        { name: 'stars', label: 'Star rating (1–5)', type: 'number', required: true },
        { name: 'display_order', label: 'Display order', type: 'number' },
        { name: 'content', label: 'Testimonial', type: 'textarea', required: true },
        { name: 'is_active', label: 'Active', type: 'checkbox' },
      ];
    }
    return [];
  })();

  const startManaging = (entity: NonNullable<typeof managedEntity>, record?: Record<string, unknown>) => {
    const defaults: Record<NonNullable<typeof managedEntity>, Record<string, unknown>> = {
      booking: { full_name: '', email: '', phone: '', booking_type: 'Personal', plan_interest: '', start_date: '', end_date: '', preferred_time: 'Morning Shift', notes: '', terms_agreed: true },
      offering: { name: '', slug: '', tag: '', description: '', price_pkr: 0, billing_period: '/month', capacity: '1 Person', shift_type: 'Flexible', features: [], is_popular: false, is_active: true, display_order: offerings.length + 1 },
      team: { name: '', role: '', bio: '', photo_url: '', email: '', linkedin_url: '', twitter_url: '', display_order: teamMembers.length + 1, is_active: true },
      partner: { name: '', logo_url: '', website_url: '', category: 'Tech Startup', description: '', is_featured: true, display_order: partners.length + 1 },
      testimonial: { name: '', role: '', avatar: '', stars: 5, content: '', display_order: testimonials.length + 1, is_active: true },
    };
    setManagedEntity(entity);
    setManagedRecord(record ? { ...defaults[entity], ...record } : defaults[entity]);
  };

  const closeManagedEditor = () => {
    setManagedEntity(null);
    setManagedRecord(null);
  };

  const bookingStatuses: BookingRecord['status'][] = ['NEW', 'CONTACTED', 'TOUR_SCHEDULED', 'COMPLETED', 'CANCELLED'];
  const getBookingStatus = (value: string): BookingRecord['status'] =>
    bookingStatuses.find((status) => status === value) ?? 'NEW';

  const handleSaveManagedRecord = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!managedEntity || !managedRecord) return;

    const text = (field: string) => typeof managedRecord[field] === 'string' ? managedRecord[field] as string : '';
    const number = (field: string) => {
      const value = Number(managedRecord[field]);
      return Number.isFinite(value) ? value : 0;
    };
    const checked = (field: string) => managedRecord[field] === true;
    const list = (field: string) => Array.isArray(managedRecord[field]) ? (managedRecord[field] as string[]) : [];
    const id = typeof managedRecord.id === 'string' ? managedRecord.id : undefined;

    try {
      if (managedEntity === 'booking') {
        const payload: TourBookingPayload = {
          full_name: text('full_name'),
          email: text('email'),
          phone: text('phone') || undefined,
          booking_type: text('booking_type'),
          plan_interest: text('plan_interest'),
          start_date: text('start_date') || undefined,
          end_date: text('end_date') || undefined,
          preferred_time: text('preferred_time') || undefined,
          notes: text('notes') || undefined,
          terms_agreed: checked('terms_agreed'),
        };
        if (id) {
          await bookingsApi.update(id, {
            ...payload,
            phone: text('phone') || null,
            start_date: text('start_date') || null,
            end_date: text('end_date') || null,
            preferred_time: text('preferred_time') || null,
            notes: text('notes') || null,
            status: getBookingStatus(text('status')),
          });
        }
        else await bookingsApi.create(payload);
      } else if (managedEntity === 'offering') {
        const payload = {
          name: text('name'), slug: text('slug'), tag: text('tag') || undefined, description: text('description'),
          price_pkr: number('price_pkr'), billing_period: text('billing_period'), capacity: text('capacity'),
          shift_type: text('shift_type'), features: list('features'), is_popular: checked('is_popular'),
          is_active: checked('is_active'), display_order: number('display_order'),
        };
        if (id) await offeringsApi.update(id, { ...payload, tag: text('tag') || null });
        else await offeringsApi.create(payload);
      } else if (managedEntity === 'team') {
        const payload = {
          name: text('name'), role: text('role'), bio: text('bio'), photo_url: text('photo_url'),
          email: text('email') || undefined, linkedin_url: text('linkedin_url') || undefined,
          twitter_url: text('twitter_url') || undefined, display_order: number('display_order'), is_active: checked('is_active'),
        };
        if (id) {
          await teamApi.update(id, {
            ...payload,
            email: text('email') || null,
            linkedin_url: text('linkedin_url') || null,
            twitter_url: text('twitter_url') || null,
          });
        }
        else await teamApi.create(payload);
      } else if (managedEntity === 'partner') {
        const payload = {
          name: text('name'), logo_url: text('logo_url'), website_url: text('website_url') || undefined,
          category: text('category'), description: text('description') || undefined,
          is_featured: checked('is_featured'), display_order: number('display_order'),
        };
        if (id) {
          await partnersApi.update(id, {
            ...payload,
            website_url: text('website_url') || null,
            description: text('description') || null,
          });
        }
        else await partnersApi.create(payload);
      } else {
        const payload = {
          name: text('name'), role: text('role'), avatar: text('avatar'), stars: number('stars'),
          content: text('content'), display_order: number('display_order'), is_active: checked('is_active'),
        };
        if (id) await testimonialsApi.update(id, payload);
        else await testimonialsApi.create(payload);
      }

      showToast(`${managedEntity === 'booking' ? 'Booking' : managedEntity[0].toUpperCase() + managedEntity.slice(1)} saved successfully`, 'success');
      closeManagedEditor();
      await loadData();
    } catch (error: any) {
      showToast(error.response?.data?.detail || 'Could not save this record', 'error');
    }
  };

  const handleDeleteManagedRecord = async (entity: 'booking' | 'blog' | 'offering' | 'team' | 'partner' | 'testimonial', id: string) => {
    if (!confirm(`Are you sure you want to delete this ${entity === 'blog' ? 'article' : entity}?`)) return;
    try {
      if (entity === 'booking') await bookingsApi.delete(id);
      else if (entity === 'blog') await blogApi.delete(id);
      else if (entity === 'offering') await offeringsApi.delete(id);
      else if (entity === 'team') await teamApi.delete(id);
      else if (entity === 'partner') await partnersApi.delete(id);
      else await testimonialsApi.delete(id);
      showToast('Record deleted', 'success');
      await loadData();
    } catch (error: any) {
      showToast(error.response?.data?.detail || 'Could not delete record', 'error');
    }
  };

  const handleUpdateBookingStatus = async (id: string, newStatus: BookingRecord['status']) => {
    try {
      await bookingsApi.update(id, { status: newStatus });
      showToast(`Booking updated to ${newStatus}`, 'success');
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus as any } : b))
      );
    } catch (err: any) {
      showToast(err.response?.data?.detail || 'Could not update status', 'error');
    }
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPost.id) {
        await blogApi.update(editingPost.id, editingPost);
        showToast('Blog post updated successfully!', 'success');
      } else {
        await blogApi.create(editingPost);
        showToast('Blog post created and published!', 'success');
      }
      setIsBlogModalOpen(false);
      setEditingPost(null);
      loadData();
    } catch (err: any) {
      showToast(err.response?.data?.detail || 'Could not save post', 'error');
    }
  };

  const handleCheckRebac = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await rebacApi.check({
        user_id: rebacCheckUser || user?.id || '',
        action: rebacCheckAction,
        resource_type: rebacCheckType,
        resource_id: rebacCheckId
      });
      setRebacCheckResult(res.data);
    } catch {
      showToast('ReBAC check failed', 'error');
    }
  };

  const handleGrantTuple = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await rebacApi.grant({
        entity_type: 'user',
        entity_id: grantEntityId,
        relation: grantRelation,
        object_type: grantObjectType,
        object_id: grantObjectId
      });
      showToast('ReBAC relationship tuple granted!', 'success');
      setGrantEntityId('');
      setGrantObjectId('');
      loadData();
    } catch {
      showToast('Could not grant tuple', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#070A11] text-gray-200">
      
      {/* Top Navbar */}
      <header className="bg-[#0B0F19] border-b border-white/10 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" aria-label="Home" className="flex items-center gap-3">
              <img
                src="/images-removebg-preview.png"
                alt="The Roarworks"
                width="738"
                height="270"
                className="w-32 sm:w-36 h-auto max-h-12 object-contain"
              />
              <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-gray-300 font-normal">
                Operations Console
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={loadData}
              disabled={refreshing}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-[#00B87C]' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-[#00B87C]" />
              <span className="text-white font-semibold">{user?.full_name}</span>
              <span className="text-[10px] uppercase font-bold text-[#00B87C] px-1.5 py-0.5 rounded bg-[#00B87C]/20">
                {user?.role}
              </span>
            </div>

            <button
              onClick={() => {
                logout();
                navigate('/admin/login');
              }}
              className="flex items-center gap-1.5 p-2 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-200 transition-colors border border-red-800/40"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* KPI Analytics Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-[#0F1522] p-4 rounded-xl border border-white/10 shadow-sm">
              <span className="text-[11px] text-gray-400 uppercase font-semibold block mb-1">Total Leads</span>
              <div className="text-2xl font-extrabold text-white">{stats.total_bookings}</div>
              <span className="text-[10px] text-[#00B87C]">All Tour Bookings</span>
            </div>

            <div className="bg-[#0F1522] p-4 rounded-xl border border-white/10 shadow-sm">
              <span className="text-[11px] text-gray-400 uppercase font-semibold block mb-1">New Leads</span>
              <div className="text-2xl font-extrabold text-amber-400">{stats.new_bookings}</div>
              <span className="text-[10px] text-gray-400">Needs Followup</span>
            </div>

            <div className="bg-[#0F1522] p-4 rounded-xl border border-white/10 shadow-sm">
              <span className="text-[11px] text-gray-400 uppercase font-semibold block mb-1">Scheduled</span>
              <div className="text-2xl font-extrabold text-[#00B87C]">{stats.scheduled_tours}</div>
              <span className="text-[10px] text-gray-400">Tours Booked</span>
            </div>

            <div className="bg-[#0F1522] p-4 rounded-xl border border-white/10 shadow-sm">
              <span className="text-[11px] text-gray-400 uppercase font-semibold block mb-1">Conversion Rate</span>
              <div className="text-2xl font-extrabold text-white">{stats.conversion_rate_percentage}%</div>
              <span className="text-[10px] text-emerald-400">Tours Completed</span>
            </div>

            <div className="bg-[#0F1522] p-4 rounded-xl border border-white/10 shadow-sm">
              <span className="text-[11px] text-gray-400 uppercase font-semibold block mb-1">Blog Articles</span>
              <div className="text-2xl font-extrabold text-white">{stats.total_blogs}</div>
              <span className="text-[10px] text-gray-400">Published Posts</span>
            </div>

            <div className="bg-[#0F1522] p-4 rounded-xl border border-white/10 shadow-sm">
              <span className="text-[11px] text-gray-400 uppercase font-semibold block mb-1">Redis Cache</span>
              <div className="text-sm font-bold text-white capitalize flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-[#00B87C]" />
                <span>{stats.redis_status?.mode}</span>
              </div>
              <span className="text-[10px] text-gray-400">{stats.redis_status?.status}</span>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4 mb-8">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'bookings'
                ? 'bg-[#00B87C] text-white shadow-md'
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Tour Bookings ({bookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('blogs')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'blogs'
                ? 'bg-[#00B87C] text-white shadow-md'
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Blog CMS ({blogs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('offerings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'offerings'
                ? 'bg-[#00B87C] text-white shadow-md'
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Offerings ({offerings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('team')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'team'
                ? 'bg-[#00B87C] text-white shadow-md'
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Team & Partners</span>
          </button>

          <button
            onClick={() => setActiveTab('testimonials')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'testimonials'
                ? 'bg-[#00B87C] text-white shadow-md'
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Testimonials ({testimonials.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('rebac')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'rebac'
                ? 'bg-[#00B87C] text-white shadow-md'
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>ReBAC Authorization & Tuples</span>
          </button>
        </div>

        {/* TAB 1: BOOKINGS & LEADS */}
        {activeTab === 'bookings' && (
          <div className="bg-[#0F1522] rounded-2xl border border-white/10 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-bold text-white">Tour Bookings & Enquiries</h3>
                <p className="text-xs text-gray-400">Manage tour requests, contact details, and follow-up status.</p>
              </div>
              <button
                onClick={() => startManaging('booking')}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#00B87C] hover:bg-[#009F6B] text-white text-xs font-bold rounded-lg"
              >
                <Plus className="w-4 h-4" /> New Booking
              </button>
            </div>
            {/* Filter controls */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
                {['ALL', 'NEW', 'CONTACTED', 'TOUR_SCHEDULED', 'COMPLETED', 'CANCELLED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setBookingStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      bookingStatusFilter === st
                        ? 'bg-[#00B87C] text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>

              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Search by name, email, plan..."
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#00B87C]"
                />
                <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Bookings Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 text-gray-400 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3.5 rounded-l-lg">Applicant Details</th>
                    <th className="p-3.5">Plan Interest</th>
                    <th className="p-3.5">Shift & Dates</th>
                    <th className="p-3.5">Status Workflow</th>
                    <th className="p-3.5">Quick Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {bookings.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-500">
                        No tour bookings found for the selected filter.
                      </td>
                    </tr>
                  ) : (
                    bookings.map((b) => {
                      const cleanPhone = (b.phone || '').replace(/[^0-9]/g, '');
                      const waLink = `https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(b.full_name)}!%20This%20is%20The%20Roarworks%20Community%20Team%20in%20Blue%20Area,%20Islamabad%20regarding%20your%20${encodeURIComponent(b.plan_interest)}%20tour%20request.`;

                      return (
                        <tr key={b.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="p-3.5">
                            <div className="font-bold text-white text-sm">{b.full_name}</div>
                            <div className="text-gray-400">{b.email}</div>
                            {b.phone && (
                              <div className="text-gray-400 flex items-center gap-1 mt-0.5">
                                <Phone className="w-3 h-3 text-[#00B87C]" />
                                {b.phone}
                              </div>
                            )}
                          </td>
                          <td className="p-3.5">
                            <span className="font-semibold text-white px-2 py-0.5 rounded bg-white/5 border border-white/10">
                              {b.plan_interest}
                            </span>
                            <div className="text-[11px] text-gray-400 mt-1">Type: {b.booking_type}</div>
                          </td>
                          <td className="p-3.5">
                            <div className="text-gray-300 font-medium">Start: {b.start_date || 'ASAP'}</div>
                            <div className="text-[11px] text-gray-400">{b.preferred_time || 'Day Shift'}</div>
                          </td>
                          <td className="p-3.5">
                            <select
                              value={b.status}
                              onChange={(e) => handleUpdateBookingStatus(b.id, getBookingStatus(e.target.value))}
                              className={`px-2.5 py-1 rounded text-xs font-bold border focus:outline-none cursor-pointer ${
                                b.status === 'NEW'
                                  ? 'bg-amber-950/60 text-amber-300 border-amber-800/50'
                                  : b.status === 'TOUR_SCHEDULED'
                                  ? 'bg-blue-950/60 text-blue-300 border-blue-800/50'
                                  : b.status === 'COMPLETED'
                                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/50'
                                  : b.status === 'CONTACTED'
                                  ? 'bg-purple-950/60 text-purple-300 border-purple-800/50'
                                  : 'bg-gray-800 text-gray-400 border-gray-700'
                              }`}
                            >
                              <option value="NEW">NEW</option>
                              <option value="CONTACTED">CONTACTED</option>
                              <option value="TOUR_SCHEDULED">TOUR SCHEDULED</option>
                              <option value="COMPLETED">COMPLETED</option>
                              <option value="CANCELLED">CANCELLED</option>
                            </select>
                            {b.notes && (
                              <div className="text-[10px] text-gray-400 italic mt-1 max-w-xs truncate">
                                "{b.notes}"
                              </div>
                            )}
                          </td>
                          <td className="p-3.5">
                            <div className="flex items-center gap-2">
                              {b.phone && (
                                <a
                                  href={waLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-2.5 py-1.5 rounded bg-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/30 font-semibold flex items-center gap-1 transition-colors"
                                >
                                  <MessageSquare className="w-3.5 h-3.5" />
                                  <span>WhatsApp</span>
                                </a>
                              )}
                              <a
                                href={`mailto:${b.email}?subject=The%20Roarworks%20Workspace%20Tour`}
                                className="px-2.5 py-1.5 rounded bg-white/5 hover:bg-white/10 text-gray-300 transition-colors"
                              >
                                Email
                              </a>
                              <button
                                type="button"
                                onClick={() => startManaging('booking', { ...b })}
                                aria-label={`Edit booking for ${b.full_name}`}
                                className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-gray-300"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              {canManageContent && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteManagedRecord('booking', b.id)}
                                  aria-label={`Delete booking for ${b.full_name}`}
                                  className="p-1.5 rounded hover:bg-red-900/60 text-red-400"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: BLOG CMS */}
        {activeTab === 'blogs' && (
          <div className="bg-[#0F1522] rounded-2xl border border-white/10 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-white">Editorial & Article CMS</h3>
                <p className="text-xs text-gray-400">Publish, modify, and manage content on The Roarworks blog</p>
              </div>
              <button
                onClick={() => {
                  setEditingPost({
                    title: '',
                    slug: '',
                    excerpt: '',
                    content: '',
                    cover_image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c',
                    category: 'INTERIOR',
                    read_time: '5 mins read',
                    published: true
                  });
                  setIsBlogModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#00B87C] hover:bg-[#009F6B] text-white text-xs font-bold rounded-lg shadow-md transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Write New Article</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((b) => (
                <div key={b.id} className="bg-white/5 rounded-xl border border-white/10 overflow-hidden flex flex-col justify-between p-4">
                  <div>
                    <img src={b.cover_image} alt={b.title} className="w-full h-36 object-cover rounded-lg mb-3" />
                    <span className="text-[10px] font-bold text-[#00B87C] uppercase">{b.category}</span>
                    <h4 className="font-bold text-white text-sm line-clamp-2 mt-1 mb-2">{b.title}</h4>
                    <p className="text-xs text-gray-400 line-clamp-2">{b.excerpt}</p>
                  </div>
                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/10 text-xs">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${b.published ? 'bg-emerald-950 text-emerald-400' : 'bg-gray-800 text-gray-400'}`}>
                      {b.published ? 'PUBLISHED' : 'DRAFT'}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingPost(b);
                          setIsBlogModalOpen(true);
                        }}
                        className="p-1.5 rounded hover:bg-white/10 text-gray-300"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      {canManageContent && (
                        <button
                          onClick={() => handleDeleteManagedRecord('blog', b.id)}
                          aria-label={`Delete ${b.title}`}
                          className="p-1.5 rounded hover:bg-red-900/60 text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: OFFERINGS & RATES */}
        {activeTab === 'offerings' && (
          <div className="bg-[#0F1522] rounded-2xl border border-white/10 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Workspace Plans & Rate Cards</h3>
                <p className="text-xs text-gray-400">Create and maintain plans displayed on the offerings page.</p>
              </div>
              {canManageContent && (
                <button onClick={() => startManaging('offering')} className="flex items-center gap-1.5 px-4 py-2 bg-[#00B87C] hover:bg-[#009F6B] text-white text-xs font-bold rounded-lg">
                  <Plus className="w-4 h-4" /> Add Offering
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offerings.map((off) => (
                <div key={off.id} className="p-5 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-white text-base">{off.name}</h4>
                      <span className={`text-xs font-semibold ${off.is_active ? 'text-[#00B87C]' : 'text-gray-500'}`}>{off.is_active ? off.shift_type : 'Inactive'}</span>
                    </div>
                    <div className="text-2xl font-extrabold text-white mb-2">
                      PKR {off.price_pkr.toLocaleString()}
                      <span className="text-xs text-gray-400 font-normal"> {off.billing_period}</span>
                    </div>
                    <p className="text-xs text-gray-400 mb-4">{off.description}</p>
                    <ul className="space-y-1.5 text-xs text-gray-300">
                      {off.features.slice(0, 3).map((f, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-[#00B87C]" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/10 text-xs text-gray-400">
                    Capacity: <strong className="text-white">{off.capacity}</strong>
                    {canManageContent && (
                      <div className="flex justify-end gap-2 mt-3">
                        <button onClick={() => startManaging('offering', { ...off })} className="p-1.5 rounded hover:bg-white/10 text-gray-300" aria-label={`Edit ${off.name}`}>
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDeleteManagedRecord('offering', off.id)} className="p-1.5 rounded hover:bg-red-900/60 text-red-400" aria-label={`Delete ${off.name}`}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: TEAM & PARTNERS */}
        {activeTab === 'team' && (
          <div className="space-y-8">
            <div className="bg-[#0F1522] rounded-2xl border border-white/10 p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Team Directory</h3>
                {canManageContent && (
                  <button onClick={() => startManaging('team')} className="flex items-center gap-1.5 px-3 py-2 bg-[#00B87C] hover:bg-[#009F6B] text-white text-xs font-bold rounded-lg">
                    <Plus className="w-4 h-4" /> Add Team Member
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {teamMembers.map((m) => (
                  <div key={m.id} className={`bg-white/5 rounded-xl p-4 border border-white/10 text-center ${m.is_active === false ? 'opacity-60' : ''}`}>
                    <img src={m.photo_url} alt={m.name} className="w-16 h-16 rounded-full object-cover mx-auto mb-2 border-2 border-[#00B87C]" />
                    <h5 className="font-bold text-white text-sm">{m.name}</h5>
                    <span className="text-[11px] text-[#00B87C] block mb-1">{m.role}</span>
                    <p className="text-[10px] text-gray-400 line-clamp-2">{m.bio}</p>
                    {canManageContent && (
                      <div className="flex justify-center gap-2 mt-3">
                        <button onClick={() => startManaging('team', { ...m })} className="p-1.5 rounded hover:bg-white/10 text-gray-300" aria-label={`Edit ${m.name}`}>
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDeleteManagedRecord('team', m.id)} className="p-1.5 rounded hover:bg-red-900/60 text-red-400" aria-label={`Delete ${m.name}`}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#0F1522] rounded-2xl border border-white/10 p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Partner Brands</h3>
                {canManageContent && (
                  <button onClick={() => startManaging('partner')} className="flex items-center gap-1.5 px-3 py-2 bg-[#00B87C] hover:bg-[#009F6B] text-white text-xs font-bold rounded-lg">
                    <Plus className="w-4 h-4" /> Add Partner
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {partners.map((p) => (
                  <div key={p.id} className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                    <h5 className="font-bold text-white text-sm">{p.name}</h5>
                    <span className="text-[11px] text-gray-400">{p.category}</span>
                    {canManageContent && (
                      <div className="flex justify-center gap-2 mt-3">
                        <button onClick={() => startManaging('partner', { ...p })} className="p-1.5 rounded hover:bg-white/10 text-gray-300" aria-label={`Edit ${p.name}`}>
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDeleteManagedRecord('partner', p.id)} className="p-1.5 rounded hover:bg-red-900/60 text-red-400" aria-label={`Delete ${p.name}`}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'testimonials' && (
          <div className="bg-[#0F1522] rounded-2xl border border-white/10 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-white">Customer Testimonials</h3>
                <p className="text-xs text-gray-400">Manage the reviews shown on the public homepage.</p>
              </div>
              {canManageContent && (
                <button onClick={() => startManaging('testimonial')} className="flex items-center gap-1.5 px-4 py-2 bg-[#00B87C] hover:bg-[#009F6B] text-white text-xs font-bold rounded-lg">
                  <Plus className="w-4 h-4" /> Add Testimonial
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {testimonials.map((item) => (
                <div key={item.id} className={`bg-white/5 rounded-xl p-5 border border-white/10 ${item.is_active ? '' : 'opacity-60'}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <img src={item.avatar} alt="" className="w-11 h-11 rounded-full object-cover" />
                    <div className="min-w-0">
                      <h4 className="font-bold text-white text-sm truncate">{item.name}</h4>
                      <p className="text-[11px] text-gray-400 truncate">{item.role}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-300 line-clamp-4">{item.content}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-amber-400 text-xs">{'★'.repeat(item.stars)}{'☆'.repeat(5 - item.stars)}</span>
                    {canManageContent && (
                      <div className="flex gap-2">
                        <button onClick={() => startManaging('testimonial', { ...item })} className="p-1.5 rounded hover:bg-white/10 text-gray-300" aria-label={`Edit testimonial by ${item.name}`}>
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDeleteManagedRecord('testimonial', item.id)} className="p-1.5 rounded hover:bg-red-900/60 text-red-400" aria-label={`Delete testimonial by ${item.name}`}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {testimonials.length === 0 && <p className="text-sm text-gray-500">No testimonials found.</p>}
            </div>
          </div>
        )}

        {/* TAB 5: ReBAC AUTHORIZATION & TUPLES */}
        {activeTab === 'rebac' && (
          <div className="space-y-8">
            {/* Interactive ReBAC Permission Tester */}
            <div className="bg-[#0F1522] rounded-2xl border border-white/10 p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="w-5 h-5 text-[#00B87C]" />
                <h3 className="text-lg font-bold text-white">ReBAC Relationship Permission Checker</h3>
              </div>
              <p className="text-xs text-gray-400 mb-6">
                Test if a given user relationship satisfies resource-level authorization according to the ReBAC policy.
              </p>

              <form onSubmit={handleCheckRebac} className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">User ID</label>
                  <input
                    type="text"
                    required
                    value={rebacCheckUser}
                    onChange={(e) => setRebacCheckUser(e.target.value)}
                    placeholder="User UUID"
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">Action</label>
                  <select
                    value={rebacCheckAction}
                    onChange={(e) => setRebacCheckAction(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white"
                  >
                    <option value="view">view</option>
                    <option value="edit">edit</option>
                    <option value="delete">delete</option>
                    <option value="publish">publish</option>
                    <option value="manage">manage</option>
                    <option value="update_status">update_status</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">Resource Type</label>
                  <select
                    value={rebacCheckType}
                    onChange={(e) => setRebacCheckType(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white"
                  >
                    <option value="blog_post">blog_post</option>
                    <option value="tour_booking">tour_booking</option>
                    <option value="organization">organization</option>
                    <option value="offering">offering</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">Resource ID</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={rebacCheckId}
                      onChange={(e) => setRebacCheckId(e.target.value)}
                      placeholder="Resource ID or *"
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#00B87C] hover:bg-[#009F6B] text-white text-xs font-bold rounded-lg shrink-0"
                    >
                      Check
                    </button>
                  </div>
                </div>
              </form>

              {rebacCheckResult && (
                <div className={`p-4 rounded-xl border text-xs ${
                  rebacCheckResult.allowed
                    ? 'bg-emerald-950/40 border-[#00B87C] text-emerald-200'
                    : 'bg-red-950/40 border-red-500 text-red-200'
                }`}>
                  <div className="font-bold mb-1">
                    Authorization Result: {rebacCheckResult.allowed ? 'ALLOWED ✓' : 'DENIED ✕'}
                  </div>
                  <div>Reason: {rebacCheckResult.reason}</div>
                  <div className="text-[10px] text-gray-400 mt-1">
                    Resource: {rebacCheckResult.resource} · Action: {rebacCheckResult.action}
                  </div>
                </div>
              )}
            </div>

            {/* Grant ReBAC Relationship Tuple Form */}
            <div className="bg-[#0F1522] rounded-2xl border border-white/10 p-6 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-2">Grant Relationship Tuple</h3>
              <p className="text-xs text-gray-400 mb-4">Assign granular relationships (e.g., assignee on booking, editor on blog)</p>

              <form onSubmit={handleGrantTuple} className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Entity ID (User ID)"
                  value={grantEntityId}
                  onChange={(e) => setGrantEntityId(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white"
                />
                <select
                  value={grantRelation}
                  onChange={(e) => setGrantRelation(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white"
                >
                  <option value="admin">admin</option>
                  <option value="manager">manager</option>
                  <option value="editor">editor</option>
                  <option value="assignee">assignee</option>
                  <option value="viewer">viewer</option>
                </select>
                <select
                  value={grantObjectType}
                  onChange={(e) => setGrantObjectType(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white"
                >
                  <option value="tour_booking">tour_booking</option>
                  <option value="blog_post">blog_post</option>
                  <option value="organization">organization</option>
                </select>
                <input
                  type="text"
                  required
                  placeholder="Object ID (or *)"
                  value={grantObjectId}
                  onChange={(e) => setGrantObjectId(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white"
                />
                <button
                  type="submit"
                  className="py-2 bg-[#00B87C] hover:bg-[#009F6B] text-white text-xs font-bold rounded-lg"
                >
                  Grant Tuple
                </button>
              </form>
            </div>

            {/* Active ReBAC Tuples List */}
            <div className="bg-[#0F1522] rounded-2xl border border-white/10 p-6 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-4">Active ReBAC Tuples in Database</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/5 text-gray-400 uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Entity</th>
                      <th className="p-3">Relation</th>
                      <th className="p-3">Object Type</th>
                      <th className="p-3">Object ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {rebacTuples.map((t) => (
                      <tr key={t.id}>
                        <td className="p-3 text-white font-mono">{t.entity_type}:{t.entity_id}</td>
                        <td className="p-3 text-[#00B87C] font-bold">{t.relation}</td>
                        <td className="p-3 text-gray-300">{t.object_type}</td>
                        <td className="p-3 text-gray-400 font-mono">{t.object_id}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>

      {managedEntity && managedRecord && (
        <AdminRecordModal
          title={`${managedRecord.id ? 'Edit' : 'Create'} ${managedEntity === 'booking' ? 'Tour Booking' : managedEntity}`}
          fields={managedFields}
          values={managedRecord}
          onChange={(field, value) => setManagedRecord((previous) => previous ? { ...previous, [field]: value } : previous)}
          onSubmit={handleSaveManagedRecord}
          onClose={closeManagedEditor}
          submitLabel={managedRecord.id ? 'Save Changes' : 'Create Record'}
        />
      )}

      {/* Blog Editor Modal */}
      {isBlogModalOpen && editingPost && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F1522] rounded-2xl border border-white/15 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">
              {editingPost.id ? 'Edit Article' : 'Create New Article'}
            </h3>
            <form onSubmit={handleSaveBlog} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editingPost.title}
                  onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Slug</label>
                  <input
                    type="text"
                    required
                    value={editingPost.slug}
                    onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Category</label>
                  <select
                    value={editingPost.category}
                    onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs"
                  >
                    <option value="INTERIOR">INTERIOR</option>
                    <option value="FREELANCE">FREELANCE</option>
                    <option value="TIPS_TRICK">TIPS_TRICK</option>
                    <option value="STARTUP">STARTUP</option>
                    <option value="COMMUNITY">COMMUNITY</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Cover Image URL</label>
                <input
                  type="url"
                  required
                  value={editingPost.cover_image}
                  onChange={(e) => setEditingPost({ ...editingPost, cover_image: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Short Excerpt</label>
                <textarea
                  rows={2}
                  required
                  value={editingPost.excerpt}
                  onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Full Article Content (Markdown)</label>
                <textarea
                  rows={8}
                  required
                  value={editingPost.content}
                  onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs font-mono"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingPost.published}
                    onChange={(e) => setEditingPost({ ...editingPost, published: e.target.checked })}
                    className="accent-[#00B87C] w-4 h-4"
                  />
                  <span>Published immediately</span>
                </label>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsBlogModalOpen(false);
                      setEditingPost(null);
                    }}
                    className="px-4 py-2 rounded-lg text-xs font-semibold text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-[#00B87C] hover:bg-[#009F6B] text-white text-xs font-bold"
                  >
                    Save Article
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
