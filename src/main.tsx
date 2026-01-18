import { USCGCCPage } from './pages/uscgcc'
import { USCLGCCPage } from './pages/usclgcc'
import { ILAUSAPage } from './pages/ilausa'
import { UZLEAPage } from './pages/uzlea'
import { GBIPage } from './pages/gbi'
import { supabase } from './lib/supabase'

// 将 Supabase 设置为全局变量
;(window as any).supabase = supabase

const root = document.getElementById('root')

if (root) {
  const hostname = window.location.hostname.toLowerCase()
  const pathname = window.location.pathname.toLowerCase()

  if (hostname.startsWith('uscgcc.') || pathname.startsWith('/a/uscgcc')) {
    root.innerHTML = USCGCCPage
    requestAnimationFrame(() => {
      initUSCGCCPage()

      // ✅ 新增：让首页右上角“退出”真正生效（不依赖 uscgcc.tsx 里的 <script>）
      initHomeLogoutBar()

      setTimeout(() => {
        initAdminLogin()
      }, 100)
    })
  } else if (hostname.startsWith('usclgcc.') || pathname.startsWith('/a/usclgcc')) {
    root.innerHTML = USCLGCCPage
  } else if (hostname.startsWith('ilausa.') || pathname.startsWith('/a/ilausa')) {
    root.innerHTML = ILAUSAPage
  } else if (hostname.startsWith('uzlea.') || pathname.startsWith('/a/uzlea')) {
    root.innerHTML = UZLEAPage
  } else if (hostname.startsWith('gbi.') || pathname.startsWith('/a/gbi')) {
    root.innerHTML = GBIPage
  } else {
    root.innerHTML = `
    <div style="
      min-height: 100vh;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px 15px;
    ">
      <div style="
        width: 100%;
        max-width: 400px;
        background: rgba(30, 41, 59, 0.7);
        border: 2px solid rgba(255, 255, 255, 0.1);
        border-radius: 30px;
        padding: 25px 20px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        text-align: center;
        backdrop-filter: blur(10px);
      ">
        <div style="margin-bottom: 12px;">
          <img src="/ZEHEM-LOGO.png" style="width:80px; height:auto; filter: drop-shadow(0 0 8px rgba(255,255,255,0.2));" />
        </div>

        <h1 style="font-size: 1.4rem; margin: 0; letter-spacing: -0.5px; font-weight: 700;">
          WorldZeuser我的助手
        </h1>

        <div style="margin: 15px 0;">
          <a href="https://atmm.ai.worldzeuser.com" style="
            display: block;
            padding: 12px;
            background: linear-gradient(135deg, #0072ff 0%, #00c6ff 100%);
            border-radius: 16px;
            color: white;
            text-decoration: none;
            font-weight: 700;
            font-size: 1rem;
            box-shadow: 0 4px 15px rgba(0,114,255,0.3);
          ">
            🚀 ATMM.AI 爱同盟宇宙
          </a>
        </div>

        <p style="color: #94a3b8; margin: 5px 0; font-size: 0.85rem;">AI Portal for The Associations</p>
        
        <hr style="width: 120px; border: 0; border-top: 2px solid #38bdf8; margin: 15px auto;" />

        <ul style="list-style: none; padding: 0; display: flex; flex-direction: column; gap: 8px; margin-bottom: 15px;">
          ${[
            { name: 'USCGCC 美国粤商会 / 美中广东总商会', link: 'https://uscgcc.worldzeuser.com/' },
            { name: 'USCLGCC 美中物流总商会', link: 'https://usclgcc.worldzeuser.com/' },
            { name: 'ILAUSA 美国国际物流协会', link: 'https://ilausa.worldzeuser.com/' },
            { name: 'UZLEA 美国浙江物流电商协会', link: 'https://uzlea.worldzeuser.com/' },
            { name: 'GBI 环球创新建材中心', link: 'https://gbi.worldzeuser.com/' }
          ].map(item => `
            <li>
              <a href="${item.link}" style="
                display: block;
                padding: 10px 15px;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                color: #e2e8f0;
                text-decoration: none;
                font-weight: 500;
                transition: all 0.2s ease;
                font-size: 0.85rem;
              ">
                ${item.name}
              </a>
            </li>
          `).join('')}
        </ul>

        <footer style="margin-top: 15px; color: #475569; font-size: 0.7rem;">
          © 2025 WorldZeuser.com All Rights Reserved.
        </footer>
      </div>
    </div>
    `
  }
}

/**
 * ✅ 新增：USCGCC 首页右上角“邮箱 + 退出”控制
 * - 登录（OTP/管理员密码登录）后显示
 * - 点击退出：supabase.auth.signOut()
 * - 退出后留在当前页，并把邮箱验证条(auth-overlay)重新显示
 */
function initHomeLogoutBar() {
  const sb = (window as any).supabase
  if (!sb) return

  const bar = document.getElementById('auth-bar') as HTMLElement | null
  const emailEl = document.getElementById('user-email') as HTMLElement | null
  const logoutBtn = document.getElementById('logout-btn') as HTMLButtonElement | null
  const overlay = document.getElementById('auth-overlay') as HTMLElement | null

  // ✅ 先判空一次
  if (!bar || !emailEl || !logoutBtn) return

  async function refreshAuthUI() {
    // ✅ 再判空一次（让 TS100%放心）
    if (!bar || !emailEl) return

    try {
      const { data } = await sb.auth.getSession()
      const session = data?.session

      if (session?.user) {
        bar.style.display = 'flex'
        emailEl.textContent = session.user.email || ''
      } else {
        bar.style.display = 'none'
        emailEl.textContent = ''
      }
    } catch (e) {
      console.error('refreshAuthUI failed:', e)
    }
  }

  async function logout() {
    try {
      await sb.auth.signOut()
    } catch (e) {
      console.error('signOut failed:', e)
    }

    // 退出后：显示邮箱验证条（让访客重新验证）
    if (overlay) overlay.style.display = 'block'
    await refreshAuthUI()
  }

  // 防重复绑定
  if (!(window as any).__uscgccLogoutBound) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()
      logout()
    })
    ;(window as any).__uscgccLogoutBound = true
  }

  // 监听登录态变化（OTP/管理员登录都会触发）
  if (!(window as any).__uscgccAuthListenerBound) {
    sb.auth.onAuthStateChange(() => {
      refreshAuthUI()
    })
    ;(window as any).__uscgccAuthListenerBound = true
  }

  // 首次刷新
  refreshAuthUI()
}


function initUSCGCCPage() {
  // =========================
  // ✅ 只改这里：把 initNews 提到 initChat 外面（同级），避免 TS 找不到 initNews
  // =========================
  function initNews() {
    const supabase = (window as any).supabase
    if (!supabase) {
      console.error('Supabase 未初始化，3秒后重试加载新闻...')
      setTimeout(initNews, 3000)
      return
    }

    // 只绑定一次关闭事件，避免重复绑定
    ;(window as any).__newsModalBound ||= false
    if (!(window as any).__newsModalBound) {
      const closeBtn = document.getElementById('close-modal')
      const modal = document.getElementById('news-modal')

      if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
          ;(modal as HTMLElement).style.display = 'none'
        })

        modal.addEventListener('click', (e) => {
          if ((e.target as HTMLElement).id === 'news-modal') {
            ;(modal as HTMLElement).style.display = 'none'
          }
        })

        ;(window as any).__newsModalBound = true
      }
    }

    function firstLinePreview(content: string) {
      if (!content) return ''
      // 去掉首尾空白，把换行切第一行
      const line = content.replace(/\r/g, '').trim().split('\n').find(Boolean) || ''
      return line.length > 40 ? line.slice(0, 40) + '...' : line
    }

    async function showNewsModal(newsId: string) {
      try {
        const { data, error } = await supabase
          .from('news')
          .select('id,title,content,publish_date,created_at')
          .eq('id', newsId)
          .single()

        if (error) throw error
        if (!data) return

        const modal = document.getElementById('news-modal') as HTMLElement | null
        const titleEl = document.getElementById('modal-title')
        const dateEl = document.getElementById('modal-date')
        const contentEl = document.getElementById('modal-content')

        if (!modal || !titleEl || !dateEl || !contentEl) {
          console.warn('未找到新闻弹窗 DOM（news-modal/modal-title/modal-date/modal-content）')
          return
        }

        titleEl.textContent = data.title || ''
        dateEl.textContent = data.publish_date || ''
        contentEl.textContent = data.content || ''
        modal.style.display = 'flex'
      } catch (e) {
        console.error('❌ 加载新闻详情失败', e)
      }
    }

    async function loadNews() {
      try {
        const newsList = document.getElementById('news-list')
        if (!newsList) {
          console.warn('❌ 首页未找到 #news-list')
          return
        }

        // ✅ 首页只显示：本商会 + 已发布
        const { data, error } = await supabase
          .from('news')
          .select('id,title,content,publish_date,created_at,tenant_slug,status')
          .eq('tenant_slug', 'uscgcc')
          .eq('status', 'published')
          .order('created_at', { ascending: false })
          .limit(4)

        if (error) throw error

        if (!data || data.length === 0) {
          newsList.innerHTML =
            '<div style="font-size:12px;color:#94a3b8;text-align:center;">暂无动态新闻...</div>'
          return
        }

        // ✅ 渲染：标题 + 日期 + 正文第一行预览
        newsList.innerHTML = data
          .map((n: any) => {
            const preview = firstLinePreview(n.content || '')

            const dateText =
              (n.publish_date && String(n.publish_date).trim()) ||
              (n.created_at ? new Date(n.created_at).toLocaleDateString('en-CA') : '') // en-CA => YYYY-MM-DD

            return `
            <div class="news-item"
                 data-id="${n.id}"
                 style="font-size:12px;color:#e2e8f0;margin-bottom:10px;
                        border-bottom:1px solid rgba(255,255,255,0.05);
                        padding-bottom:10px;cursor:pointer;">
              <div style="font-weight:700;margin-bottom:4px;">${n.title || ''}</div>
              <div style="font-size:11px;color:#94a3b8;margin-bottom:4px;">${dateText}</div>
              <div style="padding-left:1em;color:#cbd5e1;font-size:11px;line-height:1.5;">
                ${preview}
              </div>
            </div>
          `
          })
          .join('')

        // ✅ 绑定点击事件：弹全文
        document.querySelectorAll('.news-item').forEach((el) => {
          const item = el as HTMLElement

          item.addEventListener('mouseenter', () => {
            item.style.background = 'rgba(56,189,248,0.10)'
            item.style.borderRadius = '8px'
            item.style.padding = '8px'
          })

          item.addEventListener('mouseleave', () => {
            item.style.background = 'transparent'
            item.style.borderRadius = '0'
            item.style.padding = '0'
            item.style.paddingBottom = '10px'
          })

          item.addEventListener('click', () => {
            const id = item.getAttribute('data-id')
            if (id) showNewsModal(id)
          })
        })
      } catch (e) {
        console.error('❌ 加载新闻失败', e)
      }
    }

    loadNews()
  }

  function initChat() {
    const supabase = (window as any).supabase
    if (!supabase) {
      console.error('Supabase 未初始化，3秒后重试...')
      setTimeout(initChat, 3000)
      return
    }

    console.log('✅ Supabase 已初始化')

    const chatBox = document.getElementById('chat-box')
    const chatInput = document.getElementById('chat-input') as HTMLInputElement
    const sendBtn = document.getElementById('send-btn')
    const emailInput = document.getElementById('email-input') as HTMLInputElement | null
const verifyBtn = document.getElementById('verify-submit') as HTMLButtonElement | null

    const authOverlay = document.getElementById('auth-overlay')
    const chatContainer = document.getElementById('chat-container')

    let isAuthenticated = false

    // =========================
    // ✅ 只改这里：用 sessionStorage 控制“验证成功”只显示一次（同一个 tab 内）
    // =========================
    const WELCOME_KEY = 'uscgcc_welcome_shown'

    supabase.auth.getSession().then(({ data: { session } }: any) => {
      if (session) {
        isAuthenticated = true
        if (authOverlay) authOverlay.style.display = 'none'
        console.log('✅ 用户已登录')
      }
    })

    supabase.auth.onAuthStateChange((event: string, session: any) => {
      console.log('身份状态变化:', event)
      if (session && (event === 'SIGNED_IN' || event === 'USER_UPDATED')) {
        isAuthenticated = true
        if (authOverlay) {
          authOverlay.style.transition = 'opacity 0.5s'
          authOverlay.style.opacity = '0'
          setTimeout(() => (authOverlay.style.display = 'none'), 500)
        }

        if (!sessionStorage.getItem(WELCOME_KEY)) {
          sessionStorage.setItem(WELCOME_KEY, '1')
          addMessage('验证成功！我是您的 AI 助手，现在您可以向我提问了。', false)
        }
      }
    })

    function addMessage(text: string, isUser = false) {
      if (!chatBox) return

      const msgDiv = document.createElement('div')
      msgDiv.style.cssText = isUser
        ? 'align-self: flex-end; max-width: 85%; padding: 12px; background: #38bdf8; border-radius: 15px; border-bottom-right-radius: 2px; font-size: 0.85rem; color: white; word-wrap: break-word;'
        : 'align-self: flex-start; max-width: 90%; padding: 12px; background: #1e293b; border-radius: 15px; border-bottom-left-radius: 2px; font-size: 0.85rem; border: 1px solid rgba(56,189,248,0.2); word-wrap: break-word;'
      msgDiv.textContent = text
      chatBox.appendChild(msgDiv)

      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight
      }
    }

    function showLoading() {
      if (!chatBox) return
      const loadingDiv = document.createElement('div')
      loadingDiv.id = 'loading-msg'
      loadingDiv.style.cssText =
        'align-self: flex-start; max-width: 90%; padding: 12px; background: #1e293b; border-radius: 15px; border-bottom-left-radius: 2px; font-size: 0.85rem; border: 1px solid rgba(56,189,248,0.2);'
      loadingDiv.textContent = '正在思考...'
      chatBox.appendChild(loadingDiv)
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight
      }
    }

    function removeLoading() {
      const loadingMsg = document.getElementById('loading-msg')
      if (loadingMsg) loadingMsg.remove()
    }

    async function callAI(question: string, menuType: string | null = null) {
      try {
        showLoading()

        const {
          data: { session }
        } = await supabase.auth.getSession()
        if (!session) {
          removeLoading()
          addMessage('请先验证邮箱以使用 AI 提问功能。')
          return
        }

        let finalQuestion = question
        if (menuType && !question) {
          const menuQuestions: Record<string, string> = {
            商会简介: '请详细介绍美国粤商会的基本信息',
            总会长简介: '请介绍美国粤商会的总会长',
            秘书长简介: '请介绍美国粤商会的秘书长',
            入会指南: '请介绍如何加入美国粤商会',
            创始单位: '请介绍美国粤商会的创始单位',
            联系我们: '请提供美国粤商会的联系方式'
          }
          finalQuestion = menuQuestions[menuType] || `请介绍${menuType}`
        }

        if (!finalQuestion) {
          removeLoading()
          addMessage('请输入问题或选择菜单。')
          return
        }

        const { data, error } = await supabase.functions.invoke('swift-task', {
          body: {
            tenant_slug: 'uscgcc',
            question: finalQuestion,
            match_threshold: 0.5,
            match_count: 5
          }
        })

        removeLoading()

        if (error) {
          console.error('API 错误:', error)
          addMessage('抱歉，服务暂时不可用，请稍后再试。')
          return
        }

        if (data && data.ok && data.answer) {
          addMessage(data.answer)
        } else if (data && data.error) {
          addMessage('抱歉：' + data.error)
        } else {
          addMessage('抱歉，未能获取回答，请稍后再试。')
        }
      } catch (err) {
        removeLoading()
        console.error('调用失败:', err)
        addMessage('网络错误，请检查网络连接后重试。')
      }
    }

    async function sendMessage() {
      if (!isAuthenticated) {
        alert('请先验证邮箱以使用 AI 提问功能。')
        return
      }

      const question = chatInput?.value.trim()
      if (!question) return

      addMessage(question, true)
      chatInput.value = ''

      await callAI(question)
    }

    const menuButtons = document.querySelectorAll('.menu-btn')
    menuButtons.forEach(btn => {
      btn.addEventListener('click', async () => {
        if (!isAuthenticated) {
          alert('请先验证邮箱以使用 AI 提问功能。')
          return
        }

        const menuType = btn.getAttribute('data-menu')
        if (menuType) {
          await callAI('', menuType)
        }
      })
    })

    if (sendBtn) {
      sendBtn.addEventListener('click', sendMessage)
    }

    if (chatInput) {
      chatInput.addEventListener('keypress', (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
          sendMessage()
        }
      })
    }

    if (verifyBtn && emailInput) {
  console.log('✅ 验证按钮已就绪')

  verifyBtn.onclick = async e => {
    e.preventDefault()
    console.log('🚀 确认按钮被点击了')

    const email = emailInput.value.trim()
    if (!email || !email.includes('@')) {
      alert('请输入有效的电子邮箱地址')
      return
    }

    // ✅ 1) 弹窗让用户输入密码（简单版：只做注册 signUp，不做“已注册就去登录”的分支）
    const password = prompt(
      `邮箱：${email}\n\n请输入密码（至少8位，包含大小写字母+数字）：`
    )?.trim()

    if (!password) {
      alert('已取消：请先输入密码再继续。')
      return
    }

    // ✅ 简单校验（不严格，但能挡住明显错误）
    const okLen = password.length >= 8
    const hasUpper = /[A-Z]/.test(password)
    const hasLower = /[a-z]/.test(password)
    const hasNum = /\d/.test(password)

    if (!okLen || !hasUpper || !hasLower || !hasNum) {
      alert('密码不符合要求：至少8位，且包含大小写字母与数字。')
      return
    }

    verifyBtn.textContent = '注册中...'
    verifyBtn.disabled = true

    try {
      console.log('开始注册用户:', email)

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // ✅ 用户点击确认邮件链接后，跳回当前页面
          emailRedirectTo: window.location.origin + window.location.pathname
        }
      })

      if (error) throw error

      console.log('注册请求成功:', data)

      alert(
        '确认链接已发送！\n请检查您的邮箱（包括垃圾邮件文件夹）。\n点击邮件中的链接后将自动跳转回此页面开启对话。'
      )

      verifyBtn.textContent = '已发送'
      // ✅ 注意：这里不自动隐藏 overlay，因为要等用户点邮件确认后才算真正登录成功
      // 登录成功后你原来的 onAuthStateChange 会负责隐藏 overlay
    } catch (err: any) {
      console.error('注册失败:', err)

      // ✅ 你提醒的情况：邮箱已注册
      // 简单提示，不做自动登录分支（你说先简单一点）
      if (
        String(err?.message || '').toLowerCase().includes('already') ||
        String(err?.message || '').toLowerCase().includes('registered') ||
        String(err?.message || '').toLowerCase().includes('exists')
      ) {
        alert('这个邮箱已注册过了：请直接用“邮箱+密码登录”（后续我可以帮你加登录流程）。')
      } else {
        alert('失败：' + (err?.message || '未知错误'))
      }

      verifyBtn.textContent = '点击确认'
      verifyBtn.disabled = false
    }
  }
} else {
  console.error('❌ 邮箱验证按钮或输入框未找到', { verifyBtn, emailInput })
}
}

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        initChat()
        initNews()
      }, 500)
    })
  } else {
    setTimeout(() => {
      initChat()
      initNews()
    }, 500)
  }
}

// ============================================
// 点击 LOGO 弹出管理员登录框
// ============================================

function initAdminLogin() {
  const logo = document.querySelector('.logo-img') || document.querySelector('img[alt*="logo"]')

  if (!logo) {
    console.warn('未找到 LOGO 元素')
    return
  }

  if (logo) {
    const logoBtn = logo as HTMLElement
    logoBtn.style.cursor = 'pointer'
    logoBtn.title = '管理员登录'

    logoBtn.onclick = async e => {
  e.stopPropagation()

  const sb = (window as any).supabase
  if (!sb) return showLoginModal()

  try {
    const { data } = await sb.auth.getSession()
    if (data?.session?.user) {
      // ✅ 已登录：直接进后台，不再重复输账号密码
      window.location.href = '/admin-simple.html'
      return
    }
  } catch (err) {
    console.warn('getSession failed:', err)
  }

  // ✅ 未登录：才弹管理员登录框
  showLoginModal()
}

  }
}

// ============================================
// 🎯 修复：将函数声明为全局函数
// ============================================

// 显示登录弹窗
;(window as any).showLoginModal = function () {
  const existing = document.getElementById('adminLoginModal')
  if (existing) {
    existing.remove()
  }

  const modal = document.createElement('div')
  modal.id = 'adminLoginModal'
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    padding: 20px;
  `

  modal.innerHTML = `
    <div style="
      background: white;
      padding: 40px;
      border-radius: 15px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.3);
      max-width: 400px;
      width: 100%;
      position: relative;
    ">
      <button onclick="document.getElementById('adminLoginModal').remove()" style="
        position: absolute;
        top: 15px;
        right: 15px;
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #999;
      ">×</button>

      <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="color: #333; margin-bottom: 10px;">🔐 管理员登录</h2>
        <p style="color: #666; font-size: 14px;">USCGCC 内容管理系统</p>
      </div>

      <div id="loginModalAlert"></div>

      <form id="adminLoginForm">
        <div style="margin-bottom: 20px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">
            📧 邮箱
          </label>
          <input 
            type="email" 
            id="adminEmail" 
            required 
            placeholder="admin@uscgcc.org"
            style="
              width: 100%;
              padding: 12px;
              border: 2px solid #e0e0e0;
              border-radius: 8px;
              font-size: 14px;
            "
          >
        </div>

        <div style="margin-bottom: 20px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">
            🔒 密码
          </label>
          <input 
            type="password" 
            id="adminPassword" 
            required 
            placeholder="输入密码"
            style="
              width: 100%;
              padding: 12px;
              border: 2px solid #e0e0e0;
              border-radius: 8px;
              font-size: 14px;
            "
          >
        </div>

        <button 
          type="submit" 
          id="adminLoginBtn"
          style="
            width: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 14px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
          "
        >
          🚀 登录
        </button>
      </form>

      <div style="text-align: center; margin-top: 15px;">
        <a href="#" onclick="window.showForgotPassword(); return false;" style="color: #667eea; text-decoration: none; font-size: 14px;">
          🔑 忘记密码？
        </a>
      </div>

      <p style="text-align: center; margin-top: 20px; font-size: 12px; color: #999;">
        如需帮助，请联系系统管理员
      </p>
    </div>
  `

  document.body.appendChild(modal)

  modal.addEventListener('click', e => {
    if (e.target === modal) {
      modal.remove()
    }
  })

  const loginForm = document.getElementById('adminLoginForm')
  if (loginForm) {
    loginForm.addEventListener('submit', handleAdminLogin)
  }
}

// 初始化时也定义为局部函数
function showLoginModal() {
  ;(window as any).showLoginModal()
}

// 处理管理员登录
async function handleAdminLogin(e: any) {
  e.preventDefault()

  const btn = document.getElementById('adminLoginBtn') as HTMLButtonElement
  const alertDiv = document.getElementById('loginModalAlert')

  if (!btn || !alertDiv) return

  btn.disabled = true
  btn.textContent = '登录中...'

  const emailInput = document.getElementById('adminEmail') as HTMLInputElement
  const passwordInput = document.getElementById('adminPassword') as HTMLInputElement

  if (!emailInput || !passwordInput) {
    btn.disabled = false
    btn.textContent = '🚀 登录'
    return
  }

  const email = emailInput.value
  const password = passwordInput.value

  try {
    const { error } = await (window as any).supabase.auth.signInWithPassword({
      email: email,
      password: password
    })

    if (error) throw error

    if (alertDiv) {
      alertDiv.innerHTML = `
        <div style="padding: 12px; background: #d4edda; color: #155724; border-radius: 6px; margin-bottom: 20px;">
          ✅ 登录成功！正在跳转...
        </div>
      `
    }

    // 登录成功后直接跳转到 admin-simple.html
    setTimeout(() => {
      window.location.href = '/admin-simple.html'
    }, 1000)
  } catch (error: any) {
    if (alertDiv) {
      alertDiv.innerHTML = `
        <div style="padding: 12px; background: #f8d7da; color: #721c24; border-radius: 6px; margin-bottom: 20px;">
          ❌ ${error.message}
        </div>
      `
    }
    if (btn) btn.disabled = false
    if (btn) btn.textContent = '🚀 登录'
  }
}

// ============================================
// 🔑 忘记密码功能 - 声明为全局函数
// ============================================

;(window as any).showForgotPassword = function () {
  // 创建忘记密码弹窗
  const existing = document.getElementById('forgotPasswordModal')
  if (existing) {
    existing.remove()
  }

  const modal = document.createElement('div')
  modal.id = 'forgotPasswordModal'
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10001;
    padding: 20px;
  `

  modal.innerHTML = `
    <div style="
      background: white;
      padding: 40px;
      border-radius: 15px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.3);
      max-width: 400px;
      width: 100%;
      position: relative;
    ">
      <button onclick="document.getElementById('forgotPasswordModal').remove()" style="
        position: absolute;
        top: 15px;
        right: 15px;
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #999;
      ">×</button>

      <div style="text-align: center; margin-bottom: 30px;">
        <div style="font-size: 48px; margin-bottom: 15px;">🔑</div>
        <h2 style="color: #333; margin-bottom: 10px;">重置密码</h2>
        <p style="color: #666; font-size: 14px;">我们将发送密码重置链接到您的邮箱</p>
      </div>

      <div id="forgotPasswordAlert"></div>

      <form id="forgotPasswordForm">
        <div style="margin-bottom: 20px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">
            📧 管理员邮箱
          </label>
          <input 
            type="email" 
            id="resetEmail" 
            required 
            placeholder="输入您的管理员邮箱"
            style="
              width: 100%;
              padding: 12px;
              border: 2px solid #e0e0e0;
              border-radius: 8px;
              font-size: 14px;
            "
          >
        </div>

        <button 
          type="submit" 
          id="resetPasswordBtn"
          style="
            width: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 14px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
          "
        >
          📧 发送重置链接
        </button>
      </form>

      <div style="text-align: center; margin-top: 15px;">
        <a href="#" onclick="document.getElementById('forgotPasswordModal').remove(); window.showLoginModal(); return false;" style="color: #667eea; text-decoration: none; font-size: 14px;">
          ← 返回登录
        </a>
      </div>

      <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-top: 20px;">
        <p style="font-size: 12px; color: #666; line-height: 1.6; margin: 0;">
          💡 <strong>提示：</strong><br>
          • 密码必须至少8位<br>
          • 包含大小写字母和数字<br>
          • 点击发送后请检查邮箱（包括垃圾邮件）
        </p>
      </div>
    </div>
  `

  document.body.appendChild(modal)

  modal.addEventListener('click', e => {
    if (e.target === modal) {
      modal.remove()
    }
  })

  const forgotForm = document.getElementById('forgotPasswordForm')
  if (forgotForm) {
    forgotForm.addEventListener('submit', handleForgotPassword)
  }
}

// 处理忘记密码请求
async function handleForgotPassword(e: any) {
  e.preventDefault()

  const btn = document.getElementById('resetPasswordBtn') as HTMLButtonElement
  const alertDiv = document.getElementById('forgotPasswordAlert')

  if (!btn || !alertDiv) return

  btn.disabled = true
  btn.textContent = '发送中...'
  alertDiv.innerHTML = ''

  const emailInput = document.getElementById('resetEmail') as HTMLInputElement

  if (!emailInput) {
    btn.disabled = false
    btn.textContent = '📧 发送重置链接'
    return
  }

  const email = emailInput.value.trim()

  if (!email || !email.includes('@')) {
    alertDiv.innerHTML = `
      <div style="padding: 12px; background: #fff3cd; color: #856404; border-radius: 6px; margin-bottom: 20px;">
        ⚠️ 请输入有效的邮箱地址
      </div>
    `
    btn.disabled = false
    btn.textContent = '📧 发送重置链接'
    return
  }

  try {
    const { error } = await (window as any).supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/admin-simple.html'
    })

    if (error) throw error

    alertDiv.innerHTML = `
      <div style="padding: 15px; background: #d4edda; color: #155724; border-radius: 6px; margin-bottom: 20px;">
        <div style="font-weight: 600; margin-bottom: 8px;">✅ 重置邮件已发送！</div>
        <div style="font-size: 13px; line-height: 1.6;">
          我们已向 <strong>${email}</strong> 发送了密码重置链接。<br><br>
          <strong>接下来：</strong><br>
          1. 检查您的邮箱（包括垃圾邮件）<br>
          2. 点击邮件中的链接<br>
          3. 设置新密码（至少8位，含大小写字母+数字）
        </div>
      </div>
    `

    btn.textContent = '✅ 已发送'

    // 5秒后自动关闭弹窗
    setTimeout(() => {
      const modal = document.getElementById('forgotPasswordModal')
      if (modal) modal.remove()
    }, 5000)
  } catch (error: any) {
    alertDiv.innerHTML = `
      <div style="padding: 12px; background: #f8d7da; color: #721c24; border-radius: 6px; margin-bottom: 20px;">
        ❌ 发送失败：${error.message || '请稍后重试'}
      </div>
    `
    btn.disabled = false
    btn.textContent = '📧 发送重置链接'
  }
}
