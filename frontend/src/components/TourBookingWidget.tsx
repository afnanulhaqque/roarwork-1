import React, { useState } from 'react';
import { bookingsApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import {
  ArrowRight,
  Check,
  Clock3,
  ExternalLink,
  MapPin,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';

const getLocalDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const availableTourTimes = Array.from({ length: 11 }, (_, index) => {
  const hour = index + 9;
  const period = hour < 12 ? 'AM' : 'PM';
  const displayHour = hour % 12 || 12;
  return {
    value: `${String(hour).padStart(2, '0')}:00`,
    label: `${displayHour}:00 ${period}`,
  };
});

type TourFormField = 'fullName' | 'email' | 'startDate' | 'endDate' | 'preferredTime' | 'terms';
type TourFormErrors = Partial<Record<TourFormField, string>>;

export const TourBookingWidget: React.FC = () => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [bookingType, setBookingType] = useState('Personal');
  const [planInterest, setPlanInterest] = useState('Hot Desk');
  const [startDate, setStartDate] = useState(getLocalDate);
  const [endDate, setEndDate] = useState(getLocalDate);
  const [preferredTime, setPreferredTime] = useState('');
  const [formErrors, setFormErrors] = useState<TourFormErrors>({});
  const [agreed, setAgreed] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [whatsappLink, setWhatsappLink] = useState<string | null>(null);

  const clearError = (field: TourFormField) => {
    setFormErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const today = getLocalDate();
    const errors: TourFormErrors = {};

    if (fullName.trim().length < 2) {
      errors.fullName = 'Please enter your full name.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }
    if (!startDate) {
      errors.startDate = 'Please select a start date.';
    } else if (startDate < today) {
      errors.startDate = 'Please choose today or a future date.';
    }
    if (!endDate) {
      errors.endDate = 'Please select an end date.';
    } else if (endDate < today) {
      errors.endDate = 'Please choose today or a future date.';
    } else if (startDate && endDate < startDate) {
      errors.endDate = 'End date must be on or after the start date.';
    }
    if (!preferredTime) {
      errors.preferredTime = 'Please select an available tour time.';
    }
    if (!agreed) {
      errors.terms = 'Please accept the terms to request a tour.';
    }

    setFormErrors(errors);
    const firstError = Object.values(errors)[0];
    if (firstError) {
      showToast(firstError, 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await bookingsApi.create({
        email,
        full_name: fullName || email.split('@')[0],
        phone,
        booking_type: bookingType,
        plan_interest: planInterest,
        start_date: startDate,
        end_date: endDate,
        preferred_time: availableTourTimes.find((time) => time.value === preferredTime)?.label,
        terms_agreed: agreed,
      });

      showToast('Tour booking submitted! Our Blue Area community team will contact you.', 'success');
      if (res.data.whatsapp_link) {
        setWhatsappLink(res.data.whatsapp_link);
      }
      // Reset some inputs
      setEmail('');
      setPhone('');
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Failed to submit tour request. Please try again.';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="book-tour" className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
          <div className="pt-2 text-gray-900 lg:sticky lg:top-28">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#008b60]">
              Visit The Roarworks
            </p>
            <h2 className="mb-5 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              A workspace worth seeing in person.
            </h2>
            <p className="max-w-md text-sm leading-7 text-gray-500 sm:text-base">
              Tell us a little about what you need. We’ll arrange a personal tour of our Blue Area workspace.
            </p>
            <div className="mt-8 space-y-4 border-t border-gray-100 pt-6 text-sm text-gray-600">
              <p className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-[#008b60]" />
                Blue Area, Islamabad
              </p>
              <p className="flex items-center gap-3">
                <Clock3 className="h-4 w-4 text-[#008b60]" />
                Tours available 9:00 AM – 7:00 PM
              </p>
            </div>
          </div>

          <div className="w-full rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_12px_40px_-28px_rgba(15,23,42,0.3)] sm:p-8 lg:p-9">
            <div className="mb-7 border-b border-gray-100 pb-5">
              <h3 className="text-xl font-semibold tracking-tight text-gray-950 sm:text-2xl">
                Book a workspace tour
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                Complete the form and our team will confirm your visit.
              </p>
            </div>

            {whatsappLink ? (
              <div className="space-y-4 py-6 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e9f8f2] text-[#00A875]">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-gray-900">Your visit request is in!</h4>
                <p className="text-sm leading-6 text-gray-600">
                  Our community team has been notified. Click below to connect with us immediately on WhatsApp.
                </p>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#00A875] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#00B87C]/20 transition-colors hover:bg-[#008b60]"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat with Us on WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => setWhatsappLink(null)}
                  className="mt-2 text-sm text-gray-500 underline underline-offset-4 hover:text-gray-900"
                >
                  Book another visit
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="tour-name" className="mb-2 block text-sm font-medium text-gray-700">
                      Full name <span className="text-[#00A875]">*</span>
                    </label>
                    <input
                      id="tour-name"
                      type="text"
                      autoComplete="name"
                      required
                      placeholder="e.g. Ayesha Khan"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        clearError('fullName');
                      }}
                      aria-invalid={!!formErrors.fullName}
                      aria-describedby={formErrors.fullName ? 'tour-name-error' : undefined}
                      className={`h-11 w-full rounded-lg border bg-white px-3.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:ring-2 focus:ring-[#00A875]/10 ${formErrors.fullName ? 'border-red-500' : 'border-gray-200 focus:border-[#00A875]'}`}
                    />
                    {formErrors.fullName && <p id="tour-name-error" role="alert" className="mt-1.5 text-xs text-red-600">{formErrors.fullName}</p>}
                  </div>
                  <div>
                    <label htmlFor="tour-phone" className="mb-2 block text-sm font-medium text-gray-700">
                      WhatsApp number
                    </label>
                    <input
                      id="tour-phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="+92 300 1234567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-[#00A875] focus:ring-2 focus:ring-[#00A875]/10"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="tour-email" className="mb-2 block text-sm font-medium text-gray-700">
                    Work email <span className="text-[#00A875]">*</span>
                  </label>
                  <input
                    id="tour-email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      clearError('email');
                    }}
                    aria-invalid={!!formErrors.email}
                    aria-describedby={formErrors.email ? 'tour-email-error' : undefined}
                    className={`h-11 w-full rounded-lg border bg-white px-3.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:ring-2 focus:ring-[#00A875]/10 ${formErrors.email ? 'border-red-500' : 'border-gray-200 focus:border-[#00A875]'}`}
                  />
                  {formErrors.email && <p id="tour-email-error" role="alert" className="mt-1.5 text-xs text-red-600">{formErrors.email}</p>}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="tour-type" className="mb-2 block text-sm font-medium text-gray-700">
                      Visiting as
                    </label>
                    <select
                      id="tour-type"
                      value={bookingType}
                      onChange={(e) => setBookingType(e.target.value)}
                      className="h-11 w-full appearance-none rounded-lg border border-gray-200 bg-white px-3.5 text-sm text-gray-900 outline-none transition focus:border-[#00A875] focus:ring-2 focus:ring-[#00A875]/10"
                    >
                      <option value="Personal">An individual</option>
                      <option value="Team">A team (2–10 people)</option>
                      <option value="Enterprise">A larger team (10+ people)</option>
                      <option value="Podcast">A podcast recording</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="tour-interest" className="mb-2 block text-sm font-medium text-gray-700">
                      Interested in
                    </label>
                    <select
                      id="tour-interest"
                      value={planInterest}
                      onChange={(e) => setPlanInterest(e.target.value)}
                      className="h-11 w-full appearance-none rounded-lg border border-gray-200 bg-white px-3.5 text-sm text-gray-900 outline-none transition focus:border-[#00A875] focus:ring-2 focus:ring-[#00A875]/10"
                    >
                      <option value="Hot Desk">Hot Desk</option>
                      <option value="Dedicated Desk">Dedicated Desk</option>
                      <option value="Private Office">Private Office</option>
                      <option value="Podcast Studio">Podcast Studio</option>
                      <option value="Meeting Room">Meeting Room</option>
                      <option value="Night Shift">Night Shift Pass</option>
                    </select>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-5">
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-800">When would you like to visit?</p>
                    <p className="mt-1 text-xs leading-5 text-gray-500">Choose your preferred dates and time (9:00 AM–7:00 PM).</p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label htmlFor="tour-start-date" className="mb-2 block text-xs font-semibold text-gray-600">
                        From
                      </label>
                      <input
                        id="tour-start-date"
                        type="date"
                        min={getLocalDate()}
                        value={startDate}
                        onChange={(e) => {
                          const value = e.target.value;
                          setStartDate(value);
                          if (value && value < getLocalDate()) {
                            setFormErrors((current) => ({ ...current, startDate: 'Please choose today or a future date.' }));
                          } else {
                            clearError('startDate');
                            if (endDate && value && endDate < value) {
                              setFormErrors((current) => ({ ...current, endDate: 'End date must be on or after the start date.' }));
                            } else {
                              clearError('endDate');
                            }
                          }
                        }}
                        aria-invalid={!!formErrors.startDate}
                        aria-describedby={formErrors.startDate ? 'tour-start-date-error' : undefined}
                        className={`h-11 w-full min-w-0 rounded-lg border bg-white px-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-[#00A875]/10 ${formErrors.startDate ? 'border-red-500' : 'border-gray-200 focus:border-[#00A875]'}`}
                      />
                      {formErrors.startDate && <p id="tour-start-date-error" role="alert" className="mt-1.5 text-xs text-red-600">{formErrors.startDate}</p>}
                    </div>
                    <div>
                      <label htmlFor="tour-end-date" className="mb-2 block text-xs font-semibold text-gray-600">
                        To
                      </label>
                      <input
                        id="tour-end-date"
                        type="date"
                        min={startDate || getLocalDate()}
                        value={endDate}
                        onChange={(e) => {
                          const value = e.target.value;
                          setEndDate(value);
                          if (value && value < getLocalDate()) {
                            setFormErrors((current) => ({ ...current, endDate: 'Please choose today or a future date.' }));
                          } else if (value && startDate && value < startDate) {
                            setFormErrors((current) => ({ ...current, endDate: 'End date must be on or after the start date.' }));
                          } else {
                            clearError('endDate');
                          }
                        }}
                        aria-invalid={!!formErrors.endDate}
                        aria-describedby={formErrors.endDate ? 'tour-end-date-error' : undefined}
                        className={`h-11 w-full min-w-0 rounded-lg border bg-white px-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-[#00A875]/10 ${formErrors.endDate ? 'border-red-500' : 'border-gray-200 focus:border-[#00A875]'}`}
                      />
                      {formErrors.endDate && <p id="tour-end-date-error" role="alert" className="mt-1.5 text-xs text-red-600">{formErrors.endDate}</p>}
                    </div>
                    <div>
                      <label htmlFor="tour-time" className="mb-2 block text-xs font-semibold text-gray-600">
                        Preferred time
                      </label>
                      <select
                        id="tour-time"
                        value={preferredTime}
                        onChange={(e) => {
                          setPreferredTime(e.target.value);
                          clearError('preferredTime');
                        }}
                        aria-invalid={!!formErrors.preferredTime}
                        aria-describedby={formErrors.preferredTime ? 'tour-time-error' : undefined}
                        className={`h-11 w-full min-w-0 rounded-lg border bg-white px-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-[#00A875]/10 ${formErrors.preferredTime ? 'border-red-500' : 'border-gray-200 focus:border-[#00A875]'}`}
                      >
                        <option value="">Select a time</option>
                        {availableTourTimes.map((time) => (
                          <option key={time.value} value={time.value}>{time.label}</option>
                        ))}
                      </select>
                      {formErrors.preferredTime && <p id="tour-time-error" role="alert" className="mt-1.5 text-xs text-red-600">{formErrors.preferredTime}</p>}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-1">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreed}
                    onChange={(e) => {
                      setAgreed(e.target.checked);
                      clearError('terms');
                    }}
                    className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-gray-300 text-[#00A875] focus:ring-[#00B87C]"
                    aria-invalid={!!formErrors.terms}
                    aria-describedby={formErrors.terms ? 'tour-terms-error' : undefined}
                  />
                  <label htmlFor="terms" className="cursor-pointer text-xs leading-5 text-gray-500">
                    I agree to The Roarworks' terms of service and privacy policy.
                  </label>
                </div>
                {formErrors.terms && <p id="tour-terms-error" role="alert" className="text-xs text-red-600">{formErrors.terms}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="group flex w-full items-center justify-center gap-2 rounded-lg bg-[#00A875] py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#008b60] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? 'Sending your request...' : 'Request my tour'}
                  {!submitting && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
                </button>
                <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-gray-400">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Your details are only used to arrange your visit.
                </p>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
