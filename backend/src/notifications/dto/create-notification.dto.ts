export class CreateNotificationDto {
    type: 'message' | 'system' | 'alert' | 'teamJoinRequest'

    message: string

    fromUserId: number
    
    toUserId: number

    teamId?: number

    projectId: number

}
