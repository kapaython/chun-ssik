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

        {/* 시작 버튼들 */}
        <div className="flex flex-col gap-4 items-center">
          <button
            onClick={() => navigate('/conversation01')}
            className="w-[70%] px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-lg border border-blue-600"
          >
            💌 미인지 송금 확인 요청 케이스 1
          </button>
          <button
            onClick={() => navigate('/conversation02')}
            className="w-[70%] px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-lg border border-blue-600"
          >
            💌 미인지 송금 확인 요청 케이스 2
          </button>
          <button
            onClick={() => navigate('/conversation03')}
            className="w-[70%] px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-lg border border-blue-600"
          >
            💌 미인지 송금 확인 요청 케이스 3
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home; 