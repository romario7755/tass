import { getServerSession as nextAuthGetServerSession } from "next-auth"
import { authOptions } from "./auth"

export async function getServerSession() {
  const session = await nextAuthGetServerSession(authOptions)

  return session
}