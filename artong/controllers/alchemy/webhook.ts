const receive = async function (body: any) {
  const logs = body.event.data.block.logs
  if(logs instanceof Array) {
    logs.map((log)=>{
      console.log("트랜잭션 발생!!",log.transaction)
    })
  }
}

export {
  receive 
}