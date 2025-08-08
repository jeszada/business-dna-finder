import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import { sampleQuestions } from "@/data/sampleQuestions";
import { AnswerMap, computeScores, topNBusinesses } from "@/lib/scoring";
import { BUSINESS_TYPES, Category } from "@/data/business";
import { useNavigate } from "react-router-dom";

const STORAGE_KEY = "baa-progress";

function loadProgress(): AnswerMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AnswerMap) : {};
  } catch {
    return {};
  }
}

const categoryLabels: Record<Category, string> = {
  skills: "ทักษะ",
  preferences: "ความชอบ",
  readiness: "ความพร้อม",
  motivation: "แรงจูงใจ",
};

const Results = () => {
  const navigate = useNavigate();
  const [answers] = useState<AnswerMap>(() => loadProgress());

  const data = useMemo(() => computeScores(sampleQuestions, answers), [answers]);
  const top3 = useMemo(() => topNBusinesses(data.businessScores, 3), [data]);

  useEffect(() => {
    // If user lands here without answers, redirect
    if (Object.keys(answers).length === 0) navigate("/survey");
  }, [answers, navigate]);

  return (
    <>
      <SEO
        title="ผลลัพธ์แบบประเมิน | BAA"
        description="สรุป Top 3 ประเภทธุรกิจที่เหมาะกับคุณ พร้อมคะแนนหมวด 4 เรื่อง"
      />
      <main className="min-h-screen bg-background">
        <section className="max-w-xl mx-auto p-4 sm:p-6">
          <header className="rounded-md bg-secondary p-4 sm:p-5 mb-4">
            <h1 className="text-lg font-semibold">การประเมินเสร็จสิ้น</h1>
            <p className="text-sm text-muted-foreground">คุณได้ตอบครบ {Object.keys(answers).length} ข้อ</p>
          </header>

          <h2 className="text-xl font-bold mb-3">3 อันดับ ประเภทธุรกิจที่เหมาะกับคุณ</h2>
          <div className="space-y-3 mb-6">
            {top3.map(([name, score], i) => (
              <Card key={name} className={`border-2 ${i===0 ? "border-ring" : ""}`}>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-secondary flex items-center justify-center font-bold">{i+1}</div>
                  <div className="flex-1">
                    <p className="font-semibold">{name}</p>
                  </div>
                  <div className="text-sm font-semibold">{score}%</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <h3 className="text-lg font-semibold mb-2">คะแนนแยกตามหมวดหมู่</h3>
          <div className="space-y-4">
            {(Object.keys(categoryLabels) as Category[]).map((c) => (
              <div key={c}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">{categoryLabels[c]}</span>
                  <span className="font-medium">{data.categoryAverages[c]}%</span>
                </div>
                <Progress value={data.categoryAverages[c]} />
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between">
            <Button variant="secondary" onClick={() => navigate("/survey")}>ทำใหม่</Button>
            <Button onClick={() => navigate("/")}>กลับหน้าแรก</Button>
          </div>

          <footer className="mt-8 text-xs text-muted-foreground">
            หมายเหตุ: ระบบเดโม่กำลังใช้คำถามตัวอย่างชั่วคราว เมื่อเชื่อมฐานข้อมูลจะดึงคำถามจริงจาก Google Sheet และบันทึกผลแบบถาวร
          </footer>
        </section>
      </main>
    </>
  );
};

export default Results;
