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
          <header className="bg-card border-b border-border">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    กลับหน้าหลัก
                  </Link>
                </Button>
                <h1 className="text-2xl font-bold text-foreground">Report</h1>
              </div>
            </div>
          </header>

        <main className="container mx-auto px-4 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">การประเมินทั้งหมด</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalAssessments.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  +12% จากเดือนที่แล้ว
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">ธุรกิจยอดนิยม</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{businessStats[0]?.businessType.split('ธุรกิจ')[1] || 'ไม่มีข้อมูล'}</div>
                <p className="text-xs text-muted-foreground">
                  {businessStats[0]?.count || 0} คน ({businessStats[0]?.percentage || 0}%)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">ประเภทธุรกิจ</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{BUSINESS_TYPES.length}</div>
                <p className="text-xs text-muted-foreground">
                  ประเภทที่ให้เลือก
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>ธุรกิจยอดนิยม 5 อันดับแรก</CardTitle>
                <CardDescription>
                  จำนวนคนที่เหมาะสมกับแต่ละประเภทธุรกิจ
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    count: {
                      label: "จำนวนคน",
                      color: "hsl(var(--primary))",
                    },
                  }}
                  className="h-[250px] sm:h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topBusinessTypes} margin={{ top: 20, right: 10, left: 10, bottom: 60 }}>
                      <XAxis 
                        dataKey="businessType" 
                        tick={{ fontSize: 8 }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        interval={0}
                      />
                      <YAxis tick={{ fontSize: 10 }} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="count" fill="hsl(var(--primary))" radius={2} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>สัดส่วนความเหมาะสมทางธุรกิจ</CardTitle>
                <CardDescription>
                  เปอร์เซ็นต์การกระจายตัวของประเภทธุรกิจ
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    percentage: {
                      label: "เปอร์เซ็นต์",
                    },
                  }}
                  className="h-[250px] sm:h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={businessStats}
                        cx="50%"
                        cy="50%"
                        outerRadius={60}
                        fill="#8884d8"
                        dataKey="percentage"
                        label={({ businessType, percentage }) => 
                          percentage > 8 ? `${percentage}%` : ''
                        }
                        labelLine={false}
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
                              <div className="bg-background border border-border rounded-lg p-2 shadow-lg text-xs">
                                <p className="font-medium text-foreground text-wrap max-w-[200px]">{data.businessType}</p>
                                <p className="text-muted-foreground">
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

          {/* Detailed Table */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>รายละเอียดทุกประเภทธุรกิจ</CardTitle>
              <CardDescription>
                ข้อมูลครบถ้วนของการประเมินความเหมาะสมทางธุรกิจ
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-2 font-medium">ประเภทธุรกิจ</th>
                      <th className="text-right py-2 px-2 font-medium">จำนวนคน</th>
                      <th className="text-right py-2 px-2 font-medium">เปอร์เซ็นต์</th>
                    </tr>
                  </thead>
                  <tbody>
                    {businessStats.length > 0 ? businessStats.map((item, index) => (
                      <tr key={index} className="border-b border-border/50">
                        <td className="py-2 px-2 text-xs">{item.businessType}</td>
                        <td className="py-2 px-2 text-right font-medium text-xs">{item.count}</td>
                        <td className="py-2 px-2 text-right text-xs">
                          <span className="inline-flex items-center px-1 py-0.5 rounded-full text-xs bg-primary/10 text-primary">
                            {item.percentage}%
                          </span>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={3} className="py-4 text-center text-muted-foreground text-sm">
                          ยังไม่มีข้อมูลการประเมิน
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
};

export default Dashboard;