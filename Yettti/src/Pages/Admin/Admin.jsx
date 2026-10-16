import { useState, useRef, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import s from "./Admin.module.css";

/* ---------- helpers ---------- */
let seq = 100;
const uid = () => ++seq;
const revoke = (m) => m?.url?.startsWith("blob:") && URL.revokeObjectURL(m.url);
const ph = (c, t) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='120'><rect width='160' height='120' fill='${c}'/><text x='80' y='68' font-family='sans-serif' font-size='26' fill='white' text-anchor='middle'>${t}</text></svg>`
  )}`;
const pic = (id, c, t) => ({ id, type: "image", name: `${t}.svg`, url: ph(c, t) });

const ICONS = {
  grid: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
  gift: "M20 12v9H4v-9M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 110-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 100-5C13 2 12 7 12 7z",
  briefcase: "M3 7h18v13H3zM8 7V4h8v3",
  home: "M3 11l9-8 9 8v10H3zM9 21v-6h6v6",
  heart: "M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 00-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 000-7.8z",
  bell: "M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0",
  users: "M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8M22 21v-2a4 4 0 00-3-3.9M16 3.1a4 4 0 010 7.8",
  cog: "M12 8a4 4 0 100 8 4 4 0 000-8zM12 2v3M12 19v3M2 12h3M19 12h3",
  plus: "M12 5v14M5 12h14",
  edit: "M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z",
  trash: "M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14",
  menu: "M3 6h18M3 12h18M3 18h18",
  search: "M11 4a7 7 0 100 14 7 7 0 000-14zM21 21l-5-5",
  x: "M6 6l12 12M18 6L6 18",
  upload: "M12 16V4M7 9l5-5 5 5M4 20h16",
  logout: "M9 21H5V3h4M16 17l5-5-5-5M21 12H9",
  video: "M23 7l-7 5 7 5zM1 5h15v14H1z",
};
const Icon = ({ n, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={ICONS[n]} />
  </svg>
);

/* ---------- mock data ---------- */
const INITIAL = {
  donations: [
    { id: 1, title: "School supplies drive", donor: "Hana Bekele", amount: 1200, date: "2026-09-12", status: "Received", description: "Notebooks and bags for 80 students.", media: [pic(11, "#0f7b6c", "Books")] },
    { id: 2, title: "Winter clothing", donor: "Addis Textile Co.", amount: 3400, date: "2026-09-28", status: "Received", description: "Coats and blankets for 40 families.", media: [pic(12, "#2a73a4", "Coats")] },
    { id: 3, title: "Clean water fund", donor: "Daniel Tesfaye", amount: 5000, date: "2026-10-03", status: "Pledged", description: "Borehole repair in Kombolcha.", media: [pic(13, "#d49a2a", "Water")] },
    { id: 4, title: "Food parcels", donor: "Meron Alemu", amount: 850, date: "2026-10-10", status: "Pledged", description: "Monthly grain and oil parcels.", media: [pic(14, "#b8433f", "Food")] },
  ],
  partners: [
    { id: 1, name: "Hope Harvest Foundation", category: "NGO", website: "hopeharvest.org", email: "hello@hopeharvest.org", media: [pic(21, "#0f7b6c", "HH")] },
    { id: 2, name: "Dessie Medical Center", category: "Healthcare", website: "dmc.health", email: "partners@dmc.health", media: [pic(22, "#2a73a4", "DMC")] },
    { id: 3, name: "Amhara Bank", category: "Corporate", website: "amharabank.com", email: "csr@amharabank.com", media: [pic(23, "#d49a2a", "AB")] },
  ],
  families: [
    { id: 1, name: "The Mulatu Family", location: "Dessie", members: 6, story: "Supported with housing repairs and school fees since 2024.", media: [pic(31, "#0f7b6c", "Mulatu"), pic(32, "#2a73a4", "Home")] },
    { id: 2, name: "The Abebe Family", location: "Kombolcha", members: 4, story: "A single-parent household now running a small bakery.", media: [pic(33, "#d49a2a", "Abebe")] },
    { id: 3, name: "The Yimer Family", location: "Haik", members: 5, story: "Receiving monthly food support and tutoring.", media: [pic(34, "#b8433f", "Yimer")] },
  ],
  friends: [
    { id: 1, title: "Meet our volunteers", type: "Story", content: "Every weekend, volunteers join us to deliver food and tutor children.", media: [pic(41, "#2a73a4", "Team")] },
    { id: 2, title: "Friends of the platform", type: "Text", content: "Thank you to everyone who shares our mission.", media: [] },
    { id: 3, title: "Community day recap", type: "Story", content: "Over 120 friends joined our September clean-up.", media: [pic(42, "#0f7b6c", "Day")] },
  ],
  announcements: [
    { id: 1, title: "Winter drive starts Nov 1", topic: "Event", description: "Bring coats and blankets to any drop-off point.", status: "Published", media: [pic(51, "#2a73a4", "Winter")] },
    { id: 2, title: "New partner: Dessie Medical", topic: "News", description: "Free monthly health checks for registered families.", status: "Published", media: [pic(52, "#0f7b6c", "Health")] },
    { id: 3, title: "Volunteer training", topic: "Update", description: "Sessions open for the next quarter.", status: "Draft", media: [] },
  ],
};

const NAMES = ["Sara Tadesse", "Yonas Kebede", "Liya Girma", "Abel Haile", "Mekdes Worku", "Samuel Desta", "Tigist Bekele", "Henok Alemu", "Ruth Mengistu", "Dawit Assefa", "Selam Negash", "Biruk Lemma"];
const STATUSES = ["Active", "Active", "Pending", "Active", "Suspended", "Active"];
const USERS = NAMES.map((n, i) => ({
  id: i + 1,
  name: n,
  email: `${n.toLowerCase().replace(" ", ".")}@example.com`,
  registered: `2026-${String(3 + (i % 7)).padStart(2, "0")}-${String(4 + i * 2).padStart(2, "0")}`,
  status: STATUSES[i % STATUSES.length],
}));

/* ---------- section configs ---------- */
const CONFIG = {
  donations: {
    label: "Donations", one: "donation", media: "single", accept: "image/*",
    filter: { key: "status", options: ["Received", "Pledged"] },
    fields: [
      { name: "title", label: "Title", required: true },
      { name: "donor", label: "Donor", required: true },
      { name: "amount", label: "Amount (USD)", type: "number", required: true },
      { name: "date", label: "Date", type: "date", required: true },
      { name: "status", label: "Status", type: "select", options: ["Received", "Pledged"] },
      { name: "description", label: "Description", type: "textarea" },
    ],
    cols: [["title", "Title"], ["donor", "Donor"], ["amount", "Amount", (v) => `$${Number(v).toLocaleString()}`], ["date", "Date"], ["status", "Status", null, true]],
  },
  partners: {
    label: "Partners", one: "partner", media: "single", accept: "image/*",
    filter: { key: "category", options: ["NGO", "Healthcare", "Corporate", "Government"] },
    fields: [
      { name: "name", label: "Partner name", required: true },
      { name: "category", label: "Category", type: "select", options: ["NGO", "Healthcare", "Corporate", "Government"] },
      { name: "website", label: "Website" },
      { name: "email", label: "Contact email", type: "email" },
    ],
    cols: [["name", "Name"], ["category", "Category"], ["website", "Website"], ["email", "Email"]],
  },
  families: {
    label: "Families", one: "family", media: "multi", accept: "image/*,video/*",
    fields: [
      { name: "name", label: "Family name", required: true },
      { name: "location", label: "Location", required: true },
      { name: "members", label: "Members", type: "number", required: true },
      { name: "story", label: "Story / notes", type: "textarea" },
    ],
    cols: [["name", "Family"], ["location", "Location"], ["members", "Members"], ["story", "Story"]],
  },
  friends: {
    label: "Friends", one: "friends item", media: "multi", accept: "image/*,video/*",
    filter: { key: "type", options: ["Text", "Story"] },
    fields: [
      { name: "title", label: "Title", required: true },
      { name: "type", label: "Type", type: "select", options: ["Text", "Story"] },
      { name: "content", label: "Content", type: "textarea", required: true },
    ],
    cols: [["title", "Title"], ["type", "Type"], ["content", "Content"]],
  },
  announcements: {
    label: "Announcements", one: "announcement", media: "multi", accept: "image/*,video/*",
    filter: { key: "status", options: ["Published", "Draft"] },
    fields: [
      { name: "title", label: "Title", required: true },
      { name: "topic", label: "Topic", type: "select", options: ["News", "Event", "Update"] },
      { name: "status", label: "Status", type: "select", options: ["Published", "Draft"] },
      { name: "description", label: "Description", type: "textarea", required: true },
    ],
    cols: [["title", "Title"], ["topic", "Topic"], ["description", "Description"], ["status", "Status", null, true]],
  },
};

const NAV = [
  ["overview", "Dashboard Overview", "grid"],
  ["donations", "Donations", "gift"],
  ["partners", "Partners", "briefcase"],
  ["families", "Families", "home"],
  ["friends", "Friends", "heart"],
  ["announcements", "Announcements", "bell"],
  ["users", "Registered Users", "users"],
  ["settings", "Account Settings", "cog"],
];

/* ---------- shared UI ---------- */
const Modal = ({ title, onClose, children, small }) => (
  <div className={s.overlay} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
    <div className={`${s.modal} ${small ? s.modalSmall : ""}`} role="dialog" aria-modal="true" aria-label={title}>
      <div className={s.modalHead}>
        <h3>{title}</h3>
        <button className={s.iconBtn} onClick={onClose} aria-label="Close"><Icon n="x" /></button>
      </div>
      {children}
    </div>
  </div>
);

const Badge = ({ v }) => <span className={`${s.badge} ${s["b" + String(v).replace(/\s/g, "")] || ""}`}>{v}</span>;

const Thumb = ({ media }) => {
  const m = media?.[0];
  if (!m) return <div className={s.thumbEmpty}>—</div>;
  return (
    <div className={s.thumbWrap}>
      {m.type === "video" ? <div className={s.thumb + " " + s.thumbVideo}><Icon n="video" /></div> : <img className={s.thumb} src={m.url} alt="" />}
      {media.length > 1 && <span className={s.count}>{media.length}</span>}
    </div>
  );
};

const Toolbar = ({ q, setQ, filter, f, setF, children }) => (
  <div className={s.toolbar}>
    <label className={s.search}>
      <Icon n="search" size={16} />
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" aria-label="Search" />
    </label>
    {filter && (
      <select className={s.select} value={f} onChange={(e) => setF(e.target.value)} aria-label="Filter">
        <option value="all">All</option>
        {filter.map((o) => <option key={o}>{o}</option>)}
      </select>
    )}
    {children}
  </div>
);

/* ---------- record form ---------- */
function RecordForm({ cfg, record, onSave, onCancel }) {
  const original = record?.media || [];
  const [vals, setVals] = useState(() => {
    const v = {};
    cfg.fields.forEach((f) => (v[f.name] = record?.[f.name] ?? (f.type === "select" ? f.options[0] : "")));
    return v;
  });
  const [media, setMedia] = useState(original);
  const [errors, setErrors] = useState({});

  const toItem = (file) => ({ id: uid(), type: file.type.startsWith("video") ? "video" : "image", name: file.name, url: URL.createObjectURL(file), local: true });
  const drop = (m) => m.local && revoke(m);

  const addFiles = (e) => {
    const items = [...e.target.files].map(toItem);
    e.target.value = "";
    if (cfg.media === "single") { media.forEach(drop); setMedia(items.slice(0, 1)); }
    else setMedia((m) => [...m, ...items]);
  };
  const replaceFile = (old, file) => {
    if (!file) return;
    drop(old);
    setMedia((m) => m.map((x) => (x.id === old.id ? toItem(file) : x)));
  };
  const removeMedia = (m) => { drop(m); setMedia((arr) => arr.filter((x) => x.id !== m.id)); };
  const cancel = () => { media.forEach(drop); onCancel(); };

  const submit = (e) => {
    e.preventDefault();
    const errs = {};
    cfg.fields.forEach((f) => {
      const v = String(vals[f.name]).trim();
      if (f.required && !v) errs[f.name] = "This field is required.";
      else if (f.type === "number" && v && Number(v) < 0) errs[f.name] = "Enter a positive number.";
      else if (f.type === "email" && v && !/^\S+@\S+\.\S+$/.test(v)) errs[f.name] = "Enter a valid email.";
    });
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const removed = original.filter((o) => !media.some((m) => m.id === o.id) || media.find((m) => m.id === o.id)?.url !== o.url);
    onSave({ ...record, ...vals, media: media.map((m) => ({ ...m, local: false })) }, removed);
  };

  return (
    <Modal title={`${record ? "Edit" : "Add"} ${cfg.one}`} onClose={cancel}>
      <form onSubmit={submit} noValidate>
        <div className={s.formGrid}>
          {cfg.fields.map((f) => (
            <label key={f.name} className={`${s.field} ${f.type === "textarea" ? s.full : ""}`}>
              <span>{f.label}</span>
              {f.type === "textarea" ? (
                <textarea rows={3} value={vals[f.name]} onChange={(e) => setVals({ ...vals, [f.name]: e.target.value })} />
              ) : f.type === "select" ? (
                <select value={vals[f.name]} onChange={(e) => setVals({ ...vals, [f.name]: e.target.value })}>
                  {f.options.map((o) => <option key={o}>{o}</option>)}
                </select>
              ) : (
                <input type={f.type || "text"} value={vals[f.name]} onChange={(e) => setVals({ ...vals, [f.name]: e.target.value })} />
              )}
              {errors[f.name] && <em className={s.err}>{errors[f.name]}</em>}
            </label>
          ))}
        </div>

        <div className={s.mediaBox}>
          <div className={s.mediaHead}>
            <span>{cfg.media === "single" ? (cfg.accept === "image/*" ? "Image" : "Media") : "Images and videos"}</span>
            <label className={s.btnGhost}>
              <Icon n="upload" size={15} /> {cfg.media === "single" && media.length ? "Change" : "Upload"}
              <input hidden type="file" accept={cfg.accept} multiple={cfg.media === "multi"} onChange={addFiles} />
            </label>
          </div>
          {media.length === 0 ? (
            <p className={s.muted}>No media yet. Previews stay in your browser only.</p>
          ) : (
            <div className={s.mediaGrid}>
              {media.map((m) => (
                <div key={m.id} className={s.mediaItem}>
                  {m.type === "video" ? <video src={m.url} controls muted /> : <img src={m.url} alt={m.name} />}
                  <div className={s.mediaActions}>
                    <label className={s.miniBtn}>Replace
                      <input hidden type="file" accept={cfg.accept} onChange={(e) => { replaceFile(m, e.target.files[0]); e.target.value = ""; }} />
                    </label>
                    <button type="button" className={s.miniBtn} onClick={() => removeMedia(m)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={s.modalFoot}>
          <button type="button" className={s.btnGhost} onClick={cancel}>Cancel</button>
          <button type="submit" className={s.btnPrimary}>{record ? "Save changes" : `Add ${cfg.one}`}</button>
        </div>
      </form>
    </Modal>
  );
}

/* ---------- generic manager ---------- */
function Manager({ id, rows, setRows, log }) {
  const cfg = CONFIG[id];
  const [q, setQ] = useState("");
  const [f, setF] = useState("all");
  const [editing, setEditing] = useState(undefined); // undefined closed, null new, object edit
  const [del, setDel] = useState(null);

  useEffect(() => { setQ(""); setF("all"); }, [id]);

  const shown = useMemo(
    () => rows.filter((r) =>
      (f === "all" || r[cfg.filter.key] === f) &&
      cfg.fields.map((x) => r[x.name]).join(" ").toLowerCase().includes(q.toLowerCase())),
    [rows, q, f, cfg]
  );

  const save = (rec, removed) => {
    removed.forEach(revoke);
    if (rec.id) { setRows(rows.map((r) => (r.id === rec.id ? rec : r))); log(`Updated ${cfg.one} “${rec[cfg.fields[0].name]}”`); }
    else { setRows([{ ...rec, id: uid() }, ...rows]); log(`Added ${cfg.one} “${rec[cfg.fields[0].name]}”`); }
    setEditing(undefined);
  };
  const remove = () => {
    del.media.forEach(revoke);
    setRows(rows.filter((r) => r.id !== del.id));
    log(`Deleted ${cfg.one} “${del[cfg.fields[0].name]}”`);
    setDel(null);
  };

  return (
    <>
      <Toolbar q={q} setQ={setQ} filter={cfg.filter?.options} f={f} setF={setF}>
        <button className={s.btnPrimary} onClick={() => setEditing(null)}><Icon n="plus" size={16} /> Add {cfg.one}</button>
      </Toolbar>
      <div className={s.card}>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead>
              <tr><th>Media</th>{cfg.cols.map(([k, l]) => <th key={k}>{l}</th>)}<th className={s.right}>Actions</th></tr>
            </thead>
            <tbody>
              {shown.map((r) => (
                <tr key={r.id}>
                  <td><Thumb media={r.media} /></td>
                  {cfg.cols.map(([k, , fmt, badge]) => (
                    <td key={k} className={k === "story" || k === "content" || k === "description" ? s.clamp : ""}>
                      {badge ? <Badge v={r[k]} /> : fmt ? fmt(r[k]) : r[k]}
                    </td>
                  ))}
                  <td className={s.right}>
                    <button className={s.iconBtn} onClick={() => setEditing(r)} aria-label="Edit"><Icon n="edit" size={16} /></button>
                    <button className={`${s.iconBtn} ${s.danger}`} onClick={() => setDel(r)} aria-label="Delete"><Icon n="trash" size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {shown.length === 0 && <p className={s.empty}>No {cfg.label.toLowerCase()} match. Try a different search or add a new {cfg.one}.</p>}
      </div>

      {editing !== undefined && <RecordForm cfg={cfg} record={editing} onSave={save} onCancel={() => setEditing(undefined)} />}
      {del && (
        <Modal small title={`Delete ${cfg.one}?`} onClose={() => setDel(null)}>
          <p className={s.confirmText}>“{del[cfg.fields[0].name]}” and its media will be removed. This can’t be undone.</p>
          <div className={s.modalFoot}>
            <button className={s.btnGhost} onClick={() => setDel(null)}>Cancel</button>
            <button className={s.btnDanger} onClick={remove}>Delete</button>
          </div>
        </Modal>
      )}
    </>
  );
}

/* ---------- users ---------- */
function Users({ users, setUsers, log }) {
  const [q, setQ] = useState("");
  const [f, setF] = useState("all");
  const shown = users.filter((u) => (f === "all" || u.status === f) && `${u.name} ${u.email}`.toLowerCase().includes(q.toLowerCase()));
  const toggle = (u) => {
    const next = u.status === "Suspended" ? "Active" : "Suspended";
    setUsers(users.map((x) => (x.id === u.id ? { ...x, status: next } : x)));
    log(`${next === "Active" ? "Reactivated" : "Suspended"} ${u.name} (mock)`);
  };
  return (
    <>
      <Toolbar q={q} setQ={setQ} filter={["Active", "Pending", "Suspended"]} f={f} setF={setF} />
      <div className={s.card}>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead><tr><th>Name</th><th>Email</th><th>Registered</th><th>Status</th><th className={s.right}>Action</th></tr></thead>
            <tbody>
              {shown.map((u) => (
                <tr key={u.id}>
                  <td><span className={s.userCell}><span className={s.avatarSm}>{u.name.split(" ").map((p) => p[0]).join("")}</span>{u.name}</span></td>
                  <td>{u.email}</td><td>{u.registered}</td><td><Badge v={u.status} /></td>
                  <td className={s.right}><button className={s.btnGhost} onClick={() => toggle(u)}>{u.status === "Suspended" ? "Reactivate" : "Suspend"}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {shown.length === 0 && <p className={s.empty}>No users match your search or filter.</p>}
      </div>
    </>
  );
}

/* ---------- settings ---------- */
function Settings({ username, setUsername, log }) {
  const [name, setName] = useState(username);
  const [nameErr, setNameErr] = useState("");
  const [pw, setPw] = useState({ cur: "", next: "", conf: "" });
  const [pwErr, setPwErr] = useState({});

  const saveName = (e) => {
    e.preventDefault();
    const v = name.trim();
    if (v.length < 3) return setNameErr("Username must be at least 3 characters.");
    if (!/^[\w.\- ]+$/.test(v)) return setNameErr("Use letters, numbers, spaces, dots, dashes or underscores.");
    setNameErr(""); setUsername(v); log("Username updated (mock)");
  };
  const savePw = (e) => {
    e.preventDefault();
    const er = {};
    if (!pw.cur) er.cur = "Enter your current password.";
    if (pw.next.length < 8) er.next = "Use at least 8 characters.";
    else if (pw.next === pw.cur) er.next = "New password must differ from the current one.";
    if (pw.conf !== pw.next) er.conf = "Passwords don’t match.";
    setPwErr(er);
    if (Object.keys(er).length) return;
    setPw({ cur: "", next: "", conf: "" });
    log("Password form validated. Nothing was stored — mock only.");
  };
  const pwField = (k, l) => (
    <label className={s.field}><span>{l}</span>
      <input type="password" autoComplete="off" value={pw[k]} onChange={(e) => setPw({ ...pw, [k]: e.target.value })} />
      {pwErr[k] && <em className={s.err}>{pwErr[k]}</em>}
    </label>
  );
  return (
    <div className={s.settingsGrid}>
      <form className={s.card + " " + s.pad} onSubmit={saveName} noValidate>
        <h3 className={s.cardTitle}>Profile</h3>
        <p className={s.muted}>Your display name in the dashboard.</p>
        <label className={s.field}><span>Username</span>
          <input value={name} onChange={(e) => setName(e.target.value)} />
          {nameErr && <em className={s.err}>{nameErr}</em>}
        </label>
        <button className={s.btnPrimary} type="submit">Update username</button>
      </form>
      <form className={s.card + " " + s.pad} onSubmit={savePw} noValidate>
        <h3 className={s.cardTitle}>Change password</h3>
        <p className={s.muted}>Demo form only. No credentials are saved or changed on a server.</p>
        {pwField("cur", "Current password")}
        {pwField("next", "New password")}
        {pwField("conf", "Confirm new password")}
        <button className={s.btnPrimary} type="submit">Update password</button>
      </form>
    </div>
  );
}

/* ---------- overview ---------- */
function Overview({ counts, activity, go }) {
  const max = Math.max(...counts.map((c) => c.n), 1);
  return (
    <>
      <div className={s.stats}>
        {counts.map((c) => (
          <button key={c.id} className={`${s.card} ${s.stat}`} onClick={() => go(c.id)}>
            <span className={s.statIcon}><Icon n={c.icon} /></span>
            <span className={s.statLabel}>{c.label}</span>
            <strong className={s.statNum}>{c.n}</strong>
            <span className={s.muted}>{c.sub}</span>
          </button>
        ))}
      </div>
      <div className={s.twoCol}>
        <div className={s.card}>
          <div className={s.cardHead}><h3>Content breakdown</h3><span className={s.muted}>Records per section</span></div>
          <div className={s.bars}>
            {counts.map((c) => (
              <div key={c.id} className={s.barRow}>
                <span>{c.label}</span>
                <div className={s.barTrack}><div className={s.barFill} style={{ width: `${(c.n / max) * 100}%` }} /></div>
                <b>{c.n}</b>
              </div>
            ))}
          </div>
        </div>
        <div className={s.card}>
          <div className={s.cardHead}><h3>Recent activity</h3></div>
          <ul className={s.activity}>
            {activity.length === 0 && <li className={s.muted}>Changes you make will show up here.</li>}
            {activity.map((a) => (
              <li key={a.id}><span className={s.statIcon}><Icon n="bell" size={15} /></span><div><b>{a.msg}</b><small>{a.time}</small></div></li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

/* ---------- main ---------- */
export default function Admin() {
  const [data, setData] = useState(INITIAL);
  const [users, setUsers] = useState(USERS);
  const [params, setParams] = useSearchParams();
  const section = params.get("section");
  const page = NAV.some((n) => n[0] === section) ? section : "overview";
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("Admin Selam");
  const [toasts, setToasts] = useState([]);
  const [activity, setActivity] = useState([]);
  const ref = useRef(data);
  ref.current = data;

  // release any remaining object URLs on unmount
  useEffect(() => () => Object.values(ref.current).flat().forEach((r) => r.media?.forEach(revoke)), []);

  const log = (msg, type = "ok") => {
    const id = uid();
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
    setActivity((a) => [{ id, msg, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }, ...a].slice(0, 6));
  };
  const setRows = (key) => (rows) => setData((d) => ({ ...d, [key]: rows }));
  const go = (p) => { setParams(p === "overview" ? {} : { section: p }); setOpen(false); window.scrollTo?.(0, 0); };

  const counts = [
    { id: "donations", label: "Total donations", icon: "gift", n: data.donations.length, sub: `$${data.donations.reduce((a, d) => a + Number(d.amount), 0).toLocaleString()} raised` },
    { id: "partners", label: "Partners", icon: "briefcase", n: data.partners.length, sub: "Active organizations" },
    { id: "families", label: "Families", icon: "home", n: data.families.length, sub: `${data.families.reduce((a, d) => a + Number(d.members), 0)} people supported` },
    { id: "friends", label: "Friends items", icon: "heart", n: data.friends.length, sub: "Stories and text" },
    { id: "announcements", label: "Announcements", icon: "bell", n: data.announcements.length, sub: `${data.announcements.filter((a) => a.status === "Published").length} published` },
    { id: "users", label: "Registered users", icon: "users", n: users.length, sub: `${users.filter((u) => u.status === "Active").length} active` },
  ];
  const current = NAV.find((n) => n[0] === page);
  const initials = username.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className={s.shell}>
      {open && <div className={s.scrim} onClick={() => setOpen(false)} />}
      <aside className={`${s.sidebar} ${open ? s.sidebarOpen : ""}`}>
        <div className={s.brand}>
          <span className={s.logo}><Icon n="heart" size={18} /></span>
          <div><b>Admin</b><small>Control panel</small></div>
        </div>
        <nav className={s.nav}>
          <span className={s.navGroup}>Manage</span>
          {NAV.map(([id, label, icon]) => (
            <button key={id} className={`${s.navItem} ${page === id ? s.navActive : ""}`} onClick={() => go(id)} aria-current={page === id ? "page" : undefined}>
              <Icon n={icon} /> {label}
            </button>
          ))}
        </nav>
        <div className={s.profile}>
          <span className={s.avatar}>{initials}</span>
          <div><b>{username}</b><small>Administrator</small></div>
          <button className={s.iconBtn} onClick={() => log("Sign out is disabled in this mock", "info")} aria-label="Sign out"><Icon n="logout" size={16} /></button>
        </div>
      </aside>

      <div className={s.main}>
        <header className={s.topbar}>
          <button className={`${s.iconBtn} ${s.burger}`} onClick={() => setOpen(true)} aria-label="Open menu"><Icon n="menu" /></button>
          <span className={s.crumb}>{current[1]}</span>
          <span className={s.avatar}>{initials}</span>
        </header>

        <main className={s.content}>
          <div className={s.pageHead}>
            <div>
              <h1>{page === "overview" ? "Platform Overview" : current[1]}</h1>
              <p>{page === "overview" ? "A live snapshot of everything on your platform. Data is temporary and resets on reload." : `View, add, edit and remove ${current[1].toLowerCase()}.`}</p>
            </div>
          </div>

          {page === "overview" && <Overview counts={counts} activity={activity} go={go} />}
          {CONFIG[page] && <Manager key={page} id={page} rows={data[page]} setRows={setRows(page)} log={log} />}
          {page === "users" && <Users users={users} setUsers={setUsers} log={log} />}
          {page === "settings" && <Settings username={username} setUsername={setUsername} log={log} />}
        </main>
      </div>

      <div className={s.toasts} aria-live="polite">
        {toasts.map((t) => <div key={t.id} className={`${s.toast} ${t.type === "info" ? s.toastInfo : ""}`}>{t.msg}</div>)}
      </div>
    </div>
  );
}