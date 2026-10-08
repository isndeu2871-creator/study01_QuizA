// 문항 데이터. 전역 상수 QUIZ_DATA 하나만 선언한다.
// 카테고리 4개 × 문항 10개 = 40개.
//
// 출처에 관하여: 문항마다 기관의 해당 문서로 연결한다. 사실은 웹 검색으로 그 문서의
// 문장을 확인해 썼으며, 이 환경에서는 페이지를 브라우저로 직접 열어 보지 못했다.
// 자료마다 값이 갈리거나 학계에 이견이 있는 주제(발해 건국 연도, 훈민정음 반포 시점,
// 신라의 삼국 통일 시점 등)는 모두 제외했다.
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
        source: "한국민족문화대백과사전 「고려」",
        sourceUrl: "https://encykorea.aks.ac.kr/Article/E0003424"
      },
      {
        id: "kh-02",
        question: "1392년에 조선을 세운 사람은?",
        choices: ["정몽주", "이성계", "정도전", "최영"],
        answerIndex: 1,
        explanation: "위화도 회군으로 권력을 잡은 이성계가 1392년 조선을 세웠다.",
        source: "국사편찬위원회 우리역사넷 「조선의 건국」",
        sourceUrl: "https://contents.history.go.kr/mobile/ta/view.do?levelId=ta_m61_0080_0010"
      },
      {
        id: "kh-03",
        question: "임진왜란이 일어난 해는?",
        choices: ["1592년", "1692년", "1392년", "1492년"],
        answerIndex: 0,
        explanation: "1592년 4월 일본군이 부산 앞바다에 나타나며 전쟁이 시작됐다.",
        source: "한국민족문화대백과사전 「임진왜란」",
        sourceUrl: "https://encykorea.aks.ac.kr/Article/E0047674"
      },
      {
        id: "kh-04",
        question: "훈민정음을 창제한 조선의 임금은?",
        choices: ["태종", "성종", "정조", "세종"],
        answerIndex: 3,
        explanation: "세종이 1443년 훈민정음 스물여덟 자를 창제했다.",
        source: "한국민족문화대백과사전 「훈민정음」",
        sourceUrl: "https://encykorea.aks.ac.kr/Article/E0065805"
      },
      {
        id: "kh-05",
        question: "3·1 운동이 일어난 해는?",
        choices: ["1909년", "1919년", "1929년", "1945년"],
        answerIndex: 1,
        explanation: "1919년 3월 1일 전국에서 독립을 선언하는 만세 운동이 일어났다.",
        source: "한국민족문화대백과사전 「3·1운동」",
        sourceUrl: "https://encykorea.aks.ac.kr/Article/E0026772"
      },
      {
        id: "kh-06",
        question: "1919년 4월 대한민국 임시정부가 처음 세워진 도시는?",
        choices: ["호놀룰루", "상하이", "충칭", "블라디보스토크"],
        answerIndex: 1,
        explanation: "1919년 4월 상하이 임시의정원이 국호를 대한민국으로 정했다.",
        source: "한국민족문화대백과사전 「대한민국 임시정부」",
        sourceUrl: "https://encykorea.aks.ac.kr/Article/E0015017"
      },
      {
        id: "kh-07",
        question: "우리나라가 일제로부터 광복을 맞은 날은?",
        choices: ["1948년 8월 15일", "1950년 6월 25일", "1945년 8월 15일", "1945년 3월 1일"],
        answerIndex: 2,
        explanation: "1945년 8월 15일 일본이 항복하면서 35년 식민 통치가 끝났다.",
        source: "한국민족문화대백과사전 「8·15광복」",
        sourceUrl: "https://encykorea.aks.ac.kr/Article/E0059769"
      },
      {
        id: "kh-08",
        question: "6·25 전쟁이 시작된 날은?",
        choices: ["1948년 8월 15일", "1953년 7월 27일", "1945년 8월 15일", "1950년 6월 25일"],
        answerIndex: 3,
        explanation: "1950년 6월 25일 북한의 남침으로 전쟁이 시작됐다.",
        source: "한국민족문화대백과사전 「한국전쟁」",
        sourceUrl: "https://encykorea.aks.ac.kr/Article/E0042143"
      },
      {
        id: "kh-09",
        question: "임진왜란 때 거북선을 이끌고 수군을 지휘한 장수는?",
        choices: ["이순신", "권율", "김시민", "곽재우"],
        answerIndex: 0,
        explanation: "이순신이 거북선을 앞세워 임진왜란의 해전을 이끌었다.",
        source: "한국민족문화대백과사전 「이순신」",
        sourceUrl: "https://encykorea.aks.ac.kr/Article/E0044900"
      },
      {
        id: "kh-10",
        question: "고려 시대에 만들어져 해인사 장경판전에 보관되어 있는 목판은?",
        choices: ["승정원일기", "팔만대장경", "직지심체요절", "조선왕조실록"],
        answerIndex: 1,
        explanation: "고려가 만든 팔만대장경 목판이 해인사 장경판전에 남아 있다.",
        source: "한국민족문화대백과사전 「합천 해인사 대장경판」",
        sourceUrl: "https://encykorea.aks.ac.kr/Article/E0062711"
      }
    ]
  },
  "world-geography": {
    name: "세계지리",
    questions: [
      {
        id: "wg-01",
        question: "호주의 수도는?",
        choices: ["멜버른", "브리즈번", "캔버라", "시드니"],
        answerIndex: 2,
        explanation: "시드니와 멜버른이 수도를 다투자 중간 지점 캔버라로 정했다.",
        source: "한국민족문화대백과사전 「오스트레일리아」",
        sourceUrl: "https://encykorea.aks.ac.kr/Article/E0038381"
      },
      {
        id: "wg-02",
        question: "브라질에서 공용어로 쓰는 말은?",
        choices: ["스페인어", "프랑스어", "영어", "포르투갈어"],
        answerIndex: 3,
        explanation: "브라질은 남아메리카에서 유일하게 포르투갈어를 공용어로 쓴다.",
        source: "한국민족문화대백과사전 「브라질」",
        sourceUrl: "https://encykorea.aks.ac.kr/Article/E0025067"
      },
      {
        id: "wg-03",
        question: "바다 면적을 기준으로 가장 넓은 대양은?",
        choices: ["태평양", "대서양", "인도양", "북극해"],
        answerIndex: 0,
        explanation: "태평양은 지구 바다 면적의 약 절반을 차지하는 가장 넓은 대양이다.",
        source: "미국 해양대기청 NOAA 「What is the largest ocean basin on Earth?」",
        sourceUrl: "https://oceanservice.noaa.gov/facts/biggestocean.html"
      },
      {
        id: "wg-04",
        question: "유럽과 아시아를 나누는 관례적 경계로 삼는 산맥은?",
        choices: ["히말라야산맥", "우랄산맥", "알프스산맥", "안데스산맥"],
        answerIndex: 1,
        explanation: "우랄산맥은 러시아를 남북으로 지나며 두 대륙의 관례적 경계가 된다.",
        source: "브리태니커 「Ural Mountains」",
        sourceUrl: "https://www.britannica.com/summary/Ural-Mountains"
      },
      {
        id: "wg-05",
        question: "사하라 사막이 있는 대륙은?",
        choices: ["남아메리카", "오세아니아", "아프리카", "아시아"],
        answerIndex: 2,
        explanation: "사하라 사막은 아프리카 북부를 동서로 가로지르는 사막이다.",
        source: "브리태니커 「Sahara」",
        sourceUrl: "https://kids.britannica.com/students/article/Sahara/276838"
      },
      {
        id: "wg-06",
        question: "2024년 기준 국토 면적이 가장 넓은 나라는?",
        choices: ["캐나다", "중국", "미국", "러시아"],
        answerIndex: 3,
        explanation: "러시아는 약 1,710만 제곱킬로미터로 국토 면적이 가장 넓다.",
        source: "브리태니커 「세계 각국의 면적 목록」",
        sourceUrl: "https://www.britannica.com/topic/list-of-the-total-areas-of-the-worlds-countries-dependencies-and-territories-2130540"
      },
      {
        id: "wg-07",
        question: "나일강이 흘러 들어가는 바다는?",
        choices: ["지중해", "홍해", "흑해", "카스피해"],
        answerIndex: 0,
        explanation: "나일강은 아프리카 북쪽으로 흘러 이집트에서 지중해로 들어간다.",
        source: "브리태니커 「Nile River」",
        sourceUrl: "https://www.britannica.com/place/Nile-River"
      },
      {
        id: "wg-08",
        question: "캐나다의 수도는?",
        choices: ["몬트리올", "오타와", "토론토", "밴쿠버"],
        answerIndex: 1,
        explanation: "캐나다의 수도는 온타리오주에 있는 오타와다.",
        source: "한국민족문화대백과사전 「캐나다」",
        sourceUrl: "https://encykorea.aks.ac.kr/Article/E0058615"
      },
      {
        id: "wg-09",
        question: "안데스산맥이 뻗어 있는 대륙은?",
        choices: ["아프리카", "유럽", "남아메리카", "북아메리카"],
        answerIndex: 2,
        explanation: "안데스산맥은 남아메리카 서쪽 해안을 따라 남북으로 이어진다.",
        source: "브리태니커 「Andes Mountains」",
        sourceUrl: "https://www.britannica.com/summary/Andes-Mountains"
      },
      {
        id: "wg-10",
        question: "나라 이름이 에스파냐어로 적도를 뜻하며 적도가 지나는 남아메리카 나라는?",
        choices: ["칠레", "아르헨티나", "볼리비아", "에콰도르"],
        answerIndex: 3,
        explanation: "에콰도르는 에스파냐어로 적도를 뜻하며 적도가 나라를 지난다.",
        source: "브리태니커 「Ecuador」",
        sourceUrl: "https://kids.britannica.com/students/article/Ecuador/274119"
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
        source: "한국민족문화대백과사전 「물」",
        sourceUrl: "https://encykorea.aks.ac.kr/Article/E0019814"
      },
      {
        id: "sc-02",
        question: "산소의 원소 기호는?",
        choices: ["N", "O", "Os", "S"],
        answerIndex: 1,
        explanation: "산소의 원소 기호는 O이고 Os는 오스뮴, S는 황, N은 질소다.",
        source: "브리태니커 「Oxygen」",
        sourceUrl: "https://www.britannica.com/science/oxygen"
      },
      {
        id: "sc-03",
        question: "식물이 빛을 이용해 스스로 양분을 만드는 작용은?",
        choices: ["증산", "발효", "광합성", "호흡"],
        answerIndex: 2,
        explanation: "광합성은 빛에너지로 이산화탄소와 물에서 양분을 만드는 작용이다.",
        source: "사이언스올 과학백과사전 「광합성」",
        sourceUrl: "https://www.scienceall.com/brd/board/390/L/menu/317?brdType=R&bbsSn=167544"
      },
      {
        id: "sc-04",
        question: "혈액에서 산소를 실어 나르는 세포는?",
        choices: ["백혈구", "혈소판", "림프구", "적혈구"],
        answerIndex: 3,
        explanation: "적혈구 속 헤모글로빈이 산소와 결합해 온몸으로 실어 나른다.",
        source: "사이언스올 과학백과사전 「헤모글로빈」",
        sourceUrl: "https://scienceall.com/brd/board/390/L/menu/317?bbsSn=34168&brdCodeValue=&brdType=R&thisPage=1"
      },
      {
        id: "sc-05",
        question: "태양계의 행성 가운데 지름이 가장 큰 행성은?",
        choices: ["목성", "토성", "지구", "해왕성"],
        answerIndex: 0,
        explanation: "목성은 지름이 지구의 약 열한 배로 태양계에서 가장 큰 행성이다.",
        source: "미국 항공우주국 NASA 「Planet Sizes and Locations in Our Solar System」",
        sourceUrl: "https://science.nasa.gov/solar-system/planets/planet-sizes-and-locations-in-our-solar-system/"
      },
      {
        id: "sc-06",
        question: "지구에서 가장 가까운 항성은?",
        choices: ["북극성", "태양", "시리우스", "프록시마 켄타우리"],
        answerIndex: 1,
        explanation: "태양은 지구에서 약 1억 5천만 킬로미터 떨어진 가장 가까운 항성이다.",
        source: "한국천문연구원 「행성들 사이의 거리, 태양계 규모」",
        sourceUrl: "https://astro.kasi.re.kr/learning/pageView/5115"
      },
      {
        id: "sc-07",
        question: "원소를 성질에 따라 배열한 주기율표를 처음 만든 사람은?",
        choices: ["라부아지에", "보어", "멘델레예프", "돌턴"],
        answerIndex: 2,
        explanation: "멘델레예프가 1869년 원소를 주기적 성질에 따라 배열했다.",
        source: "브리태니커 「Periodic table」",
        sourceUrl: "https://www.britannica.com/science/periodic-table"
      },
      {
        id: "sc-08",
        question: "1953년에 DNA의 이중나선 구조를 발표한 두 과학자는?",
        choices: ["멘델과 다윈", "파스퇴르와 코흐", "퀴리와 러더퍼드", "왓슨과 크릭"],
        answerIndex: 3,
        explanation: "왓슨과 크릭이 1953년 DNA가 이중나선임을 밝혀 발표했다.",
        source: "노벨재단 「The discovery of the molecular structure of DNA」",
        sourceUrl: "https://educationalgames.nobelprize.org/educational/medicine/dna_double_helix/readmore.php"
      },
      {
        id: "sc-09",
        question: "소금의 주성분인 염화나트륨의 화학식은?",
        choices: ["NaCl", "KCl", "CaCO3", "H2SO4"],
        answerIndex: 0,
        explanation: "염화나트륨은 나트륨과 염소가 결합한 물질로 화학식은 NaCl이다.",
        source: "한국민족문화대백과사전 「소금」",
        sourceUrl: "https://encykorea.aks.ac.kr/Article/E0029949"
      },
      {
        id: "sc-10",
        question: "1기압에서 물이 끓는 온도는?",
        choices: ["섭씨 273도", "섭씨 100도", "섭씨 0도", "섭씨 50도"],
        answerIndex: 1,
        explanation: "1기압에서 물은 섭씨 100도에서 끓고 섭씨 0도에서 언다.",
        source: "사이언스올 과학백과사전 「기준 끓는점」",
        sourceUrl: "https://www.scienceall.com/brd/board/390/L/menu/317?bbsSn=168134&brdCodeValue=&brdType=R&thisPage=1"
      }
    ]
  },
  "arts-culture": {
    name: "예술과 문화",
    questions: [
      {
        id: "ac-01",
        question: "'모나리자'를 그린 화가는?",
        choices: ["라파엘로", "보티첼리", "레오나르도 다 빈치", "미켈란젤로"],
        answerIndex: 2,
        explanation: "레오나르도 다 빈치가 그린 모나리자는 루브르 박물관에 있다.",
        source: "브리태니커 「Mona Lisa」",
        sourceUrl: "https://www.britannica.com/topic/Mona-Lisa-painting"
      },
      {
        id: "ac-02",
        question: "'별이 빛나는 밤'을 그린 화가는?",
        choices: ["클로드 모네", "폴 고갱", "에드바르 뭉크", "빈센트 반 고흐"],
        answerIndex: 3,
        explanation: "반 고흐가 1889년에 그린 작품으로 소용돌이치는 밤하늘이 특징이다.",
        source: "브리태니커 「The Starry Night in Focus」",
        sourceUrl: "https://www.britannica.com/topic/The-Starry-Night-in-Focus-2236376"
      },
      {
        id: "ac-03",
        question: "피카소의 '게르니카'가 다룬 전쟁은?",
        choices: ["스페인 내전", "제1차 세계대전", "크림 전쟁", "나폴레옹 전쟁"],
        answerIndex: 0,
        explanation: "스페인 내전 때 게르니카 마을이 폭격당한 참상을 그린 작품이다.",
        source: "브리태니커 「Guernica」",
        sourceUrl: "https://www.britannica.com/topic/Guernica-by-Picasso"
      },
      {
        id: "ac-04",
        question: "발레 '백조의 호수'를 작곡한 사람은?",
        choices: ["드뷔시", "차이콥스키", "스트라빈스키", "쇼팽"],
        answerIndex: 1,
        explanation: "차이콥스키가 작곡한 발레 음악으로 호두까기 인형도 그의 작품이다.",
        source: "브리태니커 「Swan Lake」",
        sourceUrl: "https://www.britannica.com/topic/Swan-Lake-ballet-by-Tchaikovsky"
      },
      {
        id: "ac-05",
        question: "베토벤 교향곡 9번에 붙은 별칭은?",
        choices: ["전원", "영웅", "합창", "운명"],
        answerIndex: 2,
        explanation: "4악장에 합창이 들어가 합창 교향곡으로 불린다.",
        source: "브리태니커 「Symphony No. 9 in D Minor」",
        sourceUrl: "https://www.britannica.com/topic/Symphony-No-9-in-D-Minor"
      },
      {
        id: "ac-06",
        question: "경주에 있으며 석굴암과 함께 유네스코 세계유산에 오른 절은?",
        choices: ["해인사", "통도사", "송광사", "불국사"],
        answerIndex: 3,
        explanation: "석굴암과 불국사가 1995년 유네스코 세계유산에 함께 올랐다.",
        source: "국사편찬위원회 우리역사넷 「불국사와 석굴암」",
        sourceUrl: "https://contents.history.go.kr/mobile/eh/view.do?levelId=eh_r0070_0010&code=eh_age_10"
      },
      {
        id: "ac-07",
        question: "조선의 법궁으로 1395년에 처음 지은 궁궐은?",
        choices: ["경복궁", "창덕궁", "덕수궁", "창경궁"],
        answerIndex: 0,
        explanation: "경복궁은 조선을 세운 뒤 1395년에 지은 조선의 법궁이다.",
        source: "국가유산청 궁능유적본부 「경복궁 소개·역사」",
        sourceUrl: "https://royal.khs.go.kr/ROYAL/contents/R101010000.do"
      },
      {
        id: "ac-08",
        question: "판소리 다섯 마당에 드는 작품은?",
        choices: ["농악", "춘향가", "아리랑", "강강술래"],
        answerIndex: 1,
        explanation: "판소리 다섯 마당은 춘향가, 심청가, 흥보가, 수궁가, 적벽가다.",
        source: "한국민족문화대백과사전 「판소리」",
        sourceUrl: "https://encykorea.aks.ac.kr/Article/E0059663"
      },
      {
        id: "ac-09",
        question: "고려청자에서 무늬를 파낸 자리에 다른 흙을 메워 넣는 기법은?",
        choices: ["철화", "분청", "상감", "청화"],
        answerIndex: 2,
        explanation: "상감은 무늬를 파고 백토나 흑토를 메워 구워 내는 고려의 기법이다.",
        source: "한국민족문화대백과사전 「상감」",
        sourceUrl: "https://encykorea.aks.ac.kr/Article/E0026995"
      },
      {
        id: "ac-10",
        question: "겨울을 앞두고 김치를 한꺼번에 담그는 한국의 풍습을 가리키는 말은?",
        choices: ["차례", "한식", "단오", "김장"],
        answerIndex: 3,
        explanation: "김장 문화는 2013년 유네스코 인류무형문화유산에 올랐다.",
        source: "국가유산청 「한국의 유네스코 인류무형문화유산」",
        sourceUrl: "https://m.khs.go.kr/public/commentary/HtmlPage.do?pg=%2Funesco%2FkorInCulHeritage.jsp"
      }
    ]
  }
};
