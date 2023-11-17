import LoginBtn from "../components/loginbtn.tsx";

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex flex-1 p-4 md:p-8 pt-5 items-center justify-center">
        <LoginBtn />
      </main>
    </div>
  );
}
