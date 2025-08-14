-- Fix the function search path security issue
CREATE OR REPLACE FUNCTION public.get_assessment_statistics()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    result jsonb;
    total_count integer;
    business_stats jsonb;
BEGIN
    -- Get total count
    SELECT COUNT(*) INTO total_count FROM assessment_results;
    
    -- Get business type statistics (aggregated data only)
    WITH business_counts AS (
        SELECT 
            (top_business_types->>0) as business_type,
            COUNT(*) as count
        FROM assessment_results
        WHERE top_business_types IS NOT NULL 
        AND jsonb_array_length(top_business_types) > 0
        GROUP BY (top_business_types->>0)
    ),
    business_with_percentage AS (
        SELECT 
            business_type,
            count,
            ROUND((count::numeric / NULLIF(total_count, 0) * 100)::numeric, 1) as percentage
        FROM business_counts
        CROSS JOIN (SELECT total_count) t
        ORDER BY count DESC
    )
    SELECT jsonb_agg(
        jsonb_build_object(
            'businessType', business_type,
            'count', count,
            'percentage', percentage
        )
    ) INTO business_stats
    FROM business_with_percentage;
    
    -- Build final result
    result := jsonb_build_object(
        'totalAssessments', total_count,
        'businessTypeStats', COALESCE(business_stats, '[]'::jsonb)
    );
    
    RETURN result;
END;
$$;

-- Update RLS policy to only allow reading specific assessment results by session_id
DROP POLICY IF EXISTS "Users can read their own assessment results by session_id" ON public.assessment_results;

CREATE POLICY "Users can read assessment results by session_id" 
ON public.assessment_results 
FOR SELECT 
USING (
    -- Only allow reading if a specific session_id is being queried
    current_setting('request.session_id', true) IS NOT NULL
    AND session_id::text = current_setting('request.session_id', true)
);