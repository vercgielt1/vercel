export const internal = {
  upload: 'upload',
  ignore: 'ignore',
  destructure: 'destructure',
  manual: 'manual'
}
export const builders = {
  static: '@now/static',
  staticBuild: '@now/static-build',
  next: '@now/next',
  node: '@now/node',
  nodeServer: '@now/node-server',
  rust: '@now/rust',
  markdown: '@now/md',
  mdxDeck: '@now/mdx-deck',
  go: '@now/go',
  php: '@now/php',
  bash: '@now/bash',
  python: '@now/python'
}

export const extensions: {
  [key: string]: string[]
} = {
  '.js': [
    builders.node,
    builders.nodeServer,
    builders.static
  ],
  '.ts': [
    builders.node,
    builders.nodeServer
  ],
  '.html': [builders.static],
  '.htm': [builders.static],
  '.css': [builders.static],
  '.rs': [builders.rust],
  '.md': [builders.markdown],
  '.markdown': [builders.markdown],
  '.mdx': [builders.mdxDeck],
  '.go': [builders.go],
  '.php': [builders.php],
  '.sh': [builders.bash],
  '.py': [builders.python]
}

export const locale: {
  [key: string]: {
    single: string,
    many: string
  }
} = {
  '@now/static': {
    single: 'This is a public static file',
    many: 'These are public static files'
  },
  '@now/static-build': {
    single: 'This file needs to be built as static',
    many: 'These files need to be built as static'
  },
  '@now/next': {
    single: 'This is a Next.js project',
    many: 'This is a Next.js project'
  },
  '@now/node': {
    single: 'This is a Node.js lambda',
    many: 'Each of these are indivudual Node.js endpoints'
  },
  '@now/node-server': {
    single: 'This is Node.js app listening on a port',
    many: 'These form a Node.js app listening on a port'
  },
  '@now/mdx-deck': {
    single: 'This is an MDX Deck Slide',
    many: 'These are MDX Deck Slides'
  },
  'gatsby': {
    single: 'This is a Gatsby project',
    many: 'This is a Gatsby project'
  },
  upload: {
    single: 'This is a dependancy of my code',
    many: 'These are dependancies of my code'
  },
  ignore: {
    single: 'This is a meta file',
    many: 'These are meta files'
  },
  destructure: {
    single: 'This file is built with multiple builders',
    many: 'These files are built with multiple builders'
  },
  manual: {
    single: 'This file was not detected properly',
    many: 'These files were not detected properly'
  }
}
