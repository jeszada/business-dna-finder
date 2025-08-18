
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
      case 1: return "bg-gradient-to-br from-primary/20 to-primary/10 border-primary/40 shadow-lg";
      case 2: return "bg-gradient-to-br from-primary/15 to-primary/8 border-primary/30 shadow-md";
      case 3: return "bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 shadow-sm";
      default: return "bg-card hover:bg-muted/50 transition-colors";
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

          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">อันดับธุรกิจที่ได้รับความนิยม</h2>
            <p className="text-muted-foreground mb-6">เรียงตามจำนวนผู้เลือกธุรกิจแต่ละประเภท</p>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {businessStatsWithPercentage.map((item, index) => {
                const rank = index + 1;
                const IconComponent = getRankIcon(rank);
                
                return (
                  <Card 
                    key={item.businessType} 
                    className={`${getRankStyle(rank)} transition-all duration-200 hover:scale-105`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${rank <= 3 ? 'bg-primary/10' : 'bg-muted'}`}>
                            {IconComponent ? (
                              <IconComponent className={`h-4 w-4 ${rank <= 3 ? 'text-primary' : 'text-muted-foreground'}`} />
                            ) : (
                              <span className="text-sm font-bold text-muted-foreground">{rank}</span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">
                            {item.percentage}%
                          </div>
                        </div>
                      </div>
                      
                      <h3 className={`text-lg font-semibold mb-2 ${getRankTextStyle(rank)}`}>
                        {item.businessType}
                      </h3>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>จำนวนคน</span>
                        <span className="font-semibold">{item.count.toLocaleString()}</span>
                      </div>
                      
                      <div className="mt-3">
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-500" 
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Reports;
