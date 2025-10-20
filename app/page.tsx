import UserMap from "@/components/dashboard/UserMap";
import Header from "@/components/dashboard/Header";
import Content from "@/components/dashboard/Content";

export default function Home() {
    return (
        <div
            className="relative flex min-h-screen flex-col ">
            <Header/>
            <UserMap/>
            <Content/>
        </div>
    );
}

