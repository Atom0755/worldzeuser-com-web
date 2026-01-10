// src/pages/uscgcc.tsx
export const USCGCCPage = `
  <div style="
    min-height: 100vh;
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    color: #f8fafc;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
  ">
    <div style="
      width: 100%;
      max-width: 400px;
      height: 82vh; 
      background: rgba(30, 41, 59, 0.7);
      border: 2px solid rgba(255, 255, 255, 0.1);
      border-radius: 40px;
      display: flex;
      flex-direction: column;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(10px);
      overflow: hidden;
      position: relative;
    ">
      <div style="padding: 15px; background: rgba(30, 41, 59, 0.5); display: flex; flex-direction: column; align-items: center; justify-content: center; border-bottom: 1px solid rgba(255,255,255,0.05); gap: 8px;">
        <img src="/USCGCC-LOGO.jpg" style="width: 40px; height: 40px; border-radius: 4px;" />
        <div style="text-align: center;">
          <div style="font-weight: bold; font-size: 0.85rem;">USCGCC 美国粤商会/美中广东总商会</div>
          <div style="font-size: 0.65rem; color: #38bdf8;"> AI 智能助手</div>
        </div>
      </div>

      <div style="padding: 10px; display: flex; flex-direction: column; gap: 8px; background: rgba(15, 23, 42, 0.2);">
        <div style="display: flex; gap: 6px; justify-content: center; flex-wrap: wrap;">
          ${['商会简介', '总会长简介', '秘书长简介'].map(item => `
            <button class="menu-btn" data-menu="${item}" style="font-size: 10px; padding: 5px 12px; border-radius: 15px; border: 1px solid rgba(56, 189, 248, 0.3); color: #38bdf8; background: rgba(56, 189, 248, 0.05); cursor: pointer; transition: all 0.2s;">${item}</button>
          `).join('')}
        </div>
        <div style="display: flex; gap: 6px; justify-content: center; flex-wrap: wrap;">
          ${['入会指南', '创始单位', '联系我们'].map(item => `
            <button class="menu-btn" data-menu="${item}" style="font-size: 10px; padding: 5px 12px; border-radius: 15px; border: 1px solid rgba(56, 189, 248, 0.3); color: #38bdf8; background: rgba(56, 189, 248, 0.05); cursor: pointer; transition: all 0.2s;">${item}</button>
          `).join('')}
        </div>
      </div>

      <div id="chat-container" style="flex: 1.5; padding: 15px; display: flex; flex-direction: column; gap: 10px; overflow-y: auto;">
        <div style="align-self: flex-start; max-width: 90%; padding: 12px; background: #1e293b; border-radius: 15px; border-bottom-left-radius: 2px; font-size: 0.85rem; border: 1px solid rgba(56,189,248,0.2);">
          您好！我是美国粤商会AI助手。关于本商会的入会要求、近期活动，您可以直接在下方询问我。
        </div>
        <div id="chat-box" style="display: flex; flex-direction: column; gap: 10px;"></div>
      </div>

      <div style="padding: 5px 15px;">
        <div style="display: flex; gap: 8px; background: #0f172a; padding: 5px 5px 5px 15px; border-radius: 25px; border: 1px solid #38bdf8;">
          <input id="chat-input" type="text" placeholder="请问商会近期活动？..." style="flex: 1; background: transparent; border: none; color: white; outline: none; font-size: 0.85rem;">
          <button id="send-btn" style="width: 35px; height: 35px; border-radius: 50%; background: #38bdf8; border: none; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 18px; transition: all 0.2s;">↑</button>
        </div>
      </div>

      <div id="auth-overlay" style="padding: 5px 15px 10px;">
        <div style="display: flex; gap: 5px; background: rgba(255, 255, 255, 0.05); padding: 4px; border-radius: 10px;">
          <input id="email-input" type="email" placeholder="输入邮箱验证后开启 AI 提问" style="flex: 1; padding: 6px 12px; font-size: 0.7rem; border-radius: 8px; border: 1px solid #334155; background: #0f172a; color: white; outline: none;">
          <button id="verify-submit" style="padding: 6px 12px; font-size: 0.7rem; background: #8b5cf6; color: white; border: none; border-radius: 8px; cursor: pointer; transition: all 0.2s;">点击确认</button>
        </div>
      </div>

      <div style="flex: 0.8; background: rgba(15, 23, 42, 0.4); border-top: 1px solid rgba(255,255,255,0.05); padding: 12px; overflow-y: auto;">
        <div style="font-size: 0.75rem; color: #94a3b8; margin-bottom: 8px; font-weight: bold;">商会动态 News</div>
        <div style="font-size: 0.7rem; color: #e2e8f0; margin-bottom: 5px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 5px;">• 2024 美中经贸交流会成功举办...</div>
        <div style="font-size: 0.7rem; color: #e2e8f0; margin-bottom: 5px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 5px;">• 关于新入会成员资格公示通知...</div>
        <div style="font-size: 0.7rem; color: #e2e8f0; margin-bottom: 12px;">• 美国粤商会AI助手正式启用上线...</div>
        <div style="font-size: 0.7rem; color: #e2e8f0; margin-bottom: 12px;">• 更多动态资讯,即将发布...</div>
        <div style="text-align: center; padding-top: 5px;">
          <p style="font-size: 0.8rem; color: #38bdf8; margin: 0; cursor: pointer; font-weight: bold;">申请加入 USCGCC 商会 →</p>
        </div>
      </div>

      <div style="padding: 5px;"></div>
    </div>
`;

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
          supabase.auth.getSession().then(({ data: { session } }) => {
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
          function addMessage(text, isUser = false) {
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
          async function callAI(question, menuType = null) {
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
                // 菜单按钮点击，构造问题
                const menuQuestions = {
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

            const question = chatInput?.value.trim();
            if (!question) return;

            // 显示用户消息
            addMessage(question, true);
            
            // 清空输入框
            if (chatInput) chatInput.value = '';

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
            chatInput.addEventListener('keypress', (e) => {
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
        
        // 立即尝试初始化，如果失败则延迟重试
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', () => {
            setTimeout(initChat, 500);
          });
        } else {
          setTimeout(initChat, 500);
        }
      })();
    </script>
  </div>
`;
