import { Request } from 'express';

export interface IUser {
    id: number
    mail: string
    firstname: string
    lastname: string
    group: string
    phone: string
    role: string
    competencies: string[]
    createAt: Date
    updateAt: Date
}

export interface IUpdateUser {
    firstname: string
    lastname: string
    group: string
    phone: string
    aboutMe: string
    competencies: string[]
}

export interface RequestWithUser extends Request {
    user: {
      id: number;
      mail?: string;
      firstname?: string;
      lastname?: string;
    };
  }