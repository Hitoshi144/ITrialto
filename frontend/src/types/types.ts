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
    createdAt: string
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
}