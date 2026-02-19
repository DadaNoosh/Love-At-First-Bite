import { loginAction } from '@/app/actions';

export default function LoginPage() {
  return (
    <main className="mx-auto mt-20 max-w-sm rounded-xl bg-white p-6 shadow">
      <h1 className="mb-4 text-xl font-bold">Love At First Bite – Ops</h1>
      <form action={loginAction} className="space-y-3">
        <input name="password" type="password" placeholder="Password" className="w-full" />
        <button className="w-full bg-slate-900 text-white" type="submit">Sign in</button>
      </form>
    </main>
  );
}
