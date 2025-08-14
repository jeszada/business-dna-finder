import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { ArrowLeft, Users, TrendingUp, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { BUSINESS_TYPES } from "@/data/business";
import SEO from "@/components/SEO";


// Mock data for demo purposes - in real app this would come from Supabase
const mockAssessmentData = [
  { businessType: "ธุรกิจเทคโนโลยีและนวัตกรรม", count: 45, percentage: 18 },
  { businessType: "ธุรกิจการตลาดและโฆษณา", count: 38, percentage: 15 },
  { businessType: "ธุรกิจบริการ", count: 32, percentage: 13 },
  { businessType: "ธุรกิจสุขภาพ/ความงาม", count: 28, percentage: 11 },
  { businessType: "ธุรกิจการค้า", count: 25, percentage: 10 },
  { businessType: "ธุรกิจสร้างสรรค์และสื่อ", count: 22, percentage: 9 },
  { businessType: "ธุรกิจการเงินและการลงทุน", count: 18, percentage: 7 },
  { businessType: "ธุรกิจอาหารและเครื่องดื่ม", count: 15, percentage: 6 },
  { businessType: "ธุรกิจโลจิสติกส์และซัพพลายเชน", count: 12, percentage: 5 },
  { businessType: "ธุรกิจสิ่งแวดล้อม", count: 8, percentage: 3 },
  { businessType: "ธุรกิจท่องเที่ยว", count: 5, percentage: 2 },
  { businessType: "ธุรกิจการเกษตร", count: 2, percentage: 1 },
];

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

  useEffect(() => {
    const total = mockAssessmentData.reduce((sum, item) => sum + item.count, 0);
    setTotalAssessments(total);
  }, []);

  // Get top 5 business types for bar chart
  const topBusinessTypes = mockAssessmentData.slice(0, 5);

  return (
    <>
      <SEO 
        title="Dashboard - Business Assessment Analytics"
        description="ดูสถิติและข้อมูลการประเมินความเหมาะสมทางธุรกิจ"
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
              <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
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
                <div className="text-2xl font-bold">{mockAssessmentData[0]?.businessType.split('ธุรกิจ')[1]}</div>
                <p className="text-xs text-muted-foreground">
                  {mockAssessmentData[0]?.count} คน ({mockAssessmentData[0]?.percentage}%)
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
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topBusinessTypes} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <XAxis 
                        dataKey="businessType" 
                        tick={{ fontSize: 10 }}
                        angle={-45}
                        textAnchor="end"
                        height={100}
                        interval={0}
                      />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="count" fill="hsl(var(--primary))" radius={4} />
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
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={mockAssessmentData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="percentage"
                        label={({ businessType, percentage }) => 
                          percentage > 5 ? `${percentage}%` : ''
                        }
                      >
                        {mockAssessmentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                                <p className="font-medium text-foreground">{data.businessType}</p>
                                <p className="text-sm text-muted-foreground">
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
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium">ประเภทธุรกิจ</th>
                      <th className="text-right py-3 px-4 font-medium">จำนวนคน</th>
                      <th className="text-right py-3 px-4 font-medium">เปอร์เซ็นต์</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockAssessmentData.map((item, index) => (
                      <tr key={index} className="border-b border-border/50">
                        <td className="py-3 px-4">{item.businessType}</td>
                        <td className="py-3 px-4 text-right font-medium">{item.count}</td>
                        <td className="py-3 px-4 text-right">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                            {item.percentage}%
                          </span>
                        </td>
                      </tr>
                    ))}
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