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
}

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

    const { rawData } = await req.json()
    
    if (!rawData || typeof rawData !== 'string') {
      throw new Error('rawData must be a string containing the question data')
    }

    // Parse the text data into structured format
    const lines = rawData.trim().split('\n')
    const questions: any[] = []
    
    let questionIndex = 0
    for (const line of lines) {
      const parts = line.split('\t')
      if (parts.length !== 4) continue
      
      const [business, domains, keyAttributes, reviseQuestion] = parts
      
      // Skip if any field is empty
      if (!business || !domains || !reviseQuestion) continue
      
      const standardBusiness = standardizeBusinessName(business.trim())
      const category = domainMapping[domains.trim()]
      
      if (!category) {
        console.warn(`Unknown domain: ${domains}`)
        continue
      }
      
      // Create business weights - give 1.0 to the matching business
      const businessWeights: Record<string, number> = {}
      businessWeights[standardBusiness] = 1.0
      
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