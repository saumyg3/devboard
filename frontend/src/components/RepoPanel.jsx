export default function RepoPanel({ repos, prs, activeRepo, setActiveRepo }) {
  const s = {
    layout: { display:'grid', gridTemplateColumns:'300px 1fr', gap:'16px', marginTop:'0', paddingTop:'16px' },
    panel: { background:'white', border:'1px solid #d0d7de', borderRadius:'8px', overflow:'hidden' },
    panelHeader: { padding:'12px 16px', borderBottom:'1px solid #d0d7de', fontWeight:'600', fontSize:'14px', color:'#24292f' },
    repoItem: (active) => ({ padding:'10px 16px', borderBottom:'1px solid #f6f8fa', cursor:'pointer', background: active ? '#ddf4ff' : 'white', display:'flex', alignItems:'center', gap:'8px' }),
    repoName: { fontSize:'14px', fontWeight:'500', color:'#24292f' },
    repoFull: { fontSize:'12px', color:'#57606a' },
    prItem: { padding:'14px 16px', borderBottom:'1px solid #f6f8fa' },
    prTitle: { fontSize:'14px', fontWeight:'500', color:'#24292f', marginBottom:'4px' },
    prMeta: { display:'flex', gap:'8px', alignItems:'center' },
    badge: (state) => ({ fontSize:'11px', fontWeight:'600', padding:'2px 8px', borderRadius:'20px', background: state==='open' ? '#dafbe1' : '#f6f8fa', color: state==='open' ? '#2da44e' : '#57606a' }),
    prNum: { fontSize:'12px', color:'#57606a' },
    link: { fontSize:'12px', color:'#0969da', textDecoration:'none' },
    empty: { padding:'32px', textAlign:'center', color:'#57606a', fontSize:'14px' }
  }

  return (
    <div style={s.layout}>
      <div style={s.panel}>
        <div style={s.panelHeader}>📁 Repositories ({repos.length})</div>
        {repos.length === 0
          ? <div style={s.empty}>No repos synced yet.<br/>Click "↻ Sync Repos" above.</div>
          : repos.map(repo => (
            <div key={repo.id} style={s.repoItem(activeRepo?.id === repo.id)} onClick={() => setActiveRepo(repo)}>
              <span style={{fontSize:'16px'}}>📦</span>
              <div>
                <div style={s.repoName}>{repo.name}</div>
                <div style={s.repoFull}>{repo.full_name}</div>
              </div>
            </div>
          ))
        }
      </div>
      <div style={s.panel}>
        <div style={s.panelHeader}>
          {activeRepo ? `Pull Requests — ${activeRepo.name}` : 'Pull Requests'}
        </div>
        {!activeRepo
          ? <div style={s.empty}>Select a repository to view its pull requests.</div>
          : prs.length === 0
          ? <div style={s.empty}>No pull requests found for this repo.</div>
          : prs.map(pr => (
            <div key={pr.id} style={s.prItem}>
              <div style={s.prTitle}>{pr.title}</div>
              <div style={s.prMeta}>
                <span style={s.badge(pr.state)}>{pr.state}</span>
                <span style={s.prNum}>#{pr.number}</span>
                <a href={pr.html_url} target="_blank" rel="noreferrer" style={s.link}>View on GitHub ↗</a>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}
