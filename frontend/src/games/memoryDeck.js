export function buildDeck(kalimas) {
  return kalimas.flatMap((item) =>
    ['a', 'b'].map((side) => ({
      key: `${item.id}-${side}`,
      pairId: item.id,
      title: item.title,
    })),
  )
}

export function shuffleDeck(deck, random = Math.random) {
  const next = [...deck]
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1))
    const current = next[index]
    next[index] = next[swapIndex]
    next[swapIndex] = current
  }
  return next
}
