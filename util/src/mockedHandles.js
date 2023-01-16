// Initial creation date for canonical users.
// We'll mock the create date for all subsequent handles, for added realness.
const initialCreateDate = '2021-06-13T13:03:07Z';
const handles = [
  // Clyde Jerger
  {
    'pk': 'user|Clyde Jerger',
    'sk': 'canonical|Clyde Jerger',
    'handleType': 'canonical',
    'employmentStatus': 'fulltime',
    'createdAt': initialCreateDate
  },
  {
    'pk': 'user|Clyde Jerger',
    'sk': 'github|Zontrax',
    'handleType': 'github',
    'createdAt': '2021-11-01T11:13:03Z'
  },
  {
    'pk': 'user|Clyde Jerger',
    'sk': 'googleworkspace|cjerger@veryrelatable.com',
    'handleType': 'googleworkspace',
    'createdAt': '2021-11-01T11:13:03Z'
  },
  // Ronna Evason
  {
    'pk': 'user|Ronna Evason',
    'sk': 'canonical|Ronna Evason',
    'handleType': 'canonical',
    'employmentStatus': 'fulltime',
    'createdAt': initialCreateDate
  },
  {
    'pk': 'user|Ronna Evason',
    'sk': 'github|RonnaEvason',
  'handleType': 'github',
    'createdAt': '2021-08-20T03:58:12Z'
  },
  {
    'pk': 'user|Ronna Evason',
    'sk': 'googleworkspace|revason@veryrelatable.com',
  'handleType': 'googleworkspace',
    'createdAt': '2021-08-20T03:58:12Z'
  },
  // Neville Scafe
  {
    'pk': 'user|Neville Scafe',
    'sk': 'canonical|Neville Scafe',
    'handleType': 'canonical',
    'employmentStatus': 'fulltime',
    'createdAt': initialCreateDate
  },
  {
    'pk': 'user|Neville Scafe',
    'sk': 'github|nscafe2',
    'handleType': 'github',
    'createdAt': '2022-02-11T16:35:01Z'
  },
  {
    'pk': 'user|Neville Scafe',
    'sk': 'googleworkspace|nscafe@veryrelatable.com',
    'handleType': 'googleworkspace',
    'createdAt': '2022-02-11T16:35:01Z'
  },
  // Jim Tomkiss
  {
    'pk': 'user|Jim Tomkiss',
    'sk': 'canonical|Jim Tomkiss',
    'handleType': 'canonical',
    'employmentStatus': 'terminated',
    'createdAt': initialCreateDate
  },
  {
    'pk': 'user|Jim Tomkiss',
    'sk': 'github|Veribet',
    'handleType': 'github',
    'createdAt': '2022-03-05T03:45:27Z'
  },
  {
    'pk': 'user|Jim Tomkiss',
    'sk': 'googleworkspace|jtomkiss@veryrelatable.com',
    'handleType': 'googleworkspace',
    'createdAt': '2022-03-05T03:45:27Z'
  },
  // Doretta Croster
  {
    'pk': 'user|Doretta Croster',
    'sk': 'canonical|Doretta Croster',
    'handleType': 'canonical',
    'employmentStatus': 'fulltime',
    'createdAt': initialCreateDate
  },
  {
    'pk': 'user|Doretta Croster',
    'sk': 'github|Trippledex',
    'handleType': 'github',
    'createdAt': '2022-12-01T14:50:51Z'
  },
  {
    'pk': 'user|Doretta Croster',
    'sk': 'googleworkspace|dcroster@veryrelable.com',
    'handleType': 'googleworkspace',
    'createdAt': '2022-12-01T14:50:51Z'
  },
  // Thibaud Reedman
  {
    'pk': 'user|Thibaud Reedman',
    'sk': 'canonical|Thibaud Reedman',
    'handleType': 'canonical',
    'employmentStatus': 'fulltime',
    'createdAt': initialCreateDate
  },
  {
    'pk': 'user|Thibaud Reedman',
    'sk': 'github|baudrate',
    'handleType': 'github',
    'createdAt': '2021-12-24T01:28:32Z'
  },
  {
    'pk': 'user|Thibaud Reedman',
    'sk': 'googleworkspace|treedman@veryrelatable.com',
    'handleType': 'googleworkspace',
    'createdAt': '2021-12-24T01:28:32Z'
  },
  {
    'pk': 'user|Chuck Norris',
    'sk': 'canonical|Chuck Norris',
    'handleType': 'canonical',
    'employmentStatus': 'contractor',
    'createdAt': '2023-01-12T15:45:09Z'
  },
  {
    'pk': 'user|Chuck Norris',
    'sk': 'github|WhatDiffDoesItMake',
    'createdAt': '2023-01-15T14:29:03Z'
  },
  {
    'pk': 'user|Chuck Norris',
    'sk': 'twitter|CharlesInCharge',
    'createdAt': '2023-01-15T14:29:03Z'
  },
  {
    'pk': 'user|Chuck Norris',
    'sk': 'mastodon|chuck@not.social',
    'createdAt': '2023-01-15T14:29:03Z'
  },
];

export { handles };
