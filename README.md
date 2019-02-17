# slickExtensions 1.0.0
슬릭 플러그인에 대한 기능을 확장해주는 스크립트입니다.

이름 | 형태 | 기본값 | 매개변수 | 반환 | 설명
| :-- | :-- | :--- | :---- | :-- | :-- |
autoArrow | element \|\| jQueryElement | | | | 재생과 일시정지 토글 기능을 수행할 요소입니다.
playArrow | element \|\| jQueryElement | | | | 재생 기능을 수행할 요소입니다.
pauseArrow | element \|\| jQueryElement | | | | 일시정지 기능을 수행할 요소입니다.
isRunOnLowIE | boolean | false | | | ie7, 8에서 반응형 사용 여부입니다.
pauseOnArrowClick | boolean | false | | | 이전 또는 다음 버튼 클릭 후 일시정지 여부입니다.
pauseOnDotsClick | boolean | false | | | 도트 클릭 후 일시정지 여부입니다.
pauseOnDirectionKeyPush | boolean | false | | | 방향 키를 누른 후 일시정지 여부입니다.
pauseOnSwipe | boolean | false | | | 스와이프 후 일시정지 여부입니다.
playText | string | play | | | 재생에 대한 문자를 지정합니다.
pauseText | string | pause | | | 일시정지에 대한 문자를 지정합니다.
current | element \|\| jQueryElement | | | | 현재 슬라이드 위치를 표기할 요소입니다.
total | element \|\| jQueryElement | | | | 슬라이드의 개수를 표기할 요소입니다.
customState | function | decimal | state | object[current : string \|\| number, total : string \|\| number] | 현재 슬라이드 위치와 슬라이드 개수를 조정합니다.

- 슬릭이 세팅되어 있는 상태에서 재 호출 시 오류제거
- 매개변수에 이상한 값이 올 경우 오류 제거
- 코어 값에 이상한 값이 올 경우 오류 제거

## kenwheeler
<https://github.com/kenwheeler/slick>