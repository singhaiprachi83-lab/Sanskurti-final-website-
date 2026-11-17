/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { memo, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Copy,
  CreditCard,
  Download,
  MessageCircle,
  MessageSquare,
  MoreVertical,
  RotateCcw,
  Shield,
  ShieldCheck,
  Sparkles,
  Star,
  ThumbsUp,
  Volume2,
  ArrowRight,
  X,
} from 'lucide-react';
import { FlameLogo } from './FlameLogo';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

type LanguageMode = 'en' | 'hinglish';
type SheetType = 'booking' | 'menu' | null;

const WHATSAPP_NUMBER = '918602688407';

function buildWhatsAppUrl(service: ServiceTier, utr?: string) {
  const baseText = `Hi Sanskurti! I would like to book "${service.titleEn}" (${service.price}).`;
  const message = utr
    ? `${baseText} Payment done — UTR ID: ${utr}. Please confirm my slot.`
    : `${baseText} Please share available slots.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

const ONE_RUPEE_PACK_PICS = [
  { id: 'pic-1', label: 'Photo 1', src: '/assets/aistudio/IMG (104).jpg', fileName: 'sanskurti-photo-1.jpg' },
  { id: 'pic-2', label: 'Photo 2', src: '/assets/aistudio/IMG (125).jpg', fileName: 'sanskurti-photo-2.jpg' },
  { id: 'pic-3', label: 'Photo 3', src: '/assets/aistudio/IMG (128).jpg', fileName: 'sanskurti-photo-3.jpg' },
  { id: 'pic-4', label: 'Photo 4', src: '/assets/aistudio/IMG (189).jpg', fileName: 'sanskurti-photo-4.jpg' },
  { id: 'pic-5', label: 'Photo 5', src: '/assets/aistudio/IMG (144).jpg', fileName: 'sanskurti-photo-5.jpg' },
];

const SIXTY_RUPEE_PACK_PICS = [
  { id: 'pack10-1', label: 'Photo 1', src: '/assets/aistudio/IMG (104).jpg', fileName: 'sanskurti-10pack-1.jpg' },
  { id: 'pack10-2', label: 'Photo 2', src: '/assets/aistudio/IMG (125).jpg', fileName: 'sanskurti-10pack-2.jpg' },
  { id: 'pack10-3', label: 'Photo 3', src: '/assets/aistudio/IMG (128).jpg', fileName: 'sanskurti-10pack-3.jpg' },
  { id: 'pack10-4', label: 'Photo 4', src: '/assets/aistudio/IMG (189).jpg', fileName: 'sanskurti-10pack-4.jpg' },
  { id: 'pack10-5', label: 'Photo 5', src: '/assets/aistudio/IMG (144).jpg', fileName: 'sanskurti-10pack-5.jpg' },
  { id: 'pack10-6', label: 'Photo 6', src: '/assets/IMG (88).jpg', fileName: 'sanskurti-10pack-6.jpg' },
  { id: 'pack10-7', label: 'Photo 7', src: '/assets/aistudio/IMG (111).jpg', fileName: 'sanskurti-10pack-7.jpg' },
  { id: 'pack10-8', label: 'Photo 8', src: '/assets/aistudio/IMG (117).jpg', fileName: 'sanskurti-10pack-8.jpg' },
  { id: 'pack10-9', label: 'Photo 9', src: '/assets/aistudio/IMG (166).jpg', fileName: 'sanskurti-10pack-9.jpg' },
  { id: 'pack10-10', label: 'Photo 10', src: '/assets/aistudio/IMG (167).jpg', fileName: 'sanskurti-10pack-10.jpg' },
];

const HUNDRED_RUPEE_PACK_PICS = [
  { id: 'pack13-1', label: 'Photo 1', src: '/assets/aistudio/IMG (167).jpg', fileName: 'sanskurti-13pack-1.jpg' },
  { id: 'pack13-2', label: 'Photo 2', src: '/assets/aistudio/IMG (166).jpg', fileName: 'sanskurti-13pack-2.jpg' },
  { id: 'pack13-3', label: 'Photo 3', src: '/assets/aistudio/IMG (117).jpg', fileName: 'sanskurti-13pack-3.jpg' },
  { id: 'pack13-4', label: 'Photo 4', src: '/assets/aistudio/IMG (111).jpg', fileName: 'sanskurti-13pack-4.jpg' },
  { id: 'pack13-5', label: 'Photo 5', src: '/assets/IMG (88).jpg', fileName: 'sanskurti-13pack-5.jpg' },
  { id: 'pack13-6', label: 'Photo 6', src: '/assets/aistudio/IMG (144).jpg', fileName: 'sanskurti-13pack-6.jpg' },
  { id: 'pack13-7', label: 'Photo 7', src: '/assets/aistudio/IMG (189).jpg', fileName: 'sanskurti-13pack-7.jpg' },
  { id: 'pack13-8', label: 'Photo 8', src: '/assets/aistudio/IMG (128).jpg', fileName: 'sanskurti-13pack-8.jpg' },
  { id: 'pack13-9', label: 'Photo 9', src: '/assets/aistudio/IMG (125).jpg', fileName: 'sanskurti-13pack-9.jpg' },
  { id: 'pack13-10', label: 'Photo 10', src: '/assets/aistudio/IMG (104).jpg', fileName: 'sanskurti-13pack-10.jpg' },
  { id: 'pack13-11', label: 'Video 1', src: '/assets/aistudio/VID (12).mp4', fileName: 'sanskurti-13pack-video-1.mp4' },
  { id: 'pack13-12', label: 'Video 2', src: '/assets/aistudio/VID (20).mp4', fileName: 'sanskurti-13pack-video-2.mp4' },
  { id: 'pack13-13', label: 'Video 3', src: '/assets/aistudio/VID (34).mp4', fileName: 'sanskurti-13pack-video-3.mp4' },
];

const ONE_FIFTY_RUPEE_PACK_PICS = [
  { id: 'pack5v-1', label: 'Video 1', src: '/assets/aistudio/VID (5).mp4', fileName: 'sanskurti-150pack-1.mp4' },
  { id: 'pack5v-2', label: 'Video 2', src: '/assets/aistudio/VID (4).mp4', fileName: 'sanskurti-150pack-2.mp4' },
  { id: 'pack5v-3', label: 'Video 3', src: '/assets/aistudio/VID (34).mp4', fileName: 'sanskurti-150pack-3.mp4' },
  { id: 'pack5v-4', label: 'Video 4', src: '/assets/aistudio/VID (20).mp4', fileName: 'sanskurti-150pack-4.mp4' },
  { id: 'pack5v-5', label: 'Video 5', src: '/assets/aistudio/VID (12).mp4', fileName: 'sanskurti-150pack-5.mp4' },
];

interface ServiceTier {
  id: string;
  titleEn: string;
  titleHi: string;
  subtitleEn: string;
  subtitleHi: string;
  price: string;
  originalPrice?: string;
  discountLabel?: string;
  popular?: boolean;
  goldenOffer?: boolean;
  badgeTextEn?: string;
  badgeTextHi?: string;
}

const SERVICES: ServiceTier[] = [
  {
    id: 'fun-chat',
    titleEn: '5 Sex Pics / Nude Pics',
    titleHi: '5 सेक्स फोटो / न्यूड फोटो',
    subtitleEn: '🥵💖🥵',
    subtitleHi: '🥵💖🥵',
    price: '₹1',
    popular: true,
  },
  {
    id: 'video-call-10',
    titleEn: '10 Minutes Video Call',
    titleHi: '10 मिनट वीडियो कॉल',
    subtitleEn: '',
    subtitleHi: '',
    price: '₹150',
  },
  {
    id: 'video-call-20',
    titleEn: '20 Minutes Video Call',
    titleHi: '20 मिनट वीडियो कॉल',
    subtitleEn: '',
    subtitleHi: '',
    price: '₹200',
    originalPrice: '₹300',
    discountLabel: '33% OFF',
    goldenOffer: true,
    badgeTextEn: 'SPECIAL OFFER',
    badgeTextHi: 'स्पेशल ऑफर',
  },
  {
    id: 'video-call-30',
    titleEn: '30 Minutes Video Call',
    titleHi: '30 मिनट वीडियो कॉल',
    subtitleEn: '',
    subtitleHi: '',
    price: '₹300',
  },
  {
    id: 'exclusive-pics-10',
    titleEn: '10 Sex Pics / Nude Pics',
    titleHi: '10 सेक्स पिक्स / न्यूड पिक्स',
    subtitleEn: '🥵',
    subtitleHi: '🥵',
    price: '₹60',
  },
  {
    id: 'exclusive-videos-5',
    titleEn: '5 Videos',
    titleHi: '5 वीडियोज़',
    subtitleEn: 'Hot 🔥',
    subtitleHi: 'Hot 🔥',
    price: '₹150',
  },
  {
    id: 'combo-10-3',
    titleEn: '10 pic + 3 videos',
    titleHi: '10',
    subtitleEn: '',
    subtitleHi: '',
    price: '₹100',
    goldenOffer: true,
    popular: true,
  },
  {
    id: 'chat-30',
    titleEn: '30 Minutes Sex Chat',
    titleHi: '30 मिनट सेक्स चैट',
    subtitleEn: '',
    subtitleHi: '',
    price: '₹150',
  },
  {
    id: 'chat-60',
    titleEn: '60 Minutes Sex Chat',
    titleHi: '60 मिनट सेक्स चैट',
    subtitleEn: '',
    subtitleHi: '',
    price: '₹250',
  },
  {
    id: 'voice-call-30',
    titleEn: '30 Minutes Voice Call',
    titleHi: '30 मिनट वॉइस कॉल',
    subtitleEn: '',
    subtitleHi: '',
    price: '₹200',
  },
  {
    id: 'voice-call-60',
    titleEn: '60 Minutes Voice Call',
    titleHi: '60 मिनट वॉइस कॉल',
    subtitleEn: '',
    subtitleHi: '',
    price: '₹300',
  },
  {
    id: 'membership-7d',
    titleEn: '7 Days Membership of Video Call',
    titleHi: '7 डेज वीडियो कॉल मेंबरशिप',
    subtitleEn: 'Regular 60 Minutes',
    subtitleHi: 'रेगुलर 60 मिनट',
    price: '₹300',
    originalPrice: '₹450',
    discountLabel: '33% OFF',
    goldenOffer: true,
    badgeTextEn: 'VIP MEMBERSHIP',
    badgeTextHi: 'वीआईपी मेंबरशिप',
  },
  {
    id: 'membership-15d',
    titleEn: '15 Days Membership of Video Call',
    titleHi: '15 डेज वीडियो कॉल मेंबरशिप',
    subtitleEn: 'Regular 60 Minutes',
    subtitleHi: 'रेगुलर 60 मिनट',
    price: '₹550',
    originalPrice: '₹1500',
    discountLabel: '63% OFF',
    goldenOffer: true,
    badgeTextEn: 'VIP MEMBERSHIP',
    badgeTextHi: 'वीआईपी मेंबरशिप',
  },
];

interface ReviewReply {
  id: string;
  author: string;
  time: string;
  text: string;
}

interface ReviewItem {
  id: string;
  author: string;
  timeEn: string;
  timeHi: string;
  text: string;
  likes: number;
  replies?: ReviewReply[];
}

const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-shiva',
    author: 'Shiva',
    timeEn: '2 days ago',
    timeHi: '2 दिन पहले',
    text: 'Maja aa gaya bhailog mast baat hai... ❤️‍🔥',
    likes: 98,
    replies: [],
  },
  {
    id: 'rev-rohit',
    author: 'Rohit',
    timeEn: '3 days ago',
    timeHi: '3 दिन पहले',
    text: 'Video Call service is best 😍',
    likes: 60,
    replies: [],
  },
  {
    id: 'rev-silent',
    author: 'Silent Boy',
    timeEn: '5 days ago',
    timeHi: '5 दिन पहले',
    text: 'Service is positive and best 🥰',
    likes: 151,
    replies: [],
  },
  {
    id: 'rev-aryan',
    author: 'Aryan',
    timeEn: '1 day ago',
    timeHi: '1 दिन पहले',
    text: '20 minutes video call liya tha, bahut smooth aur crystal clear quality thi 🔥',
    likes: 84,
    replies: [],
  },
  {
    id: 'rev-karan',
    author: 'Karan',
    timeEn: '4 days ago',
    timeHi: '4 दिन पहले',
    text: 'Video call experience ekdum genuine aur friendly tha, bilkul time waste nahi 😍',
    likes: 112,
    replies: [],
  },
  {
    id: 'rev-deepak',
    author: 'Deepak',
    timeEn: '6 days ago',
    timeHi: '6 दिन पहले',
    text: '10 min video call try kiya aur ab 7 days membership lene wala hu, best service 💯',
    likes: 67,
    replies: [],
  },
  {
    id: 'rev-ankit',
    author: 'Ankit',
    timeEn: '1 week ago',
    timeHi: '1 हफ्ते पहले',
    text: 'Genuine service, fast reply and full privacy 👍',
    likes: 42,
    replies: [],
  },
  {
    id: 'rev-vikram',
    author: 'Vikram',
    timeEn: '1 week ago',
    timeHi: '1 हफ्ते पहले',
    text: 'Bahut respectful aur polite experience raha ✨',
    likes: 74,
    replies: [],
  },
];

function WhiteAvatar({ accented = false }: { accented?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`flex h-11 w-11 shrink-0 items-end justify-center overflow-hidden rounded-full bg-gradient-to-b from-[#a1a1aa] to-[#71717a] mt-0.5 ${
        accented
          ? 'border-2 border-[#ff2965]/85 shadow-[0_0_12px_rgba(255,41,101,0.3)]'
          : 'border-2 border-white/25'
      }`}
    >
      <svg
        viewBox="0 0 36 36"
        className="h-10 w-10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="18" cy="12.5" r="6" fill="#ffffff" />
        <path
          d="M6.5 34C6.5 26.8 11.4 22 18 22C24.6 22 29.5 26.8 29.5 34H6.5Z"
          fill="#ffffff"
        />
      </svg>
    </div>
  );
}

const BharatPeQrFrame = memo(function BharatPeQrFrame({
  upiUri,
}: {
  upiUri: string;
}) {
  return (
    <div
      className="rounded-[18px] p-[3px]"
      style={{
        background:
          'linear-gradient(180deg, #ef6656 0%, #ef6656 50%, #0b7a78 50%, #0b7a78 100%)',
      }}
    >
      <div className="relative rounded-[15px] bg-white p-3.5">
        <QRCodeSVG
          value={upiUri}
          size={184}
          bgColor="#ffffff"
          fgColor="#000000"
          level="H"
          includeMargin={false}
        />
        {/* Center BharatPe Circular Emblem */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-[#06a6c9] bg-white shadow-sm"
        >
          <div className="flex flex-col gap-[3px] -rotate-12">
            <span className="h-[3.5px] w-4 rounded-full bg-[#ef6656]" />
            <span className="h-[3.5px] w-4 rounded-full bg-[#0b7a78]" />
          </div>
        </div>
      </div>
    </div>
  );
});

interface BookingCheckoutContentProps {
  service: ServiceTier;
  isHi: boolean;
  onClose: () => void;
}

function BookingCheckoutContent({
  service,
  isHi,
  onClose,
}: BookingCheckoutContentProps) {
  const [secondsLeft, setSecondsLeft] = useState(300);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [utrInput, setUtrInput] = useState('');
  const [utrError, setUtrError] = useState('');
  const unlockedTopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSecondsLeft(300);
    setCopiedUpi(false);
    setPaymentDone(false);
    setUtrInput('');
    setUtrError('');
  }, [service.id]);

  useEffect(() => {
    if (!paymentDone) return;
    const resetScroll = () => {
      const scroller = unlockedTopRef.current?.parentElement;
      if (scroller) {
        scroller.scrollTop = 0;
      }
    };
    resetScroll();
    const rafId = window.requestAnimationFrame(resetScroll);
    return () => window.cancelAnimationFrame(rafId);
  }, [paymentDone]);

  useEffect(() => {
    if (paymentDone || secondsLeft <= 0) return;
    const interval = window.setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [paymentDone, secondsLeft]);

  const payableAmount = Number(service.price.replace(/[^0-9]/g, '')) || 1;
  const upiUri = `upi://pay?pa=BHARATPE.8000190483@fbpe&pn=PRAGYA%20JAIN&am=${payableAmount}&cu=INR&tn=${encodeURIComponent(
    service.titleEn
  )}`;
  const timerMinutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const timerSeconds = String(secondsLeft % 60).padStart(2, '0');

  const handleCopyUpi = async () => {
    try {
      await navigator.clipboard.writeText('BHARATPE.8000190483@fbpe');
      setCopiedUpi(true);
      window.setTimeout(() => setCopiedUpi(false), 1800);
    } catch {
      setCopiedUpi(false);
    }
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const digitsOnly = utrInput.replace(/\D/g, '');
    if (digitsOnly.length < 12) {
      setUtrError(
        isHi
          ? 'कम से कम 12 अंकों (digits) की सही Transaction / UTR ID डालें।'
          : 'Please enter at least a 12-digit Transaction / UTR ID.'
      );
      return;
    }
    setUtrError('');
    setPaymentDone(true);
  };

  const unlockedPics =
    service.id === 'fun-chat'
      ? ONE_RUPEE_PACK_PICS
      : service.id === 'exclusive-pics-10'
        ? SIXTY_RUPEE_PACK_PICS
        : service.id === 'combo-10-3'
          ? HUNDRED_RUPEE_PACK_PICS
          : service.id === 'exclusive-videos-5'
            ? ONE_FIFTY_RUPEE_PACK_PICS
            : null;

  const triggerDownload = (pic: { src: string; fileName: string }) => {
    const link = document.createElement('a');
    link.href = pic.src;
    link.download = pic.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAll = () => {
    if (!unlockedPics) return;
    unlockedPics.forEach((pic, idx) => {
      window.setTimeout(() => {
        triggerDownload(pic);
      }, idx * 240);
    });
  };

  if (paymentDone && unlockedPics) {
    const isVideoFile = (src: string) => /\.(mp4|webm|mov)$/i.test(src);
    const videoCount = unlockedPics.filter((item) => isVideoFile(item.src)).length;
    const photoCount = unlockedPics.length - videoCount;

    const unlockedHeading =
      photoCount > 0 && videoCount > 0
        ? isHi
          ? `${photoCount} पिक्स + ${videoCount} वीडियो अनलॉक हो गए!`
          : `${photoCount} Pics + ${videoCount} Videos Unlocked!`
        : videoCount > 0
          ? isHi
            ? `${videoCount} वीडियो अनलॉक हो गए!`
            : `${videoCount} Videos Unlocked!`
          : isHi
            ? `${unlockedPics.length} पिक्स अनलॉक हो गईं!`
            : `${unlockedPics.length} Pics Unlocked!`;

    const downloadAllLabel =
      photoCount > 0 && videoCount > 0
        ? isHi
          ? `सभी डाउनलोड करें (${photoCount} पिक्स + ${videoCount} वीडियो)`
          : `Download All (${photoCount} Pics + ${videoCount} Videos)`
        : videoCount > 0
          ? isHi
            ? `सभी ${videoCount} वीडियो एक साथ डाउनलोड करें`
            : `Download All ${videoCount} Videos`
          : isHi
            ? `सभी ${unlockedPics.length} पिक्स एक साथ डाउनलोड करें`
            : `Download All ${unlockedPics.length} Pics`;

    return (
      <div ref={unlockedTopRef} className="space-y-4">
        {/* Unlocked Header Banner */}
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-center space-y-1">
          <div className="inline-flex items-center justify-center gap-1.5 text-emerald-700 font-sans-ui text-sm font-bold">
            <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600" />
            <span>{unlockedHeading}</span>
          </div>
          <p className="font-sans-ui text-[11px] font-medium text-emerald-700/85 tabular-nums">
            {isHi
              ? `UTR वेरिफाइड: ${utrInput.trim()} · नीचे दिए बटन से डाउनलोड करें`
              : `UTR Verified: ${utrInput.trim()} · Download using the button below`}
          </p>
        </div>

        {/* Unlocked Photos & Videos Grid */}
        <div className="grid grid-cols-2 gap-3">
          {unlockedPics.map((pic, idx) => {
            const isVideo = isVideoFile(pic.src);
            return (
              <div
                key={pic.id}
                className={`rounded-2xl border border-slate-200 bg-slate-50 p-2 flex flex-col gap-2 ${
                  unlockedPics.length % 2 === 1 && idx === unlockedPics.length - 1
                    ? 'col-span-2 max-w-[56%] mx-auto w-full'
                    : ''
                }`}
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-slate-900">
                  {isVideo ? (
                    <video
                      src={pic.src}
                      controls
                      playsInline
                      preload="metadata"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <img
                      src={pic.src}
                      alt={pic.label}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>

                <div className="px-0.5 text-center">
                  <span className="font-sans-ui text-xs font-bold text-slate-800">
                    {pic.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Download All + Done */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={handleDownloadAll}
            className="font-sans-ui w-full min-h-[46px] rounded-xl text-sm font-bold text-white shadow-[0_8px_20px_rgba(244,37,103,0.28)] inline-flex items-center justify-center gap-2 transition-transform active:scale-[0.98] cursor-pointer"
            style={{
              background: 'linear-gradient(90deg, #f42567 0%, #f95738 100%)',
            }}
          >
            <Download className="h-4 w-4" />
            <span>{downloadAllLabel}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="font-sans-ui w-full min-h-[42px] rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 cursor-pointer"
          >
            {isHi ? 'बंद करें' : 'Done'}
          </button>
        </div>
      </div>
    );
  }

  if (paymentDone) {
    return (
      <div className="py-6 text-center space-y-3.5">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h4 className="font-sans-ui text-xl font-bold text-slate-900">
          {isHi ? 'पेमेंट वेरिफाई के लिए सबमिट!' : 'Payment Submitted!'}
        </h4>
        <p className="font-sans-ui text-sm text-slate-600 leading-relaxed max-w-xs mx-auto">
          {isHi
            ? `"${service.titleHi}" (₹${payableAmount}) · UTR: ${utrInput.trim()} की रिक्वेस्ट मिल गई है। कृपया WhatsApp पर स्क्रीनशॉट भेजें।`
            : `Your payment of ₹${payableAmount} for "${service.titleEn}" (UTR: ${utrInput.trim()}) has been recorded. Send your screenshot on WhatsApp for instant confirmation.`}
        </p>
        <div className="pt-2 flex flex-col gap-2.5">
          <a
            href={buildWhatsAppUrl(service, utrInput.trim())}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans-ui w-full min-h-[46px] rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-sm font-bold text-white inline-flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            <MessageCircle className="h-4 w-4" />
            <span>
              {isHi ? 'WhatsApp पर स्क्रीनशॉट भेजें' : 'Send Screenshot on WhatsApp'}
            </span>
          </a>
          <button
            type="button"
            onClick={onClose}
            className="font-sans-ui w-full min-h-[44px] rounded-xl bg-slate-100 hover:bg-slate-200 text-sm font-semibold text-slate-700 cursor-pointer"
          >
            {isHi ? 'बंद करें' : 'Done'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3.5">
      {/* Centered BharatPe Two-Tone Framed QR Card with LIVE Tag */}
      <div className="pt-2 flex justify-center">
        <div className="relative rounded-[22px] bg-white p-3.5 shadow-[0_10px_28px_rgba(15,23,42,0.10)] border border-slate-100">
          <span className="font-sans-ui absolute -top-2.5 right-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-[#10b981] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            LIVE
          </span>

          {secondsLeft > 0 ? (
            <BharatPeQrFrame upiUri={upiUri} />
          ) : (
            <div className="flex h-[218px] w-[218px] flex-col items-center justify-center rounded-[18px] border-2 border-dashed border-slate-300 bg-slate-50 p-4 text-center">
              <p className="font-sans-ui text-xs font-semibold text-slate-700">
                {isHi ? 'QR समय समाप्त हो गया' : 'QR Expired'}
              </p>
              <button
                type="button"
                onClick={() => setSecondsLeft(300)}
                className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg bg-[#0b7a78] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#096462] cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>{isHi ? 'नया QR लाएं' : 'Refresh QR'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Scan Instruction + Quick Copy UPI Pill */}
      <div className="text-center space-y-1.5">
        <p className="font-sans-ui text-[13px] font-medium text-slate-500">
          {isHi
            ? 'पेमेंट करने के लिए किसी भी UPI ऐप से QR स्कैन करें'
            : 'Scan QR with any UPI app to pay'}
        </p>
        <div className="flex items-center justify-center text-[11px] font-sans-ui">
          <button
            type="button"
            onClick={handleCopyUpi}
            className="inline-flex items-center gap-1 rounded-full bg-slate-100 hover:bg-slate-200 px-3 py-1 font-medium text-slate-700 transition-colors cursor-pointer"
          >
            {copiedUpi ? (
              <>
                <Check className="h-3 w-3 text-emerald-600" />
                <span className="text-emerald-700">
                  {isHi ? 'UPI कॉपी हुआ' : 'UPI Copied'}
                </span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3 text-slate-500" />
                <span>BHARATPE.8000190483@fbpe</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Live 5-Minute Expiry Timer + Green Progress Bar */}
      <div>
        <div className="flex items-center justify-center gap-2 rounded-xl bg-[#f3f4f6] px-4 py-2.5">
          <Clock className="h-4 w-4 text-slate-500" />
          <span className="font-sans-ui text-sm font-medium text-slate-600">
            {isHi ? 'QR समय शेष' : 'QR Expires in'}
          </span>
          <span className="font-sans-ui text-[15px] font-bold text-slate-900 tabular-nums">
            {timerMinutes}:{timerSeconds}
          </span>
        </div>
        <div className="mt-2 h-1 w-full rounded-full bg-slate-200 overflow-hidden">
          <div
            className="h-full rounded-full bg-[#16a34a] transition-[width] duration-1000 ease-linear"
            style={{ width: `${(secondsLeft / 300) * 100}%` }}
          />
        </div>
      </div>

      {/* Amount to Pay Box */}
      <div className="flex items-center justify-between rounded-xl bg-[#f3f4f6] px-4 py-3">
        <span className="font-sans-ui text-sm font-medium text-slate-600">
          {isHi ? 'भुगतान राशि' : 'Amount to Pay'}
        </span>
        <span className="font-sans-ui text-xl font-extrabold text-slate-900 tabular-nums">
          ₹{payableAmount}
        </span>
      </div>

      {/* Divider + UTR Input + Confirm Payment CTA */}
      <form onSubmit={handleConfirmPayment} className="space-y-3 pt-0.5">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="font-sans-ui text-xs font-medium text-slate-500 whitespace-nowrap">
            {isHi
              ? 'पेमेंट के बाद Transaction ID डालें'
              : 'Enter Transaction ID after payment'}
          </span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <div>
          <input
            type="text"
            inputMode="numeric"
            minLength={12}
            pattern="[0-9]{12,}"
            value={utrInput}
            onChange={(e) => {
              const digitsOnly = e.target.value.replace(/\D/g, '');
              setUtrInput(digitsOnly);
              if (utrError) setUtrError('');
            }}
            placeholder={
              isHi
                ? '12 अंकों की Transaction / UTR ID डालें'
                : 'Enter 12-digit Transaction / UTR ID'
            }
            className="font-sans-ui w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#f42567] focus:outline-none focus:ring-2 focus:ring-[#f42567]/20 tabular-nums"
          />
          {utrError && (
            <p className="font-sans-ui mt-1 text-xs font-medium text-rose-500">
              {utrError}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="font-sans-ui w-full min-h-[48px] rounded-xl text-[15px] font-bold text-white shadow-[0_8px_20px_rgba(244,37,103,0.28)] transition-transform active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer"
          style={{
            background: 'linear-gradient(90deg, #f42567 0%, #f95738 100%)',
          }}
        >
          <span>{isHi ? 'पेमेंट कन्फर्म करें' : 'Confirm Payment'}</span>
          <Check className="h-4 w-4 stroke-[2.75]" />
        </button>
      </form>

      {/* Bottom WhatsApp Screenshot Support */}
      <div className="pt-1 text-center space-y-2.5">
        <p className="font-sans-ui inline-flex items-center justify-center gap-1.5 text-xs text-slate-500">
          <Shield className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span>
            {isHi
              ? 'ऑर्डर न मिलने पर WhatsApp पर स्क्रीनशॉट भेजें'
              : 'Send screenshot in WhatsApp if order not received'}
          </span>
        </p>
        <div>
          <a
            href={buildWhatsAppUrl(service)}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans-ui inline-flex items-center justify-center gap-2 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] px-6 min-h-[42px] text-sm font-bold text-white shadow-[0_6px_16px_rgba(34,197,94,0.28)] transition-colors active:scale-[0.98] cursor-pointer"
          >
            <MessageCircle className="h-4 w-4" />
            <span>{isHi ? 'WhatsApp पर भेजें' : 'Send on WhatsApp'}</span>
          </a>
        </div>
      </div>
    </div>
  );
}

interface ServicesPageProps {
  onBackToWelcome: () => void;
}

export function ServicesPage({ onBackToWelcome }: ServicesPageProps) {
  const shouldReduceMotion = useReducedMotion();
  const [lang, setLang] = useState<LanguageMode>('en');
  const [activeSheet, setActiveSheet] = useState<SheetType>(null);
  const [selectedService, setSelectedService] = useState<ServiceTier>(SERVICES[0]);

  const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_REVIEWS);
  const [visibleReviewsCount, setVisibleReviewsCount] = useState(6);
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({});
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const isHi = lang === 'hinglish';

  const handleToggleLike = (id: string) => {
    const alreadyLiked = Boolean(likedIds[id]);
    setLikedIds((prev) => ({ ...prev, [id]: !alreadyLiked }));
    setReviews((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, likes: item.likes + (alreadyLiked ? -1 : 1) }
          : item
      )
    );
  };

  const handlePostReview = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newReviewText.trim();
    if (trimmed.length < 3) {
      setReviewError(
        isHi ? 'कृपया कम से कम एक छोटा रिव्यू लिखें।' : 'Please write a short review first.'
      );
      return;
    }
    const newEntry: ReviewItem = {
      id: `rev-${Date.now()}`,
      author: newReviewAuthor.trim() || (isHi ? 'गेस्ट' : 'Guest'),
      timeEn: 'Just now',
      timeHi: 'अभी',
      text: trimmed,
      likes: 1,
      replies: [],
    };
    setReviews((prev) => [newEntry, ...prev]);
    setVisibleReviewsCount((prev) => prev + 1);
    setNewReviewText('');
    setNewReviewAuthor('');
    setReviewError('');
  };

  const handlePostReply = (reviewId: string) => {
    const trimmed = replyText.trim();
    if (!trimmed) return;
    setReviews((prev) =>
      prev.map((item) =>
        item.id === reviewId
          ? {
              ...item,
              replies: [
                ...(item.replies ?? []),
                {
                  id: `rep-${Date.now()}`,
                  author: isHi ? 'विजिटर' : 'Visitor',
                  time: isHi ? 'अभी' : 'Just now',
                  text: trimmed,
                },
              ],
            }
          : item
      )
    );
    setReplyText('');
    setReplyingToId(null);
  };

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'en' ? 'hinglish' : 'en'));
  };

  const openPayNow = (service: ServiceTier) => {
    setSelectedService(service);
    setActiveSheet('booking');
  };

  return (
    <motion.div
      key="services-page"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: EASE_OUT_EXPO }}
      className="relative min-h-dvh w-full bg-[#070406] text-[#f5f3f7] pb-10 transform-gpu"
    >
      {/* Subtle atmospheric glow behind page */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 0%, rgba(168, 22, 66, 0.18) 0%, rgba(72, 12, 34, 0.08) 38%, rgba(7, 4, 6, 0) 70%)',
        }}
      />

      {/* Compact Sticky Mobile Top Bar (<= 56px tall) */}
      <header className="sticky top-0 z-30 h-14 w-full bg-[#0a0609]/88 backdrop-blur-md border-b border-white/[0.07]">
        <div className="mx-auto flex h-full max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
          {/* Zone 1: Brand Mark */}
          <button
            type="button"
            onClick={onBackToWelcome}
            className="flex items-center gap-2.5 text-left min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff2965]/70 rounded-lg cursor-pointer"
            aria-label="Back to Sanskurti Welcome Screen"
          >
            <FlameLogo size={24} />
            <span className="font-display-serif text-[19px] sm:text-[21px] font-bold tracking-tight sanskruti-gradient-text whitespace-nowrap shrink-0">
              Sanskurti Services
            </span>
          </button>

          {/* Zone 2 (Desktop inline nav) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-sans-ui text-[#b8b4c0]">
            <a
              href="#about"
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              {isHi ? 'परिचय' : 'About'}
            </a>
            <a
              href="#services"
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              {isHi ? 'सर्विसेज' : 'Services'}
            </a>
            <a
              href="#identity"
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              {isHi ? 'वेरिफिकेशन' : 'Identity'}
            </a>
            <a
              href="#reviews"
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              {isHi ? 'रिव्यूज' : 'Reviews'}
            </a>
          </nav>

          {/* Zone 3: Language Toggle + Menu */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={toggleLanguage}
              className="font-sans-ui inline-flex items-center gap-1.5 rounded-full border border-[#ff2965]/35 bg-[#1b0c14]/90 px-3.5 min-h-[38px] text-xs font-semibold text-[#ff9bb8] whitespace-nowrap shrink-0 transition-colors hover:border-[#ff2965]/70 hover:text-white active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff2965] cursor-pointer"
            >
              <span>{isHi ? 'English' : 'हिन्दी'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSheet('menu')}
              aria-label="Open Menu"
              className="inline-flex h-[40px] w-[40px] items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-[#ff4b82] transition-colors hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff2965] cursor-pointer"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 pt-5 sm:pt-8 space-y-6">
        {/* About Me + Trust Section */}
        <section
          id="about"
          className="relative overflow-hidden rounded-3xl border border-white/[0.09] bg-[#120b10]/95 shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
        >
          {/* Top Pink-to-Gold Hairline Rim */}
          <div
            aria-hidden="true"
            className="h-[2.5px] w-full"
            style={{
              background:
                'linear-gradient(90deg, #ff2466 0%, #ff5a4e 52%, #f59e0b 100%)',
            }}
          />

          <div className="p-5 sm:p-8 lg:grid lg:grid-cols-12 lg:gap-8 lg:items-center">
            {/* Bio Column */}
            <div className="lg:col-span-8 text-center lg:text-left">
              <h1 className="font-display-serif text-[30px] sm:text-[36px] font-bold tracking-tight text-white mb-4">
                {isHi ? 'मेरे बारे में' : 'About Me'}
              </h1>

              {isHi ? (
                <div className="font-sans-ui space-y-4 text-[15px] sm:text-[16px] leading-[1.7] text-[#d6d2dc]">
                  <p>
                    नमस्ते, मैं <strong className="font-semibold text-white">Sanskurti</strong>{' '}
                    हूँ — एक कॉन्फिडेंट और चार्मिंग साथी, जो अपने प्रीमियम क्लाइंट्स को पर्सनल
                    और एक्सक्लूसिव वर्चुअल टाइम देती है। मेरी बातचीत और पूरा ध्यान हर कनेक्शन
                    को सच में खास बना देता है।
                  </p>
                  <p>
                    मैं हर बातचीत को <strong className="font-semibold text-white">100% प्राइवेसी</strong>{' '}
                    और पूरे सम्मान के साथ हैंडल करती हूँ, ताकि आप बिना किसी चिंता के अपने प्रीमियम
                    एक्सपीरियंस का पूरा आनंद ले सकें।
                  </p>
                  <p className="text-[#f3eef6] font-medium">
                    अगर आप एक जेन्युइन, हाई-क्लास और क्लासी वर्चुअल एक्सपीरियंस चाहते हैं, तो
                    अभी अपना टाइम बुक करें!
                  </p>
                </div>
              ) : (
                <div className="font-sans-ui space-y-4 text-[15px] sm:text-[16px] leading-[1.7] text-[#d6d2dc]">
                  <p>
                    Hello, I&apos;m <strong className="font-semibold text-white">Sanskurti</strong>{' '}
                    — a confident and charming girl who gives her premium clients personal and
                    exclusive virtual time. I make every connection truly special with my
                    conversations and attention.
                  </p>
                  <p>
                    I handle every interaction with absolute privacy and respect, so that you can
                    enjoy your premium experience with complete comfort and safety.
                  </p>
                  <p className="text-[#f3eef6] font-medium">
                    If you want a genuine, high-class and classy virtual experience, then contact me
                    now and book your time!
                  </p>
                </div>
              )}

              {/* Hinglish / English Quick Reader Button */}
              <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <button
                  type="button"
                  onClick={toggleLanguage}
                  className="font-sans-ui inline-flex items-center gap-2 rounded-full border border-[#ff2965]/40 bg-[#22101a] px-5 py-2.5 min-h-[44px] text-[13px] font-medium text-[#ffd1df] whitespace-nowrap shrink-0 transition-all duration-200 hover:border-[#ff2965] hover:bg-[#2f1423] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff2965] cursor-pointer"
                >
                  <Volume2 className="h-4 w-4 text-[#ff4b82]" />
                  <span>{isHi ? 'Read in English' : 'Hinglish में पढ़ें'}</span>
                </button>
              </div>
            </div>

            {/* Trust & Privacy Column */}
            <div className="mt-6 lg:mt-0 lg:col-span-4 space-y-3">
              <div className="rounded-2xl border border-emerald-400/25 bg-emerald-950/35 p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-sans-ui text-sm font-semibold text-emerald-300 leading-snug">
                      {isHi
                        ? 'जेन्युइन और वेरिफाइड सर्विस'
                        : 'Genuine & Verified Service'}
                    </p>
                    <p className="font-sans-ui text-xs text-emerald-200/80 mt-1 tabular-nums">
                      {isHi ? '2023 से लगातार सक्रिय' : 'Active Since 2023'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#8e5c15]/40 bg-[#1a1108]/75 p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-[#f59e0b] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-sans-ui text-sm font-semibold text-[#fcd34d] leading-snug">
                      {isHi ? '100% प्राइवेट और सुरक्षित' : '100% Discreet & Private'}
                    </p>
                    <p className="font-sans-ui text-xs text-[#d6c29f] mt-1">
                      {isHi
                        ? 'आपकी पहचान और डेटा पूरी तरह सुरक्षित'
                        : 'Zero data sharing · Private slots'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Premium Services Section directly below 100% Discreet & Private */}
        <section
          id="services"
          className="relative overflow-hidden rounded-3xl border border-white/[0.09] bg-[#120b10]/95 shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
        >
          {/* Top Pink-to-Gold Hairline Rim */}
          <div
            aria-hidden="true"
            className="h-[2.5px] w-full"
            style={{
              background:
                'linear-gradient(90deg, #ff2466 0%, #ff5a4e 52%, #f59e0b 100%)',
            }}
          />

          <div className="px-4 py-7 sm:p-8">
            {/* Exact Screenshot Heading Style: Two-line Playfair Display + Short Gradient Underline */}
            <div className="flex flex-col items-center text-center mb-10">
              <h2 className="font-display-serif text-[34px] sm:text-[40px] font-bold leading-[1.2] text-white text-balance">
                {isHi ? (
                  <>
                    हमारी प्रीमियम
                    <br />
                    सर्विसेज
                  </>
                ) : (
                  <>
                    Our Premium
                    <br />
                    Services
                  </>
                )}
              </h2>
              <div
                aria-hidden="true"
                className="mt-4 h-[3.5px] w-36 rounded-full"
                style={{
                  background:
                    'linear-gradient(90deg, #ff2466 0%, #ff477e 65%, #f59e0b 100%)',
                  boxShadow: '0 0 12px rgba(255, 36, 102, 0.45)',
                }}
              />
            </div>

            {/* Service Cards Grid: 1 col mobile (matching screenshot stack), 2 cols on tablet/desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-7 md:gap-6">
              {SERVICES.map((service, index) => (
                <article
                  key={service.id}
                  style={{ contain: 'layout style' }}
                  className={`relative flex flex-col justify-between rounded-3xl border px-5 pt-8 pb-6 text-center transition-colors duration-150 ${
                    SERVICES.length % 2 === 1 && index === SERVICES.length - 1
                      ? 'md:col-span-2 md:max-w-md md:mx-auto md:w-full '
                      : ''
                  }${
                    service.goldenOffer
                      ? 'border-[#eab308]/85 bg-gradient-to-b from-[#231907]/95 via-[#171108]/95 to-[#120d08]/95 shadow-[inset_0_1px_0_rgba(250,204,21,0.18),0_0_22px_rgba(234,179,8,0.18)]'
                      : service.popular
                        ? 'border-[#ff2965]/55 bg-[#180d14]/95 shadow-[inset_0_1px_0_rgba(255,41,101,0.18),0_8px_24px_rgba(255,41,101,0.12)]'
                        : 'border-white/[0.11] bg-[#160c12]/95 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] hover:border-white/[0.2]'
                  }`}
                >
                  {/* Floating Top-Border POPULAR Pill matching screenshot */}
                  {service.popular && (
                    <div
                      className="absolute -top-4 left-1/2 -translate-x-1/2 overflow-hidden inline-flex items-center gap-1.5 rounded-full px-5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white whitespace-nowrap shadow-[0_0_22px_rgba(255,41,101,0.65)]"
                      style={{
                        background:
                          'linear-gradient(90deg, #ff2e6b 0%, #ff6b8b 100%)',
                      }}
                    >
                      {/* Seamless non-stop shining sweep across full badge width */}
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 animate-badge-shine"
                        style={{
                          background:
                            'linear-gradient(110deg, transparent 28%, rgba(255,255,255,0.55) 50%, transparent 72%)',
                        }}
                      />
                      <motion.span
                        animate={shouldReduceMotion ? undefined : { rotate: 360 }}
                        transition={{
                          duration: 2.8,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                        className="relative z-10 inline-flex items-center justify-center transform-gpu will-change-transform"
                      >
                        <Star className="h-3.5 w-3.5 fill-[#facc15] text-[#facc15] drop-shadow-[0_0_6px_rgba(250,204,21,0.85)]" />
                      </motion.span>
                      <span className="relative z-10">
                        {isHi ? 'पॉपुलर' : 'POPULAR'}
                      </span>
                    </div>
                  )}

                  {/* Floating Top-Border Golden Offer Pill matching screenshot */}
                  {service.goldenOffer && service.badgeTextEn && (
                    <div
                      className="absolute -top-4 left-1/2 -translate-x-1/2 overflow-hidden inline-flex items-center gap-1.5 rounded-full px-5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#1a0d05] whitespace-nowrap ring-2 ring-[#ff2965]/75 shadow-[0_0_20px_rgba(250,204,21,0.45)]"
                      style={{
                        background:
                          'linear-gradient(90deg, #fde047 0%, #f59e0b 100%)',
                      }}
                    >
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 animate-badge-shine"
                        style={{
                          background:
                            'linear-gradient(110deg, transparent 28%, rgba(255,255,255,0.68) 50%, transparent 72%)',
                        }}
                      />
                      <Sparkles className="relative z-10 h-3.5 w-3.5 text-[#92400e]" />
                      <span className="relative z-10">
                        {isHi ? service.badgeTextHi : service.badgeTextEn}
                      </span>
                    </div>
                  )}

                  <div>
                    <h3 className="font-sans-ui text-[20px] sm:text-[22px] font-bold text-white leading-snug">
                      {isHi ? service.titleHi : service.titleEn}
                    </h3>

                    {(isHi ? service.subtitleHi : service.subtitleEn) && (
                      <p className="mt-2 font-sans-ui text-xs sm:text-[13px] text-[#b8b1c2] leading-relaxed">
                        {isHi ? service.subtitleHi : service.subtitleEn}
                      </p>
                    )}

                    {/* Price Display (with Strikethrough + Discount Badge when goldenOffer) */}
                    {service.originalPrice ? (
                      <div className="mt-5 mb-6 flex items-center justify-center gap-3 flex-wrap">
                        <span className="font-sans-ui text-[20px] sm:text-[22px] font-bold text-[#9ca3af] line-through decoration-2 decoration-[#ff4b82]/75 tabular-nums">
                          {service.originalPrice}
                        </span>
                        <span className="font-sans-ui text-[34px] sm:text-[38px] font-extrabold leading-none text-[#facc15] tabular-nums drop-shadow-[0_0_12px_rgba(250,204,21,0.35)]">
                          {service.price}
                        </span>
                        {service.discountLabel && (
                          <span className="font-sans-ui rounded-lg border border-emerald-400/50 bg-emerald-950/65 px-2.5 py-1 text-xs font-bold text-emerald-300 tabular-nums whitespace-nowrap">
                            {service.discountLabel}
                          </span>
                        )}
                      </div>
                    ) : (
                      <p className="mt-4 mb-6 font-sans-ui text-[34px] sm:text-[38px] font-extrabold leading-none text-[#f59e0b] tabular-nums">
                        {service.price}
                      </p>
                    )}
                  </div>

                  {/* Exact Screenshot Button Stack: Solid Green Pay Now + Outlined WhatsApp */}
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => openPayNow(service)}
                      className="font-sans-ui w-full min-h-[48px] rounded-xl bg-[#10b981] px-5 py-3 text-[15px] font-semibold text-white flex items-center justify-center gap-2.5 shadow-[0_6px_20px_rgba(16,185,129,0.28)] transition-all duration-200 hover:bg-[#059669] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 cursor-pointer whitespace-nowrap"
                    >
                      <CreditCard className="h-4 w-4 shrink-0" />
                      <span>{isHi ? 'पे नाउ' : 'Pay Now'}</span>
                    </button>

                    <a
                      href={buildWhatsAppUrl(service)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-sans-ui w-full min-h-[48px] rounded-xl border border-[#10b981]/35 bg-[#0f1714]/90 px-5 py-3 text-[15px] font-semibold text-white flex items-center justify-center gap-2.5 transition-all duration-200 hover:border-[#10b981]/75 hover:bg-[#13221c] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 cursor-pointer whitespace-nowrap"
                    >
                      <MessageCircle className="h-4 w-4 shrink-0 text-white" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 100% Identity Verified Section directly below Our Premium Services */}
        <section
          id="identity"
          className="relative overflow-hidden rounded-3xl border border-white/[0.09] bg-[#120b10]/95 shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
        >
          {/* Top Pink-to-Gold Hairline Rim */}
          <div
            aria-hidden="true"
            className="h-[2.5px] w-full"
            style={{
              background:
                'linear-gradient(90deg, #ff2466 0%, #ff5a4e 52%, #f59e0b 100%)',
            }}
          />

          <div className="px-4 py-8 sm:p-8 text-center">
            {/* Two-Line Playfair Display Heading matching screenshot */}
            <div className="flex flex-col items-center">
              <h2 className="font-display-serif text-[34px] sm:text-[40px] font-bold leading-[1.2] text-white text-balance">
                {isHi ? (
                  <>
                    100% पहचान
                    <br />
                    वेरिफाइड
                  </>
                ) : (
                  <>
                    100% Identity
                    <br />
                    Verified
                  </>
                )}
              </h2>
              <div
                aria-hidden="true"
                className="mt-4 h-[3.5px] w-36 rounded-full"
                style={{
                  background:
                    'linear-gradient(90deg, #ff2466 0%, #ff477e 65%, #f59e0b 100%)',
                  boxShadow: '0 0 12px rgba(255, 36, 102, 0.45)',
                }}
              />
            </div>

            <p className="mx-auto mt-6 mb-7 max-w-md font-sans-ui text-[15px] sm:text-[16px] leading-[1.7] text-[#cfc9d6]">
              {isHi
                ? 'पूर्ण विश्वसनीयता, भरोसे और सुरक्षित बातचीत के लिए ऑफिशियल आईडी वेरिफाइड।'
                : 'Official government ID verified for complete authenticity, trust, and safe interactions.'}
            </p>

            {/* Inner Verification Card Container */}
            <div className="mx-auto max-w-md rounded-2xl border border-white/[0.1] bg-[#170f15]/95 p-4 sm:p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
              <h3 className="font-sans-ui text-[18px] sm:text-[20px] font-bold text-white">
                {isHi ? 'आधार कार्ड वेरिफिकेशन' : 'Aadhaar Card Verification'}
              </h3>

              <div className="mt-4 w-full overflow-hidden rounded-2xl border border-white/[0.1]">
                <img
                  src="/assets/aistudio/file_00000000abd081f48dea7273bd73d7d9.png"
                  alt={isHi ? 'आधार कार्ड वेरिफिकेशन प्रीव्यू' : 'Aadhaar Card Verification'}
                  loading="lazy"
                  decoding="async"
                  className="block w-full h-auto rounded-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Discussion & Reviews Section directly below 100% Identity Verified */}
        <section
          id="reviews"
          className="relative overflow-hidden rounded-3xl border border-white/[0.09] bg-[#120b10]/95 shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
        >
          {/* Top Pink-to-Gold Hairline Rim */}
          <div
            aria-hidden="true"
            className="h-[2.5px] w-full"
            style={{
              background:
                'linear-gradient(90deg, #ff2466 0%, #ff5a4e 52%, #f59e0b 100%)',
            }}
          />

          <div className="px-4 py-8 sm:p-8">
            {/* Two-Line Playfair Display Heading matching screenshot */}
            <div className="flex flex-col items-center text-center mb-8">
              <h2 className="font-display-serif text-[34px] sm:text-[40px] font-bold leading-[1.2] text-white text-balance">
                {isHi ? (
                  <>
                    डिस्कशन और
                    <br />
                    रिव्यूज
                  </>
                ) : (
                  <>
                    Discussion &amp;
                    <br />
                    Reviews
                  </>
                )}
              </h2>
              <div
                aria-hidden="true"
                className="mt-4 h-[3.5px] w-36 rounded-full"
                style={{
                  background:
                    'linear-gradient(90deg, #ff2466 0%, #ff477e 65%, #f59e0b 100%)',
                  boxShadow: '0 0 12px rgba(255, 36, 102, 0.45)',
                }}
              />
            </div>

            {/* Review Composer Card matching screenshot */}
            <form
              onSubmit={handlePostReview}
              className="mx-auto max-w-2xl rounded-2xl border border-white/[0.1] bg-[#170f15]/95 p-4 sm:p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
            >
              <div className="flex items-start gap-3.5">
                <WhiteAvatar accented />

                <div className="flex-1 space-y-2.5">
                  <input
                    type="text"
                    value={newReviewAuthor}
                    onChange={(e) => setNewReviewAuthor(e.target.value)}
                    placeholder={isHi ? 'आपका नाम (वैकल्पिक)' : 'Your name (optional)'}
                    className="w-full min-h-[38px] rounded-xl border border-white/[0.1] bg-[#0d070b]/85 px-3.5 text-xs sm:text-sm text-white placeholder:text-white/35 focus:border-[#ff2965] focus:outline-none"
                  />
                  <textarea
                    rows={3}
                    value={newReviewText}
                    onChange={(e) => {
                      setNewReviewText(e.target.value);
                      if (reviewError) setReviewError('');
                    }}
                    placeholder={
                      isHi
                        ? 'चर्चा में जुड़ें या अपना रिव्यू लिखें...'
                        : 'Join the discussion or leave a review...'
                    }
                    className="w-full rounded-2xl border border-white/[0.12] bg-[#0d070b]/90 p-3.5 text-sm text-white placeholder:text-white/40 focus:border-[#ff2965] focus:outline-none resize-y"
                  />
                </div>
              </div>

              {reviewError && (
                <p className="mt-2 text-right font-sans-ui text-xs text-rose-400">
                  {reviewError}
                </p>
              )}

              <div className="mt-3.5 flex justify-end">
                <button
                  type="submit"
                  className="font-sans-ui inline-flex items-center justify-center rounded-xl bg-[#f41f64] px-6 min-h-[44px] text-sm font-semibold text-white shadow-[0_6px_18px_rgba(244,31,100,0.35)] transition-all duration-150 hover:bg-[#ff3377] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff2965] cursor-pointer whitespace-nowrap"
                >
                  {isHi ? 'रिव्यू पोस्ट करें' : 'Post Review'}
                </button>
              </div>
            </form>

            {/* Comments / Reviews Thread matching screenshot */}
            <div className="mx-auto max-w-2xl mt-7 divide-y divide-white/[0.08]">
              {reviews.slice(0, visibleReviewsCount).map((review) => {
                const isLiked = Boolean(likedIds[review.id]);
                const isReplying = replyingToId === review.id;

                return (
                  <article key={review.id} className="py-5 first:pt-2">
                    <div className="flex items-start gap-3.5">
                      <WhiteAvatar />

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap font-sans-ui">
                          <span className="text-[15px] font-bold text-white">
                            {review.author}
                          </span>
                          <span aria-hidden="true" className="text-[#8e8899]">
                            ·
                          </span>
                          <span className="text-xs text-[#9e98a8]">
                            {isHi ? review.timeHi : review.timeEn}
                          </span>
                        </div>

                        <p className="mt-2 font-sans-ui text-[15px] leading-relaxed text-[#f1eef6]">
                          {review.text}
                        </p>

                        <div className="mt-3 flex items-center gap-4 text-xs font-sans-ui text-[#9e98a8]">
                          <button
                            type="button"
                            onClick={() => handleToggleLike(review.id)}
                            className={`inline-flex items-center gap-1.5 min-h-[34px] px-1.5 rounded-lg transition-colors cursor-pointer ${
                              isLiked
                                ? 'text-[#ff4b82] font-semibold'
                                : 'hover:text-white'
                            }`}
                          >
                            <ThumbsUp className="h-4 w-4" />
                            <span className="tabular-nums">{review.likes}</span>
                          </button>

                          <span aria-hidden="true">·</span>

                          <button
                            type="button"
                            onClick={() => {
                              setReplyingToId(isReplying ? null : review.id);
                              setReplyText('');
                            }}
                            className="inline-flex items-center gap-1.5 min-h-[34px] px-1.5 rounded-lg hover:text-white transition-colors cursor-pointer"
                          >
                            <MessageSquare className="h-3.5 w-3.5" />
                            <span>{isHi ? 'रिप्लाई' : 'Reply'}</span>
                          </button>
                        </div>

                        {/* Nested Replies */}
                        {review.replies && review.replies.length > 0 && (
                          <div className="mt-3 space-y-2 pl-2">
                            {review.replies.map((rep) => (
                              <div
                                key={rep.id}
                                className="rounded-xl bg-white/[0.03] px-3 py-2 text-xs font-sans-ui"
                              >
                                <div className="flex items-center gap-2 text-[#b8b1c2]">
                                  <span className="font-semibold text-white">
                                    {rep.author}
                                  </span>
                                  <span aria-hidden="true">·</span>
                                  <span>{rep.time}</span>
                                </div>
                                <p className="mt-1 text-[#e6e1ee]">{rep.text}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Inline Reply Input */}
                        {isReplying && (
                          <div className="mt-3 flex items-center gap-2">
                            <input
                              type="text"
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder={
                                isHi ? 'रिप्लाई लिखें...' : 'Write a reply...'
                              }
                              className="flex-1 min-h-[40px] rounded-xl border border-white/15 bg-[#0d070b] px-3 text-xs text-white placeholder:text-white/40 focus:border-[#ff2965] focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handlePostReply(review.id)}
                              className="min-h-[40px] rounded-xl bg-[#f41f64] px-4 text-xs font-semibold text-white hover:bg-[#ff3377] cursor-pointer whitespace-nowrap"
                            >
                              {isHi ? 'भेजें' : 'Send'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Load More Comments Button matching screenshot */}
            {visibleReviewsCount < reviews.length && (
              <div className="mt-5 flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisibleReviewsCount(reviews.length)}
                  className="font-sans-ui inline-flex items-center gap-2 rounded-xl border border-white/[0.14] bg-white/[0.05] px-5 min-h-[44px] text-xs sm:text-sm font-semibold text-[#e8e3f0] hover:bg-white/[0.1] hover:text-white active:scale-[0.98] transition-all cursor-pointer"
                >
                  <ChevronDown className="h-4 w-4 text-[#ff6b98]" />
                  <span>
                    {isHi ? 'और कमेंट्स देखें' : 'Load more comments'}
                  </span>
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Bottom Sheet / Modal Overlay */}
      <AnimatePresence>
        {activeSheet && (
          <motion.div
            key="sheet-backdrop"
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.14 }}
            onClick={() => setActiveSheet(null)}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          >
            <motion.div
              key="sheet-panel"
              role="dialog"
              aria-modal="true"
              initial={shouldReduceMotion ? false : { y: 28, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.18, ease: EASE_OUT_EXPO }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full sm:max-w-md rounded-t-[28px] sm:rounded-[28px] shadow-2xl overflow-hidden transform-gpu ${
                activeSheet === 'booking'
                  ? 'bg-white text-slate-900 border border-slate-200/80'
                  : 'border border-white/[0.14] bg-[#140c11] text-white'
              }`}
            >
              {/* Drag Handle for Mobile */}
              <div className="sm:hidden pt-3 pb-1 flex justify-center">
                <div
                  className={`h-1 w-10 rounded-full ${
                    activeSheet === 'booking' ? 'bg-slate-300' : 'bg-white/20'
                  }`}
                />
              </div>

              {activeSheet === 'booking' ? (
                <div className="relative px-5 pt-2 sm:pt-5 pb-2 text-center">
                  <h3 className="font-sans-ui text-[20px] font-bold tracking-tight text-slate-900">
                    {isHi ? 'पेमेंट पूरा करें' : 'Complete Payment'}
                  </h3>
                  <p className="font-sans-ui text-[13px] font-medium text-slate-500 mt-0.5 truncate px-9">
                    {isHi ? selectedService.titleHi : selectedService.titleEn}
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveSheet(null)}
                    aria-label="Close"
                    className="absolute right-4 top-2 sm:top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors cursor-pointer"
                  >
                    <X className="h-4.5 w-4.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between px-5 pt-3 sm:pt-5 pb-3 border-b border-white/[0.08]">
                  <h3 className="font-display-serif text-xl font-bold text-white">
                    {activeSheet === 'menu' && (isHi ? 'नेविगेशन' : 'Quick Menu')}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveSheet(null)}
                    aria-label="Close"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#b8b4c0] hover:bg-white/10 hover:text-white cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}

              <div
                className={
                  activeSheet === 'booking'
                    ? 'px-5 pt-2 pb-6 max-h-[82dvh] overflow-y-auto'
                    : 'p-5 max-h-[75dvh] overflow-y-auto'
                }
              >
                {/* Clean White BharatPe UPI QR Checkout Sheet */}
                {activeSheet === 'booking' && (
                  <BookingCheckoutContent
                    service={selectedService}
                    isHi={isHi}
                    onClose={() => setActiveSheet(null)}
                  />
                )}

                {/* Quick Menu Sheet */}
                {activeSheet === 'menu' && (
                  <div className="space-y-2">
                    {[
                      { label: isHi ? 'मेरे बारे में (About Me)' : 'About Me', href: '#about' },
                      {
                        label: isHi ? 'प्रीमियम सर्विसेज' : 'Our Premium Services',
                        href: '#services',
                      },
                      {
                        label: isHi ? '100% पहचान वेरिफाइड' : '100% Identity Verified',
                        href: '#identity',
                      },
                      {
                        label: isHi ? 'डिस्कशन और रिव्यूज' : 'Discussion & Reviews',
                        href: '#reviews',
                      },
                    ].map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        onClick={() => setActiveSheet(null)}
                        className="flex min-h-[46px] items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 text-sm font-medium text-white hover:bg-white/[0.08]"
                      >
                        <span>{link.label}</span>
                        <ArrowRight className="h-4 w-4 text-[#ff6b98]" />
                      </a>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveSheet(null);
                        onBackToWelcome();
                      }}
                      className="flex w-full min-h-[46px] items-center justify-between rounded-xl border border-[#8e5c15]/50 bg-[#1e1206]/60 px-4 text-sm font-medium text-[#fbbf24] hover:bg-[#2c1a08] cursor-pointer"
                    >
                      <span>{isHi ? 'फ्रंट पेज दोबारा देखें' : 'Replay Welcome Front Page'}</span>
                      <FlameLogo size={18} />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
