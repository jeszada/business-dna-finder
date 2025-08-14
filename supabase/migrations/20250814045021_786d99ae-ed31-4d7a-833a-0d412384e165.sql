-- Create table for storing assessment results
CREATE TABLE public.assessment_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL DEFAULT gen_random_uuid(),
  top_business_types JSONB NOT NULL, -- Array of top 3 business types with scores
  category_scores JSONB NOT NULL, -- Scores for each category (skills, preferences, readiness, motivation)
  all_business_scores JSONB NOT NULL, -- Complete scores for all business types
  answers JSONB NOT NULL, -- User's answers to questions
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (for dashboard statistics)
CREATE POLICY "Public can read assessment results for statistics" 
ON public.assessment_results 
FOR SELECT 
USING (true);

-- Create policy for public insert (users can submit results)
CREATE POLICY "Anyone can insert assessment results" 
ON public.assessment_results 
FOR INSERT 
WITH CHECK (true);

-- Create function to update timestamps
CREATE TRIGGER update_assessment_results_updated_at
BEFORE UPDATE ON public.assessment_results
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- Create indexes for better performance
CREATE INDEX idx_assessment_results_created_at ON public.assessment_results(created_at);
CREATE INDEX idx_assessment_results_session_id ON public.assessment_results(session_id);