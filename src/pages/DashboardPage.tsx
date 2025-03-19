import { toast } from "sonner";

const DashboardPage = () => {
  return (
    <main className="grid place-content-center min-h-[calc(100vh-64.8px)]">
      <div className="text-xl">Welcome to dashboard</div>

      <button onClick={() => toast.success("lol")}>toast</button>
    </main>
  );
};

export default DashboardPage;
