import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Mail, Phone, MapPin } from "lucide-react";
import emailjs from "@emailjs/browser";
import { toast } from "sonner";

/* RATE LIMIT */
const RATE_LIMIT_TIME = 60 * 1000;

const ContactPage: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /* ✅ VALIDATION (proper, not lazy) */
  const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) return "Full name is required";
    if (!emailRegex.test(formData.email))
      return "Please enter a valid email address";
    if (!formData.subject.trim()) return "Subject is required";
    if (formData.message.trim().length < 10)
      return "Message must be at least 10 characters";

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
      const adminRes = await emailjs.send(
        "service_8dzzzxw",
        "template_zsw0ms1",
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
        "bai7FJSKXRsPsOpJ3",
      );

      /* AUTO REPLY */
      const clientRes = await emailjs.send(
        "service_8dzzzxw",
        "template_zic101d",
        {
          to_name: formData.name,
          to_email: formData.email,
          subject: formData.subject,
        },
        "bai7FJSKXRsPsOpJ3",
      );

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
    } catch (error: any) {
      console.error("❌ EmailJS Error:", error);

      toast.error("Failed to send message. Please try again.");

      /* DEBUGGING HELP */
      if (error?.text) {
        console.error("EmailJS details:", error.text);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#001524] min-h-screen text-[#E9E6DD]">
      <Navbar />

      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* LEFT SIDE (UNCHANGED) */}
          <div>
            <h1 className="text-5xl font-bold leading-tight mb-6">
              Contact <span className="text-[#F57251]">VansKE</span>
            </h1>

            <p className="text-lg text-[#C4AD9D] max-w-lg mb-10">
              Whether you're making an inquiry, requesting assistance, or simply
              reaching out — our team is ready to help. Send us a message and
              we'll get back to you as soon as possible.
            </p>

            <div className="bg-[#445048]/50 backdrop-blur p-6 rounded-2xl border border-[#445048] space-y-5 w-full lg:w-3/4">
              <div className="flex items-start space-x-4">
                <Phone className="text-[#027480]" />
                <div>
                  <p className="font-semibold">Phone</p>
                  <p className="text-[#C4AD9D] text-sm">+254 112 178 578</p>
                  <p className="text-[#C4AD9D] text-sm">+254 733 348 027</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Mail className="text-[#027480]" />
                <div>
                  <p className="font-semibold">Email</p>
                  <p className="text-[#C4AD9D] text-sm">
                    vanzzyspinet@gmail.com
                  </p>
                  <p className="text-[#C4AD9D] text-sm">
                    mathengevan@gmail.com
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <MapPin className="text-[#027480]" />
                <div>
                  <p className="font-semibold">Location</p>
                  <p className="text-[#C4AD9D] text-sm">Nairobi, Kenya</p>
                </div>
              </div>
            </div>
          </div>

          {/* FORM */}
          <div>
            <form
              onSubmit={handleSubmit}
              className="bg-[#001524] border border-[#445048] p-10 rounded-2xl shadow-xl"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm mb-2 font-semibold">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl bg-[#445048]"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 font-semibold">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl bg-[#445048]"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm mb-2 font-semibold">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl bg-[#445048]"
                />
              </div>

              <div className="mt-6">
                <label className="block text-sm mb-2 font-semibold">
                  Your Message
                </label>
                <textarea
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl bg-[#445048]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-8 py-4 rounded-xl bg-[#027480] hover:bg-[#F57251]"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
