
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import { Home } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEO
        title="ไม่พบหน้า | BSA"
        description="หน้าที่คุณต้องการหาไม่พบ กลับไปยังหน้าแรกเพื่อเริ่มแบบประเมิน"
      />
      <main className="min-h-screen bg-background flex items-center justify-center">
        <section className="text-center p-6">
          <div className="mb-6">
            <h1 className="text-6xl font-bold text-muted-foreground mb-4">404</h1>
            <h2 className="text-2xl font-semibold mb-2">ไม่พบหน้าที่ต้องการ</h2>
            <p className="text-muted-foreground">หน้าที่คุณกำลังมองหาอาจถูกย้ายหรือไม่มีอยู่</p>
          </div>
          
          <Button onClick={() => navigate("/")} className="gap-2">
            <Home size={16} />
            กลับหน้าแรก
          </Button>
        </section>
      </main>
    </>
  );
};

export default NotFound;
