import { USCGCCPage } from './pages/uscgcc'
import { USCLGCCPage } from './pages/usclgcc'
import { ILAUSAPage } from './pages/ilausa'
import { UZLEAPage } from './pages/uzlea'
import { GBIPage } from './pages/gbi' // ✅ 注意这里：gbi 不是 bgi
import { supabase } from './lib/supabase'

// 将 Supabase 设置为全局变量，供页面内联脚本使用
;(window as any).supabase = supabase

const root = document.getElementById('root')

if (root) {
  const hostname = window.location.hostname.toLowerCase()
  const pathname = window.location.pathname.toLowerCase()

  // --- 逻辑判断：是否进入二级域名子页面 ---
  if (hostname.startsWith('uscgcc.') || pathname.startsWith('/a/uscgcc')) {
    root.innerHTML = USCGCCPage;
    // 给浏览器一点点时间渲染 HTML 字符串
    requestAnimationFrame(() => {
      initUSCGCCPage();
    });
  }
    // 初始化 USCGCC 页面的交互逻辑
    initUSCGCCPage()
  } else if (hostname.startsWith('usclgcc.') || pathname.startsWith('/a/usclgcc')) {
    root.innerHTML = USCLGCCPage
  } else if (hostname.startsWith('ilausa.') || pathname.startsWith('/a/ilausa')) {
    root.innerHTML = ILAUSAPage
  } else if (hostname.startsWith('uzlea.') || pathname.startsWith('/a/uzlea')) {
    root.innerHTML = UZLEAPage
  } else if (hostname.startsWith('gbi.') || pathname.startsWith('/a/gbi')) {
    root.innerHTML = GBIPage
  } else {
    // --- 默认首页 ---
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
    `; // ✅ 补充分号，明确赋值结束
  }

  // USCGCC 页面初始化函数
  function initUSCGCCPage() {
    // 等待 DOM 和 Supabase 初始化
    function initChat() {
      const supabase = (window as any).supabase;
      if (!supabase) {
        console.error('Supabase 未初始化，3秒后重试...');
        setTimeout(initChat, 3000);
        return;
      }
      
      console.log('Supabase 已初始化，开始设置事件监听器');

      // 获取 DOM 元素
      const chatBox = document.getElementById('chat-box');
      const chatInput = document.getElementById('chat-input');
      const sendBtn = document.getElementById('send-btn');
      const emailInput = document.getElementById('email-input');
      const verifyBtn = document.getElementById('verify-submit');
      const authOverlay = document.getElementById('auth-overlay');
      const chatContainer = document.getElementById('chat-container');
      let isAuthenticated = false;
      let userEmail = '';

      // 检查登录状态
      supabase.auth.getSession().then(({ data: { session } }: any) => {
        if (session) {
          isAuthenticated = true;
          userEmail = session.user.email || '';
          if (authOverlay) authOverlay.style.display = 'none';
        }
      });

      // 监听认证状态变化
      // 监听登录状态，一旦登录成功，自动隐藏遮罩并允许提问
supabase.auth.onAuthStateChange((event: string, session: any) => {
  console.log('身份状态变化:', event);
  if (session && (event === 'SIGNED_IN' || event === 'USER_UPDATED')) {
    isAuthenticated = true;
    if (authOverlay) {
      authOverlay.style.transition = 'opacity 0.5s';
      authOverlay.style.opacity = '0';
      setTimeout(() => authOverlay.style.display = 'none', 500);
    }
    addMessage("验证成功！我是您的 AI 助手，现在您可以结合知识库向我提问了。", false);
  }
});

      // 添加消息到聊天框
      function addMessage(text: string, isUser = false) {
        if (!chatBox) return;
        
        const msgDiv = document.createElement('div');
        msgDiv.style.cssText = isUser 
          ? 'align-self: flex-end; max-width: 85%; padding: 12px; background: #38bdf8; border-radius: 15px; border-bottom-right-radius: 2px; font-size: 0.85rem; color: white; word-wrap: break-word;'
          : 'align-self: flex-start; max-width: 90%; padding: 12px; background: #1e293b; border-radius: 15px; border-bottom-left-radius: 2px; font-size: 0.85rem; border: 1px solid rgba(56,189,248,0.2); word-wrap: break-word;';
        msgDiv.textContent = text;
        chatBox.appendChild(msgDiv);
        
        // 滚动到底部
        if (chatContainer) {
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
      }

      // 显示加载状态
      function showLoading() {
        if (!chatBox) return;
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'loading-msg';
        loadingDiv.style.cssText = 'align-self: flex-start; max-width: 90%; padding: 12px; background: #1e293b; border-radius: 15px; border-bottom-left-radius: 2px; font-size: 0.85rem; border: 1px solid rgba(56,189,248,0.2);';
        loadingDiv.textContent = '正在思考...';
        chatBox.appendChild(loadingDiv);
        if (chatContainer) {
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
      }

      // 移除加载状态
      function removeLoading() {
        const loadingMsg = document.getElementById('loading-msg');
        if (loadingMsg) loadingMsg.remove();
      }

      // 调用 AI API
      async function callAI(question: string, menuType: string | null = null) {
        try {
          showLoading();
          
          // 获取当前 session
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) {
            removeLoading();
            addMessage('请先验证邮箱以使用 AI 提问功能。');
            return;
          }

          // 如果是菜单按钮，构造问题
          let finalQuestion = question;
          if (menuType && !question) {
            const menuQuestions: Record<string, string> = {
              '商会简介': '请详细介绍美国粤商会的基本信息',
              '总会长简介': '请介绍美国粤商会的总会长',
              '秘书长简介': '请介绍美国粤商会的秘书长',
              '入会指南': '请介绍如何加入美国粤商会',
              '创始单位': '请介绍美国粤商会的创始单位',
              '联系我们': '请提供美国粤商会的联系方式'
            };
            finalQuestion = menuQuestions[menuType] || `请介绍${menuType}`;
          }

          if (!finalQuestion) {
            removeLoading();
            addMessage('请输入问题或选择菜单。');
            return;
          }

          // 调用 Supabase Edge Function (swift-task)
          const { data, error } = await supabase.functions.invoke('swift-task', {
            body: {
              tenant_slug: 'uscgcc',
              question: finalQuestion,
              match_threshold: 0.75,
              match_count: 5
            }
          });

          removeLoading();

          if (error) {
            console.error('API 错误:', error);
            addMessage('抱歉，服务暂时不可用，请稍后再试。');
            return;
          }

          if (data && data.ok && data.answer) {
            addMessage(data.answer);
          } else if (data && data.error) {
            addMessage('抱歉：' + data.error);
          } else {
            addMessage('抱歉，未能获取回答，请稍后再试。');
          }
        } catch (err) {
          removeLoading();
          console.error('调用失败:', err);
          addMessage('网络错误，请检查网络连接后重试。');
        }
      }

      // 发送消息
      async function sendMessage() {
        if (!isAuthenticated) {
          alert('请先验证邮箱以使用 AI 提问功能。');
          return;
        }

        const question = (chatInput as HTMLInputElement)?.value.trim();
        if (!question) return;

        // 显示用户消息
        addMessage(question, true);
        
        // 清空输入框
        if (chatInput) (chatInput as HTMLInputElement).value = '';

        // 调用 AI
        await callAI(question);
      }

      // 菜单按钮点击事件
      const menuButtons = document.querySelectorAll('.menu-btn');
      menuButtons.forEach(btn => {
        btn.addEventListener('click', async () => {
          if (!isAuthenticated) {
            alert('请先验证邮箱以使用 AI 提问功能。');
            return;
          }

          const menuType = btn.getAttribute('data-menu');
          if (menuType) {
            await callAI('', menuType);
          }
        });
      });

      // 发送按钮点击事件
      if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
      }

      // 输入框回车事件
      if (chatInput) {
        chatInput.addEventListener('keypress', (e: KeyboardEvent) => {
          if (e.key === 'Enter') {
            sendMessage();
          }
        });
      }

      // 邮箱验证
      // 邮箱验证逻辑修复
if (verifyBtn && emailInput) {
  console.log('✅ 验证按钮已就绪');
  
  // 移除旧的监听器（防止重复绑定）并添加新的
  verifyBtn.onclick = async (e) => {
    e.preventDefault(); // 防止表单默认提交
    console.log('🚀 确认按钮被点击了');
    
    const email = (emailInput as HTMLInputElement).value.trim();
    if (!email || !email.includes('@')) {
      alert('请输入有效的电子邮箱地址');
      return;
    }

    verifyBtn.textContent = '发送中...';
    (verifyBtn as HTMLButtonElement).disabled = true;

    try {
      // 1. 发送 OTP 邮件
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          // 确保这个 URL 在 Supabase 后台的 Redirect URLs 列表里
          emailRedirectTo: window.location.origin + window.location.pathname,
        }
      });

      if (error) throw error;
      
      alert('验证链接已发送！请检查您的邮箱（包括垃圾邮件）。点击链接后即可解锁 AI。');
      verifyBtn.textContent = '验证中...';

    } catch (err: any) {
      console.error('发送失败:', err);
      alert('发送失败: ' + (err.message || '未知错误'));
      verifyBtn.textContent = '点击确认';
      (verifyBtn as HTMLButtonElement).disabled = false;
    }
  };
}

          try {
            console.log('开始发送验证邮件...');
            const { data, error } = await supabase.auth.signInWithOtp({
              email: email,
              options: {
                emailRedirectTo: window.location.origin + window.location.pathname
              }
            });

            if (error) {
              console.error('Supabase 错误:', error);
              throw error;
            }
            
            console.log('验证邮件发送成功:', data);
            alert('验证链接已发送！\n请检查您的邮箱（包括垃圾邮件文件夹）。\n点击邮件中的链接后将自动跳转回此页面开启对话。');
            verifyBtn.textContent = '已发送';
          } catch (err: any) {
            console.error('发送失败:', err);
            alert('发送失败: ' + (err.message || '未知错误') + '\n请检查控制台获取详细信息。');
            verifyBtn.textContent = '点击确认';
            (verifyBtn as HTMLButtonElement).disabled = false;
          }
        });
      } else {
        console.error('邮箱验证按钮或输入框未找到', { verifyBtn, emailInput });
      }
    }
    
    // 立即尝试初始化，如果失败则延迟重试
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initChat, 500);
      });
    } else {
      setTimeout(initChat, 500);
    }
  }
} // ✅ 这是最后一行，关闭 if (root)