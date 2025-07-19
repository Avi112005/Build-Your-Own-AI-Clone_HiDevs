let uploadedFiles = []

// Handle file upload
function handleFileUpload(event) {
  const files = Array.from(event.target.files)

  files.forEach((file) => {
    if (file.size > 10 * 1024 * 1024) {
      alert(`File "${file.name}" is too large. Maximum size is 10MB.`)
      return
    }

    if (!uploadedFiles.find((f) => f.name === file.name)) {
      uploadedFiles.push(file)
    }
  })

  displayUploadedFiles()
}

// Display uploaded files
function displayUploadedFiles() {
  const container = document.getElementById("uploadedFiles")
  container.innerHTML = ""

  uploadedFiles.forEach((file, index) => {
    const fileItem = document.createElement("div")
    fileItem.className = "file-item"
    fileItem.innerHTML = `
            <span class="file-name">📄 ${file.name}</span>
            <button class="remove-file" onclick="removeFile(${index})">Remove</button>
        `
    container.appendChild(fileItem)
  })
}

// Remove uploaded file
function removeFile(index) {
  uploadedFiles.splice(index, 1)
  displayUploadedFiles()
}

// Handle drag and drop
function initializeDragAndDrop() {
  const fileUploadArea = document.querySelector(".file-upload-area")

  fileUploadArea.addEventListener("dragover", (e) => {
    e.preventDefault()
    fileUploadArea.classList.add("dragover")
  })

  fileUploadArea.addEventListener("dragleave", () => {
    fileUploadArea.classList.remove("dragover")
  })

  fileUploadArea.addEventListener("drop", (e) => {
    e.preventDefault()
    fileUploadArea.classList.remove("dragover")

    const files = Array.from(e.dataTransfer.files)
    const fileInput = document.getElementById("fileInput")
    fileInput.files = e.dataTransfer.files
    handleFileUpload({ target: { files } })
  })
}

// Auto-resize textarea
function autoResize(textarea) {
  textarea.style.height = "auto"
  textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px"
}

// Handle Enter key press
function handleKeyPress(event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault()
    sendMessage()
  }
}

// Use example question
function useExample(question) {
  document.getElementById("userInput").value = question
  autoResize(document.getElementById("userInput"))
}

// Send message
function sendMessage() {
  const input = document.getElementById("userInput")
  const message = input.value.trim()

  if (!message && uploadedFiles.length === 0) {
    return
  }

  // Add user message to chat
  addMessage("user", message || "Uploaded files for analysis")

  // Clear input
  input.value = ""
  autoResize(input)

  // Show typing indicator
  showTypingIndicator()

  // Simulate AI response (replace with actual API call)
  setTimeout(
    () => {
      hideTypingIndicator()

      let response = generateAIResponse(message)

      if (uploadedFiles.length > 0) {
        response += `\n\n📎 I can see you've uploaded ${uploadedFiles.length} file(s): ${uploadedFiles.map((f) => f.name).join(", ")}. In a real implementation, I would analyze these documents and provide insights based on their content.`
      }

      addMessage("ai", response)

      // Clear uploaded files after processing
      uploadedFiles = []
      displayUploadedFiles()
    },
    1500 + Math.random() * 1000,
  )
}

// Add message to chat
function addMessage(sender, content) {
  const chatContainer = document.getElementById("chatContainer")
  const messageDiv = document.createElement("div")
  messageDiv.className = `message ${sender}`

  const messageContent = document.createElement("div")
  messageContent.className = "message-content"
  messageContent.textContent = content

  messageDiv.appendChild(messageContent)
  chatContainer.appendChild(messageDiv)

  // Scroll to bottom
  chatContainer.scrollTop = chatContainer.scrollHeight
}

// Show typing indicator
function showTypingIndicator() {
  document.getElementById("typingIndicator").style.display = "block"
  document.getElementById("sendButton").disabled = true

  const chatContainer = document.getElementById("chatContainer")
  chatContainer.scrollTop = chatContainer.scrollHeight
}

// Hide typing indicator
function hideTypingIndicator() {
  document.getElementById("typingIndicator").style.display = "none"
  document.getElementById("sendButton").disabled = false
}

// Generate AI response (simulate)
function generateAIResponse(message) {
  const responses = {
    "what are the benefits of renewable energy?":
      "Renewable energy offers numerous benefits including: 1) Environmental protection by reducing greenhouse gas emissions, 2) Energy independence and security, 3) Long-term cost savings, 4) Job creation in green industries, 5) Improved public health through cleaner air, and 6) Sustainable development for future generations.",

    "explain machine learning in simple terms":
      'Machine learning is like teaching a computer to learn patterns and make decisions, similar to how humans learn from experience. Instead of programming specific instructions, we show the computer lots of examples, and it figures out the patterns on its own. For example, by showing it thousands of photos labeled "cat" or "dog," it learns to recognize cats and dogs in new photos.',

    "how can i improve my productivity?":
      "Here are some effective productivity tips: 1) Use time-blocking to schedule focused work periods, 2) Eliminate distractions (phone notifications, social media), 3) Follow the 2-minute rule - do small tasks immediately, 4) Take regular breaks using techniques like Pomodoro, 5) Prioritize tasks using methods like Eisenhower Matrix, 6) Maintain a clean, organized workspace, and 7) Get adequate sleep and exercise.",

    "what are the latest trends in web development?":
      "Current web development trends include: 1) AI integration and chatbots, 2) Progressive Web Apps (PWAs), 3) Serverless architecture, 4) JAMstack development, 5) WebAssembly for performance, 6) Voice user interfaces, 7) Motion UI and micro-interactions, 8) Dark mode designs, 9) Cybersecurity focus, and 10) Sustainable web development practices.",
  }

  const lowerMessage = message.toLowerCase()

  for (const [key, response] of Object.entries(responses)) {
    if (lowerMessage.includes(key.toLowerCase())) {
      return response
    }
  }

  // Default responses for common topics
  if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
    return "Hello! I'm here to help you with any questions you have. Feel free to ask me about technology, science, productivity, or upload documents for analysis."
  }

  if (lowerMessage.includes("help")) {
    return "I can assist you with various topics including technology, science, business, education, and more. You can also upload documents (PDF, TXT, DOCX) and I'll help analyze them. What would you like to know?"
  }

  return `Thank you for your question: "${message}". In a real implementation, I would process this using advanced AI models to provide you with accurate, helpful information. I can discuss topics like technology, science, business, education, and much more. I can also analyze uploaded documents to extract insights and answer questions about their content.`
}

// Initialize application
function initializeApp() {
  // Focus on input field
  document.getElementById("userInput").focus()

  // Initialize drag and drop functionality
  initializeDragAndDrop()

  // Add event listeners for better UX
  const sendButton = document.getElementById("sendButton")
  const userInput = document.getElementById("userInput")

  // Prevent form submission on Enter in textarea
  userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  })

  // Auto-resize textarea on input
  userInput.addEventListener("input", () => {
    autoResize(userInput)
  })
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", initializeApp)
