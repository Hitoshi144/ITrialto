export interface IUserData {
    firstname: string,
    lastname: string,
    group: string,
    mail: string,
    password: string
    role: string
}

export interface IUserAuthData {
    mail: string,
    password: string
}

export interface IResponse {
    id: number
    mail: string
    firstname: string
    lastname: string
    group: string
    phone: string
    role: string
    aboutMe: string
    createAt: string
    updateAt: string
    token: string
}

export interface IUser {
    id: number
    mail: string
    firstname: string
    lastname: string
    group: string
    phone: string
    role: string
    aboutMe: string
    hasAvatar?: boolean
}

export interface IUserProfile {
    id: number
    mail: string
    firstname: string
    lastname: string
    phone: string
    role: string
    group: string
    createAt: string
    aboutMe: string
}

export interface IUserUpdate {
    firstname: string
    lastname: string
    phone: string
    group: string
    aboutMe: string
}

export interface ITeam {
    id: number
    title: string
    description: string
    teamLeaderId: number
    members: Array<string>
    status: string
    createdAt: string
    currentProjectId: number
}

export interface ITeamRequests {
    id: number
    user: IUser
    userId: number
    team: ITeam
    teamId: number
    status: string
    createdAt: string
}

export interface ICreateTeamRequest {
    id: number
    title: string
    description: string
    creatorId: number
    status: string
    createdAt: string
}