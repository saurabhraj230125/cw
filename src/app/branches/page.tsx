// src/app/branches/page.tsx
import { 
  Building2, MapPin, Phone, Plus, 
  Smartphone, Sparkles, LogOut, ChevronRight 
} from "lucide-react";
import Link from "next/link";

export default function SelectBranchPage() {
  // Mock data mimicking the provided image
  const branches = [
    {
      id: "br_1",
      name: "Ankur Branch",
      address: "Ahmedabad, Ahd., Gujarat, 380061",
      phone: "+91-9920867571",
      renewDate: "01 Jan, 2027",
    },
    {
      id: "br_2",
      name: "Kandivali Branch",
      address: "201 Growls, Mumbai, Maharashtra, 600040",
      phone: "+91-9920867571",
      renewDate: "31 Mar, 2027",
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      
      {/* 1. MINIMAL TOPBAR (Pre-Dashboard) */}
      <header className="glass h-[72px] shrink-0 border-b border-[var(--border)] flex items-center justify-between px-[32px]">
        <div className="flex items-center gap-[12px]">
          <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[var(--foreground)] text-white">
            <span className="text-sm font-black">CW</span>
          </div>
          <span className="text-lg font-bold text-[var(--foreground)] tracking-tight">CoachingWala</span>
        </div>
        
        <div className="flex items-center gap-[16px]">
          <span className="text-[14px] font-medium text-[var(--muted)]">Hi, Aman</span>
          <div className="h-8 w-px bg-[var(--border)]"></div>
          <button className="flex items-center gap-[8px] text-[14px] font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </header>

      {/* 2. MAIN CONTENT AREA */}
      <main className="page-container flex-1 py-[48px]">
        
        <div className="mb-[32px]">
          <h1 className="text-heading text-3xl">Select Your Branch</h1>
          <p className="text-muted mt-[8px]">Choose a workspace to continue to your dashboard.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[48px]">
          
          {/* LEFT COLUMN: Branch Cards (Takes up 2/3 of the grid) */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[24px]">
              
              {/* Loop through active branches */}
              {branches.map((branch) => (
                <div key={branch.id} className="card-premium card-hover flex flex-col h-full">
                  
                  {/* Card Header */}
                  <div className="flex items-center gap-[12px] mb-[24px]">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[var(--accent-hover)] text-[var(--accent)]">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <h2 className="text-[18px] font-bold text-[var(--foreground)]">{branch.name}</h2>
                  </div>

                  {/* Card Details */}
                  <div className="space-y-[12px] flex-1 mb-[32px]">
                    <div className="flex items-start gap-[12px]">
                      <MapPin className="h-4 w-4 text-[var(--muted)] shrink-0 mt-[2px]" />
                      <p className="text-[14px] font-medium text-[var(--muted)] leading-relaxed">
                        {branch.address}
                      </p>
                    </div>
                    <div className="flex items-center gap-[12px]">
                      <Phone className="h-4 w-4 text-[var(--muted)] shrink-0" />
                      <p className="text-[14px] font-medium text-[var(--muted)]">
                        {branch.phone}
                      </p>
                    </div>
                  </div>

                  {/* Card Actions & Footer */}
                  <div className="mt-auto">
                    <div className="flex items-center gap-[12px] mb-[24px]">
                      {/* Clicking this logs them into that specific dashboard */}
                      <Link href={`/dashboard?branch=${branch.id}`} className="button-primary flex-1">
                        Select Branch
                      </Link>
                      <button className="button-secondary px-[16px]">
                        Edit
                      </button>
                    </div>
                    <div className="border-t border-[var(--border)] pt-[16px]">
                      <p className="text-[12px] font-medium text-[var(--muted)] text-center">
                        Plan Renews: {branch.renewDate}
                      </p>
                    </div>
                  </div>

                </div>
              ))}

              {/* Add New Branch Card */}
              <button className="card-premium card-hover flex flex-col items-center justify-center min-h-[320px] border-dashed border-2 bg-[#F8FAFC]/50 group transition-colors hover:bg-white hover:border-[var(--accent)]">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm border border-[var(--border)] text-[var(--muted)] group-hover:text-[var(--accent)] group-hover:border-[var(--accent)] transition-colors mb-[16px]">
                  <Plus className="h-6 w-6" />
                </div>
                <h3 className="text-[16px] font-bold text-[var(--foreground)]">Add New Branch</h3>
                <p className="text-[13px] font-medium text-[var(--muted)] mt-[4px]">Expand your institute</p>
              </button>

            </div>
          </div>

          {/* RIGHT COLUMN: Updates & App (Takes up 1/3 of the grid) */}
          <div className="lg:col-span-1 space-y-[24px]">
            
            {/* Download App Section */}
            <div className="card-premium bg-[#F8FAFC] border-none text-center py-[32px]">
              <div className="flex justify-center mb-[16px]">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                  <Smartphone className="h-6 w-6 text-[var(--foreground)]" />
                </div>
              </div>
              <h3 className="text-[18px] font-bold text-[var(--foreground)] mb-[8px]">
                Get the CoachingWala App
              </h3>
              <p className="text-[14px] font-medium text-[var(--muted)] mb-[24px] px-[16px]">
                Manage your institute, track attendance, and collect fees from anywhere.
              </p>
              <div className="flex flex-col sm:flex-row gap-[12px] justify-center px-[24px]">
                <button className="flex-1 bg-[var(--foreground)] text-white h-[40px] rounded-[8px] text-[13px] font-bold flex items-center justify-center hover:bg-black transition-colors">
                  App Store
                </button>
                <button className="flex-1 bg-[var(--foreground)] text-white h-[40px] rounded-[8px] text-[13px] font-bold flex items-center justify-center hover:bg-black transition-colors">
                  Google Play
                </button>
              </div>
            </div>

            {/* What's New / Changelog Section */}
            <div className="card-premium">
              <div className="flex items-center gap-[8px] mb-[24px]">
                <Sparkles className="h-5 w-5 text-[var(--warning)]" />
                <h3 className="text-[16px] font-bold text-[var(--foreground)] uppercase tracking-wider">What's New</h3>
              </div>

              <div className="space-y-[24px]">
                {/* Update Item 1 */}
                <div className="group cursor-pointer">
                  <div className="flex items-center gap-[8px] mb-[4px]">
                    <span className="badge-success">New Feature</span>
                    <span className="text-[12px] font-medium text-[var(--muted)]">July 24, 2026</span>
                  </div>
                  <h4 className="text-[14px] font-bold text-[var(--foreground)] leading-snug group-hover:text-[var(--accent)] transition-colors">
                    Automated WhatsApp alerts for daily attendance
                  </h4>
                  <div className="flex items-center gap-[4px] mt-[8px] text-[12px] font-bold text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity">
                    Read more <ChevronRight className="h-3 w-3" />
                  </div>
                </div>

                <div className="h-px w-full bg-[var(--border)]"></div>

                {/* Update Item 2 */}
                <div className="group cursor-pointer">
                  <div className="flex items-center gap-[8px] mb-[4px]">
                    <span className="badge-warning">Improvement</span>
                    <span className="text-[12px] font-medium text-[var(--muted)]">July 18, 2026</span>
                  </div>
                  <h4 className="text-[14px] font-bold text-[var(--foreground)] leading-snug group-hover:text-[var(--accent)] transition-colors">
                    Faster loading speeds for the Student Directory
                  </h4>
                  <div className="flex items-center gap-[4px] mt-[8px] text-[12px] font-bold text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity">
                    Read more <ChevronRight className="h-3 w-3" />
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}