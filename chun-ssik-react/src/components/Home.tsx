import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white h-screen flex items-center justify-center">
      <div className="text-center max-w-4xl px-4 w-[80%]">
        {/* 일러스트 아이콘 */}
        <img 
          src="https://dnvthl1py7y58.cloudfront.net/image.png" 
          alt="AI 아이콘" 
          className="w-20 mx-auto mb-6"
        />

        {/* 설명 문장 */}
        <div>
          <p className="text-lg leading-relaxed mb-2">
            안녕하세요. 우리팀 주번 춘씨익 :)이에요.<br/>
            DB, 사용자의 앱 활동 로그, 기존 히스토리 분석하여 원인을 파악합니다.
          </p>
        </div>

        {/* 강조 문장 */}
        <div>
          <p className="font-semibold text-xl my-6">인입된 CS를 확인해볼까요?</p>
        </div>

        {/* 시작 버튼 */}
        <div>
          <button
            onClick={() => navigate('/conversation?message=4월 1일 13시에 김응수에게 송금된 거래가 있는데, 저는 그런 송금을 한 기억이 없습니다. (payAccountId: 1001234)')}
            className="inline-block w-[70%] px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-lg"
          >
            CS 확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home; 