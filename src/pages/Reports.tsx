
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Users, TrendingUp } from 'lucide-react';
import SEO from '@/components/SEO';

const Reports = () => {
  const navigate = useNavigate();

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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  จำนวนผู้ทำแบบประเมิน
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
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
                <div className="text-2xl font-bold">การตลาด</div>
                <p className="text-xs text-muted-foreground">
                  35% ของผู้ทำแบบประเมิน
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

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>ข้อมูลรายละเอียด</CardTitle>
              <CardDescription>
                รายงานสถิติจะพัฒนาเพิ่มเติมในอนาคต
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                ขณะนี้กำลังพัฒนาระบบรายงานสถิติที่ครบถ้วน จะแสดงข้อมูลการใช้งาน 
                ผลการประเมิน และแนวโน้มธุรกิจที่ได้รับความสนใจ
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
};

export default Reports;
