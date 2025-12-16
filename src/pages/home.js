import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
//import Header from '../components/Header';
import Hero from '../components/Hero';
import VehicleShowcase from '../components/VehicleShowcase';
import Services from '../components/Services';
import Stats from '../components/Stats';
import Navbar from '../components/Navbar';
const Home = () => {
    return (_jsxs("main", { children: [_jsx(Navbar, {}), _jsx(Hero, {}), _jsx(VehicleShowcase, {}), _jsx(Services, {}), _jsx(Stats, {})] }));
};
export default Home;
