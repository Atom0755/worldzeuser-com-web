# Supabase Edge Function 设置说明

## 概述

前端代码已经完成，现在需要在 Supabase 中创建一个 Edge Function 来处理 AI 聊天请求。

## Edge Function 名称

前端代码调用的是名为 `chat` 的 Edge Function。

## 需要创建的 Edge Function

### 1. 在 Supabase Dashboard 中创建 Edge Function

1. 登录 Supabase Dashboard: https://app.supabase.com
2. 选择你的项目: `hrnedqrnzqseuuxmegsb`
3. 进入 **Edge Functions** 页面
4. 点击 **Create a new function**
5. 函数名称: `chat`

### 2. Edge Function 代码示例

```typescript
// supabase/functions/chat/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
const OPENAI_MODEL = Deno.env.get('OPENAI_MODEL') || 'gpt-4'
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

serve(async (req) => {
  try {
    const { question, menuType, tenant, email } = await req.json()

    // 验证请求
    if (!question && !menuType) {
      return new Response(
        JSON.stringify({ error: '缺少问题或菜单类型' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // 创建 Supabase 客户端
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

    let answer = ''

    // 如果是菜单按钮点击，从知识库获取预设答案
    if (menuType) {
      const { data, error } = await supabase
        .from('knowledge_base')
        .select('content')
        .eq('tenant', tenant)
        .eq('menu_type', menuType)
        .single()

      if (data && !error) {
        answer = data.content
      } else {
        // 如果知识库中没有，使用 ChatGPT 生成
        answer = await generateAnswerWithChatGPT(menuType, tenant)
      }
    } else {
      // 普通问题：先查询知识库，如果没有再使用 ChatGPT
      const { data: kbData } = await supabase
        .from('knowledge_base')
        .select('content')
        .eq('tenant', tenant)
        .textSearch('content', question, { type: 'websearch' })
        .limit(1)
        .single()

      if (kbData) {
        answer = kbData.content
      } else {
        // 判断问题类型
        const isChamberRelated = await isChamberQuestion(question, tenant)
        
        if (isChamberRelated) {
          // 商会相关问题，但知识库没有，可能需要会长回答
          answer = '这个问题会转告会长，等他本人看了再回答给您。如果会长不能马上回答，那他后面也可把答复发到您的邮箱去。您说可以吗？或是继续问其它问题？'
          
          // 保存问题到待回答表
          await supabase.from('pending_questions').insert({
            tenant,
            email,
            question,
            status: 'pending'
          })
        } else {
          // 非商会相关问题，使用 ChatGPT 回答
          answer = await generateAnswerWithChatGPT(question, tenant)
        }
      }
    }

    return new Response(
      JSON.stringify({ answer }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})

async function generateAnswerWithChatGPT(prompt: string, tenant: string): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: [
        {
          role: 'system',
          content: `你是美国粤商会（USCGCC）的AI助手。请用中文回答问题。如果问题与商会无关，你可以用 ChatGPT 的知识回答。`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    })
  })

  const data = await response.json()
  return data.choices[0]?.message?.content || '抱歉，无法生成回答。'
}

async function isChamberQuestion(question: string, tenant: string): Promise<boolean> {
  // 简单的关键词判断，你可以根据实际需求改进
  const chamberKeywords = ['会长', '入会', '会员', '商会', '活动', '会议', '合作', '商务']
  return chamberKeywords.some(keyword => question.includes(keyword))
}
```

### 3. 数据库表结构

需要在 Supabase 中创建以下表：

#### knowledge_base 表（知识库）

```sql
CREATE TABLE IF NOT EXISTS knowledge_base (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant text NOT NULL,
  menu_type text, -- '商会简介', '总会长简介', '秘书长简介', '入会指南', '创始单位', '联系我们'
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS 策略
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;

CREATE POLICY "knowledge_base public read" ON knowledge_base
  FOR SELECT USING (true);
```

#### pending_questions 表（待回答问题）

```sql
CREATE TABLE IF NOT EXISTS pending_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant text NOT NULL,
  email text NOT NULL,
  question text NOT NULL,
  status text DEFAULT 'pending', -- 'pending', 'answered', 'dismissed'
  answer text,
  answered_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- RLS 策略
ALTER TABLE pending_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pending_questions insert" ON pending_questions
  FOR INSERT WITH CHECK (true);
```

### 4. 环境变量配置

在 Supabase Dashboard → Edge Functions → Secrets 中确保已配置：

- `OPENAI_API_KEY` - 你的 OpenAI API Key
- `OPENAI_MODEL` - 模型名称（如 `gpt-4` 或 `gpt-3.5-turbo`）
- `SUPABASE_URL` - 你的 Supabase URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service Role Key（不是 anon key）

### 5. 测试

部署 Edge Function 后，可以在前端测试：

1. 打开 `uscgcc.worldzeuser.com`
2. 输入邮箱并验证
3. 点击菜单按钮或输入问题测试

## 注意事项

1. **Edge Function 名称必须为 `chat`**，因为前端代码中调用的是 `supabase.functions.invoke('chat', ...)`

2. **知识库数据**：需要在 `knowledge_base` 表中插入预设内容，例如：
   ```sql
   INSERT INTO knowledge_base (tenant, menu_type, content) VALUES
   ('uscgcc', '商会简介', '美国粤商会（USCGCC）成立于...'),
   ('uscgcc', '总会长简介', '总会长XXX...'),
   ('uscgcc', '秘书长简介', '秘书长XXX...');
   ```

3. **邮件通知**：如果需要发送邮件通知会长有新问题，可以在 Edge Function 中添加邮件发送逻辑。

4. **安全性**：确保 Edge Function 有适当的错误处理和验证。
