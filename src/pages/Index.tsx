
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import { TrendingUp } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [hasResults, setHasResults] = useState(false);

  useEffect(() => {
    // Check if user has previous results
    try {
      const progress = localStorage.getItem("bsa-progress");
      setHasResults(progress ? Object.keys(JSON.parse(progress)).length > 0 : false);
    } catch {
      setHasResults(false);
    }
    
    // Prefetch font rendering by touching tokens via a tiny style read
    void getComputedStyle(document.documentElement).getPropertyValue("--primary");
  }, []);

  return (
    <>
      <SEO
        title="BSA | แบบประเมินความเหมาะสมทางธุรกิจ"
        description="ทำแบบประเมิน 4 หมวด เพื่อค้นหา Top 3 ประเภทธุรกิจที่เหมาะกับคุณ"
      />
      <main className="min-h-screen flex items-center justify-center bg-background bg-gradient-to-br from-background via-background to-primary/5 py-8">
        <section className="w-full max-w-xl p-6 sm:p-8 -mt-16">
          <header className="mb-8 text-center animate-fade-in">
            <div className="flex items-center justify-center gap-2 mb-3">
              <p className="text-sm text-muted-foreground font-medium">Business Suitability Assessment</p>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              แบบประเมินความเหมาะสมทางธุรกิจ
            </h1>
          </header>
          
          <article className="relative group animate-scale-in">
            {/* Background glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            
            {/* Main card */}
            <div className="relative rounded-xl bg-card/95 backdrop-blur-sm border border-border/50 p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-500">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3 text-foreground">ค้นพบ DNA ทางธุรกิจของคุณ</h2>
                <p className="text-muted-foreground leading-relaxed">
                  ผ่านแบบทดสอบ 4 หมวดหลัก เพื่อหาประเภทธุรกิจที่เหมาะสมที่สุด และตัดสินใจได้อย่างมั่นใจ
                </p>
              </div>

              <div className="space-y-3">
                <Button 
                  size="lg" 
                  className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground hover:scale-105 transition-transform duration-200 font-medium" 
                  onClick={() => navigate("/survey")}
                > 
                  <TrendingUp className="mr-2 h-5 w-5" />
                  เริ่มประเมิน DNA ทางธุรกิจ
                </Button>
                {hasResults && (
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="w-full border-primary/30 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors duration-200" 
                    onClick={() => navigate("/results")}
                  >
                    ดูผลลัพธ์ล่าสุด
                  </Button>
                )}
              </div>
            </div>
          </article>
        </section>
      </main>
    </>
  );
};

export default Index;
