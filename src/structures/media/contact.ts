import { Media } from '.'
import {
  ContactMediaPayload,
  ContactMediaType,
  RegisteredContact,
  UnregisteredContact,
  Avatar,
  User
} from '../../interfaces'

export class ContactMedia<
  P extends ContactMediaPayload, Type extends ContactMediaType = ContactMediaType
> extends Media<P, Type> {
  public get isRegistered (): boolean {
    return this.type === 'RegisteredContact'
  }

  public get firstName (): string {
    return this.isRegistered
      ? (this.payload as RegisteredContact).user.firstName!
      : (this.payload as UnregisteredContact).firstName!
  }

  public get lastName (): string {
    return this.isRegistered
      ? (this.payload as RegisteredContact).user.lastName!
      : (this.payload as UnregisteredContact).lastName!
  }

  public get phoneNumber (): string {
    return this.isRegistered
      ? (this.payload as RegisteredContact).user.phoneNumber!
      : (this.payload as UnregisteredContact).phoneNumber!
  }

  public get userName (): string | undefined {
    return this.isRegistered
      ? (this.payload as RegisteredContact).user.userName!
      : undefined
  }

  public get avatar (): Avatar | undefined {
    return this.isRegistered
      ? (this.payload as RegisteredContact).user.avatar!
      : undefined
  }

  public get user (): User | undefined {
    return this.isRegistered
      ? (this.payload as RegisteredContact).user!
      : undefined
  }
}
