import { supabase } from '@/integrations/supabase/client';
import { Question } from '@/data/business';

export const fetchQuestionsFromDatabase = async (): Promise<Question[]> => {
  try {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .order('id');

    if (error) {
      throw new Error(`Failed to fetch questions: ${error.message}`);
    }

    // Convert database format to our Question interface
    return data.map(row => ({
      id: row.id,
      text: row.text,
      category: row.category as 'skills' | 'preferences' | 'readiness' | 'motivation',
      weights: (row.business_weights as Record<string, number>) || {}
    }));
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
};

export const getRandomQuestions = (questions: Question[], count: number = 50): Question[] => {
  if (questions.length <= count) {
    return questions;
  }

  // สุ่มคำถามจากแต่ละหมวดหมู่ให้เท่าๆ กัน
  const categories = ['skills', 'preferences', 'readiness', 'motivation'] as const;
  const questionsPerCategory = Math.floor(count / categories.length);
  const extraQuestions = count % categories.length;
  
  const selectedQuestions: Question[] = [];
  
  categories.forEach((category, index) => {
    const categoryQuestions = questions.filter(q => q.category === category);
    const numToSelect = questionsPerCategory + (index < extraQuestions ? 1 : 0);
    
    if (categoryQuestions.length > 0) {
      const shuffled = [...categoryQuestions].sort(() => 0.5 - Math.random());
      selectedQuestions.push(...shuffled.slice(0, Math.min(numToSelect, categoryQuestions.length)));
    }
  });
  
  // สุ่มลำดับของคำถามที่เลือกแล้ว
  return selectedQuestions.sort(() => 0.5 - Math.random());
};