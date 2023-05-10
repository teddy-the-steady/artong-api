type SocketBody = {
  action: string;
  connectorId: number;
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