
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import { AnswerMap, computeScores, topNBusinesses } from "@/lib/scoring";
import { BUSINESS_TYPES, Category, BusinessType } from "@/data/business";
import { useNavigate } from "react-router-dom";
import { Crown, Medal, Award } from "lucide-react";
import { fetchQuestionsFromDatabase, getRandomQuestions } from "@/lib/questionService";
import { useQuery } from "@tanstack/react-query";

const STORAGE_KEY = "bsa-progress";

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
  
  // ดึงคำถามจากฐานข้อมูล
  const { data: allQuestions, isLoading } = useQuery({
    queryKey: ['questions'],
    queryFn: fetchQuestionsFromDatabase,
  });

  // สุ่มคำถาม 40 ข้อจากฐานข้อมูล (เหมือนกับใน Survey)
  const questions = useMemo(() => {
    if (!allQuestions || allQuestions.length === 0) return [];
    return getRandomQuestions(allQuestions, 40);
  }, [allQuestions]);

  const data = useMemo(() => {
    if (questions.length === 0) {
      const emptyBusinessScores = {} as Record<BusinessType, number>;
      BUSINESS_TYPES.forEach(business => {
        emptyBusinessScores[business] = 0;
      });
      const emptyCategoryAverages = {} as Record<Category, number>;
      Object.keys(categoryLabels).forEach(category => {
        emptyCategoryAverages[category as Category] = 0;
      });
      return { businessScores: emptyBusinessScores, categoryAverages: emptyCategoryAverages };
    }
    return computeScores(questions, answers);
  }, [questions, answers]);
  
  const top3 = useMemo(() => topNBusinesses(data.businessScores, 3), [data]);

  useEffect(() => {
    // If user lands here without answers, redirect
    if (Object.keys(answers).length === 0) navigate("/survey");
  }, [answers, navigate]);

  if (isLoading) {
    return (
      <>
        <SEO
          title="กำลังคำนวณผลลัพธ์ | BSA"
          description="กำลังคำนวณผลการประเมินความเหมาะสมทางธุรกิจ"
        />
        <main className="min-h-screen bg-background flex items-center justify-center">
          <Card className="shadow-lg max-w-md">
            <CardContent className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>กำลังคำนวณผลลัพธ์...</p>
            </CardContent>
          </Card>
        </main>
      </>
    );
  }

  return (
    <>
      <SEO
        title="ผลลัพธ์แบบประเมิน | BSA"
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
            {top3.map(([name, score], i) => {
              const isFirst = i === 0;
              const icons = [Crown, Medal, Award];
              const IconComponent = icons[i];
              
              return (
                <Card 
                  key={name} 
                  className={`${isFirst ? 
                    "border-2 border-primary bg-gradient-to-r from-primary/5 to-accent/5 shadow-lg" : 
                    "border border-border"
                  } ${isFirst ? "scale-105" : ""} transition-all`}
                >
                  <CardContent className={`${isFirst ? "p-6" : "p-4"} flex items-center gap-3`}>
                    <div className={`${isFirst ? "h-12 w-12" : "h-10 w-10"} shrink-0 rounded-full ${isFirst ? "bg-gradient-to-r from-primary to-accent" : "bg-secondary"} flex items-center justify-center ${isFirst ? "text-white" : ""}`}>
                      {isFirst ? (
                        <IconComponent size={isFirst ? 24 : 20} className="text-white" />
                      ) : (
                        <span className="font-bold">{i+1}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`${isFirst ? "text-lg" : ""} font-semibold ${isFirst ? "text-primary" : ""}`}>{name}</p>
                    </div>
                    <div className={`${isFirst ? "text-lg" : "text-sm"} font-semibold ${isFirst ? "text-primary" : ""}`}>{score}%</div>
                  </CardContent>
                </Card>
              );
            })}
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
            ระบบอ้างอิงจาก 40 คำถามที่ครอบคลุม 14 ประเภทธุรกิจ
          </footer>
        </section>
      </main>
    </>
  );
};

export default Results;
