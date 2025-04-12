console.log("Conversation script loaded successfully!");

const API_URL = "https://uxfgyv3e99.execute-api.us-west-2.amazonaws.com/jack-test-1/jack-test";
const chatContainer = document.getElementById("chat-container");
const promptInput = document.getElementById("prompt-input");
const sendBtn = document.getElementById("send-btn");

// 로컬 스토리지 키
const STORAGE_KEYS = {
  MESSAGES: 'chatMessages'
};

// 페이지 로드 시 상태 복원
function restoreState() {
  const messages = JSON.parse(localStorage.getItem(STORAGE_KEYS.MESSAGES) || '[]');
  
  // 저장된 메시지 복원
  messages.forEach(msg => {
    if (msg.type === 'user') {
      addUserMessage(msg.content);
    } else {
      addAIMessage(msg.content);
    }
  });
}

// 메시지 저장
function saveMessage(type, content) {
  const messages = JSON.parse(localStorage.getItem(STORAGE_KEYS.MESSAGES) || '[]');
  messages.push({ type, content });
  localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
}

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
  const container = chatContainer.querySelector('.space-y-4');
  container.appendChild(messageDiv);
}

// AI 메시지 추가
function addAIMessage(message) {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'flex items-start space-x-3';
  messageDiv.innerHTML = `
    <div class="flex-shrink-0">
      <img src="https://dnvthl1py7y58.cloudfront.net/image.png" alt="AI 아이콘" class="w-8 h-8 rounded-full">
    </div>
    <div class="bg-gray-100 rounded-lg p-3 max-w-[80%]">
      <p class="text-gray-800">${message}</p>
    </div>
  `;
  const container = chatContainer.querySelector('.space-y-4');
  container.appendChild(messageDiv);
  return messageDiv;
}

// 로딩 메시지 추가
function addLoadingMessage() {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'flex items-start space-x-3';
  messageDiv.innerHTML = `
    <div class="flex-shrink-0">
      <img src="https://dnvthl1py7y58.cloudfront.net/image.png" alt="AI 아이콘" class="w-8 h-8 rounded-full">
    </div>
    <div class="bg-gray-100 rounded-lg p-3 max-w-[80%]">
      <p class="text-gray-800">🔍 분석 중입니다...</p>
    </div>
  `;
  const container = chatContainer.querySelector('.space-y-4');
  container.appendChild(messageDiv);
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

  // 입력창 초기화
  promptInput.value = "";
  promptInput.style.height = "auto";

  // 사용자 메시지 추가
  addUserMessage(message);
  saveMessage('user', message);

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
    saveMessage('ai', data.answer);
  } catch (err) {
    loadingMessage.remove();
    const errorMessage = "⚠️ 에러가 발생했어요. 다시 시도해주세요.";
    addAIMessage(errorMessage);
    saveMessage('ai', errorMessage);
    console.error(err);
  }
  
  // 스크롤을 최하단으로
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// 페이지 로드 시 초기 메시지 전송
async function sendInitialMessage() {
  const initialMessage = "CS 확인 요청";
  
  // 사용자 메시지 추가
  addUserMessage(initialMessage);
  saveMessage('user', initialMessage);

  // 로딩 메시지 추가
  const loadingMessage = addLoadingMessage();
  chatContainer.scrollTop = chatContainer.scrollHeight;

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input: initialMessage })
    });

    const data = await res.json();
    
    // 로딩 메시지 제거
    loadingMessage.remove();
    
    // AI 응답 추가
    addAIMessage(data.answer);
    saveMessage('ai', data.answer);
  } catch (err) {
    loadingMessage.remove();
    const errorMessage = "⚠️ 에러가 발생했어요. 다시 시도해주세요.";
    addAIMessage(errorMessage);
    saveMessage('ai', errorMessage);
    console.error(err);
  }

  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// 페이지 로드 시
document.addEventListener('DOMContentLoaded', () => {
  const messages = JSON.parse(localStorage.getItem(STORAGE_KEYS.MESSAGES) || '[]');
  if (messages.length === 0) {
    // 저장된 메시지가 없으면 초기 메시지 전송
    sendInitialMessage();
  } else {
    // 저장된 메시지가 있으면 복원
    restoreState();
  }
}); 