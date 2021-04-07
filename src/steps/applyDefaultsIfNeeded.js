const report = (...messages) => console.log('[PR Now] [Apply Defaults if Needed]', ...messages)

async function applyDefaultsIfNeeded (workingKnowledge) {
  let { ticket, ticketTitle, ticketUrl, cwd } = workingKnowledge
  
  // Apply a default title, and ticket url if not set by this point
  if (!ticket) {
    throw new Error(`No ticket reference found (${ticket}); prnow needs a reference to create a branch name`)
  }

  if (!ticketTitle) {
    ticketTitle = ticket + ' is feature complete'
    ticketUrl = false
    report('Using default ticket title:', ticketTitle)
  }

  return Object.assign({}, workingKnowledge, {
    ticket,
    ticketTitle,
    ticketUrl,
    cwd
  })
}

module.exports = applyDefaultsIfNeeded
