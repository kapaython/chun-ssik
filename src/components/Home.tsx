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
            고객센터에서 아래 고객문의가 인입되었어요 🕊️
          </p>
          <p className="font-semibold text-xl my-6"> 💌 본인이 인지하지 못한 송금 문의 ・ 1건</p>
        </div>

        {/* 시작 버튼들 */}
        <div className="flex flex-col gap-4 items-center w-full text-left">
          <div className="w-full max-w-2xl bg-gray-50 rounded-xl p-6">
            <div className="flex justify-between items-center">
              <div className="flex items-start">
                <div className="ml-2">
                  <p className="font-semibold text-gray-800 mt-1">내용</p>  
                  <p className="font-semiboldtext-gray-800 mt-1">2025-02-23 09:38에 김응수에게 1건 송금한 기록이 있는데, 저는 이런 송금을 한 기억이 없습니다.</p>
                  <p className="font-semibold text-gray-600">페이어카 : 10001234</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/conversation01')}
                className="bg-[#6B7AED] text-white px-8 py-2 rounded-full hover:bg-blue-600 transition-colors text-sm flex-shrink-0 ml-4 self-center border border-[#6B7AED]"
              >
                해결하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 