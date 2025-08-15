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
          {/* Mobile-first stats cards */}
          <div className="grid grid-cols-1 gap-3">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">การประเมินทั้งหมด</p>
                  <p className="text-2xl font-bold">{totalAssessments.toLocaleString()}</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">ธุรกิจยอดนิยม</p>
                  <p className="text-lg font-bold leading-tight">
                    {businessStats[0]?.businessType.replace('ธุรกิจ', '') || 'ไม่มีข้อมูล'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {businessStats[0]?.count || 0} คน ({businessStats[0]?.percentage || 0}%)
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">ประเภทธุรกิจ</p>
                  <p className="text-2xl font-bold">{BUSINESS_TYPES.length}</p>
                  <p className="text-xs text-muted-foreground">ประเภทที่ให้เลือก</p>
                </div>
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
            </Card>
          </div>


          {/* Mobile-optimized table */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">รายละเอียดทุกประเภทธุรกิจ</CardTitle>
              <CardDescription className="text-sm">
                ข้อมูลครบถ้วนของการประเมินความเหมาะสมทางธุรกิจ
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="space-y-2">
                {sortedBusinessStats.length > 0 ? sortedBusinessStats.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-bold text-primary">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">
                          {item.businessType}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.count} คน
                        </p>
                      </div>
                    </div>
                    <div className="ml-3 flex-shrink-0">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary font-medium">
                        {item.percentage}%
                      </span>
                    </div>
                  </div>
                )) : (
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