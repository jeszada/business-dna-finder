import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import { AnswerMap, computeScores, topNBusinesses } from "@/lib/scoring";
import { BUSINESS_TYPES, Category, BusinessType } from "@/data/business";
import { useNavigate } from "react-router-dom";
import { fetchQuestionsFromDatabase } from "@/lib/questionService";

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
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const fetchedQuestions = await fetchQuestionsFromDatabase();
        setQuestions(fetchedQuestions);
      } catch (error) {
        console.error('Failed to load questions:', error);
      } finally {
        setLoading(false);
      }
    };
    loadQuestions();
  }, []);

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

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p>กำลังคำนวณผลลัพธ์...</p>
        </div>
      </main>
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
            ระบบใช้ข้อมูลจริง {questions.length} คำถาม จากฐานข้อมูล
          </footer>
        </section>
      </main>
    </>
  );
};

export default Results;
