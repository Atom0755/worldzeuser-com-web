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
        <img src="/USCGCC-LOGO.jpg" class="logo-img" id="logo-img" style="width: 40px; height: 40px; border-radius: 4px; cursor: pointer;" />
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
        <div id="news-list"></div>
        <div style="text-align: center; padding-top: 5px;">
          <p style="font-size: 0.8rem; color: #38bdf8; margin: 0; cursor: pointer; font-weight: bold;">申请加入 USCGCC 商会 →</p>
        </div>
      </div>

      <div style="padding: 5px;"></div>
    </div>

    <!-- 新闻全文弹窗 -->
    <div id="news-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; justify-content: center; align-items: center;">
      <div style="background: #1e293b; border-radius: 20px; max-width: 90%; max-height: 80vh; width: 500px; position: relative; overflow: hidden; border: 2px solid rgba(56, 189, 248, 0.3);">
        <div style="padding: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center; background: rgba(15, 23, 42, 0.8);">
          <h3 id="modal-title" style="margin: 0; color: #38bdf8; font-size: 1.1rem;"></h3>
          <button id="close-modal" style="background: none; border: none; color: #94a3b8; font-size: 24px; cursor: pointer; padding: 0; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">×</button>
        </div>
        <div style="padding: 20px; overflow-y: auto; max-height: calc(80vh - 100px);">
          <div id="modal-date" style="color: #94a3b8; font-size: 0.85rem; margin-bottom: 15px;"></div>
          <div id="modal-content" style="color: #e2e8f0; font-size: 0.9rem; line-height: 1.6; white-space: pre-wrap;"></div>
        </div>
      </div>
    </div>


    <script type="module">
      import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
      
      const supabase = createClient(
        'https://hrnedqrnzqseuuxmegsb.supabase.co',
        'sb_publishable_3_j109YmeDowhqaIda2HLQ_PuzH6mio'
      );

      // 加载并显示新闻列表
      async function loadNews() {
        try {
          const { data, error } = await supabase
            .from('news')
            .select('*')
            .eq('status', 'published')
             .eq('tenant_slug', 'uscgcc')  // ✅ 添加这一行
            .order('created_at', { ascending: false });

          if (error) throw error;

          const newsList = document.getElementById('news-list');
          if (!data || data.length === 0) {
            newsList.innerHTML = '<div style="font-size: 0.7rem; color: #94a3b8; text-align: center;">暂无动态新闻...</div>';
            return;
          }

          newsList.innerHTML = data.map(news => {
            const preview = news.content ? news.content.substring(0, 40) + (news.content.length > 40 ? '...' : '') : '';
            return \`
              <div class="news-item" data-id="\${news.id}" style="font-size: 0.7rem; color: #e2e8f0; margin-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 8px; cursor: pointer; transition: all 0.2s;">
                <div style="font-weight: bold; margin-bottom: 3px;">\${news.title}</div>
                <div style="color: #94a3b8; font-size: 0.65rem; margin-bottom: 3px;">\${news.publish_date || ''}</div>
                <div style="padding-left: 1em; color: #cbd5e1; font-size: 0.68rem;">\${preview}</div>
              </div>
            \`;
          }).join('');

          // 添加点击事件
          document.querySelectorAll('.news-item').forEach(item => {
            item.addEventListener('click', async () => {
              const newsId = item.getAttribute('data-id');
              await showNewsModal(newsId);
            });
            item.addEventListener('mouseenter', function() {
              this.style.background = 'rgba(56, 189, 248, 0.1)';
              this.style.borderRadius = '8px';
              this.style.padding = '8px';
            });
            item.addEventListener('mouseleave', function() {
              this.style.background = 'transparent';
              this.style.padding = '0';
              this.style.paddingBottom = '8px';
            });
          });
        } catch (error) {
          console.error('加载新闻失败:', error);
        }
      }

      // 显示新闻详情弹窗
      async function showNewsModal(newsId) {
        try {
          const { data, error } = await supabase
            .from('news')
            .select('*')
            .eq('id', newsId)
            .single();

          if (error) throw error;

          document.getElementById('modal-title').textContent = data.title;
          document.getElementById('modal-date').textContent = data.publish_date || '';
          document.getElementById('modal-content').textContent = data.content || '';
          document.getElementById('news-modal').style.display = 'flex';
        } catch (error) {
          console.error('加载新闻详情失败:', error);
        }
      }

      // 关闭弹窗
      document.getElementById('close-modal').addEventListener('click', () => {
        document.getElementById('news-modal').style.display = 'none';
      });

      // 点击背景关闭弹窗
      document.getElementById('news-modal').addEventListener('click', (e) => {
        if (e.target.id === 'news-modal') {
          document.getElementById('news-modal').style.display = 'none';
        }
      });

      // LOGO点击事件 - 跳转到管理后台
      document.getElementById('logo-img').addEventListener('click', () => {
        window.location.href = '/admin-simple.html';
      });

      // 页面加载时加载新闻
      loadNews();
    </script>
`;
