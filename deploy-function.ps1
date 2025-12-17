# Script para criar Edge Function no Supabase via API
# Execute este script no PowerShell

$token = "sbp_567ef105a1e9835f2e67ee7af0b41643f33f3541"
$projectRef = "omscsrdnckundmnhswbt"

$functionCode = @'
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const PIXEL_ID = "2005862116860795"
const ACCESS_TOKEN = "EAAMAmvHM3vQBQAV7Cb9y813ovS0XFOyu9Prc9iArlErJw7XFIXU6PWPQNDAbzSZAIjMZAyCHaynK8E8Eb0SO8vlZBIAUrAa3jpmToXgy4APMbSQ5o2G07mCHwoP3Q8sRNX77LPq9Wfeyu6fj67X2XZBGS388QtZC6VlXmq1vivstvhZCL9vfpCZBepSneutywZDZD"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function hashData(data) {
  const encoder = new TextEncoder()
  const dataBuffer = encoder.encode(data.toLowerCase().trim())
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    const { event_name, event_source_url, user_data = {}, custom_data = {} } = body

    const hashedUserData = {}
    if (user_data.email) hashedUserData.em = [await hashData(user_data.email)]
    if (user_data.phone) hashedUserData.ph = [await hashData(user_data.phone)]
    if (user_data.client_user_agent) hashedUserData.client_user_agent = user_data.client_user_agent
    if (user_data.fbc) hashedUserData.fbc = user_data.fbc
    if (user_data.fbp) hashedUserData.fbp = user_data.fbp

    const payload = {
      data: [{
        event_name,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        event_source_url: event_source_url || "https://predidly-bot.vercel.app",
        user_data: hashedUserData,
        custom_data
      }]
    }

    const fbResponse = await fetch(
      `https://graph.facebook.com/v18.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }
    )

    const fbResult = await fbResponse.json()
    return new Response(JSON.stringify({ success: true, event: event_name, facebook: fbResult }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 })

  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 })
  }
})
'@

$body = @{
    slug = "facebook-capi"
    name = "facebook-capi"
    verify_jwt = $false
} | ConvertTo-Json

$headers = @{
    Authorization = "Bearer $token"
    "Content-Type" = "application/json"
}

try {
    $response = Invoke-RestMethod -Uri "https://api.supabase.com/v1/projects/$projectRef/functions" -Headers $headers -Method POST -Body $body
    Write-Host "Função criada com sucesso!" -ForegroundColor Green
    Write-Host $response
} catch {
    Write-Host "Erro ao criar função:" -ForegroundColor Red
    Write-Host $_.Exception.Message
}
