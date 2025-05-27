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
    competencies: string[]
    leaderOfTeams: number[]
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
    competencies: string[]
    leaderOfTeams: number[]
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
    competencies: string[]
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

export interface IProjects {
    id: number
    title: string
    problem: string
    solution: string
    expectedResult: string
    customer: string
    status: string
    userId: number
    teamId: number
    createdAt: string
    comment: string
    stack: string
    rialtoId: number
    maxPeopleNumber: string
    recruitment: string
}

export interface IRialto {
    id: number
    title: string
    projects: IProjects[]
}

export interface IToProjectRequest {
    id: number
    teamId: number
    team: ITeam
    projectId: number
    project: IProjects
    status: string
    createdAt: string
}

export interface INotification {
    id: string
    type: 'message' | 'system' | 'alert'
    message: string
    timestamp: string
}

export interface SocketError {
    message: string
    code?: number
}