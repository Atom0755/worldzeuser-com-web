import React, { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { TENANTS } from '../data/tenants'

type Post = {
  id: string
  tenant_slug: string
  title: string
  content: string
  created_at: string
}

function useQuery() {
  const loc = useLocation()
  return useMemo(() => new URLSearchParams(loc.search), [loc.search])
}

export default function Admin() {
  const nav = useNavigate()
  const q = useQuery()
  const tenant = (q.get('tenant') ?? '').toLowerCase() || 'uscgcc'

  const tenantMeta = useMemo(() => TENANTS.find(t => t.slug === tenant), [tenant])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [sessionEmail, setSessionEmail] = useState<string | null>(null)

  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)

  async function refreshSession() {
    const { data } = await supabase.auth.getSession()
    setSessionEmail(data.session?.user?.email ?? null)
  }

  async function loadPosts() {
    setLoading(true)
    const { data, error } = await supabase
      .from('tenant_posts')
      .select('*')
      .eq('tenant_slug', tenant)
      .order('created_at', { ascending: false })
      .limit(50)
    if (error) console.error(error)
    setPosts((data as any) ?? [])
    setLoading(false)
  }

  useEffect(() => {
    refreshSession().then(loadPosts)
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      refreshSession().then(loadPosts)
    })
    return () => { sub.subscription.unsubscribe() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenant])

  async function signIn() {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) alert(error.message)
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  async function createPost() {
    setSaving(true)
    const { error } = await supabase
      .from('tenant_posts')
      .insert({ tenant_slug: tenant, title, content })
    setSaving(false)
    if (error) {
      alert(error.message)
      return
    }
    setTitle('')
    setContent('')
    await loadPosts()
  }

  async function deletePost(id: string) {
    if (!confirm('确定删除这条内容？')) return
    const { error } = await supabase.from('tenant_posts').delete().eq('id', id).eq('tenant_slug', tenant)
    if (error) alert(error.message)
    await loadPosts()
  }

  return (
    <div className="container">
      <div className="topbar">
        <div className="brand">
          <div className="logo">
            <img src="/ZEHEM-LOGO.png" alt="ZEHEM" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} />
          </div>
          <div>
            <h1>管理员后台</h1>
            <div className="small">{tenantMeta?.displayName ?? tenant}</div>
          </div>
        </div>
        <div className="pill">{sessionEmail ? `已登录：${sessionEmail}` : '请登录'}</div>
      </div>

      <div className="hero">
        <h2>发布动态 / 公告</h2>
        <p>
          只有在 Supabase 中被加入 <span className="tag">tenant_admins</span> 的用户才能发布/删除内容（RLS 控制）。
        </p>
        <div className="btnRow">
          <Link className="btn" to={`/?tenant=${tenant}`}>回到该租户主页</Link>
          <Link className="btn" to="/">回到集合首页</Link>
        </div>
      </div>

      <div className="grid">
        <div className="card">
          <h3>登录</h3>
          {sessionEmail ? (
            <div>
              <p className="small">你已登录，可进行发布与管理。</p>
              <div className="btnRow">
                <button className="btn" onClick={signOut}>退出登录</button>
              </div>
              <div className="hr" />
              <div className="small">
                如果你登录后仍无法发布，说明你的账号未被加入该租户管理员表 tenant_admins。
              </div>
            </div>
          ) : (
            <div className="form">
              <input className="input" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
              <input className="input" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
              <div className="btnRow">
                <button className="btn btnPrimary" onClick={signIn}>登录</button>
              </div>
              <div className="small">
                账号需要先在 Supabase Auth 创建（Dashboard → Authentication → Users）。
              </div>
            </div>
          )}
        </div>

        <div className="card">
          <h3>新增内容</h3>
          <div className="form">
            <input className="input" placeholder="标题" value={title} onChange={e => setTitle(e.target.value)} />
            <textarea className="input textarea" placeholder="正文内容（支持换行）" value={content} onChange={e => setContent(e.target.value)} />
            <div className="btnRow">
              <button className="btn btnPrimary" disabled={saving || !sessionEmail || !title.trim()} onClick={createPost}>
                {saving ? '保存中…' : '发布'}
              </button>
            </div>
            {!sessionEmail && <div className="small">请先登录后再发布。</div>}
          </div>
        </div>

        <div className="card" style={{ gridColumn: 'span 12' as any }}>
          <h3>已发布内容</h3>
          {loading ? (
            <p className="small">加载中…</p>
          ) : posts.length === 0 ? (
            <p className="small">暂无内容</p>
          ) : (
            <div className="list">
              {posts.map(p => (
                <div key={p.id} className="item" style={{ alignItems: 'flex-start' as any }}>
                  <div style={{ flex: 1 }}>
                    <div className="itemTitle">{p.title}</div>
                    <div className="small">{new Date(p.created_at).toLocaleString()}</div>
                    <div className="hr" />
                    <div style={{ whiteSpace: 'pre-wrap' as any, lineHeight: 1.6 }}>{p.content}</div>
                  </div>
                  <div className="btnRow">
                    <button className="btn" disabled={!sessionEmail} onClick={() => deletePost(p.id)}>删除</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="footer">
        管理员后台 · {tenant}.worldzeuser.com
      </div>
    </div>
  )
}
