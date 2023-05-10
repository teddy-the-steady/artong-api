import { PoolClient } from "pg";
import Models from "../Models";
import { IsInt, IsString } from "class-validator";
import { ApiGatewayManagementApi } from "@aws-sdk/client-apigatewaymanagementapi";
import { InternalServerError } from "../../utils/error/errors";

class Socket extends Models {
  @IsInt()
  connectorId!: number;
  @IsString()
  connectionId!: string;

  constructor(data: Partial<Socket> = {}, conn: PoolClient) {
    super(conn);
    Object.assign(this, data);
  }

  async sendMessageToClient(endpoint: string, connectionId: string, payload: {}[]) {
      const apiGatewayManagementApi = new ApiGatewayManagementApi({ apiVersion: '2018-11-29', endpoint })
      const encoder = new TextEncoder()

      try{
        return await apiGatewayManagementApi.postToConnection({
          ConnectionId: connectionId,
          Data: encoder.encode(JSON.stringify(payload))
        })
      }catch(error){
        throw new InternalServerError(error, null)
      }
    }
}

export {
  Socket 
}