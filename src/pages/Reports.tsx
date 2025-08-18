
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Users, TrendingUp, Crown, Medal, Award } from 'lucide-react';
import SEO from '@/components/SEO';
import { BUSINESS_TYPES } from '@/data/business';

const Reports = () => {
  const navigate = useNavigate();

  const businessStats = BUSINESS_TYPES.map((business, index) => ({
    businessType: business,
    count: Math.floor(Math.random() * 200) + 50,
  })).sort((a, b) => b.count - a.count);

  const totalAssessments = businessStats.reduce((sum, item) => sum + item.count, 0);
  
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

  const getRankTextStyle = (rank: number) => {
    switch (rank) {
      case 1: return "text-primary font-bold";
      case 2: return "text-primary/90 font-semibold";
      case 3: return "text-primary/80 font-medium";
      default: return "text-foreground";
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

          <div className="mb-8">
            <Card className="max-w-sm">
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
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">อันดับธุรกิจที่ได้รับความนิยม</h2>
            <p className="text-muted-foreground mb-6">เรียงตามจำนวนผู้เลือกธุรกิจแต่ละประเภท</p>
            
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead className="w-16 text-center">อันดับ</TableHead>
                        <TableHead className="min-w-[200px]">ประเภทธุรกิจ</TableHead>
                        <TableHead className="text-center w-24">จำนวน</TableHead>
                        <TableHead className="text-center w-20">เปอร์เซ็นต์</TableHead>
                        <TableHead className="w-32">สัดส่วน</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {businessStatsWithPercentage.map((item, index) => {
                        const rank = index + 1;
                        const IconComponent = getRankIcon(rank);
                        
                        return (
                          <TableRow 
                            key={item.businessType}
                            className={rank <= 3 ? "bg-primary/5" : ""}
                          >
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center">
                                {IconComponent ? (
                                  <IconComponent className={`h-5 w-5 ${getRankTextStyle(rank)}`} />
                                ) : (
                                  <span className="text-sm font-bold text-muted-foreground">{rank}</span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className={`font-medium ${getRankTextStyle(rank)}`}>
                                {item.businessType}
                              </span>
                            </TableCell>
                            <TableCell className="text-center font-semibold">
                              {item.count.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-center">
                              <span className="text-primary font-bold">
                                {item.percentage}%
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div 
                                  className="bg-primary h-2 rounded-full transition-all duration-500" 
                                  style={{ width: `${item.percentage}%` }}
                                ></div>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
};

export default Reports;
