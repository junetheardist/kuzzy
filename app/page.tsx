import Header from "@/components/dashboard/Header";
import Content from "@/components/dashboard/Content";
import GoogleMapView from "@/components/dashboard/GoogleMapView";
import Provider from "@/redux/provider";

export default function Home() {
    return (
        <div
            className="relative flex min-h-screen flex-col ">
            <Header/>
            <GoogleMapView/>
            <Provider> <Content/> </Provider>
        </div>
    );
}

