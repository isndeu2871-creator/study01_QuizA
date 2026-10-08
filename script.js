// 상식 퀴즈 앱. 전역에 이름을 더하지 않는다. 읽는 전역은 QUIZ_DATA 하나다.
(function () {
  'use strict';

  var CATEGORY_IDS = ['korean-history', 'world-geography', 'science', 'arts-culture'];
  var MODE_NAMES = { practice: '연습', speed: '스피드', hint: '힌트' };

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
    if (!check.ok) button.disabled = true;
    item.appendChild(button);

    if (!check.ok) {
      var reason = document.createElement('span');
      reason.className = 'category-reason';
      reason.textContent = check.reason;
      item.appendChild(reason);
    }
    return item;
  }

  // -------------------------------------------------------------- 자체 점검

  function runSelfTest() {
    var pass = 0, fail = 0;
    function check(name, ok) {
      if (ok) { pass++; console.log('PASS ' + name); }
      else { fail++; console.error('FAIL ' + name); }
    }

    check('없는 카테고리는 ok가 거짓이다',
      validateCategory('no-such-category').ok === false);
    check('없는 카테고리는 이유를 함께 돌려준다',
      validateCategory('no-such-category').reason.length > 0);
    check('문항 수가 10이 아니면 ok가 거짓이다',
      validateCategory('science').ok === false ||
      getCategory('science').questions.length === 10);

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
