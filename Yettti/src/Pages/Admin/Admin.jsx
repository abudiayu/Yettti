import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import styles from "./Admin.module.css";

/* ------------------------------------------------------------------ */
/*  Small helpers                                                      */
/* ------------------------------------------------------------------ */
const cx = (...a) => a.filter(Boolean).join(" ");
const pad = (n) => String(n).padStart(2, "0");
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};
const fmtDate = (s) => {
  const d = new Date(`${s}T00:00:00`);
  return Number.isNaN(d.getTime()) ? "-" : `${pad(d.getDate())} ${MONTHS[d.getMonth()]}, ${d.getFullYear()}`;
};
const money = (n) => `$${Number(n || 0).toLocaleString("en-US")}`;
const initials = (name = "") =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
let _id = 1;
const uid = () => `${Date.now().toString(36)}-${(_id++).toString(36)}`;

/* Local preview URLs (object URLs) – created and revoked here only */
const blobUrls = new Set();
const makePreview = (file) => {
  const url = URL.createObjectURL(file);
  blobUrls.add(url);
  return url;
};
const releasePreview = (url) => {
  if (url && blobUrls.has(url)) {
    URL.revokeObjectURL(url);
    blobUrls.delete(url);
  }
};

/* Generated placeholder artwork so the mock data needs no image files */
const art = (label, a, b) => {
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='640' height='420' viewBox='0 0 640 420'>` +
    `<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${a}'/><stop offset='1' stop-color='${b}'/></linearGradient></defs>` +
    `<rect width='640' height='420' fill='url(#g)'/>` +
    `<circle cx='540' cy='70' r='120' fill='rgba(255,255,255,.14)'/><circle cx='80' cy='390' r='150' fill='rgba(255,255,255,.1)'/>` +
    `<text x='50%' y='54%' text-anchor='middle' font-family='Inter,Arial,sans-serif' font-size='42' font-weight='700' fill='white'>${label}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};
const img = (label, a, b) => ({ id: uid(), kind: "image", url: art(label, a, b), name: `${label}.svg` });
/* Public sample clip, only used for the mock video items */
const SAMPLE_VIDEO = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";
const vid = (name) => ({ id: uid(), kind: "video", url: SAMPLE_VIDEO, name });

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */
const createSeed = () => ({
  donations: [
    ["Clean Water Well Project", "Nile Foundation", 12500, 4, "Received", "Funds to drill and equip a protected community well serving about 300 households.", img("Clean Water", "#299cdb", "#4b38b3")],
    ["School Supplies Drive", "Hana Bekele", 1800, 9, "Received", "Notebooks, pens and school bags for 150 students at the start of the term.", img("School Supplies", "#ffbe0b", "#f06548")],
    ["Winter Blankets Campaign", "GreenRoots Co-op", 3200, 15, "Allocated", "Warm blankets for elderly neighbours and families in the highlands.", img("Blankets", "#4b38b3", "#299cdb")],
    ["Family Food Packages", "Samuel Tesfaye", 950, 22, "Pending", "Monthly food packages (flour, oil, lentils) for ten families.", img("Food Packages", "#3fcb80", "#299cdb")],
    ["Medical Outreach Fund", "Wollo Health Alliance", 7400, 38, "Received", "Mobile clinic visits, basic medicines and vaccination days.", img("Medical Outreach", "#f06548", "#4b38b3")],
    ["Teacher Training Grant", "BrightFuture Schools", 5200, 61, "Allocated", "Workshops that train 40 local teachers in modern classroom methods.", img("Teacher Training", "#4b38b3", "#3fcb80")],
    ["Solar Lamps for Homes", "Amhara Tech Hub", 2100, 88, "Received", "Solar lamps so children can study after dark.", img("Solar Lamps", "#ffbe0b", "#3fcb80")],
    ["Library Books Donation", "Meron Alemu", 640, 120, "Pending", "A starter collection of Amharic and English books for the community library.", img("Library Books", "#299cdb", "#f06548")],
  ].map(([title, donor, amount, age, status, description, m]) => ({
    id: uid(), title, donor, amount, date: daysAgo(age), status, description, media: [m],
  })),

  partners: [
    ["Nile Foundation", "Community", "https://nilefoundation.org", "hello@nilefoundation.org", "Active", "#4b38b3", "#299cdb"],
    ["BrightFuture Schools", "Education", "https://brightfuture.edu", "partners@brightfuture.edu", "Active", "#ffbe0b", "#f06548"],
    ["Wollo Health Alliance", "Health", "https://wollohealth.org", "info@wollohealth.org", "Active", "#3fcb80", "#299cdb"],
    ["GreenRoots Co-op", "Community", "https://greenroots.coop", "team@greenroots.coop", "Inactive", "#3fcb80", "#4b38b3"],
    ["Amhara Tech Hub", "Technology", "https://amharatech.io", "contact@amharatech.io", "Active", "#299cdb", "#4b38b3"],
    ["Hope Media Group", "Media", "https://hopemedia.net", "press@hopemedia.net", "Active", "#f06548", "#ffbe0b"],
    ["Blue Crescent Aid", "Health", "https://bluecrescent.org", "aid@bluecrescent.org", "Active", "#299cdb", "#3fcb80"],
    ["Summit Builders", "Community", "https://summitbuilders.com", "projects@summitbuilders.com", "Inactive", "#4b38b3", "#f06548"],
  ].map(([name, category, website, email, status, c1, c2]) => ({
    id: uid(), name, category, website, email, status, media: [img(initials(name), c1, c2)],
  })),

  families: [
    ["Kedir Family", "Dessie", 6, "Supported", "A family of six rebuilding after the loss of their home. With community support the roof was repaired and the children are back in school.", [img("Kedir 1", "#4b38b3", "#299cdb"), img("Kedir 2", "#299cdb", "#3fcb80"), vid("kedir-visit.mp4")]],
    ["Almaz Family", "Kombolcha", 4, "Supported", "A single mother and her three children received food packages and a small start-up grant for a bakery.", [img("Almaz 1", "#f06548", "#ffbe0b"), img("Almaz 2", "#ffbe0b", "#3fcb80")]],
    ["Bekele Family", "Haik", 5, "In Review", "Application received. A volunteer visit is scheduled to assess housing and schooling needs.", [img("Bekele 1", "#3fcb80", "#4b38b3")]],
    ["Tadesse Family", "Dessie", 7, "Graduated", "After two years of support the family is now self-sufficient and mentors newly supported families.", [img("Tadesse 1", "#4b38b3", "#f06548"), img("Tadesse 2", "#299cdb", "#4b38b3"), img("Tadesse 3", "#3fcb80", "#ffbe0b"), vid("tadesse-story.mp4")]],
    ["Mohammed Family", "Woldia", 3, "Supported", "Support covers winter blankets, medical checkups and school fees for two children.", [img("Mohammed 1", "#ffbe0b", "#4b38b3")]],
    ["Selam Family", "Kemise", 5, "In Review", "Referred by a local teacher. Documents are being collected before the first home visit.", [img("Selam 1", "#f06548", "#299cdb")]],
  ].map(([name, location, members, status, story, media]) => ({ id: uid(), name, location, members, status, story, media })),

  friends: [
    ["A message from Hana", "Hana Bekele", "Volunteering with this community changed how I see giving. Every small act adds up to something much bigger.", []],
    ["Opening day at the new well", "Samuel Tesfaye", "Neighbours gathered to celebrate clean water arriving in the village for the very first time.", [img("New Well", "#299cdb", "#3fcb80")]],
    ["Classroom stories", "Meron Alemu", "A short look inside a classroom stocked with the new supplies.", [vid("classroom-stories.mp4")]],
    ["Why I became a friend", "Yonas Girma", "I started by donating once. Now I help organise the monthly food packages with my colleagues.", []],
    ["Books for every child", "Ruth Mekonnen", "Our reading corner opened with 300 books. The kids already asked for more!", [img("Reading Corner", "#ffbe0b", "#f06548")]],
    ["Winter outreach day", "Dawit Haile", "Volunteers delivering blankets to families across three villages.", [img("Outreach Day", "#4b38b3", "#299cdb")]],
    ["Thank you, friends", "Yetti Team", "A video message to everyone who stood with us this year.", [vid("thank-you.mp4")]],
  ].map(([title, author, text, media]) => ({ id: uid(), title, author, text, media })),

  announcements: [
    ["Annual Charity Dinner", "Event", 3, "Published", "Join us for an evening of food, music and stories. All proceeds support the family fund.", [img("Charity Dinner", "#4b38b3", "#f06548")]],
    ["Winter Blanket Campaign Opens", "Campaign", 8, "Published", "We are collecting blankets and warm clothing until the end of next month.", [img("Winter Campaign", "#299cdb", "#4b38b3")]],
    ["New Partner: Blue Crescent Aid", "News", 14, "Published", "We welcome Blue Crescent Aid as a health partner for our mobile clinics.", [img("New Partner", "#3fcb80", "#299cdb"), vid("partner-welcome.mp4")]],
    ["Volunteer Orientation Day", "Event", 20, "Draft", "A short orientation for new volunteers, covering safety, visits and communication.", [img("Orientation", "#ffbe0b", "#3fcb80")]],
    ["Platform Update: Family Stories", "Update", 31, "Published", "Family stories now support multiple photos and videos.", [img("Platform Update", "#f06548", "#ffbe0b")]],
    ["Year-End Giving Appeal", "Campaign", 45, "Draft", "Draft appeal for the year-end giving season. Waiting for final figures.", []],
  ].map(([title, topic, age, status, description, media]) => ({ id: uid(), title, topic, date: daysAgo(age), status, description, media })),

  users: [
    ["Abel Worku", "abel.worku@gmail.com", 2, "Active"],
    ["Bethlehem Assefa", "bethlehem.assefa@yahoo.com", 5, "Active"],
    ["Chala Negash", "chala.negash@outlook.com", 7, "Pending"],
    ["Dagmawit Fikru", "dagmawit.fikru@gmail.com", 11, "Active"],
    ["Eyob Mulugeta", "eyob.mulugeta@gmail.com", 16, "Active"],
    ["Fatuma Ahmed", "fatuma.ahmed@hotmail.com", 19, "Suspended"],
    ["Getachew Lemma", "getachew.lemma@gmail.com", 24, "Active"],
    ["Helen Tsegaye", "helen.tsegaye@gmail.com", 29, "Pending"],
    ["Ibrahim Yusuf", "ibrahim.yusuf@yahoo.com", 36, "Active"],
    ["Jemal Seid", "jemal.seid@gmail.com", 44, "Active"],
    ["Kidist Tadesse", "kidist.tadesse@outlook.com", 52, "Active"],
    ["Liya Berhanu", "liya.berhanu@gmail.com", 63, "Suspended"],
    ["Mulu Desta", "mulu.desta@gmail.com", 78, "Active"],
    ["Nahom Kebede", "nahom.kebede@yahoo.com", 95, "Active"],
    ["Rahel Tilahun", "rahel.tilahun@gmail.com", 118, "Active"],
    ["Selamawit Gebre", "selamawit.gebre@gmail.com", 140, "Pending"],
  ].map(([name, email, age, status], i) => ({ id: `U-${1001 + i}`, name, email, date: daysAgo(age), status })),
});

/* ------------------------------------------------------------------ */
/*  Section configuration (forms)                                      */
/* ------------------------------------------------------------------ */
const SECTIONS = {
  donations: {
    label: "Donation",
    fields: [
      { name: "title", label: "Title", type: "text", required: true, span: 2 },
      { name: "donor", label: "Donor name", type: "text", required: true },
      { name: "amount", label: "Amount (USD)", type: "number", required: true, min: 1 },
      { name: "date", label: "Date", type: "date", required: true },
      { name: "status", label: "Status", type: "select", options: ["Received", "Pending", "Allocated"] },
      { name: "description", label: "Description", type: "textarea", span: 2 },
    ],
    media: { mode: "single", accept: "image/*", label: "Donation image" },
  },
  partners: {
    label: "Partner",
    fields: [
      { name: "name", label: "Partner name", type: "text", required: true, span: 2 },
      { name: "category", label: "Category", type: "select", options: ["Community", "Education", "Health", "Technology", "Media"] },
      { name: "status", label: "Status", type: "select", options: ["Active", "Inactive"] },
      { name: "website", label: "Website", type: "url" },
      { name: "email", label: "Contact email", type: "email" },
    ],
    media: { mode: "single", accept: "image/*", label: "Partner logo" },
  },
  families: {
    label: "Family",
    fields: [
      { name: "name", label: "Family name", type: "text", required: true },
      { name: "location", label: "Location", type: "text", required: true },
      { name: "members", label: "Family members", type: "number", required: true, min: 1 },
      { name: "status", label: "Status", type: "select", options: ["Supported", "In Review", "Graduated"] },
      { name: "story", label: "Family information / story", type: "textarea", required: true, span: 2 },
    ],
    media: { mode: "multi", accept: "image/*,video/*", label: "Family images & videos" },
  },
  friends: {
    label: "Friends content",
    needsContent: true,
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "author", label: "Friend / author", type: "text", required: true },
      { name: "text", label: "Text content", type: "textarea", span: 2 },
    ],
    media: { mode: "single", accept: "image/*,video/*", label: "Image or video" },
  },
  announcements: {
    label: "Announcement",
    fields: [
      { name: "title", label: "Title", type: "text", required: true, span: 2 },
      { name: "topic", label: "Topic", type: "select", options: ["Event", "Campaign", "News", "Update"] },
      { name: "status", label: "Status", type: "select", options: ["Published", "Draft"] },
      { name: "date", label: "Date", type: "date", required: true },
      { name: "description", label: "Description", type: "textarea", required: true, span: 2 },
    ],
    media: { mode: "multi", accept: "image/*,video/*", label: "Images & videos" },
  },
};

const NAV = [
  { group: "Menu", items: [{ key: "overview", label: "Dashboard Overview", icon: "dashboard" }] },
  {
    group: "Content",
    items: [
      { key: "donations", label: "Donations", icon: "heart" },
      { key: "partners", label: "Partners", icon: "briefcase" },
      { key: "families", label: "Families", icon: "home" },
      { key: "friends", label: "Friends", icon: "users" },
      { key: "announcements", label: "Announcements", icon: "megaphone" },
    ],
  },
  { group: "Management", items: [{ key: "users", label: "Registered Users", icon: "user" }] },
  { group: "Account", items: [{ key: "settings", label: "Account Settings", icon: "settings" }] },
];
const TITLES = {
  overview: "Dashboard Overview",
  donations: "Donations",
  partners: "Partners",
  families: "Families",
  friends: "Friends",
  announcements: "Announcements",
  users: "Registered Users",
  settings: "Account Settings",
};

const STATUS_TONE = {
  Received: "success", Pending: "warning", Allocated: "info",
  Active: "success", Inactive: "neutral", Suspended: "danger",
  Supported: "success", "In Review": "warning", Graduated: "primary",
  Published: "success", Draft: "warning",
  Event: "primary", Campaign: "info", News: "success", Update: "warning",
};
const BADGE = {
  success: styles.bSuccess, warning: styles.bWarning, danger: styles.bDanger,
  info: styles.bInfo, primary: styles.bPrimary, neutral: styles.bNeutral,
};
const TONE = {
  primary: styles.tonePrimary, blue: styles.toneBlue, green: styles.toneGreen,
  yellow: styles.toneYellow, red: styles.toneRed,
};

/* ------------------------------------------------------------------ */
/*  Icons                                                              */
/* ------------------------------------------------------------------ */
const ICONS = {
  dashboard: <><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></>,
  heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" />,
  briefcase: <><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></>,
  home: <><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></>,
  users: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" /><path d="M16 4.5a3.5 3.5 0 0 1 0 7" /><path d="M18 14.3c2.3.7 3.5 2.6 3.5 5.7" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" /></>,
  megaphone: <><path d="M3 11v3a1 1 0 0 0 1 1h3l8 4V6L7 10H4a1 1 0 0 0-1 1z" /><path d="M19 9a4 4 0 0 1 0 6" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" /></>,
  menu: <path d="M3 6h18M3 12h12M3 18h18" />,
  search: <><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  edit: <><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></>,
  trash: <><path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /></>,
  close: <path d="M18 6L6 18M6 6l12 12" />,
  upload: <><path d="M12 16V4" /><path d="M7 9l5-5 5 5" /><path d="M4 20h16" /></>,
  image: <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="1.8" /><path d="M21 16l-5-5-9 9" /></>,
  video: <><rect x="2" y="5" width="14" height="14" rx="2" /><path d="M22 8l-6 4 6 4z" /></>,
  play: <path d="M7 4l13 8-13 8z" fill="currentColor" />,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 8-3 8h18s-3-1-3-8" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></>,
  expand: <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />,
  warning: <><path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /><path d="M12 9v4M12 17h.01" /></>,
  check: <path d="M20 6L9 17l-5-5" />,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>,
  lock: <><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
  chevronLeft: <path d="M15 18l-6-6 6-6" />,
  chevronRight: <path d="M9 18l6-6-6-6" />,
  pause: <><circle cx="12" cy="12" r="9" /><path d="M10 9v6M14 9v6" /></>,
  eye: <><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" /><circle cx="12" cy="12" r="3" /></>,
  quote: <path d="M7 7h4v4c0 3-1.5 5-4 6M15 7h4v4c0 3-1.5 5-4 6" />,
  logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></>,
};
function Icon({ name, size = 18 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Reusable UI pieces                                                 */
/* ------------------------------------------------------------------ */
const Badge = ({ children, tone }) => (
  <span className={cx(styles.badge, BADGE[tone || STATUS_TONE[children] || "neutral"])}>{children}</span>
);

function Empty({ text }) {
  return (
    <div className={styles.empty}>
      <Icon name="search" size={28} />
      <p>{text}</p>
    </div>
  );
}

function MediaThumb({ item, controls = false }) {
  if (item.kind === "video") {
    return (
      <div className={styles.thumb}>
        <video src={item.url} muted playsInline preload="metadata" controls={controls} />
        {!controls && (
          <span className={styles.playBadge}>
            <Icon name="play" size={14} />
          </span>
        )}
      </div>
    );
  }
  return (
    <div className={styles.thumb}>
      <img src={item.url} alt={item.name || ""} loading="lazy" />
    </div>
  );
}

function Toolbar({ addLabel, onAdd, query, setQuery, placeholder = "Search...", children }) {
  return (
    <div className={styles.toolbar}>
      {onAdd ? (
        <button type="button" className={cx(styles.btn, styles.btnPrimary)} onClick={onAdd}>
          <Icon name="plus" size={15} /> {addLabel}
        </button>
      ) : (
        <span />
      )}
      <div className={styles.toolbarRight}>
        <div className={styles.searchBox}>
          <Icon name="search" size={16} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={placeholder} aria-label="Search" />
        </div>
        {children}
      </div>
    </div>
  );
}

const Select = ({ value, onChange, options, label }) => (
  <select className={styles.select} value={value} onChange={(e) => onChange(e.target.value)} aria-label={label}>
    {options.map((o) => (
      <option key={o} value={o}>{o}</option>
    ))}
  </select>
);

const RowActions = ({ onEdit, onDelete }) => (
  <div className={styles.rowActions}>
    <button type="button" className={cx(styles.iconAction, styles.iconEdit)} onClick={onEdit} title="Edit" aria-label="Edit">
      <Icon name="edit" size={16} />
    </button>
    <button type="button" className={cx(styles.iconAction, styles.iconDelete)} onClick={onDelete} title="Delete" aria-label="Delete">
      <Icon name="trash" size={16} />
    </button>
  </div>
);

/* ---- media picker (local previews only) ---- */
function MediaPicker({ label, mode, accept, items, onChange, onError, error }) {
  const addRef = useRef(null);
  const replaceRef = useRef(null);
  const replaceId = useRef(null);
  const multi = mode === "multi";
  const allowImg = accept.includes("image");
  const allowVid = accept.includes("video");

  const toItem = (file) => {
    const isImg = file.type.startsWith("image/");
    const isVid = file.type.startsWith("video/");
    if ((!isImg && !isVid) || (isImg && !allowImg) || (isVid && !allowVid)) {
      onError(`"${file.name}" is not a supported file type.`);
      return null;
    }
    const max = isVid ? 80 : 8;
    if (file.size > max * 1024 * 1024) {
      onError(`"${file.name}" is too large (max ${max} MB).`);
      return null;
    }
    return { id: uid(), kind: isVid ? "video" : "image", url: makePreview(file), name: file.name };
  };

  const handleAdd = (e) => {
    const files = [...e.target.files];
    e.target.value = "";
    onError("");
    const made = files.map(toItem).filter(Boolean);
    if (!made.length) return;
    onChange(multi ? [...items, ...made] : [made[0]]);
  };
  const handleReplace = (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;
    onError("");
    const made = toItem(file);
    if (!made) return;
    onChange(items.map((m) => (m.id === replaceId.current ? made : m)));
  };

  return (
    <div className={cx(styles.field, styles.fieldFull)}>
      <label className={styles.label}>{label}</label>
      <div className={styles.mediaGrid}>
        {items.map((m) => (
          <div key={m.id} className={styles.mediaItem}>
            <MediaThumb item={m} controls />
            <div className={styles.mediaActions}>
              <button type="button" title="Replace" aria-label="Replace file" onClick={() => { replaceId.current = m.id; replaceRef.current.click(); }}>
                <Icon name="upload" size={14} />
              </button>
              <button type="button" title="Remove" aria-label="Remove file" onClick={() => onChange(items.filter((x) => x.id !== m.id))}>
                <Icon name="trash" size={14} />
              </button>
            </div>
            <span className={styles.mediaName}>{m.name}</span>
          </div>
        ))}
        {(multi || items.length === 0) && (
          <button type="button" className={styles.mediaAdd} onClick={() => addRef.current.click()}>
            <Icon name={allowVid ? "upload" : "image"} size={22} />
            <span>{multi ? "Add files" : "Upload file"}</span>
          </button>
        )}
      </div>
      <input ref={addRef} type="file" hidden accept={accept} multiple={multi} onChange={handleAdd} />
      <input ref={replaceRef} type="file" hidden accept={accept} onChange={handleReplace} />
      <span className={styles.hint}>
        {allowVid ? "Images up to 8 MB, videos up to 80 MB." : "Images up to 8 MB."} Previews stay in this browser only.
      </span>
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
}

/* ---- generic add / edit modal ---- */
function FormModal({ cfg, record, onSave, onClose }) {
  const today = new Date().toISOString().slice(0, 10);
  const [values, setValues] = useState(() => {
    const v = {};
    cfg.fields.forEach((f) => {
      if (record) v[f.name] = record[f.name] ?? "";
      else v[f.name] = f.type === "select" ? f.options[0] : f.type === "date" ? today : "";
    });
    return v;
  });
  const original = useRef(record ? record.media : []);
  const [media, setMedia] = useState(original.current);
  const mediaRef = useRef(media);
  mediaRef.current = media;
  const [errors, setErrors] = useState({});
  const [mediaError, setMediaError] = useState("");

  const updateMedia = (next) => {
    const keep = new Set(original.current.map((m) => m.url));
    const nextUrls = new Set(next.map((m) => m.url));
    mediaRef.current.forEach((m) => {
      if (!nextUrls.has(m.url) && !keep.has(m.url)) releasePreview(m.url);
    });
    setMedia(next);
  };

  const close = useCallback(() => {
    const keep = new Set(original.current.map((m) => m.url));
    mediaRef.current.forEach((m) => {
      if (!keep.has(m.url)) releasePreview(m.url);
    });
    onClose();
  }, [onClose]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [close]);

  const setField = (name, value) => {
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((e) => ({ ...e, [name]: undefined }));
  };

  const validate = () => {
    const e = {};
    cfg.fields.forEach((f) => {
      const v = String(values[f.name] ?? "").trim();
      if (f.required && !v) e[f.name] = `${f.label} is required.`;
      else if (f.type === "number" && v && (Number.isNaN(Number(v)) || Number(v) < (f.min ?? 0))) e[f.name] = `Enter a valid number (minimum ${f.min ?? 0}).`;
      else if (f.type === "email" && v && !/^\S+@\S+\.\S+$/.test(v)) e[f.name] = "Enter a valid email address.";
      else if (f.type === "url" && v && !/^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/i.test(v)) e[f.name] = "Enter a valid website address.";
    });
    if (cfg.needsContent && !String(values.text || "").trim() && media.length === 0) e.text = "Add some text or upload an image/video.";
    return e;
  };

  const submit = (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    const cleaned = {};
    cfg.fields.forEach((f) => {
      const v = values[f.name];
      cleaned[f.name] = f.type === "number" ? Number(v) : typeof v === "string" ? v.trim() : v;
    });
    const finalUrls = new Set(media.map((m) => m.url));
    original.current.forEach((m) => {
      if (!finalUrls.has(m.url)) releasePreview(m.url);
    });
    onSave(cleaned, media);
  };

  return (
    <div className={styles.modalBackdrop} onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <form className={styles.modal} onSubmit={submit} noValidate role="dialog" aria-modal="true" aria-label={`${record ? "Edit" : "Add"} ${cfg.label}`}>
        <div className={styles.modalHead}>
          <h3 className={styles.modalTitle}>{record ? "Edit" : "Add"} {cfg.label}</h3>
          <button type="button" className={styles.modalClose} onClick={close} aria-label="Close">
            <Icon name="close" />
          </button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.formGrid}>
            {cfg.fields.map((f) => (
              <div key={f.name} className={cx(styles.field, f.span === 2 && styles.fieldFull)}>
                <label className={styles.label} htmlFor={`f-${f.name}`}>
                  {f.label}{f.required && <em> *</em>}
                </label>
                {f.type === "textarea" ? (
                  <textarea id={`f-${f.name}`} rows={4} className={cx(styles.input, errors[f.name] && styles.inputError)} value={values[f.name]} onChange={(e) => setField(f.name, e.target.value)} />
                ) : f.type === "select" ? (
                  <select id={`f-${f.name}`} className={cx(styles.input, errors[f.name] && styles.inputError)} value={values[f.name]} onChange={(e) => setField(f.name, e.target.value)}>
                    {f.options.map((o) => <option key={o}>{o}</option>)}
                  </select>
                ) : (
                  <input id={`f-${f.name}`} type={f.type === "url" || f.type === "email" ? "text" : f.type} min={f.min} className={cx(styles.input, errors[f.name] && styles.inputError)} value={values[f.name]} onChange={(e) => setField(f.name, e.target.value)} />
                )}
                {errors[f.name] && <span className={styles.errorText}>{errors[f.name]}</span>}
              </div>
            ))}
            {cfg.media && (
              <MediaPicker {...cfg.media} items={media} onChange={updateMedia} onError={setMediaError} error={mediaError} />
            )}
          </div>
        </div>
        <div className={styles.modalFoot}>
          <button type="button" className={cx(styles.btn, styles.btnLight)} onClick={close}>Cancel</button>
          <button type="submit" className={cx(styles.btn, styles.btnPrimary)}>
            {record ? "Update" : "Add"} {cfg.label}
          </button>
        </div>
      </form>
    </div>
  );
}

function ConfirmDialog({ title, message, onCancel, onConfirm }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onCancel();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onCancel]);
  return (
    <div className={styles.modalBackdrop} onMouseDown={(e) => e.target === e.currentTarget && onCancel()}>
      <div className={styles.confirmBox} role="alertdialog" aria-modal="true" aria-label={title}>
        <div className={styles.confirmIcon}><Icon name="trash" size={26} /></div>
        <h3 className={styles.confirmTitle}>{title}</h3>
        <div className={styles.confirmText}>{message}</div>
        <div className={styles.confirmBtns}>
          <button type="button" autoFocus className={cx(styles.btn, styles.btnLight)} onClick={onCancel}>Cancel</button>
          <button type="button" className={cx(styles.btn, styles.btnDanger)} onClick={onConfirm}>Yes, delete it</button>
        </div>
      </div>
    </div>
  );
}

function Lightbox({ items, index, onClose }) {
  const [i, setI] = useState(index);
  const item = items[i];
  const prev = useCallback(() => setI((n) => (n - 1 + items.length) % items.length), [items.length]);
  const next = useCallback(() => setI((n) => (n + 1) % items.length), [items.length]);
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, prev, next]);
  if (!item) return null;
  return (
    <div className={styles.lightbox} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <button type="button" className={styles.lbClose} onClick={onClose} aria-label="Close viewer"><Icon name="close" size={22} /></button>
      {items.length > 1 && (
        <button type="button" className={cx(styles.lbNav, styles.lbPrev)} onClick={prev} aria-label="Previous"><Icon name="chevronLeft" size={24} /></button>
      )}
      <div className={styles.lbStage}>
        {item.kind === "video" ? (
          <video key={item.id} src={item.url} controls playsInline />
        ) : (
          <img key={item.id} src={item.url} alt={item.name || ""} />
        )}
        <div className={styles.lbCount}>{i + 1} / {items.length}</div>
      </div>
      {items.length > 1 && (
        <button type="button" className={cx(styles.lbNav, styles.lbNext)} onClick={next} aria-label="Next"><Icon name="chevronRight" size={24} /></button>
      )}
    </div>
  );
}

function Toast({ toast }) {
  if (!toast) return null;
  const icon = toast.type === "success" ? "check" : toast.type === "error" ? "warning" : "info";
  return (
    <div key={toast.id} className={cx(styles.toast, toast.type === "success" ? styles.toastSuccess : toast.type === "error" ? styles.toastError : styles.toastInfo)} role="status">
      <Icon name={icon} size={18} />
      <span>{toast.msg}</span>
    </div>
  );
}

const matches = (q, ...parts) => !q || parts.join(" ").toLowerCase().includes(q.trim().toLowerCase());

/* ------------------------------------------------------------------ */
/*  Sections                                                           */
/* ------------------------------------------------------------------ */
function Overview({ db, goTo, onAdd, username }) {
  const totalRaised = db.donations.reduce((s, d) => s + Number(d.amount), 0);
  const statusCount = (arr, s) => arr.filter((x) => x.status === s).length;
  const stats = [
    { key: "donations", label: "Total Donations", value: db.donations.length, sub: `${money(totalRaised)} raised`, icon: "heart", tone: "primary" },
    { key: "partners", label: "Partners", value: db.partners.length, sub: `${statusCount(db.partners, "Active")} active`, icon: "briefcase", tone: "blue" },
    { key: "families", label: "Families", value: db.families.length, sub: `${statusCount(db.families, "Supported")} supported`, icon: "home", tone: "green" },
    { key: "friends", label: "Friends Content", value: db.friends.length, sub: `${db.friends.filter((f) => f.media.length).length} with media`, icon: "users", tone: "yellow" },
    { key: "announcements", label: "Announcements", value: db.announcements.length, sub: `${statusCount(db.announcements, "Published")} published`, icon: "megaphone", tone: "red" },
    { key: "users", label: "Registered Users", value: db.users.length, sub: `${statusCount(db.users, "Active")} active`, icon: "user", tone: "primary" },
  ];

  /* last six calendar months of donations */
  const months = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const key = `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
      const total = db.donations.filter((x) => x.date.startsWith(key)).reduce((s, x) => s + Number(x.amount), 0);
      return { label: MONTHS[d.getMonth()], total };
    });
  }, [db.donations]);
  const maxMonth = Math.max(1, ...months.map((m) => m.total));

  const userStatuses = [
    { name: "Active", color: "#3fcb80" },
    { name: "Pending", color: "#ffbe0b" },
    { name: "Suspended", color: "#f06548" },
  ].map((s) => ({ ...s, count: statusCount(db.users, s.name) }));
  const totalUsers = Math.max(1, db.users.length);
  let acc = 0;
  const conic = userStatuses
    .map((s) => {
      const from = (acc / totalUsers) * 100;
      acc += s.count;
      return `${s.color} ${from}% ${(acc / totalUsers) * 100}%`;
    })
    .join(", ");

  const recent = [...db.donations].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  const latestNews = [...db.announcements].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);
  const distribution = [
    { name: "Donations", count: db.donations.length, color: "#4b38b3" },
    { name: "Partners", count: db.partners.length, color: "#299cdb" },
    { name: "Families", count: db.families.length, color: "#3fcb80" },
    { name: "Friends", count: db.friends.length, color: "#ffbe0b" },
    { name: "Announcements", count: db.announcements.length, color: "#f06548" },
  ];
  const distTotal = Math.max(1, distribution.reduce((s, d) => s + d.count, 0));

  return (
    <>
      <div className={styles.ovTop}>
        <div className={styles.ovLeft}>
          <div className={styles.card}>
            <div className={styles.alertBar}>
              <Icon name="warning" size={16} />
              <span>Demo mode: all data below is mock data kept in React state and resets when the page reloads.</span>
              <button type="button" className={styles.linkBtn} onClick={() => goTo("settings")}>Account settings</button>
            </div>
            <div className={styles.banner}>
              <div className={styles.bannerText}>
                <div className={styles.bannerTitle}>Welcome back, <strong>{username}</strong></div>
                <div className={styles.bannerSub}>Manage donations, partners, families, friends and announcements from one place.</div>
                <button type="button" className={cx(styles.btn, styles.btnPrimary)} onClick={() => onAdd("donations")}>Add Donation</button>
              </div>
              <svg className={styles.bannerArt} viewBox="0 0 220 130" aria-hidden="true">
                <defs>
                  <linearGradient id="bn" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#4b38b3" /><stop offset="1" stopColor="#299cdb" /></linearGradient>
                </defs>
                <circle cx="150" cy="70" r="52" fill="url(#bn)" opacity=".16" />
                <circle cx="185" cy="30" r="14" fill="#ffbe0b" opacity=".85" />
                <circle cx="90" cy="105" r="10" fill="#3fcb80" opacity=".85" />
                <path d="M150 98c-18-12-30-22-30-35a16 16 0 0 1 30-7 16 16 0 0 1 30 7c0 13-12 23-30 35z" fill="#f06548" />
              </svg>
            </div>
          </div>
          <div className={styles.statGrid}>
            {stats.map((s) => (
              <button key={s.key} type="button" className={cx(styles.card, styles.statCard)} onClick={() => goTo(s.key)}>
                <div className={styles.statTop}>
                  <span className={styles.statLabel}>{s.label}</span>
                  <span className={cx(styles.statIcon, TONE[s.tone])}><Icon name={s.icon} size={20} /></span>
                </div>
                <div className={styles.statValue}>{s.value}</div>
                <div className={styles.statSub}>{s.sub}</div>
              </button>
            ))}
          </div>
        </div>

        <div className={cx(styles.card, styles.ovRight)}>
          <div className={styles.cardHead}><h3 className={styles.cardTitle}>Users by Status</h3></div>
          <div className={styles.cardBody}>
            <div className={styles.donutWrap}>
              <div className={styles.donut} style={{ background: `conic-gradient(${conic})` }}>
                <div className={styles.donutHole}>
                  <strong>{db.users.length}</strong>
                  <span>Users</span>
                </div>
              </div>
            </div>
            {userStatuses.map((s) => (
              <div key={s.name} className={styles.legendRow}>
                <span className={styles.dot} style={{ background: s.color }} />
                <span className={styles.legendName}>{s.name}</span>
                <span className={styles.legendVal}>{s.count}</span>
                <span className={styles.legendPct}>{Math.round((s.count / totalUsers) * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.ovRow}>
        <div className={cx(styles.card, styles.ovWide)}>
          <div className={styles.cardHead}>
            <h3 className={styles.cardTitle}>Donations by Month</h3>
            <span className={styles.chip}>Last 6 months</span>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.barChart}>
              {months.map((m) => (
                <div key={m.label} className={styles.barCol} title={`${m.label}: ${money(m.total)}`}>
                  <span className={styles.barValue}>{m.total ? money(m.total) : "-"}</span>
                  <div className={styles.barTrack}>
                    <div className={styles.barFill} style={{ height: `${(m.total / maxMonth) * 100}%` }} />
                  </div>
                  <span className={styles.barLabel}>{m.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={cx(styles.card, styles.ovNarrow)}>
          <div className={styles.cardHead}>
            <h3 className={styles.cardTitle}>Recent Donations</h3>
            <button type="button" className={styles.linkBtn} onClick={() => goTo("donations")}>View all</button>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead><tr><th>Donation</th><th>Date</th><th>Amount</th></tr></thead>
              <tbody>
                {recent.map((d) => (
                  <tr key={d.id}>
                    <td><div className={styles.rowTitle}>{d.title}</div><div className={styles.rowSub}>{d.donor}</div></td>
                    <td>{fmtDate(d.date)}</td>
                    <td><strong>{money(d.amount)}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className={styles.ovRow2}>
        <div className={styles.card}>
          <div className={styles.cardHead}>
            <h3 className={styles.cardTitle}>Latest Announcements</h3>
            <button type="button" className={styles.linkBtn} onClick={() => goTo("announcements")}>View all</button>
          </div>
          <div className={styles.cardBody}>
            {latestNews.map((a) => (
              <div key={a.id} className={styles.newsRow}>
                <div className={styles.newsThumb}>
                  {a.media[0] ? <MediaThumb item={a.media[0]} /> : <Icon name="megaphone" size={20} />}
                </div>
                <div className={styles.newsText}>
                  <div className={styles.rowTitle}>{a.title}</div>
                  <div className={styles.rowSub}>{fmtDate(a.date)}</div>
                </div>
                <Badge>{a.topic}</Badge>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardHead}><h3 className={styles.cardTitle}>Content Overview</h3></div>
          <div className={styles.cardBody}>
            <div className={styles.segBar}>
              {distribution.map((d) => (
                <span key={d.name} style={{ width: `${(d.count / distTotal) * 100}%`, background: d.color }} />
              ))}
            </div>
            {distribution.map((d) => (
              <div key={d.name} className={styles.legendRow}>
                <span className={styles.dot} style={{ background: d.color }} />
                <span className={styles.legendName}>{d.name}</span>
                <span className={styles.legendVal}>{d.count}</span>
                <span className={styles.legendPct}>{Math.round((d.count / distTotal) * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function DonationsSection({ items, initialQuery, onAdd, onEdit, onDelete, onView }) {
  const [query, setQuery] = useState(initialQuery);
  const [status, setStatus] = useState("All");
  const list = items.filter((d) => (status === "All" || d.status === status) && matches(query, d.title, d.donor, d.description));
  return (
    <>
      <Toolbar addLabel="Add Donation" onAdd={onAdd} query={query} setQuery={setQuery} placeholder="Search donations...">
        <Select value={status} onChange={setStatus} label="Filter by status" options={["All", "Received", "Pending", "Allocated"]} />
      </Toolbar>
      {list.length === 0 ? <Empty text="No donations match your search." /> : (
        <div className={styles.cardGrid}>
          {list.map((d) => (
            <div key={d.id} className={cx(styles.card, styles.dCard)}>
              <button type="button" className={styles.dMedia} onClick={() => d.media.length && onView(d.media, 0)} aria-label="View image">
                {d.media[0] ? <MediaThumb item={d.media[0]} /> : <span className={styles.noMedia}><Icon name="image" size={30} /></span>}
              </button>
              <div className={styles.dBody}>
                <div className={styles.dMeta}><Icon name="calendar" size={14} /> {fmtDate(d.date)}</div>
                <div className={styles.dTitle}>{d.title}</div>
                <div className={styles.dDonor}>by {d.donor}</div>
                <div className={styles.dDesc}>{d.description}</div>
                <div className={styles.dFoot}>
                  <div>
                    <div className={styles.amount}>{money(d.amount)}</div>
                    <Badge>{d.status}</Badge>
                  </div>
                  <RowActions onEdit={() => onEdit(d)} onDelete={() => onDelete(d)} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function PartnersSection({ items, initialQuery, onAdd, onEdit, onDelete, onView }) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState("All");
  const list = items.filter((p) => (category === "All" || p.category === category) && matches(query, p.name, p.website, p.email, p.category));
  return (
    <>
      <Toolbar addLabel="Add Partner" onAdd={onAdd} query={query} setQuery={setQuery} placeholder="Search partners...">
        <Select value={category} onChange={setCategory} label="Filter by category" options={["All", "Community", "Education", "Health", "Technology", "Media"]} />
      </Toolbar>
      <div className={cx(styles.card, styles.tableCard)}>
        {list.length === 0 ? <Empty text="No partners match your search." /> : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead><tr><th>Partner</th><th>Category</th><th>Website</th><th>Contact</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {list.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className={styles.cellUser}>
                        <button type="button" className={styles.logoBox} onClick={() => p.media.length && onView(p.media, 0)} aria-label="View logo">
                          {p.media[0] ? <img src={p.media[0].url} alt={`${p.name} logo`} /> : <span>{initials(p.name)}</span>}
                        </button>
                        <span className={styles.rowTitle}>{p.name}</span>
                      </div>
                    </td>
                    <td>{p.category}</td>
                    <td className={styles.linkText}>{p.website || "-"}</td>
                    <td>{p.email || "-"}</td>
                    <td><Badge>{p.status}</Badge></td>
                    <td><RowActions onEdit={() => onEdit(p)} onDelete={() => onDelete(p)} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

const FAMILY_TINTS = { Supported: "rgba(63,203,128,.16)", "In Review": "rgba(255,190,11,.2)", Graduated: "rgba(75,56,179,.12)" };

function FamiliesSection({ items, initialQuery, onAdd, onEdit, onDelete, onView }) {
  const [query, setQuery] = useState(initialQuery);
  const [status, setStatus] = useState("All");
  const list = items.filter((f) => (status === "All" || f.status === status) && matches(query, f.name, f.location, f.story));
  return (
    <>
      <Toolbar addLabel="Add Family" onAdd={onAdd} query={query} setQuery={setQuery} placeholder="Search families...">
        <Select value={status} onChange={setStatus} label="Filter by status" options={["All", "Supported", "In Review", "Graduated"]} />
      </Toolbar>
      {list.length === 0 ? <Empty text="No families match your search." /> : (
        <div className={styles.cardGrid}>
          {list.map((f) => {
            const imgs = f.media.filter((m) => m.kind === "image").length;
            const vids = f.media.length - imgs;
            const shown = f.media.slice(0, 4);
            return (
              <div key={f.id} className={cx(styles.card, styles.fCard)}>
                <div className={styles.fHead} style={{ background: FAMILY_TINTS[f.status] }}>
                  <span className={styles.fTitle}>{f.name}</span>
                  <Badge>{f.status}</Badge>
                </div>
                <div className={styles.fBody}>
                  <div className={styles.factRow}>
                    <div><span className={styles.factLabel}>Location</span><span className={styles.factVal}>{f.location}</span></div>
                    <div><span className={styles.factLabel}>Members</span><span className={styles.factVal}>{f.members}</span></div>
                  </div>
                  <div className={styles.fStory}>{f.story}</div>
                  {f.media.length > 0 ? (
                    <div className={styles.fStrip}>
                      {shown.map((m, i) => (
                        <button key={m.id} type="button" className={styles.fThumb} onClick={() => onView(f.media, i)} aria-label={`View ${m.kind}`}>
                          <MediaThumb item={m} />
                          {i === 3 && f.media.length > 4 && <span className={styles.fMore}>+{f.media.length - 4}</span>}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className={styles.fStripEmpty}>No media yet</div>
                  )}
                  <div className={styles.fFoot}>
                    <span className={styles.rowSub}>{imgs} image{imgs === 1 ? "" : "s"} · {vids} video{vids === 1 ? "" : "s"}</span>
                    <RowActions onEdit={() => onEdit(f)} onDelete={() => onDelete(f)} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

const kindOf = (f) => (f.media[0] ? f.media[0].kind === "video" ? "Video" : "Image" : "Text");

function FriendsSection({ items, initialQuery, onAdd, onEdit, onDelete, onView }) {
  const [query, setQuery] = useState(initialQuery);
  const [tab, setTab] = useState("All");
  const list = items.filter((f) => (tab === "All" || kindOf(f) === tab) && matches(query, f.title, f.author, f.text));
  return (
    <>
      <Toolbar addLabel="Add Content" onAdd={onAdd} query={query} setQuery={setQuery} placeholder="Search friends content..." />
      <div className={styles.tabs}>
        {["All", "Text", "Image", "Video"].map((t) => (
          <button key={t} type="button" className={cx(styles.tab, tab === t && styles.tabActive)} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>
      {list.length === 0 ? <Empty text="No content matches your search." /> : (
        <div className={styles.gGrid}>
          {list.map((f) => (
            <div key={f.id} className={styles.gItem}>
              {f.media[0] ? (
                <button type="button" className={styles.gMedia} onClick={() => onView(f.media, 0)} aria-label="View media">
                  <MediaThumb item={f.media[0]} />
                </button>
              ) : (
                <div className={styles.gTextTile}>
                  <Icon name="quote" size={26} />
                  <p>{f.text}</p>
                </div>
              )}
              <div className={styles.gCaption}>
                <div className={styles.gInfo}>
                  <div className={styles.rowTitle}>{f.title}</div>
                  <div className={styles.rowSub}>by {f.author} · <Badge tone="neutral">{kindOf(f)}</Badge></div>
                </div>
                <RowActions onEdit={() => onEdit(f)} onDelete={() => onDelete(f)} />
              </div>
              {f.media[0] && f.text && <div className={styles.gText}>{f.text}</div>}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function AnnouncementsSection({ items, initialQuery, onAdd, onEdit, onDelete, onView }) {
  const [query, setQuery] = useState(initialQuery);
  const [topic, setTopic] = useState("All");
  const [status, setStatus] = useState("All");
  const list = items.filter(
    (a) => (topic === "All" || a.topic === topic) && (status === "All" || a.status === status) && matches(query, a.title, a.description, a.topic)
  );
  return (
    <>
      <Toolbar addLabel="New Announcement" onAdd={onAdd} query={query} setQuery={setQuery} placeholder="Search announcements...">
        <Select value={topic} onChange={setTopic} label="Filter by topic" options={["All", "Event", "Campaign", "News", "Update"]} />
        <Select value={status} onChange={setStatus} label="Filter by status" options={["All", "Published", "Draft"]} />
      </Toolbar>
      <div className={cx(styles.card, styles.tableCard)}>
        {list.length === 0 ? <Empty text="No announcements match your search." /> : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead><tr><th>Announcement</th><th>Topic</th><th>Date</th><th>Media</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {list.map((a) => (
                  <tr key={a.id}>
                    <td>
                      <div className={styles.cellUser}>
                        <button type="button" className={styles.annThumb} onClick={() => a.media.length && onView(a.media, 0)} aria-label="View media">
                          {a.media[0] ? <MediaThumb item={a.media[0]} /> : <Icon name="megaphone" size={18} />}
                        </button>
                        <div className={styles.annText}>
                          <div className={styles.rowTitle}>{a.title}</div>
                          <div className={cx(styles.rowSub, styles.clamp2)}>{a.description}</div>
                        </div>
                      </div>
                    </td>
                    <td><Badge>{a.topic}</Badge></td>
                    <td>{fmtDate(a.date)}</td>
                    <td>
                      <span className={styles.mediaCount}>
                        <Icon name="image" size={14} /> {a.media.filter((m) => m.kind === "image").length}
                        <Icon name="video" size={14} /> {a.media.filter((m) => m.kind === "video").length}
                      </span>
                    </td>
                    <td><Badge>{a.status}</Badge></td>
                    <td><RowActions onEdit={() => onEdit(a)} onDelete={() => onDelete(a)} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

const PAGE_SIZE = 8;

function UsersSection({ users, initialQuery, onStatus }) {
  const [query, setQuery] = useState(initialQuery);
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("Newest first");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const out = users.filter((u) => (status === "All" || u.status === status) && matches(query, u.name, u.email, u.id));
    out.sort((a, b) =>
      sort === "Newest first" ? b.date.localeCompare(a.date) : sort === "Oldest first" ? a.date.localeCompare(b.date) : a.name.localeCompare(b.name)
    );
    return out;
  }, [users, query, status, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const count = (s) => (s === "All" ? users.length : users.filter((u) => u.status === s).length);

  return (
    <>
      <Toolbar query={query} setQuery={(v) => { setQuery(v); setPage(1); }} placeholder="Search by name, email or ID...">
        <Select value={sort} onChange={(v) => { setSort(v); setPage(1); }} label="Sort users" options={["Newest first", "Oldest first", "Name A-Z"]} />
      </Toolbar>
      <div className={styles.tabs}>
        {["All", "Active", "Pending", "Suspended"].map((s) => (
          <button key={s} type="button" className={cx(styles.tab, status === s && styles.tabActive)} onClick={() => { setStatus(s); setPage(1); }}>
            {s} <span className={styles.tabCount}>{count(s)}</span>
          </button>
        ))}
      </div>
      <div className={cx(styles.card, styles.tableCard)}>
        {rows.length === 0 ? <Empty text="No users match your filters." /> : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Registered</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {rows.map((u) => (
                  <tr key={u.id}>
                    <td className={styles.linkText}>#{u.id}</td>
                    <td>
                      <div className={styles.cellUser}>
                        <span className={styles.avatarSm}>{initials(u.name)}</span>
                        <span className={styles.rowTitle}>{u.name}</span>
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td>{fmtDate(u.date)}</td>
                    <td><Badge>{u.status}</Badge></td>
                    <td>
                      {u.status === "Active" && (
                        <button type="button" className={cx(styles.btn, styles.btnSm, styles.btnOutlineDanger)} onClick={() => onStatus(u, "Suspended")}>
                          <Icon name="pause" size={14} /> Suspend
                        </button>
                      )}
                      {u.status === "Suspended" && (
                        <button type="button" className={cx(styles.btn, styles.btnSm, styles.btnOutlineGreen)} onClick={() => onStatus(u, "Active")}>
                          <Icon name="check" size={14} /> Reactivate
                        </button>
                      )}
                      {u.status === "Pending" && (
                        <button type="button" className={cx(styles.btn, styles.btnSm, styles.btnOutlineGreen)} onClick={() => onStatus(u, "Active")}>
                          <Icon name="check" size={14} /> Approve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className={styles.pager}>
          <span className={styles.rowSub}>
            Showing {filtered.length === 0 ? 0 : (current - 1) * PAGE_SIZE + 1}-{Math.min(current * PAGE_SIZE, filtered.length)} of {filtered.length} users
          </span>
          <div className={styles.pagerBtns}>
            <button type="button" className={styles.pageBtn} disabled={current === 1} onClick={() => setPage(current - 1)} aria-label="Previous page"><Icon name="chevronLeft" size={16} /></button>
            {Array.from({ length: pages }, (_, i) => (
              <button key={i} type="button" className={cx(styles.pageBtn, current === i + 1 && styles.pageBtnActive)} onClick={() => setPage(i + 1)}>{i + 1}</button>
            ))}
            <button type="button" className={styles.pageBtn} disabled={current === pages} onClick={() => setPage(current + 1)} aria-label="Next page"><Icon name="chevronRight" size={16} /></button>
          </div>
        </div>
      </div>
    </>
  );
}

function SettingsSection({ username, onUsername, notify }) {
  const [name, setName] = useState(username);
  const [nameErr, setNameErr] = useState("");
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [pwErr, setPwErr] = useState({});
  const [show, setShow] = useState(false);

  const saveName = (e) => {
    e.preventDefault();
    const v = name.trim();
    if (!v) return setNameErr("Username is required.");
    if (v.length < 3 || v.length > 24) return setNameErr("Username must be 3-24 characters.");
    if (!/^[a-zA-Z0-9_.-]+$/.test(v)) return setNameErr("Use letters, numbers, dots, dashes or underscores only.");
    setNameErr("");
    onUsername(v);
    notify("success", "Username updated for this session.");
  };

  const savePw = (e) => {
    e.preventDefault();
    const err = {};
    if (!pw.current) err.current = "Enter your current password.";
    if (!pw.next) err.next = "Enter a new password.";
    else if (pw.next.length < 8) err.next = "Use at least 8 characters.";
    else if (!/[a-zA-Z]/.test(pw.next) || !/\d/.test(pw.next)) err.next = "Include at least one letter and one number.";
    else if (pw.next === pw.current) err.next = "New password must differ from the current one.";
    if (!pw.confirm) err.confirm = "Confirm your new password.";
    else if (pw.confirm !== pw.next) err.confirm = "Passwords do not match.";
    setPwErr(err);
    if (Object.keys(err).length) return notify("error", "Please fix the highlighted fields.");
    setPw({ current: "", next: "", confirm: "" });
    notify("success", "Form validated. This is a demo: no password was stored or changed.");
  };

  const pwField = (key, label, auto) => (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={`pw-${key}`}>{label}</label>
      <input id={`pw-${key}`} type={show ? "text" : "password"} autoComplete={auto} className={cx(styles.input, pwErr[key] && styles.inputError)} value={pw[key]} onChange={(e) => { setPw({ ...pw, [key]: e.target.value }); setPwErr({ ...pwErr, [key]: undefined }); }} />
      {pwErr[key] && <span className={styles.errorText}>{pwErr[key]}</span>}
    </div>
  );

  return (
    <div className={styles.settingsGrid}>
      <form className={styles.card} onSubmit={saveName} noValidate>
        <div className={styles.cardHead}><h3 className={styles.cardTitle}>Admin Profile</h3></div>
        <div className={cx(styles.cardBody, styles.formStack)}>
          <div className={styles.profileTop}>
            <span className={styles.avatarLg}>{initials(username) || "A"}</span>
            <div>
              <div className={styles.rowTitle}>{username}</div>
              <div className={styles.rowSub}>Administrator</div>
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="adm-username">Username</label>
            <input id="adm-username" className={cx(styles.input, nameErr && styles.inputError)} value={name} onChange={(e) => { setName(e.target.value); setNameErr(""); }} autoComplete="username" />
            {nameErr && <span className={styles.errorText}>{nameErr}</span>}
          </div>
          <div><button type="submit" className={cx(styles.btn, styles.btnPrimary)}>Update Username</button></div>
        </div>
      </form>

      <form className={styles.card} onSubmit={savePw} noValidate>
        <div className={styles.cardHead}><h3 className={styles.cardTitle}>Change Password</h3></div>
        <div className={cx(styles.cardBody, styles.formStack)}>
          <div className={styles.notice}>
            <Icon name="info" size={16} />
            <span>Demo only: this form is validated in the browser. Nothing is sent to a server, saved or securely stored.</span>
          </div>
          {pwField("current", "Current password", "current-password")}
          {pwField("next", "New password", "new-password")}
          {pwField("confirm", "Confirm new password", "new-password")}
          <label className={styles.checkRow}>
            <input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} /> Show passwords
          </label>
          <div><button type="submit" className={cx(styles.btn, styles.btnPrimary)}><Icon name="lock" size={15} /> Update Password</button></div>
        </div>
      </form>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main dashboard                                                     */
/* ------------------------------------------------------------------ */
export default function Admin() {
  const [db, setDb] = useState(createSeed);
  const [section, setSection] = useState("overview");
  const [navKey, setNavKey] = useState(0);
  const [initialQuery, setInitialQuery] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [modal, setModal] = useState(null); // { key, record }
  const [confirm, setConfirm] = useState(null); // { key, record }
  const [viewer, setViewer] = useState(null); // { items, index }
  const [toast, setToast] = useState(null);
  const [admin, setAdmin] = useState({ username: "yetti_admin" });
  const [globalQ, setGlobalQ] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  /* revoke any remaining object URLs when the dashboard unmounts */
  useEffect(
    () => () => {
      blobUrls.forEach((u) => URL.revokeObjectURL(u));
      blobUrls.clear();
    },
    []
  );

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 3400);
    return () => clearTimeout(t);
  }, [toast]);

  const notify = useCallback((type, msg) => setToast({ id: Date.now(), type, msg }), []);

  const goTo = (key, q = "") => {
    setSection(key);
    setInitialQuery(q);
    setNavKey((k) => k + 1);
    setMobileOpen(false);
    window.scrollTo({ top: 0 });
  };

  const toggleSidebar = () => {
    if (window.innerWidth < 992) setMobileOpen((o) => !o);
    else setCollapsed((c) => !c);
  };
  /* Mock logout: nothing to clear on a server, just leave the admin area.
     If you use react-router, swap for: const navigate = useNavigate(); navigate("/"); */
  const handleLogout = () => {
    window.location.assign("/");
  };
  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else document.documentElement.requestFullscreen?.().catch(() => notify("error", "Fullscreen is not available."));
  };

  /* ---- CRUD (React state only) ---- */
  const closeModal = useCallback(() => setModal(null), []);
  const saveRecord = (values, media) => {
    const { key, record } = modal;
    setDb((prev) => ({
      ...prev,
      [key]: record
        ? prev[key].map((r) => (r.id === record.id ? { ...r, ...values, media } : r))
        : [{ id: uid(), ...values, media }, ...prev[key]],
    }));
    notify("success", `${SECTIONS[key].label} ${record ? "updated" : "added"} successfully.`);
    setModal(null);
  };
  const deleteRecord = () => {
    const { key, record } = confirm;
    record.media.forEach((m) => releasePreview(m.url));
    setDb((prev) => ({ ...prev, [key]: prev[key].filter((r) => r.id !== record.id) }));
    notify("success", `${SECTIONS[key].label} deleted.`);
    setConfirm(null);
  };
  const setUserStatus = (user, status) => {
    setDb((prev) => ({ ...prev, users: prev.users.map((u) => (u.id === user.id ? { ...u, status } : u)) }));
    notify("success", `${user.name} is now ${status.toLowerCase()}.`);
  };

  const crud = (key) => ({
    items: db[key],
    initialQuery,
    onAdd: () => setModal({ key, record: null }),
    onEdit: (record) => setModal({ key, record }),
    onDelete: (record) => setConfirm({ key, record }),
    onView: (items, index) => setViewer({ items, index }),
  });

  /* ---- global search (top bar) ---- */
  const results = useMemo(() => {
    const q = globalQ.trim().toLowerCase();
    if (q.length < 2) return [];
    const out = [];
    const add = (key, arr, label, sub) =>
      arr.forEach((r) => {
        const l = label(r);
        const s = sub(r);
        if (`${l} ${s}`.toLowerCase().includes(q)) out.push({ key, id: r.id, label: l, sub: s });
      });
    add("donations", db.donations, (r) => r.title, (r) => r.donor);
    add("partners", db.partners, (r) => r.name, (r) => r.category);
    add("families", db.families, (r) => r.name, (r) => r.location);
    add("friends", db.friends, (r) => r.title, (r) => r.author);
    add("announcements", db.announcements, (r) => r.title, (r) => r.topic);
    add("users", db.users, (r) => r.name, (r) => r.email);
    return out.slice(0, 8);
  }, [globalQ, db]);

  const pendingCount = db.users.filter((u) => u.status === "Pending").length + db.donations.filter((d) => d.status === "Pending").length;
  const pageKey = `${section}-${navKey}`;

  return (
    <div className={cx(styles.admin, collapsed && styles.collapsed, mobileOpen && styles.mobileOpen)}>
      {/* ---------- Sidebar ---------- */}
      <aside className={styles.sidebar} aria-label="Admin navigation">
        <div className={styles.brand}>
          <span className={styles.brandMark}>Y</span>
          <span className={styles.brandText}>YETTI</span>
        </div>
        <nav className={styles.nav}>
          {NAV.map((g) => (
            <div key={g.group}>
              <div className={styles.navGroup}>{g.group}</div>
              {g.items.map((it) => (
                <button key={it.key} type="button" className={cx(styles.navItem, section === it.key && styles.navItemActive)} onClick={() => goTo(it.key)} title={it.label} aria-current={section === it.key ? "page" : undefined}>
                  <span className={styles.navIcon}><Icon name={it.icon} size={19} /></span>
                  <span className={styles.navLabel}>{it.label}</span>
                  {it.key === "announcements" && <span className={cx(styles.navBadge, styles.navBadgeGreen)}>New</span>}
                  {it.key === "users" && pendingCount > 0 && <span className={styles.navBadge}>{db.users.filter((u) => u.status === "Pending").length}</span>}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className={styles.sideFooter}>
          <button type="button" className={styles.logoutBtn} onClick={handleLogout} title="Log Out">
            <span className={styles.navIcon}><Icon name="logout" size={19} /></span>
            <span className={styles.navLabel}>Log Out</span>
          </button>
        </div>
      </aside>
      <div className={styles.overlay} onClick={() => setMobileOpen(false)} />

      {/* ---------- Main ---------- */}
      <div className={styles.main}>
        <header className={styles.topbar}>
          <div className={styles.topLeft}>
            <button type="button" className={styles.iconBtn} onClick={toggleSidebar} aria-label="Toggle sidebar"><Icon name="menu" size={22} /></button>
            <div className={styles.searchWrap}>
              <span className={styles.searchIcon}><Icon name="search" size={16} /></span>
              <input
                className={styles.searchInput}
                placeholder="Search everything..."
                value={globalQ}
                onChange={(e) => setGlobalQ(e.target.value)}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => setSearchOpen(false)}
                aria-label="Global search"
              />
              {searchOpen && globalQ.trim().length >= 2 && (
                <div className={styles.searchResults}>
                  {results.length === 0 ? (
                    <div className={styles.searchEmpty}>No results for "{globalQ.trim()}"</div>
                  ) : (
                    results.map((r) => (
                      <button key={`${r.key}-${r.id}`} type="button" className={styles.searchResult} onMouseDown={() => { goTo(r.key, globalQ.trim()); setGlobalQ(""); setSearchOpen(false); }}>
                        <span className={styles.rowTitle}>{r.label}</span>
                        <span className={styles.rowSub}>{TITLES[r.key]} · {r.sub}</span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
          <div className={styles.topRight}>
            <button type="button" className={cx(styles.iconBtn, styles.hideSm)} onClick={toggleFullscreen} aria-label="Toggle fullscreen"><Icon name="expand" size={20} /></button>
            <button type="button" className={styles.iconBtn} onClick={() => notify("info", `${pendingCount} pending item${pendingCount === 1 ? "" : "s"} need attention (users and donations).`)} aria-label="Notifications">
              <Icon name="bell" size={20} />
              {pendingCount > 0 && <span className={styles.notifBadge}>{pendingCount}</span>}
            </button>
            <button type="button" className={styles.profile} onClick={() => goTo("settings")} aria-label="Open account settings">
              <span className={styles.avatar}>{initials(admin.username) || "A"}</span>
              <span className={styles.profileText}>
                <span className={styles.profileName}>{admin.username}</span>
                <span className={styles.profileRole}>Administrator</span>
              </span>
            </button>
          </div>
        </header>

        <div className={styles.pageBar}>
          <h1 className={styles.pageTitle}>{TITLES[section]}</h1>
          <div className={styles.crumbs}>
            <span>Admin</span>
            <Icon name="chevronRight" size={13} />
            <span className={styles.crumbCurrent}>{TITLES[section]}</span>
          </div>
        </div>

        <main className={styles.content}>
          {section === "overview" && <Overview key={pageKey} db={db} goTo={goTo} onAdd={(key) => setModal({ key, record: null })} username={admin.username} />}
          {section === "donations" && <DonationsSection key={pageKey} {...crud("donations")} />}
          {section === "partners" && <PartnersSection key={pageKey} {...crud("partners")} />}
          {section === "families" && <FamiliesSection key={pageKey} {...crud("families")} />}
          {section === "friends" && <FriendsSection key={pageKey} {...crud("friends")} />}
          {section === "announcements" && <AnnouncementsSection key={pageKey} {...crud("announcements")} />}
          {section === "users" && <UsersSection key={pageKey} users={db.users} initialQuery={initialQuery} onStatus={setUserStatus} />}
          {section === "settings" && <SettingsSection key={pageKey} username={admin.username} onUsername={(username) => setAdmin({ username })} notify={notify} />}
        </main>

        <footer className={styles.footer}>
          <span>{new Date().getFullYear()} © Yetti.</span>
          <span>Admin demo · mock data, resets on reload</span>
        </footer>
      </div>

      {modal && <FormModal key={modal.record?.id || `new-${modal.key}`} cfg={SECTIONS[modal.key]} record={modal.record} onSave={saveRecord} onClose={closeModal} />}
      {confirm && (
        <ConfirmDialog
          title={`Delete this ${SECTIONS[confirm.key].label.toLowerCase()}?`}
          message={<>You are about to delete <strong>{confirm.record.title || confirm.record.name}</strong>. This cannot be undone.</>}
          onCancel={() => setConfirm(null)}
          onConfirm={deleteRecord}
        />
      )}
      {viewer && <Lightbox items={viewer.items} index={viewer.index} onClose={() => setViewer(null)} />}
      <Toast toast={toast} />
    </div>
  );
}