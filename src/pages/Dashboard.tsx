import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, TrendingUp, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { BUSINESS_TYPES } from "@/data/business";
import { getAssessmentStatistics } from "@/lib/assessmentService";
import SEO from "@/components/SEO";


const Dashboard = () => {
  const [totalAssessments, setTotalAssessments] = useState(0);
  const [businessStats, setBusinessStats] = useState<Array<{ businessType: string; count: number; percentage: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStatistics = async () => {
      try {
        const stats = await getAssessmentStatistics();
        setTotalAssessments(stats.totalAssessments);
        setBusinessStats(stats.businessTypeStats);
      } catch (error) {
        console.error('Failed to load statistics:', error);
        // Fall back to empty data
        setTotalAssessments(0);
        setBusinessStats([]);
      } finally {
        setLoading(false);
      }
    };
    loadStatistics();
  }, []);

  // Sort business stats by count (highest to lowest)
  const sortedBusinessStats = [...businessStats].sort((a, b) => b.count - a.count);

  if (loading) {
    return (
      <>
        <SEO 
          title="Report - Business Assessment Analytics"
          description="รายงานสถิติและข้อมูลการประเมินความเหมาะสมทางธุรกิจ"
        />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <p>กำลังโหลดข้อมูล...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO 
        title="Report - Business Assessment Analytics"
        description="รายงานสถิติและข้อมูลการประเมินความเหมาะสมทางธุรกิจ"
      />
      <div className="min-h-screen bg-background">
        {/* Mobile-optimized header */}
        <header className="bg-card border-b border-border sticky top-0 z-10">
          <div className="px-3 py-3">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild className="p-2">
                <Link to="/">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <h1 className="text-lg font-bold text-foreground">รายงานสถิติ</h1>
            </div>
          </div>
        </header>

        <main className="px-3 py-4 space-y-4">
          {/* Single stats card */}
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">การประเมินทั้งหมด</p>
                <p className="text-2xl font-bold">{totalAssessments.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </Card>


          {/* Highlighted Business Table */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">อันดับความเหมาะสมทางธุรกิจ</CardTitle>
              <CardDescription className="text-sm">
                ข้อมูลครบถ้วนของการประเมินความเหมาะสมทางธุรกิจ (3 อันดับแรกถูกไฮไลต์)
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="space-y-2">
                {sortedBusinessStats.length > 0 ? sortedBusinessStats.map((item, index) => {
                  const isTop3 = index < 3;
                  const isFirst = index === 0;
                  const isSecond = index === 1;
                  const isThird = index === 2;
                  
                  let bgClass = "bg-muted/30";
                  let rankBgClass = "bg-primary/10";
                  let rankTextClass = "text-primary";
                  let percentageBgClass = "bg-primary/10 text-primary";
                  
                  if (isFirst) {
                    bgClass = "bg-gradient-to-r from-primary/20 to-primary/15 border border-primary/30";
                    rankBgClass = "bg-primary";
                    rankTextClass = "text-white";
                    percentageBgClass = "bg-primary/20 text-primary font-semibold";
                  } else if (isSecond) {
                    bgClass = "bg-gradient-to-r from-primary/15 to-primary/10 border border-primary/20";
                    rankBgClass = "bg-primary/80";
                    rankTextClass = "text-white";
                    percentageBgClass = "bg-primary/15 text-primary font-medium";
                  } else if (isThird) {
                    bgClass = "bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/15";
                    rankBgClass = "bg-primary/60";
                    rankTextClass = "text-white";
                    percentageBgClass = "bg-primary/10 text-primary";
                  }
                  
                  return (
                    <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${bgClass} ${isTop3 ? 'shadow-sm' : ''}`}>
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${rankBgClass}`}>
                          <span className={`text-xs font-bold ${rankTextClass}`}>
                            {index + 1}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-medium truncate ${isTop3 ? 'text-foreground font-semibold' : 'text-foreground'}`}>
                            {item.businessType}
                          </p>
                          <p className={`text-xs ${isTop3 ? 'text-muted-foreground font-medium' : 'text-muted-foreground'}`}>
                            {item.count} คน
                          </p>
                        </div>
                      </div>
                      <div className="ml-3 flex-shrink-0">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${percentageBgClass}`}>
                          {item.percentage}%
                        </span>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="py-8 text-center">
                    <p className="text-sm text-muted-foreground">ยังไม่มีข้อมูลการประเมิน</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Mobile padding bottom */}
          <div className="h-4"></div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;