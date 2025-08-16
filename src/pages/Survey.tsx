
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import SEO from "@/components/SEO";
import { sampleQuestions } from "@/data/sampleQuestions";
import { Question } from "@/data/business";
import { AnswerMap } from "@/lib/scoring";

const STORAGE_KEY = "bsa-progress";

function loadProgress(): AnswerMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AnswerMap) : {};
  } catch {
    return {};
  }
}

function saveProgress(data: AnswerMap) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

const labels = ["ต่ำมาก", "ต่ำ", "ปานกลาง", "สูง", "สูงมาก"];

const Survey = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<AnswerMap>(() => loadProgress());
  const [index, setIndex] = useState(0);
  const questions: Question[] = sampleQuestions;

  const q = questions[index];
  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);
  const progress = questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0;

  useEffect(() => {
    saveProgress(answers);
  }, [answers]);

  const choose = (score: number) => {
    setAnswers((prev) => ({ ...prev, [q.id]: score }));
  };

  const goNext = () => {
    if (index < questions.length - 1) setIndex((i) => i + 1);
    else navigate("/results");
  };

  const goBack = () => setIndex((i) => Math.max(0, i - 1));

  return (
    <>
      <SEO
        title="ทำแบบประเมิน | BSA"
        description="ตอบคำถามแบบ Likert 1-5 ครบทั้ง 4 หมวด พร้อมบันทึกชั่วคราวอัตโนมัติ"
      />
      <main className="min-h-screen bg-background">
        <section className="max-w-xl mx-auto p-4 sm:p-6">
          <header className="rounded-md bg-secondary p-4 sm:p-5 mb-4">
            <div className="flex items-center justify-between text-sm">
              <p className="text-muted-foreground">คำถามที่ {index + 1} จาก {questions.length}</p>
              <p className="text-muted-foreground">{progress}% เสร็จสิ้น</p>
            </div>
            <Progress value={progress} className="mt-3" />
          </header>

          {!q ? (
            <Card className="shadow-lg">
              <CardContent className="p-6 text-center">
                <p>ไม่พบคำถาม กรุณาลองใหม่อีกครั้ง</p>
                <Button onClick={() => window.location.reload()} className="mt-2">
                  โหลดใหม่
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                เลือกระดับที่ตรงกับความรู้สึกของคุณที่สุด<br/>
                โดย <span className="font-bold">1</span> คือ น้อยมาก หรือไม่ค่อยตรง และ <span className="font-bold">5</span> คือ มากที่สุด หรือตรงกับตัวคุณมาก
              </p>
              
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <h1 className="text-xl sm:text-2xl font-semibold mb-6 leading-relaxed">{q.text}</h1>

                  <div className="grid grid-cols-5 gap-3">
                    {[1,2,3,4,5].map((n) => {
                      const active = answers[q.id] === n;
                      return (
                        <button
                          key={n}
                          onClick={() => choose(n)}
                          className={`
                            h-14 rounded-lg border-2 text-lg font-semibold transition-all duration-200
                            ${active 
                              ? "border-primary bg-primary/10 text-primary shadow-md scale-105" 
                              : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
                            }
                          `}
                          aria-pressed={active}
                          aria-label={`ให้คะแนน ${n} (${labels[n-1]})`}
                        >
                          {n}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between mt-6">
                    <Button variant="secondary" onClick={goBack} disabled={index===0}>
                      ← ย้อนกลับ
                    </Button>
                    <Button onClick={goNext} disabled={!q || answers[q.id] === undefined}>
                      {index === questions.length - 1 ? "ดูผลลัพธ์" : "ถัดไป →"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </section>
      </main>
    </>
  );
};

export default Survey;
