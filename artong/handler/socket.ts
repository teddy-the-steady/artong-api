
const connect = async (event: any) => {
  console.log('connect event', event)
}

const disconenct = async (event: any) => {
  console.log('disconnect event')
}
export {
  connect,
  disconenct
}