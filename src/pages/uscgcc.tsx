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
      <div style="padding: 15px; background: rgba(30, 41, 59, 0.5); display: flex; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05);">
        <img src="/USCGCC-LOGO.jpg" style="width: 30px; height: 30px; margin-right: 12px; border-radius: 4px;" />
        <div>
          <div style="font-weight: bold; font-size: 0.85rem;">USCGCC 美国粤商会/美中广东总商会</div>
          <div style="font-size: 0.65rem; color: #38bdf8;"> AI 智能助手</div>
        </div>
      </div>

      <div style="padding: 10px; display: flex; flex-direction: column; gap: 8px; background: rgba(15, 23, 42, 0.2);">
        <div style="display: flex; gap: 6px; justify-content: center;">
          ${['商会简介', '总会长简介', '秘书长简介'].map(item => `
            <button style="font-size: 10px; padding: 5px 12px; border-radius: 15px; border: 1px solid rgba(56, 189, 248, 0.3); color: #38bdf8; background: rgba(56, 189, 248, 0.05); cursor: pointer;">${item}</button>
          `).join('')}
        </div>
        <div style="display: flex; gap: 6px; justify-content: center;">
          ${['入会指南', '创始单位', '联系我们'].map(item => `
            <button style="font-size: 10px; padding: 5px 12px; border-radius: 15px; border: 1px solid rgba(56, 189, 248, 0.3); color: #38bdf8; background: rgba(56, 189, 248, 0.05); cursor: pointer;">${item}</button>
          `).join('')}
        </div>
      </div>

      <div style="flex: 1.5; padding: 15px; display: flex; flex-direction: column; gap: 10px; overflow-y: auto;">
        <div style="align-self: flex-start; max-width: 90%; padding: 12px; background: #1e293b; border-radius: 15px; border-bottom-left-radius: 2px; font-size: 0.85rem; border: 1px solid rgba(56,189,248,0.2);">
          您好！我是美国粤商会AI助手。关于本商会的入会要求、近期活动，您可以直接在下方询问我。
        </div>
        <div id="chat-box" style="display: flex; flex-direction: column; gap: 10px;"></div>
      </div>

      <div style="padding: 5px 15px;">
        <div style="display: flex; gap: 8px; background: #0f172a; padding: 5px 5px 5px 15px; border-radius: 25px; border: 1px solid #38bdf8;">
          <input type="text" placeholder="请问商会近期活动？..." style="flex: 1; background: transparent; border: none; color: white; outline: none; font-size: 0.85rem;">
          <button style="width: 35px; height: 35px; border-radius: 50%; background: #38bdf8; border: none; color: white; cursor: pointer;">↑</button>
        </div>
      </div>

      <div id="auth-section" style="padding: 5px 15px 10px;">
        <div style="display: flex; gap: 5px; background: rgba(255, 255, 255, 0.05); padding: 4px; border-radius: 10px;">
          <input id="user-email" type="email" placeholder="输入邮箱验证后向AI助手咨询" style="flex: 1; padding: 6px 12px; font-size: 0.7rem; border-radius: 8px; border: 1px solid #334155; background: #0f172a; color: white; outline: none;">
          <button id="verify-btn" style="padding: 6px 12px; font-size: 0.7rem; background: #8b5cf6; color: white; border: none; border-radius: 8px; cursor: pointer;">点击确认</button>
        </div>
      </div>

      <div style="flex: 0.8; background: rgba(15, 23, 42, 0.4); border-top: 1px solid rgba(255,255,255,0.05); padding: 12px; overflow-y: auto;">
        <div style="font-size: 0.75rem; color: #94a3b8; margin-bottom: 8px; font-weight: bold;">商会动态 News</div>
        <div style="font-size: 0.7rem; color: #e2e8f0; margin-bottom: 5px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 5px;">• 2024 美中经贸交流会成功举办...</div>
        <div style="font-size: 0.7rem; color: #e2e8f0; margin-bottom: 5px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 5px;">• 关于新入会成员资格公示通知...</div>
        <div style="font-size: 0.7rem; color: #e2e8f0; margin-bottom: 12px;">• 美国粤商会AI助手正式启用上线...</div>
        <div style="font-size: 0.7rem; color: #e2e8f0; margin-bottom: 12px;">• 更多动态资讯,即将发布...</div>
        <div style="text-align: center; padding-top: 5px;">
          <p style="font-size: 0.8rem; color: #38bdf8; margin: 1; cursor: pointer; font-weight: bold;">申请加入 USCGCC 商会 -→</p>
        </div>
      </div>

      <div style="padding: 5px;"></div>
    </div>

    <script>
      // 这里的逻辑会在页面加载后运行
      const verifyBtn = document.getElementById('verify-btn');
      const emailInput = document.getElementById('user-email');
      const authSection = document.getElementById('auth-section');

      // 1. 检查是否已经登录
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) authSection.style.display = 'none';
      });

      // 2. 监听登录按钮
      verifyBtn.addEventListener('click', async () => {
        const email = emailInput.value;
        if (!email || !email.includes('@')) {
          alert('请输入有效的电子邮箱地址');
          return;
        }

        verifyBtn.innerText = '发送中...';
        verifyBtn.disabled = true;

        const { error } = await supabase.auth.signInWithOtp({
          email: email,
          options: {
            emailRedirectTo: window.location.origin + '/uscgcc'
          }
        });

        if (error) {
          alert('发送失败: ' + error.message);
          verifyBtn.innerText = '点击确认';
          verifyBtn.disabled = false;
        } else {
          alert('验证链接已发送到您的邮箱！\\n请在邮箱内点击链接回到此处。');
          verifyBtn.innerText = '等待验证';
        }
      });

      // 3. 监听登录状态变化，一旦点击链接回来就自动隐藏输入框
      supabase.auth.onAuthStateChange((event, session) => {
        if (session) authSection.style.display = 'none';
      });
    </script>
  </div>
`;