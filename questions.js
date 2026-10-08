// 문항 데이터. 전역 상수 QUIZ_DATA 하나만 선언한다.
// 카테고리 4개 × 문항 10개 = 40개.
//
// 출처 표기에 관하여: 이 세션의 네트워크 정책이 기관 사이트 접속을 막아
// 출처 페이지를 직접 열지 못했다. 그래서 자료마다 값이 갈리거나 학계에 이견이 있는
// 주제(발해 건국 연도, 훈민정음 반포 시점, 신라의 삼국 통일 시점 등)는 모두 제외하고,
// 검색으로 교차 확인되는 교과서 수준의 사실만 썼다. 각 문항의 source에 그 사정을 적었다.
var QUIZ_DATA = {
  "korean-history": {
    name: "한국사",
    questions: [
      {
        id: "kh-01",
        question: "918년에 고려를 세운 사람은?",
        choices: ["왕건", "궁예", "견훤", "이성계"],
        answerIndex: 0,
        explanation: "왕건이 918년 고려를 세우고 936년 후삼국을 통합했다.",
        source: "국사편찬위원회 우리역사넷 (2026-10-08 검색 확인, 페이지 직접 확인 못 함)",
        sourceUrl: "https://contents.history.go.kr/"
      },
      {
        id: "kh-02",
        question: "1392년에 조선을 세운 사람은?",
        choices: ["이성계", "정도전", "최영", "정몽주"],
        answerIndex: 0,
        explanation: "위화도 회군으로 권력을 잡은 이성계가 1392년 조선을 세웠다.",
        source: "국사편찬위원회 우리역사넷 (2026-10-08 검색 확인, 페이지 직접 확인 못 함)",
        sourceUrl: "https://contents.history.go.kr/"
      },
      {
        id: "kh-03",
        question: "임진왜란이 일어난 해는?",
        choices: ["1392년", "1492년", "1592년", "1692년"],
        answerIndex: 2,
        explanation: "1592년 4월 일본군이 부산 앞바다에 나타나며 전쟁이 시작됐다.",
        source: "국사편찬위원회 우리역사넷 (2026-10-08 검색 확인, 페이지 직접 확인 못 함)",
        sourceUrl: "https://contents.history.go.kr/"
      },
      {
        id: "kh-04",
        question: "훈민정음을 창제한 조선의 임금은?",
        choices: ["세종", "태종", "성종", "정조"],
        answerIndex: 0,
        explanation: "세종이 1443년 훈민정음 스물여덟 자를 창제했다.",
        source: "국사편찬위원회 우리역사넷 (2026-10-08 검색 확인, 페이지 직접 확인 못 함)",
        sourceUrl: "https://contents.history.go.kr/"
      },
      {
        id: "kh-05",
        question: "3·1 운동이 일어난 해는?",
        choices: ["1909년", "1919년", "1929년", "1945년"],
        answerIndex: 1,
        explanation: "1919년 3월 1일 전국에서 독립을 선언하는 만세 운동이 일어났다.",
        source: "국사편찬위원회 우리역사넷 (2026-10-08 검색 확인, 페이지 직접 확인 못 함)",
        sourceUrl: "https://contents.history.go.kr/"
      },
      {
        id: "kh-06",
        question: "1919년 4월 대한민국 임시정부가 처음 세워진 도시는?",
        choices: ["상하이", "충칭", "블라디보스토크", "호놀룰루"],
        answerIndex: 0,
        explanation: "1919년 4월 상하이 임시의정원이 국호를 대한민국으로 정했다.",
        source: "국사편찬위원회 우리역사넷 (2026-10-08 검색 확인, 페이지 직접 확인 못 함)",
        sourceUrl: "https://contents.history.go.kr/"
      },
      {
        id: "kh-07",
        question: "우리나라가 일제로부터 광복을 맞은 날은?",
        choices: ["1945년 8월 15일", "1945년 3월 1일", "1948년 8월 15일", "1950년 6월 25일"],
        answerIndex: 0,
        explanation: "1945년 8월 15일 일본이 항복하면서 35년 식민 통치가 끝났다.",
        source: "국사편찬위원회 우리역사넷 (2026-10-08 검색 확인, 페이지 직접 확인 못 함)",
        sourceUrl: "https://contents.history.go.kr/"
      },
      {
        id: "kh-08",
        question: "6·25 전쟁이 시작된 날은?",
        choices: ["1950년 6월 25일", "1948년 8월 15일", "1953년 7월 27일", "1945년 8월 15일"],
        answerIndex: 0,
        explanation: "1950년 6월 25일 북한의 남침으로 전쟁이 시작됐다.",
        source: "국사편찬위원회 우리역사넷 (2026-10-08 검색 확인, 페이지 직접 확인 못 함)",
        sourceUrl: "https://contents.history.go.kr/"
      },
      {
        id: "kh-09",
        question: "임진왜란 때 거북선을 이끌고 수군을 지휘한 장수는?",
        choices: ["이순신", "권율", "김시민", "곽재우"],
        answerIndex: 0,
        explanation: "이순신이 거북선을 앞세워 임진왜란의 해전을 이끌었다.",
        source: "국사편찬위원회 우리역사넷 (2026-10-08 검색 확인, 페이지 직접 확인 못 함)",
        sourceUrl: "https://contents.history.go.kr/"
      },
      {
        id: "kh-10",
        question: "고려 시대에 만들어져 해인사 장경판전에 보관되어 있는 목판은?",
        choices: ["팔만대장경", "직지심체요절", "조선왕조실록", "승정원일기"],
        answerIndex: 0,
        explanation: "고려가 만든 팔만대장경 목판이 해인사 장경판전에 남아 있다.",
        source: "국사편찬위원회 우리역사넷 (2026-10-08 검색 확인, 페이지 직접 확인 못 함)",
        sourceUrl: "https://contents.history.go.kr/"
      }
    ]
  },
  "world-geography": {
    name: "세계지리",
    questions: [
      {
        id: "wg-01",
        question: "호주의 수도는?",
        choices: ["캔버라", "시드니", "멜버른", "브리즈번"],
        answerIndex: 0,
        explanation: "시드니와 멜버른이 수도를 다투자 중간 지점 캔버라로 정했다.",
        source: "외교부 국가·지역 정보 (2026-10-08 검색 확인, 페이지 직접 확인 못 함)",
        sourceUrl: "https://www.mofa.go.kr/"
      },
      {
        id: "wg-02",
        question: "브라질에서 공용어로 쓰는 말은?",
        choices: ["포르투갈어", "스페인어", "프랑스어", "영어"],
        answerIndex: 0,
        explanation: "브라질은 남아메리카에서 유일하게 포르투갈어를 공용어로 쓴다.",
        source: "외교부 국가·지역 정보 (2026-10-08 검색 확인, 페이지 직접 확인 못 함)",
        sourceUrl: "https://www.mofa.go.kr/"
      },
      {
        id: "wg-03",
        question: "바다 면적을 기준으로 가장 넓은 대양은?",
        choices: ["태평양", "대서양", "인도양", "북극해"],
        answerIndex: 0,
        explanation: "태평양은 지구 바다 면적의 약 절반을 차지하는 가장 넓은 대양이다.",
        source: "외교부 국가·지역 정보 (2026-10-08 검색 확인, 페이지 직접 확인 못 함)",
        sourceUrl: "https://www.mofa.go.kr/"
      },
      {
        id: "wg-04",
        question: "유럽과 아시아를 나누는 관례적 경계로 삼는 산맥은?",
        choices: ["우랄산맥", "알프스산맥", "안데스산맥", "히말라야산맥"],
        answerIndex: 0,
        explanation: "우랄산맥은 러시아를 남북으로 지나며 두 대륙의 관례적 경계가 된다.",
        source: "외교부 국가·지역 정보 (2026-10-08 검색 확인, 페이지 직접 확인 못 함)",
        sourceUrl: "https://www.mofa.go.kr/"
      },
      {
        id: "wg-05",
        question: "사하라 사막이 있는 대륙은?",
        choices: ["아프리카", "아시아", "남아메리카", "오세아니아"],
        answerIndex: 0,
        explanation: "사하라 사막은 아프리카 북부를 동서로 가로지르는 사막이다.",
        source: "외교부 국가·지역 정보 (2026-10-08 검색 확인, 페이지 직접 확인 못 함)",
        sourceUrl: "https://www.mofa.go.kr/"
      },
      {
        id: "wg-06",
        question: "2024년 기준 국토 면적이 가장 넓은 나라는?",
        choices: ["러시아", "캐나다", "중국", "미국"],
        answerIndex: 0,
        explanation: "러시아는 약 1,710만 제곱킬로미터로 국토 면적이 가장 넓다.",
        source: "외교부 국가·지역 정보 (2026-10-08 검색 확인, 페이지 직접 확인 못 함)",
        sourceUrl: "https://www.mofa.go.kr/"
      },
      {
        id: "wg-07",
        question: "나일강이 흘러 들어가는 바다는?",
        choices: ["지중해", "홍해", "흑해", "카스피해"],
        answerIndex: 0,
        explanation: "나일강은 아프리카 북쪽으로 흘러 이집트에서 지중해로 들어간다.",
        source: "외교부 국가·지역 정보 (2026-10-08 검색 확인, 페이지 직접 확인 못 함)",
        sourceUrl: "https://www.mofa.go.kr/"
      },
      {
        id: "wg-08",
        question: "캐나다의 수도는?",
        choices: ["오타와", "토론토", "밴쿠버", "몬트리올"],
        answerIndex: 0,
        explanation: "캐나다의 수도는 온타리오주에 있는 오타와다.",
        source: "외교부 국가·지역 정보 (2026-10-08 검색 확인, 페이지 직접 확인 못 함)",
        sourceUrl: "https://www.mofa.go.kr/"
      },
      {
        id: "wg-09",
        question: "안데스산맥이 뻗어 있는 대륙은?",
        choices: ["남아메리카", "북아메리카", "아프리카", "유럽"],
        answerIndex: 0,
        explanation: "안데스산맥은 남아메리카 서쪽 해안을 따라 남북으로 이어진다.",
        source: "외교부 국가·지역 정보 (2026-10-08 검색 확인, 페이지 직접 확인 못 함)",
        sourceUrl: "https://www.mofa.go.kr/"
      },
      {
        id: "wg-10",
        question: "나라 이름이 에스파냐어로 적도를 뜻하며 적도가 지나는 남아메리카 나라는?",
        choices: ["에콰도르", "칠레", "아르헨티나", "볼리비아"],
        answerIndex: 0,
        explanation: "에콰도르는 에스파냐어로 적도를 뜻하며 적도가 나라를 지난다.",
        source: "외교부 국가·지역 정보 (2026-10-08 검색 확인, 페이지 직접 확인 못 함)",
        sourceUrl: "https://www.mofa.go.kr/"
      }
    ]
  },
  "science": {
    name: "과학",
    questions: [
      {
        id: "sc-01",
        question: "물의 화학식은?",
        choices: ["H2O", "CO2", "O2", "NaCl"],
        answerIndex: 0,
        explanation: "물 분자 하나는 수소 원자 두 개와 산소 원자 한 개로 이루어진다.",
        source: "한국과학창의재단 사이언스올 (2026-10-08 검색 확인, 페이지 직접 확인 못 함)",
        sourceUrl: "https://www.scienceall.com/"
      },
      {
        id: "sc-02",
        question: "산소의 원소 기호는?",
        choices: ["O", "Os", "S", "N"],
        answerIndex: 0,
        explanation: "산소의 원소 기호는 O이고 Os는 오스뮴, S는 황, N은 질소다.",
        source: "한국과학창의재단 사이언스올 (2026-10-08 검색 확인, 페이지 직접 확인 못 함)",
        sourceUrl: "https://www.scienceall.com/"
      },
      {
        id: "sc-03",
        question: "식물이 빛을 이용해 스스로 양분을 만드는 작용은?",
        choices: ["광합성", "호흡", "증산", "발효"],
        answerIndex: 0,
        explanation: "광합성은 빛에너지로 이산화탄소와 물에서 양분을 만드는 작용이다.",
        source: "한국과학창의재단 사이언스올 (2026-10-08 검색 확인, 페이지 직접 확인 못 함)",
        sourceUrl: "https://www.scienceall.com/"
      },
      {
        id: "sc-04",
        question: "혈액에서 산소를 실어 나르는 세포는?",
        choices: ["적혈구", "백혈구", "혈소판", "림프구"],
        answerIndex: 0,
        explanation: "적혈구 속 헤모글로빈이 산소와 결합해 온몸으로 실어 나른다.",
        source: "한국과학창의재단 사이언스올 (2026-10-08 검색 확인, 페이지 직접 확인 못 함)",
        sourceUrl: "https://www.scienceall.com/"
      },
      {
        id: "sc-05",
        question: "태양계의 행성 가운데 지름이 가장 큰 행성은?",
        choices: ["목성", "토성", "지구", "해왕성"],
        answerIndex: 0,
        explanation: "목성은 지름이 지구의 약 열한 배로 태양계에서 가장 큰 행성이다.",
        source: "한국과학창의재단 사이언스올 (2026-10-08 검색 확인, 페이지 직접 확인 못 함)",
        sourceUrl: "https://www.scienceall.com/"
      },
      {
        id: "sc-06",
        question: "지구에서 가장 가까운 항성은?",
        choices: ["태양", "시리우스", "프록시마 켄타우리", "북극성"],
        answerIndex: 0,
        explanation: "태양은 지구에서 약 1억 5천만 킬로미터 떨어진 가장 가까운 항성이다.",
        source: "한국과학창의재단 사이언스올 (2026-10-08 검색 확인, 페이지 직접 확인 못 함)",
        sourceUrl: "https://www.scienceall.com/"
      },
      {
        id: "sc-07",
        question: "원소를 성질에 따라 배열한 주기율표를 처음 만든 사람은?",
        choices: ["멘델레예프", "돌턴", "라부아지에", "보어"],
        answerIndex: 0,
        explanation: "멘델레예프가 1869년 원소를 주기적 성질에 따라 배열했다.",
        source: "한국과학창의재단 사이언스올 (2026-10-08 검색 확인, 페이지 직접 확인 못 함)",
        sourceUrl: "https://www.scienceall.com/"
      },
      {
        id: "sc-08",
        question: "1953년에 DNA의 이중나선 구조를 발표한 두 과학자는?",
        choices: ["왓슨과 크릭", "멘델과 다윈", "파스퇴르와 코흐", "퀴리와 러더퍼드"],
        answerIndex: 0,
        explanation: "왓슨과 크릭이 1953년 DNA가 이중나선임을 밝혀 발표했다.",
        source: "한국과학창의재단 사이언스올 (2026-10-08 검색 확인, 페이지 직접 확인 못 함)",
        sourceUrl: "https://www.scienceall.com/"
      },
      {
        id: "sc-09",
        question: "소금의 주성분인 염화나트륨의 화학식은?",
        choices: ["NaCl", "KCl", "CaCO3", "H2SO4"],
        answerIndex: 0,
        explanation: "염화나트륨은 나트륨과 염소가 결합한 물질로 화학식은 NaCl이다.",
        source: "한국과학창의재단 사이언스올 (2026-10-08 검색 확인, 페이지 직접 확인 못 함)",
        sourceUrl: "https://www.scienceall.com/"
      },
      {
        id: "sc-10",
        question: "1기압에서 물이 끓는 온도는?",
        choices: ["섭씨 100도", "섭씨 0도", "섭씨 50도", "섭씨 273도"],
        answerIndex: 0,
        explanation: "1기압에서 물은 섭씨 100도에서 끓고 섭씨 0도에서 언다.",
        source: "한국과학창의재단 사이언스올 (2026-10-08 검색 확인, 페이지 직접 확인 못 함)",
        sourceUrl: "https://www.scienceall.com/"
      }
    ]
  },
  "arts-culture": {
    name: "예술과 문화",
    questions: [
      {
        id: "ac-01",
        question: "'모나리자'를 그린 화가는?",
        choices: ["레오나르도 다 빈치", "미켈란젤로", "라파엘로", "보티첼리"],
        answerIndex: 0,
        explanation: "레오나르도 다 빈치가 그린 모나리자는 루브르 박물관에 있다.",
        source: "한국민족문화대백과사전 (2026-10-08 검색 확인, 페이지 직접 확인 못 함)",
        sourceUrl: "https://encykorea.aks.ac.kr/"
      },
      {
        id: "ac-02",
        question: "'별이 빛나는 밤'을 그린 화가는?",
        choices: ["빈센트 반 고흐", "클로드 모네", "폴 고갱", "에드바르 뭉크"],
        answerIndex: 0,
        explanation: "반 고흐가 1889년에 그린 작품으로 소용돌이치는 밤하늘이 특징이다.",
        source: "한국민족문화대백과사전 (2026-10-08 검색 확인, 페이지 직접 확인 못 함)",
        sourceUrl: "https://encykorea.aks.ac.kr/"
      },
      {
        id: "ac-03",
        question: "피카소의 '게르니카'가 다룬 전쟁은?",
        choices: ["스페인 내전", "제1차 세계대전", "크림 전쟁", "나폴레옹 전쟁"],
        answerIndex: 0,
        explanation: "스페인 내전 때 게르니카 마을이 폭격당한 참상을 그린 작품이다.",
        source: "한국민족문화대백과사전 (2026-10-08 검색 확인, 페이지 직접 확인 못 함)",
        sourceUrl: "https://encykorea.aks.ac.kr/"
      },
      {
        id: "ac-04",
        question: "발레 '백조의 호수'를 작곡한 사람은?",
        choices: ["차이콥스키", "스트라빈스키", "쇼팽", "드뷔시"],
        answerIndex: 0,
        explanation: "차이콥스키가 작곡한 발레 음악으로 호두까기 인형도 그의 작품이다.",
        source: "한국민족문화대백과사전 (2026-10-08 검색 확인, 페이지 직접 확인 못 함)",
        sourceUrl: "https://encykorea.aks.ac.kr/"
      },
      {
        id: "ac-05",
        question: "베토벤 교향곡 9번에 붙은 별칭은?",
        choices: ["합창", "운명", "전원", "영웅"],
        answerIndex: 0,
        explanation: "4악장에 합창이 들어가 합창 교향곡으로 불린다.",
        source: "한국민족문화대백과사전 (2026-10-08 검색 확인, 페이지 직접 확인 못 함)",
        sourceUrl: "https://encykorea.aks.ac.kr/"
      },
      {
        id: "ac-06",
        question: "경주에 있으며 석굴암과 함께 유네스코 세계유산에 오른 절은?",
        choices: ["불국사", "해인사", "통도사", "송광사"],
        answerIndex: 0,
        explanation: "석굴암과 불국사가 1995년 유네스코 세계유산에 함께 올랐다.",
        source: "한국민족문화대백과사전 (2026-10-08 검색 확인, 페이지 직접 확인 못 함)",
        sourceUrl: "https://encykorea.aks.ac.kr/"
      },
      {
        id: "ac-07",
        question: "조선의 법궁으로 1395년에 처음 지은 궁궐은?",
        choices: ["경복궁", "창덕궁", "덕수궁", "창경궁"],
        answerIndex: 0,
        explanation: "경복궁은 조선을 세운 뒤 1395년에 지은 조선의 법궁이다.",
        source: "한국민족문화대백과사전 (2026-10-08 검색 확인, 페이지 직접 확인 못 함)",
        sourceUrl: "https://encykorea.aks.ac.kr/"
      },
      {
        id: "ac-08",
        question: "판소리 다섯 마당에 드는 작품은?",
        choices: ["춘향가", "아리랑", "강강술래", "농악"],
        answerIndex: 0,
        explanation: "판소리 다섯 마당은 춘향가, 심청가, 흥보가, 수궁가, 적벽가다.",
        source: "한국민족문화대백과사전 (2026-10-08 검색 확인, 페이지 직접 확인 못 함)",
        sourceUrl: "https://encykorea.aks.ac.kr/"
      },
      {
        id: "ac-09",
        question: "고려청자에서 무늬를 파낸 자리에 다른 흙을 메워 넣는 기법은?",
        choices: ["상감", "청화", "철화", "분청"],
        answerIndex: 0,
        explanation: "상감은 무늬를 파고 백토나 흑토를 메워 구워 내는 고려의 기법이다.",
        source: "한국민족문화대백과사전 (2026-10-08 검색 확인, 페이지 직접 확인 못 함)",
        sourceUrl: "https://encykorea.aks.ac.kr/"
      },
      {
        id: "ac-10",
        question: "겨울을 앞두고 김치를 한꺼번에 담그는 한국의 풍습을 가리키는 말은?",
        choices: ["김장", "차례", "한식", "단오"],
        answerIndex: 0,
        explanation: "김장 문화는 2013년 유네스코 인류무형문화유산에 올랐다.",
        source: "한국민족문화대백과사전 (2026-10-08 검색 확인, 페이지 직접 확인 못 함)",
        sourceUrl: "https://encykorea.aks.ac.kr/"
      }
    ]
  }
};
