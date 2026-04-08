import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import Navbar from "../components/Navbar";
import { Mail, Phone, MapPin } from "lucide-react";
import emailjs from "@emailjs/browser";
import { toast } from "sonner";
/* RATE LIMIT */
const RATE_LIMIT_TIME = 60 * 1000;
const ContactPage = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };
    /* ✅ VALIDATION (proper, not lazy) */
    const validate = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.name.trim())
            return "Full name is required";
        if (!emailRegex.test(formData.email))
            return "Please enter a valid email address";
        if (!formData.subject.trim())
            return "Subject is required";
        if (formData.message.trim().length < 10)
            return "Message must be at least 10 characters";
        return null;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        /* VALIDATION FIRST */
        const validationError = validate();
        if (validationError) {
            toast.error(validationError);
            return;
        }
        /* RATE LIMIT */
        const lastSent = localStorage.getItem("lastEmailTime");
        const now = Date.now();
        if (lastSent && now - Number(lastSent) < RATE_LIMIT_TIME) {
            toast.warning("Please wait a bit before sending another message.");
            return;
        }
        setLoading(true);
        try {
            console.log("📤 Sending form:", formData);
            /* ADMIN EMAIL */
            const adminRes = await emailjs.send("service_8dzzzxw", "template_zsw0ms1", {
                from_name: formData.name,
                from_email: formData.email,
                subject: formData.subject,
                message: formData.message,
            }, "bai7FJSKXRsPsOpJ3");
            /* AUTO REPLY */
            const clientRes = await emailjs.send("service_8dzzzxw", "template_zic101d", {
                to_name: formData.name,
                to_email: formData.email,
                subject: formData.subject,
            }, "bai7FJSKXRsPsOpJ3");
            console.log("✅ Admin:", adminRes.status, "Client:", clientRes.status);
            /* SUCCESS */
            toast.success("Your message has been sent successfully.");
            /* ✅ CLEAR FORM PROPERLY */
            setFormData({
                name: "",
                email: "",
                subject: "",
                message: "",
            });
            localStorage.setItem("lastEmailTime", now.toString());
        }
        catch (error) {
            console.error("❌ EmailJS Error:", error);
            toast.error("Failed to send message. Please try again.");
            /* DEBUGGING HELP */
            if (error?.text) {
                console.error("EmailJS details:", error.text);
            }
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "bg-[#001524] min-h-screen text-[#E9E6DD]", children: [_jsx(Navbar, {}), _jsx("section", { className: "max-w-7xl mx-auto px-6 lg:px-12 py-20", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-12 items-center", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-5xl font-bold leading-tight mb-6", children: ["Contact ", _jsx("span", { className: "text-[#F57251]", children: "VansKE" })] }), _jsx("p", { className: "text-lg text-[#C4AD9D] max-w-lg mb-10", children: "Whether you're making an inquiry, requesting assistance, or simply reaching out \u2014 our team is ready to help. Send us a message and we'll get back to you as soon as possible." }), _jsxs("div", { className: "bg-[#445048]/50 backdrop-blur p-6 rounded-2xl border border-[#445048] space-y-5 w-full lg:w-3/4", children: [_jsxs("div", { className: "flex items-start space-x-4", children: [_jsx(Phone, { className: "text-[#027480]" }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold", children: "Phone" }), _jsx("p", { className: "text-[#C4AD9D] text-sm", children: "+254 112 178 578" }), _jsx("p", { className: "text-[#C4AD9D] text-sm", children: "+254 733 348 027" })] })] }), _jsxs("div", { className: "flex items-start space-x-4", children: [_jsx(Mail, { className: "text-[#027480]" }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold", children: "Email" }), _jsx("p", { className: "text-[#C4AD9D] text-sm", children: "vanzzyspinet@gmail.com" }), _jsx("p", { className: "text-[#C4AD9D] text-sm", children: "mathengevan@gmail.com" })] })] }), _jsxs("div", { className: "flex items-start space-x-4", children: [_jsx(MapPin, { className: "text-[#027480]" }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold", children: "Location" }), _jsx("p", { className: "text-[#C4AD9D] text-sm", children: "Nairobi, Kenya" })] })] })] })] }), _jsx("div", { children: _jsxs("form", { onSubmit: handleSubmit, className: "bg-[#001524] border border-[#445048] p-10 rounded-2xl shadow-xl", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm mb-2 font-semibold", children: "Full Name" }), _jsx("input", { type: "text", name: "name", value: formData.name, onChange: handleChange, className: "w-full p-3 rounded-xl bg-[#445048]" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm mb-2 font-semibold", children: "Email Address" }), _jsx("input", { type: "email", name: "email", value: formData.email, onChange: handleChange, className: "w-full p-3 rounded-xl bg-[#445048]" })] })] }), _jsxs("div", { className: "mt-6", children: [_jsx("label", { className: "block text-sm mb-2 font-semibold", children: "Subject" }), _jsx("input", { type: "text", name: "subject", value: formData.subject, onChange: handleChange, className: "w-full p-3 rounded-xl bg-[#445048]" })] }), _jsxs("div", { className: "mt-6", children: [_jsx("label", { className: "block text-sm mb-2 font-semibold", children: "Your Message" }), _jsx("textarea", { name: "message", rows: 5, value: formData.message, onChange: handleChange, className: "w-full p-3 rounded-xl bg-[#445048]" })] }), _jsx("button", { type: "submit", disabled: loading, className: "w-full mt-8 py-4 rounded-xl bg-[#027480] hover:bg-[#F57251]", children: loading ? "Sending..." : "Send Message" })] }) })] }) })] }));
};
export default ContactPage;
