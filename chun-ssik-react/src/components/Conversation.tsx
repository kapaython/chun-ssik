import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const API_URL = "https://uxfgyv3e99.execute-api.us-west-2.amazonaws.com/jack-test-1/jack-test";

interface Message {
  type: 'user' | 'ai';
  content: string;
}

const Conversation: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const caseType = searchParams.get('case');

  const caseTexts = {
    'transfer': '내용 : 4월 1일 13시에 김응수에게 3건 송금한 기록이 있는데, 저는 이런 송금을 한 기억이 없습니다.\npayId: 1001234',
    'balance': '내용 : 제가 진행하지 않은 5월 5일 8시 이*지 1,000,000원이 신한은행 계좌로송금 되었어요.\npayId: 43214321',
    'transaction': '내용 : 빠른 송금 케이스\npayId: 9898989'
  };

  useEffect(() => {
    // 저장된 메시지가 없으면 초기 메시지 전송
    const savedMessages = localStorage.getItem('chatMessages');
    if (!savedMessages) {
      sendInitialMessage();
    } else {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  useEffect(() => {
    // 메시지가 변경될 때마다 스크롤을 최하단으로
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendInitialMessage = async () => {
    if (!caseType) return;

    const initialMessage = caseTexts[caseType as keyof typeof caseTexts] || '';
    if (!initialMessage) return;

    // 사용자 메시지 추가
    const newMessages: Message[] = [...messages, { type: 'user' as const, content: initialMessage }];
    setMessages(newMessages);
    saveMessages(newMessages);

    setIsLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: initialMessage })
      });

      const data = await res.json();
      const updatedMessages: Message[] = [...newMessages, { type: 'ai' as const, content: data.answer }];
      setMessages(updatedMessages);
      saveMessages(updatedMessages);
    } catch (err) {
      console.error(err);
      const errorMessage = "⚠️ 에러가 발생했어요. 다시 시도해주세요.";
      const updatedMessages: Message[] = [...newMessages, { type: 'ai' as const, content: errorMessage }];
      setMessages(updatedMessages);
      saveMessages(updatedMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const saveMessages = (newMessages: Message[]) => {
    localStorage.setItem('chatMessages', JSON.stringify(newMessages));
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const newMessages: Message[] = [...messages, { type: 'user' as const, content: input }];
    setMessages(newMessages);
    saveMessages(newMessages);
    setInput('');

    setIsLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: input.trim() })
      });

      const data = await res.json();
      const updatedMessages: Message[] = [...newMessages, { type: 'ai' as const, content: data.answer }];
      setMessages(updatedMessages);
      saveMessages(updatedMessages);
    } catch (err) {
      console.error(err);
      const errorMessage = "⚠️ 에러가 발생했어요. 다시 시도해주세요.";
      const updatedMessages: Message[] = [...newMessages, { type: 'ai' as const, content: errorMessage }];
      setMessages(updatedMessages);
      saveMessages(updatedMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleLogoClick = () => {
    localStorage.removeItem('chatMessages');
    navigate('/');
  };

  return (
    <div className="bg-white h-[100dvh] flex flex-col overflow-hidden">
      {/* 채팅 헤더 */}
      <div className="bg-white py-4 border-b border-gray-200">
        <div className="max-w-xl mx-auto px-6">
          <img 
            src="https://dnvthl1py7y58.cloudfront.net/image.png" 
            alt="AI 아이콘" 
            className="w-12 mx-auto cursor-pointer"
            onClick={handleLogoClick}
          />
        </div>
      </div>

      {/* 케이스 정보 */}
      <div className="bg-white p-4 border-b border-gray-200">
        <div className="max-w-xl mx-auto px-6">
          <p className="text-gray-700">{caseTexts[caseType as keyof typeof caseTexts] || ''}</p>
        </div>
      </div>

      {/* 대화 영역 */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto bg-gray-50"
      >
        <div className="mx-4 md:mx-8">
          <div className="max-w-xl mx-auto px-6">
            <div className="space-y-4 py-6 pb-24">
              {messages.map((message, index) => (
                <div 
                  key={index}
                  className={`flex items-start ${message.type === 'user' ? 'justify-end' : ''} space-x-2`}
                >
                  {message.type === 'ai' && (
                    <div className="flex-shrink-0">
                      <img 
                        src="https://dnvthl1py7y58.cloudfront.net/image.png" 
                        alt="AI 아이콘" 
                        className="w-8 h-8 rounded-full"
                      />
                    </div>
                  )}
                  <div className={`rounded-lg p-3 max-w-[80%] ${
                    message.type === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <p>{message.content}</p>
                  </div>
                  {message.type === 'user' && (
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                        <span>U</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <img 
                      src="https://dnvthl1py7y58.cloudfront.net/image.png" 
                      alt="AI 아이콘" 
                      className="w-8 h-8 rounded-full"
                    />
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                    <p className="text-gray-800">🔍 분석 중입니다...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 입력 영역 */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-xl mx-auto px-6">
          <div className="flex items-center space-x-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={1}
              placeholder="메시지를 입력하세요..."
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading}
              className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex-shrink-0 disabled:opacity-50"
            >
              전송
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Conversation; 