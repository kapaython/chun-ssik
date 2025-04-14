import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const API_URL = "https://uxfgyv3e99.execute-api.us-west-2.amazonaws.com/jack-test-1/jack-test";

// 유니코드 이스케이프 시퀀스를 디코딩하는 함수
const decodeUnicode = (str: string): string => {
  return str.replace(/\\u([\d\w]{4})/gi, (match, grp) => {
    return String.fromCharCode(parseInt(grp, 16));
  });
};

interface Message {
  type: 'user' | 'ai';
  content: string;
}

const Conversation01: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const caseType = searchParams.get('case');
  const initialMessage = '💌 본인이 인지하지 못한 송금 확인 요청\n\n내용 : 2025-02-23 09:38에 김응수에게 1건 송금한 기록이 있는데, 저는 이런 송금을 한 기억이 없습니다.\n페이어카: 1001234';
  const caseTexts = {
    'transfer': '내용 : 4월 1일 13시에 김응수에게 3건 송금한 기록이 있는데, 저는 이런 송금을 한 기억이 없습니다.\npayId: 1001234',
    'balance': '내용 : 제가 진행하지 않은 5월 5일 8시 이*지 1,000,000원이 신한은행 계좌로송금 되었어요.\npayId: 43214321',
    'transaction': '내용 : 빠른 송금 케이스\npayId: 9898989'
  };

  useEffect(() => {
    // 저장된 메시지가 없으면 초기 메시지 전송
    const savedMessages = localStorage.getItem('chatMessages');
    if (!savedMessages && initialMessage) {
      sendInitialMessage();
    } else if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, [initialMessage]);

  useEffect(() => {
    // 메시지가 변경될 때마다 스크롤을 최하단으로
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendInitialMessage = async () => {
    if (!initialMessage) return;

    // 사용자 메시지 추가
    const newMessages: Message[] = [...messages, { type: 'user' as const, content: initialMessage }];
    setMessages(newMessages);
    saveMessages(newMessages);

    setIsLoading(true);
    try {
      console.log('초기 메시지 API 요청 시작:', { input: initialMessage });
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: initialMessage })
      });

      console.log('초기 메시지 API 응답 상태:', res.status);
      const data = await res.json();
      console.log('초기 메시지 API 응답 데이터:', data);

      if (!res.ok) {
        throw new Error(`API 응답 오류: ${res.status}`);
      }

      const decodedMessage = decodeUnicode(data.answer);
      const updatedMessages: Message[] = [...newMessages, { type: 'ai' as const, content: decodedMessage }];
      setMessages(updatedMessages);
        saveMessages(updatedMessages);
    } catch (err) {
      console.error('초기 메시지 API 호출 중 에러 발생:', err);
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
      console.log('API 요청 시작:', { input: input.trim() });
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: input.trim() })
      });

      console.log('API 응답 상태:', res.status);
      const data = await res.json();
      console.log('API 응답 데이터:', data);

      if (!res.ok) {
        throw new Error(`API 응답 오류: ${res.status}`);
      }

      const decodedMessage = decodeUnicode(data.answer);
      const updatedMessages: Message[] = [...newMessages, { type: 'ai' as const, content: decodedMessage }];
      setMessages(updatedMessages);
      saveMessages(updatedMessages);
    } catch (err) {
      console.error('API 호출 중 에러 발생:', err);
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

  const handleConfirmClick = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("https://uxfgyv3e99.execute-api.us-west-2.amazonaws.com/jack-test-1/jack-test/cs-report", {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });

      console.log('CS 리포트 API 응답 상태:', res.status);
      console.log('CS 리포트 API 응답 헤더:', res.headers);
      
      const text = await res.text();
      console.log('CS 리포트 API 응답 텍스트:', text);
      
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('JSON 파싱 에러:', e);
        throw new Error('응답 데이터가 JSON 형식이 아닙니다.');
      }
      
      console.log('CS 리포트 API 응답 데이터:', data);

      if (!res.ok) {
        throw new Error(`API 응답 오류: ${res.status}`);
      }

      const decodedMessage = decodeUnicode(data.message);
      const updatedMessages: Message[] = [...messages, { type: 'ai' as const, content: decodedMessage }];
      setMessages(updatedMessages);
      saveMessages(updatedMessages);
    } catch (err: unknown) {
      console.error('CS 리포트 API 호출 중 에러 발생:', err);
      const errorMessage = `⚠️ 에러가 발생했어요: ${err instanceof Error ? err.message : '알 수 없는 에러가 발생했습니다.'}`;
      const updatedMessages: Message[] = [...messages, { type: 'ai' as const, content: errorMessage }];
      setMessages(updatedMessages);
      saveMessages(updatedMessages);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white h-[100dvh] flex flex-col overflow-hidden">
      {/* 채팅 인터페이스 */}
      <div className="h-full flex flex-col">
        {/* 채팅 헤더 */}
        <div className="bg-white py-4 border-b border-gray-200">
          <div className="max-w-xl mx-auto px-6 flex justify-center">
            <img 
              src="https://dnvthl1py7y58.cloudfront.net/image.png" 
              alt="AI 아이콘" 
              className="w-12 cursor-pointer"
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
                          className="w-8 h-8 object-contain rounded-full"
                        />
                      </div>
                    )}
                    <div>
                      <div className={`rounded-lg p-3 max-w-[80%] ${
                        message.type === 'user' 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        <div className="whitespace-pre-line [&_p]:my-0 [&_ul]:my-0 [&_li]:my-0 [&_a]:text-blue-600 [&_a]:underline [&_code]:bg-gray-50 [&_code]:px-1 [&_code]:rounded [&_code]:text-blue-600 [&_pre]:bg-gray-50 [&_pre]:p-2 [&_pre]:rounded [&_pre]:overflow-auto [&_pre]:max-h-[400px] [&_pre]:max-w-[600px] [&_pre_code]:whitespace-pre [&_pre_code]:text-blue-600 [&_table]:border-collapse [&_table]:max-h-[400px] [&_table]:max-w-[600px] [&_td]:border [&_td]:p-2 [&_th]:border [&_th]:p-2 [&_th]:bg-gray-50 [&_tr]:hover:bg-gray-50 [&_td]:min-w-[100px] [&_th]:min-w-[100px] [&_td]:whitespace-normal [&_th]:whitespace-normal [&_td]:break-words [&_th]:break-words [&_td]:text-gray-900 [&_th]:text-gray-900">
                          <ReactMarkdown 
                            remarkPlugins={[remarkGfm]}
                            components={{
                              a: ({...props}) => <a target="_blank" rel="noopener noreferrer" {...props} />,
                              pre: ({...props}) => <pre className="border" {...props} />,
                              table: ({...props}) => (
                                <div className="overflow-auto max-h-[400px] max-w-[600px] rounded border">
                                  <table className="w-full bg-white" {...props} />
                                </div>
                              )
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      </div>
                      {message.type === 'ai' && 
                       index === messages.length - 1 && (
                        <div className="mt-2 ml-1 flex items-center space-x-2">
                          <p className="text-sm text-gray-600">CS가 해결되었나요?</p>
                          <button 
                            className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm hover:bg-blue-600 transition-colors border border-blue-600"
                            onClick={handleConfirmClick}
                          >
                            네
                          </button>
                        </div>
                      )}
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
                        className="w-8 h-8 object-contain rounded-full"
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

        {/* 프롬프트 입력창 */}
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
                className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex-shrink-0 disabled:opacity-50 border border-blue-600"
              >
                전송
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Conversation01; 