// 상식 퀴즈 앱. 전역에 이름을 더하지 않는다. 읽는 전역은 QUIZ_DATA 하나다.
(function () {
  'use strict';

  var CATEGORY_IDS = ['korean-history', 'world-geography', 'science', 'arts-culture'];
  var MODES = ['practice', 'speed', 'hint'];
  var MODE_NAMES = { practice: '연습', speed: '스피드', hint: '힌트' };
  var MODE_RULES = {
    practice: '시간 제한과 힌트 없음 · 순위표에 기록되지 않음',
    speed: '문항마다 15초 · 시간이 지나면 오답',
    hint: '문항마다 힌트 1번 · 힌트를 쓰고 맞히면 0.5점'
  };
  var SCREENS = ['start', 'mode', 'quiz', 'result', 'board'];
  var SECONDS = 15;
  var BOARD_KEY = 'quizA.leaderboard.v1';
  var BOARD_LIMIT = 5;

  // ------------------------------------------------------------------ 상태

  var state = {
    mode: 'practice',
    categoryId: null,
    questions: [],
    index: 0,
    score: 0,
    firstRoundScore: null,
    wrongIds: [],
    results: [],
    retryRight: 0,
    hintUsed: false,
    removed: [],
    answered: false,
    secondsLeft: SECONDS,
    timerId: null,
    isRetry: false,
    saved: false
  };

  // ---------------------------------------------------------------- 데이터 층

  function hasData() {
    return typeof QUIZ_DATA !== 'undefined' && QUIZ_DATA !== null && typeof QUIZ_DATA === 'object';
  }

  function getCategory(categoryId) {
    if (!hasData()) return null;
    if (!Object.prototype.hasOwnProperty.call(QUIZ_DATA, categoryId)) return null;
    return QUIZ_DATA[categoryId];
  }

  // ----------------------------------------------------------------- 규칙 층

  function validateCategory(categoryId) {
    var cat = getCategory(categoryId);
    if (!cat) return { ok: false, reason: '카테고리를 찾을 수 없습니다' };
    var qs = cat.questions;
    if (!Array.isArray(qs)) return { ok: false, reason: '문항 목록이 없습니다' };
    if (qs.length !== 10) return { ok: false, reason: '문항이 ' + qs.length + '개입니다' };
    for (var i = 0; i < qs.length; i++) {
      var q = qs[i];
      var label = q && q.id ? q.id : i + 1 + '번째 문항';
      if (!q || !Array.isArray(q.choices) || q.choices.length !== 4) {
        return { ok: false, reason: label + '의 보기가 4개가 아닙니다' };
      }
      if (typeof q.answerIndex !== 'number' || q.answerIndex % 1 !== 0 ||
          q.answerIndex < 0 || q.answerIndex > 3) {
        return { ok: false, reason: label + '의 정답 위치가 잘못되었습니다' };
      }
    }
    return { ok: true, reason: '' };
  }

  // 피셔-예이츠. 원본을 바꾸지 않고 섞인 새 배열을 돌려준다.
  function shuffle(array) {
    var out = array.slice();
    for (var i = out.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = out[i]; out[i] = out[j]; out[j] = tmp;
    }
    return out;
  }

  // 판에 쓸 문항. 문항과 보기 순서를 섞고 answerIndex를 다시 계산한다. QUIZ_DATA는 고치지 않는다.
  function buildRound(categoryId, ids) {
    var cat = getCategory(categoryId);
    if (!cat || !Array.isArray(cat.questions)) return [];
    var picked = cat.questions;
    if (Array.isArray(ids)) {
      picked = [];
      for (var i = 0; i < cat.questions.length; i++) {
        if (ids.indexOf(cat.questions[i].id) !== -1) picked.push(cat.questions[i]);
      }
    }
    var ordered = shuffle(picked);
    var round = [];
    for (var k = 0; k < ordered.length; k++) {
      var q = ordered[k];
      var answerText = q.choices[q.answerIndex];
      var choices = shuffle(q.choices);
      round.push({
        id: q.id, question: q.question, choices: choices,
        answerIndex: choices.indexOf(answerText),
        explanation: q.explanation, source: q.source, sourceUrl: q.sourceUrl
      });
    }
    return round;
  }

  function scoreFor(mode, isCorrect, hintUsed) {
    if (!isCorrect) return 0;
    return hintUsed ? 0.5 : 1;
  }

  function formatScore(score) {
    return (score % 1 === 0) ? String(score) : String(score.toFixed(1));
  }

  // 오답 위치 3개 가운데 2개를 고른다. 정답은 절대 고르지 않는다.
  function pickHintRemovals(answerIndex) {
    var wrong = [];
    for (var i = 0; i < 4; i++) if (i !== answerIndex) wrong.push(i);
    return shuffle(wrong).slice(0, 2);
  }

  // 점수 내림차순. 동점이면 먼저 저장된 기록이 위에 온다.
  function sortRecords(records) {
    var withOrder = records.map(function (r, i) { return { r: r, i: i }; });
    withOrder.sort(function (a, b) {
      if (b.r.score !== a.r.score) return b.r.score - a.r.score;
      return a.i - b.i;
    });
    return withOrder.map(function (x) { return x.r; });
  }

  function normalizeName(raw) {
    var name = String(raw == null ? '' : raw).replace(/^\s+|\s+$/g, '');
    if (name.length === 0) return '익명';
    return name.slice(0, 12);
  }

  function today() {
    var d = new Date();
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }

  // ------------------------------------------------------------------ 저장소

  function isStorageAvailable() {
    try {
      localStorage.setItem('quizA.probe', '1');
      localStorage.removeItem('quizA.probe');
      return true;
    } catch (e) { return false; }
  }

  // 읽기 실패, 깨진 값, 객체가 아닌 값은 모두 {}로 취급한다.
  function loadBoard() {
    try {
      var raw = localStorage.getItem(BOARD_KEY);
      if (!raw) return {};
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
      var out = {};
      for (var key in parsed) {
        if (Array.isArray(parsed[key])) out[key] = parsed[key];
      }
      return out;
    } catch (e) { return {}; }
  }

  function saveRecord(categoryId, mode, name, score) {
    try {
      var board = loadBoard();
      var key = categoryId + '|' + mode;
      var list = Array.isArray(board[key]) ? board[key] : [];
      list.push({ name: normalizeName(name), score: score, playedAt: today() });
      board[key] = sortRecords(list).slice(0, BOARD_LIMIT);
      localStorage.setItem(BOARD_KEY, JSON.stringify(board));
      return true;
    } catch (e) { return false; }
  }

  // ----------------------------------------------------------------- 타이머

  function stopTimer() {
    if (state.timerId !== null) {
      clearInterval(state.timerId);
      state.timerId = null;
    }
  }

  function startTimer() {
    stopTimer();
    state.secondsLeft = SECONDS;
    paintTimer();
    state.timerId = setInterval(function () {
      state.secondsLeft -= 1;
      paintTimer();
      if (state.secondsLeft <= 0) {
        stopTimer();
        handleTimeout();
      }
    }, 1000);
  }

  function handleTimeout() {
    if (state.answered) return;
    var q = currentQuestion();
    if (!q) return;
    state.answered = true;
    state.wrongIds.push(q.id);
    state.results.push({ id: q.id, outcome: 'timeout', hintUsed: false });
    renderFeedback(-1, false);
  }

  // ----------------------------------------------------------------- 화면 층

  function el(id) {
    if (typeof document === 'undefined' || !document.getElementById) return null;
    return document.getElementById(id);
  }

  function showScreen(name) {
    if (name !== 'quiz') stopTimer();
    for (var i = 0; i < SCREENS.length; i++) {
      var node = el('screen-' + SCREENS[i]);
      if (!node) continue;
      if (SCREENS[i] === name) node.classList.remove('hidden');
      else node.classList.add('hidden');
    }
  }

  function makeButton(text, className, onClick) {
    var b = document.createElement('button');
    b.type = 'button';
    if (className) b.className = className;
    b.textContent = text;
    if (onClick) b.addEventListener('click', onClick);
    return b;
  }

  function makeText(tag, className, text) {
    var n = document.createElement(tag);
    if (className) n.className = className;
    n.textContent = text;
    return n;
  }

  function renderStart() {
    var root = el('screen-start');
    if (!root) return;
    root.innerHTML = '';
    root.appendChild(makeText('h1', 'title', '상식 퀴즈'));

    if (!hasData()) {
      root.appendChild(makeText('p', 'notice error', '문항 데이터를 읽을 수 없습니다'));
      return;
    }

    root.appendChild(makeText('p', 'subtitle', '카테고리를 고르세요. 한 판은 카테고리의 문항 10개입니다.'));

    for (var i = 0; i < CATEGORY_IDS.length; i++) {
      (function (categoryId) {
        var cat = getCategory(categoryId);
        var check = validateCategory(categoryId);
        var button = makeButton(cat && cat.name ? cat.name : categoryId, '', function () {
          renderMode(categoryId);
          showScreen('mode');
        });
        if (!check.ok) {
          button.disabled = true;
          root.appendChild(button);
          root.appendChild(makeText('p', 'reason', check.reason));
        } else {
          root.appendChild(button);
        }
      })(CATEGORY_IDS[i]);
    }

    root.appendChild(makeButton('순위표 보기', '', function () {
      renderLeaderboard();
      showScreen('board');
    }));
  }

  function renderMode(categoryId) {
    var root = el('screen-mode');
    if (!root) return;
    root.innerHTML = '';
    var cat = getCategory(categoryId);
    root.appendChild(makeText('h1', 'title', cat ? cat.name : categoryId));
    root.appendChild(makeText('p', 'subtitle', '모드를 고르세요.'));

    for (var i = 0; i < MODES.length; i++) {
      (function (mode) {
        root.appendChild(makeButton(MODE_NAMES[mode], '', function () {
          startGame(mode, categoryId);
        }));
        root.appendChild(makeText('p', 'mode-rule', MODE_RULES[mode]));
      })(MODES[i]);
    }

    root.appendChild(makeButton('뒤로', 'ghost', function () {
      renderStart();
      showScreen('start');
    }));
  }

  function startGame(mode, categoryId) {
    state.mode = mode;
    state.categoryId = categoryId;
    state.questions = buildRound(categoryId);
    state.index = 0;
    state.score = 0;
    state.firstRoundScore = null;
    state.wrongIds = [];
    state.results = [];
    state.retryRight = 0;
    state.hintUsed = false;
    state.removed = [];
    state.answered = false;
    state.isRetry = false;
    state.saved = false;
    renderQuiz();
    showScreen('quiz');
  }

  function startRetry() {
    state.questions = buildRound(state.categoryId, state.wrongIds);
    state.index = 0;
    state.score = 0;
    state.wrongIds = [];
    state.results = [];
    state.retryRight = 0;
    state.hintUsed = false;
    state.removed = [];
    state.answered = false;
    state.isRetry = true;
    renderQuiz();
    showScreen('quiz');
  }

  function currentQuestion() {
    return state.questions[state.index] || null;
  }

  function paintTimer() {
    var node = el('timer');
    if (!node) return;
    node.textContent = '남은 시간 ' + Math.max(state.secondsLeft, 0) + '초';
    if (state.secondsLeft <= 5) node.classList.add('urgent');
    else node.classList.remove('urgent');
  }

  function renderQuiz() {
    var root = el('screen-quiz');
    if (!root) return;
    root.innerHTML = '';
    var q = currentQuestion();
    if (!q) return;
    var cat = getCategory(state.categoryId);

    var head = document.createElement('div');
    head.className = 'quiz-head';
    head.appendChild(makeText('span', '', (cat ? cat.name : state.categoryId) + ' · ' + MODE_NAMES[state.mode]));
    head.appendChild(makeText('span', '', (state.index + 1) + ' / ' + state.questions.length));
    if (state.mode === 'speed') {
      var t = makeText('span', 'timer', '남은 시간 ' + SECONDS + '초');
      t.id = 'timer';
      head.appendChild(t);
    }
    head.appendChild(makeText('span', '', '점수 ' + formatScore(state.score)));
    root.appendChild(head);

    root.appendChild(makeText('p', 'question', q.question));

    var list = document.createElement('ul');
    list.className = 'choice-list';
    for (var i = 0; i < q.choices.length; i++) {
      (function (index) {
        var li = document.createElement('li');
        var button = makeButton(q.choices[index], 'choice', function () { selectChoice(index); });
        button.setAttribute('data-index', String(index));
        li.appendChild(button);
        list.appendChild(li);
      })(i);
    }
    root.appendChild(list);

    if (state.mode === 'hint') {
      root.appendChild(makeButton('힌트 (오답 2개 지우기)', 'hint-button', function () { useHint(); }));
    }

    var box = document.createElement('div');
    box.id = 'feedback';
    root.appendChild(box);

    if (state.mode === 'speed') startTimer();
  }

  function choiceButtons() {
    var root = el('screen-quiz');
    if (!root || !root.querySelectorAll) return [];
    return root.querySelectorAll('.choice');
  }

  function useHint() {
    if (state.answered || state.hintUsed) return;
    var q = currentQuestion();
    if (!q) return;
    state.removed = pickHintRemovals(q.answerIndex);
    state.hintUsed = true;
    var buttons = choiceButtons();
    for (var i = 0; i < state.removed.length; i++) {
      var b = buttons[state.removed[i]];
      if (b) { b.disabled = true; b.classList.add('removed'); }
    }
    var hintButton = el('screen-quiz').querySelector('.hint-button');
    if (hintButton) { hintButton.disabled = true; hintButton.textContent = '힌트 사용함'; }
  }

  function selectChoice(i) {
    if (state.answered) return;
    if (state.removed.indexOf(i) !== -1) return;
    var q = currentQuestion();
    if (!q) return;
    stopTimer();
    state.answered = true;
    var isCorrect = i === q.answerIndex;
    state.score += scoreFor(state.mode, isCorrect, state.hintUsed);
    if (isCorrect) { if (state.isRetry) state.retryRight += 1; }
    else state.wrongIds.push(q.id);
    state.results.push({ id: q.id, outcome: isCorrect ? 'correct' : 'wrong', hintUsed: state.hintUsed });
    renderFeedback(i, isCorrect);
  }

  function renderFeedback(chosen, isCorrect) {
    var q = currentQuestion();
    if (!q) return;

    var buttons = choiceButtons();
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].disabled = true;
      if (i === q.answerIndex) {
        buttons[i].classList.add('correct');
        buttons[i].appendChild(makeText('span', 'tag', '정답'));
      } else if (i === chosen) {
        buttons[i].classList.add('wrong');
        buttons[i].appendChild(makeText('span', 'tag', '오답'));
      }
    }

    var hintButton = el('screen-quiz').querySelector('.hint-button');
    if (hintButton) hintButton.disabled = true;

    var head = el('screen-quiz').querySelector('.quiz-head');
    if (head) {
      var spans = head.querySelectorAll('span');
      spans[spans.length - 1].textContent = '점수 ' + formatScore(state.score);
    }

    var box = el('feedback');
    if (!box) return;
    box.innerHTML = '';
    var card = document.createElement('div');
    card.className = 'feedback-card';

    var label = chosen === -1 ? '시간 초과' : (isCorrect ? '정답' : '오답');
    card.appendChild(makeText('p', 'verdict ' + (isCorrect ? 'correct' : 'wrong'), label));
    card.appendChild(makeText('p', 'explanation', q.explanation));

    var src = document.createElement('p');
    src.className = 'source';
    src.appendChild(document.createTextNode('출처: '));
    if (q.sourceUrl) {
      var link = document.createElement('a');
      link.href = q.sourceUrl;
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = q.source;
      src.appendChild(link);
    } else {
      src.appendChild(document.createTextNode(q.source));
    }
    card.appendChild(src);

    var last = state.index === state.questions.length - 1;
    card.appendChild(makeButton(last ? '결과 보기' : '다음', 'primary', function () { nextQuestion(); }));
    box.appendChild(card);
  }

  function nextQuestion() {
    if (state.index < state.questions.length - 1) {
      state.index += 1;
      state.answered = false;
      state.hintUsed = false;
      state.removed = [];
      renderQuiz();
      return;
    }
    if (!state.isRetry) state.firstRoundScore = state.score;
    renderResult();
    showScreen('result');
  }

  function renderResult() {
    var root = el('screen-result');
    if (!root) return;
    root.innerHTML = '';

    root.appendChild(makeText('p', 'result-score', formatScore(state.firstRoundScore) + ' / 10'));

    if (state.isRetry) {
      root.appendChild(makeText('p', 'retry-note',
        '다시 풀기: ' + state.questions.length + '문항 중 ' + state.retryRight + '개 맞힘 (점수에 반영되지 않습니다)'));
    }

    if (state.mode === 'practice') {
      root.appendChild(makeText('p', 'notice', '순위표에 기록되지 않음'));
    }

    root.appendChild(wrongList());

    if (state.mode === 'practice' && state.wrongIds.length > 0) {
      root.appendChild(makeButton('틀린 문제 다시 풀기', '', function () { startRetry(); }));
    }

    if (state.mode !== 'practice') root.appendChild(saveRow());

    root.appendChild(makeButton('같은 모드 다시', '', function () {
      startGame(state.mode, state.categoryId);
    }));
    root.appendChild(makeButton('처음으로', 'ghost', function () {
      renderStart();
      showScreen('start');
    }));
  }

  function saveRow() {
    var wrap = document.createElement('div');
    if (!isStorageAvailable()) {
      wrap.appendChild(makeText('p', 'notice error', '이 브라우저에서는 기록을 저장할 수 없습니다'));
      return wrap;
    }
    if (state.saved) {
      wrap.appendChild(makeButton('순위표 보기', '', function () {
        renderLeaderboard();
        showScreen('board');
      }));
      return wrap;
    }
    var row = document.createElement('div');
    row.className = 'name-row';
    var input = document.createElement('input');
    input.type = 'text';
    input.maxLength = 12;
    input.placeholder = '이름 (비우면 익명)';
    row.appendChild(input);
    row.appendChild(makeButton('기록 저장', 'primary', function () {
      saveRecord(state.categoryId, state.mode, input.value, state.firstRoundScore);
      state.saved = true;
      renderResult();
    }));
    wrap.appendChild(row);
    return wrap;
  }

  // 문항별 결과 목록. 맞힘·틀림·시간 초과와 힌트 사용을 함께 보여 준다.
  function resultLabel(r) {
    if (!r) return '';
    if (r.outcome === 'timeout') return '시간 초과';
    if (r.outcome === 'wrong') return '오답';
    return r.hintUsed ? '정답 (힌트 0.5점)' : '정답';
  }

  function wrongList() {
    var list = document.createElement('ul');
    list.className = 'wrong-list';
    for (var i = 0; i < state.questions.length; i++) {
      var q = state.questions[i];
      var r = null;
      for (var j = 0; j < state.results.length; j++) if (state.results[j].id === q.id) r = state.results[j];
      var li = document.createElement('li');
      var mark = resultLabel(r);
      var tag = makeText('p', 'outcome ' + (r && r.outcome === 'correct' ? 'correct' : 'wrong'), mark);
      li.appendChild(tag);
      li.appendChild(makeText('p', 'question', q.question));
      li.appendChild(makeText('p', '', '정답: ' + q.choices[q.answerIndex]));
      li.appendChild(makeText('p', 'explanation', q.explanation));
      li.appendChild(makeText('p', 'source', '출처: ' + q.source));
      list.appendChild(li);
    }
    if (state.wrongIds.length === 0) {
      var wrap = document.createElement('div');
      wrap.appendChild(makeText('p', 'notice', '틀린 문항이 없습니다'));
      wrap.appendChild(list);
      return wrap;
    }
    return list;
  }

  function renderLeaderboard() {
    var root = el('screen-board');
    if (!root) return;
    root.innerHTML = '';
    root.appendChild(makeText('h1', 'title', '순위표'));

    if (!isStorageAvailable()) {
      root.appendChild(makeText('p', 'notice error', '이 브라우저에서는 기록을 저장할 수 없습니다'));
      root.appendChild(makeButton('처음으로', 'ghost', function () {
        renderStart();
        showScreen('start');
      }));
      return;
    }

    var board = loadBoard();
    for (var c = 0; c < CATEGORY_IDS.length; c++) {
      for (var m = 1; m < MODES.length; m++) {
        var categoryId = CATEGORY_IDS[c], mode = MODES[m];
        var cat = getCategory(categoryId);
        var group = document.createElement('div');
        group.className = 'board-group';
        group.appendChild(makeText('h2', '', (cat ? cat.name : categoryId) + ' · ' + MODE_NAMES[mode]));
        var records = sortRecords(board[categoryId + '|' + mode] || []).slice(0, BOARD_LIMIT);
        if (records.length === 0) {
          group.appendChild(makeText('p', 'notice', '기록이 없습니다'));
        } else {
          group.appendChild(boardTable(records));
        }
        root.appendChild(group);
      }
    }

    root.appendChild(makeButton('처음으로', 'ghost', function () {
      renderStart();
      showScreen('start');
    }));
  }

  function boardTable(records) {
    var table = document.createElement('table');
    var head = document.createElement('tr');
    ['이름', '점수', '날짜'].forEach(function (t) {
      head.appendChild(makeText('th', '', t));
    });
    table.appendChild(head);
    for (var i = 0; i < records.length; i++) {
      var row = document.createElement('tr');
      row.appendChild(makeText('td', '', records[i].name));
      row.appendChild(makeText('td', '', formatScore(records[i].score)));
      row.appendChild(makeText('td', '', records[i].playedAt));
      table.appendChild(row);
    }
    return table;
  }

  // -------------------------------------------------------------- 자체 점검

  function runSelfTest() {
    var pass = 0, fail = 0;
    function check(name, fn) {
      var ok = false, note = '';
      try { ok = fn() === true; } catch (e) { ok = false; note = ' (' + e.message + ')'; }
      if (ok) { pass++; console.log('PASS ' + name); }
      else { fail++; console.error('FAIL ' + name + note); }
    }

    check('1. shuffle이 원본 배열을 바꾸지 않는다', function () {
      var src = [1, 2, 3, 4, 5], copy = src.slice();
      shuffle(src);
      return src.join(',') === copy.join(',');
    });
    check('2. shuffle 결과의 길이가 원본과 같다', function () {
      return shuffle([1, 2, 3, 4, 5]).length === 5;
    });
    check('3. shuffle 결과가 원본의 원소를 모두 담는다', function () {
      return shuffle(['a', 'b', 'c', 'd']).slice().sort().join(',') === 'a,b,c,d';
    });
    check('4. buildRound가 문항 10개를 돌려준다', function () {
      return buildRound('science').length === 10;
    });
    check('5. 섞은 뒤 choices[answerIndex]가 원래 정답과 같다', function () {
      var round = buildRound('science');
      if (round.length !== 10) return false;
      var origin = getCategory('science').questions;
      for (var i = 0; i < round.length; i++) {
        var src = null;
        for (var j = 0; j < origin.length; j++) if (origin[j].id === round[i].id) src = origin[j];
        if (!src) return false;
        if (round[i].choices[round[i].answerIndex] !== src.choices[src.answerIndex]) return false;
      }
      return true;
    });
    check('6. buildRound가 QUIZ_DATA를 바꾸지 않는다', function () {
      var before = JSON.stringify(QUIZ_DATA);
      buildRound('science');
      return JSON.stringify(QUIZ_DATA) === before;
    });
    check('7. 연습 모드에서 맞히면 1점이다', function () {
      return scoreFor('practice', true, false) === 1;
    });
    check('8. 연습 모드에서 틀리면 0점이다', function () {
      return scoreFor('practice', false, false) === 0;
    });
    check('9. formatScore(8)이 "8"이다', function () { return formatScore(8) === '8'; });
    check('10. formatScore(7.5)가 "7.5"다', function () { return formatScore(7.5) === '7.5'; });
    check('11. 정상 카테고리는 validateCategory가 ok를 참으로 준다', function () {
      return validateCategory('science').ok === true;
    });
    check('12. 40문항의 id가 모두 다르다', function () {
      var seen = {}, total = 0;
      for (var key in QUIZ_DATA) {
        var qs = QUIZ_DATA[key].questions;
        for (var i = 0; i < qs.length; i++) {
          if (seen[qs[i].id]) return false;
          seen[qs[i].id] = true;
          total++;
        }
      }
      return total === 40;
    });
    check('13. 힌트를 쓰고 맞히면 0.5점이다', function () {
      return scoreFor('hint', true, true) === 0.5;
    });
    check('14. 힌트를 쓰지 않고 맞히면 1점이다', function () {
      return scoreFor('hint', true, false) === 1;
    });
    check('15. pickHintRemovals는 2개를 주고 정답을 포함하지 않는다', function () {
      for (var n = 0; n < 100; n++) {
        var ans = n % 4, out = pickHintRemovals(ans);
        if (out.length !== 2) return false;
        if (out.indexOf(ans) !== -1) return false;
        if (out[0] === out[1]) return false;
      }
      return true;
    });
    check('16. sortRecords가 점수 내림차순으로 정렬한다', function () {
      var out = sortRecords([{ score: 3 }, { score: 9 }, { score: 6 }]);
      return out[0].score === 9 && out[1].score === 6 && out[2].score === 3;
    });
    check('17. 동점이면 먼저 저장된 기록이 위에 온다', function () {
      var out = sortRecords([{ score: 7, name: '가' }, { score: 7, name: '나' }]);
      return out[0].name === '가' && out[1].name === '나';
    });
    check('18. 조합마다 상위 5건만 남는다', function () {
      var list = [];
      for (var i = 0; i < 6; i++) list.push({ score: i, name: 'n' + i });
      return sortRecords(list).slice(0, BOARD_LIMIT).length === 5;
    });
    check('19. normalizeName("")이 "익명"이다', function () {
      return normalizeName('') === '익명' && normalizeName('   ') === '익명';
    });
    check('20. 이름은 앞뒤 공백을 지우고 12자로 자른다', function () {
      return normalizeName('  긴이름긴이름긴이름긴이름  ').length === 12;
    });

    console.log('자체 점검 결과: 통과 ' + pass + ', 실패 ' + fail);
  }

  // ------------------------------------------------------------------- 시작

  if (typeof document !== 'undefined' && document.addEventListener) {
    document.addEventListener('DOMContentLoaded', function () {
      renderStart();
      showScreen('start');
    });
  }

  if (typeof location !== 'undefined' && String(location.search).indexOf('test') !== -1) {
    runSelfTest();
  }
})();
