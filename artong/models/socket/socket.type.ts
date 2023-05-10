type SocketBody = {
  action: string;
  data: {
    connectorId: number;
  }
}
type CreateSocketConnectionBody = {
  connectorId: number; 
  connectionId: string; 
  created_at: Date;
}

export {
  SocketBody,
  CreateSocketConnectionBody
}