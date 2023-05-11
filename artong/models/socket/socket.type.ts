type SocketBody = {
  action: string;
  data: {
    connectorId: number;
  }
}
type CreateSocketConnectionBody = {
  connectorId: number; 
  connectionId: string;
  domainName: string;
  stage: string;
}
type SelectSocketConnecitonBody = {
  connectorId: number;
}
export {
  SocketBody,
  CreateSocketConnectionBody,
  SelectSocketConnecitonBody
}