import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export default function Navbar() {
  return (
    <div className="bg-slate-200 text-white p-5 mb-5">
        <div className="flex items-center gap-2 justify-center">
            <Button>
                <Link to={'/agenda'}>Agenda</Link>
            </Button>
        </div>
    </div>
  )
}
