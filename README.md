# 여행별🌎 백엔드🍀
<br>

## Team Members
|<img src="https://avatars.githubusercontent.com/u/121166835?v=4" width="150" height="150"/>|<img src="https://avatars.githubusercontent.com/u/144138489?v=4" width="150" height="150"/>|<img src="https://avatars.githubusercontent.com/u/160315926?v=4" width="150" height="150"/>|<img src="https://avatars.githubusercontent.com/u/81412484?v=4" width="150" height="150"/>|
|:-:|:-:|:-:|:-:|
|유찬혁<br/>[@ri7116](https://github.com/ri7116)|홍지호<br/>[@jih023](https://github.com/jih023)|황무원<br/>[@codmoni](https://github.com/codmoni)|이상원<br/>[@sangwon02](https://github.com/sangwon02)|
<br>
<br>

## Branch Strategy
Git-flow 전략을 기반으로 main, develop 브랜치와 feature 보조 브랜치를 운용 

main, develop, feat 브랜치로 나누어 개발

`main 브랜치`는 배포 단계에서만 사용하는 브랜치

`develop 브랜치`는 개발 단계에서 git-flow의 master 역할을 하는 브랜치

`feature 브랜치`는 기능 단위로 독립적인 개발 환경을 위하여 사용하고 merge 후 각 브랜치 삭제
<br>
<br>

## Feature branch
브랜치명은 아래의 형식으로 작성 (feature/이름-기능제목#이슈번호)

팀원 sheepyis의 브랜치명: feature/sheepyis-login#1

Feature branch -> develop branch로 merge하기 전 PR에서 reviewers 설정하여 팀원 2명 이상에게 approve 받기

PR 후 팀원들에게 공지하기
<br>
<br>


## Commit Convention
`태그: 제목`의 형태이며, `: `뒤에만 띄어쓰기를 작성해주시면 됩니다!
끝에는 `.` 금지!

 - `feat` : 새로운 기능과 관련된 것(새로운 기능을 추가)을 의미

 - `fix` : 오류와 같은 것을 수정했을 때 사용

 - `docs` : 문서와 관련하여 수정한 부분이 있을 때 사용

 - `style` : 코드의 변화와 관련없는 포맷이나 세미콜론을 놓친 것과 같은 부분들을 의미

 - `refactor` : 코드의 리팩토링을 의미

 - `test` : test를 추가하거나 수정했을 때를 의미

 - `chore` : build와 관련된 부분, 패키지 매니저 설정 등 여러가지 production code와 무관한 부분 들을 의미. 말 그대로 자질구레한 일

 - `comment` : 필요한 주석 및 변경했을 때 의미

 - `rename` : 파일 또는 폴더 명을 수정하거나 옮기는 작업만인 경우

 - `remove` : 파일을 삭제하는 작업만 수행했을 때를 의미

 - `!HOTFIX` : 급하게 치명적인 버그를 고쳐야하는 경우를 의미

<br>
<br>

## Tech Stack

- Backend: Node.js, Express

- Database: Prisma, MySQL 

- Deployment: HTTPS
