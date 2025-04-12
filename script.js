console.log("Script loaded successfully!");

const API_URL = "https://uxfgyv3e99.execute-api.us-west-2.amazonaws.com/jack-test-1/jack-test";
const startBtn = document.getElementById("start-btn");
const chatContainer = document.getElementById("chat-container");
const initialScreen = document.getElementById("initial-screen");
const description = document.getElementById("description");
const emphasis = document.getElementById("emphasis");
const buttonContainer = document.getElementById("button-container");
const promptContainer = document.getElementById("prompt-container");
const promptInput = document.getElementById("prompt-input");
const sendBtn = document.getElementById("send-btn");

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
  return messageDiv;
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

// 텍스트 영역 자동 높이 조절
promptInput.addEventListener("input", function() {
  this.style.height = "auto";
  this.style.height = (this.scrollHeight) + "px";
});

// Enter 키로 전송 (Shift + Enter는 줄바꿈)
promptInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// 전송 버튼 클릭 시 메시지 전송
sendBtn.addEventListener("click", (e) => {
  e.preventDefault();
  sendMessage();
});

async function sendMessage() {
  const message = promptInput.value.trim();
  if (!message) return;

  // 입력창 초기화 (먼저 초기화하여 중복 전송 방지)
  promptInput.value = "";
  promptInput.style.height = "auto";

  // 사용자 메시지 추가
  addUserMessage(message);

  // 로딩 메시지 추가
  const loadingMessage = addLoadingMessage();
  
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input: message })
    });

    const data = await res.json();
    
    // 로딩 메시지 제거
    loadingMessage.remove();
    
    // AI 응답 추가
    addAIMessage(data.answer);
  } catch (err) {
    loadingMessage.remove();
    addAIMessage("⚠️ 에러가 발생했어요. 다시 시도해주세요.");
    console.error(err);
  }
  
  // 스크롤을 최하단으로
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

startBtn.addEventListener("click", async () => {
  // 초기 화면 숨기기
  initialScreen.classList.add("hidden");

  // 대화 영역과 프롬프트 입력창 표시
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