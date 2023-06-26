const receive = async function (body: any) {
  console.log("원문:",body)
  console.log("이벤트:",body.event.data.block)
}

export {
  receive 
}