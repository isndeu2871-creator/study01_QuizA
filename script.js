// 상식 퀴즈 앱. 전역에 이름을 더하지 않는다. 읽는 전역은 QUIZ_DATA 하나다.
(function () {
  'use strict';

  var CATEGORY_IDS = ['korean-history', 'world-geography', 'science', 'arts-culture'];
  var MODE_NAMES = { practice: '연습', speed: '스피드', hint: '힌트' };

  // ------------------------------------------------------------------ 상태

  var state = {
    mode: 'practice',
    categoryId: null,
    questions: [],
    index: 0,
    score: 0,
    firstRoundScore: null,
    wrongIds: [],
    hintUsed: false,
    removed: [],
    answered: false,
    secondsLeft: 15,
    timerId: null,
    isRetry: false
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

  // 카테고리 하나가 쓸 만한지 본다. { ok, reason }을 돌려준다.
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
      var tmp = out[i];
      out[i] = out[j];
      out[j] = tmp;
    }
    return out;
  }

  // 판에 쓸 문항을 만든다. 문항 순서와 보기 순서를 섞고 answerIndex를 다시 계산한다.
  // ids를 주면 그 id의 문항만 모은다. QUIZ_DATA는 고치지 않는다.
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
        id: q.id,
        question: q.question,
        choices: choices,
        answerIndex: choices.indexOf(answerText),
        explanation: q.explanation,
        source: q.source,
        sourceUrl: q.sourceUrl
      });
    }
    return round;
  }

  // ----------------------------------------------------------------- 화면 층

  function el(id) {
    if (typeof document === 'undefined' || !document.getElementById) return null;
    return document.getElementById(id);
  }

  function showScreen(name) {
    for (var i = 0; i < SCREENS.length; i++) {
      var node = el('screen-' + SCREENS[i]);
      if (!node) continue;
      if (SCREENS[i] === name) node.classList.remove('hidden');
      else node.classList.add('hidden');
    }
  }
  var SCREENS = ['start', 'quiz', 'result', 'board'];

  function renderStart() {
    var root = el('screen-start');
    if (!root) return;
    root.innerHTML = '';

    if (!hasData()) {
      var err = document.createElement('p');
      err.className = 'notice error';
      err.textContent = '문항 데이터를 읽을 수 없습니다';
      root.appendChild(err);
      return;
    }

    var notice = document.createElement('p');
    notice.className = 'notice';
    notice.textContent = MODE_NAMES.practice + ' 모드 · 순위표에 기록되지 않음';
    root.appendChild(notice);

    var list = document.createElement('ul');
    list.className = 'category-list';
    for (var i = 0; i < CATEGORY_IDS.length; i++) {
      list.appendChild(categoryItem(CATEGORY_IDS[i]));
    }
    root.appendChild(list);
  }

  function categoryItem(categoryId) {
    var cat = getCategory(categoryId);
    var check = validateCategory(categoryId);
    var item = document.createElement('li');
    item.className = 'category-item';

    var button = document.createElement('button');
    button.type = 'button';
    button.textContent = cat && cat.name ? cat.name : categoryId;
    button.setAttribute('data-category', categoryId);
    if (!check.ok) {
      button.disabled = true;
    } else {
      button.addEventListener('click', function () {
        startGame('practice', categoryId);
      });
    }
    item.appendChild(button);

    if (!check.ok) {
      var reason = document.createElement('span');
      reason.className = 'category-reason';
      reason.textContent = check.reason;
      item.appendChild(reason);
    }
    return item;
  }

  function startGame(mode, categoryId) {
    state.mode = mode;
    state.categoryId = categoryId;
    state.questions = buildRound(categoryId);
    state.index = 0;
    state.score = 0;
    state.firstRoundScore = null;
    state.wrongIds = [];
    state.hintUsed = false;
    state.removed = [];
    state.answered = false;
    state.isRetry = false;
    renderQuiz();
    showScreen('quiz');
  }

  function currentQuestion() {
    return state.questions[state.index] || null;
  }

  function renderQuiz() {
    var root = el('screen-quiz');
    if (!root) return;
    root.innerHTML = '';
    var q = currentQuestion();
    if (!q) return;

    var cat = getCategory(state.categoryId);
    var head = document.createElement('p');
    head.className = 'quiz-head';
    head.textContent = (cat ? cat.name : state.categoryId) + ' · ' + MODE_NAMES[state.mode] +
      '   ' + (state.index + 1) + ' / ' + state.questions.length +
      '   점수 ' + state.score;
    root.appendChild(head);

    var text = document.createElement('p');
    text.className = 'question';
    text.textContent = q.question;
    root.appendChild(text);

    var list = document.createElement('ul');
    list.className = 'choice-list';
    for (var i = 0; i < q.choices.length; i++) {
      var li = document.createElement('li');
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'choice';
      button.textContent = q.choices[i];
      button.setAttribute('data-index', String(i));
      li.appendChild(button);
      list.appendChild(li);
    }
    root.appendChild(list);

    var box = document.createElement('div');
    box.id = 'feedback';
    root.appendChild(box);
  }

  // -------------------------------------------------------------- 자체 점검

  function runSelfTest() {
    var pass = 0, fail = 0;
    function check(name, fn) {
      var ok = false, note = '';
      try { ok = fn() === true; }
      catch (e) { ok = false; note = ' (' + e.message + ')'; }
      if (ok) { pass++; console.log('PASS ' + name); }
      else { fail++; console.error('FAIL ' + name + note); }
    }

    check('없는 카테고리는 ok가 거짓이다', function () {
      return validateCategory('no-such-category').ok === false;
    });
    check('없는 카테고리는 이유를 함께 돌려준다', function () {
      return validateCategory('no-such-category').reason.length > 0;
    });
    check('문항 수가 10이 아니면 ok가 거짓이다', function () {
      return validateCategory('science').ok === false ||
        getCategory('science').questions.length === 10;
    });

    check('shuffle이 원본 배열을 바꾸지 않는다', function () {
      var src = [1, 2, 3, 4, 5], copy = src.slice();
      shuffle(src);
      return src.join(',') === copy.join(',');
    });
    check('shuffle 결과의 길이가 원본과 같다', function () {
      return shuffle([1, 2, 3, 4, 5]).length === 5;
    });
    check('shuffle 결과가 원본의 원소를 모두 담는다', function () {
      var out = shuffle(['a', 'b', 'c', 'd']).slice().sort().join(',');
      return out === 'a,b,c,d';
    });
    check('buildRound가 문항 10개를 돌려준다', function () {
      return buildRound('science').length === 10;
    });
    check('섞은 뒤 choices[answerIndex]가 원래 정답과 같다', function () {
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
    check('buildRound가 QUIZ_DATA를 바꾸지 않는다', function () {
      var before = JSON.stringify(QUIZ_DATA);
      buildRound('science');
      return JSON.stringify(QUIZ_DATA) === before;
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
