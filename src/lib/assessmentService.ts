import { supabase } from "@/integrations/supabase/client";
import { BusinessType, Category } from "@/data/business";

export interface AssessmentResult {
  id?: string;
  session_id?: string;
  top_business_types: Array<{ business_type: BusinessType; score: number }>;
  category_scores: Record<Category, number>;
  all_business_scores: Record<BusinessType, number>;
  answers: Record<string, number>;
  created_at?: string;
}

export async function saveAssessmentResult(result: Omit<AssessmentResult, 'id' | 'created_at'>): Promise<void> {
  try {
    // ตรวจสอบว่ามีการบันทึกของ session นี้แล้วหรือยัง
    const { data: existingResult, error: checkError } = await supabase
      .from('assessment_results')
      .select('id')
      .eq('session_id', result.session_id)
      .maybeSingle();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing result:', checkError);
      throw checkError;
    }

    // ถ้ามีข้อมูลแล้ว ไม่ต้องบันทึกซ้ำ
    if (existingResult) {
      console.log('Assessment result already exists for this session, skipping save');
      return;
    }

    const { error } = await supabase
      .from('assessment_results')
      .insert([result]);

    if (error) {
      console.error('Error saving assessment result:', error);
      throw error;
    }

    console.log('Assessment result saved successfully for session:', result.session_id);
  } catch (error) {
    console.error('Failed to save assessment result:', error);
    throw error;
  }
}

export async function getAssessmentStatistics(): Promise<{
  totalAssessments: number;
  businessTypeStats: Array<{ businessType: BusinessType; count: number; percentage: number }>;
}> {
  try {
    // Use the secure database function to get aggregated statistics
    const { data, error } = await supabase
      .rpc('get_assessment_statistics');

    if (error) {
      console.error('Error fetching assessment statistics:', error);
      throw error;
    }

    // Type assertion for the returned data
    const result = data as {
      totalAssessments: number;
      businessTypeStats: Array<{ businessType: BusinessType; count: number; percentage: number }>;
    };

    return {
      totalAssessments: result.totalAssessments || 0,
      businessTypeStats: result.businessTypeStats || []
    };
  } catch (error) {
    console.error('Failed to fetch assessment statistics:', error);
    // Return empty data as fallback
    return {
      totalAssessments: 0,
      businessTypeStats: []
    };
  }
}

export async function getAssessmentResultBySessionId(sessionId: string): Promise<AssessmentResult | null> {
  try {
    const { data, error } = await supabase
      .from('assessment_results')
      .select('*')
      .eq('session_id', sessionId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows found
        return null;
      }
      console.error('Error fetching assessment result:', error);
      throw error;
    }

    // Type assertion and transformation for the returned data
    return {
      id: data.id,
      session_id: data.session_id,
      top_business_types: data.top_business_types as Array<{ business_type: BusinessType; score: number }>,
      category_scores: data.category_scores as Record<Category, number>,
      all_business_scores: data.all_business_scores as Record<BusinessType, number>,
      answers: data.answers as Record<string, number>,
      created_at: data.created_at
    };
  } catch (error) {
    console.error('Failed to fetch assessment result:', error);
    return null;
  }
}
