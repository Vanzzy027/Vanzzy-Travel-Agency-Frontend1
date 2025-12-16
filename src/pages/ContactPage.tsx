// pages/ContactPage.tsx
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Mail, Phone, MapPin } from "lucide-react";

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);

    alert("Thank you! Your message has been sent.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="bg-[#001524] min-h-screen text-[#E9E6DD]">
      <Navbar />

      {/* HEADER SECTION */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* LEFT: TEXT */}
          <div>
            <h1 className="text-5xl font-bold leading-tight mb-6">
              Contact <span className="text-[#F57251]">VansKE</span>
            </h1>

            <p className="text-lg text-[#C4AD9D] max-w-lg mb-10">
              Whether you're making an inquiry, requesting assistance, or simply
              reaching out — our team is ready to help. Send us a message and
              we'll get back to you as soon as possible.
            </p>

            {/* MINI CONTACT INFO CARD */}
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
                  <p className="text-[#C4AD9D] text-sm">info@vanske.com</p>
                  <p className="text-[#C4AD9D] text-sm">bookings@vanske.com</p>
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

          {/* RIGHT: CONTACT FORM */}
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
                    required
                    className="w-full p-3 rounded-xl bg-[#445048] text-[#E9E6DD] placeholder-[#C4AD9D] focus:outline-none focus:ring-2 focus:ring-[#027480]"
                    placeholder="Enter your name"
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
                    required
                    className="w-full p-3 rounded-xl bg-[#445048] text-[#E9E6DD] placeholder-[#C4AD9D] focus:outline-none focus:ring-2 focus:ring-[#027480]"
                    placeholder="you@example.com"
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
                  required
                  className="w-full p-3 rounded-xl bg-[#445048] text-[#E9E6DD] placeholder-[#C4AD9D] focus:outline-none focus:ring-2 focus:ring-[#027480]"
                  placeholder="Message subject"
                />
              </div>

              <div className="mt-6">
                <label className="block text-sm mb-2 font-semibold">
                  Your Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full p-3 rounded-xl bg-[#445048] text-[#E9E6DD] placeholder-[#C4AD9D] focus:outline-none focus:ring-2 focus:ring-[#027480]"
                  placeholder="Write your message here..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full mt-8 py-4 rounded-xl bg-[#027480] text-[#E9E6DD] font-semibold hover:bg-[#F57251] transition-all duration-300"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;


// // pages/ContactPage.tsx
// import React, { useState } from "react";

// const ContactPage: React.FC = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     subject: "",
//     message: "",
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log("Form submitted:", formData);

//     // Later we will replace this with an API call → Nodemailer backend
//     alert("Thank you! Your message has been sent.");
//     setFormData({ name: "", email: "", subject: "", message: "" });
//   };

//   return (
//     <section className="min-h-screen bg-[#E9E6DD] py-20">
//       <div className="max-w-4xl mx-auto px-6">
        
//         <h2 className="text-4xl font-bold text-center text-[#001524] mb-6">
//           Contact Us
//         </h2>
//         <p className="text-center text-[#445048] text-lg mb-12 max-w-2xl mx-auto">
//           Have a question, need assistance, or want to make a special request?
//           We're here to help — just drop us a message.
//         </p>

//         <form
//           onSubmit={handleSubmit}
//           className="bg-[#001524] p-10 rounded-2xl shadow-lg"
//         >
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-[#E9E6DD] mb-2 font-semibold">Full Name</label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 required
//                 className="w-full p-3 rounded-xl bg-[#445048] text-[#E9E6DD] focus:outline-none focus:ring-2 focus:ring-[#027480]"
//                 placeholder="Enter your name"
//               />
//             </div>

//             <div>
//               <label className="block text-[#E9E6DD] mb-2 font-semibold">Email Address</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//                 className="w-full p-3 rounded-xl bg-[#445048] text-[#E9E6DD] focus:outline-none focus:ring-2 focus:ring-[#027480]"
//                 placeholder="you@example.com"
//               />
//             </div>
//           </div>

//           <div className="mt-6">
//             <label className="block text-[#E9E6DD] mb-2 font-semibold">Subject</label>
//             <input
//               type="text"
//               name="subject"
//               value={formData.subject}
//               onChange={handleChange}
//               required
//               className="w-full p-3 rounded-xl bg-[#445048] text-[#E9E6DD] focus:outline-none focus:ring-2 focus:ring-[#027480]"
//               placeholder="Message subject"
//             />
//           </div>

//           <div className="mt-6">
//             <label className="block text-[#E9E6DD] mb-2 font-semibold">Your Message</label>
//             <textarea
//               name="message"
//               value={formData.message}
//               onChange={handleChange}
//               required
//               rows={5}
//               className="w-full p-3 rounded-xl bg-[#445048] text-[#E9E6DD] focus:outline-none focus:ring-2 focus:ring-[#027480]"
//               placeholder="Write your message here..."
//             ></textarea>
//           </div>

//           <button
//             type="submit"
//             className="w-full mt-8 py-4 rounded-xl bg-[#027480] text-[#E9E6DD] font-semibold hover:bg-[#F57251] transition-all duration-300"
//           >
//             Send Message
//           </button>
//         </form>
//       </div>
//     </section>
//   );
// };

// export default ContactPage;
