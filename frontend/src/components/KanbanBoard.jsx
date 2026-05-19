import { useState } from 'react'

const COLUMNS = [
  { id: 'todo', label: '📝 To Do', color: '#0969da' },
  { id: 'in_progress', label: '🔄 In Progress', color: '#bf8700' },
  { id: 'done', label: '✅ Done', color: '#2da44e' }
]

const PRIORITIES = { low: '#2da44e', medium: '#bf8700', high: '#d1242f' }

export default function KanbanBoard({ tasks, repos, addTask, updateTask, deleteTask }) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium', repo_id: '' })
  const [dragging, setDragging] = useState(null)

  const submit = () => {
    if (!form.title.trim()) return
    addTask({ ...form, status: 'todo' })
    setForm({ title: '', description: '', priority: 'medium', repo_id: '' })
    setShowForm(false)
  }

  const onDrop = (status) => {
    if (dragging) { updateTask(dragging.id, { status }); setDragging(null) }
  }

  const s = {
    board: { display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'16px', marginTop:'0' },
    col: { background:'white', borderRadius:'8px', border:'1px solid #d0d7de', padding:'16px', minHeight:'400px' },
    colHeader: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px' },
    colTitle: { fontWeight:'600', fontSize:'14px', color:'#24292f' },
    count: { background:'#f6f8fa', border:'1px solid #d0d7de', borderRadius:'20px', padding:'2px 8px', fontSize:'12px', color:'#57606a' },
    card: { background:'#f6f8fa', border:'1px solid #d0d7de', borderRadius:'6px', padding:'12px', marginBottom:'8px', cursor:'grab' },
    cardTitle: { fontWeight:'500', fontSize:'14px', color:'#24292f', marginBottom:'6px' },
    cardDesc: { fontSize:'12px', color:'#57606a', marginBottom:'8px' },
    cardFooter: { display:'flex', justifyContent:'space-between', alignItems:'center' },
    priority: (p) => ({ fontSize:'11px', fontWeight:'600', color: PRIORITIES[p], background: PRIORITIES[p]+'20', padding:'2px 8px', borderRadius:'20px' }),
    deleteBtn: { fontSize:'12px', color:'#d1242f', cursor:'pointer', background:'none', border:'none', padding:'2px 6px' },
    addBtn: { width:'100%', padding:'8px', borderRadius:'6px', border:'2px dashed #d0d7de', background:'transparent', cursor:'pointer', color:'#57606a', fontSize:'13px', marginTop:'8px' },
    modal: { position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 },
    modalBox: { background:'white', borderRadius:'12px', padding:'24px', width:'420px', boxShadow:'0 8px 32px rgba(0,0,0,0.2)' },
    input: { width:'100%', padding:'8px 12px', borderRadius:'6px', border:'1px solid #d0d7de', fontSize:'14px', boxSizing:'border-box', marginBottom:'12px' },
    label: { fontSize:'13px', fontWeight:'500', color:'#24292f', marginBottom:'4px', display:'block' },
    btnRow: { display:'flex', gap:'8px', justifyContent:'flex-end', marginTop:'16px' },
    btn: { padding:'8px 16px', borderRadius:'6px', border:'1px solid #d0d7de', background:'white', cursor:'pointer', fontSize:'14px' },
    btnGreen: { padding:'8px 16px', borderRadius:'6px', border:'none', background:'#2da44e', color:'white', cursor:'pointer', fontSize:'14px' },
    repoTag: { fontSize:'11px', color:'#0969da', background:'#ddf4ff', padding:'2px 8px', borderRadius:'20px' }
  }

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'flex-end', padding:'16px 0 8px' }}>
        <button style={{ padding:'8px 16px', borderRadius:'6px', border:'none', background:'#2da44e', color:'white', cursor:'pointer', fontSize:'14px', fontWeight:'500' }}
          onClick={() => setShowForm(true)}>+ New Task</button>
      </div>

      <div style={s.board}>
        {COLUMNS.map(col => {
          const colTasks = tasks.filter(t => t.status === col.id)
          return (
            <div key={col.id} style={s.col}
              onDragOver={e => e.preventDefault()}
              onDrop={() => onDrop(col.id)}>
              <div style={s.colHeader}>
                <span style={{ ...s.colTitle, color: col.color }}>{col.label}</span>
                <span style={s.count}>{colTasks.length}</span>
              </div>
              {colTasks.map(task => (
                <div key={task.id} style={s.card} draggable
                  onDragStart={() => setDragging(task)}
                  onDragEnd={() => setDragging(null)}>
                  <div style={s.cardTitle}>{task.title}</div>
                  {task.description && <div style={s.cardDesc}>{task.description}</div>}
                  <div style={s.cardFooter}>
                    <div style={{ display:'flex', gap:'6px', alignItems:'center' }}>
                      <span style={s.priority(task.priority)}>{task.priority}</span>
                      {task.repo_name && <span style={s.repoTag}>{task.repo_name}</span>}
                    </div>
                    <button style={s.deleteBtn} onClick={() => deleteTask(task.id)}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          )
        })}
      </div>

      {showForm && (
        <div style={s.modal} onClick={() => setShowForm(false)}>
          <div style={s.modalBox} onClick={e => e.stopPropagation()}>
            <h3 style={{ margin:'0 0 16px', fontSize:'16px', fontWeight:'600' }}>New Task</h3>
            <label style={s.label}>Title</label>
            <input style={s.input} value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))} placeholder="Task title" />
            <label style={s.label}>Description</label>
            <input style={s.input} value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} placeholder="Optional description" />
            <label style={s.label}>Priority</label>
            <select style={s.input} value={form.priority} onChange={e => setForm(p => ({...p, priority: e.target.value}))}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <label style={s.label}>Repository (optional)</label>
            <select style={s.input} value={form.repo_id} onChange={e => setForm(p => ({...p, repo_id: e.target.value}))}>
              <option value="">None</option>
              {repos.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
            <div style={s.btnRow}>
              <button style={s.btn} onClick={() => setShowForm(false)}>Cancel</button>
              <button style={s.btnGreen} onClick={submit}>Create Task</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
