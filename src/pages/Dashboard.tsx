import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { ArrowLeft, Users, TrendingUp, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { BUSINESS_TYPES } from "@/data/business";
import { getAssessmentStatistics } from "@/lib/assessmentService";
import SEO from "@/components/SEO";

// Colors for the pie chart
const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--secondary))',
  'hsl(var(--accent))',
  'hsl(var(--muted))',
  'hsl(210, 40%, 60%)',
  'hsl(280, 40%, 60%)',
  'hsl(45, 40%, 60%)',
  'hsl(160, 40%, 60%)',
  'hsl(20, 40%, 60%)',
  'hsl(300, 40%, 60%)',
  'hsl(120, 40%, 60%)',
  'hsl(190, 40%, 60%)',
];

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

  // Get top 5 business types for bar chart
  const topBusinessTypes = businessStats.slice(0, 5);

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

          {/* Mobile-optimized charts */}
          <div className="space-y-4">
            {/* Top Business Types Chart */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">ธุรกิจยอดนิยม 5 อันดับแรก</CardTitle>
                <CardDescription className="text-sm">
                  จำนวนคนที่เหมาะสมกับแต่ละประเภทธุรกิจ
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <ChartContainer
                  config={{
                    count: {
                      label: "จำนวนคน",
                      color: "hsl(var(--primary))",
                    },
                  }}
                  className="h-[280px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={topBusinessTypes} 
                      margin={{ 
                        top: 10, 
                        right: 5, 
                        left: 5, 
                        bottom: 80 
                      }}
                    >
                      <XAxis 
                        dataKey="businessType" 
                        tick={{ fontSize: 9 }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        interval={0}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis 
                        tick={{ fontSize: 9 }} 
                        axisLine={false}
                        tickLine={false}
                        width={30}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar 
                        dataKey="count" 
                        fill="hsl(var(--primary))" 
                        radius={[3, 3, 0, 0]}
                        maxBarSize={40}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Pie Chart */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">สัดส่วนความเหมาะสมทางธุรกิจ</CardTitle>
                <CardDescription className="text-sm">
                  เปอร์เซ็นต์การกระจายตัวของประเภทธุรกิจ
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <ChartContainer
                  config={{
                    percentage: {
                      label: "เปอร์เซ็นต์",
                    },
                  }}
                  className="h-[280px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={businessStats}
                        cx="50%"
                        cy="50%"
                        outerRadius="65%"
                        innerRadius="0%"
                        fill="#8884d8"
                        dataKey="percentage"
                        label={({ percentage }) => 
                          percentage > 4 ? `${percentage}%` : ''
                        }
                        labelLine={false}
                        fontSize={9}
                      >
                        {businessStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-background border border-border rounded-lg p-3 shadow-lg text-sm max-w-[280px]">
                                <p className="font-medium text-foreground break-words text-xs">{data.businessType}</p>
                                <p className="text-muted-foreground mt-1 text-xs">
                                  {data.count} คน ({data.percentage}%)
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
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
                {businessStats.length > 0 ? businessStats.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">
                        {item.businessType}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.count} คน
                      </p>
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