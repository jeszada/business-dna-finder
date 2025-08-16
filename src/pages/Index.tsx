
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Star, BarChart3, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SEO from "@/components/SEO";

const Index = () => {
  const navigate = useNavigate();
  const [isStarted, setIsStarted] = useState(false);

  const handleStart = () => {
    setIsStarted(true);
    setTimeout(() => navigate("/survey"), 300);
  };

  return (
    <>
      <SEO
        title="Business Suitability Assessment | BSA"
        description="ประเมินความเหมาะสมทางธุรกิจ - ค้นหาประเภทธุรกิจที่เหมาะกับคุณผ่านแบบประเมิน 40 คำถาม"
      />
      <main className="min-h-screen flex items-center justify-center bg-background bg-gradient-to-br from-background via-background to-primary/5 py-8">
        <section className="w-full max-w-xl p-6 sm:p-8 -mt-16">
          <header className="mb-8 text-center animate-fade-in">
            <div className="flex items-center justify-center gap-2 mb-3">
              <p className="text-sm text-muted-foreground font-medium">Business Suitability Assessment</p>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 leading-tight">
              ค้นหาธุรกิจ<br />
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                ที่เหมาะกับคุณ
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
              แบบประเมินความเหมาะสมทางธุรกิจ ค้นพบศักยภาพและทิศทางธุรกิจที่ใช่สำหรับคุณ
            </p>
          </header>

          <Card className="mb-6 border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5 animate-fade-in shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl text-primary">แบบประเมิน BSA</CardTitle>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  40 คำถาม
                </Badge>
              </div>
              <CardDescription className="text-base">
                ประเมินครอบคลุม 4 มิติหลัก เพื่อหา 3 อันดับธุรกิจที่เหมาะกับคุณมากที่สุด
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span>ทักษะและความสามารถ</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span>ความชอบส่วนตัว</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span>ความพร้อมทางธุรกิจ</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span>แรงจูงใจและเป้าหมาย</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 pt-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>ใช้เวลาประมาณ 5-8 นาที</span>
              </div>
              
              <Button 
                onClick={handleStart}
                disabled={isStarted}
                className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                {isStarted ? "กำลังเริ่มต้น..." : "เริ่มประเมิน"}
              </Button>
            </CardContent>
          </Card>

          {/* Navigation Links */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <Button 
              variant="outline" 
              onClick={() => navigate('/reports')}
              className="flex-1 flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              ดูรายงานสถิติ
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/import')}
              className="flex-1 flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              นำเข้าคำถาม
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center text-sm text-muted-foreground animate-fade-in">
            <div className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Star className="w-4 h-4 text-primary" />
              </div>
              <span>14 ประเภทธุรกิจ</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-accent" />
              </div>
              <span>ผลลัพธ์ทันที</span>
            </div>
          </div>

          <footer className="mt-8 text-center text-xs text-muted-foreground">
            <p>© 2024 Business Suitability Assessment. พัฒนาเพื่อช่วยค้นหาทิศทางธุรกิจที่เหมาะสม</p>
          </footer>
        </section>
      </main>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </>
  );
};

export default Index;
