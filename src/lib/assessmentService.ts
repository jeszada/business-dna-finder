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
    const { error } = await supabase
      .from('assessment_results')
      .insert([result]);

    if (error) {
      console.error('Error saving assessment result:', error);
      throw error;
    }
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
    const { data, error } = await supabase
      .from('assessment_results')
      .select('all_business_scores');

    if (error) {
      console.error('Error fetching assessment statistics:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      return {
        totalAssessments: 0,
        businessTypeStats: []
      };
    }

    // Count total assessments
    const totalAssessments = data.length;

    // Aggregate business type counts
    const businessTypeCounts: Record<string, number> = {};
    
    data.forEach(result => {
      const scores = result.all_business_scores as Record<BusinessType, number>;
      // Find the highest scoring business type for this assessment
      const topBusinessType = Object.entries(scores)
        .sort(([,a], [,b]) => b - a)[0]?.[0];
      
      if (topBusinessType) {
        businessTypeCounts[topBusinessType] = (businessTypeCounts[topBusinessType] || 0) + 1;
      }
    });

    // Convert to array with percentages
    const businessTypeStats = Object.entries(businessTypeCounts)
      .map(([businessType, count]) => ({
        businessType: businessType as BusinessType,
        count,
        percentage: Math.round((count / totalAssessments) * 100)
      }))
      .sort((a, b) => b.count - a.count);

    return {
      totalAssessments,
      businessTypeStats
    };
  } catch (error) {
    console.error('Failed to get assessment statistics:', error);
    return {
      totalAssessments: 0,
      businessTypeStats: []
    };
  }
}