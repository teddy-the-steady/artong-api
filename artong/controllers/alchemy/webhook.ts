const receive = async function (body: any) {
  const logs = body.event.data.block.logs
  if(logs instanceof Array) {
    logs.map((log)=>{
      console.log("트랜잭션 발생!!",log.transaction)
      log.transaction.logs.map((subLog: any)=>{
        subLog.topics.map((topic: any)=>{
          console.log("토픽", topic)
        })
      })
    })
  }
}

export {
  receive 
}