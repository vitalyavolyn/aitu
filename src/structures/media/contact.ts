import { Media, ImagePayload } from '.'

export interface Avatar {
  full: ImagePayload
  small: ImagePayload
}

export interface UnregisteredContactPayload {
  type: 'UnregisteredContact'
  firstName?: string
  lastName?: string
  phoneNumber?: string
}

export interface User extends UnregisteredContactPayload {
  userName: string
  avatar: Avatar
}

export interface RegisteredContactPayload {
  type: 'RegisteredContact'
  user: User
}

export type ContactMediaPayload = RegisteredContactPayload | UnregisteredContactPayload
export type ContactMediaType = ContactMediaPayload['type']

export class ContactMedia<
  P extends ContactMediaPayload, Type extends ContactMediaType = ContactMediaType
> extends Media<P, Type> {
  public get isRegistered (): boolean {
    return this.type === 'RegisteredContact'
  }

  public get firstName (): string {
    return this.isRegistered
      ? (this.payload as RegisteredContactPayload).user.firstName!
      : (this.payload as UnregisteredContactPayload).firstName!
  }

  public get lastName (): string {
    return this.isRegistered
      ? (this.payload as RegisteredContactPayload).user.lastName!
      : (this.payload as UnregisteredContactPayload).lastName!
  }

  public get phoneNumber (): string {
    return this.isRegistered
      ? (this.payload as RegisteredContactPayload).user.phoneNumber!
      : (this.payload as UnregisteredContactPayload).phoneNumber!
  }

  public get userName (): string | undefined {
    return this.isRegistered
      ? (this.payload as RegisteredContactPayload).user.userName!
      : undefined
  }

  public get avatar (): Avatar | undefined {
    return this.isRegistered
      ? (this.payload as RegisteredContactPayload).user.avatar!
      : undefined
  }

  public get user (): User | undefined {
    return this.isRegistered
      ? (this.payload as RegisteredContactPayload).user!
      : undefined
  }
}
