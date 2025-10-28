import Header from "@/components/dashboard/Header";
import Content from "@/components/dashboard/Content";
import GoogleMapView from "@/components/dashboard/GoogleMapView";

export default function Home() {
    return (
        <div
            className="relative flex min-h-screen flex-col ">
            <Header/>
            <GoogleMapView/>
            <Content/>
        </div>
    );
}

