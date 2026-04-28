import { useState, useEffect } from 'react'
import { useOrder } from '../context/OrderContext'
import { FiCheckCircle, FiClock, FiTruck } from 'react-icons/fi'

const STAGES = [
  { key: 'received', label: 'Order Received', icon: FiCheckCircle },
  { key: 'preparing', label: 'Preparing', icon: FiClock },
  { key: 'out', label: 'Out for Delivery', icon: FiTruck },
]

export default function TrackingBar() {
  const { order } = useOrder()
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    if (!order || order.status === 'out') return
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [order])

  if (!order) return null

  const elapsed = now - order.time
  const currentStage = order.status

  // Determine expected arrival time (simulated)
  const expectedArrival = currentStage === 'out' ? '~10 min' : '~15 min'

  // Countdown for the next stage
  const getCountdown = (stageKey) => {
    if (currentStage === stageKey || currentStage === 'out') return null
    const durations = { received: 3000, preparing: 7000 }
    const remaining = durations[currentStage] ? durations[currentStage] - elapsed : 0
    if (remaining <= 0) return null
    const sec = Math.ceil(remaining / 1000)
    return sec < 60 ? `${sec}s` : `${Math.floor(sec / 60)}m ${sec % 60}s`
  }

  return (
    <div className="mx-4 mt-3 mb-4 bg-white border border-border-light rounded-lg p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div>
          <div className="text-xs text-text-tertiary font-medium uppercase tracking-wide">
            Live order tracking — #{order.id}
          </div>
          <div className="text-[10px] text-text-tertiary">
            Expected arrival: {expectedArrival}
          </div>
        </div>
        <span className="text-[10px] text-gold font-medium bg-gold-light px-2 py-0.5 rounded-full">
          {currentStage === 'out' ? 'On the way!' : 'Preparing'}
        </span>
      </div>

      {/* Vertical timeline */}
      <div className="space-y-0">
        {STAGES.map((stage, i) => {
          const Icon = stage.icon
          const isCompleted = STAGES.findIndex(s => s.key === currentStage) >= i
          const isCurrent = STAGES.findIndex(s => s.key === currentStage) === i
          const countdown = isCurrent ? getCountdown(stage.key) : null

          return (
            <div key={stage.key} className="flex gap-3">
              {/* Dot & line */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    isCompleted
                      ? 'bg-gold border-gold text-white'
                      : 'bg-white border-border-light text-text-tertiary'
                  }`}
                >
                  {isCompleted ? <Icon size={14} /> : <span className="text-xs">{i + 1}</span>}
                </div>
                {i < STAGES.length - 1 && (
                  <div
                    className={`w-0.5 flex-1 min-h-[24px] my-1 ${
                      isCompleted && i < STAGES.findIndex(s => s.key === currentStage)
                        ? 'bg-gold'
                        : 'bg-border-light'
                    }`}
                  />
                )}
              </div>

              {/* Label & countdown */}
              <div className="flex flex-col justify-center pb-4">
                <span
                  className={`text-xs font-medium ${
                    isCompleted ? 'text-gold' : 'text-text-tertiary'
                  }`}
                >
                  {stage.label}
                </span>
                {countdown && (
                  <span className="text-[10px] text-text-tertiary">in {countdown}</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}