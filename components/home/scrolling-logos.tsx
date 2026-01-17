export function ScrollingLogos() {
  const stats = [
    "Stop Staring at Your Closet",
    "Actually Know What to Wear",
    "Your Style, Your Vibe",
    "No Subscription, Just Style",
    "Built for Real People",
    "Weather Check Included",
    "Mix and Match Like a Pro",
    "Dress Confidently Every Day"
  ]
  const duplicatedItems = [...stats, ...stats]
  return (
    <div className="w-full py-8 overflow-hidden bg-[#1C1C1C]">
      <div className="flex animate-scroll whitespace-nowrap">
        {duplicatedItems.map((item, index) => (
          <div
            key={index}
            className="inline-flex items-center justify-center mx-16 text-xl font-bold text-gray-200"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}

