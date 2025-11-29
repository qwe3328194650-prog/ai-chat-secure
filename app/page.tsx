// 文件路径: app/page.tsx
'use client';

import { useChat } from 'ai/react';
import { useState, useEffect } from 'react';

export default function Chat() {
  // 定义一个状态来存储用户输入的访问密码
  const [password, setPassword] = useState('');
  
  // useChat 钩子
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    // 关键点：每次发送请求时，把密码一起发给后端
    body: { password },
  });

  return (
    <div className="flex flex-col w-full max-w-md py-10 mx-auto px-4 h-screen">
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800">AI 聚合助手</h1>
        <p className="text-sm text-gray-500">请输入密码以开始对话</p>
      </header>

      {/* 🔐 密码输入区域 */}
      <div className="mb-4">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="在此输入访问密码..."
          className="w-full p-2 border border-red-200 rounded-md text-center bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-300"
        />
      </div>

      {/*⚠️ 错误提示 (如果密码不对) */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm text-center">
          {error.message.includes('401') ? '密码错误，请重试' : '出错了，请稍后再试'}
        </div>
      )}

      {/* 💬 聊天记录区域 */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 border rounded-xl bg-white shadow-inner">
        {messages.length === 0 && (
          <div className="text-gray-400 text-center mt-20">
            👋 输完密码后，在下方问我任何问题
          </div>
        )}
        
        {messages.map((m) => (
          <div
            key={m.id}
            className={`p-3 rounded-lg text-sm ${
              m.role === 'user' 
                ? 'bg-blue-600 text-white self-end ml-auto max-w-[80%]' 
                : 'bg-gray-100 text-gray-800 self-start mr-auto max-w-[80%]'
            }`}
          >
            <strong>{m.role === 'user' ? '你: ' : 'AI: '}</strong>
            {m.content}
          </div>
        ))}
        
        {isLoading && <div className="text-gray-400 text-sm animate-pulse">正在输入...</div>}
      </div>

      {/* 📝 消息输入框 */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={input}
          placeholder="问点什么..."
          onChange={handleInputChange}
          disabled={!password} // 没输密码时不让输入问题
        />
        <button 
          type="submit" 
          disabled={isLoading || !password}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-bold"
        >
          发送
        </button>
      </form>
    </div>
  );
}