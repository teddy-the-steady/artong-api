import { PoolClient } from "pg";
import Models from "../Models";
import * as db from "../../utils/db/db";
import { IsDate, IsInt, IsString } from "class-validator";
import { ApiGatewayManagementApi } from "@aws-sdk/client-apigatewaymanagementapi";
import { InternalServerError } from "../../utils/error/errors";
import { CreateSocketConnectionBody } from "./socket.type";

const insertSocketConnection = require('./insertSocketConnection.sql')
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

  async createSocketConnection(data: CreateSocketConnectionBody) {
    try {
      const result = await db.execute(this.conn,insertSocketConnection, data)

      return result[0]
    } catch (error) {
      throw new InternalServerError(error, null)
    }
  }
}

export {
  Socket
}