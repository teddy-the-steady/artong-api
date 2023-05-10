import { SQS, SendMessageRequest } from "@aws-sdk/client-sqs";

const sqs = new SQS({region: 'ap-northeast-2'})
class Queue{
  pubMessage<T>(body: T) {
    const params: SendMessageRequest={
      MessageBody: JSON.stringify(body),
      QueueUrl: process.env.NOTIFICATION_QUEUE_URL 
    }
    
    try {
      return sqs.sendMessage(params)
    } catch (error) {
      throw error
    }
  }
}

export {
  Queue
}