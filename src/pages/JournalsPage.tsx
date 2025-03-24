import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const JournalsPage = () => {
  return (
    <main>
      JournalsPage
      <br />
      <Link to="/dashboard/journals/create">
        <Button className="mt-4">New Journal</Button>
      </Link>
    </main>
  );
};
export default JournalsPage;
