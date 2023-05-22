import { PoolClient } from "pg";
import Models from "../Models";
import * as db from "../../utils/db/db";
import { IsDate, IsInt, IsString } from "class-validator";
import { ApiGatewayManagementApi } from "@aws-sdk/client-apigatewaymanagementapi";
import { InternalServerError } from "../../utils/error/errors";
import { CreateSocketConnectionBody, SelectSocketConnecitonBody } from "./socket.type";

const insertSocketConnection = require('./insertSocketConnection.sql')
const selectSocketConnection = require('./selectSocketConnection.sql')
const deleteSocketConnection = require('./deleteSocketConnection.sql')
class Socket extends Models {
  @IsInt()
  connector_id!: number;
  @IsString()
  connection_id!: string;
  @IsString()
  domain_name!: string;
  @IsString()
  stage!: string;

  constructor(data: Partial<Socket> = {}, conn: PoolClient) {
    super(conn);
    Object.assign(this, data);
  }

  async sendMessageToClient(endpoint: string, connectionId: string, payload: {data: {} | {}[]}) {
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

  async deleteSocketConnection(connectionId: string) {
    try {
      const result = await db.execute(this.conn, deleteSocketConnection, { connectionId })

      return result[0]
    } catch (error) {
      throw new InternalServerError(error, null)
    }
  }

  async selectSocketConnection({connectorId}: SelectSocketConnecitonBody): Promise<Socket> {
    try {
      const result = await db.execute(this.conn,selectSocketConnection, { connectorId })

      return result[0]
    } catch (error) { 
      throw new InternalServerError(error, null)
    }
  }

  getEndpoint(domainName: string, stage: string) {
  return process.env.IS_OFFLINE? 'http://localhost:3001' : `https://${domainName}/${stage}`
  }
}

export {
  Socket
}