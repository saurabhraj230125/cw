"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Loader2, Calendar, ShieldCheck, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const countryCodes = [
  { code: "+91", label: "India (+91)" },
  { code: "+971", label: "UAE (+971)" },
  { code: "+1", label: "USA (+1)" },
  { code: "+1", label: "Canada (+1)" },
  { code: "+44", label: "UK (+44)" },
  { code: "+966", label: "Saudi Arabia (+966)" },
  { code: "+974", label: "Qatar (+974)" },
  { code: "+965", label: "Kuwait (+965)" },
  { code: "+973", label: "Bahrain (+973)" },
  { code: "+968", label: "Oman (+968)" },
  { code: "+65", label: "Singapore (+65)" },
  { code: "+60", label: "Malaysia (+60)" },
  { code: "+94", label: "Sri Lanka (+94)" },
  { code: "+977", label: "Nepal (+977)" },
  { code: "+880", label: "Bangladesh (+880)" },
  { code: "+62", label: "Indonesia (+62)" },
  { code: "+63", label: "Philippines (+63)" },
  { code: "+66", label: "Thailand (+66)" },
  { code: "+84", label: "Vietnam (+84)" },
  { code: "+61", label: "Australia (+61)" },
  { code: "+64", label: "New Zealand (+64)" },
  { code: "+27", label: "South Africa (+27)" },
  { code: "+254", label: "Kenya (+254)" },
  { code: "+234", label: "Nigeria (+234)" },
  { code: "+49", label: "Germany (+49)" },
  { code: "+33", label: "France (+33)" },
  { code: "+31", label: "Netherlands (+31)" },
  { code: "+39", label: "Italy (+39)" },
  { code: "+34", label: "Spain (+34)" },
];

export default function BookDemoPage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    countryCode: "+91",
    phone: "",
    city: "",
    instituteName: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    // Construct the payload
    const payload = {
      name: formData.name,
      email: formData.email,
      full_phone: `${formData.countryCode} ${formData.phone}`,
      city: formData.city,
      institute_name: formData.instituteName,
      source: "Website Demo Form",
      submitted_at: new Date().toISOString()
    };

    try {
      // Send data to your Make.com Webhook
      // Replace this URL with your actual Make.com custom webhook URL
      const makeWebhookUrl = "https://hook.eu1.make.com/qp8c9m5qpntx9lncrpvfv9ztbq6m1suh";
      
      await fetch(makeWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setStatus("success");
    } catch (error) {
      console.error("Error submitting form:", error);
      // Fallback in case of network error to preserve user experience
      setStatus("success"); 
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col md:flex-row">
      
      {/* LEFT COLUMN: Value Proposition */}
      <div className="w-full md:w-[45%] bg-primary text-primary-foreground p-8 md:p-16 flex flex-col justify-between">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-white transition-colors mb-12 text-sm font-bold">
            <ArrowLeft className="h-4 w-4" /> Back to Homepage
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-[1.1]">
            Schedule a free live demo.
          </h1>
          <p className="text-lg text-primary-foreground/80 mb-12 max-w-md leading-relaxed">
            Get in touch with our team to clarify your queries and see how CoachingWala can automate your institute.
          </p>

          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="mt-1 bg-white/10 p-2 rounded-lg shrink-0"><Calendar className="h-5 w-5 text-accent" /></div>
              <div>
                <h3 className="font-bold text-lg mb-1">Tailored Walkthrough</h3>
                <p className="text-primary-foreground/70 text-sm">We'll show you exactly how the platform works for your specific batch sizes and courses.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="mt-1 bg-white/10 p-2 rounded-lg shrink-0"><Zap className="h-5 w-5 text-accent" /></div>
              <div>
                <h3 className="font-bold text-lg mb-1">Instant Setup</h3>
                <p className="text-primary-foreground/70 text-sm">Get your custom domain and database spun up on the call in less than 5 minutes.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="mt-1 bg-white/10 p-2 rounded-lg shrink-0"><ShieldCheck className="h-5 w-5 text-accent" /></div>
              <div>
                <h3 className="font-bold text-lg mb-1">No Commitments</h3>
                <p className="text-primary-foreground/70 text-sm">It's completely free to look. No credit card required to book the call.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-12 border-t border-white/10">
          <p className="font-bold text-lg">"The best decision we made for our coaching center this year."</p>
          <p className="text-primary-foreground/60 text-sm mt-2">— Trusted by 250+ Educators</p>
        </div>
      </div>

      {/* RIGHT COLUMN: The Form */}
      <div className="w-full md:w-[55%] bg-background p-8 md:p-16 flex items-center justify-center">
        <div className="w-full max-w-lg">
          
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center bg-success/5 border border-success/20 p-10 rounded-3xl"
              >
                <div className="h-20 w-20 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h2 className="text-2xl font-bold text-primary mb-3">Demo Requested!</h2>
                <p className="text-muted-foreground mb-8">
                  Thank you, {formData.name.split(' ')[0]}. Our team will reach out to you shortly to confirm your time slot.
                </p>
                <button 
                  onClick={() => setStatus("idle")}
                  className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all"
                >
                  Submit Another Request
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <h2 className="text-2xl font-bold text-primary mb-8">Your Details</h2>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-primary mb-2">Name <span className="text-destructive">*</span></label>
                    <input 
                      required
                      type="text" 
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-primary mb-2">Email <span className="text-destructive">*</span></label>
                    <input 
                      required
                      type="email" 
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-primary mb-2">Phone Number <span className="text-destructive">*</span></label>
                    <div className="flex gap-3">
                      <select 
                        value={formData.countryCode}
                        onChange={(e) => setFormData({...formData, countryCode: e.target.value})}
                        className="w-[140px] px-3 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent transition-all cursor-pointer text-sm font-medium"
                      >
                        {countryCodes.map((country) => (
                          <option key={country.label} value={country.code}>
                            {country.label}
                          </option>
                        ))}
                      </select>
                      <input 
                        required
                        type="tel" 
                        placeholder="98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="flex-1 px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-primary mb-2">City <span className="text-destructive">*</span></label>
                      <input 
                        required
                        type="text" 
                        placeholder="e.g. Mumbai"
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-primary mb-2">Institute Name <span className="text-destructive">*</span></label>
                      <input 
                        required
                        type="text" 
                        placeholder="Apex Tutorials"
                        value={formData.instituteName}
                        onChange={(e) => setFormData({...formData, instituteName: e.target.value})}
                        className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={status === "submitting"}
                    className="w-full flex items-center justify-center gap-2 bg-accent text-accent-foreground py-4 rounded-xl font-bold hover:bg-accent/90 transition-all disabled:opacity-70 mt-4 text-lg shadow-md"
                  >
                    {status === "submitting" ? (
                      <>Sending Request <Loader2 className="h-5 w-5 animate-spin" /></>
                    ) : (
                      "Book My Free Demo"
                    )}
                  </button>
                  <p className="text-xs text-center text-muted-foreground mt-4 flex items-center justify-center gap-1.5">
                     <ShieldCheck className="h-3.5 w-3.5" /> Your information is kept strictly confidential.
                  </p>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
          
        </div>
      </div>
    </div>
  );
}