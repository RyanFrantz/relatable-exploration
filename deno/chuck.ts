import { serve } from 'https://deno.land/std@0.155.0/http/server.ts'

const handles = [
  {
    'pk': 'user|Chuck Norris',
    'sk': 'canonical|Chuck Norris',
    'handleType': 'canonical',
    'employmentStatus': 'contractor',
    'notes': 'Actually, works for no one.',
    'createdAt': '2023-01-12T15:45:09Z'
  },
  {
    'pk': 'user|Chuck Norris',
    'sk': 'github|WhatDiffDoesItMake',
    'handleType': 'github',
    'createdAt': '2023-01-15T14:29:03Z'
  },
  {
    'pk': 'user|Chuck Norris',
    'sk': 'twitter|CharlesInCharge',
    'handleType': 'twitter',
    'createdAt': '2023-01-15T14:29:03Z'
  },
  {
    'pk': 'user|Chuck Norris',
    'sk': 'mastodon|chuck@not.social',
    'handleType': 'mastodon',
    'createdAt': '2023-01-15T14:29:03Z'
  },
];

serve(async (req) => {
  return new Response(JSON.stringify({ handles }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  });
});
