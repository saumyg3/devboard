export default function Login() {
  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100vh',fontFamily:'system-ui, sans-serif',background:'#f6f8fa'}}>
      <div style={{background:'white',padding:'48px',borderRadius:'12px',boxShadow:'0 2px 16px rgba(0,0,0,0.1)',textAlign:'center',maxWidth:'400px',width:'90%'}}>
        <div style={{fontSize:'48px',marginBottom:'16px'}}>📋</div>
        <h1 style={{margin:'0 0 8px',fontSize:'28px',fontWeight:'700',color:'#24292f'}}>DevBoard</h1>
        <p style={{margin:'0 0 32px',color:'#57606a',fontSize:'16px'}}>Track your PRs and tasks in one place</p>
        <a href="http://localhost:3001/auth/github" style={{display:'inline-flex',alignItems:'center',gap:'10px',background:'#24292f',color:'white',padding:'12px 24px',borderRadius:'8px',textDecoration:'none',fontWeight:'600',fontSize:'16px'}}>
          <svg width="20" height="20" viewBox="0 0 16 16" fill="white"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
          Continue with GitHub
        </a>
      </div>
    </div>
  )
}
