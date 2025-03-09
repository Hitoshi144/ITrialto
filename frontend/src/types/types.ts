export interface IUserData {
    firstname: string,
    lastname: string,
    group: string,
    mail: string,
    password: string
}

export interface IResponse {
    mail: string | undefined,
    password: string | undefined,
    createdAt: string | undefined,
    updatedAt: string | undefined,
    __v?: number | undefined,
    _id?: string | undefined,
    message: string | undefined,
}