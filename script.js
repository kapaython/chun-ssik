console.log("Script loaded successfully!");

const API_URL = "https://uxfgyv3e99.execute-api.us-west-2.amazonaws.com/jack-test-1/jack-test";
const startBtn = document.getElementById("start-btn");
const chatContainer = document.getElementById("chat-container");
const description = document.getElementById("description");
const emphasis = document.getElementById("emphasis");
const buttonContainer = document.getElementById("button-container");

// 사용자 메시지 추가
function addUserMessage(message) {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'flex items-start justify-end space-x-2';
  messageDiv.innerHTML = `
    <div class="bg-blue-500 text-white rounded-lg p-3 max-w-[80%]">
      <p>${message}</p>
    </div>
    <div class="flex-shrink-0">
      <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
        <span>U</span>
      </div>
    </div>
  `;
  chatContainer.appendChild(messageDiv);
}

// AI 메시지 추가
function addAIMessage(message) {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'flex items-start space-x-2';
  messageDiv.innerHTML = `
    <div class="flex-shrink-0">
      <img src="https://dnvthl1py7y58.cloudfront.net/image.png" alt="AI 아이콘" class="w-8 h-8 rounded-full">
    </div>
    <div class="bg-gray-100 rounded-lg p-3 max-w-[80%]">
      <p class="text-gray-800">${message}</p>
    </div>
  `;
  chatContainer.appendChild(messageDiv);
}

// 로딩 메시지 추가
function addLoadingMessage() {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'flex items-start space-x-2';
  messageDiv.innerHTML = `
    <div class="flex-shrink-0">
      <img src="https://dnvthl1py7y58.cloudfront.net/image.png" alt="AI 아이콘" class="w-8 h-8 rounded-full">
    </div>
    <div class="bg-gray-100 rounded-lg p-3 max-w-[80%]">
      <p class="text-gray-800">🔍 분석 중입니다...</p>
    </div>
  `;
  chatContainer.appendChild(messageDiv);
  return messageDiv;
}

startBtn.addEventListener("click", async () => {
  // 기존 요소 숨기기
  description.classList.add("hidden");
  emphasis.classList.add("hidden");
  buttonContainer.classList.add("hidden");

  // 대화 영역 표시
  chatContainer.classList.remove("hidden");

  // 사용자 메시지 추가
  addUserMessage("CS 확인 요청");

  // 로딩 메시지 추가
  const loadingMessage = addLoadingMessage();
  chatContainer.scrollTop = chatContainer.scrollHeight;

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input: "CS 확인 요청" })
    });

    const data = await res.json();
    
    // 로딩 메시지 제거
    loadingMessage.remove();
    
    // AI 응답 추가
    addAIMessage(data.answer);
  } catch (err) {
    // 로딩 메시지 제거
    loadingMessage.remove();
    
    // 에러 메시지 추가
    addAIMessage("⚠️ 에러가 발생했어요. 다시 시도해주세요.");
    console.error(err);
  }

  chatContainer.scrollTop = chatContainer.scrollHeight;
});