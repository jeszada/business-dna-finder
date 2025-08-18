
-- Create a database function to get assessment statistics
CREATE OR REPLACE FUNCTION get_assessment_statistics()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    total_count integer := 0;
    business_stats json;
BEGIN
    -- Get total number of assessments
    SELECT COUNT(*) INTO total_count FROM assessment_results;
    
    -- Get business type statistics
    WITH business_counts AS (
        SELECT 
            (jsonb_array_elements(top_business_types)->>'business_type')::text as business_type,
            COUNT(*) as count
        FROM assessment_results
        WHERE jsonb_array_length(top_business_types) > 0
        GROUP BY (jsonb_array_elements(top_business_types)->>'business_type')::text
    ),
    all_business_types AS (
        SELECT unnest(ARRAY[
            'ธุรกิจบริการ',
            'ธุรกิจการค้า', 
            'ธุรกิจอาหารและเครื่องดื่ม',
            'ธุรกิจการเงินและการลงทุน',
            'ธุรกิจเทคโนโลยีและนวัตกรรม',
            'ธุรกิจโลจิสติกส์และซัพพลายเชน',
            'ธุรกิจการตลาดและโฆษณา',
            'ธุรกิจสิ่งแวดล้อม',
            'ธุรกิจสุขภาพ/ความงาม',
            'ธุรกิจระหว่างประเทศ',
            'ธุรกิจสร้างสรรค์และสื่อ',
            'ธุรกิจการเกษตร',
            'ธุรกิจท่องเที่ยว',
            'ธุรกิจเพื่อสังคม'
        ]) as business_type
    )
    SELECT json_agg(
        json_build_object(
            'businessType', abt.business_type,
            'count', COALESCE(bc.count, 0),
            'percentage', CASE 
                WHEN total_count > 0 THEN ROUND((COALESCE(bc.count, 0)::numeric / total_count::numeric) * 100, 1)
                ELSE 0 
            END
        )
    ) INTO business_stats
    FROM all_business_types abt
    LEFT JOIN business_counts bc ON abt.business_type = bc.business_type;
    
    -- Return the result
    RETURN json_build_object(
        'totalAssessments', total_count,
        'businessTypeStats', COALESCE(business_stats, '[]'::json)
    );
END;
$$;
