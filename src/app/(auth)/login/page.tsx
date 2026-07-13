import { login } from '@/features/auth/actions'

export default function LoginPage() {
  return (
    <form action={login} className="mx-auto mt-24 max-w-sm space-y-4">
      <h1 className="text-xl font-semibold">Log in</h1>
      <input name="email" type="email" required placeholder="Email" className="w-full rounded border px-3 py-2" />
      <input name="password" type="password" required placeholder="Password" className="w-full rounded border px-3 py-2" />
      <button type="submit" className="w-full rounded bg-black py-2 text-white">Log in</button>
    </form>
  )
}