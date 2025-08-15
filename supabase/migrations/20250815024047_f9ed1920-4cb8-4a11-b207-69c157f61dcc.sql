-- Fix the ambiguous column reference in get_assessment_statistics function
CREATE OR REPLACE FUNCTION public.get_assessment_statistics()
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
            (jsonb_array_elements(top_business_types)->>'business_type') as business_type,
            COUNT(*) as count
        FROM assessment_results
        WHERE top_business_types IS NOT NULL 
        AND jsonb_array_length(top_business_types) > 0
        GROUP BY (jsonb_array_elements(top_business_types)->>'business_type')
    ),
    business_with_percentage AS (
        SELECT 
            business_type,
            count,
            ROUND((count::numeric / NULLIF(total_count, 0) * 100)::numeric, 1) as percentage
        FROM business_counts,
        (SELECT COUNT(*) as total_count FROM assessment_results) tc
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
$function$