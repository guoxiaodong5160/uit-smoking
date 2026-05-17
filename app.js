const MIN = 60*1000, HOUR = 60*MIN, DAY = 24*HOUR, YEAR = 365*DAY;
const APP_KEY = 'qsmk_v3';
const DEMO_MODE = new URLSearchParams(location.search).has('demo');
const APP_VERSION = 6;

// ─── Organ Data ───────────────────────────────────────────────
const ORGANS = [
  {
    id:'heart', name:'心脏', emoji:'❤️',
    milestones:[
      {time:0,         pct:0},
      {time:20*MIN,    pct:10, title:'血压心率恢复正常',     benefits:['尼古丁引起的心跳加速消失','血压开始回归正常范围','心肌供血条件初步改善']},
      {time:DAY,       pct:22, title:'心脏病发作风险开始降低', benefits:['血液携氧能力提升','心脏供血更加稳定','心率变异性改善，心律更规则']},
      {time:7*DAY,     pct:35, title:'心脏功能稳步提升',     benefits:['运动时心脏表现明显改善','心律更加稳定有力','轻度运动不再感到胸闷']},
      {time:YEAR,      pct:65, title:'冠心病风险降低一半',   benefits:['冠状动脉硬化速度大幅减缓','心肌梗塞风险降低50%','心脏整体功能显著提升']},
      {time:15*YEAR,   pct:100,title:'心血管健康与常人相同', benefits:['完全消除吸烟带来的心血管风险','心脏功能媲美从未吸烟者','心脏寿命大幅延长']},
    ]
  },
  {
    id:'lung', name:'肺部', emoji:'🫁',
    milestones:[
      {time:0,        pct:0},
      {time:3*DAY,    pct:15, title:'支气管开始放松',   benefits:['气道痉挛减少，呼吸顺畅感增加','气道黏液分泌量开始减少','呼吸时的胸闷感逐渐消失']},
      {time:30*DAY,   pct:35, title:'咳嗽痰液明显减少', benefits:['肺部纤毛开始重建，恢复清洁功能','早晨起来不再大量咳痰','呼吸道感染次数减少']},
      {time:90*DAY,   pct:60, title:'肺功能提升约30%',  benefits:['深呼吸时已不再感到费力','运动耐力明显提升','肺活量持续增加']},
      {time:YEAR,     pct:78, title:'肺部自洁系统恢复', benefits:['纤毛完全重建，肺清洁能力恢复','肺活量接近同龄非吸烟者','爬楼、快走轻松自如']},
      {time:10*YEAR,  pct:100,title:'肺癌风险减少一半', benefits:['肺癌风险已降至不吸烟者的一半','慢性阻塞性肺病风险大幅降低','肺部功能全面恢复健康']},
    ]
  },
  {
    id:'blood', name:'血液', emoji:'🩸',
    milestones:[
      {time:0,       pct:0},
      {time:8*HOUR,  pct:40, title:'一氧化碳已清除',   benefits:['血液携氧能力恢复正常','血液颜色变得更加鲜红','全身细胞获得充足氧气供应']},
      {time:2*DAY,   pct:70, title:'尼古丁基本清除',   benefits:['血液中尼古丁及代谢物基本消除','血小板黏稠度开始降低','血流阻力减小，循环更顺畅']},
      {time:14*DAY,  pct:100,title:'血液循环完全改善', benefits:['血液黏稠度完全恢复正常','微循环显著改善，手脚不再冰凉','全身营养输送效率大幅提升']},
    ]
  },
  {
    id:'brain', name:'大脑', emoji:'🧠',
    milestones:[
      {time:0,        pct:0},
      {time:3*DAY,    pct:10, title:'尼古丁受体开始恢复', benefits:['对尼古丁的强烈渴望开始减弱','大脑多巴胺系统启动自然修复','注意力集中度有所提升']},
      {time:30*DAY,   pct:30, title:'情绪趋于平稳',     benefits:['情绪波动明显减少','焦虑感开始降低','睡眠质量有所改善']},
      {time:90*DAY,   pct:55, title:'焦虑感明显减少',   benefits:['大脑奖励系统逐渐恢复自然状态','记忆力和专注力明显提升','心情更加稳定舒畅']},
      {time:180*DAY,  pct:80, title:'压力感知恢复正常', benefits:['压力应对能力大幅增强','情绪管理更加得心应手','精神状态清晰、充满活力']},
      {time:YEAR,     pct:100,title:'大脑功能完全恢复', benefits:['神经递质系统完全平衡','思维敏捷，反应更加灵敏','彻底告别对香烟的心理依赖']},
    ]
  },
  {
    id:'sense', name:'嗅觉味觉', emoji:'👃',
    milestones:[
      {time:0,      pct:0},
      {time:2*DAY,  pct:30, title:'嗅觉开始苏醒',     benefits:['开始闻到以前感知不到的细微气味','味蕾对苦甜的感知逐步恢复','食物开始散发出真实的香气']},
      {time:3*DAY,  pct:55, title:'味觉明显改善',     benefits:['食物的味道变得更加鲜明丰富','甜、咸、酸、鲜的感知全面增强','进餐时的愉悦感大幅提升']},
      {time:7*DAY,  pct:80, title:'嗅觉味觉基本恢复', benefits:['能分辨食物之间的细微差别','对花香、自然气息的感知回归','生活中的嗅觉享受大幅提升']},
      {time:30*DAY, pct:100,title:'嗅觉味觉完全恢复', benefits:['嗅觉敏感度达到非吸烟者水平','对变质食物的预警能力恢复','饮食体验焕然一新，食欲大增']},
    ]
  },
  {
    id:'skin', name:'皮肤', emoji:'✨',
    milestones:[
      {time:0,        pct:0},
      {time:3*DAY,    pct:10, title:'皮肤供氧开始改善', benefits:['皮肤细胞获得更多的氧气供给','面部微循环开始改善','皮肤干燥感逐渐减轻']},
      {time:30*DAY,   pct:35, title:'肤色开始好转',    benefits:['皮肤暗黄现象明显减轻','面色变得更加红润均匀','皮肤弹性有所改善']},
      {time:90*DAY,   pct:65, title:'皮肤焕然改善',    benefits:['胶原蛋白生成量增加','皱纹生长速度大幅减缓','皮肤光泽度和水润度明显提升']},
      {time:180*DAY,  pct:100,title:'皮肤完全焕新',    benefits:['皮肤老化速度恢复至正常水平','皮肤癌等风险明显降低','整体气色、容颜焕然一新']},
    ]
  },
  {
    id:'stamina', name:'体力', emoji:'💪',
    milestones:[
      {time:0,        pct:0},
      {time:14*DAY,   pct:20, title:'血液循环带动体力提升', benefits:['四肢末梢血液循环改善','手脚冰凉的情况逐渐好转','轻度运动时不再很快气喘']},
      {time:30*DAY,   pct:45, title:'运动耐力明显提升',    benefits:['可以坚持更长时间的有氧运动','爬楼梯等日常活动更加轻松','运动后的恢复时间明显缩短']},
      {time:90*DAY,   pct:75, title:'体力显著增强',        benefits:['运动耐力媲美同龄非吸烟者','肌肉获得更充足的氧气供应','整体精力水平大幅跃升']},
      {time:180*DAY,  pct:100,title:'体力恢复最佳状态',    benefits:['体力达到同龄非吸烟者水平','运动表现大幅提升','身体充满活力，精力十足']},
    ]
  },
  {
    id:'immune', name:'免疫力', emoji:'🛡️',
    milestones:[
      {time:0,        pct:0},
      {time:30*DAY,   pct:20, title:'免疫系统开始修复', benefits:['白细胞活性开始提升','感冒后恢复速度加快','伤口愈合能力有所改善']},
      {time:90*DAY,   pct:45, title:'感染风险明显降低', benefits:['呼吸道感染次数减少','口腔和牙龈健康改善','免疫细胞数量和活力提升']},
      {time:180*DAY,  pct:70, title:'免疫力大幅提升',   benefits:['整体抗病能力接近非吸烟者','过敏反应减轻','身体自我修复能力显著增强']},
      {time:YEAR,     pct:100,title:'免疫力完全恢复',   benefits:['免疫系统达到健康非吸烟者水平','多种癌症风险明显降低','身体防御系统全面恢复最佳']},
    ]
  },
];

// Organ button positions (top%, left%) — center of each button.
// With margin-left:-7.5% / margin-top:-7.5% and width/height:15%,
// button edges = position ± 7.5%. All values kept in [12%, 86%] to stay fully inside container.
const ORGAN_POSITIONS = [
  {top:'12%', left:'30%'},   // heart  — top-left
  {top:'12%', left:'62%'},   // lung   — top-right
  {top:'38%', left:'12%'},   // blood  — left-upper
  {top:'38%', left:'82%'},   // brain  — right-upper
  {top:'62%', left:'12%'},   // sense  — left-lower
  {top:'62%', left:'82%'},   // skin   — right-lower
  {top:'84%', left:'28%'},   // stamina — bottom-left
  {top:'84%', left:'66%'},   // immune  — bottom-right
];

const ORGAN_ATLAS_POSITIONS = {
  heart:   {top:'12%', left:'29%'},
  lung:    {top:'12%', left:'58%'},
  blood:   {top:'36%', left:'8%'},
  brain:   {top:'36%', left:'76%'},
  sense:   {top:'60%', left:'8%'},
  skin:    {top:'60%', left:'76%'},
  stamina: {top:'78%', left:'30%'},
  immune:  {top:'78%', left:'57%'},
};

const ORGAN_ICONS = {
  heart: `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 27S5 19.8 5 11.7C5 8.1 7.4 6 10.4 6c2.1 0 3.9 1.2 5.1 3.1C16.8 7.2 18.7 6 20.8 6 23.8 6 27 8.2 27 12.1 27 20 16 27 16 27Z" fill="currentColor" opacity=".92"/><path d="M9 13.4h4l1.5-3.2 3 7 1.7-3.8H23" fill="none" stroke="white" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" opacity=".8"/></svg>`,
  lung: `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M15.1 4.8v8.1c-1.4.7-2.5 1.7-3.3 3.2" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/><path d="M16.9 4.8v8.1c1.4.7 2.5 1.7 3.3 3.2" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" opacity=".82"/><path d="M14.1 11.4c-4.7 2.3-7.6 6.1-7.6 10.5 0 4.1 2.5 6.3 5.6 5.6 2.4-.5 3.1-2.4 3.1-5.1V12.5c0-.8-.5-1.4-1.1-1.1Z" fill="currentColor" opacity=".84"/><path d="M17.9 11.4c4.7 2.3 7.6 6.1 7.6 10.5 0 4.1-2.5 6.3-5.6 5.6-2.4-.5-3.1-2.4-3.1-5.1V12.5c0-.8.5-1.4 1.1-1.1Z" fill="currentColor" opacity=".70"/><path d="M11 19.3c1.9-2.2 3.2-3 5-3s3.1.8 5 3M12 23c1.2-.9 2.2-1.2 3.2-1.2m4.8 1.2c-1.2-.9-2.2-1.2-3.2-1.2" fill="none" stroke="white" stroke-width="1.45" stroke-linecap="round" opacity=".72"/></svg>`,
  blood: `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 4s8 9.2 8 15.2A8 8 0 0 1 8 19.2C8 13.2 16 4 16 4Z" fill="currentColor" opacity=".9"/><path d="M12 20.5c0 2 1.5 3.7 3.7 4.1" fill="none" stroke="white" stroke-width="1.7" stroke-linecap="round" opacity=".72"/></svg>`,
  brain: `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M12.2 7.7c1.4-2.4 5.1-2.4 6.5-.1 2.1-.8 4.8.5 5.3 3 .2.7.1 1.4-.1 2.1 2.2 1.1 3 4 1.8 6.1-.5.9-1.2 1.5-2.1 1.9.1 2.8-2.2 5.2-5.1 5.2-1 0-1.9-.3-2.6-.8-.8.6-1.8.9-2.9.9-2.9 0-5.1-2.3-5-5.1-1.6-.8-2.6-2.3-2.6-4.1 0-1.8 1-3.4 2.6-4.2-.5-2.5 1.4-4.9 4.2-4.9Z" fill="currentColor" opacity=".84"/><path d="M15.9 7.2v17.3M11.5 11.3c1.8-.8 3.6-.1 4.4 1.5m.1 0c1-1.8 3.2-2.3 5-1.1m-10.8 4.6c2.1-.9 4.1-.3 5.2 1.3m.9 0c1.4-1.6 3.7-1.9 5.5-.5m-11.1 4.1c1.6.5 3.5.1 4.7-1.3m1.3 0c1.2 1.4 3.3 1.8 4.9.9" fill="none" stroke="white" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" opacity=".70"/></svg>`,
  sense: `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M17.2 4.6c-3 2-4.5 5.1-4.5 9.1v5.4c0 2.3-1.3 4-3.5 5.1 1.2 1.4 3 2.2 5.5 2.2 4.3 0 7.4-2.6 7.4-6.8 0-2.8-1.4-4.6-4.1-5.6V5.3c0-.7-.4-1.1-.8-.7Z" fill="currentColor" opacity=".84"/><path d="M17.5 10.2c2.8.1 5 2.1 5 5.1 0 1.9-.8 3.3-2.3 4.3m-6.7 3.1c2.9.4 5.4-.7 6.8-2.9" fill="none" stroke="white" stroke-width="1.45" stroke-linecap="round" opacity=".72"/><path d="M8.5 10.7c1.3-.9 2.2-.9 3.4 0m-4.8-3c1.8-1.4 4.2-1.4 6 0" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" opacity=".70"/></svg>`,
  skin: `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 5l2.7 6.8L26 14.5l-7.3 2.7L16 25l-2.7-7.8L6 14.5l7.3-2.7L16 5Z" fill="currentColor" opacity=".86"/><path d="M25 6l.9 2.5L28 9.4l-2.1.9L25 13l-.9-2.7-2.1-.9 2.1-.9L25 6Z" fill="currentColor" opacity=".52"/></svg>`,
  stamina: `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M11.2 24.8c-2.2-1.6-3.7-4.2-3.7-7.2 0-4.7 3.7-8.6 8.5-8.6s8.5 3.9 8.5 8.6c0 3-1.5 5.6-3.7 7.2" fill="none" stroke="currentColor" stroke-width="2.9" stroke-linecap="round"/><path d="M16 5.8v12.1l5.2-4.7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M10.7 17.8h2.8l1.2-2.4 2.5 5.2 1.3-2.8h2.8" fill="none" stroke="white" stroke-width="1.45" stroke-linecap="round" stroke-linejoin="round" opacity=".78"/><path d="M12.4 25.3h7.2" stroke="currentColor" stroke-width="2.7" stroke-linecap="round" opacity=".72"/></svg>`,
  immune: `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 4l9 3.4v7.2c0 6-3.8 10.6-9 13.4-5.2-2.8-9-7.4-9-13.4V7.4L16 4Z" fill="currentColor" opacity=".86"/><path d="M16 9v12m-5.2-6H21.2" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round" opacity=".75"/></svg>`,
};

const ORGAN_COLORS = {
  heart: '#ef4444',
  lung: '#f2a6a8',
  blood: '#b91c1c',
  brain: '#a78bfa',
  sense: '#2dd4bf',
  skin: '#f8c76b',
  stamina: '#60a5fa',
  immune: '#f59e0b',
};

// ─── Achievements ─────────────────────────────────────────────
const ACHIEVEMENTS = [
  {id:'a_1h',   time:HOUR,      name:'第1小时', desc:'稳定开始', icon:'🧊'},
  {id:'a_1d',   time:DAY,       name:'第一天',  desc:'1天',    icon:'🌅'},
  {id:'a_3d',   time:3*DAY,     name:'第三天',  desc:'渴望下降', icon:'⚡'},
  {id:'a_1w',   time:7*DAY,     name:'一周稳定',desc:'1周',    icon:'🔥'},
  {id:'a_2w',   time:14*DAY,    name:'循环改善',desc:'2周',    icon:'⚔️'},
  {id:'a_1m',   time:30*DAY,    name:'一个月',  desc:'自控建立', icon:'👑'},
  {id:'a_3m',   time:90*DAY,    name:'三个月',  desc:'肺功能提升', icon:'🥇'},
  {id:'a_6m',   time:180*DAY,   name:'半年期',  desc:'状态重建', icon:'💎'},
  {id:'a_1y',   time:YEAR,      name:'一年期',  desc:'长期保持', icon:'🌟'},
  {id:'a_m100', money:100,      name:'节省 ¥100', desc:'少买几包', icon:'💰'},
  {id:'a_m500', money:500,      name:'节省 ¥500', desc:'可见收益', icon:'💵'},
  {id:'a_m1k',  money:1000,     name:'节省 ¥1000',desc:'一笔预算', icon:'💴'},
  {id:'a_m5k',  money:5000,     name:'节省 ¥5000',desc:'长期收益', icon:'🤑'},
  {id:'a_m10k', money:10000,    name:'节省 ¥10000',desc:'年度回报', icon:'🏦'},
];

// ─── Health milestones for home tab ───────────────────────────
// ─── Daily Motivational Quotes ──────────────────────────────
const DAILY_QUOTES = [
  '每一次深呼吸，都是身体在感谢你的选择。',
  '你不是在放弃什么，而是在重新获得自由。',
  '戒烟不是失去快乐，而是找回真正的快乐。',
  '今天的坚持，是明天健康的基石。',
  '你的身体正在一点点修复，每一秒都算数。',
  '烟瘾只是过客，而你的意志才是主人。',
  '没有人能替你呼吸，也没有人能替你坚强。',
  '最难的不是开始，而是每天都重新选择坚持。',
  '你已经证明了自己比烟瘾更强大。',
  '每一支没抽的烟，都是给未来自己的礼物。',
  '你的肺正在悄悄变粉，虽然你看不见。',
  '清晨的第一口空气，比任何香烟都香。',
  '孩子模仿的不是你说的话，而是你做的事。',
  '自律给你的不是束缚，而是自由。',
  '一年后的你回头看，会发现今天咬牙坚持的那一刻，才是整个人生真正开始改变的起点。',
  '身体是灵魂的神殿，值得被好好对待。',
  '你不需要完美，只需要不放弃。',
  '每一天不吸烟，你都在创造新的纪录。',
  '烟瘾在减弱，而你在变强。',
  '呼吸自由的感觉，是金钱买不到的奢侈品。',
  '把买烟的钱存起来，犒赏坚持的自己。',
  '你的心脏跳得更有力了，能感受到吗？',
  '人生最好的投资，就是投资自己的健康。',
  '走过最难的那几天，后面的路越来越宽。',
  '你比自己想象的更有韧性。',
  '不是每一天都容易，但每一天都值得。',
  '嗅觉味觉在回来，世界又多了一层色彩。',
  '戒烟是你送给家人最好的礼物。',
  '每次想抽烟的时候，想想你已经走了多远。',
  '坚持本身就是一种胜利，今天你又赢了。',
  '你正在书写一个关于重生的故事。',
];

const HEALTH_MS = [
  {time:20*MIN,  name:'血压心率恢复正常'},
  {time:8*HOUR,  name:'血液一氧化碳恢复正常'},
  {time:DAY,     name:'心脏病风险开始降低'},
  {time:2*DAY,   name:'嗅觉味觉开始恢复'},
  {time:3*DAY,   name:'支气管开始放松'},
  {time:14*DAY,  name:'血液循环完全改善'},
  {time:30*DAY,  name:'咳嗽痰液明显减少'},
  {time:90*DAY,  name:'肺功能提升 30%'},
  {time:180*DAY, name:'压力水平恢复正常'},
  {time:YEAR,    name:'冠心病风险降低一半'},
];

// ─── State ────────────────────────────────────────────────────
const DEFAULT_STATE = {
  version: APP_VERSION,
  quitDate: null,
  cigarettesPerDay: 20,
  pricePerPack: 25,
  cigarettesPerPack: 20,
  unlockedAchievements: {},
};

let state = {...DEFAULT_STATE};

function clampNumber(value, min, max, fallback) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

function parseDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function normalizeState(raw) {
  const next = {...DEFAULT_STATE, ...(raw || {})};
  next.version = APP_VERSION;
  next.cigarettesPerDay = Math.round(clampNumber(next.cigarettesPerDay, 1, 200, DEFAULT_STATE.cigarettesPerDay));
  next.pricePerPack = clampNumber(next.pricePerPack, 1, 1000, DEFAULT_STATE.pricePerPack);
  next.cigarettesPerPack = Math.round(clampNumber(next.cigarettesPerPack, 1, 100, DEFAULT_STATE.cigarettesPerPack));
  next.unlockedAchievements = next.unlockedAchievements && typeof next.unlockedAchievements === 'object'
    ? next.unlockedAchievements
    : {};
  return next;
}

function loadState() {
  if (DEMO_MODE) return;
  try {
    const s = localStorage.getItem(APP_KEY);
    if (s) state = normalizeState(JSON.parse(s));
  } catch(e) {}
}
function saveState() {
  if (DEMO_MODE) return;
  try {
    state.version = APP_VERSION;
    state.updatedAt = new Date().toISOString();
    localStorage.setItem(APP_KEY, JSON.stringify(state));
  } catch(e) {
    showToast('保存失败，请检查浏览器存储权限');
  }
}

// ─── Stats calculation ────────────────────────────────────────
function calcStats() {
  if (!state.quitDate) return null;
  const quitDate = parseDate(state.quitDate);
  if (!quitDate) return null;
  const elapsed = Date.now() - quitDate.getTime();
  if (elapsed < 0) return null;
  const totalSec = Math.floor(elapsed / 1000);
  const totalMin = Math.floor(elapsed / MIN);
  const totalDay = Math.floor(elapsed / DAY);
  const cigsPerDay = clampNumber(state.cigarettesPerDay, 1, 200, DEFAULT_STATE.cigarettesPerDay);
  const pricePerPack = clampNumber(state.pricePerPack, 1, 1000, DEFAULT_STATE.pricePerPack);
  const cigarettesPerPack = clampNumber(state.cigarettesPerPack, 1, 100, DEFAULT_STATE.cigarettesPerPack);
  const cigsAvoided = Math.floor(cigsPerDay / (24*60) * totalMin);
  const pricePerCig = pricePerPack / cigarettesPerPack;
  const moneySaved  = cigsAvoided * pricePerCig;
  // 10mg tar / cig, 1mg nicotine / cig
  const tarMg  = cigsAvoided * 10;
  const nicMg  = cigsAvoided * 1;
  const minsRegained = cigsAvoided * 11;
  return {
    elapsed, totalDay,
    hours:   Math.floor(elapsed / HOUR) % 24,
    minutes: Math.floor(elapsed / MIN)  % 60,
    seconds: totalSec % 60,
    cigsAvoided, moneySaved, tarMg, nicMg,
    hoursRegained: (minsRegained / 60).toFixed(1),
    daysRegained:  (minsRegained / (60*24)).toFixed(1),
    coCleared: elapsed >= 8*HOUR,
  };
}

// ─── Organ recovery ───────────────────────────────────────────
function organPct(organ, elapsed) {
  const ms = organ.milestones;
  if (!elapsed || elapsed <= 0) return 0;
  if (elapsed >= ms[ms.length-1].time) return 100;
  for (let i = 1; i < ms.length; i++) {
    if (elapsed <= ms[i].time) {
      const t = (elapsed - ms[i-1].time) / (ms[i].time - ms[i-1].time);
      return ms[i-1].pct + t * (ms[i].pct - ms[i-1].pct);
    }
  }
  return 0;
}

function recoveryColor(pct) {
  if (pct < 25) return '#f97316';
  if (pct < 50) return '#f59e0b';
  if (pct < 75) return '#3b82f6';
  return '#10b981';
}

function recoveryStatus(pct) {
  if (pct < 10)  return '刚开始恢复';
  if (pct < 25)  return '初步改善中';
  if (pct < 50)  return '稳步恢复中';
  if (pct < 75)  return '明显好转 ↑';
  if (pct < 90)  return '大幅改善 ↑↑';
  if (pct < 100) return '接近完全恢复';
  return '✅ 完全恢复！';
}

function organColor(organ, pct) {
  return ORGAN_COLORS[organ.id] || recoveryColor(pct);
}

// ─── SVG ring ─────────────────────────────────────────────────
function ringHTML(pct, color, size) {
  size = size || 100;
  const r  = size * 0.42;
  const c  = 2 * Math.PI * r;
  const cx = size / 2, cy = size / 2;
  const sw = size * 0.09;
  const trackColor = 'rgba(255,255,255,0.08)';
  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${trackColor}" stroke-width="${sw}"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="${sw}"
      stroke-linecap="round"
      stroke-dasharray="${c.toFixed(2)}"
      stroke-dashoffset="${(c*(1-pct/100)).toFixed(2)}"
      transform="rotate(-90 ${cx} ${cy})"/>
  </svg>`;
}

// ─── UI Update (home) ─────────────────────────────────────────
let currentTab = 'home';

function updateUI() {
  const st = calcStats();
  if (!st) {
    renderEmptyHome();
    return;
  }

  // Timer
  document.getElementById('hero-label').textContent = '🌿 你已经戒烟';
  document.getElementById('c-days').textContent = st.totalDay;
  const h = String(st.hours).padStart(2,'0');
  const m = String(st.minutes).padStart(2,'0');
  const s = String(st.seconds).padStart(2,'0');
  document.getElementById('c-hms').textContent = `${h} 时 ${m} 分 ${s} 秒`;

  // Tar
  const tar = st.tarMg;
  document.getElementById('s-tar').textContent = tar >= 1000 ? (tar/1000).toFixed(1)+'g' : tar+'mg';

  // Nicotine
  const nic = st.nicMg;
  document.getElementById('s-nic').textContent = nic >= 1000 ? (nic/1000).toFixed(1)+'g' : nic+'mg';

  // CO
  document.getElementById('s-co').textContent = st.coCleared ? '已清除 ✓' : '清除中...';

  // Money
  const mo = st.moneySaved;
  document.getElementById('s-money').textContent = '¥'+(mo>=10000?(mo/10000).toFixed(1)+'w':mo>=1000?(mo/1000).toFixed(1)+'k':mo.toFixed(0));

  // Cigs
  const cg = st.cigsAvoided;
  document.getElementById('s-cigs').textContent = (cg>=10000?(cg/10000).toFixed(1)+'w':cg>=1000?(cg/1000).toFixed(1)+'k':cg)+'支';

  // Life
  const lh = parseFloat(st.hoursRegained);
  document.getElementById('s-life').textContent = lh >= 24 ? st.daysRegained+'天' : lh+'时';

  updateNextMs(st.elapsed);
  updateDailyQuote(st.totalDay);

  if (currentTab === 'organs' && selectedOrganId) {
    updateOrganList();
    updateCenterDisplay(selectedOrganId, st.elapsed);
    updateInfoPanel(selectedOrganId, st.elapsed);
  }

  checkAchievements(st);
}

function renderEmptyHome() {
  document.getElementById('hero-label').textContent = '🌿 准备开始戒烟';
  document.getElementById('c-days').textContent = '0';
  document.getElementById('c-hms').textContent = '00 时 00 分 00 秒';
  document.getElementById('c-since').textContent = '在「设置」里填写戒烟开始时间后自动计时';
  document.getElementById('s-tar').textContent = '0mg';
  document.getElementById('s-nic').textContent = '0mg';
  document.getElementById('s-co').textContent = '未开始';
  document.getElementById('s-money').textContent = '¥0';
  document.getElementById('s-cigs').textContent = '0支';
  document.getElementById('s-life').textContent = '0时';
  document.getElementById('next-ms-card').innerHTML = '在「设置」里填写戒烟开始时间后，这里会显示下一健康里程碑。';
  const heroFill = document.getElementById('hero-progress-fill');
  const heroNext = document.getElementById('hero-next');
  if (heroFill) heroFill.style.width = '0%';
  if (heroNext) heroNext.textContent = '去设置页填写戒烟开始时间';
  updateDailyQuote(0);

  if (currentTab === 'organs') {
    updateOrganList();
    if (selectedOrganId) {
      updateCenterDisplay(selectedOrganId, 0);
      updateInfoPanel(selectedOrganId, 0);
    }
  }
}

function updateNextMs(elapsed) {
  const el = document.getElementById('next-ms-card');
  const heroFill = document.getElementById('hero-progress-fill');
  const heroNext = document.getElementById('hero-next');
  let last = null, next = null;
  for (const m of HEALTH_MS) {
    if (elapsed >= m.time) last = m;
    else { next = m; break; }
  }
  let html = '';
  if (last) html += `✅ <span style="color:#10b981;font-weight:700">${last.name}</span><br>`;
  if (next)
    html += `⏳ 距「<span style="color:#f59e0b;font-weight:700">${next.name}</span>」还有 ${fmtDur(next.time-elapsed)}`;
  else
    html = `🌟 <span style="color:#10b981;font-weight:700">已完成所有主要健康里程碑！</span>`;
  el.innerHTML = html;

  if (heroFill && heroNext) {
    if (next) {
      const prevTime = last ? last.time : 0;
      const pct = Math.max(0, Math.min(100, (elapsed - prevTime) / (next.time - prevTime) * 100));
      heroFill.style.width = pct + '%';
      heroNext.textContent = `下一阶段：${next.name}`;
    } else {
      heroFill.style.width = '100%';
      heroNext.textContent = '主要健康里程碑已完成';
    }
  }
}

function fmtDur(ms) {
  const d=Math.floor(ms/DAY), h=Math.floor((ms%DAY)/HOUR), m=Math.floor((ms%HOUR)/MIN);
  if (d>0) return `${d}天${h}小时`; if (h>0) return `${h}小时${m}分`; return `${m}分钟`;
}

function fmtMsTime(ms) {
  const y=ms/YEAR, d=ms/DAY, h=ms/HOUR, m=ms/MIN;
  if (y>=1)  return Math.round(y)+'年';
  if (d>=1)  return Math.round(d)+'天';
  if (h>=1)  return Math.round(h)+'小时';
  return Math.round(m)+'分钟';
}

// ─── Daily Quote ──────────────────────────────────────────────
let lastQuoteDay = -1;
function updateDailyQuote(totalDay) {
  if (totalDay === lastQuoteDay) return;
  lastQuoteDay = totalDay;
  const idx = totalDay % DAILY_QUOTES.length;
  const el = document.getElementById('quote-text');
  const dayLabel = document.getElementById('quote-day-label');
  if (el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(4px)';
    setTimeout(() => {
      el.textContent = '「' + DAILY_QUOTES[idx] + '」';
      el.style.transition = 'opacity 0.4s, transform 0.4s';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 150);
  }
  if (dayLabel) {
    dayLabel.textContent = '第 ' + totalDay + ' 天';
  }
}

// ─── Recovery map ─────────────────────────────────────────────
let selectedOrganId = null;

function buildConstellation() {
  const container = document.getElementById('organ-list') || document.getElementById('constellation');
  if (!container || container.dataset.built === '1') return;
  container.dataset.built = '1';
  ORGANS.forEach((organ, i) => {
    const pos = ORGAN_ATLAS_POSITIONS[organ.id] || ORGAN_POSITIONS[i];
    const btn = document.createElement('button');
    btn.className = 'organ-btn';
    btn.id = `obtn-${organ.id}`;
    btn.style.top = pos.top;
    btn.style.left = pos.left;
    btn.innerHTML = `
      <span class="organ-mark">${ORGAN_ICONS[organ.id] || organ.name.slice(0, 1)}</span>
      <span class="organ-name-mini">${organ.name}</span>
      <span class="organ-pct-mini" id="opct-${organ.id}">--</span>
    `;
    btn.onclick = () => selectOrgan(organ.id);
    container.appendChild(btn);
  });
  updateOrganList();
  if (!selectedOrganId) selectOrgan('heart');
}

function updateOrganList() {
  const st = calcStats();
  const elapsed = st ? st.elapsed : 0;
  ORGANS.forEach(organ => {
    const pct = organPct(organ, elapsed);
    const col = organColor(organ, pct);
    const btn = document.getElementById(`obtn-${organ.id}`);
    if (!btn) return;
    btn.style.setProperty('--organ-color', col);
    const pctEl = document.getElementById(`opct-${organ.id}`);
    if (pctEl) pctEl.textContent = pct.toFixed(0) + '%';
  });
}

function selectOrgan(id) {
  selectedOrganId = id;
  const organ   = ORGANS.find(o => o.id === id);
  const st      = calcStats();
  const elapsed = st ? st.elapsed : 0;

  // Highlight button
  document.querySelectorAll('.organ-btn').forEach(b => b.classList.remove('selected'));
  const btn = document.getElementById(`obtn-${id}`);
  if (btn) {
    btn.classList.add('selected');
    const col = organColor(organ, organPct(organ, elapsed));
    btn.style.setProperty('--organ-color', col);
    const atlas = document.getElementById('constellation');
    if (atlas) {
      atlas.style.setProperty('--atlas-color', col);
      atlas.style.setProperty('--atlas-color-soft', `${col}2e`);
    }
  }

  updateCenterDisplay(id, elapsed);
  updateInfoPanel(id, elapsed);
}

function updateCenterDisplay(id, elapsed) {
  const organ = ORGANS.find(o => o.id === id);
  const pct   = organPct(organ, elapsed);
  const col   = organColor(organ, pct);

  const centerIcon = document.getElementById('cc-emoji');
  const centerIconSvg = ORGAN_ICONS[organ.id] || organ.emoji;
  centerIcon.innerHTML = `
    <span class="center-icon-base">${centerIconSvg}</span>
    <span class="center-icon-fill" id="center-icon-fill">${centerIconSvg}</span>
  `;
  const liquid = document.getElementById('center-liquid');
  if (liquid) {
    liquid.style.height = Math.max(4, pct) + '%';
    liquid.style.setProperty('--liquid-color', col);
  }
  const iconFill = document.getElementById('center-icon-fill');
  if (iconFill) {
    iconFill.style.height = Math.max(4, pct) + '%';
    iconFill.style.setProperty('--liquid-color', col);
  }
  const pctEl = document.getElementById('cc-pct');
  pctEl.textContent  = pct.toFixed(1) + '%';
  pctEl.style.color  = col;
  document.getElementById('cc-name').textContent = organ.name;

  // Outer ring glow color
  const outer = document.querySelector('.center-outer-ring');
  if (outer) outer.style.borderColor = col+'55';
}

function updateInfoPanel(id, elapsed) {
  const organ = ORGANS.find(o => o.id === id);
  const pct   = organPct(organ, elapsed);
  const col   = organColor(organ, pct);

  // Find current milestone
  let currentMs = organ.milestones[1];
  for (let i = organ.milestones.length-1; i >= 1; i--) {
    if (elapsed >= organ.milestones[i].time) { currentMs = organ.milestones[i]; break; }
  }

  // Hide placeholder, show content
  document.getElementById('oip-placeholder').style.display = 'none';
  const content = document.getElementById('oip-content');
  content.style.display = 'block';

  const iconEl = document.getElementById('oip-emoji');
  iconEl.innerHTML = ORGAN_ICONS[organ.id] || organ.emoji;
  iconEl.style.color = col;
  iconEl.style.background = col + '14';
  iconEl.style.borderColor = col + '28';
  document.getElementById('oip-name').textContent  = organ.name;
  const stageEl = document.getElementById('oip-stage');
  stageEl.textContent  = recoveryStatus(pct);
  stageEl.style.color  = col;
  const pctEl = document.getElementById('oip-pct');
  pctEl.textContent = pct.toFixed(1) + '%';
  pctEl.style.color = col;

  // Progress bar
  const bar = document.getElementById('oip-bar');
  bar.style.width      = pct + '%';
  bar.style.background = `linear-gradient(90deg, ${col}bb, ${col})`;

  // Current milestone title
  document.getElementById('oip-current').textContent = '✅ ' + (currentMs.title || '正在恢复中...');

  // Benefits
  const bens = currentMs.benefits || [];
  document.getElementById('oip-benefits').innerHTML = bens
    .map(b => `<div class="oip-benefit-row">${b}</div>`).join('');
}

// ─── Achievements ─────────────────────────────────────────────
function achievementReached(a, st) {
  return !!st && ((a.time && st.elapsed >= a.time) || (a.money && st.moneySaved >= a.money));
}

function renderAchievementSummary() {
  const st = calcStats();
  const unlocked = ACHIEVEMENTS.filter(a => !!state.unlockedAchievements[a.id]).length;
  const total = ACHIEVEMENTS.length;
  const pct = total ? Math.round(unlocked / total * 100) : 0;
  const unlockedEl = document.getElementById('ach-unlocked');
  const totalEl = document.getElementById('ach-total');
  const pctEl = document.getElementById('ach-percent');
  const ring = document.getElementById('ach-summary-ring');
  const nextEl = document.getElementById('ach-next');
  if (unlockedEl) unlockedEl.textContent = unlocked;
  if (totalEl) totalEl.textContent = total;
  if (pctEl) pctEl.textContent = pct + '%';
  if (ring) ring.style.setProperty('--ach-pct', pct + '%');
  if (nextEl) {
    const next = ACHIEVEMENTS.find(a => !state.unlockedAchievements[a.id]);
    if (!next) {
      nextEl.textContent = '全部成就已解锁，保持这条健康轨道';
    } else if (next.time && st) {
      nextEl.textContent = `距「${next.name}」约 ${fmtDur(Math.max(0, next.time - st.elapsed))}`;
    } else if (next.money && st) {
      nextEl.textContent = `距「${next.name}」还差 ¥${Math.max(0, next.money - st.moneySaved).toFixed(0)}`;
    } else {
      nextEl.textContent = '继续保持，下一个徽章已经在路上';
    }
  }
}

function renderAchievements() {
  document.getElementById('ach-grid').innerHTML = ACHIEVEMENTS.map(a => {
    const ul = !!state.unlockedAchievements[a.id];
    const dt = ul ? new Date(state.unlockedAchievements[a.id]) : null;
    const ds = dt ? `${dt.getMonth()+1}/${dt.getDate()}` : '';
    return `<div class="ach-item ${ul?'unlocked':'locked'}">
      <div class="ach-icon">${a.icon}</div>
      <div class="ach-name">${a.name}</div>
      <div class="ach-desc">${a.desc}</div>
      ${ul ? `<div class="ach-date">✓ ${ds}</div>` : ''}
    </div>`;
  }).join('');
  renderAchievementSummary();
}

function checkAchievements(st) {
  let newOne = null;
  ACHIEVEMENTS.forEach(a => {
    if (state.unlockedAchievements[a.id]) return;
    if (achievementReached(a, st)) {
      state.unlockedAchievements[a.id] = Date.now();
      saveState(); newOne = a;
    }
  });
  if (newOne) {
    if (currentTab === 'home') {
      document.getElementById('popup-icon').textContent = newOne.icon;
      document.getElementById('popup-name').textContent = newOne.name;
      const p = document.getElementById('ach-popup');
      p.classList.add('show');
      setTimeout(() => p.classList.remove('show'), 3500);
    }
    if (currentTab === 'achievements') renderAchievements();
  }
}

function reconcileAchievements() {
  const st = calcStats();
  if (!st) return;
  const next = {};
  ACHIEVEMENTS.forEach(a => {
    if (!achievementReached(a, st)) return;
    next[a.id] = state.unlockedAchievements[a.id] || Date.now();
  });
  state.unlockedAchievements = next;
}

// ─── Tab navigation ───────────────────────────────────────────
function switchTab(tab, btn) {
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('pane-'+tab).classList.add('active');
  btn.classList.add('active');
  currentTab = tab;
  if (tab !== 'home') document.getElementById('ach-popup').classList.remove('show');
  if (tab === 'organs') {
    const st = calcStats();
    updateOrganList();
    if (selectedOrganId && st) { updateCenterDisplay(selectedOrganId, st.elapsed); updateInfoPanel(selectedOrganId, st.elapsed); }
  }
  if (tab === 'achievements') renderAchievements();
  if (tab === 'settings')     loadSettingsForm();
}

// ─── Settings ─────────────────────────────────────────────────
function loadSettingsForm() {
  const now = new Date();
  const localNow = new Date(now - now.getTimezoneOffset()*60000).toISOString().slice(0,16);
  document.getElementById('s-date').max = localNow;
  if (state.quitDate) {
    const d = new Date(state.quitDate);
    document.getElementById('s-date').value = new Date(d - d.getTimezoneOffset()*60000).toISOString().slice(0,16);
  } else {
    document.getElementById('s-date').value = '';
  }
  document.getElementById('s-cigs-pd').value = state.cigarettesPerDay;
  document.getElementById('s-price').value    = state.pricePerPack;
  document.getElementById('s-perpack').value  = state.cigarettesPerPack;
  updateDateDisplay();
}

function toggleBenefit(id) {
  document.getElementById(id)?.classList.toggle('open');
}

// 将 datetime-local 值格式化为 "YYYY年MM月DD日 HH:mm"
function formatDateCN(val) {
  if (!val) return '请选择日期';
  const [datePart, timePart] = val.split('T');
  const [y, m, d] = datePart.split('-');
  const time = timePart ? timePart.slice(0, 5) : '';
  return y + '年' + m + '月' + d + '日  ' + time;
}

function updateDateDisplay() {
  const input = document.getElementById('s-date');
  const display = document.getElementById('s-date-display');
  if (display) display.textContent = formatDateCN(input?.value);
}

function isValidQuitDate(value) {
  const date = parseDate(value);
  if (!date) {
    showToast('请选择有效的戒烟时间');
    return false;
  }
  if (date.getTime() > Date.now()) {
    showToast('戒烟开始时间不能晚于现在');
    return false;
  }
  return true;
}

function saveSettings() {
  const d  = document.getElementById('s-date').value;
  const cg = parseInt(document.getElementById('s-cigs-pd').value);
  const pr = parseFloat(document.getElementById('s-price').value);
  const pp = parseInt(document.getElementById('s-perpack').value);
  if (!isValidQuitDate(d)) return;
  state.quitDate = d;
  state.cigarettesPerDay = Math.round(clampNumber(cg, 1, 200, DEFAULT_STATE.cigarettesPerDay));
  state.pricePerPack = clampNumber(pr, 1, 1000, DEFAULT_STATE.pricePerPack);
  state.cigarettesPerPack = Math.round(clampNumber(pp, 1, 100, DEFAULT_STATE.cigarettesPerPack));
  reconcileAchievements();
  saveState();
  updateDateLabel();
  updateUI();
  renderAchievementSummary();
  showToast('设置已保存');
}

function resetApp() {
  showConfirm(
    '重置所有数据？',
    '这会清除戒烟开始时间、统计参数和已解锁成就。重置后需要重新完成首次设置。',
    '确认重置',
    () => {
      localStorage.removeItem(APP_KEY);
      location.reload();
    }
  );
}

function exportData() {
  const stamp = new Date().toISOString().slice(0, 10).replaceAll('-', '');
  const payload = {
    app: '戒烟助手',
    version: APP_VERSION,
    exportedAt: new Date().toISOString(),
    state: normalizeState(state),
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `戒烟助手-备份-${stamp}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast('备份文件已生成');
}

function pickImportFile() {
  document.getElementById('import-file')?.click();
}

function importData(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result || '{}'));
      const imported = normalizeState(parsed.state || parsed);
      if (!imported.quitDate || !isValidQuitDate(imported.quitDate)) return;
      state = imported;
      reconcileAchievements();
      saveState();
      updateDateLabel();
      updateUI();
      loadSettingsForm();
      renderAchievements();
      showToast('备份已导入');
    } catch(e) {
      showToast('备份文件无法读取');
    } finally {
      event.target.value = '';
    }
  };
  reader.onerror = () => {
    showToast('读取备份失败');
    event.target.value = '';
  };
  reader.readAsText(file);
}

// ─── Onboarding ───────────────────────────────────────────────
function initDateInputs() {
  const localNow = localNowIso();
  const obDate = document.getElementById('ob-date');
  const settingsDate = document.getElementById('s-date');
  if (obDate) { if (!obDate.value) obDate.value = localNow; obDate.max = localNow; }
  if (settingsDate) settingsDate.max = localNow;
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDateInputs);
} else {
  initDateInputs();
}
window.addEventListener('pageshow', initDateInputs);

document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  closeConfirm();
  closeBreathing();
});

function localNowIso() {
  const now = new Date();
  return new Date(now - now.getTimezoneOffset()*60000).toISOString().slice(0,16);
}

function obNext(step) {
  if (step === 1) {
    const obDate = document.getElementById('ob-date');
    let v = obDate.value;
    if (!v) {
      v = localNowIso();
      obDate.value = v;
    }
    if (!isValidQuitDate(v)) return;
    state.quitDate = v;
  }
  if (step === 2) {
    let v = parseInt(document.getElementById('ob-cigs').value);
    if (!v || v < 1) v = 20;
    state.cigarettesPerDay = Math.round(clampNumber(v, 1, 200, DEFAULT_STATE.cigarettesPerDay));
  }
  document.getElementById('ob'+step).classList.remove('active');
  document.getElementById('ob'+(step+1)).classList.add('active');
}

function obFinish() {
  const price = parseFloat(document.getElementById('ob-price').value);
  const perPk = parseInt(document.getElementById('ob-perpack').value);
  if (!price || price < 1) { showToast('请输入每包价格'); return; }
  state.pricePerPack = clampNumber(price, 1, 1000, DEFAULT_STATE.pricePerPack);
  state.cigarettesPerPack = Math.round(clampNumber(perPk, 1, 100, DEFAULT_STATE.cigarettesPerPack));
  state.createdAt = state.createdAt || new Date().toISOString();
  saveState(); launchApp();
}

// ─── Breathing ────────────────────────────────────────────────
let brTimer = null, brRound = 0;
const BR = [
  {name:'吸气', dur:4,  scale:1.42, bg:'linear-gradient(135deg,#14b8a6,#3b82f6)'},
  {name:'屏息', dur:7,  scale:1.42, bg:'linear-gradient(135deg,#6366f1,#8b5cf6)'},
  {name:'呼气', dur:8,  scale:0.82, bg:'linear-gradient(135deg,#f97316,#f59e0b)'},
];

function openBreathing() {
  clearInterval(brTimer); brRound = 0;
  document.getElementById('br-exercise').style.cssText = 'display:flex;flex-direction:column;align-items:center';
  document.getElementById('br-done').style.display = 'none';
  document.getElementById('breathing-modal').classList.add('open');
  brCountdown();
}

function brCountdown() {
  let n = 3;
  document.getElementById('br-phase').textContent = '准备';
  document.getElementById('br-count').textContent = n;
  document.getElementById('br-rounds').textContent = '请深呼吸，放松...';
  const c = document.getElementById('br-circle');
  c.style.transition = 'none'; c.style.transform = 'scale(1)';
  c.style.background = 'linear-gradient(135deg,#94a3b8,#64748b)';
  brTimer = setInterval(() => { n--; if (n<=0) { clearInterval(brTimer); brRound=1; brPhase(0); } else document.getElementById('br-count').textContent = n; }, 1000);
}

function brPhase(pi) {
  if (brRound > 3) {
    document.getElementById('br-exercise').style.display = 'none';
    document.getElementById('br-done').style.display = 'block'; return;
  }
  if (pi >= BR.length) { brRound++; brPhase(0); return; }
  const p = BR[pi];
  document.getElementById('br-phase').textContent = p.name;
  document.getElementById('br-count').textContent = p.dur;
  document.getElementById('br-rounds').textContent = `第 ${brRound} / 3 轮`;
  const c = document.getElementById('br-circle');
  setTimeout(() => { c.style.transition=`transform ${p.dur}s ease, background 0.6s ease`; c.style.transform=`scale(${p.scale})`; c.style.background=p.bg; }, 50);
  let n = p.dur;
  brTimer = setInterval(() => { n--; if (n<=0) { clearInterval(brTimer); brPhase(pi+1); } else document.getElementById('br-count').textContent = n; }, 1000);
}

function closeBreathing() {
  clearInterval(brTimer);
  document.getElementById('breathing-modal').classList.remove('open');
}

// ─── App feedback ─────────────────────────────────────────────
let toastTimer = null;
let confirmAction = null;

function showToast(message) {
  const el = document.getElementById('toast');
  if (!el) return;
  clearTimeout(toastTimer);
  el.textContent = message;
  el.classList.add('show');
  toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
}

function showConfirm(title, body, actionText, onConfirm) {
  confirmAction = onConfirm;
  document.getElementById('confirm-title').textContent = title;
  document.getElementById('confirm-body').textContent = body;
  document.getElementById('confirm-primary').textContent = actionText;
  document.getElementById('confirm-modal').classList.add('open');
}

function closeConfirm() {
  confirmAction = null;
  document.getElementById('confirm-modal')?.classList.remove('open');
}

function runConfirmAction() {
  const action = confirmAction;
  closeConfirm();
  if (action) action();
}

// ─── Date display ─────────────────────────────────────────────
function updateDateLabel() {
  const now = new Date();
  const el = document.getElementById('today-date');
  if (el) el.textContent = `${now.getMonth()+1}月${now.getDate()}日`;
  const si = document.getElementById('c-since');
  if (si && state.quitDate) {
    const d = new Date(state.quitDate);
    si.textContent = `自 ${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')} 起`;
  } else if (si) {
    si.textContent = '在「设置」里填写戒烟开始时间后自动计时';
  }
}

// ─── Launch ───────────────────────────────────────────────────
let uiTimer = null;

function launchApp() {
  document.getElementById('onboarding').style.display = 'none';
  document.getElementById('app').style.display = 'flex';
  buildConstellation();
  updateDateLabel();
  updateUI();
  clearInterval(uiTimer);
  uiTimer = setInterval(updateUI, 1000);
}

// ─── Boot ─────────────────────────────────────────────────────
loadState();

if (DEMO_MODE) {
  state = {
    ...DEFAULT_STATE,
    quitDate: new Date(Date.now() - 45*DAY - 6*HOUR - 23*MIN).toISOString(),
    cigarettesPerDay: 20, pricePerPack: 25, cigarettesPerPack: 20,
    unlockedAchievements: {}
  };
  reconcileAchievements();
  launchApp();
} else if (state.quitDate) {
  const quitDate = parseDate(state.quitDate);
  if (quitDate && quitDate.getTime() <= Date.now()) {
    launchApp();
  } else {
    state.quitDate = null;
    launchApp();
  }
} else {
  launchApp();
}
