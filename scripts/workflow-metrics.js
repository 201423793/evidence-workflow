'use strict'

const fs = require('node:fs')

const REQUIRED_NUMBERS = ['agent_count', 'spawn_count', 'rework_count']
const TOKEN_FIELDS = ['input', 'cached', 'non_cached']
const CONTEXT_FIELDS = ['static', 'tool_output', 'summary']

function fail(message) {
  console.error(`workflow-metrics: ${message}`)
  process.exit(1)
}

function numberOrNull(value, field) {
  if (value === null || value === undefined) return null
  if (!Number.isInteger(value) || value < 0) fail(`${field} must be a non-negative integer or null`)
  return value
}

function main() {
  const [file] = process.argv.slice(2)
  if (!file) fail('usage: node workflow-metrics.js <metrics.json|->')
  let input
  try {
    input = JSON.parse(file === '-' ? fs.readFileSync(0, 'utf8') : fs.readFileSync(file, 'utf8'))
  } catch (error) {
    fail(`cannot read JSON input: ${error.message}`)
  }
  if (!['S', 'M', 'L'].includes(input.risk)) fail('risk must be S, M, or L')
  if (input.task_id !== undefined && !/^T-\d{4}$/.test(input.task_id)) fail('task_id must match T-NNNN when supplied')
  for (const field of REQUIRED_NUMBERS) numberOrNull(input[field], field)

  const legacyContext = {
    static: input.static_context_chars,
    tool_output: input.tool_output_chars,
    summary: input.summary_chars
  }
  const contextInput = input.context_chars || legacyContext
  const tokenInput = input.token_usage || {}
  const token_usage = Object.fromEntries(TOKEN_FIELDS.map((field) => [field, numberOrNull(tokenInput[field], `token_usage.${field}`)]))
  const context_chars = Object.fromEntries(CONTEXT_FIELDS.map((field) => [field, numberOrNull(contextInput[field], `context_chars.${field}`)]))
  const contextValues = Object.values(context_chars)
  const proxy_chars = contextValues.every(Number.isInteger) ? contextValues.reduce((sum, value) => sum + value, 0) : null
  const unknowns = Array.isArray(input.unknowns) ? input.unknowns : []
  if (Object.values(token_usage).some((value) => value === null)) unknowns.push('精确 token 遥测不可用')
  if (proxy_chars === null) unknowns.push('上下文字符代理不可用')

  const output = {
    task_id: input.task_id || null,
    risk: input.risk,
    agent_count: input.agent_count,
    spawn_count: input.spawn_count,
    rework_count: input.rework_count,
    elapsed_ms: numberOrNull(input.elapsed_ms, 'elapsed_ms'),
    token_usage,
    context_chars,
    proxy_chars,
    context_share: proxy_chars === null ? null : context_chars.static / Math.max(proxy_chars, 1),
    quality: input.quality || 'unknown',
    independent_review: input.independent_review || 'unknown',
    verification: Array.isArray(input.verification) ? input.verification : [],
    unknowns: [...new Set(unknowns)]
  }
  process.stdout.write(`${JSON.stringify(output)}\n`)
}

main()
