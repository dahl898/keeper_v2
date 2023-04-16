interface TNote {
  _id?: string,
  title: string,
  content: string
}

interface TAccount {
  _id?: string,
  username: string | undefined,
  notes: TNote[]
}

interface TUser {
  _id?: string,
  username: string,
  hash: string,
  salt: string
}

export type {TNote, TAccount, TUser}