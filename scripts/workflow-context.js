'use strict'

const fs = require('node:fs')

const FIELDS = ['objective', 'non_goals', 'risk', 'read_set', 'write_set', 'acceptance', 'evidence_required', 'resume_anchor']
const MAX_TEXT = 900
const MAX_ITEMS = 12

function fail(message) {
  console.error(`workflow-context: ${message}`)
  process.exit(1)
}

function readInput(file) {
  try {
    return JSON.parse(file === '-' ? fs.readFileSync(0, 'utf8') : fs.readFileSync(file, 'utf8'))
  } catch (error) {
    fail(`cannot read JSON input: ${error.message}`)
  }
}

function text(value, field) {
  if (typeof value !== 'string' || !value.trim()) fail(`${field} must be a non-empty string`)
  const trimmed = value.trim()
  if (trimmed.length > MAX_TEXT) fail(`${field} exceeds ${MAX_TEXT} characters; cite a path instead`)
  return trimmed
}

function list(value, field) {
  if (!Array.isArray(value) || !value.length || value.length > MAX_ITEMS || value.some((item) => typeof item !== 'string' || !item.trim())) {
    fail(`${field} must contain 1-${MAX_ITEMS} non-empty strings`)
  }
  return value.map((item) => item.trim())
}

function main() {
  const [file, role] = process.argv.slice(2)
  if (!file) fail('usage: node workflow-context.js <contract.json|-> [role]')
  const input = readInput(file)
  if (!['S', 'M', 'L'].includes(input.risk)) fail('risk must be S, M, or L')
  const packet = { role: role || 'main', risk: input.risk }
  for (const field of FIELDS) packet[field] = ['read_set', 'write_set', 'acceptance', 'evidence_required'].includes(field) ? list(input[field], field) : text(input[field], field)
  process.stdout.write(`${JSON.stringify(packet)}\n`)
}

main()
