import type { User } from '@prisma/client'
import { db } from 'src/lib/db'

export const createOrUpdateUser = async ({
  id,
  email,
  firstName,
  lastName,
  imageUrl,
}: Partial<User>) => {
  return db.user.upsert({
    where: { id },
    create: {
      id,
      email,
      firstName,
      lastName,
      imageUrl,
    },
    update: {
      email,
      firstName,
      lastName,
      imageUrl,
    },
  })
}

export const getUser = async ({ id }: { id: string }) => {
  return db.user.findUnique({
    where: { id },
  })
}

export const user = ({ id }: { id: string }) => {
  return db.user.findUnique({
    where: { id },
  })
}

export const currentUser = () => {
  return db.user.findUnique({
    where: { id: context.currentUser.id },
  })
}