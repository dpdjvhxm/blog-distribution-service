import { useMemo, useState } from 'react';
import {
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  FilePlus2,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  UserRoundCog,
  Users,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const initialRequests = [
  {
    id: 'BD-2026-001',
    client: '서울 피부과 캠페인',
    keyword: '강남 피부관리',
    platform: '네이버 블로그',
    quantity: 30,
    distributed: 18,
    owner: '운영자 김민지',
    dueDate: '2026-05-24',
    status: '배포중',
    priority: '높음',
    memo: '상위노출 키워드 중심으로 원고 검수 필요',
  },
  {
    id: 'BD-2026-002',
    client: '프리미엄 헬스케어',
    keyword: '종합건강검진 추천',
    platform: '티스토리',
    quantity: 15,
    distributed: 15,
    owner: '매니저 이도윤',
    dueDate: '2026-05-21',
    status: '완료',
    priority: '보통',
    memo: '발행 URL 취합 완료',
  },
  {
    id: 'BD-2026-003',
    client: '중고명품365',
    keyword: '중고명품 매입',
    platform: '네이버 블로그',
    quantity: 20,
    distributed: 4,
    owner: '운영자 김민지',
    dueDate: '2026-05-28',
    status: '접수',
    priority: '높음',
    memo: '매입 랜딩 페이지 연결 문구 포함',
  },
  {
    id: 'BD-2026-004',
    client: '부산 로컬 맛집',
    keyword: '해운대 맛집',
    platform: '카페/커뮤니티',
    quantity: 10,
    distributed: 0,
    owner: '인턴 박서연',
    dueDate: '2026-05-30',
    status: '대기',
    priority: '낮음',
    memo: '원고 수급 후 진행',
  },
];

const initialAccounts = [
  { id: 1, name: 'blog_master01', platform: '네이버 블로그', owner: '김민지', status: '사용가능', posts: 128, lastUsed: '2026-05-20' },
  { id: 2, name: 'review_daily22', platform: '티스토리', owner: '이도윤', status: '사용중', posts: 67, lastUsed: '2026-05-21' },
  { id: 3, name: 'local_story9', platform: '카페/커뮤니티', owner: '박서연', status: '점검필요', posts: 41, lastUsed: '2026-05-18' },
  { id: 4, name: 'premium_note', platform: '네이버 블로그', owner: '김민지', status: '사용가능', posts: 93, lastUsed: '2026-05-19' },
];

const menuItems = [
  { key: 'dashboard', label: '대시보드', icon: LayoutDashboard },
  { key: 'request', label: '배포 접수', icon: FilePlus2 },
  { key: 'manage', label: '배포 관리', icon: ClipboardList },
  { key: 'accounts', label: '계정 관리', icon: UserRoundCog },
];

const statusOptions = ['접수', '대기', '배포중', '완료', '보류'];
const platformOptions = ['네이버 블로그', '티스토리', '카페/커뮤니티', '인스타그램', '기타'];

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [requests, setRequests] = useState(initialRequests);
  const [accounts, setAccounts] = useState(initialAccounts);
  const [query, setQuery] = useState('');

  const stats = useMemo(() => {
    const totalQty = requests.reduce((sum, item) => sum + Number(item.quantity), 0);
    const doneQty = requests.reduce((sum, item) => sum + Number(item.distributed), 0);
    const active = requests.filter((item) => ['접수', '대기', '배포중'].includes(item.status)).length;
    const completed = requests.filter((item) => item.status === '완료').length;
    return {
      totalCampaigns: requests.length,
      active,
      completed,
      totalQty,
      doneQty,
      progressRate: totalQty ? Math.round((doneQty / totalQty) * 100) : 0,
    };
  }, [requests]);

  const statusChart = useMemo(() => {
    return statusOptions.map((status) => ({
      name: status,
      value: requests.filter((item) => item.status === status).length,
    })).filter((item) => item.value > 0);
  }, [requests]);

  const platformChart = useMemo(() => {
    return platformOptions.map((platform) => ({
      name: platform,
      접수수: requests.filter((item) => item.platform === platform).length,
      배포량: requests.filter((item) => item.platform === platform).reduce((sum, item) => sum + Number(item.distributed), 0),
    })).filter((item) => item.접수수 > 0 || item.배포량 > 0);
  }, [requests]);

  const filteredRequests = useMemo(() => {
    const lower = query.toLowerCase();
    return requests.filter((item) =>
      [item.id, item.client, item.keyword, item.platform, item.owner, item.status]
        .join(' ')
        .toLowerCase()
        .includes(lower)
    );
  }, [query, requests]);

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon"><Megaphone size={24} /></div>
          <div>
            <strong>BlogFlow</strong>
            <span>배포 운영 관리</span>
          </div>
        </div>

        <nav>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                className={activeMenu === item.key ? 'nav-item active' : 'nav-item'}
                onClick={() => setActiveMenu(item.key)}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <button className="logout" onClick={() => setIsLoggedIn(false)}>
          <LogOut size={18} /> 로그아웃
        </button>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <p className="eyebrow">블로그 배포 서비스</p>
            <h1>{menuItems.find((item) => item.key === activeMenu)?.label}</h1>
          </div>
          <div className="top-actions">
            <div className="search-box">
              <Search size={18} />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="캠페인, 키워드, 담당자 검색" />
            </div>
            <button className="ghost-button"><Settings size={18} /> 설정</button>
          </div>
        </header>

        {activeMenu === 'dashboard' && (
          <Dashboard stats={stats} statusChart={statusChart} platformChart={platformChart} requests={requests} accounts={accounts} />
        )}
        {activeMenu === 'request' && <RequestForm requests={requests} setRequests={setRequests} setActiveMenu={setActiveMenu} />}
        {activeMenu === 'manage' && <DistributionManage requests={filteredRequests} setRequests={setRequests} />}
        {activeMenu === 'accounts' && <AccountManage accounts={accounts} setAccounts={setAccounts} />}
      </main>
    </div>
  );
}

function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ email: 'admin@blogflow.co.kr', password: '1234' });
  return (
    <div className="login-page">
      <section className="login-card">
        <div className="login-copy">
          <div className="brand-icon large"><Megaphone size={34} /></div>
          <p className="eyebrow">Blog Distribution Service</p>
          <h1>블로그 배포 접수부터 계정 운영까지 한 번에 관리하세요.</h1>
          <p>캠페인 접수, 진행 현황, 담당자 배정, 계정 상태, 배포 성과를 하나의 운영 화면에서 확인할 수 있는 내부 관리 서비스입니다.</p>
          <div className="login-features">
            <span><ShieldCheck size={16} /> 운영 권한 관리</span>
            <span><CalendarDays size={16} /> 마감 일정 추적</span>
            <span><BarChart3 size={16} /> 실시간 대시보드</span>
          </div>
        </div>
        <form className="login-form" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
          <h2>관리자 로그인</h2>
          <label>이메일<input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
          <label>비밀번호<input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
          <button className="primary-button" type="submit">로그인</button>
          <p className="hint">데모 계정: admin@blogflow.co.kr / 1234</p>
        </form>
      </section>
    </div>
  );
}

function Dashboard({ stats, statusChart, platformChart, requests, accounts }) {
  return (
    <div className="page-grid">
      <section className="metric-grid">
        <Metric title="전체 접수" value={`${stats.totalCampaigns}건`} desc="누적 배포 요청" icon={ClipboardList} />
        <Metric title="진행중" value={`${stats.active}건`} desc="접수/대기/배포중" icon={Megaphone} />
        <Metric title="완료" value={`${stats.completed}건`} desc="검수 및 URL 취합 완료" icon={CheckCircle2} />
        <Metric title="배포 진행률" value={`${stats.progressRate}%`} desc={`${stats.doneQty}/${stats.totalQty}건 발행`} icon={BarChart3} />
      </section>

      <section className="chart-grid">
        <div className="panel chart-panel">
          <h3>플랫폼별 배포량</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={platformChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="접수수" radius={[8, 8, 0, 0]} />
              <Bar dataKey="배포량" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="panel chart-panel">
          <h3>상태별 접수 현황</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={statusChart} dataKey="value" nameKey="name" outerRadius={96} label>
                {statusChart.map((_, index) => <Cell key={index} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="two-column">
        <div className="panel">
          <h3>최근 배포 요청</h3>
          <div className="compact-list">
            {requests.slice(0, 4).map((item) => <RequestMini key={item.id} item={item} />)}
          </div>
        </div>
        <div className="panel">
          <h3>계정 상태 요약</h3>
          <div className="account-summary">
            {accounts.map((account) => (
              <div key={account.id} className="account-row">
                <span>{account.name}</span>
                <strong className={`pill ${account.status}`}>{account.status}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function Metric({ title, value, desc, icon: Icon }) {
  return (
    <div className="metric-card">
      <div className="metric-icon"><Icon size={22} /></div>
      <span>{title}</span>
      <strong>{value}</strong>
      <p>{desc}</p>
    </div>
  );
}

function RequestForm({ requests, setRequests, setActiveMenu }) {
  const [form, setForm] = useState({
    client: '', keyword: '', platform: '네이버 블로그', quantity: 10, owner: '', dueDate: '', priority: '보통', memo: '',
  });

  const submit = (e) => {
    e.preventDefault();
    const next = {
      id: `BD-2026-${String(requests.length + 1).padStart(3, '0')}`,
      ...form,
      quantity: Number(form.quantity),
      distributed: 0,
      status: '접수',
    };
    setRequests([next, ...requests]);
    setActiveMenu('manage');
  };

  return (
    <section className="panel form-panel">
      <div className="section-title">
        <div>
          <h2>신규 배포 접수</h2>
          <p>광고주/캠페인 정보, 배포 플랫폼, 수량, 마감일을 등록합니다.</p>
        </div>
      </div>
      <form className="request-form" onSubmit={submit}>
        <label>광고주/캠페인명<input required value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} placeholder="예: 강남 피부과 5월 캠페인" /></label>
        <label>메인 키워드<input required value={form.keyword} onChange={(e) => setForm({ ...form, keyword: e.target.value })} placeholder="예: 강남 피부관리" /></label>
        <label>플랫폼<select value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })}>{platformOptions.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label>배포 수량<input required type="number" min="1" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} /></label>
        <label>담당자<input required value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} placeholder="예: 운영자 김민지" /></label>
        <label>마감일<input required type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} /></label>
        <label>우선순위<select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}><option>높음</option><option>보통</option><option>낮음</option></select></label>
        <label className="wide">메모<textarea value={form.memo} onChange={(e) => setForm({ ...form, memo: e.target.value })} placeholder="원고 가이드, 금지어, URL 취합 방식 등을 입력" /></label>
        <button className="primary-button wide" type="submit"><Plus size={18} /> 배포 접수 등록</button>
      </form>
    </section>
  );
}

function DistributionManage({ requests, setRequests }) {
  const updateStatus = (id, status) => {
    setRequests((prev) => prev.map((item) => item.id === id ? { ...item, status, distributed: status === '완료' ? item.quantity : item.distributed } : item));
  };

  const addProgress = (id) => {
    setRequests((prev) => prev.map((item) => item.id === id ? { ...item, distributed: Math.min(item.quantity, item.distributed + 1), status: item.distributed + 1 >= item.quantity ? '완료' : '배포중' } : item));
  };

  return (
    <section className="panel">
      <div className="section-title">
        <div>
          <h2>배포 관리</h2>
          <p>접수된 배포 건의 상태, 발행 수량, 담당자를 관리합니다.</p>
        </div>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>ID</th><th>캠페인</th><th>키워드</th><th>플랫폼</th><th>진행률</th><th>담당자</th><th>마감일</th><th>상태</th><th>액션</th></tr>
          </thead>
          <tbody>
            {requests.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td><td><strong>{item.client}</strong><p>{item.memo}</p></td><td>{item.keyword}</td><td>{item.platform}</td>
                <td><div className="progress"><span style={{ width: `${Math.round((item.distributed / item.quantity) * 100)}%` }} /></div><small>{item.distributed}/{item.quantity}</small></td>
                <td>{item.owner}</td><td>{item.dueDate}</td>
                <td><select value={item.status} onChange={(e) => updateStatus(item.id, e.target.value)}>{statusOptions.map((status) => <option key={status}>{status}</option>)}</select></td>
                <td><button className="small-button" onClick={() => addProgress(item.id)}>+1 발행</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function AccountManage({ accounts, setAccounts }) {
  const [form, setForm] = useState({ name: '', platform: '네이버 블로그', owner: '', status: '사용가능' });

  const submit = (e) => {
    e.preventDefault();
    setAccounts([{ id: Date.now(), ...form, posts: 0, lastUsed: '-' }, ...accounts]);
    setForm({ name: '', platform: '네이버 블로그', owner: '', status: '사용가능' });
  };

  const updateAccount = (id, status) => {
    setAccounts((prev) => prev.map((item) => item.id === id ? { ...item, status } : item));
  };

  return (
    <div className="account-layout">
      <section className="panel form-panel">
        <h2>계정 등록</h2>
        <form className="request-form compact" onSubmit={submit}>
          <label>계정명<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
          <label>플랫폼<select value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })}>{platformOptions.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label>담당자<input required value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} /></label>
          <label>상태<select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option>사용가능</option><option>사용중</option><option>점검필요</option><option>중지</option></select></label>
          <button className="primary-button wide" type="submit"><Users size={18} /> 계정 추가</button>
        </form>
      </section>

      <section className="panel">
        <h2>계정 목록</h2>
        <div className="card-list">
          {accounts.map((account) => (
            <div className="account-card" key={account.id}>
              <div><strong>{account.name}</strong><p>{account.platform} · 담당 {account.owner}</p></div>
              <div className="account-meta"><span>누적 {account.posts}건</span><span>최근 사용 {account.lastUsed}</span></div>
              <select value={account.status} onChange={(e) => updateAccount(account.id, e.target.value)}><option>사용가능</option><option>사용중</option><option>점검필요</option><option>중지</option></select>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function RequestMini({ item }) {
  return (
    <div className="mini-card">
      <div><strong>{item.client}</strong><p>{item.keyword} · {item.platform}</p></div>
      <span className={`pill ${item.status}`}>{item.status}</span>
    </div>
  );
}

export default App;
