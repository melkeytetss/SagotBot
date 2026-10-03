export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface CallTranscriptTurn {
  speaker: "bot" | "caller";
  text: string;
  timestamp: string;
}

export interface CallRecord {
  id: string;
  caller: string;
  phone: string;
  time: string;
  duration: string;
  intent: string;
  language: string;
  booked: boolean;
  appointmentTime: string;
  summary: string;
  transcripts: CallTranscriptTurn[];
}

export interface AppointmentRecord {
  id: string;
  clientName: string;
  clientPhone: string;
  service: string;
  staffOrLocation: string;
  time: string;
  date: string;
  status: "confirmed" | "completed" | "rescheduled";
  origin: "AI Phone Call" | "Manual Entry";
}

export interface IndustryPreset {
  id: "studio" | "salon" | "restaurant" | "clinic";
  name: string;
  categoryName: string;
  businessName: string;
  location: string;
  adminName: string;
  adminRole: string;
  clientLabel: string;
  staffLabel: string;
  bookingType: string;
  greeting: string;
  forwardingPhone: string;
  hours: { day: string; open: string; close: string; active: boolean }[];
  faqs: FAQItem[];
  quickTestChips: string[];
  calls: CallRecord[];
  appointments: AppointmentRecord[];
}

export const INDUSTRY_PRESETS: Record<IndustryPreset["id"], IndustryPreset> = {
  studio: {
    id: "studio",
    name: "Studio & Professional Services",
    categoryName: "Design & Consulting",
    businessName: "Apex Design & Creative Studio",
    location: "BGC, Taguig City",
    adminName: "Rafael Ramos",
    adminRole: "Studio Principal",
    clientLabel: "Client",
    staffLabel: "Consultant / Lead",
    bookingType: "Consultation",
    forwardingPhone: "+63 917 555 0192",
    greeting:
      "Magandang araw po! Salamat sa pagtawag sa Apex Studio. Ako po si Sarah, ang virtual receptionist. Paano po kami makakatulong sa inyong project inquiry o consultation schedule?",
    hours: [
      { day: "Monday", open: "09:00", close: "18:00", active: true },
      { day: "Tuesday", open: "09:00", close: "18:00", active: true },
      { day: "Wednesday", open: "09:00", close: "18:00", active: true },
      { day: "Thursday", open: "09:00", close: "18:00", active: true },
      { day: "Friday", open: "09:00", close: "18:00", active: true },
      { day: "Saturday", open: "10:00", close: "15:00", active: false },
      { day: "Sunday", open: "10:00", close: "14:00", active: false },
    ],
    faqs: [
      {
        id: "faq-s1",
        question: "Magkano po ang initial project consultation?",
        answer: "Ang 45-minute discovery consultation po ay ₱1,500 at creditable po ito kapag nag-proceed kayo sa full proposal.",
        category: "Pricing",
      },
      {
        id: "faq-s2",
        question: "Nasaan po ang inyong physical office?",
        answer: "Nasa 18th Floor po kami ng High Street South Corporate Plaza, BGC. Available din po kami for Google Meet video calls.",
        category: "Location",
      },
      {
        id: "faq-s3",
        question: "Gaano katagal bago matapos ang isang branding package?",
        answer: "Karaniwan po 3 to 4 weeks para sa full brand identity and design system guidelines.",
        category: "Services",
      },
    ],
    quickTestChips: [
      "Magkano consultation fee?",
      "Nasaan office niyo sa BGC?",
      "Available ba si lead designer bukas?",
      "Tumatanggap ba kayo ng rush projects?",
    ],
    calls: [
      {
        id: "call-s1",
        caller: "Maria Clara Santos",
        phone: "+63 917 555 0192",
        time: "Today, 2:15 PM",
        duration: "1m 30s",
        intent: "Brand Identity Consultation",
        language: "Taglish",
        booked: true,
        appointmentTime: "Tomorrow, 2:00 PM - 2:45 PM",
        summary: "Client inquired about branding rates and available slots with the lead strategist. Booked 2:00 PM discovery call.",
        transcripts: [
          { speaker: "bot", text: "Magandang hapon po! Apex Studio, Sarah speaking. Paano po ako makakatulong?", timestamp: "00:03" },
          { speaker: "caller", text: "Hi, magtatanong lang kung magkano initial consultation para sa new brand launch?", timestamp: "00:10" },
          { speaker: "bot", text: "Ang discovery session po ay ₱1,500 for 45 minutes, creditable kapag nag-proceed sa project. May available slot po bukas ng 2:00 PM at 4:00 PM. Alin po mas convenient?", timestamp: "00:22" },
          { speaker: "caller", text: "Yung 2:00 PM po sana, under Maria Clara.", timestamp: "00:34" },
          { speaker: "bot", text: "Confirmed na po, Ma'am Maria! Tomorrow, 2:00 PM with our creative lead. Nag-send na po kami ng Google Calendar invite at SMS confirmation.", timestamp: "00:48" },
        ],
      },
      {
        id: "call-s2",
        caller: "Carlos Gutierrez",
        phone: "+63 918 223 9910",
        time: "Today, 11:20 AM",
        duration: "1m 12s",
        intent: "Website Redesign Scoping",
        language: "Taglish",
        booked: true,
        appointmentTime: "Friday, 10:00 AM - 10:45 AM",
        summary: "Inquired about timeline for SaaS landing page redesign. Scheduled project scoping session for Friday.",
        transcripts: [
          { speaker: "bot", text: "Magandang araw po! Apex Studio, paano po makakatulong?", timestamp: "00:02" },
          { speaker: "caller", text: "Hello, naghahanap kami ng agency para sa website redesign. Gaano kabilis ang turnaround?", timestamp: "00:09" },
          { speaker: "bot", text: "Karaniwan po 3 to 4 weeks depende sa scope. Mainam po na mag-scoping call tayo. Available po ang design lead sa Friday 10:00 AM.", timestamp: "00:25" },
          { speaker: "caller", text: "Sige, i-book mo ako Friday 10 AM.", timestamp: "00:35" },
          { speaker: "bot", text: "Naka-reserve na po for Friday 10:00 AM under Carlos Gutierrez. Maraming salamat po!", timestamp: "00:46" },
        ],
      },
    ],
    appointments: [
      {
        id: "apt-s1",
        clientName: "Maria Clara Santos",
        clientPhone: "+63 917 555 0192",
        service: "Brand Strategy Discovery",
        staffOrLocation: "Rafael Ramos (Principal)",
        time: "2:00 PM - 2:45 PM",
        date: "Tomorrow, Friday",
        status: "confirmed",
        origin: "AI Phone Call",
      },
      {
        id: "apt-s2",
        clientName: "Carlos Gutierrez",
        clientPhone: "+63 918 223 9910",
        service: "Website Redesign Scoping",
        staffOrLocation: "Studio Boardroom & Meet",
        time: "10:00 AM - 10:45 AM",
        date: "Friday, Oct 3",
        status: "confirmed",
        origin: "AI Phone Call",
      },
    ],
  },

  salon: {
    id: "salon",
    name: "Salon & Aesthetics Lounge",
    categoryName: "Beauty & Wellness",
    businessName: "Glow & Glam Beauty Lounge",
    location: "Ayala Malls the 30th, Pasig City",
    adminName: "Marian Rivera",
    adminRole: "Salon Owner",
    clientLabel: "Customer",
    staffLabel: "Senior Stylist",
    bookingType: "Appointment",
    forwardingPhone: "+63 917 882 3311",
    greeting:
      "Magandang araw po! Welcome sa Glow & Glam Beauty Lounge. Ako po si Sarah, ang virtual receptionist. Paano po ako makakatulong sa inyong hair treatment o salon appointment ngayon?",
    hours: [
      { day: "Monday", open: "10:00", close: "21:00", active: true },
      { day: "Tuesday", open: "10:00", close: "21:00", active: true },
      { day: "Wednesday", open: "10:00", close: "21:00", active: true },
      { day: "Thursday", open: "10:00", close: "21:00", active: true },
      { day: "Friday", open: "10:00", close: "21:00", active: true },
      { day: "Saturday", open: "10:00", close: "21:00", active: true },
      { day: "Sunday", open: "10:00", close: "21:00", active: true },
    ],
    faqs: [
      {
        id: "faq-b1",
        question: "Kailangan po ba ng advance reservation para sa Balayage o Rebond?",
        answer: "Opo, dahil 3 to 4 hours po ang procedure, inirerekomenda po ang advance reservation para masigurado ang dedicated stylist.",
        category: "Reservations",
      },
      {
        id: "faq-b2",
        question: "May weekday discounts o promo po ba?",
        answer: "Meron po! 15% off sa Haircut + Keratin combo kapag Tuesday to Thursday mula 11:00 AM hanggang 3:00 PM.",
        category: "Promos",
      },
      {
        id: "faq-b3",
        question: "Pwede po ba walk-in?",
        answer: "Tumatanggap po kami ng walk-ins subject to stylist availability, pero priority po ang naka-book online o sa telepono.",
        category: "Policy",
      },
    ],
    quickTestChips: [
      "Magkano Balayage and Keratin?",
      "May promo ba ngayong weekday?",
      "Available ba si Senior Stylist bukas?",
      "Pwedeng magpa-book ng 4 PM bukas?",
    ],
    calls: [
      {
        id: "call-b1",
        caller: "Bea Alonzo",
        phone: "+63 917 882 3311",
        time: "Today, 3:45 PM",
        duration: "1m 40s",
        intent: "Keratin Treatment & Haircut",
        language: "Taglish",
        booked: true,
        appointmentTime: "Saturday, 1:00 PM - 3:30 PM",
        summary: "Inquired about weekday combo promo vs weekend slots. Booked Saturday 1:00 PM Keratin package.",
        transcripts: [
          { speaker: "bot", text: "Magandang hapon po! Glow & Glam Beauty Lounge, Sarah speaking. Paano po makakatulong?", timestamp: "00:02" },
          { speaker: "caller", text: "Hello po! May available ba for Keratin treatment sa Saturday afternoon?", timestamp: "00:10" },
          { speaker: "bot", text: "Meron po! Saturday 1:00 PM at 4:30 PM po available ang ating senior stylist. Ang full Keratin package po starts at ₱4,000.", timestamp: "00:24" },
          { speaker: "caller", text: "Paki-book po yung 1:00 PM under Bea Alonzo.", timestamp: "00:36" },
          { speaker: "bot", text: "Naka-reserve na po kayo this Saturday 1:00 PM, Ma'am Bea! Nag-send po kami ng confirmation text. See you po!", timestamp: "00:50" },
        ],
      },
    ],
    appointments: [
      {
        id: "apt-b1",
        clientName: "Bea Alonzo",
        clientPhone: "+63 917 882 3311",
        service: "Keratin Treatment & Blowdry",
        staffOrLocation: "Senior Stylist Jane",
        time: "1:00 PM - 3:30 PM",
        date: "Saturday, Oct 4",
        status: "confirmed",
        origin: "AI Phone Call",
      },
    ],
  },

  restaurant: {
    id: "restaurant",
    name: "Restaurant & Cafe",
    categoryName: "Food & Hospitality",
    businessName: "Lutong Bahay Bistro",
    location: "Timog Avenue, Quezon City",
    adminName: "Chef Antonio Perez",
    adminRole: "General Manager",
    clientLabel: "Guest",
    staffLabel: "Table / Section",
    bookingType: "Table Reservation",
    forwardingPhone: "+63 918 333 4455",
    greeting:
      "Magandang araw po! Salamat sa pagtawag sa Lutong Bahay Bistro. Ako po si Sarah. Gusto niyo po bang magpa-reserve ng table, mag-advance order, o may questions po sa menu?",
    hours: [
      { day: "Monday", open: "11:00", close: "22:00", active: false },
      { day: "Tuesday", open: "11:00", close: "22:00", active: true },
      { day: "Wednesday", open: "11:00", close: "22:00", active: true },
      { day: "Thursday", open: "11:00", close: "22:00", active: true },
      { day: "Friday", open: "11:00", close: "23:00", active: true },
      { day: "Saturday", open: "11:00", close: "23:00", active: true },
      { day: "Sunday", open: "11:00", close: "21:00", active: true },
    ],
    faqs: [
      {
        id: "faq-r1",
        question: "May parking space po ba sa restaurant?",
        answer: "Opo, may dedicated customer parking po kami sa harap at likod ng restaurant with security guards.",
        category: "Amenities",
      },
      {
        id: "faq-r2",
        question: "May corkage fee po ba kapag nagdala ng birthday cake?",
        answer: "Wala pong corkage fee para sa birthday cakes. Libre din po naming ihahain with candles.",
        category: "Policies",
      },
      {
        id: "faq-r3",
        question: "Pet friendly po ba ang inyong restaurant?",
        answer: "Opo! Pet-friendly po ang aming al fresco garden dining area. Welcome po ang pets basta on leash.",
        category: "Amenities",
      },
    ],
    quickTestChips: [
      "May table for 6 bukas ng 7 PM?",
      "May parking ba kayo sa Timog?",
      "Pet friendly ba outdoor area niyo?",
      "May corkage fee ba birthday cake?",
    ],
    calls: [
      {
        id: "call-r1",
        caller: "Juan Dela Cruz",
        phone: "+63 918 223 9910",
        time: "Today, 1:15 PM",
        duration: "1m 15s",
        intent: "Dinner Table Reservation",
        language: "Taglish",
        booked: true,
        appointmentTime: "Tomorrow, 7:00 PM",
        summary: "Reserved dining table for 6 guests for family celebration. Confirmed parking and zero corkage for cake.",
        transcripts: [
          { speaker: "bot", text: "Magandang hapon po! Lutong Bahay Bistro, Sarah speaking. Paano po makakatulong?", timestamp: "00:02" },
          { speaker: "caller", text: "Magpapa-reserve sana ako ng table for 6 bukas ng gabi, 7:00 PM.", timestamp: "00:11" },
          { speaker: "bot", text: "Available po ang indoor dining table for 6 bukas, Friday at 7:00 PM! May birthday celebration po ba?", timestamp: "00:23" },
          { speaker: "caller", text: "Opo, magdadala kami ng cake. May parking ba kayo?", timestamp: "00:32" },
          { speaker: "bot", text: "May dedicated free parking po tayo at zero corkage po ang cake. Naka-reserve na po under Mr. Juan Dela Cruz for 6 guests!", timestamp: "00:48" },
        ],
      },
    ],
    appointments: [
      {
        id: "apt-r1",
        clientName: "Juan Dela Cruz (Party of 6)",
        clientPhone: "+63 918 223 9910",
        service: "Dinner Table Reservation (6 Pax)",
        staffOrLocation: "Main Dining Room Table 12",
        time: "7:00 PM - 9:00 PM",
        date: "Tomorrow, Friday",
        status: "confirmed",
        origin: "AI Phone Call",
      },
    ],
  },

  clinic: {
    id: "clinic",
    name: "Dental & Health Clinic",
    categoryName: "Healthcare & Dental",
    businessName: "Smiles Dental Clinic - BGC",
    location: "High Street South, BGC, Taguig",
    adminName: "Dr. Reyes, DMD",
    adminRole: "Lead Dental Surgeon",
    clientLabel: "Patient",
    staffLabel: "Attending Doctor",
    bookingType: "Appointment",
    forwardingPhone: "+63 917 123 4567",
    greeting:
      "Magandang araw po! Salamat sa pagtawag sa Smiles Dental Clinic BGC. Ako po si Sarah, ang inyong AI receptionist. Paano po ako makakatulong sa inyong checkup o appointment schedule ngayon?",
    hours: [
      { day: "Monday", open: "09:00", close: "18:00", active: true },
      { day: "Tuesday", open: "09:00", close: "18:00", active: true },
      { day: "Wednesday", open: "09:00", close: "18:00", active: true },
      { day: "Thursday", open: "09:00", close: "18:00", active: true },
      { day: "Friday", open: "09:00", close: "18:00", active: true },
      { day: "Saturday", open: "09:00", close: "17:00", active: true },
      { day: "Sunday", open: "10:00", close: "16:00", active: false },
    ],
    faqs: [
      {
        id: "faq-c1",
        question: "Tumatanggap po ba kayo ng Maxicare or Medicard?",
        answer: "Opo! Accredited po ang Smiles Dental sa Maxicare, Medicard, at Intellicare. Dalhin lang po ang inyong physical HMO card at valid ID.",
        category: "HMO",
      },
      {
        id: "faq-c2",
        question: "Magkano po ang regular oral prophylaxis (cleaning)?",
        answer: "Ang regular teeth cleaning po ay nagsisimula sa ₱1,500 kasama na ang comprehensive oral examination.",
        category: "Pricing",
      },
      {
        id: "faq-c3",
        question: "Saan po ang exact clinic address niyo sa BGC?",
        answer: "Nasa 3rd Floor po kami ng High Street South Corporate Plaza, 26th Street corner 9th Avenue, BGC, Taguig. May basement parking po.",
        category: "Location",
      },
    ],
    quickTestChips: [
      "Tumatanggap ba kayo ng Maxicare?",
      "Magkano regular teeth cleaning?",
      "Bukas ba kayo ng Saturday?",
      "May available slot ba bukas ng 2 PM?",
    ],
    calls: [
      {
        id: "call-c1",
        caller: "Maria Clara Santos",
        phone: "+63 917 555 0192",
        time: "Today, 2:15 PM",
        duration: "1m 45s",
        intent: "Teeth Cleaning (Oral Prophylaxis)",
        language: "Taglish",
        booked: true,
        appointmentTime: "Tomorrow, 2:00 PM - 2:45 PM",
        summary: "Inquired about cleaning pricing and Maxicare HMO approval. Confirmed Friday 2:00 PM slot with Dr. Reyes.",
        transcripts: [
          { speaker: "bot", text: "Magandang hapon po! Smiles Dental Clinic BGC, Sarah speaking. Paano po makakatulong?", timestamp: "00:03" },
          { speaker: "caller", text: "Hi, magtatanong lang kung magkano magpalinis ng ngipin at kung covered ng Maxicare?", timestamp: "00:12" },
          { speaker: "bot", text: "Opo, accredited po tayo sa Maxicare! Covered po ang regular oral prophylaxis. May available slot po bukas ng 2:00 PM si Doc Reyes.", timestamp: "00:28" },
          { speaker: "caller", text: "Sige po, i-book niyo po ako 2:00 PM under Maria Clara Santos.", timestamp: "00:40" },
          { speaker: "bot", text: "Naka-schedule na po kayo bukas 2:00 PM! Nag-send na po kami ng SMS reminder. Maraming salamat po!", timestamp: "00:54" },
        ],
      },
    ],
    appointments: [
      {
        id: "apt-c1",
        clientName: "Maria Clara Santos",
        clientPhone: "+63 917 555 0192",
        service: "Oral Prophylaxis (Cleaning)",
        staffOrLocation: "Dr. Reyes, DMD",
        time: "2:00 PM - 2:45 PM",
        date: "Tomorrow, Friday",
        status: "confirmed",
        origin: "AI Phone Call",
      },
    ],
  },
};
