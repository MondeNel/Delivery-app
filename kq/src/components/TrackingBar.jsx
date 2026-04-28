import { useOrder } from '../context/OrderContext'

export default function TrackingBar() {
  const { order } = useOrder()
  if (!order) return null

  const steps = [
    { label: 'Received', done: order.status === 'received' || order.status === 'preparing' || order.status === 'out' },
    { label: 'Preparing', done: order.status === 'preparing' || order.status === 'out' },
    { label: 'Out for delivery', done: order.status === 'out' }
  ]

  return (
    <div className="mx-4 mt-3 mb-4 bg-white border border-border-light rounded-lg p-4">
      <div className="text-xs text-text-tertiary font-medium uppercase tracking-wide mb-3">Live order tracking — #{order.id}</div>
      <div className="flex items-center">
        {steps.map((step, i) => (
          <div key={i} className="flex-1 flex flex-col items-center">
            <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs mb-1
              ${step.done ? 'bg-gold border-gold text-white' : 'bg-white border-border-light text-text-tertiary'}`}>
              {step.done ? '✓' : i+1}
            </div>
            {i < steps.length - 1 && (
              <div className={`h-0.5 w-full mb-4 ${step.done ? 'bg-gold' : 'bg-border-light'}`}></div>
            )}
            <div className={`text-[10px] ${step.done ? 'text-gold font-medium' : 'text-text-tertiary'}`}>
              {step.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}