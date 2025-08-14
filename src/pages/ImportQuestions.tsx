import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function ImportQuestions() {
  const [rawData, setRawData] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleImport = async () => {
    if (!rawData.trim()) {
      toast({
        title: "ข้อผิดพลาด",
        description: "กรุณาใส่ข้อมูลคำถาม",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('import-questions', {
        body: { rawData }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "สำเร็จ!",
        description: `นำเข้าคำถาม ${data.imported} ข้อเรียบร้อย`,
      });

      setRawData('');
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message || "ไม่สามารถนำเข้าข้อมูลได้",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasteTestData = () => {
    const testData = `ธุรกิจด้านการตลาดและโฆษณา	Skill	เข้าใจลูกค้า	คุณเข้าใจลูกค้าและสิ่งที่เขาต้องการแค่ไหน?
ธุรกิจด้านการตลาดและโฆษณา	Skill	เข้าใจลูกค้า	คุณสร้างข้อความที่ดึงดูดลูกค้าได้แค่ไหน?
ธุรกิจด้านการตลาดและโฆษณา	Skill	คิดสร้างสรรค์ได้	คุณคิดแคมเปญโฆษณาที่โดดเด่นได้แค่ไหน?`;
    
    setRawData(testData);
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>นำเข้าข้อมูลคำถาม</CardTitle>
          <CardDescription>
            วางข้อมูลคำถามจาก Google Sheets ลงในช่องด้านล่าง
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              ข้อมูลคำถาม (รูปแบบ: ธุรกิจ [TAB] หมวดหมู่ [TAB] คุณลักษณะ [TAB] คำถาม)
            </label>
            <Textarea
              value={rawData}
              onChange={(e) => setRawData(e.target.value)}
              placeholder="วางข้อมูลที่คัดลอกจาก Google Sheets ที่นี่..."
              className="min-h-[200px]"
            />
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleImport} 
              disabled={isLoading || !rawData.trim()}
              className="flex-1"
            >
              {isLoading ? "กำลังนำเข้า..." : "นำเข้าข้อมูล"}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handlePasteTestData}
              disabled={isLoading}
            >
              ข้อมูลทดสอบ
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>วิธีใช้:</p>
            <ol className="list-decimal list-inside mt-1 space-y-1">
              <li>คัดลอกข้อมูลจาก Google Sheets</li>
              <li>วางในช่องด้านบน</li>
              <li>กดปุ่ม "นำเข้าข้อมูล"</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}