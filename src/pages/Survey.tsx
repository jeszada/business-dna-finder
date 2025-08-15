import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import SEO from "@/components/SEO";
import { fetchQuestionsFromDatabase, getRandomQuestions } from "@/lib/questionService";
import { Question } from "@/data/business";
import { AnswerMap } from "@/lib/scoring";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [index, setIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load questions from database on component mount
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const allQuestions = await fetchQuestionsFromDatabase();
        const selectedQuestions = getRandomQuestions(allQuestions, 40);
        setQuestions(selectedQuestions);
        
        // Clear previous answers when new questions are loaded
        setAnswers({});
        localStorage.removeItem(STORAGE_KEY);
        setIndex(0);
      } catch (error) {
        console.error('Failed to load questions:', error);
        toast({
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถโหลดคำถามได้ กรุณาลองใหม่อีกครั้ง",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, [toast]);

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

          {isLoading ? (
            <Card className="shadow-elev">
              <CardContent className="p-6 text-center">
                <p>กำลังโหลดคำถาม...</p>
              </CardContent>
            </Card>
          ) : !q ? (
            <Card className="shadow-elev">
              <CardContent className="p-6 text-center">
                <p>ไม่พบคำถาม กรุณาลองใหม่อีกครั้ง</p>
                <Button onClick={() => window.location.reload()} className="mt-2">
                  โหลดใหม่
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="mb-4 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-foreground leading-relaxed">
                  เลือกระดับที่ตรงกับความรู้สึกของคุณจาก 1 ถึง 5 เลือกตัวเลขที่ 
                  <span className="font-medium text-primary"> "ใกล้ความจริงของคุณที่สุด" </span>
                  เพื่อให้ระบบวิเคราะห์ได้แม่นยำ โดย 
                  <span className="font-medium"> 1 คือ "น้อยมาก หรือไม่ค่อยตรงกับตัวคุณ" </span>
                  และ 
                  <span className="font-medium"> 5 คือ "มากที่สุด หรือตรงกับตัวคุณมาก" </span>
                </p>
              </div>
              
              <Card className="shadow-elev">
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
