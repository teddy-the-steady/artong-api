import { IsEnum, IsIn, IsInt, IsString } from "class-validator";
import { NotificationCategory } from "../../../models/notification/Notification";

class CreateNotificationDto {
  @IsEnum(NotificationCategory)
  category!: NotificationCategory;
  @IsInt()
  sender_id!: number;
  @IsInt()
  receiver_id!: number;
  @IsString()
  content!: string;
  @IsString()
  redirect_on_click!: string;
}

export { CreateNotificationDto };
