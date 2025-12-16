import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';
const PublicLayout = () => (_jsxs("div", { className: "min-h-screen flex flex-col bg-[#E9E6DD]", children: [_jsx("main", { className: "flex-grow", children: _jsx(Outlet, {}) }), _jsx(Footer, {})] }));
export default PublicLayout;
