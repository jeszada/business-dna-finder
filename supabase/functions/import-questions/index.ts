import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ImportData {
  Business: string;
  Domains: string;
  "Key Attributes": string;
  "Revise Question": string;
}

// Mapping from CSV domains to our category system
const domainMapping: Record<string, string> = {
  'Skill': 'skills',
  'Interest': 'preferences', 
  'Readiness': 'readiness',
  'Motivation': 'motivation'
}

// Mapping from Thai business names to our standardized names
const businessMapping: Record<string, string> = {
  'ธุรกิจด้านการตลาดและโฆษณา': 'ธุรกิจการตลาดและโฆษณา',
  'ธุรกิจซื้อขายสินค้า': 'ธุรกิจการค้า',
  'ธุรกิจสุขภาพ / ความงาม': 'ธุรกิจสุขภาพ/ความงาม',
  'ธุรกิจเกษตรกรรม': 'ธุรกิจการเกษตร',
  // Keep exact matches as they are
  'ธุรกิจบริการ': 'ธุรกิจบริการ',
  'ธุรกิจอาหารและเครื่องดื่ม': 'ธุรกิจอาหารและเครื่องดื่ม',
  'ธุรกิจการเงินและการลงทุน': 'ธุรกิจการเงินและการลงทุน',
  'ธุรกิจเทคโนโลยีและนวัตกรรม': 'ธุรกิจเทคโนโลยีและนวัตกรรม',
  'ธุรกิจโลจิสติกส์และซัพพลายเชน': 'ธุรกิจโลจิสติกส์และซัพพลายเชน',
  'ธุรกิจการตลาดและโฆษณา': 'ธุรกิจการตลาดและโฆษณา',
  'ธุรกิจสิ่งแวดล้อม': 'ธุรกิจสิ่งแวดล้อม',
  'ธุรกิจระหว่างประเทศ': 'ธุรกิจระหว่างประเทศ',
  'ธุรกิจสร้างสรรค์และสื่อ': 'ธุรกิจสร้างสรรค์และสื่อ',
  'ธุรกิจท่องเที่ยว': 'ธุรกิจท่องเที่ยว',
  'ธุรกิจเพื่อสังคม': 'ธุรกิจเพื่อสังคม',
}

// Cross-business relationships for more realistic weights
const getWeightsForBusiness = (primaryBusiness: string, keyAttributes: string): Record<string, number> => {
  const weights: Record<string, number> = {};
  
  // Primary business gets full weight
  weights[primaryBusiness] = 1.0;
  
  // Add related business weights based on key attributes and common patterns
  const attr = keyAttributes.toLowerCase();
  
  switch (primaryBusiness) {
    case 'ธุรกิจการตลาดและโฆษณา':
      if (attr.includes('คิดสร้างสรรค์') || attr.includes('เนื้อหา')) {
        weights['ธุรกิจสร้างสรรค์และสื่อ'] = 0.7;
      }
      if (attr.includes('เข้าใจลูกค้า') || attr.includes('คุยกับลูกค้า')) {
        weights['ธุรกิจบริการ'] = 0.5;
      }
      if (attr.includes('วิเคราะห์')) {
        weights['ธุรกิจเทคโนโลยีและนวัตกรรม'] = 0.4;
      }
      break;
      
    case 'ธุรกิจบริการ':
      if (attr.includes('ดูแลลูกค้า') || attr.includes('คุยและเข้าสังคม')) {
        weights['ธุรกิจการตลาดและโฆษณา'] = 0.5;
        weights['ธุรกิจท่องเที่ยว'] = 0.6;
      }
      if (attr.includes('สุขภาพ') || attr.includes('ความงาม')) {
        weights['ธุรกิจสุขภาพ/ความงาม'] = 0.7;
      }
      break;
      
    case 'ธุรกิจการค้า':
      if (attr.includes('จัดการสต็อก') || attr.includes('ซัพพลาย')) {
        weights['ธุรกิจโลจิสติกส์และซัพพลายเชน'] = 0.6;
      }
      if (attr.includes('วิเคราะห์ตลาด') || attr.includes('เจรจา')) {
        weights['ธุรกิจการตลาดและโฆษณา'] = 0.5;
      }
      if (attr.includes('ต่างประเทศ')) {
        weights['ธุรกิจระหว่างประเทศ'] = 0.8;
      }
      break;
      
    case 'ธุรกิจเทคโนโลยีและนวัตกรรม':
      if (attr.includes('วิเคราะห์') || attr.includes('ข้อมูล')) {
        weights['ธุรกิจการเงินและการลงทุน'] = 0.5;
      }
      if (attr.includes('การตลาด')) {
        weights['ธุรกิจการตลาดและโฆษณา'] = 0.4;
      }
      break;
      
    case 'ธุรกิจการเงินและการลงทุน':
      if (attr.includes('วิเคราะห์') || attr.includes('ข้อมูล')) {
        weights['ธุรกิจเทคโนโลยีและนวัตกรรม'] = 0.5;
      }
      break;
      
    case 'ธุรกิจสร้างสรรค์และสื่อ':
      if (attr.includes('การตลาด') || attr.includes('เล่าเรื่อง')) {
        weights['ธุรกิจการตลาดและโฆษณา'] = 0.7;
      }
      break;
      
    case 'ธุรกิจโลจิสติกส์และซัพพลายเชน':
      if (attr.includes('จัดการ') || attr.includes('วางแผน')) {
        weights['ธุรกิจการค้า'] = 0.6;
      }
      if (attr.includes('เทคโนโลยี')) {
        weights['ธุรกิจเทคโนโลยีและนวัตกรรม'] = 0.4;
      }
      break;
  }
  
  return weights;
};

function standardizeBusinessName(business: string): string {
  return businessMapping[business] || business;
}

function generateQuestionId(index: number): string {
  return `q${(index + 1).toString().padStart(3, '0')}`;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client with service role key
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!serviceKey) {
      throw new Error('SUPABASE_SERVICE_ROLE_KEY is required')
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabase = createClient(supabaseUrl, serviceKey)

    const { rawData, isCSV = false } = await req.json()
    
    if (!rawData || typeof rawData !== 'string') {
      throw new Error('rawData must be a string containing the question data')
    }

    // Parse the text data into structured format
    const lines = rawData.trim().split('\n').filter(line => line.trim())
    const questions: any[] = []
    
    let questionIndex = 0
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      
      // Skip header row for CSV
      if (isCSV && i === 0 && (line.includes('Business') || line.includes('ธุรกิจ'))) {
        console.log('Skipping header row:', line)
        continue;
      }
      
      // Split by comma for CSV, tab for TSV
      let parts: string[]
      if (isCSV) {
        // Handle CSV with proper quote parsing
        parts = line.split(',').map(p => p.trim().replace(/^["']|["']$/g, ''))
      } else {
        parts = line.split('\t')
      }
      
      console.log(`Processing line ${i}: parts count = ${parts.length}`, parts)
      
      if (parts.length !== 4) {
        console.log(`Skipping line ${i}: wrong number of parts (${parts.length})`)
        continue
      }
      
      const [business, domains, keyAttributes, reviseQuestion] = parts
      
      // Skip if any field is empty
      if (!business || !domains || !reviseQuestion) continue
      
      const standardBusiness = standardizeBusinessName(business.trim())
      const category = domainMapping[domains.trim()]
      
      if (!category) {
        console.warn(`Unknown domain: ${domains}`)
        continue
      }
      
      // Create realistic business weights using key attributes
      const businessWeights = getWeightsForBusiness(standardBusiness, keyAttributes.trim());
      
      const question = {
        id: generateQuestionId(questionIndex),
        text: reviseQuestion.trim(),
        category: category,
        business_weights: businessWeights
      }
      
      questions.push(question)
      questionIndex++
    }

    console.log(`Processed ${questions.length} questions`)
    
    // Clear existing questions first
    const { error: deleteError } = await supabase
      .from('questions')
      .delete()
      .neq('id', 'impossible-id') // Delete all records
    
    if (deleteError) {
      throw new Error(`Failed to clear existing questions: ${deleteError.message}`)
    }

    // Insert new questions in batches
    const batchSize = 100
    for (let i = 0; i < questions.length; i += batchSize) {
      const batch = questions.slice(i, i + batchSize)
      
      const { error: insertError } = await supabase
        .from('questions')
        .insert(batch)
      
      if (insertError) {
        throw new Error(`Failed to insert batch ${i}-${i + batchSize}: ${insertError.message}`)
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully imported ${questions.length} questions`,
        imported: questions.length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Import error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
