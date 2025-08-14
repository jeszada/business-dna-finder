import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";

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
      <main className="min-h-screen flex items-center justify-center bg-background">
        <section className="w-full max-w-xl p-6 sm:p-8">
          <header className="mb-6">
            <p className="text-sm text-muted-foreground">Business Suitability Assessment</p>
            <h1 className="text-3xl font-bold tracking-tight mt-1">แบบประเมินความเหมาะสมทางธุรกิจ</h1>
          </header>
          <article className="rounded-xl bg-secondary p-6 sm:p-8 shadow-elev">
            <h2 className="sr-only">คำอธิบายแบบประเมิน</h2>
            <p className="text-base text-muted-foreground">
              ค้นพบ DNA ทางธุรกิจของคุณผ่านแบบทดสอบ 4 หมวดหลัก เพื่อหา<br className="hidden sm:block" />
              ประเภทธุรกิจที่เหมาะสมที่สุด และตัดสินใจได้อย่างมั่นใจ
            </p>
            <div className="mt-6 space-y-3">
              <Button size="lg" className="w-full bg-gradient-primary text-primary-foreground" onClick={() => navigate("/survey")}> 
                เริ่มประเมิน DNA ทางธุรกิจ
              </Button>
              {hasResults && (
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => navigate("/results")}
                >
                  ดูผลลัพธ์ล่าสุด
                </Button>
              )}
            </div>
          </article>
        </section>
      </main>
    </>
  );
};

export default Index;
