var questionsGenerated = false; // 标志是否已生成题目
var score = 0; // 用户得分
var notificationTimeout; // 通知定时器
var isDragging = false; // 是否正在拖动通知窗口
var offsetX, offsetY; // 拖动通知窗口的偏移量
var isDraggingSettings = false; // 是否正在拖动设置窗口
var offsetXSettings, offsetYSettings; // 拖动设置窗口的偏移量
var lastGeneratedSettings = { // 保存上次生成的设置
  questionCount: 10,
  optionCount: 4,
  selectedOperators: ['+', '-', '*', '/']
};
// 初始化计分板信息
var totalQuestions = 0;
var correctAnswers = 0;
var wrongAnswers = 0;
var historyNotifications = []; // 保存历史记录的数组
var maxHistoryItems = 3; // 最大历史记录数
var isDraggingScoreBoard = false;
var offsetXScoreBoard, offsetYScoreBoard, initialXScoreBoard, initialYScoreBoard;


// 生成题目的函数
function generateQuestions(questionCount, optionCount, selectedOperators, minNumber, maxNumber, score) {
  // 将得分传递给生成题目的逻辑
  generateQuestionsLogic(questionCount, optionCount, selectedOperators, minNumber, maxNumber, score);
}
// 生成题目逻辑的辅助函数
function generateQuestionsLogic(questionCount, optionCount, selectedOperators, minNumber, maxNumber, score) {
  var generateButton = document.getElementById("generateButton");
  generateButton.style.display = "none"; // 隐藏生成题目的按钮

  clearTimeout(notificationTimeout); // 清除之前的定时器

  var feedbackContainer = document.getElementById("notification");
  feedbackContainer.style.display = "none"; // 隐藏弹窗

  var questionsContainer = document.getElementById("questions");
  questionsContainer.innerHTML = ""; // 清空之前的题目

  for (var i = 0; i < questionCount; i++) {
    var num1 = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
    var num2 = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
    var operator = selectedOperators[Math.floor(Math.random() * selectedOperators.length)];
    var answer;

  // 计算答案之前检查运算符
  switch (operator) {
    case "+":
      answer = num1 + num2;
      break;
    case "-":
      answer = num1 - num2;
      break;
    case "*":
      answer = num1 * num2;
      break;
    case "/":
      // 确保分母不为零
      if (num2 !== 0) {
        answer = num1 / num2;
      } else {
        // 如果分母为零，则重新生成 num2
        num2 = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
        answer = num1 / num2;
      }
      break;
    default:
      // 处理未知运算符，这里您可以进行适当的处理
      alert("未知的运算符：" + operator);
      return;
  }

  // ... 之前的生成题目逻辑 ...

  var options = generateOptions(answer, i, optionCount);

  var question = num1 + " " + operator + " " + num2 + " = ?";
  var questionHTML = "<p>" + question + "</p><form data-answer='" + answer + "'>" + options + "</form>";

  questionsContainer.innerHTML += questionHTML;
}

questionsGenerated = true;
// score = 0;

// 保存当前生成的设置
lastGeneratedSettings = {
questionCount: questionCount,
optionCount: optionCount,
selectedOperators: selectedOperators,
minNumber: minNumber,
maxNumber: maxNumber
};
var feedbackMessage = "<p>答题完成！得分: " + score + "</p>";
// 动态改变标题
applyTitleSettings(generateTitleFromSettings(lastGeneratedSettings));
}
    
// 生成标题的函数，根据设置返回相应标题
function generateTitleFromSettings(settings) {
  var title = settings.minNumber + " ~ " + settings.maxNumber + "的";

  // 根据运算符号简称添加额外信息
  if (settings.selectedOperators.includes('+')) {
    title += "加";
  }
  if (settings.selectedOperators.includes('-')) {
    title += "减";
  }
  if (settings.selectedOperators.includes('*')) {
    title += "乘";
  }
  if (settings.selectedOperators.includes('/')) {
    title += "除";
  }

  title += "选择题";

  return title;


}

// 在生成题目时调用这个函数，将设置的标题应用到页面上
function applyTitleSettings(title) {
  var pageTitle = document.getElementById("pageTitle");
  pageTitle.textContent = title;
  // 在生成详细答案页面或更改标题后，手动调用翻译
  translate.execute();
}

// 生成新题目的函数，使用上次生成的设置
function generateNewQuestions() {
  generateQuestions(lastGeneratedSettings.questionCount, lastGeneratedSettings.optionCount, lastGeneratedSettings.selectedOperators, lastGeneratedSettings.minNumber, lastGeneratedSettings.maxNumber, score);
  // 更新计分板信息
  updateScoreMessage();
  window.scrollTo({
            top: 0,
            behavior: 'smooth'  // 使用平滑滚动效果
        });
}


// 显示下一题答案的函数
function showNextAnswer() {
var feedbackContainer = document.getElementById("notification");
feedbackContainer.innerHTML = "<p>题目的正确答案：</p>";

var questions = document.querySelectorAll("#questions form");
for (var i = 0; questions && i < questions.length; i++) {
  var correctAnswer = questions[i].getAttribute("data-answer");
  feedbackContainer.innerHTML += "<p>第 " + (i + 1) + " 题的正确答案是 " + correctAnswer + "。</p>";
}

// 添加生成新题目按钮
feedbackContainer.innerHTML += "<button onclick='generateNewQuestions()'>生成新题目</button>";

feedbackContainer.style.display = "block";
}

// 新函数，用于调用 generateQuestions 并传递参数
function generateQuestionsButtonClick() {
  generateQuestions(10, 4, ['+', '-', '*', '/'], 1, 20, score); // 传递正确的参数，包括 minNumber 和 maxNumber
}


// 应用设置的函数
function applySettings() {
  var questionCountInput = document.getElementById("questionCount");
  var optionCountInput = document.getElementById("optionCount");
  var minNumberInput = document.getElementById("minNumber"); // 新增获取最小数字的输入框
  var maxNumberInput = document.getElementById("maxNumber"); // 新增获取最大数字的输入框
  var questionCount = parseInt(questionCountInput.value);
  var optionCount = parseInt(optionCountInput.value);
  var minNumber = parseInt(minNumberInput.value); // 获取最小数字
  var maxNumber = parseInt(maxNumberInput.value); // 获取最大数字

  if (isNaN(questionCount) || isNaN(optionCount) || questionCount < 1 || optionCount < 2) {
    alert("请正确填写设置中的数字。");
    return;
  }

  // 获取复选框的状态
  var additionSelected = document.getElementById('additionCheckbox').checked;
  var subtractionSelected = document.getElementById('subtractionCheckbox').checked;
  var multiplicationSelected = document.getElementById('multiplicationCheckbox').checked;
  var divisionSelected = document.getElementById('divisionCheckbox').checked;

  // 根据复选框状态构建运算符数组
  var selectedOperators = [];
  if (additionSelected) selectedOperators.push('+');
  if (subtractionSelected) selectedOperators.push('-');
  if (multiplicationSelected) selectedOperators.push('*');
  if (divisionSelected) selectedOperators.push('/');

  if (selectedOperators.length === 0) selectedOperators = ['+'];

  // 传递最小和最大数字参数
  generateQuestions(questionCount, optionCount, selectedOperators, minNumber, maxNumber);

  closeSettings(); // 关闭设置中心

  applyTitleSettings(generateTitleFromSettings({
    questionCount: questionCount,
    optionCount: optionCount,
    selectedOperators: selectedOperators,
    minNumber: minNumber,
    maxNumber: maxNumber
  }));
}

// 计算答案的函数
function calculateAnswer(num1, num2, operator) {
  switch (operator) {
    case "+":
      return num1 + num2;
    case "-":
      return num1 - num2;
    case "*":
      return num1 * num2;
    case "/":
      return num1 / num2;
  }
}

// 生成选项的函数
function generateOptions(answer, questionIndex, optionCount) {
  var options = [answer];
  while (options.length < optionCount) {
    var randomOption = Math.floor(Math.random() * 40) + 1;
    if (!options.includes(randomOption)) {
      options.push(randomOption);
    }
  }
  options.sort(function (a, b) {
    return 0.5 - Math.random()
  });
  var optionsHTML = "";
  for (var i = 0; i < options.length; i++) {
    optionsHTML += "<label><input type='radio' name='q" + questionIndex + "' value='" + options[i] + "'>" + options[i] + "</label>";
  }
  return optionsHTML;
}

// 检查答案的函数
function checkAnswers() {
if (!questionsGenerated) {
alert("请先生成题目。");
return;
}

var feedbackContainer = document.getElementById("notification");
feedbackContainer.innerHTML = ""; // 清空之前的反馈信息

var questions = document.querySelectorAll("#questions form");
var allAnswered = true;

for (var i = 0; i < questions.length; i++) {
var selectedOption = questions[i].querySelector("input[type='radio']:checked");
var correctAnswer = questions[i].getAttribute("data-answer");

if (!selectedOption) {
  allAnswered = false;
  displayNotification("请回答所有题目。");
  break;
} else {
  // 调用记录答案的函数
  recordAnswer(selectedOption.value, correctAnswer);
}
}

if (allAnswered) {
var feedbackMessage = "<p>答题完成！得分: " + score + "</p>";
feedbackMessage += "<button onclick='generateNewQuestions()'>生成新题目</button>";
feedbackMessage += "<button onclick='showCorrectAnswers()'>详细答案</button>";

feedbackContainer.innerHTML = feedbackMessage;
feedbackContainer.style.display = "block";
questionsGenerated = false; // 允许重新生成题目

// 更新计分板信息
updateScoreMessage();
}
}
// 显示通知的函数
function displayNotification(message) {
  var feedbackContainer = document.getElementById("notification");
  feedbackContainer.innerHTML = "<p>" + message + "</p>";
  feedbackContainer.style.display = "block";
  notificationTimeout = setTimeout(function () {
    feedbackContainer.style.display = "none";
  }, 3000); // 3秒后隐藏弹窗
}

// 显示正确答案的函数
function showCorrectAnswers() {
  var feedbackContainer = document.getElementById("notification");
  feedbackContainer.innerHTML = "<p>题目的正确答案：</p>";

  var questions = document.querySelectorAll("#questions form");
  for (var i = 0; questions && i < questions.length; i++) {
    var correctAnswer = questions[i].getAttribute("data-answer");
    feedbackContainer.innerHTML += "<p>第 " + (i + 1) + " 题的正确答案是 " + correctAnswer + "。</p>";
  }

  // 设置通知窗口的最大高度
  feedbackContainer.style.maxHeight = "80vh";
  // 添加生成新题目按钮
  feedbackContainer.innerHTML += "<button onclick='generateNewQuestions()'>生成新题目</button>";

  feedbackContainer.style.display = "block";
  // 在生成详细答案页面或更改标题后，手动调用翻译
  translate.execute();

}

// 拖动通知窗口的函数
function startDrag(event) {
isDragging = true;
offsetX = event.clientX - parseInt(document.getElementById("notification").style.left) || 0;
offsetY = event.clientY - parseInt(document.getElementById("notification").style.top) || 0;
document.addEventListener("mousemove", drag);
document.addEventListener("mouseup", stopDrag);
}

function drag(event) {
if (isDragging) {
    var newX = event.clientX - offsetX;
    var newY = event.clientY - offsetY;

    // 限制通知窗口不超出浏览器边界
    newX = Math.max(80, Math.min(window.innerWidth + 80 - document.getElementById("notification").offsetWidth, newX));
    newY = Math.max(100, Math.min(window.innerHeight + 100 - document.getElementById("notification").offsetHeight, newY));

    document.getElementById("notification").style.left = newX + "px";
    document.getElementById("notification").style.top = newY + "px";
}
}

function stopDrag() {
isDragging = false;
document.removeEventListener("mousemove", drag);
document.removeEventListener("mouseup", stopDrag);
}


// 显示通知的函数
function showNotification() {
  var notificationContainer = document.getElementById("notification");
  notificationContainer.innerHTML = "<p>代码由 GPT-3.5 生成</p><a target='_blank' href='https://github.com/xnx3/translate's style='color: #000000; text-decoration: none;'>翻译：<spen class='ignore'>translate.js</spen></a><br><a target='_blank' href='https://darkmodejs.learn.uno/?ref=appinn' style='color: #000000; text-decoration: none;'>夜间模式</a><br><a target='_blank' href='https://github.com/sorrowings/myCodes/tree/main/webCode/exercise' style='color: #000000; text-decoration: none;'>粒子特效</a><a target='_blank' href='https://space.bilibili.com/386484683' style='color: #000000; text-decoration: none;'>作者：<spen class='ignore'>sorrowings</spen></a><br><a target='_blank' href='https://space.bilibili.com/1993149101' style='color: #000000; text-decoration: none;'>作者：<spen class='ignore'>氵了鸭</spen></a><br><a target='_blank' href='https://github.com/hpQc/mathematical-problem' style='color: #000000; text-decoration: none;'>GITHUB地址</a><button onclick='closeNotification()'>关闭</button>";
  notificationContainer.style.display = "block";
}

// 关闭通知的函数
function closeNotification() {
  var notificationContainer = document.getElementById("notification");
  notificationContainer.style.display = "none";
}

// 关闭设置中心的函数
function closeSettings() {
  var settingsContainer = document.getElementById("settings");
  settingsContainer.style.display = "none";
}

// 开始拖动设置窗口的函数
function startDragSettings(event) {
isDraggingSettings = true;

// 记录鼠标点击的位置相对于设置窗口的偏移
offsetXSettings = event.clientX - document.getElementById("settings").getBoundingClientRect().left;
offsetYSettings = event.clientY - document.getElementById("settings").getBoundingClientRect().top;

document.addEventListener("mousemove", dragSettings);
document.addEventListener("mouseup", stopDragSettings);
}

// 拖动设置窗口的函数
function dragSettings(event) {
if (isDraggingSettings) {
    // 计算新的设置窗口位置
    var newXSettings = event.clientX - offsetXSettings;
    var newYSettings = event.clientY - offsetYSettings;

    // 限制设置窗口不超出浏览器边界
    newXSettings = Math.max(80, Math.min(window.innerWidth + 80 - document.getElementById("settings").offsetWidth, newXSettings));
    newYSettings = Math.max(300, Math.min(window.innerHeight + 1000 - document.getElementById("settings").offsetHeight, newYSettings));

    // 计算新的设置窗口高度并限制不超过浏览器高度
    var newHeight = window.innerHeight - newYSettings;
    newHeight = Math.max(0, Math.min(window.innerHeight, newHeight));
    // 设置新的位置和高度
    document.getElementById("settings").style.left = newXSettings + "px";
    document.getElementById("settings").style.top = window.innerHeight - newHeight + "px";
    document.getElementById("settings").style.height = newHeight + "px";
}
}

// 停止拖动设置窗口的函数
function stopDragSettings() {
isDraggingSettings = false;
document.removeEventListener("mousemove", dragSettings);
document.removeEventListener("mouseup", stopDragSettings);
}

// 在设置窗口上添加mousedown事件监听器
document.getElementById("settings").addEventListener("mousedown", startDragSettings);


// 显示设置中心的函数
function showSettings() {
  var settingsContainer = document.getElementById("settings");
  settingsContainer.innerHTML = "<p>设置中心内容</p>" +
    "<label for='questionCount'>题目数量:</label>" +
    "<input type='number' id='questionCount' min='1' max='20' value='10'>" +
    "<label for='optionCount'>选择题选项个数:</label>" +
    "<input type='number' id='optionCount' min='2' max='6' value='4'>" +
    "<label for='minNumber'>最小数字:</label>" +
    "<input type='number' id='minNumber' min='-10000' max='10000' value='1'>" +
    "<label for='maxNumber'>最大数字:</label>" +
    "<input type='number' id='maxNumber' min='-10000' max='10000' value='20'>" +
    "<label>运算符号:</label>" +
    "<label for='additionCheckbox'><input type='checkbox' id='additionCheckbox' checked>加法</label>" +
    "<label for='multiplicationCheckbox'><input type='checkbox' id='multiplicationCheckbox' checked>乘法</label>" +
    "<label for='subtractionCheckbox'><input type='checkbox' id='subtractionCheckbox' checked>减法</label>" +
    "<label for='divisionCheckbox'><input type='checkbox' id='divisionCheckbox' checked>除法</label>" +
    "<button onclick='applySettings()'>应用设置</button>" +
    "<button onclick='closeSettings()'>关闭</button>";
  settingsContainer.style.display = "block";
}

// 记录用户选择的答案
function recordAnswer(selectedValue, correctAnswer) {
  totalQuestions++;
  if (selectedValue == correctAnswer) {
    correctAnswers++;
    // 在这里累积得分
    score++; // 或根据您的得分规则进行累积
  } else {
    wrongAnswers++;
  }
}    
// 计分板点击时调用 showScoreBoard() 函数
document.querySelector("#sidebar a:nth-child(3)").addEventListener("click", function () {
  showScoreBoard();
});
// 显示计分板的函数
function showScoreBoard() {
  var scoreBoard = document.getElementById("scoreBoard");
  scoreBoard.style.display = "block";
  updateScoreMessage();
}
// 关闭计分板的函数
function closeScoreBoard() {
  var scoreBoard = document.getElementById("scoreBoard");
  scoreBoard.style.display = "none";
}

// 更新计分板信息的函数
function updateScoreMessage() {
  var scoreMessage = document.getElementById("scoreMessage");
  scoreMessage.innerHTML = "总题数：" + totalQuestions +
                            "<br>得分: " + score +
                            "<br>正确次数：" + correctAnswers +
                            "<br>错误次数：" + wrongAnswers;

  // 当总题数达到100时，保存历史记录
  if (totalQuestions % 100 === 0 && totalQuestions > 0) {
    saveHistory();
    showHistoryNotification();
    resetStatistics();
  }

}
// 开始拖动计分板窗口的函数
function startDragScoreBoard(event) {
    isDraggingScoreBoard = true;

    // 记录鼠标在窗口内的初始位置和窗口的初始位置
    initialXScoreBoard = document.getElementById("scoreBoard").getBoundingClientRect().left;
    initialYScoreBoard = document.getElementById("scoreBoard").getBoundingClientRect().top;
    offsetXScoreBoard = event.clientX - initialXScoreBoard;
    offsetYScoreBoard = event.clientY - initialYScoreBoard;

    document.addEventListener("mousemove", dragScoreBoard);
    document.addEventListener("mouseup", stopDragScoreBoard);
}

// 拖动计分板窗口的函数
function dragScoreBoard(event) {
    if (isDraggingScoreBoard) {
        var newXScoreBoard = event.clientX - offsetXScoreBoard;
        var newYScoreBoard = event.clientY - offsetYScoreBoard;

        // 限制计分板窗口不超出浏览器边界
        newXScoreBoard = Math.max(0, Math.min(window.innerWidth - document.getElementById("scoreBoard").offsetWidth, newXScoreBoard));
        newYScoreBoard = Math.max(0, Math.min(window.innerHeight - document.getElementById("scoreBoard").offsetHeight, newYScoreBoard));

        // 设置新的位置
        document.getElementById("scoreBoard").style.left = newXScoreBoard + "px";
        document.getElementById("scoreBoard").style.top = newYScoreBoard + "px";
    }
}

// 停止拖动计分板窗口的函数
function stopDragScoreBoard() {
    isDraggingScoreBoard = false;
    document.removeEventListener("mousemove", dragScoreBoard);
    document.removeEventListener("mouseup", stopDragScoreBoard);
}
    // 保存历史记录的函数
function saveHistory() {
  var historyItem = {
    totalQuestions: totalQuestions,
    score: score,
    correctAnswers: correctAnswers,
    wrongAnswers: wrongAnswers
  };
  historyNotifications.push(historyItem);
}

 // 显示历史记录通知的函数
 function showHistoryNotification() {
  var historyNotificationsContainer = document.getElementById("historyNotifications");
  var historyItem = historyNotifications[historyNotifications.length - 1];
  // 如果总题数和正确次数都为0，则不显示通知
  if (historyItem.totalQuestions === 0 && historyItem.correctAnswers === 0) {
    return;
  }
  // 如果历史记录数量超过最大值，移除最旧的一条记录
  if (historyNotifications.length > maxHistoryItems) {
    historyNotificationsContainer.removeChild(historyNotificationsContainer.firstChild);
  }

  var historyNotification = document.createElement("div");
  historyNotification.className = "historyNotification";
  historyNotification.innerHTML = "<p>历史记录<br>总题数：" + historyItem.totalQuestions +
                                   "<br>得分: " + historyItem.score +
                                   "<br>正确次数：" + historyItem.correctAnswers +
                                   "<br>错误次数：" + historyItem.wrongAnswers +
                                   "</p>";
  // 判断总题数和正确次数是否相等
  if (historyItem.totalQuestions === historyItem.correctAnswers) {
    openBlackPageNotification(); // 打开全黑页面通知
  }
  historyNotificationsContainer.appendChild(historyNotification);

  // 滚动到底部以显示最新的历史记录
  historyNotificationsContainer.scrollTop = historyNotificationsContainer.scrollHeight;
}

// 重置统计信息的函数
function resetStatistics() {
  totalQuestions = 0;
  score = 0;
  correctAnswers = 0;
  wrongAnswers = 0;
}
// 打开全黑页面通知的函数
function openBlackPageNotification() {
var blackPageNotification = document.getElementById("blackPageNotification");
var hiddenPageNotification = document.getElementById("hiddenPageNotification");

// 如果总题数和正确次数都为0，则不显示全黑页面通知
if (score === 0 && correctAnswers === 0) {
    return;
}else{
  // 显示隐藏页面伪元素通知
  hiddenPageNotification.style.display = "flex";
}



// 点击隐藏页面伪元素通知后，显示全黑页面通知
hiddenPageNotification.addEventListener("click", function () {    
    hiddenPageNotification.style.display = "none";
    blackPageNotification.style.display = "flex";
});

// 设置通知的持续时间（以毫秒为单位）
var notificationDuration = 45000; // 45秒

// 在一定时间后关闭通知
setTimeout(function () {
    hiddenPageNotification.style.display = "none";
    blackPageNotification.style.display = "none";
}, notificationDuration);
}