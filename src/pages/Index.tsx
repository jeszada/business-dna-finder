
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Star, BarChart3, Upload, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SEO from "@/components/SEO";

const STORAGE_KEY = "bsa-progress";
const QUESTIONS_KEY = "bsa-questions";

const Index = () => {
  const navigate = useNavigate();
  const [isStarted, setIsStarted] = useState(false);
  const [hasExistingData, setHasExistingData] = useState(false);

  useEffect(() => {
    // เช็คว่ามีข้อมูลใน localStorage หรือไม่
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const answers = raw ? JSON.parse(raw) : {};
      setHasExistingData(Object.keys(answers).length > 0);
    } catch (error) {
      setHasExistingData(false);
    }
  }, []);

  const handleStart = () => {
    // เคลียร์ข้อมูลเก่าก่อนเริ่มใหม่
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(QUESTIONS_KEY); // เคลียร์ question IDs ด้วย
    } catch (error) {
      console.log('Error clearing localStorage:', error);
    }
    
    setIsStarted(true);
    setTimeout(() => {
      navigate("/survey");
    }, 1000);
  };

  const handleViewLatestResults = () => {
    navigate("/results");
  };

  return (
    <>
      <SEO
        title="Business Suitability Assessment | BSA"
        description="ประเมินความเหมาะสมทางธุรกิจ - ค้นหาประเภทธุรกิจที่เหมาะกับคุณผ่านแบบประเมิน 40 คำถาม"
      />
      <main className="min-h-screen flex items-center justify-center bg-background py-8 px-4">
        <section className="w-full max-w-md">
          {/* Header Section */}
          <div className="text-center mb-8 animate-fade-in">
            <p className="text-sm text-muted-foreground font-medium mb-0">
              Business Suitability Assessment
            </p>
            
            <h1 className="text-2xl font-bold text-foreground mb-6 leading-tight">
              แบบประเมินความเหมาะสม<br />
              <span className="text-primary">ทางธุรกิจ</span>
            </h1>
          </div>

          {/* Main Card */}
          <Card className="mb-6 bg-background border animate-fade-in">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl font-bold mb-2">
                ค้นพบ DNA ทางธุรกิจของคุณ
              </CardTitle>
              <CardDescription className="text-base leading-relaxed">
                ผ่านแบบทดสอบ 4 หมวดหลัก เพื่อหาประเภท<br />
                ธุรกิจที่เหมาะสมที่สุด และตัดสินใจได้อย่างมั่นใจ
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={handleStart}
                disabled={isStarted}
                className="w-full py-6 text-lg font-semibold bg-primary hover:bg-primary/90 text-white rounded-lg flex items-center justify-center gap-2"
              >
                <TrendingUp className="w-5 h-5" />
                {isStarted ? "กำลังเริ่มต้น..." : "เริ่มประเมิน DNA ทางธุรกิจ"}
              </Button>
              
              {hasExistingData && (
                <Button 
                  variant="outline" 
                  onClick={handleViewLatestResults}
                  className="w-full py-3 text-base font-medium rounded-lg"
                >
                  ดูผลลัพธ์ล่าสุด
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="text-center text-sm text-muted-foreground space-y-2 animate-fade-in">
            <div className="flex items-center justify-center gap-2">
              <Clock className="w-4 h-4" />
              <span>ใช้เวลาประมาณ 5-8 นาที</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>40 คำถาม • 14 ประเภทธุรกิจ</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-3 mt-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/reports')}
              className="flex items-center justify-center gap-2 text-muted-foreground"
              size="sm"
            >
              <BarChart3 className="w-4 h-4" />
              ดูรายงานสถิติ
            </Button>
          </div>
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
