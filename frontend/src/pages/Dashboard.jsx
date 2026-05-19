import { useState, useEffect } from 'react'
import KanbanBoard from '../components/KanbanBoard'
import RepoPanel from '../components/RepoPanel'

export default function Dashboard({ user, setUser }) {
  const [tasks, setTasks] = useState([])
  const [repos, setRepos] = useState([])
  const [prs, setPrs] = useState([])
  const [activeRepo, setActiveRepo] = useState(null)
  const [view, setView] = useState('board')
  const [syncStatus, setSyncStatus] = useState(null)

  useEffect(() => {
    fetch('http://localhost:3001/api/tasks', { credentials: 'include' })
      .then(r => r.json()).then(setTasks).catch(() => {})
    fetch('http://localhost:3001/api/repos', { credentials: 'include' })
      .then(r => r.json()).then(setRepos).catch(() => {})
  }, [])

  useEffect(() => {
    if (!activeRepo) return
    fetch(`http://localhost:3001/api/repos/${activeRepo.full_name}/pulls`, { credentials: 'include' })
      .then(r => r.json()).then(setPrs).catch(() => {})
  }, [activeRepo])

  const syncRepos = () => {
    setSyncStatus('syncing')
    fetch('http://localhost:3001/api/repos/sync', { method: 'POST', credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        setRepos(data)
        setSyncStatus('done')
        setTimeout(() => setSyncStatus(null), 3000)
      })
      .catch(() => setSyncStatus(null))
  }

  const addTask = (task) => {
    fetch('http://localhost:3001/api/tasks', {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task)
    }).then(r => r.json()).then(t => setTasks(prev => [t, ...prev])).catch(() => {})
  }

  const updateTask = (id, updates) => {
    fetch(`http://localhost:3001/api/tasks/${id}`, {
      method: 'PATCH', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    }).then(r => r.json()).then(updated => {
      setTasks(prev => prev.map(t => t.id === id ? updated : t))
    }).catch(() => {})
  }

  const deleteTask = (id) => {
    fetch(`http://localhost:3001/api/tasks/${id}`, { method: 'DELETE', credentials: 'include' })
      .then(() => setTasks(prev => prev.filter(t => t.id !== id))).catch(() => {})
  }

  const logout = () => {
    fetch('http://localhost:3001/auth/logout', { method: 'POST', credentials: 'include' })
      .then(() => setUser(null))
  }

  const s = {
    app: { fontFamily:'system-ui,sans-serif', minHeight:'100vh', background:'#f6f8fa' },
    nav: { background:'white', borderBottom:'1px solid #d0d7de', padding:'0 24px', display:'flex', alignItems:'center', justifyContent:'space-between', height:'56px' },
    logo: { fontWeight:'700', fontSize:'18px', color:'#24292f' },
    navRight: { display:'flex', alignItems:'center', gap:'12px' },
    avatar: { width:'32px', height:'32px', borderRadius:'50%' },
    btn: { padding:'6px 14px', borderRadius:'6px', border:'1px solid #d0d7de', background:'white', cursor:'pointer', fontSize:'14px', fontWeight:'500' },
    syncBtn: (status) => ({
      padding:'6px 14px', borderRadius:'6px', border:'1px solid #d0d7de',
      cursor: status==='syncing' ? 'not-allowed' : 'pointer', fontSize:'14px', fontWeight:'500',
      background: status==='done' ? '#2da44e' : 'white',
      color: status==='done' ? 'white' : '#24292f',
      opacity: status==='syncing' ? 0.7 : 1
    }),
    tabs: { display:'flex', gap:'4px', padding:'16px 24px 0' },
    tab: { padding:'8px 16px', borderRadius:'6px 6px 0 0', border:'1px solid transparent', cursor:'pointer', fontSize:'14px', fontWeight:'500', background:'transparent', color:'#57606a' },
    tabActive: { padding:'8px 16px', borderRadius:'6px 6px 0 0', border:'1px solid #d0d7de', borderBottom:'1px solid #f6f8fa', cursor:'pointer', fontSize:'14px', fontWeight:'500', background:'white', color:'#24292f' },
    content: { padding:'0 24px 24px' }
  }

  const syncLabel = syncStatus === 'syncing' ? '⏳ Syncing...' : syncStatus === 'done' ? '✓ Synced!' : '↻ Sync Repos'

  return (
    <div style={s.app}>
      <nav style={s.nav}>
        <div style={s.logo}>📋 DevBoard</div>
        <div style={s.navRight}>
          <button style={s.syncBtn(syncStatus)} onClick={syncRepos} disabled={syncStatus==='syncing'}>
            {syncLabel}
          </button>
          <img src={user.avatar_url} alt={user.username} style={s.avatar} />
          <span style={{fontSize:'14px',color:'#24292f',fontWeight:'500'}}>{user.username}</span>
          <button style={s.btn} onClick={logout}>Logout</button>
        </div>
      </nav>
      <div style={s.tabs}>
        <button style={view==='board' ? s.tabActive : s.tab} onClick={() => setView('board')}>🗂 Kanban Board</button>
        <button style={view==='repos' ? s.tabActive : s.tab} onClick={() => setView('repos')}>📁 Repositories & PRs</button>
      </div>
      <div style={s.content}>
        {view === 'board'
          ? <KanbanBoard tasks={tasks} repos={repos} addTask={addTask} updateTask={updateTask} deleteTask={deleteTask} />
          : <RepoPanel repos={repos} prs={prs} activeRepo={activeRepo} setActiveRepo={setActiveRepo} />
        }
      </div>
    </div>
  )
}
