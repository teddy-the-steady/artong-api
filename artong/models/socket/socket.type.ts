type SocketBody = {
  action: string;
  data: {
    connectorId: number;
  }
}
type CreateSocketConnectionBody = {
  connectorId: number; 
  connectionId: string; 
}

export {
  SocketBody,
  CreateSocketConnectionBody
}