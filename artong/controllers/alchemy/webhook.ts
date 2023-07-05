const receive = async function (body: any) {
  const logs = body.event.data.block.logs
  if(logs instanceof Array) {
    console.log('logs===>',logs)
    logs.map((log)=>{
      console.log("log transaction===>",log.transaction)

      log.transaction.logs.map((subLog: any)=>{
        console.log("subLog", subLog)

        subLog.topics.map((topic: any)=>{
          console.log("topic", topic)
        })
      })
    })
  }
}

export {
  receive 
}