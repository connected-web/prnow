const report = (...messages) => console.log('[PR Now] [Create Title from Arguments]', ...messages)

async function createTitleFromArguments ({ ticket, args, cwd }) {
  args = args || []

  let ticketTitle

  const words = [ticket].concat(args).join(' ').split(/\s+/)
    .filter(n => n)
    .filter(n => n !== '-m')

  if (words.length === 1) {
    ticket = words[0]
  } else {
    ticket = words[0]
    ticketTitle = words.join(' ')
    report('Using:', `"${ticket}"`, 'as the ticket reference, and', `"${ticketTitle}"`, 'as the title')
  }

  return {
    ticket,
    ticketTitle,
    cwd
  }
}

module.exports = createTitleFromArguments
