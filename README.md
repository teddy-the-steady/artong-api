# Welcome to Artong-Api

**Artong** Art everywhere

## Project 구성

node.js v12
serverless framework v2
Api-Gateway  
Lambda  
CodePipeline  
Cognito  
etc

---

## Dev commands(로컬에 개발서버 run)

```
sls offline --noAuth --stage dev --param="s3_bucket=null"
```

---

## Cloudwatch Log 확인하기

1. 로컬 맥에 utern 패키지 설치(https://github.com/knqyf263/utern)

```
$ brew tap knqyf263/utern
$ brew install knqyf263/utern/utern
```

2. aws configure 명령어로 인증정보 세팅

```
$ aws configure
```

```
AWS Access Key ID: ****************WQ5X
AWS Secret Access Key: ****************ivPY
Default region name: ap-northeast-2
```

3. utern <로그그룹> 명령어로 tail로그 가져오기

```
$ utern /aws/lambda/artong-api-stage-artong
```

## 개발전용 람다 간편 업로드

```
npx tsc
```

```
serverless deploy function -f <functionName>
```

## Before git push, js 파일 삭제

```
find ./<service> -name "*.js" -exec rm -rf {} \;
```
