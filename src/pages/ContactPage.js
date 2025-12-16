import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// pages/ContactPage.tsx
import { useState } from "react";
import Navbar from "../components/Navbar";
import { Mail, Phone, MapPin } from "lucide-react";
const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
        alert("Thank you! Your message has been sent.");
        setFormData({ name: "", email: "", subject: "", message: "" });
    };
    return (_jsxs("div", { className: "bg-[#001524] min-h-screen text-[#E9E6DD]", children: [_jsx(Navbar, {}), _jsx("section", { className: "max-w-7xl mx-auto px-6 lg:px-12 py-20", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-12 items-center", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-5xl font-bold leading-tight mb-6", children: ["Contact ", _jsx("span", { className: "text-[#F57251]", children: "VansKE" })] }), _jsx("p", { className: "text-lg text-[#C4AD9D] max-w-lg mb-10", children: "Whether you're making an inquiry, requesting assistance, or simply reaching out \u2014 our team is ready to help. Send us a message and we'll get back to you as soon as possible." }), _jsxs("div", { className: "bg-[#445048]/50 backdrop-blur p-6 rounded-2xl border border-[#445048] space-y-5 w-full lg:w-3/4", children: [_jsxs("div", { className: "flex items-start space-x-4", children: [_jsx(Phone, { className: "text-[#027480]" }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold", children: "Phone" }), _jsx("p", { className: "text-[#C4AD9D] text-sm", children: "+254 112 178 578" }), _jsx("p", { className: "text-[#C4AD9D] text-sm", children: "+254 733 348 027" })] })] }), _jsxs("div", { className: "flex items-start space-x-4", children: [_jsx(Mail, { className: "text-[#027480]" }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold", children: "Email" }), _jsx("p", { className: "text-[#C4AD9D] text-sm", children: "info@vanske.com" }), _jsx("p", { className: "text-[#C4AD9D] text-sm", children: "bookings@vanske.com" })] })] }), _jsxs("div", { className: "flex items-start space-x-4", children: [_jsx(MapPin, { className: "text-[#027480]" }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold", children: "Location" }), _jsx("p", { className: "text-[#C4AD9D] text-sm", children: "Nairobi, Kenya" })] })] })] })] }), _jsx("div", { children: _jsxs("form", { onSubmit: handleSubmit, className: "bg-[#001524] border border-[#445048] p-10 rounded-2xl shadow-xl", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm mb-2 font-semibold", children: "Full Name" }), _jsx("input", { type: "text", name: "name", value: formData.name, onChange: handleChange, required: true, className: "w-full p-3 rounded-xl bg-[#445048] text-[#E9E6DD] placeholder-[#C4AD9D] focus:outline-none focus:ring-2 focus:ring-[#027480]", placeholder: "Enter your name" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm mb-2 font-semibold", children: "Email Address" }), _jsx("input", { type: "email", name: "email", value: formData.email, onChange: handleChange, required: true, className: "w-full p-3 rounded-xl bg-[#445048] text-[#E9E6DD] placeholder-[#C4AD9D] focus:outline-none focus:ring-2 focus:ring-[#027480]", placeholder: "you@example.com" })] })] }), _jsxs("div", { className: "mt-6", children: [_jsx("label", { className: "block text-sm mb-2 font-semibold", children: "Subject" }), _jsx("input", { type: "text", name: "subject", value: formData.subject, onChange: handleChange, required: true, className: "w-full p-3 rounded-xl bg-[#445048] text-[#E9E6DD] placeholder-[#C4AD9D] focus:outline-none focus:ring-2 focus:ring-[#027480]", placeholder: "Message subject" })] }), _jsxs("div", { className: "mt-6", children: [_jsx("label", { className: "block text-sm mb-2 font-semibold", children: "Your Message" }), _jsx("textarea", { name: "message", value: formData.message, onChange: handleChange, required: true, rows: 5, className: "w-full p-3 rounded-xl bg-[#445048] text-[#E9E6DD] placeholder-[#C4AD9D] focus:outline-none focus:ring-2 focus:ring-[#027480]", placeholder: "Write your message here..." })] }), _jsx("button", { type: "submit", className: "w-full mt-8 py-4 rounded-xl bg-[#027480] text-[#E9E6DD] font-semibold hover:bg-[#F57251] transition-all duration-300", children: "Send Message" })] }) })] }) })] }));
};
export default ContactPage;
