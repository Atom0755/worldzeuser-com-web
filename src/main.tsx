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
    // 修改 main.tsx 中的逻辑
requestAnimationFrame(() => {
  initUSCGCCPage();
  setTimeout(() => {
      initAdminLogin(); // 延迟一丁点时间执行，确保 DOM 节点已存在
  }, 100);
});
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
        padding: 40px 20px;
      ">
        <div style="
          width: 100%;
          max-width: 400px;
          background: rgba(30, 41, 59, 0.7);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 40px;
          padding: 40px 24px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          text-align: center;
          backdrop-filter: blur(10px);
        ">
          <div style="margin-bottom: 24px;">
            <img src="/ZEHEM-LOGO.png" style="width:100px; height:auto; filter: drop-shadow(0 0 8px rgba(255,255,255,0.2));" />
          </div>

          <h1 style="font-size: 1.8rem; margin: 0; letter-spacing: -0.5px; font-weight: 700;">
            WorldZeuser我的助手<br />
            <span style="color: #38bdf8; font-size: 1.5rem;">AI Assistants</span>
          </h1>

          <p style="color: #94a3b8; margin: 12px 0 0; font-size: 0.9rem;">AI Portal for The Associations</p>
          <p style="color: #64748b; margin: 4px 0 24px; font-size: 0.8rem;">by ZEHEM.AI 哲亨的爱 created</p>

          <hr style="width: 180px; border: 0; border-top: 2px solid #38bdf8; margin: 20px auto 30px;" />

          <ul style="list-style: none; padding: 0; display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px;">
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
                  padding: 14px 18px;
                  background: rgba(255, 255, 255, 0.05);
                  border: 1px solid rgba(255, 255, 255, 0.1);
                  border-radius: 16px;
                  color: #e2e8f0;
                  text-decoration: none;
                  font-weight: 500;
                  transition: all 0.2s ease;
                  font-size: 0.95rem;
                ">
                  ${item.name}
                </a>
              </li>
            `).join('')}
          </ul>

          <footer style="margin-top: 30px; color: #475569; font-size: 0.75rem;">
            © 2025 WorldZeuser.com我的助手 All Rights Reserved.
          </footer>
        </div>
      </div>
    `
  }
}

function initUSCGCCPage() {
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
    const emailInput = document.getElementById('email-input') as HTMLInputElement
    const verifyBtn = document.getElementById('verify-submit') as HTMLButtonElement
    const authOverlay = document.getElementById('auth-overlay')
    const chatContainer = document.getElementById('chat-container')
    
    let isAuthenticated = false

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
          setTimeout(() => authOverlay.style.display = 'none', 500)
        }
        addMessage("验证成功！我是您的 AI 助手，现在您可以向我提问了。", false)
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
      loadingDiv.style.cssText = 'align-self: flex-start; max-width: 90%; padding: 12px; background: #1e293b; border-radius: 15px; border-bottom-left-radius: 2px; font-size: 0.85rem; border: 1px solid rgba(56,189,248,0.2);'
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
        
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          removeLoading()
          addMessage('请先验证邮箱以使用 AI 提问功能。')
          return
        }

        let finalQuestion = question
        if (menuType && !question) {
          const menuQuestions: Record<string, string> = {
            '商会简介': '请详细介绍美国粤商会的基本信息',
            '总会长简介': '请介绍美国粤商会的总会长',
            '秘书长简介': '请介绍美国粤商会的秘书长',
            '入会指南': '请介绍如何加入美国粤商会',
            '创始单位': '请介绍美国粤商会的创始单位',
            '联系我们': '请提供美国粤商会的联系方式'
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
      
      verifyBtn.onclick = async (e) => {
        e.preventDefault()
        console.log('🚀 确认按钮被点击了')
        
        const email = emailInput.value.trim()
        if (!email || !email.includes('@')) {
          alert('请输入有效的电子邮箱地址')
          return
        }

        verifyBtn.textContent = '发送中...'
        verifyBtn.disabled = true

        try {
          console.log('开始发送验证邮件到:', email)
          
          const { data, error } = await supabase.auth.signInWithOtp({
            email: email,
            options: {
              emailRedirectTo: window.location.origin + window.location.pathname
            }
          })

          if (error) {
            console.error('Supabase 错误:', error)
            throw error
          }
          
          console.log('验证邮件发送成功:', data)
          alert('验证链接已发送！\n请检查您的邮箱（包括垃圾邮件文件夹）。\n点击邮件中的链接后将自动跳转回此页面开启对话。')
          verifyBtn.textContent = '已发送'
          
        } catch (err: any) {
          console.error('发送失败:', err)
          alert('发送失败: ' + (err.message || '未知错误') + '\n请检查您的邮箱格式是否正确。')
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
      setTimeout(initChat, 500)
    })
  } else {
    setTimeout(initChat, 500)
  }
}

// 在 main.tsx 或 uscgcc.tsx 中添加这段代码
// 让点击 LOGO 弹出管理员登录框

function initAdminLogin() {
  // 找到 LOGO 元素
  const logo = document.querySelector('.logo-img') || document.querySelector('img[alt*="logo"]');
  
  if (!logo) {
    console.warn('未找到 LOGO 元素');
    return;
  }

  // 添加点击事件
  if (logo) {
    const logoBtn = logo as HTMLElement;
    logoBtn.style.cursor = 'pointer';
    logoBtn.title = '管理员登录';
    
    logoBtn.onclick = (e) => {
      e.stopPropagation();
      showLoginModal();
    };
  }
}

// 显示登录弹窗
function showLoginModal() {
  // 如果已经有弹窗，先移除
  const existing = document.getElementById('adminLoginModal');
  if (existing) {
    existing.remove();
  }

  // 创建弹窗
  const modal = document.createElement('div');
  modal.id = 'adminLoginModal';
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
  `;

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
        <a href="/admin-unified.html" style="color: #667eea; text-decoration: none; font-size: 14px; margin-right: 15px;">
          📝 注册新账号
        </a>
        <a href="/admin-unified.html" style="color: #667eea; text-decoration: none; font-size: 14px;">
          🔑 忘记密码？
        </a>
      </div>

      <p style="text-align: center; margin-top: 20px; font-size: 12px; color: #999;">
        如需帮助，请联系系统管理员
      </p>
    </div>
  `;

  document.body.appendChild(modal);

  // 点击背景关闭
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });

  // 处理登录
  const loginForm = document.getElementById('adminLoginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', handleAdminLogin);
  }
}

// 处理管理员登录
// --- 最终无错版，替换文件末尾 ---

async function handleAdminLogin(e: any) { 
  e.preventDefault();

  // 1. 获取登录按钮，并强制告诉 TS 这是一个 HTMLButtonElement
  const btn = document.getElementById('adminLoginBtn') as HTMLButtonElement;
  // 2. 获取提示框
  const alertDiv = document.getElementById('loginModalAlert');
  
  // 3. 安全检查：如果找不到这两个核心元素，直接返回，不执行后面代码
  if (!btn || !alertDiv) return;

  // 此时 btn 已经确定存在，TS 不会再报错
  btn.disabled = true;
  btn.textContent = '登录中...';

  // 4. 获取输入框，并强制告诉 TS 它们是 HTMLInputElement
  const emailInput = document.getElementById('adminEmail') as HTMLInputElement;
  const passwordInput = document.getElementById('adminPassword') as HTMLInputElement;
  
  // 5. 安全检查：确保输入框存在
  if (!emailInput || !passwordInput) {
    btn.disabled = false;
    btn.textContent = '🚀 登录';
    return;
  }

  const email = emailInput.value;
  const password = passwordInput.value;

  try {
    const { error } = await (window as any).supabase.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) throw error;

    if (alertDiv) {
      alertDiv.innerHTML = `
        <div style="padding: 12px; background: #d4edda; color: #155724; border-radius: 6px; margin-bottom: 20px;">
          ✅ 登录成功！正在跳转...
        </div>
      `;
    }

    setTimeout(() => {
      (window as any).location.href = '/admin-unified.html';
    }, 1000);

  } catch (error: any) {
    if (alertDiv) {
      alertDiv.innerHTML = `
        <div style="padding: 12px; background: #f8d7da; color: #721c24; border-radius: 6px; margin-bottom: 20px;">
          ❌ ${error.message}
        </div>
      `;
    }
    // 6. 出错时恢复按钮状态
    if (btn) btn.disabled = false;
    if (btn) btn.textContent = '🚀 登录';
  }
}