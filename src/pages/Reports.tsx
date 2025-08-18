
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Users, TrendingUp, Crown, Medal, Award } from 'lucide-react';
import SEO from '@/components/SEO';
import { BUSINESS_TYPES } from '@/data/business';

const Reports = () => {
  const navigate = useNavigate();

  // Mock data for demonstration - replace with real data from database later
  const businessStats = BUSINESS_TYPES.map((business, index) => ({
    businessType: business,
    count: Math.floor(Math.random() * 200) + 50, // Random numbers for demo
  })).sort((a, b) => b.count - a.count); // Sort by count descending

  const totalAssessments = businessStats.reduce((sum, item) => sum + item.count, 0);
  
  // Calculate percentages
  const businessStatsWithPercentage = businessStats.map((item) => ({
    ...item,
    percentage: Math.round((item.count / totalAssessments) * 100)
  }));

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return Crown;
      case 2: return Medal;
      case 3: return Award;
      default: return null;
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1: return "bg-gradient-to-r from-primary/20 to-primary/10 border-primary/30 text-primary font-semibold";
      case 2: return "bg-gradient-to-r from-primary/15 to-primary/8 border-primary/25 text-primary/90 font-medium";
      case 3: return "bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 text-primary/80 font-medium";
      default: return "hover:bg-muted/50";
    }
  };

  return (
    <>
      <SEO
        title="รายงานสถิติ | BSA"
        description="สถิติและรายงานการประเมินธุรกิจ"
      />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto p-6">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="mb-4"
            >
              ← กลับหน้าแรก
            </Button>
            
            <h1 className="text-3xl font-bold mb-2">รายงานสถิติ</h1>
            <p className="text-muted-foreground">สถิติการใช้งานแบบประเมินธุรกิจ</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  จำนวนผู้ทำแบบประเมิน
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalAssessments.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% จากเดือนที่แล้ว
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  ธุรกิจยอดนิยม
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{businessStatsWithPercentage[0]?.businessType}</div>
                <p className="text-xs text-muted-foreground">
                  {businessStatsWithPercentage[0]?.percentage}% ของผู้ทำแบบประเมิน
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  คะแนนเฉลี่ย
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78%</div>
                <p className="text-xs text-muted-foreground">
                  คะแนนความเหมาะสม
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>อันดับธุรกิจที่ได้รับความนิยม</CardTitle>
              <CardDescription>
                เรียงตามจำนวนผู้เลือกธุรกิจแต่ละประเภท
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">อันดับ</TableHead>
                    <TableHead>ประเภทธุรกิจ</TableHead>
                    <TableHead className="text-right">จำนวนคน</TableHead>
                    <TableHead className="text-right">เปอร์เซ็นต์</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {businessStatsWithPercentage.map((item, index) => {
                    const rank = index + 1;
                    const IconComponent = getRankIcon(rank);
                    
                    return (
                      <TableRow 
                        key={item.businessType} 
                        className={getRankStyle(rank)}
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {IconComponent ? (
                              <IconComponent className="h-4 w-4" />
                            ) : (
                              <span className="w-4 text-center">{rank}</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {item.businessType}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.count.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.percentage}%
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>หมายเหตุ</CardTitle>
              <CardDescription>
                ข้อมูลนี้เป็นตัวอย่างสำหรับการแสดงผล ในอนาคตจะเชื่อมต่อกับข้อมูลจริงจากฐานข้อมูล
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                อันดับ 1-3 จะแสดงด้วยไอคอนพิเศษและสีไล่เฉดเพื่อให้เห็นความโดดเด่น
                ข้อมูลจะอัปเดตตามการใช้งานจริงของระบบ
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
};

export default Reports;
