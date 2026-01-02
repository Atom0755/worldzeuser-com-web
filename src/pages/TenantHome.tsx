import React, { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { TENANTS } from '../data/tenants'

type Props = { tenant?: string }

type Post = {
  id: string
  tenant_slug: string
  title: string
  content: string
  created_at: string
}

export default function TenantHome(props: Props) {
  const params = useParams()
  const tenant = (props.tenant ?? params.tenant ?? '').toLowerCase()

  const tenantMeta = useMemo(() => TENANTS.find(t => t.slug === tenant), [tenant])

  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [sessionEmail, setSessionEmail] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function load() {
      setLoading(true)

      const { data: auth } = await supabase.auth.getSession()
      const email = auth.session?.user?.email ?? null
      if (isMounted) setSessionEmail(email)

      const { data, error } = await supabase
        .from('tenant_posts')
        .select('*')
        .eq('tenant_slug', tenant)
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) {
        console.error(error)
      }
      if (isMounted) {
        setPosts((data as any) ?? [])
        setLoading(false)
      }
    }

    if (tenant) load()
    return () => { isMounted = false }
  }, [tenant])

  if (!tenant) {
    return (
      <div className="container">
        <div className="hero">
          <h2>未识别到子域名</h2>
          <p>请从首页点击商会名称进入，或使用本地测试：<span className="tag">/?tenant=uscgcc</span></p>
          <div className="btnRow">
            <Link className="btn btnPrimary" to="/">返回首页</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="topbar">
        <div className="brand">
          <div className="logo">
            <img src="/ZEHEM-LOGO.png" alt="ZEHEM" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} />
          </div>
          <div>
            <h1>{tenantMeta?.displayName ?? tenant.toUpperCase()}</h1>
            <div className="small">{tenantMeta?.subtitle ?? `tenant: ${tenant}`}</div>
          </div>
        </div>
        <div className="pill">{sessionEmail ? `已登录：${sessionEmail}` : '未登录（仅浏览）'}</div>
      </div>

      <div className="hero">
        <h2>商会动态 / 公告</h2>
        <p>此页面展示该子域名租户发布的动态内容。管理员登录后可在后台发布与管理。</p>
        <div className="btnRow">
          <Link className="btn btnPrimary" to={`/admin?tenant=${tenant}`}>管理员登录 / 发布</Link>
          <Link className="btn" to="/">返回集合首页</Link>
        </div>
      </div>

      <div className="grid">
        <div className="card" style={{ gridColumn: 'span 12' as any }}>
          <h3>最新内容</h3>
          {loading ? (
            <p className="small">加载中…</p>
          ) : posts.length === 0 ? (
            <p className="small">暂无内容。管理员登录后即可发布。</p>
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
                  <div className="tag">{tenant}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="footer">
        © {new Date().getFullYear()} ZEHEM.AI · {tenant}.worldzeuser.com
      </div>
    </div>
  )
}
