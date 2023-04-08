# Controller 설명

# main.ts

- 설명: 메인 화면 렌더링에 필요한 데이터 전달
- 기능:
  - 지금 핫한 창작자 (getTop10Contributors())
  - 주목할 만한 프로젝트 (getMainContents())
  - 알통 에디터 추천 (getMainContents())

# follow.ts

- 설명: 아티스트 팔로우
- 기능:
  - 유저 팔로우 및 언팔로우 (doFollowMemberOrUndo())
  - 프로젝트 팔로우 및 언팔로우 (doSubsribeProjectOrUndo())

# offer.ts

- ??

# country.ts

- 설명:
- postCountry()
  - Vue에서 해당 라우터로 쏘는 axios를 찾아보았지만 나오지않음
  - 요청이 들어오면 country를 생성하는데 이게 뭘까?
  - 나라별 iso code를 저장하여 어떻게 활용이 되는지?

# reactions.ts

- 설명: 좋아요, 좋아요 취소
- 기능:
  - 유저 데이터에 좋아요 수 반영 (postContentReaction())

# report.ts

- 설명: 신고 기능으로 생각됨

# search.ts

- 설명: 프로젝트 검색, 컨텐츠 검색, 유저 검색
- 기능:
  - 프로젝트 조회 (searchProjects())
  - 컨텐츠 조회 (searchContents())
  - 유저 조회(searchMembers())

# projects.ts

- 설명: 프로젝트 관련 여러 기능들
- 기능:
  - 프로젝트 CRUD
  - 다음 프로젝트 미리보기 (getProjectsPrevNext())

# notification.ts
