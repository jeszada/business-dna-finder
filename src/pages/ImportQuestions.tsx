import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText } from 'lucide-react';

export default function ImportQuestions() {
  const [rawData, setRawData] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "ข้อผิดพลาด",
        description: "กรุณาเลือกไฟล์ CSV",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const text = await selectedFile.text();
      
      const { data, error } = await supabase.functions.invoke('import-questions', {
        body: { rawData: text, isCSV: true }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "สำเร็จ!",
        description: `นำเข้าคำถาม ${data.imported} ข้อเรียบร้อย`,
      });

      setSelectedFile(null);
      // Reset file input
      const fileInput = document.getElementById('csv-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
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

  const handleTextImport = async () => {
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
        body: { rawData, isCSV: false }
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
            อัปโหลดไฟล์ CSV หรือวางข้อมูลคำถามโดยตรง
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="csv" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="csv" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                อัปโหลด CSV
              </TabsTrigger>
              <TabsTrigger value="text" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                วางข้อความ
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="csv" className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  เลือกไฟล์ CSV (รูปแบบ: ธุรกิจ, หมวดหมู่, คุณลักษณะ, คำถาม)
                </label>
                <Input
                  id="csv-file"
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  disabled={isLoading}
                />
                {selectedFile && (
                  <p className="text-sm text-muted-foreground mt-2">
                    ไฟล์ที่เลือก: {selectedFile.name}
                  </p>
                )}
              </div>

              <Button 
                onClick={handleFileUpload} 
                disabled={isLoading || !selectedFile}
                className="w-full"
              >
                {isLoading ? "กำลังนำเข้า..." : "อัปโหลดและนำเข้าข้อมูล"}
              </Button>

              <div className="text-sm text-muted-foreground">
                <p>วิธีใช้:</p>
                <ol className="list-decimal list-inside mt-1 space-y-1">
                  <li>เตรียมไฟล์ CSV ที่มี 4 คอลัมน์: ธุรกิจ, หมวดหมู่, คุณลักษณะ, คำถาม</li>
                  <li>เลือกไฟล์ CSV</li>
                  <li>กดปุ่ม "อัปโหลดและนำเข้าข้อมูล"</li>
                </ol>
              </div>
            </TabsContent>

            <TabsContent value="text" className="space-y-4">
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
                  onClick={handleTextImport} 
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
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}