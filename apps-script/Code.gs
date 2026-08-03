function doPost(e) {
  var output = {};
  try {
    var params = JSON.parse(e.postData.contents);
    var action = params.action;
    
    if (action === 'getQuestions') {
      output = getQuestions(params);
    } else if (action === 'submitAnswers') {
      output = submitAnswers(params);
    } else {
      output = { error: 'Unknown action' };
    }
  } catch (err) {
    output = { error: err.toString() };
  }
  
  return ContentService.createTextOutput(JSON.stringify(output))
    .setMimeType(ContentService.MimeType.JSON);
}

function getQuestions(params) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("题目");
  var data = sheet.getDataRange().getValues();
  // 假设第一行是表头: 题号、题目、A、B、C、D、解答
  var questions = [];
  
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (!row[0]) continue; // 跳过空行
    
    questions.push({
      id: row[0],
      question: row[1],
      options: {
        A: row[2],
        B: row[3],
        C: row[4],
        D: row[5]
      }
      // 注意：这里故意不将“解答”(row[6])传给前端
    });
  }
  
  // Fisher-Yates 洗牌算法，确保完全随机
  for (var k = questions.length - 1; k > 0; k--) {
    var j = Math.floor(Math.random() * (k + 1));
    var temp = questions[k];
    questions[k] = questions[j];
    questions[j] = temp;
  }
  
  var count = params.count || 6;
  var selected = questions.slice(0, count);
  
  return { success: true, data: selected };
}

function submitAnswers(params) {
  var userId = params.userId;
  var userAnswers = params.answers; // 格式如: { "题号1": "A", "题号2": "C" }
  
  // 计算分数
  var qSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("题目");
  var qData = qSheet.getDataRange().getValues();
  var correctAnswers = {};
  for (var i = 1; i < qData.length; i++) {
    correctAnswers[qData[i][0]] = qData[i][6]; // 题号 -> 解答
  }
  
  var score = 0;
  var total = Object.keys(userAnswers).length;
  var details = [];
  for (var qId in userAnswers) {
    var isCorrect = String(correctAnswers[qId]) === String(userAnswers[qId]);
    if (isCorrect) {
      score++;
    }
    details.push({
      id: qId,
      userAnswer: userAnswers[qId] || '-',
      correctAnswer: correctAnswers[qId],
      isCorrect: isCorrect
    });
  }
  
  // 写入 "回答" 工作表
  // 表头: ID, 闯关次数, 总分, 最高分, 第一次通关分数, 花了几次通关, 最近游玩时间
  var ansSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("回答");
  var ansData = ansSheet.getDataRange().getValues();
  
  var rowIndex = -1;
  for (var i = 1; i < ansData.length; i++) {
    if (String(ansData[i][0]) === String(userId)) {
      rowIndex = i + 1; // 1-based index
      break;
    }
  }
  
  var now = new Date();
  var passThreshold = params.passThreshold || 3;
  var passed = score >= passThreshold;
  
  if (rowIndex !== -1) {
    // 存在记录，更新
    var currentRow = ansData[rowIndex - 1];
    var timesPlayed = (parseInt(currentRow[1]) || 0) + 1;
    var totalScore = (parseInt(currentRow[2]) || 0) + score;
    var maxScore = Math.max(parseInt(currentRow[3]) || 0, score);
    
    var firstPassScore = currentRow[4];
    var attemptsToPass = currentRow[5];
    
    if (passed && !firstPassScore) {
      firstPassScore = score;
      attemptsToPass = timesPlayed;
    }
    
    ansSheet.getRange(rowIndex, 2, 1, 6).setValues([[
      timesPlayed, totalScore, maxScore, firstPassScore, attemptsToPass, now
    ]]);
  } else {
    // 新用户
    var firstPassScore = passed ? score : "";
    var attemptsToPass = passed ? 1 : "";
    
    ansSheet.appendRow([
      userId, 1, score, score, firstPassScore, attemptsToPass, now
    ]);
  }
  
  return { success: true, score: score, passed: passed, total: total, details: details };
}
